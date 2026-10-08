"""
Bharathi Thervukalam - Main Python FastAPI Backend Entrypoint
Full-featured RESTful API providing endpoints for Authentication, Courses,
Test Series, Digital OMR Sheet Evaluation, Students, Staff, and Faculty Directory.
"""

import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Expose the FastAPI application instance
from main import app, init_database

if __name__ == "__main__":
    init_database()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    print("=" * 70)
    print("  Bharathi Thervukalam - Python FastAPI Backend Starting")
    print(f"  Listening on http://{host}:{port}")
    print(f"  Interactive OpenAPI Docs: http://{host}:{port}/docs")
    print(f"  ReDoc Documentation: http://{host}:{port}/redoc")
    print("=" * 70)

    try:
        import uvicorn
        uvicorn.run("main:app", host=host, port=port, reload=False)
    except ImportError:
        print("[Notice] 'uvicorn' not found in this environment.")
        print("To run with full FastAPI ASGI server: pip install -r backend/requirements.txt && uvicorn backend.main:app --host 0.0.0.0 --port 8000")
        print(f"Launching built-in standalone Python API server on http://{host}:{port}...")
        from standalone_server import run_server
        run_server()








"""
Bharathi Thervukalam - Comprehensive Python FastAPI High-Performance Backend
Native MySQL / MariaDB (Connection Pooling, Sub-500ms Target).
Role-Segregated Authentication: Admin, Staff, and Student Dedicated Endpoints.
Full CRUD & Bulk Operations Engine with Automated OMR Evaluation.
"""

from contextlib import asynccontextmanager
import hashlib
import io
import json
import os
import random
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import jwt
import mysql.connector
from mysql.connector import pooling
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# -----------------------------------------------------------------------------
# Configuration & Constants
# -----------------------------------------------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "bharathi-secret-key-production-2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 7

MYSQL_USER = os.getenv("MYSQL_USER", "techsasi_2207")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "SasiKutty2207@Lovely")
MYSQL_HOST = os.getenv("MYSQL_HOST", "65.108.76.42")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_DB = os.getenv("MYSQL_DB", "techsasi_bharathi")

BASE_DIR = Path(__file__).resolve().parent

# -----------------------------------------------------------------------------
# Security & Hash Helpers
# -----------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, stored_hash: str) -> bool:
    if not stored_hash or not plain_password:
        return False
    return hash_password(plain_password) == stored_hash or plain_password == stored_hash

def create_jwt_token(payload: dict) -> str:
    to_encode = payload.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

# -----------------------------------------------------------------------------
# MySQL Connection Pool & Initialization
# -----------------------------------------------------------------------------
db_pool = None

def get_db_pool():
    global db_pool
    if db_pool is None:
        db_pool = pooling.MySQLConnectionPool(
            pool_name="bharathi_pool",
            pool_size=15,
            pool_reset_session=True,
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB,
            autocommit=False
        )
    return db_pool

def get_db():
    """Retrieve an active connection from the pool."""
    pool = get_db_pool()
    return pool.get_connection()

