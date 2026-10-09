"""
Bharathi Thervukalam - Students Roster & Administration Router
Enrolled candidate directories, demographics, bulk operations, and report exports.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, Response
from sqlalchemy.orm import Session
import io

from database import get_db
from models import Student, User
from schemas import StudentCreate, StudentUpdate, StudentResponse
from auth import get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])

DEFAULT_STUDENTS = [
    {
        "register_no": "BTK2026-0428",
        "name": "S. Kabilan",
        "email": "kabilan@gmail.com",
        "phone": "+91 9842145678",
        "father_name": "S. Murugan",
        "dob": "2000-05-12",
        "qualification": "B.E. (Mechanical)",
        "community": "BC",
        "blood_group": "B+",
        "address": "12, Bharathi Nagar, Perundurai, Erode - 638052",
        "status": "ACTIVE"
    },
    {
        "register_no": "BTK2026-0819",
        "name": "M. Priya",
        "email": "priya.m@gmail.com",
        "phone": "+91 9443218765",
        "father_name": "P. Manickam",
        "dob": "2001-08-23",
        "qualification": "B.Sc. (Mathematics)",
        "community": "MBC",
        "blood_group": "O+",
        "address": "45, Gandhi Road, Gandhipuram, Coimbatore - 641012",
        "status": "ACTIVE"
    },
    {
        "register_no": "BTK2026-1102",
        "name": "K. Saravanan",
        "email": "saravanan.k@gmail.com",
        "phone": "+91 9789123450",
        "father_name": "M. Karuppasamy",
        "dob": "1999-11-04",
        "qualification": "M.A. (Tamil Literature)",
        "community": "SC",
        "blood_group": "A+",
        "address": "78, Anna Street, Fairlands, Salem - 636016",
        "status": "ACTIVE"
    }
]

def ensure_seeded_students(db: Session):
    count = db.query(Student).count()
    if count == 0:
        for s in DEFAULT_STUDENTS:
            db.add(Student(**s))
        db.commit()

@router.get("", response_model=List[StudentResponse])
def get_all_students(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    ensure_seeded_students(db)
    query = db.query(Student).filter(Student.status != "DELETED")
    if search:
        query = query.filter(
            (Student.name.ilike(f"%{search}%")) |
            (Student.register_no.ilike(f"%{search}%")) |
            (Student.email.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(Student.status == status)
    return query.order_by(Student.id.desc()).all()

@router.get("/export-pdf")
def export_students_pdf(db: Session = Depends(get_db)):
    """Generate plain CSV or formatted text roster report for download."""
    ensure_seeded_students(db)
    students = db.query(Student).filter(Student.status != "DELETED").order_by(Student.id.asc()).all()
    
    # Generate clean CSV roster that can be viewed or printed as PDF
    lines = ["Register No,Name,Email,Phone,Community,Qualification,Status"]
    for s in students:
        lines.append(f'"{s.register_no}","{s.name}","{s.email}","{s.phone}","{s.community or ""}","{s.qualification or ""}","{s.status}"')
    
    csv_content = "\n".join(lines)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=bharathi_students_roster.csv"}
    )

@router.get("/{student_id}", response_model=StudentResponse)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student

@router.post("", response_model=StudentResponse)
async def create_student(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    reg_no = data.get("register_no") or f"BTK2026-{db.query(Student).count() + 100:04d}"
    name = data.get("name") or data.get("username") or "Candidate"
    email = data.get("email") or f"{name.lower().replace(' ', '')}@example.com"
    phone = data.get("phone") or data.get("phone_number") or "+91 9000000000"

    student = Student(
        register_no=reg_no,
        name=name,
        email=email,
        phone=phone,
        father_name=data.get("father_name"),
        dob=data.get("dob"),
        qualification=data.get("qualification"),
        community=data.get("community") or data.get("caste"),
        blood_group=data.get("blood_group"),
        address=data.get("address"),
        status="ACTIVE"
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: int, request: Request, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    for k, v in data.items():
        if hasattr(student, k) and v is not None:
            setattr(student, k, v)
    db.commit()
    db.refresh(student)
    return student

@router.patch("/{student_id}", response_model=StudentResponse)
async def patch_student(student_id: int, request: Request, db: Session = Depends(get_db)):
    return await update_student(student_id, request, db)

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    student.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Candidate record removed."}

# Bulk operations
@router.post("/bulk")
def bulk_create_students(students: List[StudentCreate], db: Session = Depends(get_db)):
    created = []
    for s in students:
        item = Student(**s.model_dump())
        db.add(item)
        created.append(item)
    db.commit()
    return {"status": "success", "count": len(created)}

@router.put("/bulk")
def bulk_update_students(records: List[Dict[str, Any]], db: Session = Depends(get_db)):
    updated_count = 0
    for r in records:
        sid = r.get("id")
        if sid:
            st = db.query(Student).filter(Student.id == sid).first()
            if st:
                for k, v in r.items():
                    if hasattr(st, k):
                        setattr(st, k, v)
                updated_count += 1
    db.commit()
    return {"status": "success", "updated": updated_count}

@router.patch("/bulk")
async def bulk_patch_students(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    updates = data.get("updates", {})
    count = 0
    for sid in ids:
        st = db.query(Student).filter(Student.id == sid).first()
        if st:
            for k, v in updates.items():
                if hasattr(st, k):
                    setattr(st, k, v)
            count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.delete("/bulk")
async def bulk_delete_students(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    for sid in ids:
        st = db.query(Student).filter(Student.id == sid).first()
        if st:
            st.status = "DELETED"
    db.commit()
    return {"status": "success", "message": f"{len(ids)} students archived."}
