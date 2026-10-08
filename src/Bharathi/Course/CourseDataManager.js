// Reusable Course Data and Persistence Manager for TNPSC and TNUSRB Admin modules
import { api } from '../Api/Api';

export const INITIAL_SYLLABUS_DATA = {
  // TNPSC
  group1: [
    {
      id: 1,
      syllabus: "TNPSC Group I Preliminary & Mains Master Syllabus 2026",
      paper: "General Studies & Aptitude",
      subject: "History, Culture, Geography, Tamil Society & Indian Polity",
      filename: "TNPSC_Group1_Comprehensive_2026.pdf",
      date: "2026-03-01",
    },
    {
      id: 2,
      syllabus: "Group I Mains Paper II - Tamil Eligibility & Heritage",
      paper: "Paper II",
      subject: "Tamil Society, Culture & Administration in Tamil Nadu",
      filename: "Group1_Paper2_Tamil_Heritage.pdf",
      date: "2026-03-05",
    },
    {
      id: 3,
      syllabus: "Group I Mains Paper III - Science, Tech & Economy",
      paper: "Paper III",
      subject: "Role of Science & Tech, Indian Economy & Current Socio-Economic Issues",
      filename: "Group1_Paper3_Economy_Science.pdf",
      date: "2026-03-10",
    }
  ],
  group2: [
    {
      id: 1,
      syllabus: "TNPSC Group II & II-A Combined Scheme of Examination",
      paper: "Prelims (Single Paper)",
      subject: "General Studies (Degree Standard) + Aptitude + General Tamil / English",
      filename: "Group2_Combined_Scheme_2026.pdf",
      date: "2026-03-02",
    },
    {
      id: 2,
      syllabus: "Group II Interview Posts Syllabus & Interview Guidance",
      paper: "Mains Paper I & II",
      subject: "Descriptive Type Tamil to English Translation, Precis Writing & Letter Drafting",
      filename: "Group2_Interview_Mains_Syllabus.pdf",
      date: "2026-03-08",
    }
  ],
  group2A: [
    {
      id: 1,
      syllabus: "TNPSC Group II-A Non-Interview Posts Official Syllabus",
      paper: "Paper I & II",
      subject: "General Studies, Aptitude and Mental Ability, General Tamil",
      filename: "Group2A_Non_Interview_Syllabus.pdf",
      date: "2026-03-03",
    },
    {
      id: 2,
      syllabus: "Group II-A Secretarial Assistant & Revenue Inspector Focus Module",
      paper: "General Studies",
      subject: "Indian National Movement, Tamil Nadu Administration & Governance",
      filename: "Group2A_Revenue_Inspector_Notes.pdf",
      date: "2026-03-09",
    }
  ],
  group4: [
    {
      id: 1,
      syllabus: "TNPSC Group IV & VAO Complete Syllabus & Schedule 2026",
      paper: "Single Paper (SSLC Standard)",
      subject: "Part A (General Tamil 100 Qs) + Part B (General Studies & Aptitude 100 Qs)",
      filename: "SUNDAY GRP 4 SCHEDULE -2026.pdf",
      date: "2026-03-01",
    },
    {
      id: 2,
      syllabus: "Group IV Samacheer Kalvi 6th to 10th Standard Quick Revision Notes",
      paper: "Part A - General Tamil",
      subject: "Ilakkanam, Ilakkiyam, Tamil Arignargalum Tamil Thondum",
      filename: "Group4_Tamil_Samacheer_Guide.pdf",
      date: "2026-03-12",
    },
    {
      id: 3,
      syllabus: "Village Administrative Officer (VAO) Rural Administration Guidelines",
      paper: "General Studies",
      subject: "Basics of Village Administration, Land Records, Revenue Act",
      filename: "VAO_Rural_Administration_Notes.pdf",
      date: "2026-03-14",
    }
  ],

  // TNUSRB
  jointRecruitment: [
    {
      id: 1,
      syllabus: "TNUSRB Joint Recruitment for SIs (Taluk & AR) & Station Officers",
      paper: "Part I & II Written Exam",
      subject: "Tamil Language Eligibility Test + General Knowledge & Psychology Test",
      filename: "TNUSRB_SI_Joint_Recruitment_Syllabus.pdf",
      date: "2026-02-28",
    },
    {
      id: 2,
      syllabus: "TNUSRB SI Physical Endurance & Physical Measurement Test (PET/PMT) Guide",
      paper: "Physical Stage",
      subject: "Men (1500m, Long Jump, High Jump, Rope Climbing) / Women (400m, Long Jump, Cricket Ball)",
      filename: "TNUSRB_SI_Physical_Standards_Guide.pdf",
      date: "2026-03-04",
    }
  ],
  siTechnical: [
    {
      id: 1,
      syllabus: "TNUSRB Sub-Inspector of Police (Technical) Syllabus 2026",
      paper: "Technical Paper",
      subject: "Electronics & Communication Engineering / Telecommunication Systems",
      filename: "SI_Technical_ECE_Syllabus_2026.pdf",
      date: "2026-03-06",
    },
    {
      id: 2,
      syllabus: "SI Technical General Knowledge & Psychology Paper",
      paper: "Paper I",
      subject: "General Studies, Aptitude, Numerical Analysis & Logical Reasoning",
      filename: "SI_Technical_Paper1_GK_Psychology.pdf",
      date: "2026-03-11",
    }
  ],
  siFingerprint: [
    {
      id: 1,
      syllabus: "TNUSRB Sub-Inspector of Police (Finger Print) Official Syllabus",
      paper: "Technical Science",
      subject: "Physics, Chemistry & Forensic Science (Degree Standard)",
      filename: "SI_FingerPrint_Science_Forensics.pdf",
      date: "2026-03-07",
    },
    {
      id: 2,
      syllabus: "SI Finger Print Dactyloscopy & Evidence Handling Notes",
      paper: "Forensics Module",
      subject: "Crime Scene Investigation, Ridge Characteristics & Latent Print Development",
      filename: "SI_Fingerprint_Dactyloscopy_Notes.pdf",
      date: "2026-03-13",
    }
  ],
  commonRecruitment: [
    {
      id: 1,
      syllabus: "TNUSRB Common Recruitment (Grade II Police Constables, Jail Warders & Firemen)",
      paper: "Written Test (SSLC Standard)",
      subject: "Tamil Eligibility (80 Marks) + Main Written Test (70 Marks: GK & Psychology)",
      filename: "TNUSRB_PC_Common_Recruitment_Syllabus.pdf",
      date: "2026-03-05",
    },
    {
      id: 2,
      syllabus: "Police Constable Psychology & Numerical Ability Model Paper",
      paper: "Psychology Test",
      subject: "Logical Analysis, Numerical Ability, Mental Ability, Decision Making",
      filename: "TNUSRB_PC_Psychology_Model_Paper.pdf",
      date: "2026-03-15",
    }
  ]
};

