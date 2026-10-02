import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { facultyApi } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const FacultyForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [designation, setDesignation] = useState('Senior Faculty Mentor');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !subject.trim()) {
      Swal.fire('Required Fields', 'Please enter mentor name and subject expertise.', 'warning');
      return;
    }

    setLoading(true);

    const mentorData = {
      id: Date.now(),
      username: username.trim(),
      name: username.trim(),
      paper: paper.trim() || 'General Studies & Mains',
      subject: subject.trim(),
      designation: designation.trim(),
      phone: phone || '+91 7338757194',
    };

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('bharathi_custom_faculty') || '[]');
      localStorage.setItem('bharathi_custom_faculty', JSON.stringify([mentorData, ...existing]));
    } catch (err) {}

    // Remote call
    try {
      const form = new FormData();
      Object.keys(mentorData).forEach((k) => form.append(k, mentorData[k]));
      if (file) form.append('file', file);
      await facultyApi.save(form).catch(() => null);
    } catch (err) {}

    setLoading(false);

    Swal.fire({
      icon: 'success',
      title: 'Faculty Added!',
      text: `${username} has been inducted to the mentoring panel.`,
      showCancelButton: true,
      confirmButtonText: 'View Faculty Roster',
      cancelButtonText: 'Add Another',
      confirmButtonColor: '#0b1e42',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/Faculty-View');
      } else {
        setUsername('');
        setPaper('');
        setSubject('');
        setPhone('');
        setFile(null);
      }
    });
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Faculty & Mentorship</span>
          <span className="separator">/</span>
          <span className="current">Faculty - Add</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-person-workspace"></i> Academic Mentors
            </span>
            <h1>Induct Faculty Mentor</h1>
            <p>Add distinguished educators and civil service officers to the mentoring and test evaluation council.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Faculty-View" className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-person-lines-fill me-1"></i> View Faculty Roster
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
                <i className="bi bi-person-plus text-primary me-2"></i>
                Faculty Profile & Subject Assignment
              </h4>
              <p className="text-muted small mb-0">Specify subject syllabus responsibilities, mentoring papers, and contact guidance.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form-container">
              <div className="row g-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Faculty Mentor Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. S. Kannan, M.A."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Role / Academic Title</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. Senior Faculty & General Studies Specialist"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>

                {/* Papers */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Exam Papers Guided</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    placeholder="e.g. Paper I & II (GS, History, Indian Polity)"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                  />
                </div>

                {/* Guidance Contact */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Official Contact / Helpline</label>
                  <input
                    type="tel"
                    className="admin-form-control"
                    placeholder="e.g. +91 8012194136"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Subject Scope */}
                <div className="col-12">
                  <label className="admin-form-label">
                    Subject Areas & Curricular Specialization <span className="required">*</span>
                  </label>
                  <textarea
                    rows="3"
                    className="admin-form-control"
                    placeholder="e.g. General Studies, History, Indian National Movement, Tamil Society and Mental Ability"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Photo */}
                <div className="col-12">
                  <label className="admin-form-label">Mentor Portrait Photo</label>
                  <input
                    type="file"
                    className="admin-form-control"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>

                {/* Actions */}
                <div className="col-12 pt-3 border-top mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/Faculty-View')}
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
                        Saving Faculty...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Register Faculty
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
};

export default FacultyForm;
