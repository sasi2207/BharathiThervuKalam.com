#!/usr/bin/env python3
"""
Bharathi Thervukalam - Database Seeding Utility
Populates MySQL database with initial courses, faculty, achievers, tests, and master OMR keys.
"""

from database import init_db, query_all, execute_write

def seed():
    print("[Seed] Initializing MySQL tables from schema.sql...")
    init_db()

    # Verify seed
    admins = query_all("SELECT id, username, email FROM admins")
    print(f"[Seed] Admins found: {len(admins)}")

    tests = query_all("SELECT id, test_code, title FROM tests")
    print(f"[Seed] Tests found: {len(tests)}")

    faculty = query_all("SELECT id, name, designation FROM faculty")
    print(f"[Seed] Faculty found: {len(faculty)}")

    achievers = query_all("SELECT id, name, posting FROM achievers")
    print(f"[Seed] Achievers found: {len(achievers)}")

    print("[Seed] Database setup complete!")

if __name__ == "__main__":
    seed()
