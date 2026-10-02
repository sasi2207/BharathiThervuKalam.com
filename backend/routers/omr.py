"""
Bharathi Thervukalam - Digital OMR Sheets & Evaluation Router (RBAC Enforced)
- GET /api/omr: Students see ONLY their own records; Staff and Admin see ALL submissions
- POST /api/omr: Student, Staff, Admin (Student attaches their own student_id)
- PUT /api/omr/{id}: Staff, Admin (Marks / Evaluation overrides)
- DELETE /api/omr/{id}: Admin only
"""

import json
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import OMRSheet, User, UserRole
from schemas import OMRSheetCreate, OMRSheetUpdate, OMRSheetResponse
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/omr", tags=["OMR Evaluation"])

@router.get("", response_model=List[OMRSheetResponse])
def get_omr_sheets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve candidate OMR evaluation records.
    Strict Data Isolation:
    - Students see ONLY their own submitted attempts.
    - Staff and Admin can view all candidates' submissions statewide.
    """
    user_role = current_user.role.lower().strip()

    if user_role == UserRole.STUDENT.value:
        # Strict scope isolation: Only current student's records
        sheets = db.query(OMRSheet).filter(OMRSheet.student_id == current_user.id).order_by(OMRSheet.id.desc()).all()
    else:
        # Staff and Admin: Global Statewide Roster
        sheets = db.query(OMRSheet).order_by(OMRSheet.id.desc()).all()

    return sheets

@router.get("/{submission_code}", response_model=OMRSheetResponse)
def get_omr_by_code(
    submission_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed OMR scorecard by unique submission code.
    Enforces student ownership check.
    """
    sheet = db.query(OMRSheet).filter(OMRSheet.submission_code == submission_code).first()
    if not sheet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OMR submission record not found.")

    # Guard: if student, must own the record
    if current_user.role.lower() == UserRole.STUDENT.value and sheet.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. You can only inspect your own OMR scorecards.")

    return sheet

@router.post("", response_model=OMRSheetResponse, status_code=status.HTTP_201_CREATED)
def submit_omr_sheet(
    payload: OMRSheetCreate,
    current_user: User = Depends(get_current_user),  # Student, Staff, Admin
    db: Session = Depends(get_db)
):
    """
    Submit and register an evaluated OMR sheet.
    Allowed Roles: Student, Staff, Admin.
    Automatically assigns ownership to current authenticated student.
    """
    sub_code = f"OMR-{random.randint(100000, 999999)}"
    answers_str = json.dumps(payload.answers) if payload.answers else "{}"

    new_sheet = OMRSheet(
        submission_code=sub_code,
        student_id=current_user.id,
        test_id=payload.test_id,
        student_name=current_user.full_name or current_user.username,
        register_no=current_user.register_no or f"BTK2026-{current_user.id:04d}",
        test_title=payload.test_title,
        total_questions=payload.total_questions,
        answered_count=payload.answered_count,
        correct_count=payload.correct_count,
        incorrect_count=payload.incorrect_count,
        blank_count=payload.blank_count,
        total_score=payload.total_score,
        max_score=payload.max_score,
        percentage=payload.percentage,
        answers_json=answers_str
    )
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)
    return new_sheet

@router.put("/{sheet_id}", response_model=OMRSheetResponse)
def update_omr_sheet(
    sheet_id: int,
    payload: OMRSheetUpdate,
    current_user: User = Depends(require_role("staff", "admin")),  # Staff and Admin allowed
    db: Session = Depends(get_db)
):
    """
    Re-evaluate or adjust an OMR sheet's marks or counts.
    Security: Restricted to Staff and Admin roles.
    """
    sheet = db.query(OMRSheet).filter(OMRSheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"OMR Sheet with ID {sheet_id} not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sheet, field, value)

    db.commit()
    db.refresh(sheet)
    return sheet

@router.delete("/{sheet_id}", status_code=status.HTTP_200_OK)
def delete_omr_sheet(
    sheet_id: int,
    current_user: User = Depends(require_role("admin")),  # Strictly Admin only
    db: Session = Depends(get_db)
):
    """
    Delete an OMR evaluation record.
    Security: Strictly restricted to Admin role only.
    """
    sheet = db.query(OMRSheet).filter(OMRSheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"OMR Sheet with ID {sheet_id} not found.")

    db.delete(sheet)
    db.commit()
    return {"status": "success", "message": f"OMR Sheet ID {sheet_id} deleted successfully by Admin."}
