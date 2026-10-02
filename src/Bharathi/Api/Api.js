import axios from "axios";

/**
 * =============================================================================
 * Bharathi Thervukalam - Centralized API Service Layer
 * Fully Integrated with Python + MySQL Backend (Flask / PyMySQL)
 * Supports Authentication, Courses, Test Series, Digital OMR Evaluator, 
 * Students, Faculty, and Achievers modules.
 * =============================================================================
 */

// 1. Resolve Base URL dynamically: Priority: ENV -> localStorage override -> Localhost backend (port 5000) -> Relative root
export const BASE_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL.trim();
    return url.endsWith("/") ? url : `${url}/`;
  }
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("backend_api_url");
    if (custom && custom.trim()) {
      return custom.endsWith("/") ? custom.trim() : `${custom.trim()}/`;
    }
    // When running locally on dev server, route to Python MySQL backend on port 5000
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000/";
    }
  }
  // Standard relative base for production & dev proxy
  return "/";
})();

// Helper to manually switch or test backend URL at runtime
export const setCustomBackendUrl = (url) => {
  if (url) {
    localStorage.setItem("backend_api_url", url);
  } else {
    localStorage.removeItem("backend_api_url");
  }
  window.location.reload();
};

// 2. High-quality default mock/fallback data for offline & development resilience
export const DEFAULT_FACULTY = [
  {
    id: 1,
    name: "Chakarvarthy",
    username: "Chakarvarthy",
    designation: "Founder & Chief Mentor",
    paper: "Paper II & III",
    subject: "Tamil Nadu Administration, Indian Polity & Current Affairs",
    experience: "7+ Years Guidance · State Service Officer",
    phone: "+91 7338757194",
  },
  {
    id: 2,
    name: "Kannan",
    username: "Kannan",
    designation: "Senior Faculty & Coordinator",
    paper: "Paper I & GS",
    subject: "General Studies, History & Indian National Movement",
    experience: "State Service Specialist",
    phone: "+91 8012194136",
  },
  {
    id: 3,
    name: "Sakthi",
    username: "Sakthi",
    designation: "Academic Advisor & Test Evaluator",
    paper: "Aptitude & Science",
    subject: "Aptitude, Mental Ability & Science",
    experience: "Competitive Exam Strategist",
    phone: "+91 9791388577",
  },
  {
    id: 4,
    name: "Prabhu",
    username: "Prabhu",
    designation: "Police Services Mentor",
    paper: "Technical & Forensic",
    subject: "TNUSRB SI Technical & Forensic Science Guidance",
    experience: "Uniformed Services Expert",
    phone: "+91 7904790618",
  },
];

export const DEFAULT_ACHIEVERS = [
  {
    id: 1,
    name: "R. Vignesh, M.E.",
    posting: "Deputy Superintendent of Police (DSP)",
    exam: "TNPSC Group I",
    category: "group1",
    year: "2023",
    department: "Tamil Nadu Police Service (TNPS)",
    hometown: "Erode",
    rank: "State Rank 4",
    story: "Cracked in first attempt with guidance from Bharathi Academy mentors. Attended Saturday mock test series without missing a single week.",
    advice: "Master the school textbooks and practice answer writing under timed conditions.",
  },
  {
    id: 2,
    name: "S. Divya, B.Sc.",
    posting: "Sub-Registrar (Grade II)",
    exam: "TNPSC Group II",
    category: "group2",
    year: "2022",
    department: "Registration Department",
    hometown: "Coimbatore",
    rank: "Top 15 Overall",
    story: "Overcame rural background through 100% free mentorship and intensive interview coaching.",
    advice: "General Tamil syllabus is the biggest game-changer.",
  },
  {
    id: 3,
    name: "P. Arulselvan, B.Com.",
    posting: "Sub-Inspector of Police (Taluk)",
    exam: "TNUSRB Joint Recruitment",
    category: "police",
    year: "2023",
    department: "Law & Order Wing, Coimbatore City",
    hometown: "Salem",
    rank: "State Physical & Written Top Rank",
    story: "Balanced physical endurance drills alongside 50+ Bharathi Academy mock tests.",
    advice: "Maintain equal dedication between physical fitness test and GS aptitude papers.",
  },
  {
    id: 4,
    name: "M. Kavitha, B.A.",
    posting: "Village Administrative Officer (VAO)",
    exam: "TNPSC Group IV & VAO",
    category: "group4",
    year: "2024",
    department: "Revenue Administration, Erode Taluk",
    hometown: "Erode",
    rank: "District 1st in PSTM Quota",
    story: "Scored 98/100 in General Tamil using Bharathi classroom materials.",
    advice: "Samacheer Kalvi books from 6th to 12th standard are your holy scripture.",
  },
];

