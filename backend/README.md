# பாரதி தேர்வுக்களம் (Bharathi Thervukalam) - Python & MySQL Backend

Production-ready backend API service for **Bharathi Thervukalam** competitive exam coaching institute (TNPSC & TNUSRB). Built with **Python** and **MySQL**.

---

## 🛠 Tech Stack
- **Language**: Python 3.10+
- **Framework**: Flask (with CORS, Blueprints, and JWT Authentication)
- **Database**: MySQL 8.0+ (PyMySQL connection driver with connection pooling & dictionary cursors)
- **Zero-Dependency Fallback**: Built-in standalone server runnable directly using standard library

---

## 📁 Directory Structure
```
backend/
├── app.py                 # Primary Flask application factory with all blueprints
├── standalone_server.py   # Zero-dependency standard library Python server
├── config.py              # MySQL connection & JWT configuration
├── database.py            # PyMySQL pool, cursor utilities, and auto-init
├── schema.sql             # Complete MySQL schema DDL & initial seed records
├── seed.py                # Database population utility script
├── requirements.txt       # Python dependencies (Flask, PyMySQL, etc.)
├── .env.example           # Environment template
└── routes/
    ├── auth_routes.py     # Admin, Student, and Staff Login & Registration
    ├── courses_routes.py  # TNPSC & TNUSRB Course Syllabi CRUD & PDF uploads
    ├── tests_routes.py    # Test Series Schedules, Question Papers & Attachments
    ├── omr_routes.py      # Automated OMR Evaluation Engine & Master Answer Keys
    ├── faculty_routes.py  # Faculty & Mentor Roster Management
    ├── achievers_routes.py# Selected Officer Hall of Fame
    ├── students_routes.py # Registered Student Roster & CSV/PDF Export
    └── staff_routes.py    # Staff Profiles & Assignments
```

---

## 🚀 Quick Setup & Run

### 1. Configure MySQL Database
Create your MySQL database and import the schema:
```bash
mysql -u root -p < backend/schema.sql
```
Or simply create a database named `bharathi_db`—the backend automatically checks and bootstraps tables on first run!

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```
Update your MySQL host, port, user, and password.

### 3. Install Dependencies & Run Primary Flask App
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```
The server will start listening at: `http://localhost:5000`

### 4. Zero-Dependency Execution (Alternative)
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
| `POST` | `/api/auth/admin/login` or `/admin/admin_login.php` | Admin authentication & JWT token |
| `POST` | `/api/auth/admin/register` or `/admin/admin_register.php` | Register new administrator |
| `POST` | `/api/auth/student/login` or `/student/student_login.php` | Student login by Roll No / username |
| `POST` | `/api/auth/student/register` or `/student/student_register.php` | Student registration & auto roll generation |
| `POST` | `/api/auth/student/forgot-password` or `/student/student_forgot_password.php` | Password recovery |
| `POST` | `/api/auth/staff/login` or `/staff/staff_login.php` | Staff coordinator login |
| `POST` | `/api/auth/staff/register` or `/staff/staff_register.php` | Staff coordinator registration |

### 📚 2. Courses & Syllabus
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses/group1` or `/group1_all.php` | TNPSC Group I syllabus records |
| `POST` | `/api/courses/group1` or `/group1_save.php` | Add Group I syllabus module |
| `GET` | `/api/courses/group2` or `/group2_all.php` | TNPSC Group II syllabus records |
| `GET` | `/api/courses/group2A` or `/group2A_all.php` | TNPSC Group II-A syllabus records |
| `GET` | `/api/courses/group4` or `/group4_all.php` | TNPSC Group IV & VAO syllabus records |
| `GET` | `/api/courses/jointRecruitment` or `/join_view.php` | TNUSRB Joint SI syllabus |
| `GET` | `/api/courses/siTechnical` or `/technical_view.php` | TNUSRB SI Technical syllabus |
| `GET` | `/api/courses/siFingerprint` or `/fingerprints_view.php` | TNUSRB SI Finger Print syllabus |
| `GET` | `/api/courses/commonRecruitment` or `/tnusrbs_view.php` | TNUSRB Common PC syllabus |

### 📝 3. Test Series & Question Papers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tests` or `/test_all.php` | Retrieve all scheduled mock test series |
| `POST` | `/api/tests` or `/test_upload.php` | Schedule test, upload question paper PDF & set marks |
| `PUT` | `/api/tests/<id>` or `/test_update.php?id=<id>` | Update test details |
| `DELETE` | `/api/tests/<id>` or `/test_delete.php?id=<id>` | Delete test and related question records |
| `GET` | `/api/tests/<id>/download` or `/test_download.php?id=<id>` | Download question paper PDF |

### 🎯 4. NEWLY GENERATED: OMR Answer Keys & Automated Evaluation Engine
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/omr/tests` or `/omr_tests.php` | List tests with full questions & master answer keys |
| `GET` | `/api/omr/master-keys?test_id=<id>` or `/omr_master_keys.php` | Get master key matrix for a specific test |
| `POST` | `/api/omr/master-keys` or `/omr_master_save.php` | Save master answer key matrix & explanations in MySQL |
| `POST` | `/api/omr/submit` or `/omr_submit.php` | **Candidate submits OMR sheet**: Evaluates marks, accuracy, statewide simulated rank, and returns verified scorecard |
| `GET` | `/api/omr/submissions` or `/omr_submissions_all.php` | Retrieve evaluated submissions (filter by `roll_no`) |
| `GET` | `/api/omr/submissions/<code_id>` | Detailed inspection with question-by-question candidate vs key comparison |

### 👨‍🏫 5. Faculty & Achievers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/faculty` or `/staff_view_all.php` | List all faculty mentors |
| `POST` | `/api/faculty` or `/faculty_save.php` | Add new faculty member |
| `GET` | `/api/achievers` or `/achivers_all.php` | List alumni officer selections (130+ achievements) |
| `POST` | `/api/achievers` or `/achivers_save.php` | Add new achiever testimonial |

### 👥 6. Students Roster & Export
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` or `/student_all.php` | Retrieve enrolled student list with demographics |
| `GET` | `/api/students/export-pdf` or `/exportToPDF.php` | Export enrolled candidates list as CSV / printable format |
| `DELETE` | `/api/students/<id>` or `/student_delete.php?id=<id>` | Remove student record |

---

## 🧪 Testing the Backend API
You can test using `curl`:
```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Get all test batches
curl http://localhost:5000/api/tests

# 3. Submit and evaluate an OMR sheet
curl -X POST http://localhost:5000/api/omr/submit \
  -H "Content-Type: application/json" \
  -d '{
    "testId": 1,
    "rollNo": "BTK2026-0428",
    "studentName": "S. Kabilan",
    "bookletSeries": "A",
    "candidateAnswers": {"1": "C", "2": "B", "3": "C", "4": "B", "5": "A"},
    "timeSpentSeconds": 3600
  }'
```
