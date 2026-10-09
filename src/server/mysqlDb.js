/**
 * Bharathi Thervukalam - Dedicated MySQL Database Layer
 * Connects directly to the live MySQL database:
 * Host: 65.108.76.42:3306
 * Database: techsasi_bharathi
 * 
 * Provides:
 * 1. Single-device active session enforcement (active_session_id & session_version)
 * 2. Complete dynamic database CRUD operations for all entities:
 *    - Users & Authentication
 *    - Courses
 *    - Faculty
 *    - Achievers
 *    - Staff
 *    - Students
 *    - Tests & Digital OMR Submissions
 * Zero static mock data or hardcoded arrays.
 */

const mysql = require('mysql2/promise');

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '65.108.76.42',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'techsasi_2207',
  password: process.env.MYSQL_PASSWORD || 'SasiKutty2207@Lovely',
  database: process.env.MYSQL_DATABASE || 'techsasi_bharathi',
  waitForConnections: true,
  connectionLimit: 12,
  queueLimit: 0,
  connectTimeout: 8000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

let pool = null;

function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(MYSQL_CONFIG);
      console.log(`[MySQL Engine] Connection pool initialized for ${MYSQL_CONFIG.database} at ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}`);
    } catch (err) {
      console.error('[MySQL Engine Error] Failed creating pool:', err.message);
    }
  }
  return pool;
}

// Helper for resilient query execution
async function query(sql, params = []) {
  const p = getPool();
  try {
    const [results] = await p.query(sql, params);
    return results;
  } catch (error) {
    console.error(`[MySQL Query Error] SQL: ${sql.substring(0, 80)}... Error: ${error.message}`);
    throw error;
  }
}

// =============================================================================
// 1. USERS & SESSION INTEGRITY (SINGLE DEVICE CONCURRENT CONTROL)
// =============================================================================

async function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const sql = `
    SELECT id, email, full_name, register_no, username, password_hash, role, 
           active_session_id, session_version, last_login_at, last_device_info, 
           last_ip_address, status, phone, created_at, updated_at
    FROM users
    WHERE (LOWER(username) = ? OR LOWER(email) = ? OR register_no = ?)
      AND (deleted_at IS NULL)
    LIMIT 1
  `;
  const rows = await query(sql, [clean, clean, identifier.trim()]);
  return rows.length > 0 ? rows[0] : null;
}

async function findUserById(id) {
  if (!id) return null;
  const sql = `
    SELECT id, email, full_name, register_no, username, password_hash, role, 
           active_session_id, session_version, last_login_at, last_device_info, 
           last_ip_address, status, phone, created_at, updated_at
    FROM users
    WHERE id = ? AND (deleted_at IS NULL)
    LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

async function registerNewActiveSession(userId, sessionId, deviceInfo = '', ipAddress = '') {
  const sql = `
    UPDATE users
    SET active_session_id = ?,
        session_version = COALESCE(session_version, 0) + 1,
        last_login_at = NOW(),
        last_device_info = ?,
        last_ip_address = ?
    WHERE id = ?
  `;
  await query(sql, [sessionId, deviceInfo || 'Web Browser', ipAddress || '127.0.0.1', userId]);
  return await findUserById(userId);
}

async function verifyActiveSession(userId, sessionId) {
  if (!userId || !sessionId) {
    return { valid: false, reason: 'MISSING_SESSION_CREDENTIALS' };
  }
  const user = await findUserById(userId);
  if (!user) {
    return { valid: false, reason: 'USER_NOT_FOUND' };
  }
  if (!user.active_session_id) {
    // If no active session recorded yet, attach current session
    await registerNewActiveSession(userId, sessionId);
    return { valid: true, user };
  }
  if (user.active_session_id !== sessionId) {
    return { 
      valid: false, 
      reason: 'CONCURRENT_SESSION_TERMINATED', 
      user,
      currentDbSession: user.active_session_id 
    };
  }
  return { valid: true, user };
}

async function terminateOtherSessions(userId, currentSessionId) {
  const sql = `
    UPDATE users
    SET active_session_id = ?,
        session_version = COALESCE(session_version, 0) + 1,
        last_login_at = NOW()
    WHERE id = ?
  `;
  await query(sql, [currentSessionId, userId]);
  return await findUserById(userId);
}

async function getAllUsers() {
  const sql = `
    SELECT id, email, full_name, register_no, username, role, 
           active_session_id, session_version, last_login_at, 
           last_device_info, status, phone, created_at, updated_at
    FROM users
    WHERE deleted_at IS NULL
    ORDER BY id ASC
  `;
  return await query(sql);
}

async function createUser(user) {
  const sql = `
    INSERT INTO users (username, email, password_hash, role, full_name, register_no, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    user.username,
    user.email,
    user.password_hash || user.password,
    user.role || 'student',
    user.full_name || user.fullName || user.username,
    user.register_no || null,
    user.phone || null,
    user.status || 'ACTIVE'
  ]);
  return await findUserById(result.insertId);
}