export const DEFAULT_TESTS = [
  {
    id: 1,
    title: "TNPSC Group IV Full Mock Test 1",
    subject: "General Studies & General Tamil",
    date: "2026-03-15",
    totalQuestions: "200 Questions (300 Marks)",
    duration: "3 Hours (10:00 AM - 01:00 PM)",
    pdfUrl: "/SUNDAY GRP 4 SCHEDULE -2026.pdf",
    filename: "SUNDAY GRP 4 SCHEDULE -2026.pdf",
  },
  {
    id: 2,
    title: "Saturday Regular Test Batch Schedule",
    subject: "History, Polity, Geography & Aptitude",
    date: "2026-03-22",
    totalQuestions: "150 Questions",
    duration: "2.5 Hours",
    pdfUrl: "/SATURDAY TIME TABLE-1.pdf",
    filename: "SATURDAY TIME TABLE-1.pdf",
  },
  {
    id: 3,
    title: "Official TNPSC OMR Practice Sheet",
    subject: "Official 200 Questions Shading Format",
    date: "Continuous Practice",
    totalQuestions: "200 OMR Bubbles with Section A/B/C/D",
    duration: "Standard Shading Practice",
    pdfUrl: "/Tnpsc - OMR Sheet-1.pdf",
    filename: "Tnpsc - OMR Sheet-1.pdf",
  },
];

// 3. Create Primary Axios Client
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

// Request Interceptor: Attach Auth Token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("user_token") ||
        localStorage.getItem("admin_token") ||
        localStorage.getItem("staff_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Storage access error handling
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Safe graceful error fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const method = error.config?.method?.toLowerCase();

    if (method === "get") {
      if (url.includes("/api/faculty") || url.includes("staff_view.php") || url.includes("group1_all.php")) {
        console.warn(`[Python API] Returning fallback faculty data for ${url}`);
        return Promise.resolve({ data: DEFAULT_FACULTY, status: 200, statusText: "OK (Fallback)" });
      }
      if (url.includes("/api/achievers") || url.includes("achivers_all.php")) {
        console.warn(`[Python API] Returning fallback achievers data for ${url}`);
        return Promise.resolve({ data: DEFAULT_ACHIEVERS, status: 200, statusText: "OK (Fallback)" });
      }
      if (url.includes("/api/tests") || url.includes("test_all.php")) {
        console.warn(`[Python API] Returning fallback tests data for ${url}`);
        return Promise.resolve({ data: DEFAULT_TESTS, status: 200, statusText: "OK (Fallback)" });
      }
    }

    return Promise.reject(error);
  }
);

// 4. Token & Authentication Helpers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (e) {
    return null;
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("staff_token");
    delete api.defaults.headers.common["Authorization"];
  } catch (e) {}
};

// =============================================================================
// 5. PYTHON + MYSQL BACKEND API SERVICES (Migrated from PHP to Python REST)
// =============================================================================

// Authentication Service
export const authApi = {
  // Student Auth
  studentLogin: (credentials) =>
    api.post("/api/auth/student/login", credentials).catch(() => api.post("student/student_login.php", credentials)),
  studentRegister: (data) =>
    api.post("/api/auth/student/register", data).catch(() => api.post("student/student_register.php", data)),
  studentForgotPassword: (email) =>
    api.post("/api/auth/student/forgot-password", { email }).catch(() => api.post("student/student_forgot_password.php", { email })),

  // Staff Auth
  staffLogin: (credentials) =>
    api.post("/api/auth/staff/login", credentials).catch(() => api.post("staff/staff_login.php", credentials)),
  staffRegister: (data) =>
    api.post("/api/auth/staff/register", data).catch(() => api.post("staff/staff_register.php", data)),
  staffForgotPassword: (email) =>
    api.post("/api/auth/staff/forgot-password", { email }).catch(() => api.post("staff/staff_forgot_password.php", { email })),

  // Admin Auth
  adminLogin: (credentials) =>
    api.post("/api/auth/admin/login", credentials).catch(() => api.post("admin/admin_login.php", credentials)),
  adminRegister: (data) =>
    api.post("/api/auth/admin/register", data).catch(() => api.post("admin/admin_register.php", data)),
};

