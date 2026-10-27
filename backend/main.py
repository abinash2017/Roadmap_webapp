"""
AI Roadmap — FastAPI Backend
Serves the web app and provides REST API for all persistence.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime, timezone
from contextlib import asynccontextmanager
import os
import uvicorn
from database import get_db, test_connection

# ── App Setup ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown."""
    # Startup
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'notes_history')
                BEGIN
                    CREATE TABLE notes_history (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        month_id INT NOT NULL,
                        content NVARCHAR(MAX) NOT NULL DEFAULT '',
                        saved_at DATETIME2 NOT NULL DEFAULT GETDATE()
                    );
                    CREATE INDEX IX_notes_history_month ON notes_history (month_id, saved_at DESC);
                END
            """)
            _ensure_todo_completed_at(cursor)
            _run_phase2_migration(cursor)
            print("\u2705 Database tables verified")
    except Exception as e:
        print(f"\u26a0\ufe0f Could not verify tables: {e}")
    
    yield
    
    # Shutdown (add cleanup code here if needed)

app = FastAPI(title="AI Roadmap API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.endswith((".js", ".css", ".html")) or request.url.path == "/":
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Serve frontend files from parent directory
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..")
FAVICON_PATH = os.path.join(STATIC_DIR, "favicon.svg")


# ── Pydantic Models ───────────────────────────────────────

class ChecklistToggle(BaseModel):
    checked: bool


class NotesUpdate(BaseModel):
    content: str


class LeetcodeUpdate(BaseModel):
    count: int


class SettingUpdate(BaseModel):
    value: str


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    target_role: Optional[str] = None
    start_date: Optional[str] = None          # YYYY-MM-DD
    target_end_date: Optional[str] = None     # YYYY-MM-DD or empty
    hours_per_day: Optional[float] = None
    days_per_week: Optional[int] = None
    leetcode_target: Optional[int] = None
    daily_reminder_time: Optional[str] = None  # HH:MM
    show_difficulty: Optional[bool] = None
    show_streak: Optional[bool] = None
    auto_expand_week: Optional[bool] = None
    compact_mode: Optional[bool] = None
    roadmap_variant: Optional[str] = None      # 'ai_llm' | 'ai_fullstack'


class ProfileCreate(BaseModel):
    display_name: str
    target_role: Optional[str] = None
    start_date: Optional[str] = None
    target_end_date: Optional[str] = None
    hours_per_day: Optional[float] = None
    days_per_week: Optional[int] = None
    leetcode_target: Optional[int] = None
    daily_reminder_time: Optional[str] = None
    roadmap_variant: Optional[str] = "ai_llm"


class MilestoneCreate(BaseModel):
    title: str
    target_date: Optional[str] = None  # YYYY-MM-DD or empty


class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    target_date: Optional[str] = None
    completed: Optional[bool] = None


def _validate_date(d: str):
    try:
        datetime.strptime(d, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, "Invalid date format, expected YYYY-MM-DD")


def _validate_time(t: str):
    try:
        datetime.strptime(t, "%H:%M")
    except ValueError:
        raise HTTPException(400, "Invalid time format, expected HH:MM")


def _assert_todo_date_editable(todo_date: str):
    if todo_date < date.today().isoformat():
        raise HTTPException(403, "Past days are locked for editing; only toggling is allowed")


def _ensure_todo_completed_at(cursor):
    """Add completed_at to todo_items on older databases, if needed."""
    cursor.execute("""
        SELECT CASE WHEN EXISTS (
            SELECT 1
            FROM sys.tables t
            INNER JOIN sys.columns c ON c.object_id = t.object_id
            WHERE t.name = 'todo_items' AND c.name = 'completed_at'
        ) THEN 1 ELSE 0 END
    """)
    row = cursor.fetchone()
    if row and row[0]:
        return

    cursor.execute("""
        IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'todo_items')
        BEGIN
            ALTER TABLE todo_items ADD completed_at DATETIME2 NULL;
        END
    """)
    cursor.execute("""
        IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'todo_items')
        BEGIN
            UPDATE todo_items
            SET completed_at = CASE WHEN done = 1 THEN updated_at ELSE NULL END
            WHERE completed_at IS NULL;
        END
    """)


def _run_phase2_migration(cursor):
    """Multi-profile schema migration. Idempotent; safe to re-run on every startup."""

    # user_profile: drop single-row CHECK, add roadmap_variant + created_at
    cursor.execute("""
        IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_single_profile')
            ALTER TABLE user_profile DROP CONSTRAINT CK_single_profile;
    """)
    cursor.execute("""
        IF COL_LENGTH('user_profile', 'roadmap_variant') IS NULL
            ALTER TABLE user_profile ADD roadmap_variant NVARCHAR(20) NOT NULL DEFAULT 'ai_llm';
    """)
    cursor.execute("""
        IF COL_LENGTH('user_profile', 'created_at') IS NULL
            ALTER TABLE user_profile ADD created_at DATETIME2 NOT NULL DEFAULT GETDATE();
    """)

    # checklist_items: add profile_id + composite unique
    cursor.execute("""
        IF COL_LENGTH('checklist_items', 'profile_id') IS NULL
        BEGIN
            ALTER TABLE checklist_items ADD profile_id INT NOT NULL DEFAULT 1;
        END
    """)
    cursor.execute("""
        IF NOT EXISTS (
            SELECT 1
            FROM sys.index_columns ic
            JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
            JOIN sys.key_constraints kc ON kc.unique_index_id = ic.index_id AND kc.parent_object_id = ic.object_id
            WHERE kc.name = 'UQ_checklist' AND c.name = 'profile_id'
        )
        AND EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_checklist' AND parent_object_id = OBJECT_ID('checklist_items'))
        BEGIN
            ALTER TABLE checklist_items DROP CONSTRAINT UQ_checklist;
            ALTER TABLE checklist_items ADD CONSTRAINT UQ_checklist UNIQUE (profile_id, month_id, item_index);
        END
    """)

    # notes: add profile_id + swap unnamed UNIQUE(month_id) -> named composite
    cursor.execute("""
        IF COL_LENGTH('notes', 'profile_id') IS NULL
        BEGIN
            ALTER TABLE notes ADD profile_id INT NOT NULL DEFAULT 1;

            DECLARE @uq NVARCHAR(200);
            SELECT @uq = kc.name
            FROM sys.key_constraints kc
            WHERE kc.parent_object_id = OBJECT_ID('notes') AND kc.type = 'UQ';
            IF @uq IS NOT NULL
                EXEC('ALTER TABLE notes DROP CONSTRAINT ' + @uq);

            IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_notes_profile_month' AND parent_object_id = OBJECT_ID('notes'))
                ALTER TABLE notes ADD CONSTRAINT UQ_notes_profile_month UNIQUE (profile_id, month_id);
        END
    """)

    # notes_history: add profile_id + refresh index
    cursor.execute("""
        IF COL_LENGTH('notes_history', 'profile_id') IS NULL
            ALTER TABLE notes_history ADD profile_id INT NOT NULL DEFAULT 1;
    """)
    cursor.execute("""
        IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_notes_history_month' AND object_id = OBJECT_ID('notes_history'))
           AND NOT EXISTS (
               SELECT 1
               FROM sys.index_columns ic
               JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
               JOIN sys.indexes i ON i.index_id = ic.index_id AND i.object_id = ic.object_id
               WHERE i.name = 'IX_notes_history_month' AND c.name = 'profile_id'
           )
        BEGIN
            DROP INDEX IX_notes_history_month ON notes_history;
            CREATE INDEX IX_notes_history_month ON notes_history (profile_id, month_id, saved_at DESC);
        END
    """)

    # todo_items: add profile_id + refresh index
    cursor.execute("""
        IF COL_LENGTH('todo_items', 'profile_id') IS NULL
            ALTER TABLE todo_items ADD profile_id INT NOT NULL DEFAULT 1;
    """)
    cursor.execute("""
        IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_todo_month_date' AND object_id = OBJECT_ID('todo_items'))
        BEGIN
            DROP INDEX IX_todo_month_date ON todo_items;
        END
        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_todo_profile_month_date' AND object_id = OBJECT_ID('todo_items'))
            CREATE INDEX IX_todo_profile_month_date ON todo_items (profile_id, month_id, todo_date);
    """)

    # milestones: add profile_id
    cursor.execute("""
        IF COL_LENGTH('milestones', 'profile_id') IS NULL
            ALTER TABLE milestones ADD profile_id INT NOT NULL DEFAULT 1;
    """)

    # profile_settings: new per-profile key-value table
    cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'profile_settings')
        BEGIN
            CREATE TABLE profile_settings (
                profile_id  INT NOT NULL,
                [key]       NVARCHAR(100) NOT NULL,
                [value]     NVARCHAR(MAX) NOT NULL DEFAULT '',
                updated_at  DATETIME2 NOT NULL DEFAULT GETDATE(),
                CONSTRAINT PK_profile_settings PRIMARY KEY (profile_id, [key])
            );
        END
    """)

    # Move per-profile keys from app_settings -> profile_settings (profile_id=1).
    # Guarded by NOT EXISTS on the target so the copy is a no-op after the first run.
    cursor.execute("""
        INSERT INTO profile_settings (profile_id, [key], [value], updated_at)
        SELECT 1, s.[key], s.[value], s.updated_at
        FROM app_settings s
        WHERE (s.[key] IN ('leetcode', 'streak_last_date', 'streak_count')
               OR s.[key] LIKE 'weeknotes_%'
               OR s.[key] LIKE 'daycheck_%'
               OR s.[key] LIKE 'reslink_%'
               OR s.[key] LIKE 'repolink_%')
          AND NOT EXISTS (
              SELECT 1 FROM profile_settings ps
              WHERE ps.profile_id = 1 AND ps.[key] = s.[key]
          );
    """)
    cursor.execute("""
        DELETE FROM app_settings
        WHERE [key] IN ('leetcode', 'streak_last_date', 'streak_count')
           OR [key] LIKE 'weeknotes_%'
           OR [key] LIKE 'daycheck_%'
           OR [key] LIKE 'reslink_%'
           OR [key] LIKE 'repolink_%';
    """)

    # Global marker for the active profile
    cursor.execute("""
        IF NOT EXISTS (SELECT 1 FROM app_settings WHERE [key] = 'active_profile_id')
            INSERT INTO app_settings ([key], [value]) VALUES ('active_profile_id', '1');
    """)

    # Guarantee at least one profile exists post-migration
    cursor.execute("""
        IF NOT EXISTS (SELECT 1 FROM user_profile)
            INSERT INTO user_profile (id, display_name, target_role)
            VALUES (1, 'Learner', 'AI/LLM Engineer');
    """)


