import axios from "axios";

/**
 * =============================================================================
 * Bharathi Thervukalam - Centralized API Service Layer
 * Fully Integrated with Python + MySQL Backend (REST API)
 * Supports Authentication, Courses, Test Series, Digital OMR Evaluator, 
 * Students, Faculty, and Achievers modules.
 * =============================================================================
 */

// 1. Resolve Base URL dynamically: Priority: ENV -> localStorage override -> Relative root
export const BASE_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL.trim();
    return url.endsWith("/") ? url : `${url}/`;
  }
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("backend_api_url");
    if (custom && custom.trim()) {
      const isRemote = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
      const isLocalTarget = custom.includes("localhost") || custom.includes("127.0.0.1");
      if (!(isRemote && isLocalTarget)) {
        return custom.endsWith("/") ? custom.trim() : `${custom.trim()}/`;
      }
    }
  }
  // Standard relative base for production & dev proxy on port 3000
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

// 2. Create Primary Axios Client
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

    if (error.response?.status === 401 && !url.includes("/api/auth/")) {
      console.warn("[Security Guard] 401 Unauthorized detected. Purging token and redirecting.");
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
      } catch (e) {}
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!["/login", "/Student-Login", "/Admin-Login", "/Staff-Login"].includes(currentPath)) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`;
        }
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("staff_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  } catch (e) {}
};

// Helper for query strings
const toQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

// =============================================================================
// 5. PYTHON + MYSQL REST API SERVICES
// =============================================================================

// Authentication Service
export const authApi = {
  // Unified Auth
  login: (credentials) => api.post("/api/auth/login", credentials),
  getProfile: () => api.get("/api/auth/me"),
  verifySession: () => api.get("/api/auth/verify-session"),
  terminateOtherSessions: () => api.post("/api/auth/terminate-other-sessions"),

  // Student Auth
  studentLogin: (credentials) => api.post("/api/auth/student/login", credentials),
  studentRegister: (data) => api.post("/api/auth/student/register", data),
  studentForgotPassword: (email) => api.post("/api/auth/student/forgot-password", { email }),

  // Staff Auth
  staffLogin: (credentials) => api.post("/api/auth/staff/login", credentials),
  staffRegister: (data) => api.post("/api/auth/staff/register", data),
  staffForgotPassword: (email) => api.post("/api/auth/staff/forgot-password", { email }),

  // Admin Auth
  adminLogin: (credentials) => api.post("/api/auth/admin/login", credentials),
  adminRegister: (data) => api.post("/api/auth/admin/register", data),
  adminForgotPassword: (email) => api.post("/api/auth/admin/forgot-password", { email }),
};

// Standalone Helper: Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post("/api/auth/admin/register", adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};

// Users Service
export const usersApi = {
  getAll: (params) => api.get(`/api/users${toQueryString(params)}`),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post("/api/users", data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  patch: (id, data) => api.patch(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  bulkCreate: (records) => api.post("/api/users/bulk", records),
  bulkUpdate: (records) => api.put("/api/users/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/users/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/users/bulk", { data: { ids } }),
};

// Faculty & Mentors Service (/api/faculty)
export const facultyApi = {
  getAll: (params) => api.get(`/api/faculty${toQueryString(params)}`),
  getById: (id) => api.get(`/api/faculty/${id}`),
  getGroup1Faculty: (params) => api.get(`/api/faculty${toQueryString(params)}`),
  save: (data) => api.post("/api/faculty", data),
  create: (data) => api.post("/api/faculty", data),
  update: (id, data) => api.put(`/api/faculty/${id}`, data),
  patch: (id, data) => api.patch(`/api/faculty/${id}`, data),
  delete: (id) => api.delete(`/api/faculty/${id}`),
  bulkCreate: (records) => api.post("/api/faculty/bulk", records),
  bulkUpdate: (records) => api.put("/api/faculty/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/faculty/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/faculty/bulk", { data: { ids } }),
};

// Achievers & Results Service (/api/achievers)
export const achieversApi = {
  getAll: (params) => api.get(`/api/achievers${toQueryString(params)}`),
  getById: (id) => api.get(`/api/achievers/${id}`),
  save: (data) => api.post("/api/achievers", data),
  create: (data) => api.post("/api/achievers", data),
  update: (id, data) => api.put(`/api/achievers/${id}`, data),
  patch: (id, data) => api.patch(`/api/achievers/${id}`, data),
  delete: (id) => api.delete(`/api/achievers/${id}`),
  bulkCreate: (records) => api.post("/api/achievers/bulk", records),
  bulkUpdate: (records) => api.put("/api/achievers/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/achievers/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/achievers/bulk", { data: { ids } }),
};

// Test Series & Schedules Service (/api/tests)
export const testApi = {
  getAll: (params) => api.get(`/api/tests${toQueryString(params)}`),
  getById: (id) => api.get(`/api/tests/${id}`),
  upload: (data) => api.post("/api/tests", data),
  create: (data) => api.post("/api/tests", data),
  update: (id, data) => api.put(`/api/tests/${id}`, data),
  patch: (id, data) => api.patch(`/api/tests/${id}`, data),
  delete: (id) => api.delete(`/api/tests/${id}`),
  download: (id) => api.get(`/api/tests/${id}/download`, { responseType: "blob" }),
  bulkCreate: (records) => api.post("/api/tests/bulk", records),
  bulkUpdate: (records) => api.put("/api/tests/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/tests/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/tests/bulk", { data: { ids } }),
};

// Courses Service (/api/courses)
export const coursesApi = {
  getAll: (params) => api.get(`/api/courses${toQueryString(params)}`),
  getById: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post("/api/courses", data),
  update: (id, data) => api.put(`/api/courses/${id}`, data),
  patch: (id, data) => api.patch(`/api/courses/${id}`, data),
  delete: (id) => api.delete(`/api/courses/${id}`),
  bulkCreate: (records) => api.post("/api/courses/bulk", records),
  bulkUpdate: (records) => api.put("/api/courses/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/courses/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/courses/bulk", { data: { ids } }),
};

// Students Management Service (/api/students)
export const studentApi = {
  getAll: (params) => api.get(`/api/students${toQueryString(params)}`),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (data) => api.post("/api/students", data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  patch: (id, data) => api.patch(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`),
  bulkCreate: (records) => api.post("/api/students/bulk", records),
  bulkUpdate: (records) => api.put("/api/students/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/students/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/students/bulk", { data: { ids } }),
  exportPdf: () => api.get("/api/students/export-pdf", { responseType: "blob" }),
};

