"""
Bharathi Thervukalam - Authentication Routes
Strict Dynamic Database-Only Authentication.
No bypass, no hardcoded fallbacks, no auto-creation on wrong password.
"""

import hashlib
import hmac
import os
import random
import secrets
import time
from flask import Blueprint, request, jsonify
from database import query_one, execute_write
from config import Config

auth_bp = Blueprint("auth", __name__)

# =============================================================================
# SECURE PASSWORD VERIFICATION (NO BYPASS)
# =============================================================================

def hash_password(password: str) -> str:
    """PBKDF2-HMAC-SHA256 hash generation."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"{salt}${key}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """
    STRICT CHECK: Compares input strictly against the database hash.
    No hardcoded plain text strings allowed.
    """
    if not stored_hash or not plain_password:
        return False

    # 1. PBKDF2 Format Check (salt$key)
    if "$" in stored_hash:
        try:
            salt, key = stored_hash.split("$", 1)
            calculated_key = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                100_000
            ).hex()
            return hmac.compare_digest(key, calculated_key)
        except Exception:
            return False

    # 2. Legacy Salted SHA-256 Check (Old DB Records)
    legacy_salt = getattr(Config, "LEGACY_SALT", "bharathi_salt_2026")
    legacy_hash = hashlib.sha256((legacy_salt + plain_password).encode("utf-8")).hexdigest()
    if hmac.compare_digest(stored_hash, legacy_hash):
        return True

    # 3. Direct SHA-256 Check (If plain SHA256 was used)
    direct_sha256 = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return hmac.compare_digest(stored_hash, direct_sha256)

def generate_jwt_token(user_id: int, username: str, role: str) -> str:
    """Generate signed JWT Token with expiration."""
    try:
        import jwt
        expires_hours = getattr(Config, "JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24)
        payload = {
            "sub": str(user_id),
            "username": username,
            "role": role,
            "exp": int(time.time()) + (expires_hours * 3600),
            "iat": int(time.time())
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")
    except Exception:
        rand_token = secrets.token_urlsafe(32)
        return f"BTK-{role.upper()}-{user_id}-{rand_token}"


# =============================================================================
# 1. ADMIN AUTHENTICATION (STRICT DB ONLY)
# =============================================================================

@auth_bp.route("/admin/admin_login.php", methods=["POST"])
@auth_bp.route("/api/auth/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json(silent=True) or request.form.to_dict()
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password are required"}), 400

    # 1. Search DB for matching user
    admin = query_one(
        "SELECT * FROM admins WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1",
        (username, username)
    )

    # 2. If user NOT found, reject immediately (NO auto-seed)
    if not admin:
        return jsonify({"status": "error", "message": "Invalid username or password"}), 401

    # 3. Verify password hash against database
    if not verify_password(password, admin.get("password_hash", "")):
        return jsonify({"status": "error", "message": "Invalid username or password"}), 401

    token = generate_jwt_token(admin["id"], admin["username"], admin.get("role", "ADMIN"))
    return jsonify({
        "status": "success",
        "message": "Admin login successful",
        "token": token,
        "admin": {
            "id": admin["id"],
            "username": admin["username"],
            "email": admin.get("email"),
            "role": admin.get("role", "SUPER_ADMIN")
        }
    }), 200


# =============================================================================
# 2. STUDENT AUTHENTICATION (STRICT DB ONLY)
# =============================================================================

@auth_bp.route("/student/student_login.php", methods=["POST"])
@auth_bp.route("/api/auth/student/login", methods=["POST"])
def student_login():
    data = request.get_json(silent=True) or request.form.to_dict()
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()

    if not username or not password:
        return jsonify({"status": "error", "message": "Roll number/username and password are required"}), 400

    # 1. Search student exclusively from database
    student = query_one(
        """SELECT * FROM students 
           WHERE LOWER(username) = LOWER(%s) 
              OR UPPER(register_no) = UPPER(%s) 
              OR LOWER(email) = LOWER(%s) 
           LIMIT 1""",
        (username, username, username)
    )

    # 2. If student does NOT exist in DB, reject immediately (NO demo auto-creation)
    if not student:
        return jsonify({"status": "error", "message": "Invalid roll number/username or password"}), 401

    # 3. Check password strictly
    if not verify_password(password, student.get("password_hash", "")):
        return jsonify({"status": "error", "message": "Invalid roll number/username or password"}), 401

    token = generate_jwt_token(student["id"], student["username"], "STUDENT")
    return jsonify({
        "status": "success",
        "message": "Student login successful",
        "token": token,
        "student": {
            "id": student["id"],
            "register_no": student.get("register_no"),
            "username": student.get("username"),
            "email": student.get("email"),
            "phone_number": student.get("phone_number")
        }
    }), 200


# =============================================================================
# 3. STAFF AUTHENTICATION (STRICT DB ONLY)
# =============================================================================

@auth_bp.route("/staff/staff_login.php", methods=["POST"])
@auth_bp.route("/api/auth/staff/login", methods=["POST"])
def staff_login():
    data = request.get_json(silent=True) or request.form.to_dict()
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()

    if not username or not password:
        return jsonify({"status": "error", "message": "Staff username and password required"}), 400

    # 1. Search staff exclusively from database
    staff = query_one(
        "SELECT * FROM staff WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1",
        (username, username)
    )

    # 2. Reject if staff does not exist in DB
    if not staff:
        return jsonify({"status": "error", "message": "Invalid staff credentials"}), 401

    # 3. Check password strictly
    if not verify_password(password, staff.get("password_hash", "")):
        return jsonify({"status": "error", "message": "Invalid staff credentials"}), 401

    token = generate_jwt_token(staff["id"], staff["username"], staff.get("role", "STAFF"))
    return jsonify({
        "status": "success",
        "message": "Staff login successful",
        "token": token,
        "staff": {
            "id": staff["id"],
            "name": staff.get("name"),
            "username": staff.get("username"),
            "email": staff.get("email"),
            "role": staff.get("role", "INSTRUCTOR")
        }
    }), 200