# ── Multi-profile helpers ─────────────────────────────

_PER_PROFILE_SETTING_EXACT = {"leetcode", "streak_last_date", "streak_count"}
_PER_PROFILE_SETTING_PREFIXES = (
    "weeknotes_", "daycheck_", "reslink_", "repolink_",
    # Anti-helplessness features: stuck log, rebuild-from-scratch, consume/build time log, weekly solo challenge
    "stucklog_", "rebuild_", "timelog_", "challenge_",
    # DSA interview-prep track (solved problem ids)
    "dsa_",
)


def _validate_roadmap_variant(value):
    if not isinstance(value, str) or not value.strip():
        raise HTTPException(400, "roadmap_variant must be a non-empty string")
    if len(value) > 20:
        raise HTTPException(400, "roadmap_variant must be at most 20 characters")
    return value.strip()


def _is_per_profile_setting(key: str) -> bool:
    if key in _PER_PROFILE_SETTING_EXACT:
        return True
    return any(key.startswith(p) for p in _PER_PROFILE_SETTING_PREFIXES)


def _get_active_profile_id(cursor) -> int:
    cursor.execute("SELECT [value] FROM app_settings WHERE [key] = 'active_profile_id'")
    row = cursor.fetchone()
    if row and row.value:
        try:
            return int(row.value)
        except (TypeError, ValueError):
            pass
    return 1


