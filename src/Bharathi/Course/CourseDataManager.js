// Dynamic Course Data and Persistence Manager for TNPSC and TNUSRB Admin modules
import { api } from '../Api/Api';

// Local storage key helper
const getStorageKey = (courseKey) => `bharathi_course_${courseKey}`;

// Dynamic Asynchronous fetch from REST API database
export const fetchCourseList = async (courseKey) => {
  try {
    const res = await api.get(`/api/courses/${courseKey}`);
    const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    if (Array.isArray(items)) {
      const formatted = items.map(c => ({
        id: c.id,
        course_key: c.course_key || courseKey,
        syllabus: c.syllabus || c.title || 'Course Syllabus',
        paper: c.paper || 'General Paper',
        subject: c.subject || 'General Studies',
        filename: c.filename || c.pdf_filename || 'SATURDAY TIME TABLE-1.pdf',
        date: c.date || '2026-03-01',
        status: c.status || 'ACTIVE'
      }));
      localStorage.setItem(getStorageKey(courseKey), JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn(`[CourseDataManager] API fetch error for ${courseKey}:`, err);
  }

  // Fallback to local storage cache if network is temporarily unavailable
  try {
    const raw = localStorage.getItem(getStorageKey(courseKey));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  return [];
};

// Synchronous cached getter
export const getCourseList = (courseKey) => {
  try {
    const raw = localStorage.getItem(getStorageKey(courseKey));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed reading course data from localStorage', e);
  }
  return [];
};

export const saveCourseItem = async (courseKey, newItem) => {
  const current = getCourseList(courseKey);
  const created = {
    ...newItem,
    id: newItem.id || Date.now(),
    course_key: courseKey,
    syllabus: newItem.syllabus || newItem.title,
    date: newItem.date || new Date().toISOString().split('T')[0],
  };
  const updated = [created, ...current];
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}

  // Sync dynamically with backend database
  try {
    await api.post(`/api/courses/${courseKey}`, created);
  } catch (err) {
    console.warn('API sync warning:', err);
  }
  return created;
};

export const updateCourseItem = async (courseKey, id, updatedFields) => {
  const current = getCourseList(courseKey);
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}

  // Sync dynamically with backend database
  try {
    await api.put(`/api/courses/${courseKey}/${id}`, updatedFields);
  } catch (err) {
    console.warn('API sync warning:', err);
  }
  return updated;
};

export const deleteCourseItem = async (courseKey, id) => {
  const current = getCourseList(courseKey);
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}

  // Sync dynamically with backend database
  try {
    await api.delete(`/api/courses/${courseKey}/${id}`);
  } catch (err) {
    console.warn('API sync warning:', err);
  }
  return updated;
};

export const triggerBlobDownload = (filename, title = 'Course Material') => {
  const samplePdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT
/F1 18 Tf
50 720 Td
(Bharathi Thervukalam - ${title}) Tj
/F1 12 Tf
0 -30 Td
(Official Syllabus & Exam Guidance Module) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000201 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
370
%%EOF`;

  const blob = new Blob([samplePdfContent], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
