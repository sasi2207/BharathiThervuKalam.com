"""
Bharathi Thervukalam - Database Layer
SQLAlchemy Engine & Session Configuration strictly for MySQL (PyMySQL driver).
"""

import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# -----------------------------------------------------------------------------
# MySQL Credentials & Connection URL Construction
# -----------------------------------------------------------------------------
MYSQL_USER = os.getenv("MYSQL_USER", "techsasi_2207")
raw_password = os.getenv("MYSQL_PASSWORD", "SasiKutty2207@Lovely")
# URL-encode the password to safely handle special characters like '@'
MYSQL_PASSWORD = urllib.parse.quote_plus(raw_password)

MYSQL_HOST = os.getenv("MYSQL_HOST", "65.108.76.42")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "techsasi_bharathi")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
)

# -----------------------------------------------------------------------------
# Direct MySQL Engine Setup (Production Connection Pooling)
# -----------------------------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 10}
)

# Immediate probe test to fail fast if MySQL is unreachable
try:
    with engine.connect() as conn:
        print(f"[Database] Successfully connected to MySQL at {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}")
except Exception as e:
    print(f"[Database Error] Failed to connect to MySQL: {e}")
    raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()