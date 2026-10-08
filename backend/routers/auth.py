"""
Bharathi Thervukalam - Role-Based Auth Router (FastAPI)
Strict database-only dynamic authentication with JWT.
Dedicated endpoints for Admin, Staff, and Student roles.
"""

from datetime import timedelta
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import LoginRequest, TokenResponse, UserRegister, UserResponse
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# =============================================================================
# INTERNAL HELPER: AUTHENTICATE & ISSUE TOKEN
# =============================================================================

def _authenticate_and_issue_token(
    payload: LoginRequest,
    db: Session,
    allowed_roles: list[str],
    role_label: str,
) -> TokenResponse:
    identifier = payload.username.strip()
    password = payload.password.strip()

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username/email and password are required.",
        )

    # Search user by username, email, or register_no
    user = db.query(User).filter(
        (func.lower(User.username) == identifier.lower()) |
        (func.lower(User.email) == identifier.lower()) |
        (User.register_no == identifier)
    ).first()

    # User existence and password validation
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your username and password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Strict Role Guard: Ensure user belongs to the designated portal
    user_role = str(user.role).strip().lower() if user.role else "student"
    allowed = [r.lower() for r in allowed_roles]
    if user_role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. You do not have permissions for the {role_label} portal.",
        )

    # Optional account status verification
    if hasattr(user, "status") and user.status and user.status.upper() != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended. Please contact administrator.",
        )

    # Create signed JWT token
    token_payload = {
        "sub": str(user.id),
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user_role,
        "name": user.full_name or user.username,
    }

    access_token = create_access_token(
        data=token_payload,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=access_token,
        token_type="Bearer",
        role=user_role,
        user_id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name or user.username,
        register_no=user.register_no,
    )


# =============================================================================
# 1. ADMIN AUTHENTICATION (/api/auth/admin/...)
# =============================================================================

@router.post("/admin/login", response_model=TokenResponse)
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Dedicated Admin Login:
    Accepts only users with 'admin' or 'super_admin' roles.
    """
    return _authenticate_and_issue_token(
        payload=payload,
        db=db,
        allowed_roles=["admin", "super_admin"],
        role_label="Admin",
    )


@router.post("/admin/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def admin_register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register an Admin account into the database.
    """
    clean_username = payload.username.strip()
    clean_email = payload.email.strip().lower()

    existing = db.query(User).filter(
        (func.lower(User.username) == clean_username.lower()) |
        (func.lower(User.email) == clean_email)
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username or email already exists.",
        )

    new_admin = User(
        username=clean_username,
        email=clean_email,
        hashed_password=get_password_hash(payload.password.strip()),
        role="admin",
        full_name=(payload.full_name or clean_username).strip(),
        phone_number=payload.phone_number.strip() if payload.phone_number else None,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin


# =============================================================================
# 2. STAFF AUTHENTICATION (/api/auth/staff/...)
# =============================================================================

@router.post("/staff/login", response_model=TokenResponse)
def staff_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Dedicated Staff Login:
    Accepts only users with 'staff', 'instructor', or 'faculty' roles.
    """
    return _authenticate_and_issue_token(
        payload=payload,
        db=db,
        allowed_roles=["staff", "instructor", "faculty"],
        role_label="Staff",
    )


@router.post("/staff/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def staff_register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register a Staff/Faculty account into the database.
    """
    clean_username = payload.username.strip()
    clean_email = payload.email.strip().lower()

    existing = db.query(User).filter(
        (func.lower(User.username) == clean_username.lower()) |
        (func.lower(User.email) == clean_email)
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A staff member with this username or email already exists.",
        )

    new_staff = User(
        username=clean_username,
        email=clean_email,
        hashed_password=get_password_hash(payload.password.strip()),
        role="staff",
        full_name=(payload.full_name or clean_username).strip(),
        phone_number=payload.phone_number.strip() if payload.phone_number else None,
    )

    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff


# =============================================================================
# 3. STUDENT AUTHENTICATION (/api/auth/student/...)
# =============================================================================

@router.post("/student/login", response_model=TokenResponse)
def student_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Dedicated Student Login:
    Accepts only users with the 'student' role.
    """
    return _authenticate_and_issue_token(
        payload=payload,
        db=db,
        allowed_roles=["student"],
        role_label="Student",
    )


@router.post("/student/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def student_register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new Student account with auto-generated Roll Number.
    """
    clean_username = payload.username.strip()
    clean_email = payload.email.strip().lower()

    existing = db.query(User).filter(
        (func.lower(User.username) == clean_username.lower()) |
        (func.lower(User.email) == clean_email)
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this username or email already exists.",
        )

    # Generate student register/roll number if not provided
    reg_no = payload.register_no or f"BTK2026-{random.randint(1000, 9999)}"

    new_student = User(
        username=clean_username,
        email=clean_email,
        hashed_password=get_password_hash(payload.password.strip()),
        role="student",
        register_no=reg_no,
        full_name=(payload.full_name or clean_username).strip(),
        phone_number=payload.phone_number.strip() if payload.phone_number else None,
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


# =============================================================================
# 4. CURRENT USER PROFILE (/api/auth/me)
# =============================================================================

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the authenticated user's profile for any logged-in role.
    """
    return current_user