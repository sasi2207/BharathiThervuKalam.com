-- =============================================================================
-- Bharathi Thervukalam - Comprehensive MySQL Database Schema
-- TNPSC & TNUSRB Educational Platform, Test Series, and OMR Evaluation System
-- =============================================================================

CREATE DATABASE IF NOT EXISTS bharathi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bharathi_db;

-- -----------------------------------------------------------------------------
-- 1. Admins Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. Staff & Faculty Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT NULL,
    role VARCHAR(50) DEFAULT 'INSTRUCTOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) DEFAULT NULL,
    designation VARCHAR(150) NOT NULL,
    paper VARCHAR(150) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    experience VARCHAR(150) DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 3. Students Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    father_name VARCHAR(150) DEFAULT NULL,
    dob DATE DEFAULT NULL,
    qualification VARCHAR(150) DEFAULT NULL,
    phone_number VARCHAR(30) NOT NULL,
    whatsapp_number VARCHAR(30) DEFAULT NULL,
    father_phone_number VARCHAR(30) DEFAULT NULL,
    email VARCHAR(150) NOT NULL,
    aadhaar_number VARCHAR(30) DEFAULT NULL,
    caste VARCHAR(50) DEFAULT NULL,
    blood_group VARCHAR(10) DEFAULT NULL,
    typing_skills VARCHAR(100) DEFAULT NULL,
    serno_language VARCHAR(50) DEFAULT NULL,
    serno_level VARCHAR(50) DEFAULT NULL,
    ex_serviceman VARCHAR(10) DEFAULT 'no',
    destitute VARCHAR(10) DEFAULT 'no',
    address TEXT DEFAULT NULL,
    pstm_tenth TINYINT(1) DEFAULT 0,
    pstm_twelfth TINYINT(1) DEFAULT 0,
    pstm_ug TINYINT(1) DEFAULT 0,
    pstm_pg TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reg_no (register_no),
    INDEX idx_phone (phone_number),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 4. Achievers Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    posting VARCHAR(150) NOT NULL,
    exam VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    year VARCHAR(20) NOT NULL,
    department VARCHAR(150) NOT NULL,
    hometown VARCHAR(100) DEFAULT NULL,
    rank_text VARCHAR(100) DEFAULT NULL,
    story TEXT DEFAULT NULL,
    advice TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 5. Courses & Syllabus Table (TNPSC & TNUSRB)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses_syllabus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_key VARCHAR(50) NOT NULL, -- 'group1', 'group2', 'group2A', 'group4', 'siTechnical', 'siFingerprint', 'jointRecruitment', 'commonRecruitment'
    category VARCHAR(20) NOT NULL,    -- 'TNPSC' or 'TNUSRB'
    exam_type VARCHAR(100) NOT NULL,
    department VARCHAR(150) DEFAULT NULL,
    syllabus_title VARCHAR(255) NOT NULL,
    syllabus_content TEXT DEFAULT NULL,
    pdf_filename VARCHAR(255) DEFAULT NULL,
    pdf_path VARCHAR(255) DEFAULT NULL,
    file_size_bytes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course_key (course_key),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 6. Tests & Examination Batches Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'TNPSC' or 'TNUSRB'
    department VARCHAR(150) NOT NULL,
    paper VARCHAR(255) DEFAULT NULL,
    standard VARCHAR(50) DEFAULT 'Question', -- 'Question', 'Answer', 'Schedule', 'OMR Sheet'
    total_questions INT DEFAULT 25,
    total_questions_text VARCHAR(100) DEFAULT '200 Questions (300 Marks)',
    duration_minutes INT DEFAULT 180,
    duration_text VARCHAR(100) DEFAULT '3 Hours',
    exam_date DATE DEFAULT NULL,
    positive_mark DECIMAL(4,2) DEFAULT 1.50,
    negative_mark DECIMAL(4,2) DEFAULT 0.00,
    max_marks DECIMAL(6,2) DEFAULT 300.00,
    instructions TEXT DEFAULT NULL,
    pdf_filename VARCHAR(255) DEFAULT NULL,
    pdf_path VARCHAR(255) DEFAULT NULL,
    has_omr_key TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_dept (category, department),
    INDEX idx_test_code (test_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 7. OMR Questions & Master Answer Keys
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS omr_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    q_no INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    option_e TEXT DEFAULT 'Answer Not Known (விடை தெரியவில்லை)',
    correct_key ENUM('A', 'B', 'C', 'D', 'E') NOT NULL DEFAULT 'A',
    explanation TEXT DEFAULT NULL,
    topic VARCHAR(150) DEFAULT 'General Studies',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    UNIQUE KEY uq_test_qno (test_id, q_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 8. Student OMR Submissions & Evaluation Records
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS omr_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_code VARCHAR(60) NOT NULL UNIQUE,
    test_id INT NOT NULL,
    student_id INT DEFAULT NULL,
    student_roll_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    booklet_series VARCHAR(5) DEFAULT 'A',
    total_questions INT NOT NULL,
    total_attempted INT NOT NULL,
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    unshaded_count INT NOT NULL,
    not_known_count INT DEFAULT 0,
    raw_score DECIMAL(6,2) NOT NULL,
    max_possible_marks DECIMAL(6,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    simulated_rank INT DEFAULT 1,
    cutoff_zone VARCHAR(150) DEFAULT 'Evaluated',
    time_spent_seconds INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_student_roll (student_roll_no),
    INDEX idx_test_id (test_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 9. Question-by-Question Candidate Responses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS omr_submission_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    q_no INT NOT NULL,
    student_choice ENUM('A', 'B', 'C', 'D', 'E', '') DEFAULT NULL,
    correct_key ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    explanation TEXT DEFAULT NULL,
    FOREIGN KEY (submission_id) REFERENCES omr_submissions(id) ON DELETE CASCADE,
    INDEX idx_sub_q (submission_id, q_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 10. Initial Seed Data
-- -----------------------------------------------------------------------------

-- Admin User: admin / admin123 (bcrypt hash for admin123)
INSERT INTO admins (username, password_hash, email, role) 
VALUES ('admin', 'pbkdf2:sha256:260000$y1QZf0j9hK$e1cf0bcf732049d564fa7406be336a94a2b97fe34c9f13ddf6cb3c82915aa495', 'admin@bharathithervukalam.com', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE username=username;

-- Default Faculty
INSERT INTO faculty (name, username, designation, paper, subject, experience, phone) VALUES
('Chakarvarthy', 'Chakarvarthy', 'Founder & Chief Mentor', 'Paper II & III', 'Tamil Nadu Administration, Indian Polity & Current Affairs', '7+ Years Guidance · State Service Officer', '+91 7338757194'),
('Kannan', 'Kannan', 'Senior Faculty & Coordinator', 'Paper I & GS', 'General Studies, History & Indian National Movement', 'State Service Specialist', '+91 8012194136'),
('Sakthi', 'Sakthi', 'Academic Advisor & Test Evaluator', 'Aptitude & Science', 'Aptitude, Mental Ability & Science', 'Competitive Exam Strategist', '+91 9791388577'),
('Prabhu', 'Prabhu', 'Police Services Mentor', 'Technical & Forensic', 'TNUSRB SI Technical & Forensic Science Guidance', 'Uniformed Services Expert', '+91 7904790618')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Default Achievers
INSERT INTO achievers (name, posting, exam, category, year, department, hometown, rank_text, story, advice) VALUES
('R. Vignesh, M.E.', 'Deputy Superintendent of Police (DSP)', 'TNPSC Group I', 'group1', '2023', 'Tamil Nadu Police Service (TNPS)', 'Erode', 'State Rank 4', 'Cracked in first attempt with guidance from Bharathi Academy mentors. Attended Saturday mock test series without missing a single week.', 'Master the school textbooks and practice answer writing under timed conditions.'),
('S. Divya, B.Sc.', 'Sub-Registrar (Grade II)', 'TNPSC Group II', 'group2', '2022', 'Registration Department', 'Coimbatore', 'Top 15 Overall', 'Overcame rural background through 100% free mentorship and intensive interview coaching.', 'General Tamil syllabus is the biggest game-changer.'),
('P. Arulselvan, B.Com.', 'Sub-Inspector of Police (Taluk)', 'TNUSRB Joint Recruitment', 'police', '2023', 'Law & Order Wing, Coimbatore City', 'Salem', 'State Physical & Written Top Rank', 'Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.', 'Maintain equal dedication between physical fitness test and GS aptitude papers.'),
('M. Kavitha, B.A.', 'Village Administrative Officer (VAO)', 'TNPSC Group IV & VAO', 'group4', '2024', 'Revenue Administration, Erode Taluk', 'Erode', 'District 1st in PSTM Quota', 'Scored 98/100 in General Tamil using Bharathi classroom materials.', 'Samacheer Kalvi books from 6th to 12th standard are your holy scripture.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Default Tests
INSERT INTO tests (test_code, title, category, department, paper, standard, total_questions, duration_minutes, positive_mark, negative_mark, max_marks, pdf_filename) VALUES
('tnpsc-grp4-mock-01', 'TNPSC Group IV & VAO Full Mock Exam - 01', 'TNPSC', 'Group IV & VAO Services', 'General Studies & General Tamil', 'Question', 25, 180, 1.50, 0.00, 37.50, 'SUNDAY GRP 4 SCHEDULE -2025.pdf'),
('tnusrb-si-mock-01', 'TNUSRB Sub-Inspector (Taluk & AR) Joint Recruitment Mock 01', 'TNUSRB', 'Police Sub-Inspector Cadre', 'General Knowledge & Police Psychological Test', 'Question', 20, 150, 0.50, 0.00, 10.00, 'SATURDAY TIME TABLE-1.pdf')
ON DUPLICATE KEY UPDATE title=VALUES(title);
