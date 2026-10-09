"""
Bharathi Thervukalam - Syllabus Management Router
Official syllabus schemes, curriculum attachments, and downloads.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
import shutil

from database import get_db
from models import Syllabus, User
from schemas import SyllabusCreate, SyllabusResponse
from auth import get_current_user

router = APIRouter(prefix="/api/syllabus", tags=["Syllabus"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_SYLLABUS = [
    {
        "title": "TNPSC Group IV & VAO Complete Scheme",
        "category": "TNPSC",
        "department": "Village Administration & Clerical",
        "paper": "Part A & B",
        "pdf_filename": "SUNDAY GRP 4 SCHEDULE -2025.pdf",
        "description": "General Tamil (100 Qs) + General Studies & Aptitude (100 Qs)",
        "status": "ACTIVE"
    },
    {
        "title": "TNUSRB Police Sub-Inspector Scheme",
        "category": "TNUSRB",
        "department": "Police Sub-Inspector",
        "paper": "Part A, B & Physical",
        "pdf_filename": "SATURDAY TIME TABLE-1.pdf",
        "description": "General Knowledge & Logical Reasoning with Physical Endurance Standards",
        "status": "ACTIVE"
    }
]

def ensure_seeded_syllabus(db: Session):
    count = db.query(Syllabus).count()
    if count == 0:
        for s in DEFAULT_SYLLABUS:
            db.add(Syllabus(**s))
        db.commit()

@router.get("", response_model=List[SyllabusResponse])
def get_all_syllabus(db: Session = Depends(get_db)):
    ensure_seeded_syllabus(db)
    return db.query(Syllabus).filter(Syllabus.status != "DELETED").order_by(Syllabus.id.desc()).all()

@router.post("", response_model=SyllabusResponse)
async def upload_syllabus(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type:
        form = await request.form()
        data = dict(form)
        filename = None
        if "file" in data and hasattr(data["file"], "filename"):
            f_obj = data["file"]
            filename = f_obj.filename
            with open(UPLOAD_DIR / filename, "wb") as buf:
                shutil.copyfileobj(f_obj.file, buf)
    else:
        try:
            data = await request.json()
        except Exception:
            data = {}
        filename = data.get("pdf_filename") or data.get("filename")

    item = Syllabus(
        title=data.get("title", "New Syllabus Scheme"),
        category=data.get("category", "TNPSC"),
        department=data.get("department", "General"),
        paper=data.get("paper", ""),
        pdf_filename=filename,
        description=data.get("description", ""),
        status="ACTIVE"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{syllabus_id}", response_model=SyllabusResponse)
async def update_syllabus(syllabus_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.query(Syllabus).filter(Syllabus.id == syllabus_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Syllabus not found.")
    data = await request.json()
    for k, v in data.items():
        if hasattr(item, k) and v is not None:
            setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{syllabus_id}")
def delete_syllabus(syllabus_id: int, db: Session = Depends(get_db)):
    item = db.query(Syllabus).filter(Syllabus.id == syllabus_id).first()
    if item:
        item.status = "DELETED"
        db.commit()
    return {"status": "success", "message": "Syllabus archived."}

@router.get("/{syllabus_id}/download")
def download_syllabus_file(syllabus_id: int, db: Session = Depends(get_db)):
    item = db.query(Syllabus).filter(Syllabus.id == syllabus_id).first()
    if not item or not item.pdf_filename:
        raise HTTPException(status_code=404, detail="File attachment not found.")

    pub_path = Path(__file__).resolve().parent.parent.parent / "public" / item.pdf_filename
    if pub_path.exists():
        return FileResponse(pub_path, filename=item.pdf_filename)

    up_path = UPLOAD_DIR / item.pdf_filename
    if up_path.exists():
        return FileResponse(up_path, filename=item.pdf_filename)

    raise HTTPException(status_code=404, detail=f"File {item.pdf_filename} not found.")
