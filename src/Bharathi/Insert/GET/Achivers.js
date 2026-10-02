import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { achieversApi } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const AchieversForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    posting: '',
    exam: 'TNPSC Group I',
    category: 'group1',
    year: '2025',
    rank: '',
    department: '',
    hometown: '',
    story: '',
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.posting.trim()) {
      Swal.fire('Required Fields', 'Please enter candidate name and posting achieved.', 'warning');
      return;
    }

    setLoading(true);

    const newAchiever = {
      id: Date.now(),
      name: formData.name.trim(),
      posting: formData.posting.trim(),
      exam: formData.exam,
      category: formData.category,
      year: formData.year,
      rank: formData.rank || 'State Selection',
      department: formData.department || 'Government of Tamil Nadu',
      hometown: formData.hometown || 'Tamil Nadu',
      story: formData.story || 'Guided by Bharathi Academy mentors in classroom coaching and test series.',
      syllabus: formData.name.trim(), // mapping for legacy table compatibility
      paper: formData.posting.trim(),
      subject: formData.department || 'State Service',
    };

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('bharathi_custom_achievers') || '[]');
      localStorage.setItem('bharathi_custom_achievers', JSON.stringify([newAchiever, ...existing]));
    } catch (e) {}

    // Also attempt remote save
    try {
      const form = new FormData();
      Object.keys(newAchiever).forEach((k) => form.append(k, newAchiever[k]));
      if (photo) form.append('file', photo);
      await achieversApi.save(form).catch(() => null);
    } catch (err) {}

    setLoading(false);

    Swal.fire({
      icon: 'success',
      title: 'Achiever Registered!',
      text: `${formData.name} (${formData.posting}) has been added to the Hall of Fame.`,
      showCancelButton: true,
      confirmButtonText: 'View Hall of Fame',
      cancelButtonText: 'Add Another',
      confirmButtonColor: '#0b1e42',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/Achivers-View');
      } else {
        setFormData({
          name: '',
          posting: '',
          exam: 'TNPSC Group I',
          category: 'group1',
          year: '2025',
          rank: '',
          department: '',
          hometown: '',
          story: '',
        });
        setPhoto(null);
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
          <span>Success & Honors</span>
          <span className="separator">/</span>
          <span className="current">Achievement - Add</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#e11d48' }}>
              <i className="bi bi-award-fill"></i> Hall of Fame & Selections
            </span>
            <h1>Register State Service Achiever</h1>
            <p>Publish inspiring success profiles of Bharathi Academy candidates who cracked TNPSC and TNUSRB.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Achivers-View" className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-trophy me-1"></i> View Achievers Directory
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
                <i className="bi bi-person-badge text-danger me-2"></i>
                Candidate Achievement Profile
              </h4>
              <p className="text-muted small mb-0">Record exam credentials, government appointment, and advice for future aspirants.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form-container">
              <div className="row g-3">
                {/* Candidate Name */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Candidate Full Name & Degrees <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="name"
                    placeholder="e.g. R. Vignesh, M.E."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Designation / Posting */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Designation / Government Posting <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="posting"
                    placeholder="e.g. Deputy Superintendent of Police (DSP)"
                    value={formData.posting}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Examination Stream */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">Examination</label>
                  <select
                    className="admin-form-select"
                    name="exam"
                    value={formData.exam}
                    onChange={(e) => {
                      const val = e.target.value;
                      let cat = 'group1';
                      if (val.includes('Group II')) cat = 'group2';
                      if (val.includes('Group IV')) cat = 'group4';
                      if (val.includes('TNUSRB') || val.includes('Police')) cat = 'police';
                      setFormData({ ...formData, exam: val, category: cat });
                    }}
                  >
                    <option value="TNPSC Group I">TNPSC Group I</option>
                    <option value="TNPSC Group II">TNPSC Group II</option>
                    <option value="TNPSC Group II-A">TNPSC Group II-A</option>
                    <option value="TNPSC Group IV & VAO">TNPSC Group IV & VAO</option>
                    <option value="TNUSRB Joint Recruitment SI">TNUSRB Joint Recruitment SI</option>
                    <option value="TNUSRB SI Technical">TNUSRB SI Technical</option>
                    <option value="TNUSRB SI Finger Print">TNUSRB SI Finger Print</option>
                    <option value="TNUSRB Police Constable">TNUSRB Police Constable</option>
                  </select>
                </div>

                {/* Selection Year */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">Selection Year</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="year"
                    placeholder="e.g. 2024 or 2025"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>

                {/* Rank / Distinction */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">State Rank / Distinction</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="rank"
                    placeholder="e.g. State Rank 4 / District 1st"
                    value={formData.rank}
                    onChange={handleChange}
                  />
                </div>

                {/* Department */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Department / Wing</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="department"
                    placeholder="e.g. Tamil Nadu Police Service (TNPS)"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                {/* Hometown */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Native Hometown</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="hometown"
                    placeholder="e.g. Erode / Coimbatore / Salem"
                    value={formData.hometown}
                    onChange={handleChange}
                  />
                </div>

                {/* Photo Upload */}
                <div className="col-12">
                  <label className="admin-form-label">Candidate Photograph</label>
                  <input
                    type="file"
                    className="admin-form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="admin-form-hint">Upload formal passport size photo (JPG, PNG).</div>
                </div>

                {/* Success Story / Mentorship Advice */}
                <div className="col-12">
                  <label className="admin-form-label">Success Strategy & Mentor's Note</label>
                  <textarea
                    rows="3"
                    className="admin-form-control"
                    name="story"
                    placeholder="Share how regular test series, Samacheer Kalvi books, and mentor sessions helped crack the exam."
                    value={formData.story}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Submit Action */}
                <div className="col-12 pt-3 border-top mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/Achivers-View')}
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
                        Registering Achiever...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-award me-1"></i> Publish to Hall of Fame
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

export default AchieversForm;
