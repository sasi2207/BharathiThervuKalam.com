"""
Bharathi Thervukalam - Test Series Router
Scheduled mock test series, exam papers, answer evaluation schemes, and PDF downloads.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path

from database import get_db
from models import TestSeries, User
from schemas import TestSeriesCreate, TestSeriesUpdate, TestSeriesResponse
from auth import get_current_user

router = APIRouter(prefix="/api/tests", tags=["Test Series"])

DEFAULT_TESTS = [
    {
        "test_code": "tnpsc-grp4-mock-01",
        "title": "TNPSC Group IV & VAO Full Mock Exam 01",
        "category": "TNPSC",
        "department": "Group IV & VAO",
        "paper": "General Studies & General Tamil",
        "standard": "Question",
        "total_questions": 200,
        "duration_minutes": 180,
        "exam_date": "2026-03-29",
        "pdf_filename": "SUNDAY GRP 4 SCHEDULE -2025.pdf",
        "positive_mark": 1.5,
        "negative_mark": 0.0,
        "status": "ACTIVE"
    },
    {
        "test_code": "tnusrb-si-mock-01",
        "title": "TNUSRB SI Joint Recruitment Preliminary Mock 01",
        "category": "TNUSRB",
        "department": "Police Sub-Inspector",
        "paper": "General Knowledge & Psychology",
        "standard": "Question",
        "total_questions": 140,
        "duration_minutes": 150,
        "exam_date": "2026-04-05",
        "pdf_filename": "SATURDAY TIME TABLE-1.pdf",
        "positive_mark": 1.0,
        "negative_mark": 0.0,
        "status": "ACTIVE"
    },
    {
        "test_code": "tnpsc-omr-practice",
        "title": "Official TNPSC 200 Questions OMR Practice Sheet",
        "category": "TNPSC",
        "department": "Civil Services",
        "paper": "OMR Practice Format",
        "standard": "OMR",
        "total_questions": 200,
        "duration_minutes": 180,
        "exam_date": "Continuous Practice",
        "pdf_filename": "Tnpsc - OMR Sheet-1.pdf",
        "positive_mark": 1.5,
        "negative_mark": 0.0,
        "status": "ACTIVE"
    }
]

def ensure_seeded_tests(db: Session):
    count = db.query(TestSeries).count()
    if count == 0:
        for t in DEFAULT_TESTS:
            db.add(TestSeries(**t))
        db.commit()

@router.get("", response_model=List[TestSeriesResponse])
def get_all_tests(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    ensure_seeded_tests(db)
    query = db.query(TestSeries).filter(TestSeries.status == "ACTIVE")
    if category:
        query = query.filter(TestSeries.category.ilike(f"%{category}%"))
    return query.order_by(TestSeries.id.desc()).all()

@router.get("/{test_id}", response_model=TestSeriesResponse)
def get_test_by_id(test_id: int, db: Session = Depends(get_db)):
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test record not found.")
    return test

@router.post("", response_model=TestSeriesResponse)
async def create_test(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    test_code = data.get("test_code") or f"test-{db.query(TestSeries).count() + 1}"
    title = data.get("title") or "New Test Mock Exam"
    
    test = TestSeries(
        test_code=test_code,
        title=title,
        category=data.get("category", "TNPSC"),
        department=data.get("department", "General"),
        paper=data.get("paper", ""),
        standard=data.get("standard", "Question"),
        total_questions=int(data.get("total_questions") or data.get("totalQuestions") or 25),
        duration_minutes=int(data.get("duration_minutes") or data.get("durationMinutes") or 180),
        exam_date=data.get("exam_date") or data.get("date"),
        pdf_filename=data.get("pdf_filename") or data.get("filename"),
        positive_mark=float(data.get("positive_mark") or data.get("positiveMark") or 1.5),
        negative_mark=float(data.get("negative_mark") or data.get("negativeMark") or 0.0),
        status="ACTIVE"
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

@router.put("/{test_id}", response_model=TestSeriesResponse)
def update_test(test_id: int, payload: TestSeriesUpdate, db: Session = Depends(get_db)):
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(test, k, v)
    db.commit()
    db.refresh(test)
    return test

@router.patch("/{test_id}", response_model=TestSeriesResponse)
def patch_test(test_id: int, payload: TestSeriesUpdate, db: Session = Depends(get_db)):
    return update_test(test_id, payload, db)

@router.delete("/{test_id}")
def delete_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")
    test.status = "DELETED"
    db.commit()
    return {"status": "success", "message": "Test batch archived."}

@router.get("/{test_id}/download")
def download_test_paper(test_id: int, db: Session = Depends(get_db)):
    test = db.query(TestSeries).filter(TestSeries.id == test_id).first()
    if not test or not test.pdf_filename:
        raise HTTPException(status_code=404, detail="Test PDF attachment not configured.")

    pub_path = Path(__file__).resolve().parent.parent.parent / "public" / test.pdf_filename
    if pub_path.exists():
        return FileResponse(pub_path, filename=test.pdf_filename)

    up_path = Path(__file__).resolve().parent.parent / "uploads" / test.pdf_filename
    if up_path.exists():
        return FileResponse(up_path, filename=test.pdf_filename)

    raise HTTPException(status_code=404, detail=f"File {test.pdf_filename} not found on server.")

@router.post("/bulk")
def bulk_create_tests(tests: List[TestSeriesCreate], db: Session = Depends(get_db)):
    created = []
    for t in tests:
        item = TestSeries(**t.model_dump())
        db.add(item)
        created.append(item)
    db.commit()
    return {"status": "success", "count": len(created)}
