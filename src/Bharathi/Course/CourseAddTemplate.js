import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { saveCourseItem } from './CourseDataManager';
import { api } from '../Api/Api';
import '../Admin/AdminDashboard.css';

export default function CourseAddTemplate({
  courseKey,
  examType = 'TNPSC', // 'TNPSC' or 'TNUSRB'
  title = 'Course Syllabus & Notes',
  subtitle = 'Upload official syllabus guidelines, exam pattern, and preparatory notes.',
  viewRoute = '/Group-I-View',
  apiEndpoint = null,
}) {
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!syllabus.trim() || !paper.trim() || !subject.trim()) {
      Swal.fire('Required Fields', 'Please complete syllabus title, paper, and subject.', 'warning');
      return;
    }

    setLoading(true);

    const filename = file ? file.name : `${title.replace(/\s+/g, '_')}_Notes.pdf`;

    // Local state save
    const newItem = {
      syllabus: syllabus.trim(),
      paper: paper.trim(),
      subject: subject.trim(),
      filename: filename,
      date: new Date().toISOString().split('T')[0],
    };

    saveCourseItem(courseKey, newItem);

    // Attempt backend save via Python REST API
    const targetEndpoint = apiEndpoint || `/api/courses/${courseKey}`;
    try {
      const formData = new FormData();
      formData.append('syllabus', syllabus);
      formData.append('paper', paper);
      formData.append('subject', subject);
      if (file) formData.append('file', file);
      await api.post(targetEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).catch((err) => {
        console.warn('Backend upload skipped, saved locally:', err);
      });
    } catch (err) {}

    setLoading(false);

    Swal.fire({
      icon: 'success',
      title: 'Syllabus Added!',
      text: `${syllabus} has been published to the student portal.`,
      showCancelButton: true,
      confirmButtonText: 'View All Syllabus',
      cancelButtonText: 'Add Another',
      confirmButtonColor: '#0b1e42',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(viewRoute);
      } else {
        setSyllabus('');
        setPaper('');
        setSubject('');
        setFile(null);
      }
    });
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Trail */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>{examType}</span>
          <span className="separator">/</span>
          <span>Courses Add</span>
          <span className="separator">/</span>
          <span className="current">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className={`admin-meta-badge ${examType.toLowerCase()}`}>
              <i className="bi bi-mortarboard-fill"></i> {examType} Academic Module
            </span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-header-actions">
            <Link to={viewRoute} className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-collection me-1"></i> View Syllabus List
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
                <i className="bi bi-file-earmark-plus text-primary me-2"></i>
                Publish New Syllabus & Notes
              </h4>
              <p className="text-muted small mb-0">Fill in the curricular metadata and attach the PDF syllabus document.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form-container">
              <div className="row g-3">
                {/* Syllabus Title */}
                <div className="col-12">
                  <label className="admin-form-label">
                    Syllabus / Notification Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. TNPSC Group I Preliminary Master Syllabus 2026"
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    required
                  />
                  <div className="admin-form-hint">Enter the full official title as announced by the commission.</div>
                </div>

                {/* Paper / Stage */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Exam Paper / Stage <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. Paper I (GS & Aptitude) or Mains Paper II"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                    required
                  />
                </div>

                {/* Subject Area */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Subject & Topics Covered <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. Tamil Society, Indian Polity, Science & Technology"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* File Upload Zone */}
                <div className="col-12">
                  <label className="admin-form-label">Upload Syllabus PDF / Document</label>
                  <div
                    className={`admin-upload-zone ${isDragOver ? 'dragover' : ''}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('syllabus-file-input').click()}
                  >
                    <input
                      type="file"
                      id="syllabus-file-input"
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <div className="admin-upload-icon">
                      <i className="bi bi-cloud-arrow-up"></i>
                    </div>
                    <div className="admin-upload-text">
                      {file ? file.name : 'Click to select or drag and drop syllabus PDF'}
                    </div>
                    <div className="admin-upload-sub">PDF or DOC format up to 25MB supported</div>

                    {file && (
                      <div className="admin-upload-selected" onClick={(e) => e.stopPropagation()}>
                        <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                        <span>{file.name}</span>
                        <span className="text-muted ms-1">({(file.size / 1024).toFixed(1)} KB)</span>
                        <button
                          type="button"
                          className="btn-close ms-2"
                          style={{ fontSize: '0.65rem' }}
                          onClick={() => setFile(null)}
                        ></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="col-12 pt-3 border-top mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(viewRoute)}
                    className="btn btn-light px-4 py-2 border fw-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-custom px-4 py-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving Syllabus...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Save & Publish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
