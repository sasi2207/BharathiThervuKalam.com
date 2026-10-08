# பாரதி தேர்வுக்களம் (Bharathi Thervukalam) - Python FastAPI High-Performance Backend

High-performance, production-ready backend API service for **Bharathi Thervukalam** competitive exam coaching institute (TNPSC & TNUSRB). Built with **Python 3.10+**, **FastAPI**, **Pydantic v2**, and **SQLite (WAL Mode) / MySQL**.

---

## 🛠 Tech Stack
- **Language**: Python 3.10+
- **Framework**: **FastAPI** (ASGI, high concurrency, automatic OpenAPI & JSON Schema)
- **Server**: **Uvicorn** (Lightning-fast ASGI server)
- **Validation**: **Pydantic v2** (Strict data parsing & type safety)
- **Database**: 
  - Native **SQLite with Write-Ahead Logging (WAL)**, foreign keys, and indexes (zero setup required)
  - Optional **MySQL 8.0+** support via SQLAlchemy / PyMySQL
- **Documentation**: Automatic **Swagger UI** (`/docs`) & **ReDoc** (`/redoc`)
- **Zero-Dependency Fallback**: Built-in standalone server runnable directly using standard library Python 3!

---

## 📁 Directory Structure
```
backend/
├── main.py                # Primary FastAPI application with all routes, schemas & bulk operations
├── app.py                 # FastAPI application runner & entrypoint
├── standalone_server.py   # Zero-dependency standard library Python server
├── schemas.py             # Pydantic validation schemas
├── models.py              # Relational models (Users, Courses, Tests, OMR, Achievers)
├── database.py            # SQLite WAL / MySQL connection engine
├── config.py              # Environment configuration & JWT secrets
├── requirements.txt       # Dependencies (fastapi, uvicorn, pydantic, etc.)
├── routers/               # Modular FastAPI sub-routers
│   ├── auth.py            # Unified authentication router (Student, Staff, Admin)
│   ├── courses.py         # Courses & syllabus router
│   ├── test_series.py     # Mock test series & attachments router
│   ├── omr.py             # Digital OMR evaluator router
│   └── achievers.py       # Alumni officers hall of fame router
└── schema.sql             # Relational schema DDL definition
```

---

## 🚀 Quick Setup & Run

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run with FastAPI / Uvicorn (Recommended)
```bash
# Using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Or via Python runner
python3 main.py

# Or from project root via npm
npm run backend:fastapi
```
The server will start listening at: `http://localhost:8000`

### 3. Interactive Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### 4. Zero-Dependency Execution (Fallback)
If you wish to test immediately without installing pip packages:
```bash
python3 backend/standalone_server.py
```
This runs the full API suite using standard library Python!

---

## 📡 API Endpoints Reference

### 🔐 1. Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` or `/login.php` | Unified login (Student, Staff, Super Admin) with signed JWT |
| `POST` | `/api/auth/student/login` or `/student/student_login.php` | Student login by Register No / Username |
| `POST` | `/api/auth/student/register` or `/student/student_register.php` | Student self-registration with auto register number |
| `POST` | `/api/auth/student/forgot-password` | Student password recovery link dispatcher |
| `POST` | `/api/auth/admin/login` or `/admin/admin_login.php` | Super Admin authentication |
| `POST` | `/api/auth/staff/login` or `/staff/staff_login.php` | Faculty / Staff evaluator login |
| `POST` | `/api/auth/staff/forgot-password` | Staff credential verification |

### ⚡ 2. Users Module & 10,000 Bulk Engine
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Paginated, searchable, indexed user catalog |
| `POST` | `/api/users` | Single user registration |
| `PUT` | `/api/users/{id}` | Full user update |
| `PATCH` | `/api/users/{id}` | Partial user status patch |
| `DELETE` | `/api/users/{id}` | Soft delete user |
| `POST` | `/api/users/bulk` | **Bulk Insert up to 10,000 users** in single WAL transaction |
| `PUT` | `/api/users/bulk` | **Bulk Update up to 10,000 users** |
| `PATCH` | `/api/users/bulk` | **Bulk Status Patch up to 10,000 users** |
| `DELETE` | `/api/users/bulk` | **Bulk Delete up to 10,000 users** |

