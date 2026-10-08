"""
Bharathi Thervukalam - Test Series Router (RBAC Enforced)
- GET /api/tests: Student, Staff, Admin (All authenticated)
- POST /api/tests: Staff, Admin
- PUT /api/tests/{id}: Staff, Admin
- DELETE /api/tests/{id}: Admin only
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import random

from database import get_db
from models import TestSeries, User
from schemas import TestSeriesCreate, TestSeriesUpdate, TestSeriesResponse
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/tests", tags=["Test Series"])

@router.get("", response_model=List[TestSeriesResponse])
def get_test_series(
    current_user: User = Depends(get_current_user),  # Student, Staff, Admin
    db: Session = Depends(get_db)
):
    """
    List all scheduled test series batches and mock examinations.
    Allowed Roles: Student, Staff, Admin.
    """
    tests = db.query(TestSeries).order_by(TestSeries.id.desc()).all()

    # Seed default mock tests if empty
    if not tests:
        defaults = [
            TestSeries(
                test_code="tnpsc-grp4-mock-01",
                title="TNPSC Group IV & VAO Full Mock Exam 01",
                category="TNPSC",
                department="Group IV & VAO",
                total_questions=25,
                duration_minutes=180,
                exam_date="2026-03-29",
                pdf_filename="SUNDAY GRP 4 SCHEDULE -2025.pdf",
                positive_mark=1.5,
                negative_mark=0.0
            ),
            TestSeries(
                test_code="tnusrb-si-mock-01",
                title="TNUSRB SI Joint Recruitment Preliminary Mock 01",
                category="TNUSRB",
                department="Police Sub-Inspector",
                total_questions=20,
                duration_minutes=150,
                exam_date="2026-04-05",
                pdf_filename="SATURDAY TIME TABLE-1.pdf",
                positive_mark=1.0,
                negative_mark=0.0
            )
        ]
        for t in defaults:
            db.add(t)
        db.commit()
        tests = db.query(TestSeries).all()

    return tests

@router.get("/{test_id}", response_model=TestSeriesResponse)
def get_test_by_id(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single Test Series record by ID.
    Allowed Roles: Student, Staff, Admin.
    """
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Test Series with ID {test_id} not found.")
    return test

@router.post("", response_model=TestSeriesResponse, status_code=status.HTTP_201_CREATED)
def create_test_series(
    payload: TestSeriesCreate,
    current_user: User = Depends(require_role("staff", "admin")),  # Staff and Admin allowed
    db: Session = Depends(get_db)
):
    """
    Schedule a new Test Series examination.
    Security: Restricted to Staff and Admin roles.
    """
    code = payload.test_code.strip() or f"BTK-TEST-{random.randint(1000, 9999)}"

    # Check unique code
    existing = db.query(TestSeries).filter(TestSeries.test_code == code).first()
    if existing:
        code = f"{code}-{random.randint(10, 99)}"

    new_test = TestSeries(
        test_code=code,
        title=payload.title.strip(),
        category=payload.category.strip(),
        department=payload.department,
        total_questions=payload.total_questions,
        duration_minutes=payload.duration_minutes,
        exam_date=payload.exam_date or "2026-04-12",
        pdf_filename=payload.pdf_filename or "Test_Paper.pdf",
        positive_mark=payload.positive_mark,
        negative_mark=payload.negative_mark
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test

@router.put("/{test_id}", response_model=TestSeriesResponse)
def update_test_series(
    test_id: int,
    payload: TestSeriesUpdate,
    current_user: User = Depends(require_role("staff", "admin")),  # Staff and Admin allowed
    db: Session = Depends(get_db)
):
    """
    Update Test Series schedule or marking parameters.
    Security: Restricted to Staff and Admin roles.
    """
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Test Series with ID {test_id} not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(test, field, value)

    db.commit()
    db.refresh(test)
    return test

@router.delete("/{test_id}", status_code=status.HTTP_200_OK)
def delete_test_series(
    test_id: int,
    current_user: User = Depends(require_role("admin")),  # Strictly Admin only
    db: Session = Depends(get_db)
):
    """
    Delete a Test Series record and all associated data.
    Security: Strictly restricted to Admin role only.
    """
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Test Series with ID {test_id} not found.")

    db.delete(test)
    db.commit()
    return {"status": "success", "message": f"Test Series ID {test_id} deleted successfully by Admin."}