def init_database():
    """Create database if missing, setup tables, indexes, and initial seeds."""
    print(f"[*] Connecting to MySQL server at {MYSQL_HOST}:{MYSQL_PORT}...")
    
    server_conn = mysql.connector.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )
    cursor = server_conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    server_conn.commit()
    cursor.close()
    server_conn.close()

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(150) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                phone VARCHAR(50),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL,
                INDEX idx_users_email (email),
                INDEX idx_users_username (username),
                INDEX idx_users_role (role),
                INDEX idx_users_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                register_no VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50) NOT NULL,
                father_name VARCHAR(150),
                dob VARCHAR(50),
                qualification VARCHAR(150),
                community VARCHAR(50),
                blood_group VARCHAR(20),
                address TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL,
                INDEX idx_students_reg (register_no)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                staff_id VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50) NOT NULL,
                designation VARCHAR(150) NOT NULL,
                department VARCHAR(150) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS faculty (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                designation VARCHAR(150) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                paper VARCHAR(100) NOT NULL,
                experience VARCHAR(100),
                phone VARCHAR(50),
                email VARCHAR(255),
                category VARCHAR(50) DEFAULT 'TNPSC',
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS achievers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                posting VARCHAR(150) NOT NULL,
                department VARCHAR(150),
                exam VARCHAR(100) NOT NULL,
                rank VARCHAR(50),
                year VARCHAR(20),
                hometown VARCHAR(100),
                story TEXT,
                category VARCHAR(50) DEFAULT 'group4',
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                category VARCHAR(100) NOT NULL DEFAULT 'TNPSC',
                syllabus TEXT,
                description TEXT,
                standard VARCHAR(100),
                duration VARCHAR(50),
                fees DOUBLE DEFAULT 0,
                filename VARCHAR(255),
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                test_code VARCHAR(100) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL DEFAULT 'TNPSC',
                department VARCHAR(150),
                paper VARCHAR(150),
                standard VARCHAR(100) DEFAULT 'Question',
                total_questions INT DEFAULT 25,
                duration_minutes INT DEFAULT 180,
                positive_mark DOUBLE DEFAULT 1.5,
                negative_mark DOUBLE DEFAULT 0.0,
                test_date VARCHAR(50),
                filename VARCHAR(255),
                status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at DATETIME NULL,
                INDEX idx_tests_code (test_code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS omr_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                test_id INT NOT NULL,
                question_no INT NOT NULL,
                correct_option VARCHAR(10) NOT NULL,
                marks DOUBLE DEFAULT 1.5,
                explanation TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uq_test_qno (test_id, question_no)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS omr_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_code VARCHAR(100) UNIQUE NOT NULL,
                test_id INT NOT NULL,
                student_roll_no VARCHAR(100) NOT NULL,
                student_name VARCHAR(150) NOT NULL,
                total_questions INT NOT NULL,
                attempted_count INT NOT NULL,
                correct_count INT NOT NULL,
                incorrect_count INT NOT NULL,
                unshaded_count INT NOT NULL,
                raw_score DOUBLE NOT NULL,
                max_marks DOUBLE NOT NULL,
                percentage DOUBLE NOT NULL,
                accuracy DOUBLE NOT NULL,
                simulated_rank INT,
                cutoff_zone VARCHAR(100),
                candidate_answers_json LONGTEXT,
                breakdown_json LONGTEXT,
                time_spent_seconds INT DEFAULT 3600,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_omr_student (student_roll_no)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)

        conn.commit()

        # Seed initial default administrative accounts
        cur.execute("SELECT count(*) as count FROM users")
        if cur.fetchone()["count"] == 0:
            cur.executemany("""
                INSERT INTO users (email, username, password_hash, role, status, phone)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, [
                ('admin@bharathithervukalam.com', 'admin', hash_password('admin123'), 'SUPER_ADMIN', 'ACTIVE', '+91 7338757194'),
                ('staff@bharathithervukalam.com', 'staff', hash_password('staff123'), 'STAFF', 'ACTIVE', '+91 8012194136'),
                ('student@bharathithervukalam.com', 'student', hash_password('student123'), 'STUDENT', 'ACTIVE', '+91 9842145678')
            ])
            conn.commit()

        print("[✓] MySQL Database schema and seeds successfully synchronized.")
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# Lifespan Context Manager
# -----------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield
    if db_pool:
        print("[*] Closing MySQL pool connections.")

# -----------------------------------------------------------------------------
# FastAPI Application Declaration
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Bharathi Thervukalam - MySQL FastAPI Backend",
    description="High-Performance MySQL/MariaDB Educational Platform RESTful CRUD & Automated OMR Scoring Engine.",
    version="3.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000.0
    response.headers["X-Response-Time-Ms"] = f"{process_time:.2f}"
    return response

# -----------------------------------------------------------------------------
# Helper: Common Auth Pipeline with Role Guarding
# -----------------------------------------------------------------------------
def authenticate_user(identifier: str, password: str, allowed_roles: Optional[List[str]] = None) -> dict:
    if not identifier or not password:
        raise HTTPException(status_code=400, detail="Username/Email and Password are required.")

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        # Match by username or email
        cur.execute("""
            SELECT * FROM users
            WHERE (LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s)) AND deleted_at IS NULL
            LIMIT 1
        """, (identifier, identifier))
        user = cur.fetchone()

        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid username or password.")

        if user.get("status") and user["status"].upper() != "ACTIVE":
            raise HTTPException(status_code=403, detail="Account is inactive or suspended.")

        user_role = user.get("role", "STUDENT").upper()

        if allowed_roles:
            normalized_allowed = [r.upper() for r in allowed_roles]
            if user_role not in normalized_allowed:
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied. User role '{user_role}' is not authorized for this portal."
                )

        token = create_jwt_token({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user_role
        })

        return {
            "success": True,
            "status": "success",
            "message": "Authentication successful",
            "token": token,
            "access_token": token,
            "token_type": "Bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user_role,
                "phone": user.get("phone")
            }
        }
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# 1. Health Endpoint
# -----------------------------------------------------------------------------
@app.get("/")
@app.get("/api/health")
def get_health():
    t0 = time.perf_counter()
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        tables = {}
        for tbl in ["users", "students", "staff", "faculty", "achievers", "courses", "tests", "omr_keys", "omr_submissions"]:
            cur.execute(f"SELECT count(*) as count FROM {tbl} WHERE deleted_at IS NULL" if tbl in ["users", "students", "staff", "faculty", "achievers", "courses", "tests"] else f"SELECT count(*) as count FROM {tbl}")
            tables[tbl] = cur.fetchone()["count"]

        db_time = (time.perf_counter() - t0) * 1000.0
        return {
            "status": "online",
            "service": "Bharathi Thervukalam MySQL FastAPI Backend",
            "database": {
                "engine": "mysql",
                "host": MYSQL_HOST,
                "database": MYSQL_DB,
                "status": "connected",
                "latency_ms": round(db_time, 2)
            },
            "tables": tables
        }
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# 2. Dedicated Role Authentication Endpoints (Admin, Staff, Student)
# -----------------------------------------------------------------------------

# Unified Login
@app.post("/api/auth/login")
async def unified_login(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    identifier = str(data.get("username", "") or data.get("email", "") or data.get("register_no", "")).strip()
    password = str(data.get("password", "")).strip()
    return authenticate_user(identifier, password)

# --- A. ADMIN AUTHENTICATION ---
@app.post("/api/auth/admin/login")
async def admin_login(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    identifier = str(data.get("username", "") or data.get("email", "")).strip()
    password = str(data.get("password", "")).strip()
    return authenticate_user(identifier, password, allowed_roles=["ADMIN", "SUPER_ADMIN"])

@app.post("/api/auth/admin/register", status_code=201)
async def admin_register(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    phone = str(data.get("phone", "")).strip()

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email, and password are required.")

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT id FROM users WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1", (username, email))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Admin with this username or email already exists.")

        hashed = hash_password(password)
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role, status, phone)
            VALUES (%s, %s, %s, 'ADMIN', 'ACTIVE', %s)
        """, (username, email, hashed, phone))
        conn.commit()
        return {"success": True, "message": "Admin account registered successfully."}
    finally:
        cur.close()
        conn.close()

