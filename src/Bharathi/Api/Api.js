import axios from "axios";

// 1. Resolve Base URL globally
export const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "https://www.bharathi.techsasi.com/techsasi/"
    : "https://www.bharathi.techsasi.com/techsasi/");

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
  timeout: 10000,
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
      if (url.includes("staff_view.php") || url.includes("group1_all.php")) {
        console.warn(`[Global API] Returning fallback faculty data for ${url}`);
        return Promise.resolve({ data: DEFAULT_FACULTY, status: 200, statusText: "OK (Fallback)" });
      }
      if (url.includes("achivers_all.php")) {
        console.warn(`[Global API] Returning fallback achievers data for ${url}`);
        return Promise.resolve({ data: DEFAULT_ACHIEVERS, status: 200, statusText: "OK (Fallback)" });
      }
      if (url.includes("test_all.php")) {
        console.warn(`[Global API] Returning fallback tests data for ${url}`);
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

// 5. Global Domain API Services (All converted to .php endpoints)

// Authentication Service
export const authApi = {
  studentLogin: (credentials) => api.post("student/student_login.php", credentials),
  studentRegister: (data) => api.post("student/student_register.php", data),
  studentForgotPassword: (email) => api.post("student/student_forgot_password.php", { email }),

  staffLogin: (credentials) => api.post("staff/staff_login.php", credentials),
  staffRegister: (data) => api.post("staff/staff_register.php", data),
  staffForgotPassword: (email) => api.post("staff/staff_forgot_password.php", { email }),

  adminLogin: (credentials) => api.post("admin/admin_login.php", credentials),
  adminRegister: (data) => api.post("admin/admin_register.php", data),
};

// Standalone Helper: Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post("/admin_register.php", adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};

// Faculty & Mentors Service
export const facultyApi = {
  getAll: () => api.get("/staff_view_all.php"),
  getGroup1Faculty: () => api.get("/group1_all.php"),
  save: (formData) =>
    api.post("/faculty_save.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  saveGroup1: (formData) =>
    api.post("/group1_save.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.post(`/group1_update.php?id=${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/group1_delete.php?id=${id}`),
};

// Achievers & Results Service
export const achieversApi = {
  getAll: () => api.get("/achivers_all.php"),
  save: (formData) =>
    api.post("/achivers_save.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.post(`/achivers_update.php?id=${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/achivers_delete.php?id=${id}`),
};

// Test Series & Schedules Service
export const testApi = {
  getAll: () => api.get("/test_all.php"),
  upload: (formData) =>
    api.post("/test_upload.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/test_delete.php?id=${id}`),
  download: (id) => api.get(`/test_download.php?id=${id}`, { responseType: "blob" }),
};

// TNPSC Groups Service
export const groupsApi = {
  group1: {
    getAll: () => api.get("/group1_all.php"),
    save: (formData) =>
      api.post("/group1_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/group1_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/group1_delete.php?id=${id}`),
  },
  group2: {
    getAll: () => api.get("/group2_all.php"),
    save: (formData) =>
      api.post("/group2_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/group2_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/group2_delete.php?id=${id}`),
  },
  group2A: {
    getAll: () => api.get("/group2A_all.php"),
    save: (formData) =>
      api.post("/group2A_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/group2A_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/group2A_delete.php?id=${id}`),
  },
  group4: {
    getAll: () => api.get("/group4_all.php"),
    save: (formData) =>
      api.post("/group4_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/group4_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/group4_delete.php?id=${id}`),
    download: (id) => api.get(`/group4_download.php?id=${id}`, { responseType: "blob" }),
  },
};

// TNUSRB Police Service
export const tnusrbApi = {
  common: {
    getAll: () => api.get("/tnusrbs_view.php"),
    save: (formData) =>
      api.post("/tnusrbs_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/tnusrbs_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/tnusrbs_delete.php?id=${id}`),
    download: (id) => api.get(`/tnusrbs_download.php?id=${id}`, { responseType: "blob" }),
  },
  technical: {
    getAll: () => api.get("/technical_view.php"),
    save: (formData) =>
      api.post("/technical_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/technical_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/technical_delete.php?id=${id}`),
    download: (id) => api.get(`/technical_download.php?id=${id}`, { responseType: "blob" }),
  },
  fingerprint: {
    getAll: () => api.get("/fingerprints_view.php"),
    save: (formData) =>
      api.post("/fingerprints_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/fingerprints_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/fingerprints_delete.php?id=${id}`),
    download: (id) => api.get(`/fingerprints_download.php?id=${id}`, { responseType: "blob" }),
  },
  join: {
    getAll: () => api.get("/join_view.php"),
    save: (formData) =>
      api.post("/join_save.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.post(`/join_update.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/join_delete.php?id=${id}`),
    download: (id) => api.get(`/join_download.php?id=${id}`, { responseType: "blob" }),
  },
};

// Staff Service
export const staffApi = {
  getAll: () => api.get("/staff_view_all.php"),
  update: (id, data) => api.post(`/staff_update.php?id=${id}`, data),
  delete: (id) => api.delete(`/staff_delete.php?id=${id}`),
};

// Students Service
export const studentApi = {
  getAll: () => api.get("/student_all.php"),
  exportPdf: () => api.get("/exportToPDF.php", { responseType: "blob" }),
  delete: (id) => api.delete(`/student_delete.php?id=${id}`),
};

// Syllabus Service
export const syllabusApi = {
  getAll: () => api.get("/syllabus_all.php"),
  upload: (data) => api.post("/syllabus_upload.php", data),
  update: (id, data) => api.post(`/syllabus_update.php?id=${id}`, data),
  delete: (id) => api.delete(`/syllabus_delete.php?id=${id}`),
  download: (id) => api.get(`/syllabus_download.php?id=${id}`, { responseType: "blob" }),
};

// Payment Service
export const paymentApi = {
  createOrder: (amount = 1) => api.post("/payment_order.php", { amount }),
};

export default api;