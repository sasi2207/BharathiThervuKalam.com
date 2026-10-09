"""
Bharathi Thervukalam - SQLAlchemy Database Models
Strict relational mapping for Users (RBAC), Students, Staff, Faculty, Achievers,
Courses, Test Series, Syllabus, and Digital OMR Evaluation Sheets.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    STAFF = "staff"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default=UserRole.STUDENT.value, nullable=False)
    full_name = Column(String(150), nullable=True)
    register_no = Column(String(50), nullable=True, unique=True, index=True)
    phone_number = Column(String(30), nullable=True)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    omr_sheets = relationship("OMRSheet", back_populates="student", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    register_no = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=False)
    father_name = Column(String(150), nullable=True)
    dob = Column(String(50), nullable=True)
    qualification = Column(String(150), nullable=True)
    community = Column(String(50), nullable=True)
    blood_group = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=False)
    designation = Column(String(150), nullable=False)
    department = Column(String(150), nullable=False)
    role = Column(String(50), default="STAFF", nullable=False)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    username = Column(String(100), nullable=True)
    designation = Column(String(150), nullable=False)
    subject = Column(String(255), nullable=False)
    paper = Column(String(150), nullable=True)
    experience = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    category = Column(String(50), default="TNPSC", nullable=False)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Achiever(Base):
    __tablename__ = "achievers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    posting = Column(String(200), nullable=False)
    exam = Column(String(100), default="TNPSC Group IV", nullable=False)
    category = Column(String(50), default="group4", nullable=False)
    year = Column(String(20), default="2026", nullable=False)
    department = Column(String(200), nullable=True)
    rank_text = Column(String(100), nullable=True)
    story = Column(Text, nullable=True)
    advice = Column(Text, nullable=True)
    hometown = Column(String(100), nullable=True)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_key = Column(String(50), index=True, nullable=False)  # group1, group2, group2A, group4, siTechnical, etc.
    category = Column(String(50), default="TNPSC", nullable=False)  # TNPSC / TNUSRB
    title = Column(String(255), nullable=False)
    paper = Column(String(150), nullable=True)
    subject = Column(String(255), nullable=True)
    department = Column(String(150), nullable=True)
    syllabus = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    standard = Column(String(100), nullable=True)
    duration = Column(String(50), nullable=True)
    fees = Column(Float, default=0.0)
    pdf_filename = Column(String(255), nullable=True)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TestSeries(Base):
    __tablename__ = "test_series"

    id = Column(Integer, primary_key=True, index=True)
    test_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="TNPSC", nullable=False)
    department = Column(String(150), nullable=True)
    paper = Column(String(150), nullable=True)
    standard = Column(String(100), default="Question", nullable=True)
    total_questions = Column(Integer, default=25, nullable=False)
    duration_minutes = Column(Integer, default=180, nullable=False)
    exam_date = Column(String(50), nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    positive_mark = Column(Float, default=1.5)
    negative_mark = Column(Float, default=0.0)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    omr_sheets = relationship("OMRSheet", back_populates="test", cascade="all, delete-orphan")

class OMRKey(Base):
    __tablename__ = "omr_keys"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, nullable=False, index=True)
    question_no = Column(Integer, nullable=False)
    correct_option = Column(String(10), nullable=False)
    marks = Column(Float, default=1.5)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OMRSheet(Base):
    __tablename__ = "omr_sheets"

    id = Column(Integer, primary_key=True, index=True)
    submission_code = Column(String(100), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    test_id = Column(Integer, ForeignKey("test_series.id", ondelete="CASCADE"), nullable=True)
    student_roll_no = Column(String(50), nullable=True, index=True)
    student_name = Column(String(150), nullable=False)
    test_title = Column(String(255), nullable=False)
    total_questions = Column(Integer, default=25)
    attempted_count = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    unshaded_count = Column(Integer, default=0)
    raw_score = Column(Float, default=0.0)
    max_marks = Column(Float, default=37.5)
    percentage = Column(Float, default=0.0)
    accuracy = Column(Float, default=0.0)
    simulated_rank = Column(Integer, nullable=True)
    cutoff_zone = Column(String(50), nullable=True)
    candidate_answers_json = Column(Text, nullable=True)
    breakdown_json = Column(Text, nullable=True)
    time_spent_seconds = Column(Integer, default=3600)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="omr_sheets")
    test = relationship("TestSeries", back_populates="omr_sheets")

class Syllabus(Base):
    __tablename__ = "syllabus"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="TNPSC", nullable=False)
    department = Column(String(150), nullable=True)
    paper = Column(String(150), nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