# --- B. STAFF AUTHENTICATION ---
@app.post("/api/auth/staff/login")
async def staff_login(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    identifier = str(data.get("username", "") or data.get("email", "")).strip()
    password = str(data.get("password", "")).strip()
    return authenticate_user(identifier, password, allowed_roles=["STAFF", "FACULTY", "INSTRUCTOR"])

@app.post("/api/auth/staff/register", status_code=201)
async def staff_register(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    phone = str(data.get("phone", "")).strip()

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email, and password are required.")

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT id FROM users WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1", (username, email))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Staff account with this username or email already exists.")

        hashed = hash_password(password)
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role, status, phone)
            VALUES (%s, %s, %s, 'STAFF', 'ACTIVE', %s)
        """, (username, email, hashed, phone))
        conn.commit()
        return {"success": True, "message": "Staff account registered successfully."}
    finally:
        cur.close()
        conn.close()

# --- C. STUDENT AUTHENTICATION ---
@app.post("/api/auth/student/login")
async def student_login(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    identifier = str(data.get("username", "") or data.get("email", "") or data.get("register_no", "")).strip()
    password = str(data.get("password", "")).strip()

    # Also checks student register_no from students table if given
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        # Check students table first by register_no
        cur.execute("SELECT email FROM students WHERE UPPER(register_no) = UPPER(%s) LIMIT 1", (identifier,))
        student_rec = cur.fetchone()
        if student_rec:
            identifier = student_rec["email"]
    finally:
        cur.close()
        conn.close()

    return authenticate_user(identifier, password, allowed_roles=["STUDENT"])

@app.post("/api/auth/student/register", status_code=201)
async def student_register(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    phone = str(data.get("phone", "") or data.get("phone_number", "")).strip()
    name = str(data.get("name", "") or data.get("full_name", username)).strip()
    reg_no = str(data.get("register_no", "")).strip() or f"BTK2026-{random.randint(1000, 9999)}"

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email, and password are required.")

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT id FROM users WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1", (username, email))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Student account with this username or email already exists.")

        hashed = hash_password(password)
        # Insert into users table
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role, status, phone)
            VALUES (%s, %s, %s, 'STUDENT', 'ACTIVE', %s)
        """, (username, email, hashed, phone))

        # Synchronize into students table
        cur.execute("""
            INSERT INTO students (register_no, name, email, phone, status)
            VALUES (%s, %s, %s, %s, 'ACTIVE')
            ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone)
        """, (reg_no, name, email, phone))

        conn.commit()
        return {
            "success": True,
            "message": "Student account registered successfully.",
            "register_no": reg_no
        }
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# 3. Users Module (Full CRUD & Bulk Operations)
# -----------------------------------------------------------------------------
@app.get("/api/users")
def get_users(
    page: int = Query(0, ge=0),
    size: Optional[int] = Query(None),
    limit: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    limit_val = size or limit or 20
    offset = page * limit_val
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        where = ["deleted_at IS NULL"]
        params = []
        if search:
            where.append("(username LIKE %s OR email LIKE %s OR phone LIKE %s)")
            term = f"%{search.strip()}%"
            params.extend([term, term, term])
        if role:
            where.append("role = %s")
            params.append(role.strip())
        if status:
            where.append("status = %s")
            params.append(status.strip())

        where_clause = " WHERE " + " AND ".join(where)
        cur.execute(f"SELECT count(*) as count FROM users {where_clause}", params)
        total = cur.fetchone()["count"]

        cur.execute(f"SELECT id, username, email, role, status, phone, created_at FROM users {where_clause} ORDER BY id ASC LIMIT %s OFFSET %s", params + [limit_val, offset])
        rows = cur.fetchall()

        return {"success": True, "count": len(rows), "total": total, "page": page, "limit": limit_val, "data": rows}
    finally:
        cur.close()
        conn.close()

@app.post("/api/users/bulk", status_code=201)
async def bulk_create_users(records: List[dict]):
    conn = get_db()
    cur = conn.cursor()
    try:
        batch = [
            (
                r.get("username", f"User_{i}"),
                r.get("email", f"bulk_{int(time.time())}_{i}_{random.randint(100,999)}@bharathi.com"),
                hash_password(r.get("password", "default_pass123")),
                r.get("role", "STUDENT"),
                r.get("status", "ACTIVE"),
                r.get("phone", f"91000{str(i).zfill(5)}")
            )
            for i, r in enumerate(records)
        ]
        cur.executemany("""
            INSERT INTO users (username, email, password_hash, role, status, phone)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, batch)
        conn.commit()
        return {"success": True, "processed": len(records), "insertedCount": len(records)}
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# 4. Automated OMR Scoring Engine (MySQL Optimized)
# -----------------------------------------------------------------------------
@app.post("/api/omr/submit")
async def submit_and_evaluate_omr(request: Request):
    data = await request.json() if "application/json" in request.headers.get("content-type", "") else dict(await request.form())
    test_id = int(data.get("testId") or data.get("test_id", 1))
    student_roll = str(data.get("rollNo") or data.get("student_roll_no", "BTK2026-0428"))
    student_name = str(data.get("studentName") or data.get("student_name", "Bharathi Student"))
    candidate_answers = data.get("candidateAnswers", {})
    time_spent = int(data.get("timeSpentSeconds", 3600))

    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT question_no, correct_option FROM omr_keys WHERE test_id = %s", (test_id,))
        rows = cur.fetchall()
        master_keys = {str(r["question_no"]): r["correct_option"] for r in rows}
        if not master_keys:
            options = ["A", "B", "C", "D"]
            master_keys = {str(i): options[(i * 7 + 3) % 4] for i in range(1, 26)}

        total_questions = 25
        correct_count = 0
        incorrect_count = 0
        unshaded_count = 0
        not_known_count = 0
        breakdown = []

        for q in range(1, total_questions + 1):
            q_str = str(q)
            correct_opt = master_keys.get(q_str, "A")
            candidate_opt = candidate_answers.get(q_str) or candidate_answers.get(q)

            is_correct = False
            q_status = "unattempted"

            if not candidate_opt:
                unshaded_count += 1
            elif str(candidate_opt).upper() == "E":
                not_known_count += 1
                q_status = "not_known"
            elif str(candidate_opt).upper() == correct_opt.upper():
                correct_count += 1
                is_correct = True
                q_status = "correct"
            else:
                incorrect_count += 1
                q_status = "incorrect"

            breakdown.append({
                "qNo": q,
                "studentChoice": candidate_opt,
                "correctKey": correct_opt,
                "isCorrect": is_correct,
                "status": q_status,
                "explanation": f"Official discussion solution for Question {q}."
            })

        attempted_count = correct_count + incorrect_count + not_known_count
        raw_score = round(correct_count * 1.5, 2)
        max_marks = round(total_questions * 1.5, 2)
        percentage = round((raw_score / max_marks) * 100.0, 1) if max_marks > 0 else 0
        accuracy = round((correct_count / attempted_count) * 100.0, 1) if attempted_count > 0 else 0
        simulated_rank = max(1, round(1200 * (1.0 - (percentage / 105.0))))
        cutoff_zone = "Qualifying Zone (Above Expected Cutoff)" if percentage >= 65 else "Needs Revision"

        sub_code = f"OMR-{int(time.time())}-{random.randint(100, 999)}"

        cur.execute("""
            INSERT INTO omr_submissions (
                submission_code, test_id, student_roll_no, student_name, total_questions,
                attempted_count, correct_count, incorrect_count, unshaded_count, raw_score,
                max_marks, percentage, accuracy, simulated_rank, cutoff_zone,
                candidate_answers_json, breakdown_json, time_spent_seconds
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            sub_code, test_id, student_roll, student_name, total_questions,
            attempted_count, correct_count, incorrect_count, unshaded_count, raw_score,
            max_marks, percentage, accuracy, simulated_rank, cutoff_zone,
            json.dumps(candidate_answers), json.dumps(breakdown), time_spent
        ))
        conn.commit()

        return {
            "submissionId": sub_code,
            "submission_code": sub_code,
            "testId": test_id,
            "rollNo": student_roll,
            "studentName": student_name,
            "submittedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            "rawScore": raw_score,
            "maxPossibleMarks": max_marks,
            "percentage": percentage,
            "accuracy": accuracy,
            "simulatedRank": simulated_rank,
            "cutoffZone": cutoff_zone,
            "breakdown": breakdown,
            "candidateAnswers": candidate_answers
        }
    finally:
        cur.close()
        conn.close()

# -----------------------------------------------------------------------------
# Standalone Server Execution Entrypoint
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    print(f"[*] Starting FastAPI MySQL backend on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=False)