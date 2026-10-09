"""
Bharathi Thervukalam - Modular Routers Package
"""

from routers.auth import router as auth_router
from routers.courses import router as courses_router
from routers.tests import router as tests_router
from routers.omr import router as omr_router
from routers.students import router as students_router
from routers.faculty import router as faculty_router
from routers.staff import router as staff_router
from routers.achievers import router as achievers_router
from routers.users import router as users_router
from routers.syllabus import router as syllabus_router
from routers.payment import router as payment_router

__all__ = [
    "auth_router",
    "courses_router",
    "tests_router",
    "omr_router",
    "students_router",
    "faculty_router",
    "staff_router",
    "achievers_router",
    "users_router",
    "syllabus_router",
    "payment_router",
]