// Local storage key helper
const getStorageKey = (courseKey) => `bharathi_course_${courseKey}`;

export const getCourseList = (courseKey) => {
  try {
    const raw = localStorage.getItem(getStorageKey(courseKey));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed reading course data from localStorage', e);
  }
  const defaults = INITIAL_SYLLABUS_DATA[courseKey] || [];
  return defaults;
};

export const saveCourseItem = (courseKey, newItem) => {
  const current = getCourseList(courseKey);
  const created = {
    ...newItem,
    id: newItem.id || Date.now(),
    date: newItem.date || new Date().toISOString().split('T')[0],
  };
  const updated = [created, ...current];
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}
  // Sync with Python backend
  api.post(`/api/courses/${courseKey}`, created).catch(() => {});
  return created;
};

export const updateCourseItem = (courseKey, id, updatedFields) => {
  const current = getCourseList(courseKey);
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}
  // Sync with Python backend
  api.put(`/api/courses/${courseKey}/${id}`, updatedFields).catch(() => {});
  return updated;
};

export const deleteCourseItem = (courseKey, id) => {
  const current = getCourseList(courseKey);
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(getStorageKey(courseKey), JSON.stringify(updated));
  } catch (e) {}
  // Sync with Python backend
  api.delete(`/api/courses/${courseKey}/${id}`).catch(() => {});
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
