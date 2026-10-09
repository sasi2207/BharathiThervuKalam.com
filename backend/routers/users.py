"""
Bharathi Thervukalam - Users Management Router
RBAC User accounts, passwords, status changes, and administrative profiles.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserResponse, UserRegister
from auth import get_current_user, get_password_hash

router = APIRouter(prefix="/api/users", tags=["Users Management"])

@router.get("", response_model=List[UserResponse])
def get_all_users(
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(User.status != "DELETED")
    if role:
        query = query.filter(User.role.ilike(f"%{role}%"))
    return query.order_by(User.id.desc()).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

@router.post("", response_model=UserResponse)
async def create_user(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "bharathi123").strip()

    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required.")

    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        role=data.get("role", "student"),
        full_name=data.get("full_name") or username,
        phone_number=data.get("phone") or data.get("phone_number"),
        register_no=data.get("register_no"),
        status="ACTIVE"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    for k, v in data.items():
        if k == "password" and v:
            user.hashed_password = get_password_hash(v)
        elif hasattr(user, k) and v is not None:
            setattr(user, k, v)
    db.commit()
    db.refresh(user)
    return user

@router.patch("/{user_id}", response_model=UserResponse)
async def patch_user(user_id: int, request: Request, db: Session = Depends(get_db)):
    return await update_user(user_id, request, db)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "User archived."}

# Bulk operations
@router.post("/bulk")
async def bulk_create_users(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    count = 0
    for u in data:
        user = User(
            username=u.get("username"),
            email=u.get("email"),
            hashed_password=get_password_hash(u.get("password", "bharathi123")),
            role=u.get("role", "student"),
            full_name=u.get("full_name"),
            status="ACTIVE"
        )
        db.add(user)
        count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.put("/bulk")
async def bulk_update_users(request: Request, db: Session = Depends(get_db)):
    records = await request.json()
    count = 0
    for r in records:
        uid = r.get("id")
        if uid:
            u = db.query(User).filter(User.id == uid).first()
            if u:
                for k, v in r.items():
                    if hasattr(u, k):
                        setattr(u, k, v)
                count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.patch("/bulk")
async def bulk_patch_users(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    updates = data.get("updates", {})
    count = 0
    for uid in ids:
        u = db.query(User).filter(User.id == uid).first()
        if u:
            for k, v in updates.items():
                if hasattr(u, k):
                    setattr(u, k, v)
            count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.delete("/bulk")
async def bulk_delete_users(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    for uid in ids:
        u = db.query(User).filter(User.id == uid).first()
        if u:
            u.status = "DELETED"
    db.commit()
    return {"status": "success", "message": f"{len(ids)} users archived."}
