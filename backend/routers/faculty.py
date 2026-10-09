"""
Bharathi Thervukalam - Faculty & Mentors Directory Router
Instructor bios, designations, subject assignments, and contact channels.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from database import get_db
from models import Faculty, User
from schemas import FacultyCreate, FacultyUpdate, FacultyResponse
from auth import get_current_user

router = APIRouter(prefix="/api/faculty", tags=["Faculty"])

DEFAULT_FACULTY = [
    {
        "name": "Chakarvarthy",
        "username": "Chakarvarthy",
        "designation": "Founder & Chief Mentor",
        "paper": "Paper II & III",
        "subject": "Tamil Nadu Administration, Indian Polity & Current Affairs",
        "experience": "7+ Years Guidance · State Service Officer",
        "phone": "+91 7338757194",
        "category": "TNPSC",
        "status": "ACTIVE"
    },
    {
        "name": "Kannan",
        "username": "Kannan",
        "designation": "Senior Faculty & Coordinator",
        "paper": "Paper I & GS",
        "subject": "General Studies, History & Indian National Movement",
        "experience": "State Service Specialist",
        "phone": "+91 8012194136",
        "category": "TNPSC",
        "status": "ACTIVE"
    },
    {
        "name": "Sakthi",
        "username": "Sakthi",
        "designation": "Academic Advisor & Test Evaluator",
        "paper": "Aptitude & Science",
        "subject": "Aptitude, Mental Ability & Science",
        "experience": "Competitive Exam Strategist",
        "phone": "+91 9791388577",
        "category": "TNPSC",
        "status": "ACTIVE"
    },
    {
        "name": "Prabhu",
        "username": "Prabhu",
        "designation": "Police Services Mentor",
        "paper": "Technical & Forensic",
        "subject": "TNUSRB SI Technical & Forensic Science Guidance",
        "experience": "Uniformed Services Expert",
        "phone": "+91 7904790618",
        "category": "TNUSRB",
        "status": "ACTIVE"
    }
]

def ensure_seeded_faculty(db: Session):
    count = db.query(Faculty).count()
    if count == 0:
        for f in DEFAULT_FACULTY:
            db.add(Faculty(**f))
        db.commit()

@router.get("", response_model=List[FacultyResponse])
def get_all_faculty(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    ensure_seeded_faculty(db)
    query = db.query(Faculty).filter(Faculty.status != "DELETED")
    if category:
        query = query.filter(Faculty.category.ilike(f"%{category}%"))
    return query.order_by(Faculty.id.asc()).all()

@router.get("/{faculty_id}", response_model=FacultyResponse)
def get_faculty_by_id(faculty_id: int, db: Session = Depends(get_db)):
    f = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Faculty member not found.")
    return f

@router.post("", response_model=FacultyResponse)
async def create_or_save_faculty(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    name = data.get("name") or "Mentor"
    f = Faculty(
        name=name,
        username=data.get("username", name.lower().replace(" ", "_")),
        designation=data.get("designation", "Faculty Mentor"),
        subject=data.get("subject", "General Studies"),
        paper=data.get("paper", ""),
        experience=data.get("experience", "State Service Faculty"),
        phone=data.get("phone", "+91 7338757194"),
        email=data.get("email", ""),
        category=data.get("category", "TNPSC"),
        status="ACTIVE"
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

@router.put("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(faculty_id: int, request: Request, db: Session = Depends(get_db)):
    f = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Faculty not found.")
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    for k, v in data.items():
        if hasattr(f, k) and v is not None:
            setattr(f, k, v)
    db.commit()
    db.refresh(f)
    return f

@router.patch("/{faculty_id}", response_model=FacultyResponse)
async def patch_faculty(faculty_id: int, request: Request, db: Session = Depends(get_db)):
    return await update_faculty(faculty_id, request, db)

@router.delete("/{faculty_id}")
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    f = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Faculty not found.")
    f.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Faculty member removed."}

# Bulk operations
@router.post("/bulk")
def bulk_create_faculty(faculty_list: List[FacultyCreate], db: Session = Depends(get_db)):
    created = []
    for item in faculty_list:
        f = Faculty(**item.model_dump())
        db.add(f)
        created.append(f)
    db.commit()
    return {"status": "success", "count": len(created)}

@router.put("/bulk")
def bulk_update_faculty(records: List[Dict[str, Any]], db: Session = Depends(get_db)):
    count = 0
    for r in records:
        fid = r.get("id")
        if fid:
            item = db.query(Faculty).filter(Faculty.id == fid).first()
            if item:
                for k, v in r.items():
                    if hasattr(item, k):
                        setattr(item, k, v)
                count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.patch("/bulk")
async def bulk_patch_faculty(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    updates = data.get("updates", {})
    count = 0
    for fid in ids:
        item = db.query(Faculty).filter(Faculty.id == fid).first()
        if item:
            for k, v in updates.items():
                if hasattr(item, k):
                    setattr(item, k, v)
            count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.delete("/bulk")
async def bulk_delete_faculty(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    for fid in ids:
        item = db.query(Faculty).filter(Faculty.id == fid).first()
        if item:
            item.status = "DELETED"
    db.commit()
    return {"status": "success", "message": f"{len(ids)} faculty members archived."}
