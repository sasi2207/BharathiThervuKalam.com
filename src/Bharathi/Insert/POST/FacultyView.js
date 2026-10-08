import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { facultyApi } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const FacultyView = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    paper: '',
    subject: '',
    designation: '',
    experience: '',
    phone: '',
    email: '',
    category: 'TNPSC'
  });
  const [saving, setSaving] = useState(false);

  // Fetch real records from database
  const fetchFaculty = useCallback(async (search = searchTerm) => {
    setLoading(true);
    const start = performance.now();
    try {
      const params = { size: 50, sort: 'id', order: 'ASC' };
      if (search && search.trim()) params.search = search.trim();

      const response = await facultyApi.getAll(params);
      const totalTime = performance.now() - start;

      if (response.data && response.data.success) {
        setFacultyList(response.data.data || []);
        setMetrics({
          responseTimeMs: response.data.metrics?.responseTimeMs || Number(totalTime.toFixed(2)),
          dbQueryTimeMs: response.data.metrics?.dbQueryTimeMs || 0.4,
          recordCount: response.data.data?.length || 0
        });
      } else if (Array.isArray(response.data)) {
        setFacultyList(response.data);
      }
    } catch (error) {
      console.error('[FacultyView Fetch Error]', error);
      Swal.fire({
        icon: 'error',
        title: 'Database Error',
        text: 'Failed to fetch faculty mentors from database.'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchFaculty]);

  const handleOpenEdit = (faculty) => {
    setCurrentFaculty(faculty);
    setFormData({
      name: faculty.name || faculty.username || '',
      paper: faculty.paper || '',
      subject: faculty.subject || '',
      designation: faculty.designation || 'Academic Mentor',
      experience: faculty.experience || 'State Service Specialist',
      phone: faculty.phone || faculty.phoneNumber || '+91 7338757194',
      email: faculty.email || '',
      category: faculty.category || 'TNPSC'
    });
    setShowModal(true);
  };

  // Full Record Update (PUT /api/faculty/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!currentFaculty) return;
    setSaving(true);
    const start = performance.now();

    try {
      const res = await facultyApi.update(currentFaculty.id, formData);
      const duration = performance.now() - start;

      if (res.data && res.data.success) {
        const updated = res.data.data;
        // Direct React state update from returned backend record
        setFacultyList((prev) => prev.map((f) => (f.id === currentFaculty.id ? { ...f, ...updated } : f)));
        setShowModal(false);

        Swal.fire({
          icon: 'success',
          title: 'Mentor Updated',
          text: `Faculty mentor updated in database (${Number(duration.toFixed(2))}ms).`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: err.response?.data?.message || 'Database update failed'
      });
    } finally {
      setSaving(false);
    }
  };

  // Real Database Delete (DELETE /api/faculty/:id)
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Remove Faculty Mentor?',
      text: `Are you sure you want to remove ${name} from the database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const start = performance.now();
      try {
        const res = await facultyApi.delete(id);
        const duration = performance.now() - start;

        if (res.data && res.data.success) {
          // Direct React state update removing deleted ID
          setFacultyList((prev) => prev.filter((f) => f.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Removed from Database',
            text: `Mentor removed in ${Number(duration.toFixed(2))}ms.`,
            timer: 1400,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.response?.data?.message || 'Failed to remove faculty member.'
        });
      }
    }
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
          <span className="current">Faculty - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#4f46e5' }}>
              <i className="bi bi-person-workspace"></i> Chief Mentors & Officers
            </span>
            <h1>Faculty & Mentorship Council</h1>
            <p>Distinguished serving officers and expert educators mentoring Bharathi Thervukalam aspirants.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Faculty-Add" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-person-plus me-1"></i> Add Faculty Mentor
            </Link>
          </div>
        </div>

        {/* Performance Metrics Banner */}
        {metrics && (
          <div className="alert alert-light border shadow-sm py-2 px-3 mb-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                <i className="bi bi-cpu-fill me-1"></i> Live Database
              </span>
              <span className="small text-muted">
                Response Time: <strong className="text-dark">{metrics.responseTimeMs} ms</strong> (&le; 500ms target)
              </span>
              <span className="small text-muted">
                DB Query: <strong className="text-dark">{metrics.dbQueryTimeMs} ms</strong>
              </span>
            </div>
            <span className="small text-muted">
              Active Mentors: <strong>{facultyList.length}</strong>
            </span>
          </div>
        )}

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="admin-stat-icon purple" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                <i className="bi bi-mortarboard"></i>
              </span>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Mentor Profiles
                </h5>
                <span className="admin-counter-text">
                  Total <b>{facultyList.length}</b> mentors registered in database
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search faculty by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={() => fetchFaculty(searchTerm)}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          <div className="admin-table-responsive">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted small">Loading faculty mentors from database...</p>
              </div>
            ) : facultyList.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th style={{ width: '65px' }} className="text-center">Photo</th>
                    <th>Mentor & Designation</th>
                    <th>Papers Mentored</th>
                    <th>Subject Expertise</th>
                    <th>Phone / Guidance</th>
                    <th className="text-end" style={{ minWidth: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyList.map((f, idx) => (
                    <tr key={f.id || idx}>
                      <td className="admin-id-col">#{idx + 1}</td>
                      <td className="text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: '42px',
                            height: '42px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.85rem',
                          }}
                        >
                          {(f.name || f.username || 'M')[0]}
                        </div>
                      </td>
                      <td>
                        <span className="admin-item-title">{f.name || f.username}</span>
                        <span className="admin-item-sub">{f.designation || 'Chief Mentor'}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-secondary">{f.paper || 'All Papers'}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{f.subject}</span>
                      </td>
                      <td>
                        <span className="small fw-semibold text-dark">
                          {f.phone || '+91 7338757194'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(f)}
                            title="Edit Faculty (PUT)"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(f.id, f.name || f.username)}
                            title="Delete Faculty from DB"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">
                  <i className="bi bi-person-x"></i>
                </div>
                <h5 className="admin-empty-title">No Faculty Members Found</h5>
                <p className="admin-empty-desc">No faculty records matching your search query.</p>
                <Link to="/Faculty-Add" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-person-plus me-1"></i> Register Faculty Mentor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Faculty Modal (PUT /api/faculty/:id) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Faculty Mentor (Database PUT)
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Mentor Name *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Designation *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Papers Assigned *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.paper}
                onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Contact</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Subject & Syllabus Areas *</label>
              <textarea
                rows="3"
                className="admin-form-control"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowModal(false)} className="border">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving} className="btn-primary-custom">
              {saving ? 'Updating DB...' : 'Save Changes (PUT)'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyView;
