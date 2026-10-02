import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Group.css';

const SITechnical = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="course-detail-page">
      <section className="course-hero">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/#courses" className="text-warning text-decoration-none">Courses</Link>
            <span>/</span>
            <span className="text-light">TNUSRB SI Technical</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">TNUSRB Sub-Inspector of Police (Technical)</h1>
          <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
            Recruitment for specialized technical cadre Sub-Inspectors in the Tamil Nadu Police Telecommunication and Wireless Wing.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/Student-Register" className="btn-gold-custom">
              <i className="bi bi-pencil-square"></i>
              <span>Enroll in SI Technical Batch</span>
            </Link>
            <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
              <i className="bi bi-calendar3"></i>
              <span>Test Batch Schedules</span>
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
            Overview & Role
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'scheme' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheme')}
          >
            Exam Scheme & Syllabus
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'physical' ? 'active' : ''}`}
            onClick={() => setActiveTab('physical')}
          >
            Physical Criteria & Age
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="academic-card mb-4">
                <h4 className="mb-3">About Sub-Inspector of Police (Technical)</h4>
                <p>
                  The Tamil Nadu Uniformed Services Recruitment Board (TNUSRB) conducts this direct recruitment for technical personnel in the Police Telecommunication Wing. Officers are responsible for modern VHF/UHF wireless communication networks, digital repeaters, cyber communication stations, and mobile command posts throughout Tamil Nadu.
                </p>
                <div className="p-3 bg-light rounded-3 mt-3">
                  <h6 className="fw-bold mb-1">Key Responsibilities:</h6>
                  <ul className="mb-0 small text-muted ps-3">
                    <li>Maintenance and security of police radio telecommunication channels.</li>
                    <li>Operation of satellite terminals and modern GPS vehicular tracking stations.</li>
                    <li>Technical liaison with state disaster emergency response command hubs.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="academic-card bg-light">
                <div className="card-kicker">Quick Snapshot</div>
                <h5 className="mb-3">SI Technical Info</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Qualification:</span>
                  <strong>Diploma in ECE / B.E</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Age Limit:</span>
                  <strong>20 to 30 Years</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Pay Scale:</span>
                  <strong>Level 13 (Rs. 36,900 - 1,16,600)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 small">
                  <span className="text-muted">Viva Voce:</span>
                  <strong>10 Marks</strong>
                </div>

                <div className="mt-4">
                  <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                    Register for SI Technical
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheme' && (
          <div className="academic-card">
            <h4 className="mb-3">Selection Stages & Examination Scheme</h4>
            <div className="table-responsive">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Subjects</th>
                    <th>Marks</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Part I</strong></td>
                    <td>Tamil Language Eligibility Test</td>
                    <td>100 Marks</td>
                    <td>Objective (Qualifying min. 40 Marks)</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (Technical)</strong></td>
                    <td>Electronics & Communication Engineering / Electrical & Electronics</td>
                    <td>50 Marks</td>
                    <td>Degree/Diploma Technical Standard (70 MCQs)</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (General)</strong></td>
                    <td>General Knowledge & Current Affairs</td>
                    <td>30 Marks</td>
                    <td>History, Geography, Science, Polity (40 MCQs)</td>
                  </tr>
                  <tr>
                    <td><strong>Part III</strong></td>
                    <td>Viva-Voce / Interview</td>
                    <td>10 Marks</td>
                    <td>Personality & Technical Aptitude</td>
                  </tr>
                  <tr>
                    <td><strong>Special Marks</strong></td>
                    <td>NCC / NSS / Sports</td>
                    <td>5 Marks</td>
                    <td>Valid Certificates</td>
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
                <div className="table-responsive">
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Men (Height)</th>
                        <th>Women (Height)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>OC / BC / BCM / MBC</strong></td>
                        <td>163 cm</td>
                        <td>154 cm</td>
                      </tr>
                      <tr>
                        <td><strong>SC / SC(A) / ST</strong></td>
                        <td>160 cm</td>
                        <td>152 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="small text-muted mt-2">
                  Chest Measurement (Men): Normal minimum 80 cm with minimum 5 cm expansion.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="academic-card h-100">
                <h4 className="mb-3">Age Relaxation</h4>
                <div className="table-responsive">
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Community</th>
                        <th>Upper Age Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>General / OC</strong></td>
                        <td>30 Years</td>
                      </tr>
                      <tr>
                        <td><strong>BC / BCM / MBC / DNC</strong></td>
                        <td>32 Years</td>
                      </tr>
                      <tr>
                        <td><strong>SC / SC(A) / ST</strong></td>
                        <td>35 Years</td>
                      </tr>
                      <tr>
                        <td><strong>Destitute Widow / Ex-Servicemen</strong></td>
                        <td>37 / 47 Years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SITechnical;
