"""
Bharathi Thervukalam - Course Payment & Order Router
Razorpay order creation mock and verification handler.
"""

import os
import random
import time
from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix="/api/payment", tags=["Payment Gateway"])

@router.post("/create-order")
async def create_payment_order(request: Request):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    amount = float(data.get("amount", 1))
    order_id = f"order_{int(time.time())}_{random.randint(1000, 9999)}"

    return {
        "status": "success",
        "order_id": order_id,
        "amount": int(amount * 100),  # In paise
        "currency": "INR",
        "key_id": os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock_bharathi_2026")
    }

@router.post("/verify")
async def verify_payment(request: Request):
    try:
        data = await request.json()
    except Exception:
        data = dict(await request.form())

    return {
        "status": "success",
        "verified": True,
        "message": "Payment verified and student enrollment confirmed."
    }
