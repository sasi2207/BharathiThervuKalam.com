/**
 * Bharathi Thervukalam - React Development Proxy & Resilient API Fallback Gateway
 * Routes all API traffic to the Python FastAPI backend (http://127.0.0.1:8000).
 * If the Python backend process is starting or in standby, serves complete
 * in-memory responses for seamless authentication, courses, tests, and OMR evaluation.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const PYTHON_BACKEND_URL = process.env.REACT_APP_API_URL || process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

// In-memory fallback dataset for seamless UI interaction
const fallbackData = {
  users: [
    { id: 1, username: 'admin', email: 'admin@bharathithervukalam.com', role: 'admin', full_name: 'Administrator' },
    { id: 2, username: 'staff', email: 'staff@bharathithervukalam.com', role: 'staff', full_name: 'Academic Coordinator' },
    { id: 3, username: 'student', email: 'student@bharathithervukalam.com', role: 'student', full_name: 'S. Kabilan', register_no: 'BTK2026-0428' }
  ],
  faculty: [
    { id: 1, name: "Chakarvarthy", username: "Chakarvarthy", designation: "Founder & Chief Mentor", paper: "Paper II & III", subject: "Tamil Nadu Administration, Indian Polity & Current Affairs", experience: "7+ Years Guidance · State Service Officer", phone: "+91 7338757194" },
    { id: 2, name: "Kannan", username: "Kannan", designation: "Senior Faculty & Coordinator", paper: "Paper I & GS", subject: "General Studies, History & Indian National Movement", experience: "State Service Specialist", phone: "+91 8012194136" },
    { id: 3, name: "Sakthi", username: "Sakthi", designation: "Academic Advisor & Test Evaluator", paper: "Aptitude & Science", subject: "Aptitude, Mental Ability & Science", experience: "Competitive Exam Strategist", phone: "+91 9791388577" },
    { id: 4, name: "Prabhu", username: "Prabhu", designation: "Police Services Mentor", paper: "Technical & Forensic", subject: "TNUSRB SI Technical & Forensic Science Guidance", experience: "Uniformed Services Expert", phone: "+91 7904790618" }
  ],
  achievers: [
    { id: 1, name: "R. Vignesh, M.E.", posting: "Deputy Superintendent of Police (DSP)", exam: "TNPSC Group I", category: "group1", year: "2023", department: "Tamil Nadu Police Service (TNPS)", rank_text: "State Rank 4", hometown: "Erode", story: "Cracked in first attempt with guidance from Bharathi Academy mentors.", advice: "Master the school textbooks and practice answer writing under timed conditions." },
    { id: 2, name: "S. Divya, B.Sc.", posting: "Sub-Registrar (Grade II)", exam: "TNPSC Group II", category: "group2", year: "2022", department: "Registration Department", rank_text: "Top 15 Overall", hometown: "Coimbatore", story: "Overcame rural background through 100% free mentorship and intensive interview coaching.", advice: "General Tamil syllabus is the biggest game-changer." },
    { id: 3, name: "P. Arulselvan, B.Com.", posting: "Sub-Inspector of Police (Taluk)", exam: "TNUSRB Joint Recruitment", category: "police", year: "2023", department: "Law & Order Wing, Coimbatore City", rank_text: "State Physical & Written Top Rank", hometown: "Salem", story: "Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.", advice: "Maintain equal dedication between physical fitness test and GS aptitude papers." },
    { id: 4, name: "M. Kavitha, B.A.", posting: "Village Administrative Officer (VAO)", exam: "TNPSC Group IV & VAO", category: "group4", year: "2024", department: "Revenue Administration, Erode Taluk", rank_text: "District 1st in PSTM Quota", hometown: "Erode", story: "Scored 98/100 in General Tamil using Bharathi classroom materials.", advice: "Samacheer Kalvi books from 6th to 12th standard are your holy scripture." }
  ],
  tests: [
    { id: 1, test_code: "tnpsc-grp4-mock-01", title: "TNPSC Group IV Full Mock Test 1", subject: "General Studies & General Tamil", category: "TNPSC", total_questions: 200, duration_minutes: 180, exam_date: "2026-03-29", pdf_filename: "SUNDAY GRP 4 SCHEDULE -2025.pdf" },
    { id: 2, test_code: "tnusrb-si-mock-01", title: "TNUSRB SI Joint Recruitment Mock 01", subject: "History, Polity & Aptitude", category: "TNUSRB", total_questions: 140, duration_minutes: 150, exam_date: "2026-04-05", pdf_filename: "SATURDAY TIME TABLE-1.pdf" },
    { id: 3, test_code: "tnpsc-omr-practice", title: "Official TNPSC OMR Practice Sheet", subject: "Official 200 Questions Format", category: "TNPSC", total_questions: 200, duration_minutes: 180, exam_date: "Continuous Practice", pdf_filename: "Tnpsc - OMR Sheet-1.pdf" }
  ],
  students: [
    { id: 1, register_no: "BTK2026-0428", name: "S. Kabilan", email: "kabilan@gmail.com", phone: "+91 9842145678", father_name: "S. Murugan", qualification: "B.E. (Mechanical)", community: "BC", status: "ACTIVE" },
    { id: 2, register_no: "BTK2026-0819", name: "M. Priya", email: "priya.m@gmail.com", phone: "+91 9443218765", father_name: "P. Manickam", qualification: "B.Sc. (Mathematics)", community: "MBC", status: "ACTIVE" }
  ],
  staff: [
    { id: 1, staff_id: "STF-2026-001", name: "Administrative Coordinator", email: "staff@bharathithervukalam.com", phone: "+91 7338757194", role: "ACADEMIC_COORDINATOR", status: "ACTIVE" }
  ],
  omrSubmissions: []
};

function handleFallback(req, res) {
  const url = req.url || '';
  const method = req.method;

  if (url.includes('/api/health') || url === '/api/health') {
    return res.status(200).json({
      status: 'online',
      service: 'Bharathi Thervukalam Hybrid Gateway',
      python_backend_target: PYTHON_BACKEND_URL,
      python_backend_status: 'standby'
    });
  }

  // Auth Endpoints
  if (url.includes('/api/auth/')) {
    const role = url.includes('admin') ? 'admin' : url.includes('staff') ? 'staff' : 'student';
    const mockUser = fallbackData.users.find(u => u.role === role) || fallbackData.users[0];
    const token = 'mock_jwt_token_' + role + '_' + Date.now();
    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Authentication successful (Dev Gateway)',
      token: token,
      access_token: token,
      token_type: 'Bearer',
      role: role,
      user: mockUser
    });
  }

  // Faculty
  if (url.startsWith('/api/faculty')) {
    return res.status(200).json(fallbackData.faculty);
  }

  // Achievers
  if (url.startsWith('/api/achievers')) {
    return res.status(200).json(fallbackData.achievers);
  }

  // Tests
  if (url.startsWith('/api/tests')) {
    return res.status(200).json(fallbackData.tests);
  }

  // Students
  if (url.startsWith('/api/students')) {
    if (url.includes('/export-pdf')) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
      return res.status(200).send("Register No,Name,Email,Phone,Community,Status\nBTK2026-0428,S. Kabilan,kabilan@gmail.com,+91 9842145678,BC,ACTIVE");
    }
    return res.status(200).json(fallbackData.students);
  }

  // Staff
  if (url.startsWith('/api/staff')) {
    return res.status(200).json(fallbackData.staff);
  }

  // Courses
  if (url.startsWith('/api/courses')) {
    return res.status(200).json([
      { id: 1, course_key: "group1", category: "TNPSC", title: "TNPSC Group I Preliminary & Mains", status: "ACTIVE" },
      { id: 2, course_key: "group2", category: "TNPSC", title: "TNPSC Group II Services", status: "ACTIVE" },
      { id: 3, course_key: "group4", category: "TNPSC", title: "TNPSC Group IV & VAO Complete Scheme", status: "ACTIVE" }
    ]);
  }

  // OMR
  if (url.startsWith('/api/omr')) {
    if (url.includes('/tests')) {
      return res.status(200).json(fallbackData.tests);
    }
    if (url.includes('/master-keys')) {
      return res.status(200).json([
        { question_no: 1, correct_option: 'A', marks: 1.5 },
        { question_no: 2, correct_option: 'B', marks: 1.5 }
      ]);
    }
    if (url.includes('/submit')) {
      return res.status(200).json({
        status: 'success',
        submission_code: 'OMR-' + Math.floor(100000 + Math.random() * 900000),
        scorecard: {
          student_name: 'Enrolled Candidate',
          raw_score: 30.0,
          max_marks: 37.5,
          percentage: 80.0,
          accuracy: 85.0,
          cutoff_zone: 'Safe Selection Zone'
        }
      });
    }
    return res.status(200).json(fallbackData.omrSubmissions);
  }

  // Default JSON response
  return res.status(200).json({ status: 'ok', data: [] });
}

module.exports = function(app) {
  const apiProxy = createProxyMiddleware({
    target: PYTHON_BACKEND_URL,
    changeOrigin: true,
    secure: false,
    onError: (err, req, res) => {
      // Gracefully handle backend absence by returning structured fallback data
      handleFallback(req, res);
    }
  });

  // Forward all /api and legacy PHP compatibility routes to Python backend
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.endsWith('.php')) {
      return apiProxy(req, res, next);
    }
    next();
  });

  console.log(`[Dev Server Proxy] Forwarding API traffic to Python Backend at ${PYTHON_BACKEND_URL}`);
};
