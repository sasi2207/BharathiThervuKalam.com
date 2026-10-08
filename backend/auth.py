"""
Bharathi Thervukalam - Authentication & RBAC Engine
JWT token generation, cryptographic password hashing, and FastAPI dependency guards.
"""

import os
import time
import hashlib
import json
from datetime import datetime, timedelta
from typing import Optional, List, Callable

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import User

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "bharathi_super_secret_jwt_key_2026_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 Hours

# Security Scheme for Swagger UI & Header Extraction
security = HTTPBearer(auto_error=False)

# =============================================================================
# PASSWORD CRYPTOGRAPHY
# =============================================================================

SALT = "bharathi_secure_salt_2026"

def get_password_hash(password: str) -> str:
    """Hash password securely using bcrypt or salted SHA-256."""
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)
    except Exception:
        # Resilient crypto fallback
        return hashlib.sha256((SALT + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored hash."""
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        pass
    
    # Check salted sha256 or direct match for demo
    expected_hash = hashlib.sha256((SALT + plain_password).encode("utf-8")).hexdigest()
    return expected_hash == hashed_password or plain_password == hashed_password

# =============================================================================
# JWT TOKEN GENERATION & DECODING
# =============================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encode payload into signed JWT token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": int(expire.timestamp()), "iat": int(datetime.utcnow().timestamp())})

    try:
        import jwt  # PyJWT or python-jose
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        if isinstance(encoded_jwt, bytes):
            encoded_jwt = encoded_jwt.decode("utf-8")
        return encoded_jwt
    except Exception:
        # Standard HMAC-SHA256 JWT representation if external library not installed
        import hmac
        import base64
        header = {"alg": "HS256", "typ": "JWT"}
        header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
        payload_b64 = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip("=")
        signing_input = f"{header_b64}.{payload_b64}".encode()
        signature = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
        sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
        return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> dict:
    """Validate signature and decode token payload."""
    try:
        import jwt
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        pass
    
    # Internal signature validation fallback
    try:
        import hmac
        import base64
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Malformed token")
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode()
        expected_sig = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
        
        # Add padding back
        pad = len(sig_b64) % 4
        if pad:
            sig_b64 += "=" * (4 - pad)
        actual_sig = base64.urlsafe_b64decode(sig_b64.encode())
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            raise ValueError("Signature verification failed")
            
        pad_p = len(payload_b64) % 4
        if pad_p:
            payload_b64 += "=" * (4 - pad_p)
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        
        # Check expiration
        if "exp" in payload and payload["exp"] < int(time.time()):
            raise ValueError("Token has expired")
            
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

# =============================================================================
# FASTAPI DEPENDENCY GUARDS: AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
# =============================================================================

async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Enforces JWT authentication on endpoints.
    Fails with HTTP 401 Unauthorized if token is missing, invalid, or expired.
    """
    token = None
    if auth and auth.credentials:
        token = auth.credentials
    elif authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        else:
            token = authorization

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing Bearer token in Authorization header.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    user_id = payload.get("sub") or payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is invalid or corrupted.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this token no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

def require_role(*allowed_roles: str) -> Callable:
    """
    Role-Based Access Control (RBAC) Dependency Factory.
    Fails with HTTP 403 Forbidden if current user's role is not in allowed_roles.
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.lower().strip()
        normalized_allowed = [r.lower().strip() for r in allowed_roles]

        if user_role not in normalized_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User role '{current_user.role}' lacks permissions for this operation. Required: {', '.join(allowed_roles)}.",
            )
        return current_user

    return role_checker
