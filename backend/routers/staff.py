"""
Bharathi Thervukalam - Staff Administration Router
Academic coordinators, administrative officers, exam invigilators, and profile management.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from database import get_db
from models import Staff, User
from schemas import StaffCreate, StaffUpdate, StaffResponse
from auth import get_current_user

router = APIRouter(prefix="/api/staff", tags=["Staff Administration"])

DEFAULT_STAFF = [
    {
        "staff_id": "STF-2026-001",
        "name": "Administrative Coordinator",
        "email": "staff@bharathithervukalam.com",
        "phone": "+91 7338757194",
        "designation": "Head of Examinations",
        "department": "Competitive Exams Cell",
        "role": "ACADEMIC_COORDINATOR",
        "status": "ACTIVE"
    },
    {
        "staff_id": "STF-2026-002",
        "name": "M. Senthilkumar",
        "email": "senthil@bharathithervukalam.com",
        "phone": "+91 8012194136",
        "designation": "Senior Evaluation Officer",
        "department": "OMR & Test Analytics",
        "role": "EVALUATOR",
        "status": "ACTIVE"
    }
]

def ensure_seeded_staff(db: Session):
    count = db.query(Staff).count()
    if count == 0:
        for s in DEFAULT_STAFF:
            db.add(Staff(**s))
        db.commit()

@router.get("", response_model=List[StaffResponse])
def get_all_staff(db: Session = Depends(get_db)):
    ensure_seeded_staff(db)
    return db.query(Staff).filter(Staff.status != "DELETED").order_by(Staff.id.asc()).all()

@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff_by_id(staff_id: int, db: Session = Depends(get_db)):
    s = db.query(Staff).filter(Staff.id == staff_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Staff coordinator not found.")
    return s

@router.post("", response_model=StaffResponse)
async def create_staff(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    name = data.get("name") or "Staff Member"
    staff_id = data.get("staff_id") or f"STF-{db.query(Staff).count() + 10:03d}"
    s = Staff(
        staff_id=staff_id,
        name=name,
        email=data.get("email") or f"{name.lower().replace(' ', '')}@bharathithervukalam.com",
        phone=data.get("phone") or "+91 7338757194",
        designation=data.get("designation") or "Academic Coordinator",
        department=data.get("department") or "Academics",
        role=data.get("role") or "STAFF",
        status="ACTIVE"
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff(staff_id: int, request: Request, db: Session = Depends(get_db)):
    s = db.query(Staff).filter(Staff.id == staff_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    for k, v in data.items():
        if hasattr(s, k) and v is not None:
            setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s

@router.patch("/{staff_id}", response_model=StaffResponse)
async def patch_staff(staff_id: int, request: Request, db: Session = Depends(get_db)):
    return await update_staff(staff_id, request, db)

@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    s = db.query(Staff).filter(Staff.id == staff_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    s.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Staff member removed."}

# Bulk operations
@router.post("/bulk")
def bulk_create_staff(staff_list: List[StaffCreate], db: Session = Depends(get_db)):
    created = []
    for item in staff_list:
        s = Staff(**item.model_dump())
        db.add(s)
        created.append(s)
    db.commit()
    return {"status": "success", "count": len(created)}

@router.put("/bulk")
def bulk_update_staff(records: List[Dict[str, Any]], db: Session = Depends(get_db)):
    count = 0
    for r in records:
        sid = r.get("id")
        if sid:
            item = db.query(Staff).filter(Staff.id == sid).first()
            if item:
                for k, v in r.items():
                    if hasattr(item, k):
                        setattr(item, k, v)
                count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.patch("/bulk")
async def bulk_patch_staff(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    updates = data.get("updates", {})
    count = 0
    for sid in ids:
        item = db.query(Staff).filter(Staff.id == sid).first()
        if item:
            for k, v in updates.items():
                if hasattr(item, k):
                    setattr(item, k, v)
            count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.delete("/bulk")
async def bulk_delete_staff(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    for sid in ids:
        item = db.query(Staff).filter(Staff.id == sid).first()
        if item:
            item.status = "DELETED"
    db.commit()
    return {"status": "success", "message": f"{len(ids)} staff members archived."}
