"""
Bharathi Thervukalam - Main Python FastAPI Backend Entrypoint
Loads the primary application instance from main.py and starts the ASGI server.
"""

import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Expose the FastAPI application instance
from main import app, init_database

if __name__ == "__main__":
    init_database()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8081))
    print("=" * 70)
    print("  Bharathi Thervukalam - Python FastAPI Backend Starting")
    print(f"  Listening on http://{host}:{port}")
    print(f"  Interactive OpenAPI Docs: http://{host}:{port}/docs")
    print(f"  ReDoc Documentation: http://{host}:{port}/redoc")
    print("=" * 70)

    try:
        import uvicorn
        uvicorn.run("main:app", host=host, port=port, reload=False)
    except ImportError:
        print("[Notice] 'uvicorn' not found. Install requirements: pip install -r backend/requirements.txt")
