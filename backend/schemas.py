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
    username: Optional[str] = Field(None, description="Username, Email, or Register Number")
    email: Optional[str] = None
    register_no: Optional[str] = None
    password: str = Field(..., min_length=1, description="User password")

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: str
    password: str = Field(..., min_length=4)
    role: str = Field("student", description="Role: 'student', 'staff', or 'admin'")
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    phone: Optional[str] = None
    register_no: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    full_name: Optional[str] = None
    register_no: Optional[str] = None
    phone_number: Optional[str] = None
    status: Optional[str] = "ACTIVE"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    success: bool = True
    status: str = "success"
    message: str = "Authentication successful"
    token: str
    access_token: str
    token_type: str = "Bearer"
    user: Dict[str, Any]

# =============================================================================
# STUDENT SCHEMAS
# =============================================================================

class StudentBase(BaseModel):
    name: str
    email: str
    phone: str
    register_no: Optional[str] = None
    father_name: Optional[str] = None
    dob: Optional[str] = None
    qualification: Optional[str] = None
    community: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    father_name: Optional[str] = None
    dob: Optional[str] = None
    qualification: Optional[str] = None
    community: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# STAFF SCHEMAS
# =============================================================================

class StaffBase(BaseModel):
    name: str
    email: str
    phone: str
    staff_id: Optional[str] = None
    designation: Optional[str] = "Staff Member"
    department: Optional[str] = "Academics"
    role: Optional[str] = "STAFF"
    status: Optional[str] = "ACTIVE"

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None

class StaffResponse(StaffBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# FACULTY SCHEMAS
# =============================================================================

class FacultyBase(BaseModel):
    name: str
    username: Optional[str] = None
    designation: str = "Faculty Mentor"
    subject: str = "General Studies"
    paper: Optional[str] = None
    experience: Optional[str] = "Competitive Exam Mentor"
    phone: Optional[str] = None
    email: Optional[str] = None
    category: Optional[str] = "TNPSC"
    status: Optional[str] = "ACTIVE"

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    designation: Optional[str] = None
    subject: Optional[str] = None
    paper: Optional[str] = None
    experience: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None

class FacultyResponse(FacultyBase):
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
    hometown: Optional[str] = None
    story: Optional[str] = None
    advice: Optional[str] = None
    status: Optional[str] = "ACTIVE"

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
    hometown: Optional[str] = None
    story: Optional[str] = None
    advice: Optional[str] = None
    status: Optional[str] = None

class AchieverResponse(AchieverBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# COURSE SCHEMAS
# =============================================================================

class CourseBase(BaseModel):
    course_key: str = "general"
    category: str = "TNPSC"
    title: str
    paper: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    syllabus: Optional[str] = None
    description: Optional[str] = None
    standard: Optional[str] = None
    duration: Optional[str] = None
    fees: Optional[float] = 0.0
    pdf_filename: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    course_key: Optional[str] = None
    category: Optional[str] = None
    title: Optional[str] = None
    paper: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    syllabus: Optional[str] = None
    description: Optional[str] = None
    standard: Optional[str] = None
    duration: Optional[str] = None
    fees: Optional[float] = None
    pdf_filename: Optional[str] = None
    status: Optional[str] = None

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
    paper: Optional[str] = None
    standard: Optional[str] = "Question"
    total_questions: int = 25
    duration_minutes: int = 180
    exam_date: Optional[str] = None
    pdf_filename: Optional[str] = None
    positive_mark: float = 1.5
    negative_mark: float = 0.0
    status: Optional[str] = "ACTIVE"

class TestSeriesCreate(TestSeriesBase):
    pass

class TestSeriesUpdate(BaseModel):
    test_code: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    paper: Optional[str] = None
    standard: Optional[str] = None
    total_questions: Optional[int] = None
    duration_minutes: Optional[int] = None
    exam_date: Optional[str] = None
    pdf_filename: Optional[str] = None
    positive_mark: Optional[float] = None
    negative_mark: Optional[float] = None
    status: Optional[str] = None

class TestSeriesResponse(TestSeriesBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# OMR SCHEMAS
# =============================================================================

class OMRKeyItem(BaseModel):
    question_no: int
    correct_option: str
    marks: Optional[float] = 1.5
    explanation: Optional[str] = None

class OMRKeysSaveRequest(BaseModel):
    test_id: int
    keys: List[OMRKeyItem]

class OMRSubmitRequest(BaseModel):
    test_id: Optional[int] = 1
    test_code: Optional[str] = None
    student_roll_no: Optional[str] = None
    student_name: Optional[str] = None
    answers: Dict[str, str] = {}
    time_spent_seconds: Optional[int] = 3600

class OMRSubmissionResponse(BaseModel):
    id: int
    submission_code: str
    test_id: Optional[int] = None
    student_roll_no: Optional[str] = None
    student_name: str
    test_title: str
    total_questions: int
    attempted_count: int
    correct_count: int
    incorrect_count: int
    unshaded_count: int
    raw_score: float
    max_marks: float
    percentage: float
    accuracy: float
    simulated_rank: Optional[int] = None
    cutoff_zone: Optional[str] = None
    candidate_answers_json: Optional[str] = None
    breakdown_json: Optional[str] = None
    time_spent_seconds: Optional[int] = 3600
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =============================================================================
# SYLLABUS SCHEMAS
# =============================================================================

class SyllabusBase(BaseModel):
    title: str
    category: str = "TNPSC"
    department: Optional[str] = None
    paper: Optional[str] = None
    pdf_filename: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class SyllabusCreate(SyllabusBase):
    pass

class SyllabusResponse(SyllabusBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