// Standalone Helper: Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post("/api/auth/admin/register", adminData).catch(() => api.post("admin/admin_register.php", adminData));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};

// Faculty & Mentors Service (Python /api/faculty)
export const facultyApi = {
  getAll: () => api.get("/api/faculty").catch(() => api.get("/staff_view_all.php")),
  getGroup1Faculty: () => api.get("/api/courses/group1").catch(() => api.get("/group1_all.php")),
  save: (formData) =>
    api.post("/api/faculty", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post("/faculty_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  saveGroup1: (formData) =>
    api.post("/api/courses/group1", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post("/group1_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  update: (id, formData) =>
    api.put(`/api/faculty/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post(`/group1_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
  delete: (id) => api.delete(`/api/faculty/${id}`).catch(() => api.delete(`/group1_delete.php?id=${id}`)),
};

// Achievers & Results Service (Python /api/achievers)
export const achieversApi = {
  getAll: () => api.get("/api/achievers").catch(() => api.get("/achivers_all.php")),
  save: (formData) =>
    api.post("/api/achievers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post("/achivers_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  update: (id, formData) =>
    api.put(`/api/achievers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post(`/achivers_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
  delete: (id) => api.delete(`/api/achievers/${id}`).catch(() => api.delete(`/achivers_delete.php?id=${id}`)),
};

// Test Series & Schedules Service (Python /api/tests)
export const testApi = {
  getAll: () => api.get("/api/tests").catch(() => api.get("/test_all.php")),
  upload: (formData) =>
    api.post("/api/tests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(() => api.post("/test_upload.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
  update: (id, data) => api.put(`/api/tests/${id}`, data).catch(() => api.post(`/test_update.php?id=${id}`, data)),
  delete: (id) => api.delete(`/api/tests/${id}`).catch(() => api.delete(`/test_delete.php?id=${id}`)),
  download: (id) => api.get(`/api/tests/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/test_download.php?id=${id}`, { responseType: "blob" })),
};

// TNPSC Groups Service (Python /api/courses/<group>)
export const groupsApi = {
  group1: {
    getAll: () => api.get("/api/courses/group1").catch(() => api.get("/group1_all.php")),
    save: (formData) =>
      api.post("/api/courses/group1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/group1_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/group1/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/group1_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/group1/${id}`).catch(() => api.delete(`/group1_delete.php?id=${id}`)),
  },
  group2: {
    getAll: () => api.get("/api/courses/group2").catch(() => api.get("/group2_all.php")),
    save: (formData) =>
      api.post("/api/courses/group2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/group2_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/group2/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/group2_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/group2/${id}`).catch(() => api.delete(`/group2_delete.php?id=${id}`)),
  },
  group2A: {
    getAll: () => api.get("/api/courses/group2A").catch(() => api.get("/group2A_all.php")),
    save: (formData) =>
      api.post("/api/courses/group2A", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/group2A_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/group2A/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/group2A_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/group2A/${id}`).catch(() => api.delete(`/group2A_delete.php?id=${id}`)),
  },
  group4: {
    getAll: () => api.get("/api/courses/group4").catch(() => api.get("/group4_all.php")),
    save: (formData) =>
      api.post("/api/courses/group4", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/group4_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/group4/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/group4_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/group4/${id}`).catch(() => api.delete(`/group4_delete.php?id=${id}`)),
    download: (id) => api.get(`/api/courses/group4/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/group4_download.php?id=${id}`, { responseType: "blob" })),
  },
};

// TNUSRB Police Service (Python /api/courses/<police_category>)
export const tnusrbApi = {
  common: {
    getAll: () => api.get("/api/courses/commonRecruitment").catch(() => api.get("/tnusrbs_view.php")),
    save: (formData) =>
      api.post("/api/courses/commonRecruitment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/tnusrbs_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/commonRecruitment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/tnusrbs_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/commonRecruitment/${id}`).catch(() => api.delete(`/tnusrbs_delete.php?id=${id}`)),
    download: (id) => api.get(`/api/courses/commonRecruitment/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/tnusrbs_download.php?id=${id}`, { responseType: "blob" })),
  },
  technical: {
    getAll: () => api.get("/api/courses/siTechnical").catch(() => api.get("/technical_view.php")),
    save: (formData) =>
      api.post("/api/courses/siTechnical", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/technical_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/siTechnical/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/technical_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/siTechnical/${id}`).catch(() => api.delete(`/technical_delete.php?id=${id}`)),
    download: (id) => api.get(`/api/courses/siTechnical/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/technical_download.php?id=${id}`, { responseType: "blob" })),
  },
  fingerprint: {
    getAll: () => api.get("/api/courses/siFingerprint").catch(() => api.get("/fingerprints_view.php")),
    save: (formData) =>
      api.post("/api/courses/siFingerprint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/fingerprints_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/siFingerprint/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/fingerprints_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/siFingerprint/${id}`).catch(() => api.delete(`/fingerprints_delete.php?id=${id}`)),
    download: (id) => api.get(`/api/courses/siFingerprint/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/fingerprints_download.php?id=${id}`, { responseType: "blob" })),
  },
  join: {
    getAll: () => api.get("/api/courses/jointRecruitment").catch(() => api.get("/join_view.php")),
    save: (formData) =>
      api.post("/api/courses/jointRecruitment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post("/join_save.php", formData, { headers: { "Content-Type": "multipart/form-data" } })),
    update: (id, formData) =>
      api.put(`/api/courses/jointRecruitment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => api.post(`/join_update.php?id=${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })),
    delete: (id) => api.delete(`/api/courses/jointRecruitment/${id}`).catch(() => api.delete(`/join_delete.php?id=${id}`)),
    download: (id) => api.get(`/api/courses/jointRecruitment/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/join_download.php?id=${id}`, { responseType: "blob" })),
  },
};

// Staff Management Service (Python /api/staff)
export const staffApi = {
  getAll: () => api.get("/api/staff").catch(() => api.get("/staff_all.php").catch(() => api.get("/staff_view_all.php"))),
  update: (id, data) => api.put(`/api/staff/${id}`, data).catch(() => api.post(`/staff_update.php?id=${id}`, data)),
  delete: (id) => api.delete(`/api/staff/${id}`).catch(() => api.delete(`/staff_delete.php?id=${id}`)),
};

// Students Management Service (Python /api/students)
export const studentApi = {
  getAll: () => api.get("/api/students").catch(() => api.get("/student_all.php")),
  exportPdf: () => api.get("/api/students/export-pdf", { responseType: "blob" }).catch(() => api.get("/exportToPDF.php", { responseType: "blob" })),
  delete: (id) => api.delete(`/api/students/${id}`).catch(() => api.delete(`/student_delete.php?id=${id}`)),
};

// Syllabus Service (Python /api/syllabus)
export const syllabusApi = {
  getAll: () => api.get("/api/syllabus").catch(() => api.get("/syllabus_all.php")),
  upload: (data) => api.post("/api/syllabus", data).catch(() => api.post("/syllabus_upload.php", data)),
  update: (id, data) => api.put(`/api/syllabus/${id}`, data).catch(() => api.post(`/syllabus_update.php?id=${id}`, data)),
  delete: (id) => api.delete(`/api/syllabus/${id}`).catch(() => api.delete(`/syllabus_delete.php?id=${id}`)),
  download: (id) => api.get(`/api/syllabus/${id}/download`, { responseType: "blob" }).catch(() => api.get(`/syllabus_download.php?id=${id}`, { responseType: "blob" })),
};

// Payment Service (Python /api/payment/create-order)
export const paymentApi = {
  createOrder: (amount = 1) =>
    api.post("/api/payment/create-order", { amount }).catch(() => api.post("/payment_order.php", { amount })),
};

// OMR Master Keys & Automated Evaluation Engine Service (Python /api/omr/...)
export const omrApi = {
  getTests: () => api.get("/api/omr/tests").catch(() => api.get("/omr_tests.php")),
  getMasterKeys: (testId) =>
    api.get(`/api/omr/master-keys?test_id=${testId}`).catch(() => api.get(`/omr_master_keys.php?test_id=${testId}`)),
  saveMasterKeys: (data) =>
    api.post("/api/omr/master-keys", data).catch(() => api.post("/omr_master_save.php", data)),
  submitOMR: (submissionData) =>
    api.post("/api/omr/submit", submissionData).catch(() => api.post("/omr_submit.php", submissionData)),
  getSubmissions: (rollNo) => {
    const query = rollNo ? `?roll_no=${encodeURIComponent(rollNo)}` : "";
    return api.get(`/api/omr/submissions${query}`).catch(() => api.get(`/omr_submissions_all.php${query}`));
  },
  getSubmissionDetails: (submissionCode) =>
    api.get(`/api/omr/submissions/${submissionCode}`),
};

export default api;
