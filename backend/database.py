"""
Database connection module for MS SQL Server (local).
Uses pyodbc with Windows Authentication by default.
"""

import pyodbc
import os
from contextlib import contextmanager

# ── Configuration ──────────────────────────────────────────
# Override with environment variables if needed:
#   DB_SERVER=localhost\SQLEXPRESS
#   DB_NAME=AIRoadmap
#   DB_DRIVER={ODBC Driver 17 for SQL Server}

DB_SERVER = os.getenv("DB_SERVER", r"localhost\SQLEXPRESS")
DB_NAME = os.getenv("DB_NAME", "AIRoadmap")
DB_DRIVER = os.getenv("DB_DRIVER", "{ODBC Driver 17 for SQL Server}")

# For SQL Auth instead of Windows Auth, set these:
DB_USER = os.getenv("DB_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")


def get_connection_string() -> str:
    """Build the ODBC connection string."""
    if DB_USER and DB_PASSWORD:
        # SQL Server Authentication
        return (
            f"DRIVER={DB_DRIVER};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_NAME};"
            f"UID={DB_USER};"
            f"PWD={DB_PASSWORD};"
            f"TrustServerCertificate=yes;"
            f"Connection Timeout=3;"
        )
    else:
        # Windows Authentication (default for local dev)
        return (
            f"DRIVER={DB_DRIVER};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_NAME};"
            f"Trusted_Connection=yes;"
            f"TrustServerCertificate=yes;"
            f"Connection Timeout=3;"
        )


def get_connection() -> pyodbc.Connection:
    """Get a new database connection."""
    return pyodbc.connect(get_connection_string())


@contextmanager
def get_db():
    """Context manager: yields a connection, auto-commits/rollbacks."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def test_connection() -> bool:
    """Quick connectivity check."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            return True
    except Exception as e:
        print(f"❌ DB connection failed: {e}")
        return False
