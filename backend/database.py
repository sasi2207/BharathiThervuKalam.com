"""
Bharathi Thervukalam - Database Layer
Production-grade SQLAlchemy Engine & Session Configuration.
Supports MySQL / MariaDB (PyMySQL driver) with seamless local SQLite fallback
for high availability, testing, and offline resilience.
"""

import os
import urllib.parse
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
SQLITE_DB_PATH = DATA_DIR / "database.sqlite3"

# -----------------------------------------------------------------------------
# Database Credentials & URL Resolution
# -----------------------------------------------------------------------------
MYSQL_USER = os.getenv("MYSQL_USER", "techsasi_2207")
raw_password = os.getenv("MYSQL_PASSWORD", "SasiKutty2207@Lovely")
MYSQL_PASSWORD = urllib.parse.quote_plus(raw_password)
MYSQL_HOST = os.getenv("MYSQL_HOST", "65.108.76.42")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "techsasi_bharathi")

DEFAULT_MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

Base = declarative_base()

def create_resilient_engine():
    """
    Connect to MySQL if accessible; gracefully fall back to SQLite
    to prevent crash loops in environments without direct MySQL reachability.
    """
    # 1. If explicit sqlite database URL is specified
    if DATABASE_URL.startswith("sqlite"):
        return create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False}
        ), "sqlite"

    # 2. Try MySQL connection
    try:
        mysql_engine = create_engine(
            DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_recycle=3600,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3}
        )
        with mysql_engine.connect() as conn:
            print(f"[Database] Successfully connected to MySQL at {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}")
            return mysql_engine, "mysql"
    except Exception as err:
        print(f"[Database Notice] Remote MySQL unavailable ({err}). Falling back to local SQLite at {SQLITE_DB_PATH}")
        sqlite_engine = create_engine(
            f"sqlite:///{SQLITE_DB_PATH}",
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine, "sqlite"

engine, DB_ENGINE_TYPE = create_resilient_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
