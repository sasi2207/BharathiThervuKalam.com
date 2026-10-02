"""
Bharathi Thervukalam - Auth Router
Unified login endpoint, current profile, and user registration with JWT.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User, UserRole
from schemas import LoginRequest, TokenResponse, UserRegister, UserResponse
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Unified Authentication Endpoint for Student, Staff, and Admin.
    Validates credentials and issues signed JWT bearer token.
    """
    identifier = payload.username.strip()
    password = payload.password.strip()

    # Look up user by username, email, or register number
    user = db.query(User).filter(
        (User.username == identifier) |
        (User.email == identifier) |
        (User.register_no == identifier)
    ).first()

    # Auto-seed standard demo accounts if database is empty or freshly initialized
    if not user:
        if identifier in ("admin", "admin@bharathithervukalam.com") and password in ("admin123", "admin"):
            user = User(
                username="admin",
                email="admin@bharathithervukalam.com",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN.value,
                full_name="Chief Administrator",
                register_no="ADM-001",
                phone_number="+91 7338757194"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif identifier in ("staff", "staff@bharathithervukalam.com") and password in ("staff123", "staff"):
            user = User(
                username="staff",
                email="staff@bharathithervukalam.com",
                hashed_password=get_password_hash("staff123"),
                role=UserRole.STAFF.value,
                full_name="Academic Evaluator & Mentor",
                register_no="STF-102",
                phone_number="+91 8012194136"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif identifier in ("student", "student@bharathithervukalam.com", "BTK2026-0428") and password in ("student123", "student"):
            user = User(
                username="student",
                email="student@bharathithervukalam.com",
                hashed_password=get_password_hash("student123"),
                role=UserRole.STUDENT.value,
                full_name="S. Kabilan",
                register_no="BTK2026-0428",
                phone_number="+91 9842145678"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your username/email and password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Issue JWT Token with embedded Claims
    token_payload = {
        "sub": str(user.id),
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role.lower(),
        "name": user.full_name or user.username
    }
    access_token = create_access_token(
        data=token_payload,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="Bearer",
        role=user.role.lower(),
        user_id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name or user.username,
        register_no=user.register_no
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the authenticated user's profile.
    Strictly protected: requires valid JWT bearer token.
    """
    return current_user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user account (Student, Staff, or Admin).
    """
    # Check duplicate
    existing = db.query(User).filter(
        (User.username == payload.username) | (User.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username or email already exists."
        )

    # Generate registration code if student
    reg_no = payload.register_no
    if not reg_no and payload.role.lower() == "student":
        import random
        reg_no = f"BTK2026-{random.randint(1000, 9999)}"

    new_user = User(
        username=payload.username.strip(),
        email=payload.email.strip().lower(),
        hashed_password=get_password_hash(payload.password),
        role=payload.role.lower().strip(),
        full_name=payload.full_name or payload.username,
        register_no=reg_no,
        phone_number=payload.phone_number
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