def _profile_exists(cursor, profile_id: int) -> bool:
    cursor.execute("SELECT 1 FROM user_profile WHERE id = ?", profile_id)
    return cursor.fetchone() is not None


def _next_profile_id(cursor) -> int:
    cursor.execute("SELECT ISNULL(MAX(id), 0) + 1 FROM user_profile")
    return int(cursor.fetchone()[0])


def _delete_profile_data(cursor, profile_id: int):
    """Cascade-delete all rows belonging to a profile."""
    cursor.execute("DELETE FROM checklist_items WHERE profile_id = ?", profile_id)
    cursor.execute("DELETE FROM notes WHERE profile_id = ?", profile_id)
    cursor.execute("DELETE FROM notes_history WHERE profile_id = ?", profile_id)
    cursor.execute("DELETE FROM todo_items WHERE profile_id = ?", profile_id)
    cursor.execute("DELETE FROM milestones WHERE profile_id = ?", profile_id)
    cursor.execute("DELETE FROM profile_settings WHERE profile_id = ?", profile_id)


def _profile_row_to_dict(row) -> dict:
    return {
        "id": row.id,
        "display_name": row.display_name,
        "target_role": row.target_role,
        "start_date": str(row.start_date) if row.start_date else None,
        "target_end_date": str(row.target_end_date) if row.target_end_date else None,
        "hours_per_day": float(row.hours_per_day),
        "days_per_week": row.days_per_week,
        "leetcode_target": row.leetcode_target,
        "daily_reminder_time": row.daily_reminder_time,
        "show_difficulty": bool(row.show_difficulty),
        "show_streak": bool(row.show_streak),
        "auto_expand_week": bool(row.auto_expand_week),
        "compact_mode": bool(row.compact_mode),
        "roadmap_variant": row.roadmap_variant,
        "created_at": row.created_at.isoformat() if getattr(row, "created_at", None) else None,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
    }


class TodoItemCreate(BaseModel):
    text: str


class TodoItemToggle(BaseModel):
    done: bool


class TodoItemUpdate(BaseModel):
    text: str


class TodoReorderItem(BaseModel):
    id: int
    item_index: int


class TodoReorder(BaseModel):
    items: list[TodoReorderItem]


# ── Health Check ──────────────────────────────────────────

@app.get("/api/health")
def health_check():
    db_ok = test_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ── CHECKLIST ENDPOINTS ──────────────────────────────────

@app.get("/api/checklist/{month_id}")
def get_checklist(month_id: int):
    """Get all checked items for a month (returns dict of index→checked)."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT item_index, checked FROM checklist_items WHERE profile_id = ? AND month_id = ?",
            active, month_id
        )
        rows = cursor.fetchall()
        return {str(row.item_index): bool(row.checked) for row in rows}


@app.put("/api/checklist/{month_id}/{item_index}")
def toggle_checklist(month_id: int, item_index: int, body: ChecklistToggle):
    """Set a checklist item's checked state."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("""
            MERGE checklist_items AS target
            USING (SELECT ? AS profile_id, ? AS month_id, ? AS item_index) AS source
            ON target.profile_id = source.profile_id
               AND target.month_id = source.month_id
               AND target.item_index = source.item_index
            WHEN MATCHED THEN
                UPDATE SET checked = ?, updated_at = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (profile_id, month_id, item_index, checked, updated_at)
                VALUES (?, ?, ?, ?, GETDATE());
        """, active, month_id, item_index, body.checked,
             active, month_id, item_index, body.checked)

    return {"month_id": month_id, "item_index": item_index, "checked": body.checked}


# ── NOTES ENDPOINTS ──────────────────────────────────────

@app.get("/api/notes/{month_id}")
def get_notes(month_id: int):
    """Get notes for a month."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT content FROM notes WHERE profile_id = ? AND month_id = ?",
            active, month_id
        )
        row = cursor.fetchone()
        return {"month_id": month_id, "content": row.content if row else ""}


