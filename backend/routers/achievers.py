"""
Bharathi Thervukalam - Achievers & Hall of Fame Router
Selected candidates, state service ranks, police officers, and testimonials.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from database import get_db
from models import Achiever, User
from schemas import AchieverCreate, AchieverUpdate, AchieverResponse
from auth import get_current_user

router = APIRouter(prefix="/api/achievers", tags=["Achievers & Hall of Fame"])

DEFAULT_ACHIEVERS = [
    {
        "name": "R. Vignesh, M.E.",
        "posting": "Deputy Superintendent of Police (DSP)",
        "exam": "TNPSC Group I",
        "category": "group1",
        "year": "2023",
        "department": "Tamil Nadu Police Service (TNPS)",
        "rank_text": "State Rank 4",
        "hometown": "Erode",
        "story": "Cracked in first attempt with guidance from Bharathi Academy mentors. Attended Saturday mock test series without missing a single week.",
        "advice": "Master the school textbooks and practice answer writing under timed conditions.",
        "status": "ACTIVE"
    },
    {
        "name": "S. Divya, B.Sc.",
        "posting": "Sub-Registrar (Grade II)",
        "exam": "TNPSC Group II",
        "category": "group2",
        "year": "2022",
        "department": "Registration Department",
        "rank_text": "Top 15 Overall",
        "hometown": "Coimbatore",
        "story": "Overcame rural background through 100% free mentorship and intensive interview coaching.",
        "advice": "General Tamil syllabus is the biggest game-changer.",
        "status": "ACTIVE"
    },
    {
        "name": "P. Arulselvan, B.Com.",
        "posting": "Sub-Inspector of Police (Taluk)",
        "exam": "TNUSRB Joint Recruitment",
        "category": "police",
        "year": "2023",
        "department": "Law & Order Wing, Coimbatore City",
        "rank_text": "State Physical & Written Top Rank",
        "hometown": "Salem",
        "story": "Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.",
        "advice": "Maintain equal dedication between physical fitness test and GS aptitude papers.",
        "status": "ACTIVE"
    },
    {
        "name": "M. Kavitha, B.A.",
        "posting": "Village Administrative Officer (VAO)",
        "exam": "TNPSC Group IV & VAO",
        "category": "group4",
        "year": "2024",
        "department": "Revenue Administration, Erode Taluk",
        "rank_text": "District 1st in PSTM Quota",
        "hometown": "Erode",
        "story": "Scored 98/100 in General Tamil using Bharathi classroom materials.",
        "advice": "Samacheer Kalvi books from 6th to 12th standard are your holy scripture.",
        "status": "ACTIVE"
    }
]

def ensure_seeded_achievers(db: Session):
    count = db.query(Achiever).count()
    if count == 0:
        for a in DEFAULT_ACHIEVERS:
            db.add(Achiever(**a))
        db.commit()

@router.get("", response_model=List[AchieverResponse])
def get_all_achievers(
    category: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    ensure_seeded_achievers(db)
    query = db.query(Achiever).filter(Achiever.status != "DELETED")
    if category:
        query = query.filter(Achiever.category.ilike(f"%{category}%"))
    if year:
        query = query.filter(Achiever.year == year)
    return query.order_by(Achiever.year.desc(), Achiever.id.desc()).all()

@router.get("/{achiever_id}", response_model=AchieverResponse)
def get_achiever_by_id(achiever_id: int, db: Session = Depends(get_db)):
    a = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Achiever profile not found.")
    return a

@router.post("", response_model=AchieverResponse)
async def create_or_save_achiever(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    a = Achiever(
        name=data.get("name", "Achiever"),
        posting=data.get("posting", "Civil Service Post"),
        exam=data.get("exam", "TNPSC Group IV"),
        category=data.get("category", "group4"),
        year=str(data.get("year", "2026")),
        department=data.get("department", ""),
        rank_text=data.get("rank_text") or data.get("rank"),
        hometown=data.get("hometown", ""),
        story=data.get("story", ""),
        advice=data.get("advice", ""),
        status="ACTIVE"
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return a

@router.put("/{achiever_id}", response_model=AchieverResponse)
async def update_achiever(achiever_id: int, request: Request, db: Session = Depends(get_db)):
    a = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Achiever not found.")
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    for k, v in data.items():
        if hasattr(a, k) and v is not None:
            setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return a

@router.patch("/{achiever_id}", response_model=AchieverResponse)
async def patch_achiever(achiever_id: int, request: Request, db: Session = Depends(get_db)):
    return await update_achiever(achiever_id, request, db)

@router.delete("/{achiever_id}")
def delete_achiever(achiever_id: int, db: Session = Depends(get_db)):
    a = db.query(Achiever).filter(Achiever.id == achiever_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Achiever not found.")
    a.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Achiever record removed."}

# Bulk operations
@router.post("/bulk")
def bulk_create_achievers(achievers: List[AchieverCreate], db: Session = Depends(get_db)):
    created = []
    for item in achievers:
        a = Achiever(**item.model_dump())
        db.add(a)
        created.append(a)
    db.commit()
    return {"status": "success", "count": len(created)}

@router.put("/bulk")
def bulk_update_achievers(records: List[Dict[str, Any]], db: Session = Depends(get_db)):
    count = 0
    for r in records:
        aid = r.get("id")
        if aid:
            item = db.query(Achiever).filter(Achiever.id == aid).first()
            if item:
                for k, v in r.items():
                    if hasattr(item, k):
                        setattr(item, k, v)
                count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.patch("/bulk")
async def bulk_patch_achievers(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    updates = data.get("updates", {})
    count = 0
    for aid in ids:
        item = db.query(Achiever).filter(Achiever.id == aid).first()
        if item:
            for k, v in updates.items():
                if hasattr(item, k):
                    setattr(item, k, v)
            count += 1
    db.commit()
    return {"status": "success", "count": count}

@router.delete("/bulk")
async def bulk_delete_achievers(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    ids = data.get("ids", [])
    for aid in ids:
        item = db.query(Achiever).filter(Achiever.id == aid).first()
        if item:
            item.status = "DELETED"
    db.commit()
    return {"status": "success", "message": f"{len(ids)} achievers archived."}
