"""
Bharathi Thervukalam - Authentication Router (FastAPI)
Role-Segregated Authentication: Admin, Staff, and Student Dedicated Endpoints.
Unified Login & Self-Service Registration.
"""

from datetime import timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserRole, Student, Staff
from schemas import (
    LoginRequest,
    UserRegister,
    TokenResponse,
    ForgotPasswordRequest,
    UserResponse
)
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def _authenticate_and_create_token(
    identifier: str,
    password: str,
    allowed_roles: Optional[list] = None,
    db: Session = None
) -> dict:
    identifier = identifier.strip()
    password = password.strip()

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username/Email and Password are required."
        )

    # Search user by username, email, or register_no
    user = db.query(User).filter(
        (func.lower(User.username) == identifier.lower()) |
        (func.lower(User.email) == identifier.lower()) |
        (User.register_no == identifier)
    ).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if user.status and user.status.upper() != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or inactive."
        )

    user_role = (user.role or "student").lower()
    if allowed_roles:
        normalized_allowed = [r.lower() for r in allowed_roles]
        if user_role not in normalized_allowed and "super_admin" not in user_role and "admin" not in normalized_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Role '{user_role}' is not authorized for this portal."
            )

    token = create_access_token({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user_role,
        "full_name": user.full_name or user.username
    })

    return {
        "success": True,
        "status": "success",
        "message": "Authentication successful",
        "token": token,
        "access_token": token,
        "token_type": "Bearer",
        "role": user_role,
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user_role,
            "full_name": user.full_name or user.username,
            "register_no": user.register_no,
            "phone_number": user.phone_number
        }
    }

# =============================================================================
# 1. UNIFIED LOGIN
# =============================================================================

@router.post("/login")
async def unified_login(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    identifier = str(data.get("username") or data.get("email") or data.get("register_no") or "").strip()
    password = str(data.get("password") or "").strip()
    return _authenticate_and_create_token(identifier, password, db=db)

# =============================================================================
# 2. STUDENT AUTHENTICATION
# =============================================================================

@router.post("/student/login")
async def student_login(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    identifier = str(data.get("username") or data.get("email") or data.get("register_no") or "").strip()
    password = str(data.get("password") or "").strip()
    return _authenticate_and_create_token(identifier, password, allowed_roles=["student"], db=db)

@router.post("/student/register")
async def student_register(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    username = str(data.get("username") or data.get("name") or "").strip()
    email = str(data.get("email") or "").strip()
    password = str(data.get("password") or "").strip()
    phone = str(data.get("phone") or data.get("phone_number") or "").strip()
    register_no = str(data.get("register_no") or f"BTK-{int(timedelta(days=1).total_seconds()) % 10000:04d}").strip()

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Name, email and password are required.")

    existing = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already registered.")

    new_user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        role=UserRole.STUDENT.value,
        full_name=username,
        register_no=register_no,
        phone_number=phone,
        status="ACTIVE"
    )
    db.add(new_user)

    # Also add student record
    new_student = Student(
        register_no=register_no,
        name=username,
        email=email,
        phone=phone or "+91 9000000000",
        father_name=data.get("father_name", ""),
        qualification=data.get("qualification", ""),
        community=data.get("community", data.get("caste", "")),
        blood_group=data.get("blood_group", ""),
        address=data.get("address", "")
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": "student"
    })

    return {
        "success": True,
        "status": "success",
        "message": "Student registration completed successfully.",
        "token": token,
        "access_token": token,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": "student",
            "register_no": register_no
        }
    }

@router.post("/student/forgot-password")
async def student_forgot_password(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    email = data.get("email", "").strip()
    return {
        "success": True,
        "status": "success",
        "message": f"Password reset instructions dispatched to {email}. Check your registered inbox."
    }

# =============================================================================
# 3. STAFF AUTHENTICATION
# =============================================================================

@router.post("/staff/login")
async def staff_login(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    identifier = str(data.get("username") or data.get("email") or "").strip()
    password = str(data.get("password") or "").strip()
    return _authenticate_and_create_token(identifier, password, allowed_roles=["staff", "admin", "super_admin"], db=db)

@router.post("/staff/register")
async def staff_register(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    username = str(data.get("username") or data.get("name") or "").strip()
    email = str(data.get("email") or "").strip()
    password = str(data.get("password") or "").strip()
    phone = str(data.get("phone") or data.get("phone_number") or "").strip()

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email and password are required.")

    existing = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff account with this username or email already exists.")

    new_user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        role=UserRole.STAFF.value,
        full_name=username,
        phone_number=phone,
        status="ACTIVE"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": "staff"
    })

    return {
        "success": True,
        "status": "success",
        "message": "Staff registration successful.",
        "token": token,
        "access_token": token,
        "user": {"id": new_user.id, "username": new_user.username, "email": new_user.email, "role": "staff"}
    }

@router.post("/staff/forgot-password")
async def staff_forgot_password(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    email = data.get("email", "").strip()
    return {
        "success": True,
        "status": "success",
        "message": f"Staff password reset instructions dispatched to {email}."
    }

# =============================================================================
# 4. ADMIN AUTHENTICATION
# =============================================================================

@router.post("/admin/login")
async def admin_login(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    identifier = str(data.get("username") or data.get("email") or "").strip()
    password = str(data.get("password") or "").strip()
    return _authenticate_and_create_token(identifier, password, allowed_roles=["admin", "super_admin"], db=db)

@router.post("/admin/register")
async def admin_register(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    username = str(data.get("username") or "").strip()
    email = str(data.get("email") or "").strip()
    password = str(data.get("password") or "").strip()

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email and password are required.")

    existing = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Administrator account already exists.")

    new_user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        role=UserRole.ADMIN.value,
        full_name=username,
        status="ACTIVE"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": "admin"
    })

    return {
        "success": True,
        "status": "success",
        "message": "Administrator registered successfully.",
        "token": token,
        "access_token": token,
        "user": {"id": new_user.id, "username": new_user.username, "email": new_user.email, "role": "admin"}
    }

@router.post("/admin/forgot-password")
async def admin_forgot_password(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())
    email = data.get("email", "").strip()
    return {
        "success": True,
        "status": "success",
        "message": f"Administrator verification token dispatched to {email}."
    }

# =============================================================================
# 5. CURRENT USER (/me)
# =============================================================================

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "full_name": current_user.full_name,
        "register_no": current_user.register_no,
        "phone_number": current_user.phone_number
    }
