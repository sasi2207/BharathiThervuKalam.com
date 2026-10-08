import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Group.css';

export default function Group_2A() {
  const [activeTab, setActiveTab] = useState('overview');

  const postings = [
    'Assistant in Secretariat Service',
    'Assistant in Public Service Commission (TNPSC)',
    'Lower Division Clerk in Legislative Assembly Secretariat',
    'Assistant in Directorate of Vigilance and Anti-Corruption',
    'Assistant in Prison Department',
    'Assistant in Registration Department',
    'Assistant in Revenue Administration',
    'Assistant in School Education Department',
    'Accountant in Treasuries and Accounts Department'
  ];

  return (
    <div className="course-detail-page">
      <section className="course-hero overflow-hidden">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/#courses" className="text-warning text-decoration-none">Courses</Link>
            <span>/</span>
            <span className="text-light">TNPSC Group 2A</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">TNPSC Group II-A Services (Non-Interview Posts)</h1>
          <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
            Recruitment for key executive assistant cadres across all major Secretariat, Revenue, and Ministerial departments of Tamil Nadu.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/Student-Register" className="btn-gold-custom">
              <i className="bi bi-pencil-square"></i>
              <span>Enroll in Group 2A Batch</span>
            </Link>
            <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
              <i className="bi bi-file-earmark-pdf"></i>
              <span>Test Series Schedule</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="site-container py-5">
        <div className="course-nav-tabs">
          <button 
            className={`course-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Cadres
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'scheme' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheme')}
          >
            Scheme of Exam
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            Eligibility
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="academic-card mb-4">
                <h4 className="mb-3">Role & Scope of Group II-A</h4>
                <p>
                  Group II-A services are non-interview positions that offer stable, highly regarded ministerial and executive career paths with opportunities for steady departmental promotion to Gazetted officer grades (Under Secretary, Deputy Collector, District Registrar).
                </p>
              </div>

              <div className="academic-card">
                <h4 className="mb-3">Major Cadre Postings</h4>
                <div className="row g-2">
                  {postings.map((post, idx) => (
                    <div className="col-12 col-md-6" key={idx}>
                      <div className="posting-chip">
                        <i className="bi bi-check-circle text-warning"></i>
                        <span>{post}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="academic-card bg-light">
                <div className="card-kicker">Highlights</div>
                <h5 className="mb-3">Group 2A Snapshot</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Qualification:</span>
                  <strong>Any Degree</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Interview:</span>
                  <strong>No Interview</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Selection:</span>
                  <strong>Single Written Rank List</strong>
                </div>
                <div className="mt-4">
                  <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                    Join 2026 Test Batch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheme' && (
          <div className="academic-card">
            <h4 className="mb-3">Group II-A Examination Pattern</h4>
            <div className="table-responsive">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Subject</th>
                    <th>Questions</th>
                    <th>Total Marks</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Part A</strong></td>
                    <td>General Tamil / General English (SSLC Standard)</td>
                    <td>100 Questions</td>
                    <td>150 Marks</td>
                    <td rowSpan="3" className="align-middle"><strong>3 Hours</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Part B</strong></td>
                    <td>General Studies (Degree Standard)</td>
                    <td>75 Questions</td>
                    <td>112.5 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Part C</strong></td>
                    <td>Aptitude & Mental Ability (SSLC Standard)</td>
                    <td>25 Questions</td>
                    <td>37.5 Marks</td>
                  </tr>
                  <tr className="bg-light">
                    <td colSpan="2"><strong>Total</strong></td>
                    <td><strong>200 Questions</strong></td>
                    <td><strong>300 Marks</strong></td>
                    <td><strong>3 Hours</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="academic-card h-100">
                <h4 className="mb-3">Educational Qualification</h4>
                <p className="text-muted small">
                  Must possess a Bachelor’s Degree from any recognized university. Knowledge of Tamil is mandatory.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="academic-card h-100">
                <h4 className="mb-3">Age Criteria</h4>
                <p className="text-muted small">
                  Minimum age: <strong>18 Years</strong>. For SC/ST/MBC/BC candidates holding a degree, there is <strong>no upper age limit</strong>. For general candidates, the maximum age is <strong>32 Years</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
