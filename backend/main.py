"""
Bharathi Thervukalam - FastAPI Python + MySQL Backend Application
Production-ready with strict JWT Authentication and Role-Based Access Control (RBAC).
"""

import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import User, UserRole
from auth import get_password_hash

# Routers
from routers.auth import router as auth_router
from routers.courses import router as courses_router
from routers.test_series import router as test_series_router
from routers.achievers import router as achievers_router
from routers.omr import router as omr_router

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bharathi Thervukalam - Secure RBAC & JWT API Server",
    description="TNPSC & TNUSRB Educational Platform Backend with strict Role-Based Access Control.",
    version="2.5.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(test_series_router)
app.include_router(achievers_router)
app.include_router(omr_router)

@app.on_event("startup")
def startup_db_seed():
    """
    Ensure the database schema has the required default accounts on startup:
    1. Admin:   admin / admin123
    2. Staff:   staff / staff123
    3. Student: student / student123
    """
    from database import SessionLocal
    db = SessionLocal()
    try:
        # 1. Admin
        if not db.query(User).filter(User.username == "admin").first():
            admin_user = User(
                username="admin",
                email="admin@bharathithervukalam.com",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN.value,
                full_name="Chief Administrator",
                register_no="ADM-001",
                phone_number="+91 7338757194"
            )
            db.add(admin_user)

        # 2. Staff
        if not db.query(User).filter(User.username == "staff").first():
            staff_user = User(
                username="staff",
                email="staff@bharathithervukalam.com",
                hashed_password=get_password_hash("staff123"),
                role=UserRole.STAFF.value,
                full_name="Academic Evaluator & Mentor",
                register_no="STF-102",
                phone_number="+91 8012194136"
            )
            db.add(staff_user)

        # 3. Student
        if not db.query(User).filter(User.username == "student").first():
            student_user = User(
                username="student",
                email="student@bharathithervukalam.com",
                hashed_password=get_password_hash("student123"),
                role=UserRole.STUDENT.value,
                full_name="S. Kabilan",
                register_no="BTK2026-0428",
                phone_number="+91 9842145678"
            )
            db.add(student_user)

        db.commit()
        print("[Startup] Verified default security credentials in database.")
    except Exception as e:
        db.rollback()
        print(f"[Startup Warning] Seeding: {e}")
    finally:
        db.close()

@app.get("/")
@app.get("/api/health")
def root_health():
    return {
        "service": "Bharathi Thervukalam Python Backend (FastAPI + MySQL)",
        "status": "online",
        "authentication": "Strict JWT Bearer Required",
        "rbac_roles": ["student", "staff", "admin"],
        "modules": [
            "Authentication (POST /api/auth/login, GET /api/auth/me)",
            "Courses (GET auth, POST/PUT/DELETE admin)",
            "Test Series (GET auth, POST/PUT staff+admin, DELETE admin)",
            "Achievers (GET auth, POST/PUT staff+admin, DELETE admin)",
            "OMR Sheets (GET scoped, POST all, PUT staff+admin, DELETE admin)"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting FastAPI RBAC server on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=False)
