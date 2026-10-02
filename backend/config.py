"""
Bharathi Thervukalam - Backend Configuration
Handles MySQL database credentials, JWT secrets, and filesystem paths.
"""

import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Config:
    # Server Settings
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # Security & Tokens
    SECRET_KEY = os.getenv("SECRET_KEY", "bharathi-academy-enterprise-secure-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "bharathi-jwt-super-secret-token-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES_HOURS = 24

    # MySQL Database Settings
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "bharathi_db")
    MYSQL_CHARSET = "utf8mb4"
    MYSQL_CONNECT_TIMEOUT = 5

    # File Uploads
    UPLOAD_FOLDER = str(UPLOAD_DIR)
    MAX_CONTENT_LENGTH = 32 * 1024 * 1024  # 32 MB max upload limit
    ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "png", "jpg", "jpeg"}

    # CORS Settings
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "https://www.bharathithervukalam.com",
        "https://bharathi.techsasi.com",
        "*"
    ]
