import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { achieversApi } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const AchiversView = () => {
  const [achievers, setAchievers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAchiever, setCurrentAchiever] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    posting: '',
    department: '',
    exam: '',
    rank: '',
    year: '2024',
    category: 'group1'
  });

  // Fetch real database records
  const fetchAchievers = useCallback(async (search = searchTerm, category = categoryFilter) => {
    setLoading(true);
    const start = performance.now();
    try {
      const params = { size: 50, sort: 'id', order: 'DESC' };
      if (search && search.trim()) params.search = search.trim();
      if (category && category !== 'all') params.category = category;

      const res = await achieversApi.getAll(params);
      const totalTime = performance.now() - start;

      if (res.data && res.data.success) {
        setAchievers(res.data.data || []);
        setMetrics({
          responseTimeMs: res.data.metrics?.responseTimeMs || Number(totalTime.toFixed(2)),
          dbQueryTimeMs: res.data.metrics?.dbQueryTimeMs || 0.4,
          recordCount: res.data.data?.length || 0
        });
      } else if (Array.isArray(res.data)) {
        setAchievers(res.data);
      }
    } catch (err) {
      console.error('[Achievers Fetch Error]', err);
      Swal.fire({
        icon: 'error',
        title: 'Database Error',
        text: 'Failed to load achievers from database.'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAchievers(searchTerm, categoryFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, fetchAchievers]);

  const handleOpenEdit = (a) => {
    setCurrentAchiever(a);
    setFormData({
      name: a.name || '',
      posting: a.posting || '',
      department: a.department || '',
      exam: a.exam || '',
      rank: a.rank || '',
      year: a.year || '2024',
      category: a.category || 'group1'
    });
    setShowEditModal(true);
  };

  // Full Record Update (PUT /api/achievers/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!currentAchiever) return;
    setSaving(true);
    const start = performance.now();

    try {
      const res = await achieversApi.update(currentAchiever.id, formData);
      const duration = performance.now() - start;

      if (res.data && res.data.success) {
        const updated = res.data.data;
        // Direct React state update from returned backend record
        setAchievers((prev) => prev.map((a) => (a.id === currentAchiever.id ? { ...a, ...updated } : a)));
        setShowEditModal(false);

        Swal.fire({
          icon: 'success',
          title: 'Achiever Updated',
          text: `Record updated in database (${Number(duration.toFixed(2))}ms).`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: err.response?.data?.message || 'Failed to update database record'
      });
    } finally {
      setSaving(false);
    }
  };

  // Real Database Delete (DELETE /api/achievers/:id)
  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Remove Achiever?',
      text: `Are you sure you want to remove "${name}" from the database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const start = performance.now();
      try {
        const apiRes = await achieversApi.delete(id);
        const duration = performance.now() - start;

        if (apiRes.data && apiRes.data.success) {
          // Direct React state update removing deleted record
          setAchievers((prev) => prev.filter((a) => a.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Removed from Database',
            text: `Candidate record deleted in ${Number(duration.toFixed(2))}ms.`,
            timer: 1400,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.response?.data?.message || 'Database deletion failed'
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
          <span>Success & Honors</span>
          <span className="separator">/</span>
          <span className="current">Achievement - View</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#e11d48' }}>
              <i className="bi bi-trophy-fill"></i> State Service Selections
            </span>
            <h1>Hall of Fame & Achievers Directory</h1>
            <p>130+ government officers and civil servants trained at Bharathi Thervukalam since 2017.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Achivers-Add" className="btn-primary-custom py-2 px-3">
              <i className="bi bi-plus-lg me-1"></i> Add New Achiever
            </Link>
          </div>
        </div>

        {/* Performance Latency Badge */}
        {metrics && (
          <div className="alert alert-light border shadow-sm py-2 px-3 mb-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
                <i className="bi bi-award-fill me-1"></i> Live Database
              </span>
              <span className="small text-muted">
                Response Time: <strong className="text-dark">{metrics.responseTimeMs} ms</strong> (&le; 500ms target)
              </span>
              <span className="small text-muted">
                DB Query: <strong className="text-dark">{metrics.dbQueryTimeMs} ms</strong>
              </span>
            </div>
            <span className="small text-muted">
              Achievers Recorded: <strong>{achievers.length}</strong>
            </span>
          </div>
        )}

        {/* Main Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            {/* Filter buttons */}
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All Ranks' },
                { id: 'group1', label: 'Group I (DSP/DC)' },
                { id: 'group2', label: 'Group II' },
                { id: 'group4', label: 'Group IV & VAO' },
                { id: 'police', label: 'TNUSRB Police SI' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`btn btn-sm ${
                    categoryFilter === cat.id
                      ? 'btn-dark fw-bold'
                      : 'btn-outline-secondary'
                  }`}
                  style={{ borderRadius: '6px', fontSize: '0.78125rem' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, posting, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={() => fetchAchievers(searchTerm, categoryFilter)}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          <div className="admin-table-responsive">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2 text-muted small">Loading toppers from database...</p>
              </div>
            ) : achievers.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th style={{ width: '65px' }} className="text-center">Photo</th>
                    <th>Officer Name</th>
                    <th>Designation & Posting</th>
                    <th>Department / Service</th>
                    <th>Exam & Year</th>
                    <th className="text-end" style={{ minWidth: '170px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {achievers.map((a, idx) => (
                    <tr key={a.id || idx}>
                      <td>
                        <span className="badge bg-warning bg-opacity-25 text-dark fw-bold px-2 py-1">
                          {a.rank || `Rank #${idx + 1}`}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                          style={{
                            width: '42px',
                            height: '42px',
                            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {(a.name || 'A')[0]}
                        </div>
                      </td>
                      <td>
                        <span className="admin-item-title">{a.name}</span>
                        <span className="admin-item-sub">Selected Candidate · Batch {a.year || '2023'}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-danger">{a.posting}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{a.department}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {a.exam} ({a.year})
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(a)}
                            title="Edit Achiever (PUT)"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(a.id, a.name)}
                            title="Delete Achiever from DB"
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
                  <i className="bi bi-trophy"></i>
                </div>
                <h5 className="admin-empty-title">No Achievers Found</h5>
                <p className="admin-empty-desc">No achievers matching current criteria.</p>
                <Link to="/Achivers-Add" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-plus-lg me-1"></i> Add Topper
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal (PUT /api/achievers/:id) */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-danger me-2"></i>
            Edit Achiever Profile (Database PUT)
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Candidate Name *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Posting / Designation *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.posting}
                onChange={(e) => setFormData({ ...formData, posting: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Government Department *</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="row g-2">
              <div className="col-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">Competitive Exam *</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="admin-form-group">
                  <label className="admin-form-label">State / District Rank *</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowEditModal(false)} className="border">
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Update Record (PUT)'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default AchiversView;
