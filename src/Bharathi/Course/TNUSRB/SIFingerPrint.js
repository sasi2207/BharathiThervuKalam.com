import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Group.css';

const SIFingerPrint = () => {
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
            <span className="text-light">TNUSRB SI Finger Print</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">TNUSRB Sub-Inspector of Police (Finger Print)</h1>
          <p className="text-light opacity-75 mb-4" style={{ maxWidth: '750px' }}>
            Forensic crime scene investigation cadre in the Single Digit Finger Print Bureau of the Tamil Nadu Police Department.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/Student-Register" className="btn-gold-custom">
              <i className="bi bi-pencil-square"></i>
              <span>Enroll in Fingerprint Batch</span>
            </Link>
            <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
              <i className="bi bi-file-earmark-text"></i>
              <span>View Test Schedule</span>
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
            Overview & Forensic Role
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'scheme' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheme')}
          >
            Exam Scheme & Syllabus
          </button>
          <button 
            className={`course-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            Eligibility & Criteria
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="academic-card mb-4">
                <h4 className="mb-3">About Finger Print Bureau Recruitment</h4>
                <p>
                  Sub-Inspectors of Police (Finger Print) are key scientific investigative officers. Working under the state Finger Print Bureau, they examine crime scenes, develop latent prints from weapon handles, vehicles, and burglary locations, and match them against criminal databases (NAFIS / AFIS).
                </p>
                <div className="p-3 bg-light rounded-3 mt-3">
                  <h6 className="fw-bold mb-1">Key Scientific Duties:</h6>
                  <ul className="mb-0 small text-muted ps-3">
                    <li>Latent print development using specialized chemical powders and lasers.</li>
                    <li>Expert testimony in Magistrate and Sessions Courts as forensic expert witnesses.</li>
                    <li>Digital classification and biometric database maintenance.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="academic-card bg-light">
                <div className="card-kicker">Quick Snapshot</div>
                <h5 className="mb-3">SI Finger Print Details</h5>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Degree:</span>
                  <strong>B.Sc (Science Discipline)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Age Limit:</span>
                  <strong>20 to 30 Years (General)</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom small">
                  <span className="text-muted">Pay Matrix:</span>
                  <strong>Level 13</strong>
                </div>
                <div className="d-flex justify-content-between py-2 small">
                  <span className="text-muted">Physical Endurance:</span>
                  <strong>Qualifying in Nature</strong>
                </div>

                <div className="mt-4">
                  <Link to="/Student-Register" className="btn-primary-custom w-100 text-center">
                    Enroll for Coaching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheme' && (
          <div className="academic-card">
            <h4 className="mb-3">Written Examination Scheme</h4>
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
                    <td>100 Questions</td>
                    <td>100 Marks (Min 40% to Qualify)</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (General Science)</strong></td>
                    <td>Physics, Chemistry, Biology (Degree Standard)</td>
                    <td>110 Questions</td>
                    <td>55 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Part II (GK & Reasoning)</strong></td>
                    <td>General Knowledge, Logical Reasoning, Aptitude</td>
                    <td>60 Questions</td>
                    <td>30 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Viva-Voce</strong></td>
                    <td>Interview & Certificate Verification</td>
                    <td>-</td>
                    <td>10 Marks</td>
                  </tr>
                  <tr>
                    <td><strong>Special Marks</strong></td>
                    <td>NCC, NSS, Sports</td>
                    <td>-</td>
                    <td>5 Marks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="academic-card">
            <h4 className="mb-3">Educational Qualification</h4>
            <p className="text-muted">
              Any Degree in Science from any University recognized by UGC. Candidates who have studied <strong>Physics, Chemistry, Botany, Zoology, Computer Science, or Forensic Science</strong> in their Bachelor's degree curriculum are eligible.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIFingerPrint;