@app.put("/api/notes/{month_id}")
def update_notes(month_id: int, body: NotesUpdate):
    """Save notes for a month and record history."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)

        # 1) Upsert the current note
        cursor.execute("""
            MERGE notes AS target
            USING (SELECT ? AS profile_id, ? AS month_id) AS source
            ON target.profile_id = source.profile_id AND target.month_id = source.month_id
            WHEN MATCHED THEN
                UPDATE SET content = ?, updated_at = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (profile_id, month_id, content, updated_at)
                VALUES (?, ?, ?, GETDATE());
        """, active, month_id, body.content, active, month_id, body.content)
        while cursor.nextset():
            pass

        # 2) Always save to history on every save (journal-style)
        if body.content and body.content.strip():
            cursor.execute(
                "INSERT INTO notes_history (profile_id, month_id, content, saved_at) VALUES (?, ?, ?, GETDATE())",
                active, month_id, body.content
            )
            # 3) Trim history to keep only the latest 50 entries per profile/month
            cursor.execute("""
                DELETE FROM notes_history
                WHERE profile_id = ? AND month_id = ? AND id NOT IN (
                    SELECT TOP 50 id FROM notes_history
                    WHERE profile_id = ? AND month_id = ? ORDER BY saved_at DESC
                )
            """, active, month_id, active, month_id)

    return {"month_id": month_id, "saved": True}


@app.get("/api/notes/{month_id}/history")
def get_notes_history(month_id: int, limit: int = 50):
    """Get revision history for a month's notes."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT TOP (?) id, content, saved_at FROM notes_history "
            "WHERE profile_id = ? AND month_id = ? ORDER BY saved_at DESC",
            min(limit, 100), active, month_id
        )
        rows = cursor.fetchall()
        return [
            {
                "id": row.id,
                "content": row.content,
                "saved_at": row.saved_at.isoformat() if row.saved_at else None
            }
            for row in rows
        ]


@app.delete("/api/notes/{month_id}/history/{history_id}")
def delete_notes_history_entry(month_id: int, history_id: int):
    """Delete a single notes history entry."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "DELETE FROM notes_history WHERE id = ? AND profile_id = ? AND month_id = ?",
            history_id, active, month_id
        )
    return {"deleted": True}


# ── LEETCODE ENDPOINTS ────────────────────────────────────

@app.get("/api/leetcode")
def get_leetcode():
    """Get current LeetCode count for the active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT [value] FROM profile_settings WHERE profile_id = ? AND [key] = 'leetcode'",
            active
        )
        row = cursor.fetchone()
        return {"count": int(row.value) if row and row.value else 0}


@app.put("/api/leetcode")
def update_leetcode(body: LeetcodeUpdate):
    """Update LeetCode count for the active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("""
            MERGE profile_settings AS target
            USING (SELECT ? AS profile_id, 'leetcode' AS [key]) AS source
            ON target.profile_id = source.profile_id AND target.[key] = source.[key]
            WHEN MATCHED THEN
                UPDATE SET [value] = ?, updated_at = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (profile_id, [key], [value], updated_at)
                VALUES (?, 'leetcode', ?, GETDATE());
        """, active, str(body.count), active, str(body.count))

    return {"count": body.count, "saved": True}


# ── SETTINGS ENDPOINTS ────────────────────────────────────
# Routing: keys matching known per-profile prefixes/names hit profile_settings
# (scoped to the active profile). Everything else stays in the global app_settings.

@app.get("/api/settings")
def get_all_settings(prefix: str = ""):
    """Get settings, optionally filtered by prefix. Auto-routes per-profile prefixes to profile_settings."""
    with get_db() as conn:
        cursor = conn.cursor()
        if prefix and any(prefix.startswith(p) or p.startswith(prefix) for p in _PER_PROFILE_SETTING_PREFIXES):
            active = _get_active_profile_id(cursor)
            cursor.execute(
                "SELECT [key], [value] FROM profile_settings WHERE profile_id = ? AND [key] LIKE ?",
                active, prefix + '%'
            )
        elif prefix:
            cursor.execute("SELECT [key], [value] FROM app_settings WHERE [key] LIKE ?", prefix + '%')
        else:
            cursor.execute("SELECT [key], [value] FROM app_settings")
        rows = cursor.fetchall()
        return {row.key: row.value for row in rows}


@app.get("/api/settings/{key}")
def get_setting(key: str):
    """Get a single setting value. Auto-routes per-profile keys to profile_settings."""
    with get_db() as conn:
        cursor = conn.cursor()
        if _is_per_profile_setting(key):
            active = _get_active_profile_id(cursor)
            cursor.execute(
                "SELECT [value] FROM profile_settings WHERE profile_id = ? AND [key] = ?",
                active, key
            )
        else:
            cursor.execute("SELECT [value] FROM app_settings WHERE [key] = ?", key)
        row = cursor.fetchone()
        if not row:
            return {"key": key, "value": None}
        return {"key": key, "value": row.value}


@app.put("/api/settings/{key}")
def update_setting(key: str, body: SettingUpdate):
    """Update a setting. Auto-routes per-profile keys to profile_settings."""
    with get_db() as conn:
        cursor = conn.cursor()
        if _is_per_profile_setting(key):
            active = _get_active_profile_id(cursor)
            cursor.execute("""
                MERGE profile_settings AS target
                USING (SELECT ? AS profile_id, ? AS [key]) AS source
                ON target.profile_id = source.profile_id AND target.[key] = source.[key]
                WHEN MATCHED THEN
                    UPDATE SET [value] = ?, updated_at = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (profile_id, [key], [value], updated_at)
                    VALUES (?, ?, ?, GETDATE());
            """, active, key, body.value, active, key, body.value)
        else:
            cursor.execute("""
                MERGE app_settings AS target
                USING (SELECT ? AS [key]) AS source
                ON target.[key] = source.[key]
                WHEN MATCHED THEN
                    UPDATE SET [value] = ?, updated_at = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT ([key], [value], updated_at)
                    VALUES (?, ?, GETDATE());
            """, key, body.value, key, body.value)

    return {"key": key, "saved": True}


# ── USER PROFILE ─────────────────────────────────────────

@app.get("/api/profile")
def get_profile():
    """Get the currently active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("""
            SELECT id, display_name, target_role, start_date, target_end_date,
                   hours_per_day, days_per_week, leetcode_target,
                   daily_reminder_time, show_difficulty, show_streak,
                   auto_expand_week, compact_mode, roadmap_variant,
                   created_at, updated_at
            FROM user_profile WHERE id = ?
        """, active)
        row = cursor.fetchone()
        if not row:
            raise HTTPException(404, "Active profile not found.")
        return _profile_row_to_dict(row)


