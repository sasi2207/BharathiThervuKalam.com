import sqlite3
from pathlib import Path

# Explicitly store DB inside the backend directory
CURRENT_DIR = Path(__file__).resolve().parent
DB_PATH = CURRENT_DIR / "database.py"

print(f"[*] Creating database at: {DB_PATH}")

conn = sqlite3.connect(str(DB_PATH))
conn.execute("PRAGMA journal_mode = WAL;")
conn.execute("PRAGMA foreign_keys = ON;")

schema_sql = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    register_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    father_name TEXT,
    dob TEXT,
    qualification TEXT,
    community TEXT,
    blood_group TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    subject TEXT NOT NULL,
    paper TEXT NOT NULL,
    experience TEXT,
    phone TEXT,
    email TEXT,
    category TEXT DEFAULT 'TNPSC',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS achievers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    posting TEXT NOT NULL,
    department TEXT,
    exam TEXT NOT NULL,
    rank TEXT,
    year TEXT,
    hometown TEXT,
    story TEXT,
    category TEXT DEFAULT 'group4',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'TNPSC',
    syllabus TEXT,
    description TEXT,
    standard TEXT,
    duration TEXT,
    fees REAL DEFAULT 0,
    filename TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'TNPSC',
    department TEXT,
    paper TEXT,
    standard TEXT DEFAULT 'Question',
    total_questions INTEGER DEFAULT 25,
    duration_minutes INTEGER DEFAULT 180,
    positive_mark REAL DEFAULT 1.5,
    negative_mark REAL DEFAULT 0.0,
    test_date TEXT,
    filename TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS omr_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    question_no INTEGER NOT NULL,
    correct_option TEXT NOT NULL,
    marks REAL DEFAULT 1.5,
    explanation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_id, question_no)
);

CREATE TABLE IF NOT EXISTS omr_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_code TEXT UNIQUE NOT NULL,
    test_id INTEGER NOT NULL,
    student_roll_no TEXT NOT NULL,
    student_name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    attempted_count INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    incorrect_count INTEGER NOT NULL,
    unshaded_count INTEGER NOT NULL,
    raw_score REAL NOT NULL,
    max_marks REAL NOT NULL,
    percentage REAL NOT NULL,
    accuracy REAL NOT NULL,
    simulated_rank INTEGER,
    cutoff_zone TEXT,
    candidate_answers_json TEXT,
    breakdown_json TEXT,
    time_spent_seconds INTEGER DEFAULT 3600,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms REAL NOT NULL,
    db_query_time_ms REAL NOT NULL,
    record_count INTEGER DEFAULT 1,
    batch_size INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

cursor = conn.cursor()
cursor.executescript(schema_sql)
conn.commit()

# Default admin & student seed
cursor.execute("SELECT count(*) FROM users")
if cursor.fetchone()[0] == 0:
    cursor.execute("""
        INSERT INTO users (email, username, password_hash, role, status, phone)
        VALUES ('admin@bharathithervukalam.com', 'admin', 'admin123', 'SUPER_ADMIN', 'ACTIVE', '+91 7338757194')
    """)
    conn.commit()

# Print and verify tables in terminal
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
tables = [row[0] for row in cursor.fetchall()]

print("\n========================================")
print(f"SUCCESS! Total tables created: {len(tables)}")
print("Tables:", tables)
print("========================================\n")
conn.close()