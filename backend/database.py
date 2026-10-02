"""
Bharathi Thervukalam - Database Connection Layer (MySQL + Resilience Fallback)
Provides PyMySQL connection pooling, dictionary cursor queries, and schema auto-init.
"""

import os
import sqlite3
from pathlib import Path
from config import Config

# Track if running on MySQL or SQLite fallback
DB_ENGINE = "MYSQL"

def get_mysql_connection():
    """Attempt direct PyMySQL connection."""
    try:
        import pymysql
        import pymysql.cursors

        # First connect without database to ensure database exists
        conn = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            charset=Config.MYSQL_CHARSET,
            connect_timeout=Config.MYSQL_CONNECT_TIMEOUT,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
        with conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.MYSQL_DATABASE}` CHARACTER SET utf8mb4;")
            cur.execute(f"USE `{Config.MYSQL_DATABASE}`;")
        return conn
    except Exception as e:
        print(f"[Database Warning] MySQL connection failed ({e}). Falling back to SQLite for local development resilience.")
        return None

def get_sqlite_connection():
    """SQLite fallback for zero-dependency local execution when MySQL is offline."""
    db_path = Path(__file__).resolve().parent / "bharathi_dev.db"
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn

def get_db():
    """Get active database connection."""
    global DB_ENGINE
    mysql_conn = get_mysql_connection()
    if mysql_conn:
        DB_ENGINE = "MYSQL"
        return mysql_conn
    else:
        DB_ENGINE = "SQLITE"
        return get_sqlite_connection()

def query_all(sql, params=None):
    """Execute SELECT query and return list of dictionaries."""
    conn = get_db()
    try:
        cursor = conn.cursor()
        # Adjust SQL syntax slightly if in SQLite fallback mode
        formatted_sql = sql
        if DB_ENGINE == "SQLITE":
            formatted_sql = formatted_sql.replace("%s", "?")
            formatted_sql = formatted_sql.replace("ON DUPLICATE KEY UPDATE", "--")

        cursor.execute(formatted_sql, params or ())
        if DB_ENGINE == "SQLITE":
            rows = cursor.fetchall()
            return [dict(ix) for ix in rows]
        else:
            return cursor.fetchall()
    finally:
        conn.close()

def query_one(sql, params=None):
    """Execute SELECT query and return single dictionary or None."""
    rows = query_all(sql, params)
    return rows[0] if rows else None

def execute_write(sql, params=None):
    """Execute INSERT/UPDATE/DELETE query and return last inserted ID or row count."""
    conn = get_db()
    try:
        cursor = conn.cursor()
        formatted_sql = sql
        if DB_ENGINE == "SQLITE":
            formatted_sql = formatted_sql.replace("%s", "?")

        cursor.execute(formatted_sql, params or ())
        if DB_ENGINE == "SQLITE":
            conn.commit()
            last_id = cursor.lastrowid
            affected = cursor.rowcount
        else:
            last_id = cursor.lastrowid
            affected = cursor.rowcount
        return {"last_id": last_id, "affected_rows": affected}
    finally:
        conn.close()

def init_db():
    """Initialize database tables and default data."""
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    if not schema_path.exists():
        return

    conn = get_db()
    try:
        cursor = conn.cursor()
        with open(schema_path, "r", encoding="utf-8") as f:
            sql_script = f.read()

        # Split statements
        statements = sql_script.split(";")
        for stmt in statements:
            cleaned = stmt.strip()
            if cleaned and not cleaned.startswith("--"):
                try:
                    if DB_ENGINE == "SQLITE":
                        # Translate MySQL-specific syntax to SQLite compatible
                        sqlite_stmt = cleaned.replace("AUTO_INCREMENT", "AUTOINCREMENT")
                        sqlite_stmt = sqlite_stmt.replace("ENGINE=InnoDB", "")
                        sqlite_stmt = sqlite_stmt.replace("DEFAULT CHARSET=utf8mb4", "")
                        sqlite_stmt = sqlite_stmt.replace("COLLATE utf8mb4_unicode_ci", "")
                        sqlite_stmt = sqlite_stmt.replace("ON DUPLICATE KEY UPDATE", "--")
                        if "CREATE DATABASE" in sqlite_stmt or "USE " in sqlite_stmt:
                            continue
                        cursor.execute(sqlite_stmt)
                    else:
                        cursor.execute(cleaned)
                except Exception as inner_err:
                    # Ignore table already exists or harmless warnings
                    pass
        if DB_ENGINE == "SQLITE":
            conn.commit()
        print(f"[Database] Initialized successfully using engine: {DB_ENGINE}")
    except Exception as e:
        print(f"[Database Error] Schema initialization warning: {e}")
    finally:
        conn.close()
