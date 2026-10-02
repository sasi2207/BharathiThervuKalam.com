import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../img1/Logo.png';
import '../AdminDashboard.css';

export default function Main() {
  const stats = [
    {
      label: 'Enrolled Candidates',
      value: '2,194',
      icon: 'bi-mortarboard',
      color: 'blue',
      sub: 'Active 2026 Batch',
    },
    {
      label: 'Civil Service Selections',
      value: '130+',
      icon: 'bi-trophy',
      color: 'amber',
      sub: 'DSP, Sub-Registrar & SI Ranks',
    },
    {
      label: 'Syllabus & Course Modules',
      value: '8 Streams',
      icon: 'bi-journal-bookmark',
      color: 'green',
      sub: 'TNPSC & TNUSRB Programs',
    },
    {
      label: 'Test Series Batches',
      value: '34 Tests',
      icon: 'bi-clipboard2-check',
      color: 'purple',
      sub: 'Saturday & Sunday Schedules',
    },
  ];

  const quickActions = [
    {
      title: 'Group I - Add',
      desc: 'Add prelims & mains syllabus papers',
      link: '/Group-I-Add',
      icon: 'bi-journal-plus',
      badge: 'TNPSC',
      color: '#0d9488',
    },
    {
      title: 'Group IV - Add',
      desc: 'Upload Samacheer revision syllabus',
      link: '/Group4-Add',
      icon: 'bi-journal-text',
      badge: 'TNPSC',
      color: '#0d9488',
    },
    {
      title: 'SI Joint Recruitment - Add',
      desc: 'Uniformed Services SI Taluk & AR scheme',
      link: '/Tnusrb-Add',
      icon: 'bi-shield-plus',
      badge: 'TNUSRB',
      color: '#d97706',
    },
    {
      title: 'SI Technical - Add',
      desc: 'ECE & Telecommunication paper upload',
      link: '/SI-Technical',
      icon: 'bi-cpu',
      badge: 'TNUSRB',
      color: '#d97706',
    },
    {
      title: 'Test Series - Add',
      desc: 'Upload mock test schedule or OMR scheme',
      link: '/Test-Add',
      icon: 'bi-calendar2-plus',
      badge: 'EXAMS',
      color: '#2563eb',
    },
    {
      title: 'Achievement - Add',
      desc: 'Celebrate state rankers and officers',
      link: '/Achivers-Add',
      icon: 'bi-award',
      badge: 'HONORS',
      color: '#e11d48',
    },
    {
      title: 'Student - Add',
      desc: 'Onboard new student application',
      link: '/Student',
      icon: 'bi-person-plus',
      badge: 'ADMISSIONS',
      color: '#059669',
    },
    {
      title: 'Staff - Add',
      desc: 'Register faculty mentor or academic staff',
      link: '/Staff',
      icon: 'bi-people',
      badge: 'FACULTY',
      color: '#4f46e5',
    },
  ];

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Welcome Executive Header */}
        <div className="admin-card p-4 p-md-5 mb-4" style={{ background: 'linear-gradient(135deg, #061126 0%, #0d234a 100%)', color: '#ffffff' }}>
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
                <i className="bi bi-shield-lock-fill"></i> Administrative Management Control Center
              </div>
              <h1 className="fw-bold mb-2 text-white" style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)' }}>
                பாரதி தேர்வுக்களம் — Master Dashboard
              </h1>
              <p className="mb-4" style={{ color: '#cbd5e1', maxWidth: '640px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Welcome, Administrator. Manage civil service exam curricula, police recruitment syllabi, weekly test batches, faculty mentoring panels, and student admissions from this unified command center.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/Student-Details" className="btn btn-warning fw-bold px-4 py-2 text-dark shadow-sm">
                  <i className="bi bi-people-fill me-1"></i> View Registered Candidates
                </Link>
                <Link to="/" className="btn btn-outline-light px-4 py-2 fw-semibold">
                  <i className="bi bi-box-arrow-up-right me-1"></i> Visit Public Academy Site
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-4 text-center text-lg-end">
              <img
                src={Logo}
                alt="Bharathi Academy"
                style={{ maxHeight: '140px', width: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}
              />
            </div>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="admin-stat-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="admin-stat-card">
              <div>
                <div className="admin-stat-val">{item.value}</div>
                <div className="admin-stat-lbl">{item.label}</div>
                <div className="small text-muted mt-1">{item.sub}</div>
              </div>
              <div className={`admin-stat-icon ${item.color}`}>
                <i className={`bi ${item.icon}`}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Launchpad Grid */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="fw-bold text-dark mb-0" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-grid-fill text-primary me-2"></i>
                Administrative Quick Actions
              </h3>
              <p className="text-muted small mb-0">Direct shortcuts to add curricula, test schedules, students, and staff records.</p>
            </div>
          </div>

          <div className="row g-3">
            {quickActions.map((action, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <Link
                  to={action.link}
                  className="card border-0 p-3 h-100 text-decoration-none shadow-sm transition-all"
                  style={{
                    backgroundColor: 'var(--canvas-surface, #ffffff)',
                    border: '1px solid var(--border-subtle, #e2e8f0)',
                    borderRadius: '12px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                      }}
                    >
                      <i className={`bi ${action.icon}`}></i>
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: action.color,
                        backgroundColor: `${action.color}10`,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {action.badge}
                    </span>
                  </div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.925rem' }}>
                    {action.title}
                  </h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78125rem' }}>
                    {action.desc}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Modules Directory & Overview */}
        <div className="row g-4">
          {/* TNPSC Module */}
          <div className="col-12 col-lg-6">
            <div className="admin-card h-100 mb-0">
              <div className="admin-card-header">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-mortarboard text-teal-600 me-2" style={{ color: '#0d9488' }}></i>
                    TNPSC Civil Services Curriculum
                  </h5>
                  <span className="small text-muted">Group I, Group II, Group II-A, Group IV & VAO</span>
                </div>
              </div>
              <div className="admin-card-body">
                <div className="list-group list-group-flush">
                  {[
                    { name: 'Group I Services', add: '/Group-I-Add', view: '/Group-I-View' },
                    { name: 'Group II Services', add: '/Group2-Add', view: '/Group2-View' },
                    { name: 'Group II-A Non-Interview', add: '/Group2A-Add', view: '/Group2A-View' },
                    { name: 'Group IV & VAO Exam', add: '/Group4-Add', view: '/Group4-View' },
                  ].map((item, i) => (
                    <div key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                      <div>
                        <span className="fw-bold text-dark d-block">{item.name}</span>
                        <span className="small text-muted">Complete syllabus, paper guide & notes</span>
                      </div>
                      <div className="d-flex gap-2">
                        <Link to={item.view} className="admin-btn-action edit">
                          <i className="bi bi-eye"></i> View
                        </Link>
                        <Link to={item.add} className="admin-btn-action download">
                          <i className="bi bi-plus-lg"></i> Add
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TNUSRB Module */}
          <div className="col-12 col-lg-6">
            <div className="admin-card h-100 mb-0">
              <div className="admin-card-header">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-shield-check text-warning me-2" style={{ color: '#d97706' }}></i>
                    TNUSRB Uniformed Services Programs
                  </h5>
                  <span className="small text-muted">Sub-Inspectors, Finger Print, Technical, Police Constables</span>
                </div>
              </div>
              <div className="admin-card-body">
                <div className="list-group list-group-flush">
                  {[
                    { name: 'Joint Recruitment (SIs & SO)', add: '/Tnusrb-Add', view: '/Tnusrb-View' },
                    { name: 'Sub-Inspector (Technical)', add: '/SI-Technical', view: '/SITechnical-View' },
                    { name: 'Sub-Inspector (Finger Print)', add: '/FingerPrint-Add', view: '/FingerPrint-View' },
                    { name: 'Common Recruitment (PC / Warder)', add: '/Common-Add', view: '/Common-View' },
                  ].map((item, i) => (
                    <div key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                      <div>
                        <span className="fw-bold text-dark d-block">{item.name}</span>
                        <span className="small text-muted">Uniformed services test pattern & guidelines</span>
                      </div>
                      <div className="d-flex gap-2">
                        <Link to={item.view} className="admin-btn-action edit">
                          <i className="bi bi-eye"></i> View
                        </Link>
                        <Link to={item.add} className="admin-btn-action download">
                          <i className="bi bi-plus-lg"></i> Add
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