// Staff Management Service (/api/staff)
export const staffApi = {
  getAll: (params) => api.get(`/api/staff${toQueryString(params)}`),
  getById: (id) => api.get(`/api/staff/${id}`),
  create: (data) => api.post("/api/staff", data),
  update: (id, data) => api.put(`/api/staff/${id}`, data),
  patch: (id, data) => api.patch(`/api/staff/${id}`, data),
  delete: (id) => api.delete(`/api/staff/${id}`),
  bulkCreate: (records) => api.post("/api/staff/bulk", records),
  bulkUpdate: (records) => api.put("/api/staff/bulk", records),
  bulkPatch: (ids, updates) => api.patch("/api/staff/bulk", { ids, updates }),
  bulkDelete: (ids) => api.delete("/api/staff/bulk", { data: { ids } }),
};

// Performance & Metrics Service
export const metricsApi = {
  getHealth: () => api.get("/api/health"),
  getMetrics: (limit = 100) => api.get(`/api/metrics?limit=${limit}`),
};

// TNPSC Groups Service (/api/courses/<group>)
export const groupsApi = {
  group1: {
    getAll: () => api.get("/api/courses/group1"),
    save: (formData) =>
      api.post("/api/courses/group1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/group1/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/group1/${id}`),
  },
  group2: {
    getAll: () => api.get("/api/courses/group2"),
    save: (formData) =>
      api.post("/api/courses/group2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/group2/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/group2/${id}`),
  },
  group2A: {
    getAll: () => api.get("/api/courses/group2A"),
    save: (formData) =>
      api.post("/api/courses/group2A", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/group2A/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/group2A/${id}`),
  },
  group4: {
    getAll: () => api.get("/api/courses/group4"),
    save: (formData) =>
      api.post("/api/courses/group4", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/group4/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/group4/${id}`),
    download: (id) => api.get(`/api/courses/group4/${id}/download`, { responseType: "blob" }),
  },
};

// TNUSRB Police Service (/api/courses/<police_category>)
export const tnusrbApi = {
  common: {
    getAll: () => api.get("/api/courses/commonRecruitment"),
    save: (formData) =>
      api.post("/api/courses/commonRecruitment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/commonRecruitment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/commonRecruitment/${id}`),
    download: (id) => api.get(`/api/courses/commonRecruitment/${id}/download`, { responseType: "blob" }),
  },
  technical: {
    getAll: () => api.get("/api/courses/siTechnical"),
    save: (formData) =>
      api.post("/api/courses/siTechnical", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/siTechnical/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/siTechnical/${id}`),
    download: (id) => api.get(`/api/courses/siTechnical/${id}/download`, { responseType: "blob" }),
  },
  fingerprint: {
    getAll: () => api.get("/api/courses/siFingerprint"),
    save: (formData) =>
      api.post("/api/courses/siFingerprint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/siFingerprint/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/siFingerprint/${id}`),
    download: (id) => api.get(`/api/courses/siFingerprint/${id}/download`, { responseType: "blob" }),
  },
  join: {
    getAll: () => api.get("/api/courses/jointRecruitment"),
    save: (formData) =>
      api.post("/api/courses/jointRecruitment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      api.put(`/api/courses/jointRecruitment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => api.delete(`/api/courses/jointRecruitment/${id}`),
    download: (id) => api.get(`/api/courses/jointRecruitment/${id}/download`, { responseType: "blob" }),
  },
};

// Syllabus Service (/api/syllabus)
export const syllabusApi = {
  getAll: () => api.get("/api/syllabus"),
  upload: (data) => api.post("/api/syllabus", data),
  update: (id, data) => api.put(`/api/syllabus/${id}`, data),
  delete: (id) => api.delete(`/api/syllabus/${id}`),
  download: (id) => api.get(`/api/syllabus/${id}/download`, { responseType: "blob" }),
};

// Payment Service (/api/payment/create-order)
export const paymentApi = {
  createOrder: (amount = 1) => api.post("/api/payment/create-order", { amount }),
  verifyPayment: (paymentDetails) => api.post("/api/payment/verify", paymentDetails),
};

// OMR Master Keys & Automated Evaluation Engine Service (/api/omr/...)
export const omrApi = {
  getTests: () => api.get("/api/omr/tests"),
  getMasterKeys: (testId) => api.get(`/api/omr/master-keys?test_id=${testId}`),
  saveMasterKeys: (data) => api.post("/api/omr/master-keys", data),
  submitOMR: (submissionData) => api.post("/api/omr/submit", submissionData),
  getSubmissions: (rollNo) => {
    const query = rollNo ? `?roll_no=${encodeURIComponent(rollNo)}` : "";
    return api.get(`/api/omr/submissions${query}`);
  },
  getSubmissionDetails: (submissionCode) => api.get(`/api/omr/submissions/${submissionCode}`),
};

// Eligibility Service (/api/eligibility)
export const eligibilityApi = {
  getAll: () => api.get("/api/eligibility"),
  create: (data) => api.post("/api/eligibility", data),
  update: (id, data) => api.put(`/api/eligibility/${id}`, data),
  delete: (id) => api.delete(`/api/eligibility/${id}`),
};

// Institutional Commitments & Pillars Service (/api/about/pillars)
export const aboutApi = {
  getPillars: () => api.get("/api/about/pillars"),
  createPillar: (data) => api.post("/api/about/pillars", data),
  updatePillar: (id, data) => api.put(`/api/about/pillars/${id}`, data),
  deletePillar: (id) => api.delete(`/api/about/pillars/${id}`),
};

// PDF Test Series Question & Highlighted Answer Extractor Service
export const pdfApi = {
  extractQuestions: (payload) => api.post("/api/pdf/extract-questions", payload),
  mergeQuestionsAndAnswers: (payload) => api.post("/api/pdf/merge-questions-answers", payload),
  publishTest: (payload) => api.post("/api/pdf/publish-test", payload),
};

export default api;