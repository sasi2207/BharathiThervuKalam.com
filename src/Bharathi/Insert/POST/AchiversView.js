import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { achieversApi, DEFAULT_ACHIEVERS } from '../../Api/Api';
import '../../Admin/AdminDashboard.css';

const AchiversView = () => {
  const [achievers, setAchievers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAchiever, setCurrentAchiever] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    posting: '',
    department: '',
    exam: '',
    rank: '',
  });

  // Load merged list
  useEffect(() => {
    const loadAchievers = async () => {
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem('bharathi_custom_achievers') || '[]');
      } catch (e) {}

      let serverData = [];
      try {
        const res = await achieversApi.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          serverData = res.data;
        } else {
          serverData = DEFAULT_ACHIEVERS;
        }
      } catch (e) {
        serverData = DEFAULT_ACHIEVERS;
      }

      // Merge and normalize fields
      const combined = [...custom, ...serverData].map((a) => ({
        ...a,
        displayName: a.name || a.syllabus || 'Candidate',
        displayPosting: a.posting || a.paper || 'State Service Officer',
        displayDept: a.department || a.subject || 'Government of Tamil Nadu',
        displayExam: a.exam || 'TNPSC / TNUSRB',
        displayRank: a.rank || 'Selected Candidate',
      }));

      // Deduplicate by ID
      const seen = new Set();
      const unique = combined.filter((item) => {
        if (!item || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      setAchievers(unique);
    };

    loadAchievers();
  }, []);

  // Filter
  const filtered = achievers.filter((a) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (a.displayName && a.displayName.toLowerCase().includes(q)) ||
      (a.displayPosting && a.displayPosting.toLowerCase().includes(q)) ||
      (a.displayDept && a.displayDept.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'group1') return (a.category === 'group1' || a.displayExam.includes('Group I') || a.displayPosting.includes('DSP'));
    if (categoryFilter === 'group2') return (a.category === 'group2' || a.displayExam.includes('Group II'));
    if (categoryFilter === 'group4') return (a.category === 'group4' || a.displayExam.includes('Group IV') || a.displayPosting.includes('VAO'));
    if (categoryFilter === 'police') return (a.category === 'police' || a.displayExam.includes('TNUSRB') || a.displayPosting.includes('Sub-Inspector') || a.displayPosting.includes('SI'));

    return true;
  });

  const handleOpenEdit = (a) => {
    setCurrentAchiever(a);
    setFormData({
      name: a.displayName,
      posting: a.displayPosting,
      department: a.displayDept,
      exam: a.displayExam,
      rank: a.displayRank,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!currentAchiever) return;

    const updated = achievers.map((a) =>
      a.id === currentAchiever.id
        ? {
            ...a,
            displayName: formData.name,
            name: formData.name,
            displayPosting: formData.posting,
            posting: formData.posting,
            displayDept: formData.department,
            department: formData.department,
            displayExam: formData.exam,
            exam: formData.exam,
            displayRank: formData.rank,
            rank: formData.rank,
          }
        : a
    );

    setAchievers(updated);
    setShowEditModal(false);

    try {
      localStorage.setItem('bharathi_custom_achievers', JSON.stringify(updated));
    } catch (e) {}

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Achiever record has been updated.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Remove Achiever?',
      text: `Are you sure you want to remove "${name}" from Hall of Fame?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      const updated = achievers.filter((a) => a.id !== id);
      setAchievers(updated);
      try {
        localStorage.setItem('bharathi_custom_achievers', JSON.stringify(updated));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Candidate record removed.',
        timer: 1400,
        showConfirmButton: false,
      });
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
            </div>
          </div>

          <div className="admin-table-responsive">
            {filtered.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th style={{ width: '65px' }} className="text-center">Photo</th>
                    <th>Candidate & Honors</th>
                    <th>Posting & Department</th>
                    <th>Exam Stream</th>
                    <th>Year / Batch</th>
                    <th className="text-end" style={{ minWidth: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="admin-id-col">
                        <span className="fw-bold" style={{ color: '#e11d48' }}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="text-center">
                        {item.img ? (
                          <img
                            src={`data:image/jpeg;base64,${item.img}`}
                            alt={item.displayName}
                            className="rounded-circle border"
                            style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: '#fff1f2',
                              color: '#e11d48',
                              border: '1px solid #fecdd3',
                              fontSize: '0.85rem',
                            }}
                          >
                            {(item.displayName || 'B')[0]}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="admin-item-title">{item.displayName}</span>
                        <span className="admin-item-sub">
                          <i className="bi bi-geo-alt text-muted me-1"></i>
                          {item.hometown || 'Tamil Nadu'} · {item.displayRank}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark d-block">{item.displayPosting}</span>
                        <span className="small text-muted">{item.displayDept}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#334155',
                          }}
                        >
                          {item.displayExam}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{item.year || '2024'} Batch</span>
                      </td>
                      <td className="text-end">
                        <div className="admin-action-btn-group">
                          <button
                            type="button"
                            className="admin-btn-action edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Achiever"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDelete(item.id, item.displayName)}
                            title="Remove Record"
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
                <p className="admin-empty-desc">
                  {searchTerm
                    ? `No achievers matching "${searchTerm}".`
                    : 'No achievers registered in this category.'}
                </p>
                <Link to="/Achivers-Add" className="btn-primary-custom py-2 px-4">
                  <i className="bi bi-plus-lg me-1"></i> Register New Achiever
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Achiever Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
            <i className="bi bi-pencil-square text-danger me-2"></i>
            Edit Achiever Profile
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveEdit}>
          <Modal.Body className="p-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Candidate Name</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Posting Achieved</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.posting}
                onChange={(e) => setFormData({ ...formData, posting: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Department</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Exam Stream</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              />
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-form-label">Rank / Distinction</label>
              <input
                type="text"
                className="admin-form-control"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowEditModal(false)} className="border">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="btn-primary-custom">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default AchiversView;
