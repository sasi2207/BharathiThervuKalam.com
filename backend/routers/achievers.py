"""
Bharathi Thervukalam - Achievers & Hall of Fame Router (RBAC Enforced)
- GET /api/achievers: Student, Staff, Admin (All authenticated)
- POST /api/achievers: Staff, Admin
- PUT /api/achievers/{id}: Staff, Admin
- DELETE /api/achievers/{id}: Admin only
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Achiever, User
from schemas import AchieverCreate, AchieverUpdate, AchieverResponse
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/achievers", tags=["Achievers"])

@router.get("", response_model=List[AchieverResponse])
def get_achievers(
    current_user: User = Depends(get_current_user),  # All authenticated users
    db: Session = Depends(get_db)
):
    """
    List all hall of fame selected civil service officers.
    Allowed Roles: Student, Staff, Admin.
    """
    achievers = db.query(Achiever).order_by(Achiever.year.desc(), Achiever.id.desc()).all()

    # Seed default achievers if empty
    if not achievers:
        defaults = [
            Achiever(
                name="R. Vignesh, M.E.",
                posting="Deputy Superintendent of Police (DSP)",
                exam="TNPSC Group I",
                category="group1",
                year="2023",
                department="Tamil Nadu Police Service (TNPS)",
                rank_text="State Rank 4",
                story="Cracked in first attempt with guidance from Bharathi Academy mentors.",
                advice="Master the school textbooks and practice answer writing under timed conditions."
            ),
            Achiever(
                name="S. Divya, B.Sc.",
                posting="Sub-Registrar (Grade II)",
                exam="TNPSC Group II",
                category="group2",
                year="2022",
                department="Registration Department",
                rank_text="Top 15 Overall",
                story="Overcame rural background through 100% free mentorship and intensive interview coaching.",
                advice="General Tamil syllabus is the biggest game-changer."
            ),
            Achiever(
                name="P. Arulselvan, B.Com.",
                posting="Sub-Inspector of Police (Taluk)",
                exam="TNUSRB Joint Recruitment",
                category="police",
                year="2023",
                department="Law & Order Wing, Coimbatore City",
                rank_text="State Top Rank",
                story="Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.",
                advice="Maintain equal dedication between physical fitness test and GS aptitude papers."
            )
        ]
        for a in defaults:
            db.add(a)
        db.commit()
        achievers = db.query(Achiever).all()

    return achievers

@router.get("/{achiever_id}", response_model=AchieverResponse)
def get_achiever_by_id(
    achiever_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single Achiever profile.
    Allowed Roles: Student, Staff, Admin.
    """
    achiever = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not achiever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Achiever with ID {achiever_id} not found.")
    return achiever

@router.post("", response_model=AchieverResponse, status_code=status.HTTP_201_CREATED)
def create_achiever(
    payload: AchieverCreate,
    current_user: User = Depends(require_role("staff", "admin")),  # Staff, Admin allowed
    db: Session = Depends(get_db)
):
    """
    Publish a new Achiever entry into the Hall of Fame.
    Security: Restricted to Staff and Admin roles.
    """
    new_achiever = Achiever(
        name=payload.name.strip(),
        posting=payload.posting.strip(),
        exam=payload.exam.strip(),
        category=payload.category,
        year=payload.year,
        department=payload.department,
        rank_text=payload.rank_text,
        story=payload.story,
        advice=payload.advice
    )
    db.add(new_achiever)
    db.commit()
    db.refresh(new_achiever)
    return new_achiever

@router.put("/{achiever_id}", response_model=AchieverResponse)
def update_achiever(
    achiever_id: int,
    payload: AchieverUpdate,
    current_user: User = Depends(require_role("staff", "admin")),  # Staff, Admin allowed
    db: Session = Depends(get_db)
):
    """
    Update an Achiever's posting or testimonial.
    Security: Restricted to Staff and Admin roles.
    """
    achiever = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not achiever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Achiever with ID {achiever_id} not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(achiever, field, value)

    db.commit()
    db.refresh(achiever)
    return achiever

@router.delete("/{achiever_id}", status_code=status.HTTP_200_OK)
def delete_achiever(
    achiever_id: int,
    current_user: User = Depends(require_role("admin")),  # Strictly Admin only
    db: Session = Depends(get_db)
):
    """
    Remove an Achiever entry.
    Security: Strictly restricted to Admin role only.
    """
    achiever = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not achiever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Achiever with ID {achiever_id} not found.")

    db.delete(achiever)
    db.commit()
    return {"status": "success", "message": f"Achiever ID {achiever_id} deleted successfully by Admin."}
