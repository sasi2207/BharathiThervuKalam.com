import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facultyApi } from '../Api/Api';

const Faculty = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await facultyApi.getAll();
        const records = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setStaffData(records);
      } catch (err) {
        console.error('Failed to load faculty from database:', err);
        setError('Failed to fetch faculty profiles from database.');
        setStaffData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const displayList = staffData;

  return (
    <div className="faculty-page">
      <section className="course-hero">
        <div className="site-container">
          <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/About" className="text-warning text-decoration-none">About</Link>
            <span>/</span>
            <span className="text-light">Faculty & Mentors</span>
          </div>

          <h1 className="text-white mb-2 fw-bold">Faculty & Officer Mentors</h1>
          <p className="text-light opacity-75 mb-0" style={{ maxWidth: '750px' }}>
            Meet the serving officers and subject experts who dedicate their personal time to guide aspirants into Government Service.
          </p>
        </div>
      </section>

      <div className="site-container py-5">
        <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
          <div className="section-kicker">Guidance From The Field</div>
          <h2 className="section-title">Learn from Those Who Have Walked the Path</h2>
          <p className="section-subtitle mx-auto">
            Our faculty members have cracked the very examinations you are preparing for, bringing unmatched strategic clarity to every lecture.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading faculty profiles from database...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-people fs-1 d-block mb-2"></i>
            <p>No faculty profiles found in database.</p>
          </div>
        ) : (
          <div className="row g-4">
            {displayList.map((staff, idx) => (
              <div className="col-12 col-md-6 col-lg-3" key={staff.id || idx}>
                <div className="academic-card text-center h-100">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-4"
                    style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #0a192f 0%, #1e4b85 100%)' }}
                  >
                    {staff.name ? staff.name.charAt(0).toUpperCase() : 'M'}
                  </div>

                  <h5 className="mb-1 fw-bold">{staff.name}</h5>
                  <div className="card-kicker mb-2">{staff.designation || 'Faculty Mentor'}</div>
                  
                  <p className="small text-muted mb-3 flex-grow-1">
                    {staff.subject || staff.department || 'General Studies & Examination Strategy'}
                  </p>

                  {staff.phone && (
                    <div className="border-top pt-2 mt-auto small">
                      <a href={`tel:${staff.phone.replace(/[^0-9+]/g, '')}`} className="text-decoration-none text-secondary">
                        <i className="bi bi-telephone text-warning me-1"></i>
                        <span>{staff.phone}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faculty;
