"""
Bharathi Thervukalam - SQLAlchemy Database Models
Strict relational mapping for Users (RBAC), Courses, Test Series, Achievers, and OMR Sheets.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Enum as SqlEnum
)
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    STAFF = "staff"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.STUDENT.value, nullable=False)
    full_name = Column(String(150), nullable=True)
    register_no = Column(String(50), nullable=True, unique=True, index=True)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    omr_sheets = relationship("OMRSheet", back_populates="student", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_key = Column(String(50), index=True, nullable=False)  # group1, group2, group4, siTechnical, etc.
    category = Column(String(50), default="TNPSC", nullable=False)  # TNPSC / TNUSRB
    title = Column(String(255), nullable=False)
    paper = Column(String(150), nullable=True)
    subject = Column(String(255), nullable=True)
    department = Column(String(150), nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TestSeries(Base):
    __tablename__ = "test_series"

    id = Column(Integer, primary_key=True, index=True)
    test_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="TNPSC", nullable=False)
    department = Column(String(150), nullable=True)
    total_questions = Column(Integer, default=25, nullable=False)
    duration_minutes = Column(Integer, default=180, nullable=False)
    exam_date = Column(String(50), nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    positive_mark = Column(Float, default=1.5)
    negative_mark = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    omr_sheets = relationship("OMRSheet", back_populates="test", cascade="all, delete-orphan")

class Achiever(Base):
    __tablename__ = "achievers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    posting = Column(String(200), nullable=False)
    exam = Column(String(100), default="TNPSC Group IV", nullable=False)
    category = Column(String(50), default="group4")
    year = Column(String(20), default="2026")
    department = Column(String(200), nullable=True)
    rank_text = Column(String(100), nullable=True)
    story = Column(Text, nullable=True)
    advice = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class OMRSheet(Base):
    __tablename__ = "omr_sheets"

    id = Column(Integer, primary_key=True, index=True)
    submission_code = Column(String(100), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id = Column(Integer, ForeignKey("test_series.id", ondelete="CASCADE"), nullable=True)
    student_name = Column(String(150), nullable=False)
    register_no = Column(String(50), nullable=True)
    test_title = Column(String(255), nullable=False)
    total_questions = Column(Integer, default=25)
    answered_count = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    blank_count = Column(Integer, default=0)
    total_score = Column(Float, default=0.0)
    max_score = Column(Float, default=37.5)
    percentage = Column(Float, default=0.0)
    answers_json = Column(Text, nullable=True)  # JSON representation of selected options {"1": "A", ...}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="omr_sheets")
    test = relationship("TestSeries", back_populates="omr_sheets")