def _apply_profile_update(profile_id: int, body: ProfileUpdate) -> dict:
    """Shared implementation for PUT /api/profile and PUT /api/profiles/{id}."""
    field_map = {
        "display_name": "display_name",
        "target_role": "target_role",
        "start_date": "start_date",
        "target_end_date": "target_end_date",
        "hours_per_day": "hours_per_day",
        "days_per_week": "days_per_week",
        "leetcode_target": "leetcode_target",
        "daily_reminder_time": "daily_reminder_time",
        "show_difficulty": "show_difficulty",
        "show_streak": "show_streak",
        "auto_expand_week": "auto_expand_week",
        "compact_mode": "compact_mode",
        "roadmap_variant": "roadmap_variant",
    }

    body_dict = body.model_dump(exclude_unset=True)

    for date_field in ("start_date", "target_end_date"):
        if date_field in body_dict and body_dict[date_field]:
            _validate_date(body_dict[date_field])
    if "daily_reminder_time" in body_dict and body_dict["daily_reminder_time"]:
        _validate_time(body_dict["daily_reminder_time"])
    if "hours_per_day" in body_dict and body_dict["hours_per_day"] is not None:
        if not (0.5 <= body_dict["hours_per_day"] <= 16):
            raise HTTPException(400, "hours_per_day must be between 0.5 and 16")
    if "days_per_week" in body_dict and body_dict["days_per_week"] is not None:
        if not (1 <= body_dict["days_per_week"] <= 7):
            raise HTTPException(400, "days_per_week must be between 1 and 7")
    if "leetcode_target" in body_dict and body_dict["leetcode_target"] is not None:
        if not (1 <= body_dict["leetcode_target"] <= 999):
            raise HTTPException(400, "leetcode_target must be between 1 and 999")
    if "roadmap_variant" in body_dict and body_dict["roadmap_variant"] is not None:
        body_dict["roadmap_variant"] = _validate_roadmap_variant(body_dict["roadmap_variant"])

    updates = []
    params = []
    for field_name, col_name in field_map.items():
        if field_name in body_dict and body_dict[field_name] is not None:
            val = body_dict[field_name]
            if field_name == "target_end_date" and val == "":
                updates.append(f"{col_name} = NULL")
            else:
                updates.append(f"{col_name} = ?")
                params.append(val)

    if not updates:
        raise HTTPException(400, "No fields to update")

    updates.append("updated_at = GETDATE()")
    sql = f"UPDATE user_profile SET {', '.join(updates)} WHERE id = ?"
    params.append(profile_id)

    with get_db() as conn:
        cursor = conn.cursor()
        if not _profile_exists(cursor, profile_id):
            raise HTTPException(404, "Profile not found")
        cursor.execute(sql, *params)

    return {"id": profile_id, "saved": True}


