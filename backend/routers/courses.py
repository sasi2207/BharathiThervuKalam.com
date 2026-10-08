"""
Bharathi Thervukalam - Courses Router (RBAC Enforced)
- GET /api/courses: Student, Staff, Admin (All authenticated)
- POST /api/courses: Admin only
- PUT /api/courses/{id}: Admin only
- DELETE /api/courses/{id}: Admin only
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Course, User
from schemas import CourseCreate, CourseUpdate, CourseResponse
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
def get_courses(
    category: Optional[str] = Query(None, description="Filter by TNPSC or TNUSRB"),
    course_key: Optional[str] = Query(None, description="Filter by course_key e.g. group4"),
    current_user: User = Depends(get_current_user),  # Student, Staff, Admin allowed
    db: Session = Depends(get_db)
):
    """
    List all syllabus and course curriculum guides.
    Allowed Roles: Student, Staff, Admin.
    """
    query = db.query(Course)
    if category:
        query = query.filter(Course.category.ilike(f"%{category}%"))
    if course_key:
        query = query.filter(Course.course_key == course_key)
    
    courses = query.order_by(Course.id.desc()).all()

    # Seed default courses if empty
    if not courses and not course_key:
        defaults = [
            Course(
                course_key="group1",
                category="TNPSC",
                title="TNPSC Group I Preliminary & Mains Master Syllabus 2026",
                paper="Paper I & II & III",
                subject="General Studies, Tamil Society & Administration",
                department="State Civil Services",
                pdf_filename="Group1_Master_Syllabus.pdf"
            ),
            Course(
                course_key="group4",
                category="TNPSC",
                title="TNPSC Group IV & VAO Complete Scheme 2026",
                paper="Part A & B",
                subject="General Tamil (100 Qs) + General Studies & Aptitude (100 Qs)",
                department="Village Administration & Clerical",
                pdf_filename="SUNDAY GRP 4 SCHEDULE -2026.pdf"
            ),
            Course(
                course_key="siTechnical",
                category="TNUSRB",
                title="Sub-Inspector of Police (Technical) Syllabus",
                paper="Paper I & II",
                subject="Electronics, Telecommunications & Forensic Science",
                department="Police Technical Branch",
                pdf_filename="SI_Technical_Curriculum.pdf"
            )
        ]
        for c in defaults:
            db.add(c)
        db.commit()
        courses = db.query(Course).all()

    return courses

@router.get("/{course_id}", response_model=CourseResponse)
def get_course_by_id(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single course syllabus record by ID.
    Allowed Roles: Student, Staff, Admin.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Course with ID {course_id} not found.")
    return course

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    current_user: User = Depends(require_role("admin")),  # Admin only
    db: Session = Depends(get_db)
):
    """
    Publish a new Course syllabus record.
    Security: Strictly restricted to Admin role only.
    """
    new_course = Course(
        course_key=payload.course_key.strip(),
        category=payload.category.strip(),
        title=payload.title.strip(),
        paper=payload.paper,
        subject=payload.subject,
        department=payload.department,
        pdf_filename=payload.pdf_filename or f"{payload.course_key}_notes.pdf"
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    payload: CourseUpdate,
    current_user: User = Depends(require_role("admin")),  # Admin only
    db: Session = Depends(get_db)
):
    """
    Update Course syllabus details.
    Security: Strictly restricted to Admin role only.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Course with ID {course_id} not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete_course(
    course_id: int,
    current_user: User = Depends(require_role("admin")),  # Admin only
    db: Session = Depends(get_db)
):
    """
    Delete a Course syllabus record.
    Security: Strictly restricted to Admin role only.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Course with ID {course_id} not found.")

    db.delete(course)
    db.commit()
    return {"status": "success", "message": f"Course ID {course_id} deleted successfully by Admin."}
