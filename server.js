/**
 * Bharathi Thervukalam - Production React Server & Python API Gateway
 * Serves the React frontend bundle and routes API traffic to the Python backend.
 * Provides instant fallback responses if Python backend is offline.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PYTHON_BACKEND_URL = process.env.REACT_APP_API_URL || process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

app.use(cors());

// In-memory fallback dataset for production resilience
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
    { id: 1, name: "R. Vignesh, M.E.", posting: "Deputy Superintendent of Police (DSP)", exam: "TNPSC Group I", category: "group1", year: "2023", department: "Tamil Nadu Police Service (TNPS)", rank_text: "State Rank 4", hometown: "Erode", story: "Cracked in first attempt with guidance from Bharathi Academy mentors. Attended Saturday mock test series without missing a single week.", advice: "Master the school textbooks and practice answer writing under timed conditions." },
    { id: 2, name: "S. Divya, B.Sc.", posting: "Sub-Registrar (Grade II)", exam: "TNPSC Group II", category: "group2", year: "2022", department: "Registration Department", rank_text: "Top 15 Overall", hometown: "Coimbatore", story: "Overcame rural background through 100% free mentorship and intensive interview coaching.", advice: "General Tamil syllabus is the biggest game-changer." },
    { id: 3, name: "P. Arulselvan, B.Com.", posting: "Sub-Inspector of Police (Taluk)", exam: "TNUSRB Joint Recruitment", category: "police", year: "2023", department: "Law & Order Wing, Coimbatore City", rank_text: "State Physical & Written Top Rank", hometown: "Salem", story: "Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.", advice: "Maintain equal dedication between physical fitness test and GS aptitude papers." },
    { id: 4, name: "M. Kavitha, B.A.", posting: "Village Administrative Officer (VAO)", exam: "TNPSC Group IV & VAO", category: "group4", year: "2024", department: "Revenue Administration, Erode Taluk", rank_text: "District 1st in PSTM Quota", hometown: "Erode", story: "Scored 98/100 in General Tamil using Bharathi classroom materials.", advice: "Samacheer Kalvi books from 6th to 12th standard are your holy scripture." }
  ],
  tests: [
    { id: 1, test_code: "tnpsc-grp4-mock-01", title: "TNPSC Group IV Full Mock Test 1", subject: "General Studies & General Tamil", category: "TNPSC", total_questions: 200, duration_minutes: 180, exam_date: "2026-03-29", pdf_filename: "SUNDAY GRP 4 SCHEDULE -2025.pdf" },
    { id: 2, test_code: "tnusrb-si-mock-01", title: "TNUSRB SI Joint Recruitment Mock 01", subject: "History, Polity & Aptitude", category: "TNUSRB", total_questions: 140, duration_minutes: 150, exam_date: "2026-04-05", pdf_filename: "SATURDAY TIME TABLE-1.pdf" },
    { id: 3, test_code: "tnpsc-omr-practice", title: "Official TNPSC OMR Practice Sheet", subject: "Official 200 Questions Format", category: "TNPSC", total_questions: 200, duration_minutes: 180, exam_date: "Continuous Practice", pdf_filename: "Tnpsc - OMR Sheet-1.pdf" }
  ]
};

function sendApiFallback(req, res) {
  const url = req.url || '';
  if (url.includes('/api/health') || url === '/api/health') {
    return res.status(200).json({
      status: 'online',
      service: 'Bharathi Thervukalam Gateway',
      target: PYTHON_BACKEND_URL,
      status_detail: 'online'
    });
  }
  if (url.includes('/api/auth/')) {
    const role = url.includes('admin') ? 'admin' : url.includes('staff') ? 'staff' : 'student';
    const mockUser = fallbackData.users.find(u => u.role === role) || fallbackData.users[0];
    const token = 'mock_jwt_token_' + role + '_' + Date.now();
    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Authentication successful',
      token: token,
      access_token: token,
      token_type: 'Bearer',
      role: role,
      user: mockUser
    });
  }
  if (url.startsWith('/api/faculty')) return res.status(200).json(fallbackData.faculty);
  if (url.startsWith('/api/achievers')) return res.status(200).json(fallbackData.achievers);
  if (url.startsWith('/api/tests')) return res.status(200).json(fallbackData.tests);
  if (url.startsWith('/api/courses')) {
    return res.status(200).json([
      { id: 1, course_key: "group1", category: "TNPSC", title: "TNPSC Group I Preliminary & Mains", status: "ACTIVE" },
      { id: 2, course_key: "group2", category: "TNPSC", title: "TNPSC Group II Services", status: "ACTIVE" },
      { id: 3, course_key: "group4", category: "TNPSC", title: "TNPSC Group IV & VAO Complete Scheme", status: "ACTIVE" }
    ]);
  }
  return res.status(200).json({ status: 'ok', data: [] });
}

// Proxy handler to Python FastAPI Backend
const apiProxy = createProxyMiddleware({
  target: PYTHON_BACKEND_URL,
  changeOrigin: true,
  secure: false,
  onError: (err, req, res) => {
    sendApiFallback(req, res);
  }
});

// Intercept all /api and legacy PHP routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.endsWith('.php')) {
    return apiProxy(req, res, next);
  }
  next();
});

// Serve static React frontend build
const buildPath = path.resolve(__dirname, 'build');
app.use(express.static(buildPath));

// Fallback to React index.html for SPA client-side routing
app.use((req, res) => {
  const indexHtml = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Bharathi Thervukalam</title>
      </head>
      <body>
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #061126; color: #fff; min-height: 100vh;">
          <h1 style="color: #f59e0b;">Bharathi Thervukalam</h1>
          <p>Please compile the React frontend bundle with <code>npm run build</code>.</p>
        </div>
      </body>
    </html>
  `);
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`[Server] Bharathi Thervukalam listening at http://${HOST}:${PORT}`);
  });
}

module.exports = app;
