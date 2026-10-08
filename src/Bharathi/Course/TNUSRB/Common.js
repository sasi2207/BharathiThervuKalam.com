import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Group.css';

const Common = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const cadres = [
    'Police Constable Grade II (Armed Reserve - AR)',
    'Police Constable Grade II (Tamil Nadu Special Police - TSP)',
    'Jail Warder Grade II (Prison & Correctional Services)',
    'Fireman (Fire and Rescue Services Department)'
  ];

  return (
    <div className="course-detail-page">
      <section className="course-hero">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/#courses" className="text-warning text-decoration-none">Courses</Link>
            <span>/</span>
            <span className="text-light">TNUSRB Common Recruitment</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">TNUSRB Common Police Recruitment</h1>
          <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
            Mass recruitment examination for Police Constables (Grade II), Jail Warders, and Firemen across Tamil Nadu.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/Student-Register" className="btn-gold-custom">
              <i className="bi bi-pencil-square"></i>
              <span>Join Constable Batch</span>
            </Link>
            <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
              <i className="bi bi-calendar3"></i>
              <span>Test Schedules</span>
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
            Exam Pattern & Marks
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'physical' ? 'active' : ''}`}
            onClick={() => setActiveTab('physical')}
          >
            Physical Criteria & PET
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="academic-card mb-4">
                <h4 className="mb-3">About Common Police Recruitment</h4>
                <p>
                  Conducted by TNUSRB to recruit the core constabulary foundation for the Tamil Nadu Police, Prison, and Fire and Rescue departments. Open to candidates with a minimum educational qualification of 10th standard pass.
                </p>
              </div>

              <div className="academic-card">
                <h4 className="mb-3">Posts Covered</h4>
                <div className="row g-2">
                  {cadres.map((cadre, idx) => (
                    <div className="col-12 col-md-6" key={idx}>
                      <div className="posting-chip">
                        <i className="bi bi-shield-shaded text-warning"></i>
                        <span>{cadre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="academic-card bg-light">
                <div className="card-kicker">Summary</div>
                <h5 className="mb-3">Constable Details</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Qualification:</span>
                  <strong>10th (SSLC Pass)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Age Limit:</span>
                  <strong>18 to 26+ Years</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Written Exam:</span>
                  <strong>70 Marks (80 Min)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 small">
                  <span className="text-muted">Physical PET:</span>
                  <strong>24 Marks (Stars)</strong>
                </div>

                <div className="mt-4">
                  <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                    Join Common Batch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheme' && (
          <div className="academic-card">
            <h4 className="mb-3">Written Examination Pattern</h4>
            <div className="table-responsive">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Subjects</th>
                    <th>Questions</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Part I</strong></td>
                    <td>Tamil Language Eligibility Test (SSLC Standard)</td>
                    <td>80 Questions</td>
                    <td>Qualifying (Min. 40% / 32 Marks)</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (General)</strong></td>
                    <td>General Knowledge (History, Geography, Science, Current Affairs)</td>
                    <td>45 Questions</td>
                    <td>45 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (Psychology)</strong></td>
                    <td>Psychology, Logical Analysis, Numerical Ability</td>
                    <td>25 Questions</td>
                    <td>25 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Physical PET</strong></td>
                    <td>Rope Climbing, Long Jump, 100m/400m Run</td>
                    <td>-</td>
                    <td>24 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Special Marks</strong></td>
                    <td>NCC, NSS, Sports Certificates</td>
                    <td>-</td>
                    <td>6 Marks</td>
                  </tr>
                  <tr className="bg-light">
                    <td colSpan="3"><strong>Total Merit Marks</strong></td>
                    <td><strong>100 Marks</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="academic-card">
            <h4 className="mb-3">Physical Standards & Endurance</h4>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h6 className="fw-bold mb-2">Height Requirements:</h6>
                <ul className="small text-muted ps-3 mb-3">
                  <li>Men (General/BC/MBC): <strong>170 cm</strong> | SC/ST: <strong>167 cm</strong></li>
                  <li>Women (General/BC/MBC): <strong>159 cm</strong> | SC/ST: <strong>157 cm</strong></li>
                </ul>
              </div>
              <div className="col-12 col-md-6">
                <h6 className="fw-bold mb-2">Chest Measurement (Men):</h6>
                <p className="small text-muted mb-0">
                  Normal: <strong>81 cm</strong> | Expanded: minimum <strong>86 cm</strong> (5 cm expansion mandatory).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Common;