### 📚 3. Courses & Syllabus
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | List all TNPSC & TNUSRB courses |
| `POST` | `/api/courses` | Create new course syllabus |
| `DELETE` | `/api/courses/{id}` | Remove course |
| `GET` | `/api/courses/group1` or `/group1_all.php` | TNPSC Group I syllabus |
| `GET` | `/api/courses/group2` or `/group2_all.php` | TNPSC Group II syllabus |
| `GET` | `/api/courses/group2A` or `/group2A_all.php` | TNPSC Group II-A syllabus |
| `GET` | `/api/courses/group4` or `/group4_all.php` | TNPSC Group IV & VAO syllabus |
| `GET` | `/api/courses/jointRecruitment` or `/join_view.php` | TNUSRB SI Joint Recruitment syllabus |
| `GET` | `/api/courses/siTechnical` or `/technical_view.php` | TNUSRB SI Technical syllabus |
| `GET` | `/api/courses/siFingerprint` or `/fingerprints_view.php` | TNUSRB SI Finger Print syllabus |
| `GET` | `/api/courses/commonRecruitment` or `/tnusrbs_view.php` | TNUSRB Common Police Constable syllabus |

### 📝 4. Test Series & Question Papers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tests` or `/test_all.php` | Retrieve all scheduled mock test series |
| `GET` | `/api/tests/{id}` | Get individual test details |
| `POST` | `/api/tests` or `/test_upload.php` | Schedule test, configure questions, marks & duration |
| `PUT` | `/api/tests/{id}` or `/test_update.php` | Update test schedule |
| `DELETE` | `/api/tests/{id}` or `/test_delete.php` | Delete test series |
| `GET` | `/api/tests/{id}/download` or `/test_download.php` | Download PDF question paper |

### 🎯 5. Digital OMR Answer Keys & Automated Scoring Engine
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/omr/master-keys?test_id={id}` or `/omr_master_keys.php` | Fetch official 25-question master answer key matrix |
| `POST` | `/api/omr/master-keys` or `/omr_master_save.php` | Save / update master answer keys |
| `POST` | `/api/omr/submit` or `/omr_submit.php` | **Submit Candidate OMR**: Computes raw score, percentage, accuracy, statewide simulated rank, and generates detailed scorecard |
| `GET` | `/api/omr/submissions` or `/omr_submissions_all.php` | Retrieve candidate OMR submission history (filterable by `roll_no`) |
| `GET` | `/api/omr/{submission_id}` | Detailed inspection with question-by-question candidate vs key comparison |

### 👨‍🏫 6. Faculty Mentors & Achievers Hall of Fame
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/faculty` or `/staff_view_all.php` | List faculty mentors |
| `POST` | `/api/faculty` or `/staff_view_save.php` | Add new faculty mentor profile |
| `PUT` | `/api/faculty/{id}` or `/staff_view_update.php` | Update faculty profile |
| `DELETE` | `/api/faculty/{id}` or `/staff_view_delete.php` | Remove faculty profile |
| `GET` | `/api/achievers` or `/achivers_all.php` | List alumni officer selections (130+ achievements) |
| `POST` | `/api/achievers` or `/achivers_save.php` | Add new officer testimonial |
| `DELETE` | `/api/achievers/{id}` or `/achivers_delete.php` | Remove testimonial |

### 👥 7. Students & Staff Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` or `/student_all.php` | Paginated enrolled student roster |
| `POST` | `/api/students` or `/student/student_save.php` | Enroll new candidate |
| `PUT` | `/api/students/{id}` | Update candidate details |
| `DELETE` | `/api/students/{id}` or `/student_delete.php` | Delete student record |
| `GET` | `/api/students/export` or `/exportToPDF.php` | Export enrolled students list as CSV |
| `GET` | `/api/staff` | List staff evaluators |
| `POST` | `/api/staff` | Add new staff member |
| `DELETE` | `/api/staff/{id}` | Remove staff member |

### 📊 8. Health & Live Performance Metrics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` or `/` | Live health probe with engine info & record counts |
| `GET` | `/api/metrics` | Average response time and DB query latency audit stats |

---

## 🧪 Testing with cURL
```bash
# 1. Check Backend Health
curl http://localhost:8000/api/health

# 2. View Active Test Series
curl http://localhost:8000/api/tests

# 3. Submit and Grade OMR Sheet
curl -X POST http://localhost:8000/api/omr/submit \
  -H "Content-Type: application/json" \
  -d '{
    "testId": 1,
    "rollNo": "BTK2026-0428",
    "studentName": "S. Kabilan",
    "candidateAnswers": {"1": "C", "2": "B", "3": "C", "4": "B", "5": "A"},
    "timeSpentSeconds": 3600
  }'
```
