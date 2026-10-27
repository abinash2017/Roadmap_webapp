-- ============================================
-- AI ROADMAP — MS SQL Server Schema (v2, multi-profile)
-- ============================================
-- Fresh-install script. For existing databases, the FastAPI backend runs
-- an idempotent migration in its startup lifespan() — no manual work needed.
-- ============================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'AIRoadmap')
BEGIN
    CREATE DATABASE AIRoadmap;
END
GO

USE AIRoadmap;
GO

-- ============================================
-- TABLES
-- ============================================

-- User profiles (multi-row; each profile is a full context)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_profile')
BEGIN
    CREATE TABLE user_profile (
        id                  INT NOT NULL PRIMARY KEY,           -- app-managed IDs
        display_name        NVARCHAR(100) NOT NULL DEFAULT 'Learner',
        target_role         NVARCHAR(200) NOT NULL DEFAULT 'AI/LLM Engineer',
        start_date          DATE NOT NULL DEFAULT GETDATE(),
        target_end_date     DATE NULL,
        hours_per_day       DECIMAL(4,1) NOT NULL DEFAULT 5.0,
        days_per_week       INT NOT NULL DEFAULT 6,
        leetcode_target     INT NOT NULL DEFAULT 150,
        daily_reminder_time NVARCHAR(10) NULL DEFAULT '09:00',
        show_difficulty     BIT NOT NULL DEFAULT 1,
        show_streak         BIT NOT NULL DEFAULT 1,
        auto_expand_week    BIT NOT NULL DEFAULT 1,
        compact_mode        BIT NOT NULL DEFAULT 0,
        roadmap_variant     NVARCHAR(20) NOT NULL DEFAULT 'ai_llm',
        created_at          DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at          DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO user_profile (id) VALUES (1);
END
GO

-- Checklist items (per profile, per month, per item)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'checklist_items')
BEGIN
    CREATE TABLE checklist_items (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        profile_id    INT NOT NULL DEFAULT 1,
        month_id      INT NOT NULL,
        item_index    INT NOT NULL,
        checked       BIT NOT NULL DEFAULT 0,
        updated_at    DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT UQ_checklist UNIQUE (profile_id, month_id, item_index)
    );
    CREATE INDEX IX_checklist_profile_month ON checklist_items (profile_id, month_id);
END
GO

-- Notes (one per profile per month)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'notes')
BEGIN
    CREATE TABLE notes (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        profile_id    INT NOT NULL DEFAULT 1,
        month_id      INT NOT NULL,
        content       NVARCHAR(MAX) NOT NULL DEFAULT '',
        updated_at    DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT UQ_notes_profile_month UNIQUE (profile_id, month_id)
    );
END
GO

-- Notes history (revision log per profile + month)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'notes_history')
BEGIN
    CREATE TABLE notes_history (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        profile_id    INT NOT NULL DEFAULT 1,
        month_id      INT NOT NULL,
        content       NVARCHAR(MAX) NOT NULL DEFAULT '',
        saved_at      DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    CREATE INDEX IX_notes_history_month ON notes_history (profile_id, month_id, saved_at DESC);
END
GO

-- App settings (GLOBAL key-value: theme, active_profile_id)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'app_settings')
BEGIN
    CREATE TABLE app_settings (
        [key]         NVARCHAR(100) PRIMARY KEY,
        [value]       NVARCHAR(MAX) NOT NULL DEFAULT '',
        updated_at    DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Profile settings (PER-PROFILE key-value: leetcode, streak_*, weeknotes_*, daycheck_*, reslink_*, repolink_*,
--                   stucklog_*, rebuild_*, timelog_*, challenge_*)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'profile_settings')
BEGIN
    CREATE TABLE profile_settings (
        profile_id    INT NOT NULL,
        [key]         NVARCHAR(100) NOT NULL,
        [value]       NVARCHAR(MAX) NOT NULL DEFAULT '',
        updated_at    DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT PK_profile_settings PRIMARY KEY (profile_id, [key])
    );
END
GO

-- Milestones (per profile)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'milestones')
BEGIN
    CREATE TABLE milestones (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        profile_id    INT NOT NULL DEFAULT 1,
        title         NVARCHAR(300) NOT NULL,
        target_date   DATE NULL,
        completed     BIT NOT NULL DEFAULT 0,
        completed_at  DATETIME2 NULL,
        sort_order    INT NOT NULL DEFAULT 0,
        created_at    DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Daily To-Do items (per profile, per month, per date)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'todo_items')
BEGIN
    CREATE TABLE todo_items (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        profile_id    INT NOT NULL DEFAULT 1,
        month_id      INT NOT NULL,
        todo_date     DATE NOT NULL,
        item_index    INT NOT NULL,
        text          NVARCHAR(500) NOT NULL,
        done          BIT NOT NULL DEFAULT 0,
        completed_at  DATETIME2 NULL,
        created_at    DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at    DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    CREATE INDEX IX_todo_profile_month_date ON todo_items (profile_id, month_id, todo_date);
    CREATE INDEX IX_todo_date ON todo_items (todo_date);
    CREATE INDEX IX_todo_text ON todo_items (text);
END
GO

-- ============================================
-- SEED
-- ============================================

IF NOT EXISTS (SELECT 1 FROM app_settings WHERE [key] = 'theme')
    INSERT INTO app_settings ([key], [value]) VALUES ('theme', 'dark');

IF NOT EXISTS (SELECT 1 FROM app_settings WHERE [key] = 'active_profile_id')
    INSERT INTO app_settings ([key], [value]) VALUES ('active_profile_id', '1');

IF NOT EXISTS (SELECT 1 FROM profile_settings WHERE profile_id = 1 AND [key] = 'leetcode')
    INSERT INTO profile_settings (profile_id, [key], [value]) VALUES (1, 'leetcode', '0');
GO

PRINT '✅ AIRoadmap database setup complete!';
GO