@app.put("/api/profile")
def update_profile(body: ProfileUpdate):
    """Update the currently active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
    return _apply_profile_update(active, body)


# ── MILESTONES ───────────────────────────────────────────

@app.get("/api/milestones")
def get_milestones():
    """Get all custom milestones for the active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("""
            SELECT id, title, target_date, completed, completed_at, sort_order, created_at
            FROM milestones WHERE profile_id = ? ORDER BY sort_order, created_at
        """, active)
        rows = cursor.fetchall()
        return [
            {
                "id": row.id,
                "title": row.title,
                "target_date": str(row.target_date) if row.target_date else None,
                "completed": bool(row.completed),
                "completed_at": row.completed_at.isoformat() if row.completed_at else None,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]


@app.post("/api/milestones")
def create_milestone(body: MilestoneCreate):
    """Create a new milestone for the active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        target = body.target_date if body.target_date else None
        cursor.execute("""
            INSERT INTO milestones (profile_id, title, target_date, created_at)
            VALUES (?, ?, ?, GETDATE())
        """, active, body.title, target)
        cursor.execute("SELECT SCOPE_IDENTITY()")
        new_id = cursor.fetchone()[0]
    return {"id": int(new_id), "title": body.title, "created": True}


@app.put("/api/milestones/{milestone_id}")
def update_milestone(milestone_id: int, body: MilestoneUpdate):
    """Update a milestone (toggle complete, edit title/date). Scoped to active profile."""
    updates = []
    params = []

    if body.title is not None:
        updates.append("title = ?")
        params.append(body.title)
    if body.target_date is not None:
        if body.target_date == "":
            updates.append("target_date = NULL")
        else:
            updates.append("target_date = ?")
            params.append(body.target_date)
    if body.completed is not None:
        updates.append("completed = ?")
        params.append(body.completed)
        if body.completed:
            updates.append("completed_at = GETDATE()")
        else:
            updates.append("completed_at = NULL")

    if not updates:
        raise HTTPException(400, "No fields to update")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        sql = f"UPDATE milestones SET {', '.join(updates)} WHERE id = ? AND profile_id = ?"
        params.append(milestone_id)
        params.append(active)
        cursor.execute(sql, *params)
        if cursor.rowcount == 0:
            raise HTTPException(404, "Milestone not found for the active profile")

    return {"id": milestone_id, "saved": True}


@app.delete("/api/milestones/{milestone_id}")
def delete_milestone(milestone_id: int):
    """Delete a milestone belonging to the active profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("DELETE FROM milestones WHERE id = ? AND profile_id = ?", milestone_id, active)
        if cursor.rowcount == 0:
            raise HTTPException(404, "Milestone not found")
    return {"id": milestone_id, "deleted": True}


# ── RESET ────────────────────────────────────────────────

@app.post("/api/reset")
def reset_progress():
    """Reset all progress for the ACTIVE profile (keeps theme, profile record, and milestones)."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("DELETE FROM checklist_items WHERE profile_id = ?", active)
        cursor.execute("DELETE FROM notes WHERE profile_id = ?", active)
        cursor.execute("DELETE FROM notes_history WHERE profile_id = ?", active)
        cursor.execute("DELETE FROM todo_items WHERE profile_id = ?", active)
        cursor.execute("""
            DELETE FROM profile_settings
            WHERE profile_id = ?
              AND ([key] IN ('leetcode', 'streak_last_date', 'streak_count')
                   OR [key] LIKE 'weeknotes_%'
                   OR [key] LIKE 'daycheck_%'
                   OR [key] LIKE 'reslink_%'
                   OR [key] LIKE 'repolink_%'
                   OR [key] LIKE 'stucklog_%'
                   OR [key] LIKE 'rebuild_%'
                   OR [key] LIKE 'timelog_%'
                   OR [key] LIKE 'challenge_%'
                   OR [key] LIKE 'dsa_%')
        """, active)
        cursor.execute(
            "INSERT INTO profile_settings (profile_id, [key], [value]) VALUES (?, 'leetcode', '0')",
            active
        )

    return {"reset": True}


# ── TODO ENDPOINTS ────────────────────────────────────────

@app.get("/api/todos/search")
def search_todos(q: str = "", date_from: str = "", date_to: str = "", month_id: int = -1,
                 limit: int = 100, offset: int = 0):
    """Search todos (active profile) by text and/or date range with pagination."""
    # Clamp limit to a safe maximum
    limit = max(1, min(limit, 500))
    offset = max(0, offset)

    conditions = ["profile_id = ?"]
    params = []  # profile_id added right before execute so we know its value

    if q and len(q) >= 2:
        safe_q = q.replace('[', '[[]').replace('%', '[%]').replace('_', '[_]')
        conditions.append("text LIKE ?")
        params.append(f"%{safe_q}%")
    if date_from:
        conditions.append("todo_date >= ?")
        params.append(date_from)
    if date_to:
        conditions.append("todo_date <= ?")
        params.append(date_to)
    if month_id >= 0:
        conditions.append("month_id = ?")
        params.append(month_id)

    if len(conditions) == 1:  # only profile_id was added, i.e. no user-supplied filter
        return {"items": [], "total": 0, "limit": limit, "offset": offset}

    where = " AND ".join(conditions)

    with get_db() as conn:
        cursor = conn.cursor()
        _ensure_todo_completed_at(cursor)
        active = _get_active_profile_id(cursor)

        count_sql = f"SELECT COUNT(*) FROM todo_items WHERE {where}"
        cursor.execute(count_sql, active, *params)
        total = cursor.fetchone()[0]

        sql = (f"SELECT id, month_id, todo_date, item_index, text, done, created_at, completed_at "
            f"FROM todo_items WHERE {where} "
            f"ORDER BY todo_date DESC, item_index "
            f"OFFSET ? ROWS FETCH NEXT ? ROWS ONLY")
        cursor.execute(sql, active, *params, offset, limit)
        rows = cursor.fetchall()
        items = [{
            "id": r.id,
            "month_id": r.month_id,
            "todo_date": str(r.todo_date),
            "index": r.item_index,
            "text": r.text,
            "done": bool(r.done),
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None
        } for r in rows]

    return {"items": items, "total": total, "limit": limit, "offset": offset}


@app.get("/api/todos/all/{month_id}")
def get_all_todos_for_month(month_id: int):
    """All todo items for all dates in a month (active profile)."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")
    with get_db() as conn:
        cursor = conn.cursor()
        _ensure_todo_completed_at(cursor)
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT id, todo_date, item_index, text, done, created_at, completed_at FROM todo_items "
            "WHERE profile_id = ? AND month_id = ? ORDER BY todo_date, item_index",
            active, month_id
        )
        rows = cursor.fetchall()
        result = {}
        for r in rows:
            d = str(r.todo_date)
            if d not in result:
                result[d] = []
            result[d].append({"id": r.id, "index": r.item_index, "text": r.text, "done": bool(r.done), "created_at": r.created_at.isoformat() if r.created_at else None, "completed_at": r.completed_at.isoformat() if r.completed_at else None})
        return result


