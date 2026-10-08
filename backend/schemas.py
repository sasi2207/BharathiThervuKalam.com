"""
Bharathi Thervukalam - Pydantic Schemas
Strict request validation and response serialization models.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr, Field

# =============================================================================
# AUTHENTICATION & USER SCHEMAS
# =============================================================================

class LoginRequest(BaseModel):
    username: str = Field(..., description="Username, Email, or Candidate Register Number")
    password: str = Field(..., min_length=4, description="User password")

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field("student", description="Role: 'student', 'staff', or 'admin'")
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    register_no: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    full_name: Optional[str] = None
    register_no: Optional[str] = None
    phone_number: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    role: str
    user_id: int
    username: str
    email: str
    full_name: Optional[str] = None
    register_no: Optional[str] = None

# =============================================================================
# COURSE SCHEMAS
# =============================================================================

class CourseBase(BaseModel):
    course_key: str = Field(..., description="Key like group1, group2, group4, siTechnical, etc.")
    category: str = Field("TNPSC", description="TNPSC or TNUSRB")
    title: str
    paper: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    pdf_filename: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    course_key: Optional[str] = None
    category: Optional[str] = None
    title: Optional[str] = None
    paper: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    pdf_filename: Optional[str] = None

class CourseResponse(CourseBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# TEST SERIES SCHEMAS
# =============================================================================

class TestSeriesBase(BaseModel):
    test_code: str
    title: str
    category: str = "TNPSC"
    department: Optional[str] = None
    total_questions: int = 25
    duration_minutes: int = 180
    exam_date: Optional[str] = None
    pdf_filename: Optional[str] = None
    positive_mark: float = 1.5
    negative_mark: float = 0.0

class TestSeriesCreate(TestSeriesBase):
    pass

class TestSeriesUpdate(BaseModel):
    test_code: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    total_questions: Optional[int] = None
    duration_minutes: Optional[int] = None
    exam_date: Optional[str] = None
    pdf_filename: Optional[str] = None
    positive_mark: Optional[float] = None
    negative_mark: Optional[float] = None

class TestSeriesResponse(TestSeriesBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# ACHIEVER SCHEMAS
# =============================================================================

class AchieverBase(BaseModel):
    name: str
    posting: str
    exam: str = "TNPSC Group IV"
    category: str = "group4"
    year: str = "2026"
    department: Optional[str] = None
    rank_text: Optional[str] = None
    story: Optional[str] = None
    advice: Optional[str] = None

class AchieverCreate(AchieverBase):
    pass

class AchieverUpdate(BaseModel):
    name: Optional[str] = None
    posting: Optional[str] = None
    exam: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    department: Optional[str] = None
    rank_text: Optional[str] = None
    story: Optional[str] = None
    advice: Optional[str] = None

class AchieverResponse(AchieverBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# OMR SHEET SCHEMAS
# =============================================================================

class OMRSheetCreate(BaseModel):
    test_id: Optional[int] = None
    test_title: str
    total_questions: int = 25
    answered_count: int = 0
    correct_count: int = 0
    incorrect_count: int = 0
    blank_count: int = 0
    total_score: float = 0.0
    max_score: float = 37.5
    percentage: float = 0.0
    answers: Optional[Dict[str, str]] = None  # {"1": "A", "2": "C"}

class OMRSheetUpdate(BaseModel):
    answered_count: Optional[int] = None
    correct_count: Optional[int] = None
    incorrect_count: Optional[int] = None
    blank_count: Optional[int] = None
    total_score: Optional[float] = None
    percentage: Optional[float] = None

class OMRSheetResponse(BaseModel):
    id: int
    submission_code: str
    student_id: int
    student_name: str
    register_no: Optional[str] = None
    test_id: Optional[int] = None
    test_title: str
    total_questions: int
    answered_count: int
    correct_count: int
    incorrect_count: int
    blank_count: int
    total_score: float
    max_score: float
    percentage: float
    answers_json: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
