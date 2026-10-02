"""
Bharathi Thervukalam - Database Layer
SQLAlchemy Engine & Session Configuration for MySQL (PyMySQL driver)
Includes resilient SQLite fallback when MySQL server is unreachable.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database credentials (configurable via environment variables)
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "rootpassword")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "bharathi_db")

# Primary MySQL connection URL (using pymysql driver)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
)

# SQLite fallback path for local development / testing without active MySQL daemon
FALLBACK_SQLITE_URL = "sqlite:///./bharathi_local.db"

# Create engine with automatic fallback
try:
    if "mysql" in DATABASE_URL:
        # Test connection or configure connection pool with ping
        engine = create_engine(
            DATABASE_URL,
            pool_recycle=3600,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5}
        )
        # Attempt immediate probe
        with engine.connect():
            pass
        print(f"[Database] Connected successfully to MySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}")
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    print(f"[Database Warning] Could not connect to MySQL ({e}). Using resilient SQLite fallback.")
    engine = create_engine(FALLBACK_SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