@app.post("/api/todos/{month_id}/{todo_date}")
def add_todo(month_id: int, todo_date: str, body: TodoItemCreate):
    """Add a new todo item for a month + date (active profile)."""
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")
    _validate_date(todo_date)
    _assert_todo_date_editable(todo_date)
    if not body.text.strip():
        raise HTTPException(400, "Todo text cannot be empty")
    with get_db() as conn:
        cursor = conn.cursor()
        _ensure_todo_completed_at(cursor)
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT ISNULL(MAX(item_index), -1) + 1 FROM todo_items "
            "WHERE profile_id = ? AND month_id = ? AND todo_date = ?",
            active, month_id, todo_date
        )
        next_idx = cursor.fetchone()[0]
        cursor.execute(
            "INSERT INTO todo_items (profile_id, month_id, todo_date, item_index, text, done, completed_at) "
            "OUTPUT INSERTED.id, INSERTED.created_at, INSERTED.completed_at "
            "VALUES (?, ?, ?, ?, ?, 0, NULL)",
            active, month_id, todo_date, next_idx, body.text
        )
        row = cursor.fetchone()
    return {"id": int(row.id), "index": next_idx, "text": body.text, "done": False, "created_at": row.created_at.isoformat() if row.created_at else None, "completed_at": row.completed_at.isoformat() if row.completed_at else None}


@app.put("/api/todos/{todo_id}/toggle")
def toggle_todo(todo_id: int, body: TodoItemToggle):
    """Toggle a todo item's done state (must belong to active profile)."""
    with get_db() as conn:
        cursor = conn.cursor()
        _ensure_todo_completed_at(cursor)
        active = _get_active_profile_id(cursor)
        done_value = 1 if body.done else 0
        cursor.execute(
            "UPDATE todo_items SET done = ?, "
            "completed_at = CASE WHEN ? = 1 THEN GETDATE() ELSE NULL END, "
            "updated_at = GETDATE() "
            "WHERE id = ? AND profile_id = ?",
            done_value, done_value, todo_id, active
        )
        if cursor.rowcount == 0:
            raise HTTPException(404, "Todo not found")
        cursor.execute(
            "SELECT created_at, completed_at FROM todo_items WHERE id = ? AND profile_id = ?",
            todo_id, active
        )
        row = cursor.fetchone()
    return {"id": todo_id, "done": body.done, "created_at": row.created_at.isoformat() if row and row.created_at else None, "completed_at": row.completed_at.isoformat() if row and row.completed_at else None}


@app.put("/api/todos/{todo_id}")
def update_todo(todo_id: int, body: TodoItemUpdate):
    """Update a todo item's text (must belong to active profile)."""
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Todo text cannot be empty")

    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT todo_date FROM todo_items WHERE id = ? AND profile_id = ?",
            todo_id, active
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(404, "Todo not found")
        _assert_todo_date_editable(str(row.todo_date))
        cursor.execute(
            "UPDATE todo_items SET text = ?, updated_at = GETDATE() WHERE id = ? AND profile_id = ?",
            text, todo_id, active
        )

    return {"id": todo_id, "text": text, "saved": True}


@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    """Delete a todo item (must belong to active profile)."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute(
            "SELECT todo_date FROM todo_items WHERE id = ? AND profile_id = ?",
            todo_id, active
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(404, "Todo not found")
        _assert_todo_date_editable(str(row.todo_date))
        cursor.execute("DELETE FROM todo_items WHERE id = ? AND profile_id = ?", todo_id, active)
    return {"deleted": True}


@app.put("/api/todos/reorder/{month_id}/{todo_date}")
def reorder_todos(month_id: int, todo_date: str, body: TodoReorder):
    """Update item_index for all todo items in a given day (active profile) to reflect new order."""
    _validate_date(todo_date)
    _assert_todo_date_editable(todo_date)
    if month_id < 0 or month_id > 9:
        raise HTTPException(400, "month_id must be 0-9")
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        for entry in body.items:
            cursor.execute(
                "UPDATE todo_items SET item_index = ?, updated_at = GETDATE() "
                "WHERE id = ? AND profile_id = ? AND month_id = ? AND todo_date = ?",
                entry.item_index, entry.id, active, month_id, todo_date
            )
    return {"reordered": True}


# ── PROFILES CRUD (multi-profile) ────────────────────────

@app.get("/api/profiles")
def list_profiles():
    """List all profiles + which one is currently active."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        cursor.execute("""
            SELECT id, display_name, target_role, start_date, target_end_date,
                   hours_per_day, days_per_week, leetcode_target,
                   daily_reminder_time, show_difficulty, show_streak,
                   auto_expand_week, compact_mode, roadmap_variant,
                   created_at, updated_at
            FROM user_profile ORDER BY id
        """)
        rows = cursor.fetchall()
        return {
            "active_profile_id": active,
            "profiles": [_profile_row_to_dict(r) for r in rows],
        }


@app.post("/api/profiles")
def create_profile(body: ProfileCreate):
    """Create a new profile. Fresh progress; not automatically activated."""
    display_name = (body.display_name or "").strip()
    if not display_name:
        raise HTTPException(400, "display_name is required")
    variant = _validate_roadmap_variant(body.roadmap_variant or "ai_llm")
    if body.start_date:
        _validate_date(body.start_date)
    if body.target_end_date:
        _validate_date(body.target_end_date)
    if body.daily_reminder_time:
        _validate_time(body.daily_reminder_time)
    if body.hours_per_day is not None and not (0.5 <= body.hours_per_day <= 16):
        raise HTTPException(400, "hours_per_day must be between 0.5 and 16")
    if body.days_per_week is not None and not (1 <= body.days_per_week <= 7):
        raise HTTPException(400, "days_per_week must be between 1 and 7")
    if body.leetcode_target is not None and not (1 <= body.leetcode_target <= 999):
        raise HTTPException(400, "leetcode_target must be between 1 and 999")

    with get_db() as conn:
        cursor = conn.cursor()
        new_id = _next_profile_id(cursor)
        cursor.execute("""
            INSERT INTO user_profile (
                id, display_name, target_role, start_date, target_end_date,
                hours_per_day, days_per_week, leetcode_target,
                daily_reminder_time, roadmap_variant
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            new_id,
            display_name,
            body.target_role or "AI/LLM Engineer",
            body.start_date or date.today().isoformat(),
            body.target_end_date if body.target_end_date else None,
            body.hours_per_day if body.hours_per_day is not None else 5.0,
            body.days_per_week if body.days_per_week is not None else 6,
            body.leetcode_target if body.leetcode_target is not None else 150,
            body.daily_reminder_time or "09:00",
            variant,
        )
        cursor.execute(
            "INSERT INTO profile_settings (profile_id, [key], [value]) VALUES (?, 'leetcode', '0')",
            new_id,
        )
    return {"id": new_id, "created": True}


