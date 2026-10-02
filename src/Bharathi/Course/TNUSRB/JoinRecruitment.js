import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Group.css';

const JointRecruitmentDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const cadres = [
    'Sub-Inspector of Police (Taluk)',
    'Sub-Inspector of Police (Armed Reserve - AR)',
    'Sub-Inspector of Police (Tamil Nadu Special Police - TSP)',
    'Station Officers (Fire and Rescue Services Department)'
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
            <span className="text-light">TNUSRB Joint Recruitment</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">TNUSRB Joint Recruitment (SIs & SOs)</h1>
          <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
            Combined direct recruitment for Sub-Inspectors of Police (Taluk, AR, TSP) and Station Officers (Fire and Rescue Services).
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/Student-Register" className="btn-gold-custom">
              <i className="bi bi-pencil-square"></i>
              <span>Join SI Police Batch</span>
            </Link>
            <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
              <i className="bi bi-file-earmark-pdf"></i>
              <span>Download Test Timetable</span>
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
            Physical Endurance & PET
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="academic-card mb-4">
                <h4 className="mb-3">About the Joint Recruitment Examination</h4>
                <p>
                  The TNUSRB Combined Sub-Inspector examination is the premier entry point to the uniformed police leadership cadre in Tamil Nadu. Selected officers head local police stations as Station House Officers (SHO) in the Taluk wing, manage reserve police battalions, or lead tactical fire response stations.
                </p>
              </div>

              <div className="academic-card">
                <h4 className="mb-3">Participating Services</h4>
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
                <div className="card-kicker">Key Information</div>
                <h5 className="mb-3">SI Police Summary</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Degree:</span>
                  <strong>Any Bachelor Degree</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Age Limit:</span>
                  <strong>20 to 30 Years</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Written Marks:</span>
                  <strong>70 Marks (140 Qs)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 small">
                  <span className="text-muted">Physical PET:</span>
                  <strong>15 Marks (Stars)</strong>
                </div>

                <div className="mt-4">
                  <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                    Enroll for Joint SI Batch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheme' && (
          <div className="academic-card">
            <h4 className="mb-3">Complete Examination Structure</h4>
            <div className="table-responsive">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Subjects / Content</th>
                    <th>Questions / Criteria</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Part I</strong></td>
                    <td>Tamil Language Eligibility Test</td>
                    <td>100 Questions (SSLC Standard)</td>
                    <td>Qualifying (Min. 40 Marks)</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (Main Written)</strong></td>
                    <td>General Knowledge (40 Marks) + Psychology / Logical Reasoning (30 Marks)</td>
                    <td>140 Objective Questions (0.5 mark each)</td>
                    <td>70 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Physical Efficiency (PET)</strong></td>
                    <td>Rope Climbing, Long Jump/High Jump, 100m/400m Run</td>
                    <td>Evaluated on Stars (Single/Double)</td>
                    <td>15 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Viva-Voce</strong></td>
                    <td>Personal Interview by Police Board</td>
                    <td>Interview & Service Aptitude</td>
                    <td>10 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Special Marks</strong></td>
                    <td>NCC / NSS / National Sports</td>
                    <td>Maximum 5 Marks</td>
                    <td>5 Marks</td>
                  </tr>
                  <tr className="bg-light">
                    <td colSpan="3"><strong>Total Merit Score</strong></td>
                    <td><strong>100 Marks</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="academic-card h-100">
                <h4 className="mb-3">Physical Measurement Standards</h4>
                <p className="small text-muted mb-2"><strong>Height (Men):</strong></p>
                <ul className="small text-muted ps-3 mb-3">
                  <li>OC, BC, BC(M), MBC/DNC: Minimum <strong>170 cm</strong></li>
                  <li>SC, SC(A), ST: Minimum <strong>167 cm</strong></li>
                </ul>
                <p className="small text-muted mb-2"><strong>Height (Women):</strong></p>
                <ul className="small text-muted ps-3">
                  <li>OC, BC, BC(M), MBC/DNC: Minimum <strong>159 cm</strong></li>
                  <li>SC, SC(A), ST: Minimum <strong>157 cm</strong></li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="academic-card h-100">
                <h4 className="mb-3">Physical Efficiency Test (PET) Events</h4>
                <p className="small text-muted mb-2"><strong>Men Candidates (3 Events):</strong></p>
                <ol className="small text-muted ps-3 mb-3">
                  <li>Rope Climbing (5.0m for 1 Star, 6.0m for 2 Stars)</li>
                  <li>Long Jump (3.80m / 4.50m) OR High Jump (1.20m / 1.40m)</li>
                  <li>100m Run (15.00s / 13.50s) OR 400m Run (80.00s / 70.00s)</li>
                </ol>
                <p className="small text-muted mb-0">
                  Total available: 15 marks. 2 Stars = 5 marks per event; 1 Star = 2 marks per event.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JointRecruitmentDetails;