async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  for (const [key, val] of Object.entries(updates)) {
    if (['password_hash', 'role', 'full_name', 'phone', 'status', 'email', 'username'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return await findUserById(id);
  values.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return await findUserById(id);
}

async function deleteUser(id) {
  await query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 2. COURSES
// =============================================================================

async function getAllCourses(category = null) {
  let sql = 'SELECT * FROM courses WHERE deleted_at IS NULL';
  const params = [];
  if (category) {
    sql += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }
  sql += ' ORDER BY id ASC';
  return await query(sql, params);
}

async function getCourseById(id) {
  const rows = await query('SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function createCourse(data) {
  const sql = `
    INSERT INTO courses (title, category, syllabus, description, standard, duration, fees, filename, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    data.title || 'New Course',
    data.category || 'TNPSC',
    data.syllabus || '',
    data.description || '',
    data.standard || 'Degree Standard',
    data.duration || '6 Months',
    parseFloat(data.fees || 0),
    data.filename || '',
    data.status || 'ACTIVE'
  ]);
  return await getCourseById(result.insertId);
}

async function updateCourse(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['title', 'category', 'syllabus', 'description', 'standard', 'duration', 'fees', 'filename', 'status']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return await getCourseById(id);
  values.push(id);
  await query(`UPDATE courses SET ${fields.join(', ')} WHERE id = ?`, values);
  return await getCourseById(id);
}

async function deleteCourse(id) {
  await query('UPDATE courses SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 3. FACULTY
// =============================================================================

async function getAllFaculty() {
  return await query('SELECT * FROM faculty WHERE deleted_at IS NULL ORDER BY id ASC');
}

async function getFacultyById(id) {
  const rows = await query('SELECT * FROM faculty WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function createFaculty(data) {
  const sql = `
    INSERT INTO faculty (name, designation, subject, paper, experience, phone, email, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    data.name,
    data.designation || 'Faculty Member',
    data.subject || 'General Studies',
    data.paper || 'Paper I',
    data.experience || '5+ Years Guidance',
    data.phone || '',
    data.email || '',
    data.category || 'TNPSC',
    data.status || 'ACTIVE'
  ]);
  return await getFacultyById(result.insertId);
}

async function updateFaculty(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'designation', 'subject', 'paper', 'experience', 'phone', 'email', 'category', 'status']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return await getFacultyById(id);
  values.push(id);
  await query(`UPDATE faculty SET ${fields.join(', ')} WHERE id = ?`, values);
  return await getFacultyById(id);
}

async function deleteFaculty(id) {
  await query('UPDATE faculty SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 4. ACHIEVERS
// =============================================================================

async function getAllAchievers() {
  return await query('SELECT * FROM achievers WHERE deleted_at IS NULL ORDER BY id ASC');
}

async function getAchieverById(id) {
  const rows = await query('SELECT * FROM achievers WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function createAchiever(data) {
  const sql = `
    INSERT INTO achievers (name, posting, department, exam, rank, year, hometown, story, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    data.name,
    data.posting,
    data.department || '',
    data.exam || 'TNPSC',
    data.rank || '',
    data.year || new Date().getFullYear().toString(),
    data.hometown || '',
    data.story || '',
    data.category || 'general',
    data.status || 'ACTIVE'
  ]);
  return await getAchieverById(result.insertId);
}

async function updateAchiever(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'posting', 'department', 'exam', 'rank', 'year', 'hometown', 'story', 'category', 'status']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return await getAchieverById(id);
  values.push(id);
  await query(`UPDATE achievers SET ${fields.join(', ')} WHERE id = ?`, values);
  return await getAchieverById(id);
}

async function deleteAchiever(id) {
  await query('UPDATE achievers SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 5. STAFF
// =============================================================================

async function getAllStaff() {
  return await query('SELECT * FROM staff WHERE deleted_at IS NULL ORDER BY id ASC');
}

async function getStaffById(id) {
  const rows = await query('SELECT * FROM staff WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function createStaff(data) {
  const sql = `
    INSERT INTO staff (staff_id, name, email, phone, designation, department, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    data.staff_id || `STF-${Date.now().toString().slice(-4)}`,
    data.name,
    data.email,
    data.phone || '',
    data.designation || 'Staff Coordinator',
    data.department || 'Academic Division',
    data.status || 'ACTIVE'
  ]);
  return await getStaffById(result.insertId);
}

async function updateStaff(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['staff_id', 'name', 'email', 'phone', 'designation', 'department', 'status']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return await getStaffById(id);
  values.push(id);
  await query(`UPDATE staff SET ${fields.join(', ')} WHERE id = ?`, values);
  return await getStaffById(id);
}

async function deleteStaff(id) {
  await query('UPDATE staff SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 6. STUDENTS
// =============================================================================

async function getAllStudents() {
  return await query('SELECT * FROM students WHERE deleted_at IS NULL ORDER BY id ASC');
}

async function getStudentById(id) {
  const rows = await query('SELECT * FROM students WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function createStudent(data) {
  const sql = `
    INSERT INTO students (register_no, name, email, phone, father_name, dob, qualification, community, blood_group, address, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    data.register_no || `BTK${Date.now().toString().slice(-6)}`,
    data.name,
    data.email,
    data.phone,
    data.father_name || '',
    data.dob || null,
    data.qualification || '',
    data.community || '',
    data.blood_group || '',
    data.address || '',
    data.status || 'ACTIVE'
  ]);
  return await getStudentById(result.insertId);
}

async function updateStudent(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['register_no', 'name', 'email', 'phone', 'father_name', 'dob', 'qualification', 'community', 'blood_group', 'address', 'status']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return await getStudentById(id);
  values.push(id);
  await query(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, values);
  return await getStudentById(id);
}

async function deleteStudent(id) {
  await query('UPDATE students SET deleted_at = NOW() WHERE id = ?', [id]);
  return { success: true, id };
}

// =============================================================================
// 7. TESTS & OMR
// =============================================================================

async function getAllTests() {
  return await query('SELECT * FROM tests WHERE deleted_at IS NULL ORDER BY id ASC');
}

async function getTestById(id) {
  const rows = await query('SELECT * FROM tests WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function getOmrKeys(testId = 1) {
  return await query('SELECT * FROM omr_keys WHERE test_id = ? ORDER BY question_no ASC', [testId]);
}

async function saveOmrSubmission(data) {
  const sql = `
    INSERT INTO omr_submissions (
      submission_code, test_id, student_roll_no, student_name,
      total_questions, attempted_count, correct_count, incorrect_count,
      unshaded_count, raw_score, max_marks, percentage, accuracy,
      simulated_rank, cutoff_zone, candidate_answers_json, breakdown_json,
      time_spent_seconds, submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  const result = await query(sql, [
    data.submission_code || `SUB-${Date.now()}`,
    data.test_id || 1,
    data.student_roll_no || 'BTK2026-0428',
    data.student_name || 'Cadet',
    data.total_questions || 25,
    data.attempted_count || 0,
    data.correct_count || 0,
    data.incorrect_count || 0,
    data.unshaded_count || 0,
    data.raw_score || 0,
    data.max_marks || 25,
    data.percentage || 0,
    data.accuracy || 0,
    data.simulated_rank || 1,
    data.cutoff_zone || 'SAFE',
    typeof data.candidate_answers_json === 'string' ? data.candidate_answers_json : JSON.stringify(data.candidate_answers_json || {}),
    typeof data.breakdown_json === 'string' ? data.breakdown_json : JSON.stringify(data.breakdown_json || {}),
    data.time_spent_seconds || 0
  ]);
  return { id: result.insertId, ...data };
}

async function getOmrSubmissions(studentRollNo = null, testId = null) {
  let sql = 'SELECT * FROM omr_submissions WHERE 1=1';
  const params = [];
  if (studentRollNo) {
    sql += ' AND student_roll_no = ?';
    params.push(studentRollNo);
  }
  if (testId) {
    sql += ' AND test_id = ?';
    params.push(testId);
  }
  sql += ' ORDER BY id DESC LIMIT 50';
  return await query(sql, params);
}

module.exports = {
  getPool,
  query,
  // User & Session (Single device concurrent control)
  findUserByIdentifier,
  findUserById,
  registerNewActiveSession,
  verifyActiveSession,
  terminateOtherSessions,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  // Courses
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  // Faculty
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  // Achievers
  getAllAchievers,
  getAchieverById,
  createAchiever,
  updateAchiever,
  deleteAchiever,
  // Staff
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  // Students
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  // Tests & OMR
  getAllTests,
  getTestById,
  getOmrKeys,
  saveOmrSubmission,
  getOmrSubmissions
};