@app.put("/api/profiles/{profile_id}")
def update_profile_by_id(profile_id: int, body: ProfileUpdate):
    """Update any profile by id (not necessarily the active one)."""
    return _apply_profile_update(profile_id, body)


@app.delete("/api/profiles/{profile_id}")
def delete_profile(profile_id: int):
    """Delete a profile and cascade-delete all its data. Cannot delete the active or last profile."""
    with get_db() as conn:
        cursor = conn.cursor()
        active = _get_active_profile_id(cursor)
        if profile_id == active:
            raise HTTPException(400, "Cannot delete the active profile. Activate another first.")
        cursor.execute("SELECT COUNT(*) FROM user_profile")
        total = cursor.fetchone()[0]
        if total <= 1:
            raise HTTPException(400, "Cannot delete the only remaining profile.")
        if not _profile_exists(cursor, profile_id):
            raise HTTPException(404, "Profile not found")
        _delete_profile_data(cursor, profile_id)
        cursor.execute("DELETE FROM user_profile WHERE id = ?", profile_id)
    return {"id": profile_id, "deleted": True}


@app.post("/api/profiles/{profile_id}/activate")
def activate_profile(profile_id: int):
    """Set the given profile as the active one."""
    with get_db() as conn:
        cursor = conn.cursor()
        if not _profile_exists(cursor, profile_id):
            raise HTTPException(404, "Profile not found")
        cursor.execute("""
            MERGE app_settings AS target
            USING (SELECT 'active_profile_id' AS [key]) AS source
            ON target.[key] = source.[key]
            WHEN MATCHED THEN
                UPDATE SET [value] = ?, updated_at = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT ([key], [value], updated_at)
                VALUES ('active_profile_id', ?, GETDATE());
        """, str(profile_id), str(profile_id))
    return {"active_profile_id": profile_id}


# ── SERVE FRONTEND ────────────────────────────────────────

VENDOR_MEDIA_TYPES = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
}

@app.get("/vendor/{filepath:path}")
def serve_vendor(filepath: str):
    """Serve self-hosted vendor assets (JS, CSS, fonts)."""
    vendor_dir = os.path.realpath(os.path.join(STATIC_DIR, "vendor"))
    full_path = os.path.realpath(os.path.join(vendor_dir, filepath))
    try:
        if os.path.commonpath([full_path, vendor_dir]) != vendor_dir:
            raise HTTPException(status_code=403, detail="Forbidden")
    except ValueError:
        raise HTTPException(status_code=403, detail="Forbidden")
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="Vendor file not found")
    ext = os.path.splitext(full_path)[1].lower()
    media_type = VENDOR_MEDIA_TYPES.get(ext, "application/octet-stream")
    return FileResponse(full_path, media_type=media_type)


@app.get("/favicon.ico")
@app.get("/favicon.svg")
def serve_favicon():
    """Serve the branded favicon asset."""
    if not os.path.isfile(FAVICON_PATH):
        raise HTTPException(status_code=404, detail="Favicon file not found")
    return FileResponse(
        FAVICON_PATH,
        media_type="image/svg+xml",
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
    )

@app.get("/js/{filepath:path}")
def serve_js_modules(filepath: str):
    """Serve JS module files from the js/ directory."""
    js_dir = os.path.realpath(os.path.join(STATIC_DIR, "js"))
    full_path = os.path.realpath(os.path.join(js_dir, filepath))
    # Security: ensure the resolved path is inside js_dir
    try:
        if os.path.commonpath([full_path, js_dir]) != js_dir:
            raise HTTPException(status_code=403, detail="Forbidden")
    except ValueError:
        # commonpath raises ValueError if paths are on different drives
        raise HTTPException(status_code=403, detail="Forbidden")
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail=f"JS file not found: {filepath}")
    return FileResponse(
        full_path,
        media_type="application/javascript",
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
    )

@app.get("/styles.css")
def serve_css():
    """Serve the main CSS file."""
    return FileResponse(os.path.join(STATIC_DIR, "styles.css"), media_type="text/css")

@app.get("/")
def serve_index():
    """Serve the main HTML file."""
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)


# ── Run ──────────────────────────────────────────────────

if __name__ == "__main__":
    print("🧠 AI Roadmap API starting...")
    db_server = os.getenv("DB_SERVER", r"localhost\SQLEXPRESS")
    db_name = os.getenv("DB_NAME", "AIRoadmap")
    print(f"📡 Database: {db_server}/{db_name}")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
