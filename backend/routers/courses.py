"""
Bharathi Thervukalam - Courses & TNPSC/TNUSRB Groups Router
Full CRUD, Multipart File Uploads, Category Filtering, and Syllabus Downloads.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
import os
import shutil

from database import get_db
from models import Course, User
from schemas import CourseCreate, CourseUpdate, CourseResponse
from auth import get_current_user

router = APIRouter(prefix="/api/courses", tags=["Courses"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

COURSE_KEY_MAP = {
    "group1": {"category": "TNPSC", "dept": "Civil Services", "title": "TNPSC Group I Preliminary & Mains"},
    "group2": {"category": "TNPSC", "dept": "Interview Posts", "title": "TNPSC Group II Services"},
    "group2A": {"category": "TNPSC", "dept": "Non-Interview Ministerial", "title": "TNPSC Group II-A Services"},
    "group4": {"category": "TNPSC", "dept": "Village Admin & Clerical", "title": "TNPSC Group IV & VAO Complete Scheme"},
    "jointRecruitment": {"category": "TNUSRB", "dept": "Taluk & Armed Reserve", "title": "TNUSRB Joint Recruitment (SIs & SO)"},
    "siTechnical": {"category": "TNUSRB", "dept": "Police Wireless Wing", "title": "TNUSRB Sub-Inspector (Technical)"},
    "siFingerprint": {"category": "TNUSRB", "dept": "Forensic Bureau Cadre", "title": "TNUSRB Sub-Inspector (Finger Print)"},
    "commonRecruitment": {"category": "TNUSRB", "dept": "Uniformed Services", "title": "TNUSRB Common Recruitment (Gr. II Constables)"},
}

DEFAULT_COURSES = [
    {
        "course_key": "group1",
        "category": "TNPSC",
        "title": "TNPSC Group I Preliminary & Mains Master Syllabus 2026",
        "paper": "Paper I & II & III",
        "subject": "General Studies, Tamil Society & Administration",
        "department": "Civil Services",
        "pdf_filename": "Group1_Master_Syllabus.pdf",
        "fees": 25000.0,
        "duration": "1 Year"
    },
    {
        "course_key": "group2",
        "category": "TNPSC",
        "title": "TNPSC Group II Combined Civil Services Examination II",
        "paper": "Paper I & II",
        "subject": "General Studies & Tamil Eligibility",
        "department": "Interview Posts",
        "pdf_filename": "Group2_Syllabus.pdf",
        "fees": 18000.0,
        "duration": "8 Months"
    },
    {
        "course_key": "group2A",
        "category": "TNPSC",
        "title": "TNPSC Group II-A Non-Interview Services Batch",
        "paper": "Single Stage Exam",
        "subject": "General Studies & Mental Ability",
        "department": "Non-Interview Ministerial",
        "pdf_filename": "Group2A_Syllabus.pdf",
        "fees": 15000.0,
        "duration": "6 Months"
    },
    {
        "course_key": "group4",
        "category": "TNPSC",
        "title": "TNPSC Group IV & VAO Complete Scheme 2026",
        "paper": "Part A & B",
        "subject": "General Tamil (100 Qs) + General Studies & Aptitude (100 Qs)",
        "department": "Village Admin & Clerical",
        "pdf_filename": "SUNDAY GRP 4 SCHEDULE -2025.pdf",
        "fees": 12000.0,
        "duration": "6 Months"
    },
    {
        "course_key": "jointRecruitment",
        "category": "TNUSRB",
        "title": "TNUSRB Sub-Inspector (Taluk & AR) Joint Recruitment Batch",
        "paper": "Part A, B & Physical Endurance",
        "subject": "General Knowledge & Logical Reasoning",
        "department": "Taluk & Armed Reserve",
        "pdf_filename": "SATURDAY TIME TABLE-1.pdf",
        "fees": 14000.0,
        "duration": "6 Months"
    },
    {
        "course_key": "siTechnical",
        "category": "TNUSRB",
        "title": "TNUSRB Sub-Inspector of Police (Technical Cadre)",
        "paper": "Electronics & Telecommunication",
        "subject": "Technical Specialization & General Knowledge",
        "department": "Police Wireless Wing",
        "pdf_filename": "SITechnical_Syllabus.pdf",
        "fees": 16000.0,
        "duration": "6 Months"
    },
    {
        "course_key": "siFingerprint",
        "category": "TNUSRB",
        "title": "TNUSRB Sub-Inspector of Police (Finger Print Bureau)",
        "paper": "Forensic & Natural Science",
        "subject": "Physics, Chemistry & Biology with General Studies",
        "department": "Forensic Bureau Cadre",
        "pdf_filename": "SIFingerPrint_Syllabus.pdf",
        "fees": 16000.0,
        "duration": "6 Months"
    },
    {
        "course_key": "commonRecruitment",
        "category": "TNUSRB",
        "title": "TNUSRB Grade II Police Constable & Jail Warder Batch",
        "paper": "Written Exam & Physical Efficiency",
        "subject": "General Knowledge, Psychology & Tamil Qualification",
        "department": "Uniformed Services",
        "pdf_filename": "CommonRecruitment_Syllabus.pdf",
        "fees": 10000.0,
        "duration": "4 Months"
    }
]

def ensure_seeded_courses(db: Session):
    count = db.query(Course).count()
    if count == 0:
        for c in DEFAULT_COURSES:
            db.add(Course(**c))
        db.commit()

# =============================================================================
# GENERAL COURSES ENDPOINTS
# =============================================================================

@router.get("", response_model=List[CourseResponse])
def get_all_courses(
    category: Optional[str] = Query(None),
    course_key: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    ensure_seeded_courses(db)
    query = db.query(Course).filter(Course.status == "ACTIVE")
    if category:
        query = query.filter(Course.category.ilike(f"%{category}%"))
    if course_key:
        query = query.filter(Course.course_key == course_key)
    return query.order_by(Course.id.desc()).all()

@router.get("/{course_id}", response_model=CourseResponse)
def get_course_by_id(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    return course

@router.post("", response_model=CourseResponse)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    new_course = Course(**payload.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.put("/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(course, k, v)
    db.commit()
    db.refresh(course)
    return course

@router.patch("/{course_id}", response_model=CourseResponse)
def patch_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    return update_course(course_id, payload, db)

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    course.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Course removed successfully."}

@router.post("/bulk")
def bulk_create_courses(courses: List[CourseCreate], db: Session = Depends(get_db)):
    created = []
    for c in courses:
        item = Course(**c.model_dump())
        db.add(item)
        created.append(item)
    db.commit()
    return {"status": "success", "count": len(created)}

# =============================================================================
# GROUP & EXAM DEDICATED ROUTES (/group1, /group4, /siTechnical, etc.)
# =============================================================================

def handle_group_get(key: str, db: Session):
    ensure_seeded_courses(db)
    items = db.query(Course).filter(Course.course_key == key, Course.status == "ACTIVE").all()
    if not items and key in COURSE_KEY_MAP:
        meta = COURSE_KEY_MAP[key]
        item = Course(
            course_key=key,
            category=meta["category"],
            title=meta["title"],
            department=meta["dept"],
            paper="Core Syllabus",
            subject="Comprehensive Preparation",
            status="ACTIVE"
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        items = [item]
    return items

async def handle_group_save(key: str, request: Request, db: Session):
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type:
        form = await request.form()
        data = dict(form)
    else:
        try:
            data = await request.json()
        except Exception:
            data = {}

    meta = COURSE_KEY_MAP.get(key, {"category": "TNPSC", "dept": "General"})
    title = data.get("title") or data.get("name") or f"{key.upper()} Course"
    
    filename = None
    if "file" in data and hasattr(data["file"], "filename"):
        file_obj = data["file"]
        filename = file_obj.filename
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file_obj.file, buffer)

    course = Course(
        course_key=key,
        category=data.get("category", meta["category"]),
        title=title,
        paper=data.get("paper", ""),
        subject=data.get("subject", ""),
        department=data.get("department", meta["dept"]),
        pdf_filename=filename or data.get("pdf_filename") or data.get("filename"),
        description=data.get("description", "")
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"status": "success", "message": "Saved successfully", "course": course}

# Helper to register group routes dynamically
for g_key in ["group1", "group2", "group2A", "group4", "commonRecruitment", "siTechnical", "siFingerprint", "jointRecruitment"]:
    def make_get(key):
        async def _get(db: Session = Depends(get_db)):
            return handle_group_get(key, db)
        return _get

    def make_post(key):
        async def _post(request: Request, db: Session = Depends(get_db)):
            return await handle_group_save(key, request, db)
        return _post

    def make_put(key):
        async def _put(item_id: int, request: Request, db: Session = Depends(get_db)):
            course = db.query(Course).filter(Course.id == item_id).first()
            if not course:
                raise HTTPException(status_code=404, detail="Not found")
            form = await request.form() if "multipart" in request.headers.get("content-type", "") else await request.json()
            for k, v in dict(form).items():
                if hasattr(course, k) and v is not None:
                    setattr(course, k, v)
            db.commit()
            return {"status": "success", "message": "Updated"}
        return _put

    def make_delete(key):
        async def _delete(item_id: int, db: Session = Depends(get_db)):
            course = db.query(Course).filter(Course.id == item_id).first()
            if course:
                course.status = "DELETED"
                db.commit()
            return {"status": "success", "message": "Deleted"}
        return _delete

    def make_download(key):
        async def _download(item_id: int, db: Session = Depends(get_db)):
            course = db.query(Course).filter(Course.id == item_id).first()
            if not course or not course.pdf_filename:
                raise HTTPException(status_code=404, detail="File not attached.")
            fpath = UPLOAD_DIR / course.pdf_filename
            if not fpath.exists():
                # check public folder
                pub_path = Path(__file__).resolve().parent.parent.parent / "public" / course.pdf_filename
                if pub_path.exists():
                    fpath = pub_path
            if fpath.exists():
                return FileResponse(fpath, filename=course.pdf_filename)
            raise HTTPException(status_code=404, detail="File on disk not found.")
        return _download

    router.add_api_route(f"/{g_key}", make_get(g_key), methods=["GET"])
    router.add_api_route(f"/{g_key}", make_post(g_key), methods=["POST"])
    router.add_api_route(f"/{g_key}/{{item_id}}", make_put(g_key), methods=["PUT"])
    router.add_api_route(f"/{g_key}/{{item_id}}", make_delete(g_key), methods=["DELETE"])
    router.add_api_route(f"/{g_key}/{{item_id}}/download", make_download(g_key), methods=["GET"])
