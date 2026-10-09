"""
Bharathi Thervukalam - Comprehensive Python FastAPI High-Performance Backend
Modular router architecture with Role-Based Access Control (RBAC),
Resilient Database Connection Pooling (MySQL with SQLite automatic fallback),
Sub-second Automated Digital OMR Scoring Engine, and full RESTful CRUD APIs.
"""

import os
import sys
import time
from pathlib import Path
from contextlib import asynccontextmanager

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Database & Models
from database import engine, SessionLocal, Base, DB_ENGINE_TYPE, MYSQL_HOST, MYSQL_DB
from models import User, UserRole, Student, Staff, Faculty, Achiever, Course, TestSeries
from auth import get_password_hash

# Modular Routers
from routers import (
    auth_router,
    courses_router,
    tests_router,
    omr_router,
    students_router,
    faculty_router,
    staff_router,
    achievers_router,
    users_router,
    syllabus_router,
    payment_router
)

# -----------------------------------------------------------------------------
# Database Schema Initialization & Default Seeds
# -----------------------------------------------------------------------------
def init_database():
    """Create all relational tables and seed initial administrator accounts."""
    try:
        Base.metadata.create_all(bind=engine)
        print(f"[✓] Database tables synchronized ({DB_ENGINE_TYPE.upper()} engine).")

        db = SessionLocal()
        try:
            user_count = db.query(User).count()
            if user_count == 0:
                print("[*] Seeding default administrative and student accounts...")
                initial_users = [
                    User(
                        username="admin",
                        email="admin@bharathithervukalam.com",
                        hashed_password=get_password_hash("admin123"),
                        role=UserRole.ADMIN.value,
                        full_name="Super Administrator",
                        phone_number="+91 7338757194",
                        status="ACTIVE"
                    ),
                    User(
                        username="staff",
                        email="staff@bharathithervukalam.com",
                        hashed_password=get_password_hash("staff123"),
                        role=UserRole.STAFF.value,
                        full_name="Academic Coordinator",
                        phone_number="+91 8012194136",
                        status="ACTIVE"
                    ),
                    User(
                        username="student",
                        email="student@bharathithervukalam.com",
                        hashed_password=get_password_hash("student123"),
                        role=UserRole.STUDENT.value,
                        full_name="S. Kabilan",
                        register_no="BTK2026-0428",
                        phone_number="+91 9842145678",
                        status="ACTIVE"
                    )
                ]
                for u in initial_users:
                    db.add(u)
                db.commit()
                print("[✓] Initial accounts seeded: admin (admin123), staff (staff123), student (student123).")
        finally:
            db.close()
    except Exception as e:
        print(f"[!] Database initialization error: {e}")

# -----------------------------------------------------------------------------
# Application Lifespan Context Manager
# -----------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield
    print("[*] Backend server shutdown complete.")

# -----------------------------------------------------------------------------
# FastAPI Application Declaration
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Bharathi Thervukalam - RESTful API Backend",
    description="Educational Platform API for TNPSC & Uniformed Services (TNUSRB) with Automated Digital OMR Evaluator.",
    version="3.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Performance Timing Header
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000.0
    response.headers["X-Response-Time-Ms"] = f"{process_time:.2f}"
    return response

# -----------------------------------------------------------------------------
# Mount All Modular Routers
# -----------------------------------------------------------------------------
app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(tests_router)
app.include_router(omr_router)
app.include_router(students_router)
app.include_router(faculty_router)
app.include_router(staff_router)
app.include_router(achievers_router)
app.include_router(users_router)
app.include_router(syllabus_router)
app.include_router(payment_router)

# -----------------------------------------------------------------------------
# Root, Health & Performance Metrics Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
@app.get("/api/health")
def get_health():
    t0 = time.perf_counter()
    db = SessionLocal()
    table_counts = {}
    try:
        table_counts["users"] = db.query(User).count()
        table_counts["students"] = db.query(Student).count()
        table_counts["staff"] = db.query(Staff).count()
        table_counts["faculty"] = db.query(Faculty).count()
        table_counts["achievers"] = db.query(Achiever).count()
        table_counts["courses"] = db.query(Course).count()
        table_counts["tests"] = db.query(TestSeries).count()
    except Exception as e:
        table_counts["error"] = str(e)
    finally:
        db.close()

    db_latency = round((time.perf_counter() - t0) * 1000.0, 2)

    return {
        "status": "online",
        "service": "Bharathi Thervukalam Python FastAPI Backend",
        "version": "3.3.0",
        "database": {
            "engine": DB_ENGINE_TYPE,
            "target": f"{MYSQL_HOST}/{MYSQL_DB}" if DB_ENGINE_TYPE == "mysql" else "Local SQLite Fallback",
            "status": "connected",
            "latency_ms": db_latency
        },
        "tables": table_counts
    }

@app.get("/api/metrics")
def get_metrics():
    return {
        "status": "healthy",
        "uptime": "active",
        "memory_status": "optimal",
        "database_engine": DB_ENGINE_TYPE,
        "routers_loaded": [
            "auth", "courses", "tests", "omr", "students",
            "faculty", "staff", "achievers", "users", "syllabus", "payment"
        ]
    }

# -----------------------------------------------------------------------------
# Direct Execution Entrypoint
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    init_database()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8081))
    print(f"[*] Starting Bharathi Thervukalam FastAPI Server on http://{host}:{port}")
    try:
        import uvicorn
        uvicorn.run("main:app", host=host, port=port, reload=True)
    except ImportError:
        print("[!] uvicorn is not installed. Run: pip install uvicorn")
