import React, { useState, useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Eligibil.css';
import group3 from './img/group3.jpg';
import group4 from './img/group4.jpg';
import { eligibilityApi } from './Api/Api';

const Eligibil = () => {
  const [eligibilityList, setEligibilityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchEligibility = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await eligibilityApi.getAll();
        if (Array.isArray(res.data)) {
          setEligibilityList(res.data);
        } else {
          setEligibilityList([]);
        }
      } catch (err) {
        console.error('Error fetching eligibility data:', err);
        setError('Failed to load eligibility requirements from database.');
        setEligibilityList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, []);

  const getImageForIndex = (index, customImage) => {
    if (customImage && !customImage.startsWith('/group')) return customImage;
    if (index % 2 === 0) return group3;
    return group4;
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5" data-aos="fade-up">TNPSC Exams Eligibility</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading exam eligibility requirements dynamically from database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-warning text-center" role="alert">
          {error}
        </div>
      ) : eligibilityList.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No eligibility criteria records available in database.</p>
        </div>
      ) : (
        eligibilityList.map((item, index) => (
          <div className="row mb-5 align-items-center" data-aos="fade-up" key={item.id || index}>
            <div className={`col-md-6 mb-4 mb-md-0 ${index % 2 === 1 ? 'order-md-2' : ''}`}>
              <img
                src={getImageForIndex(index, item.image)}
                alt={item.postName}
                className="img-fluid rounded shadow-sm w-100"
              />
            </div>
            <div className={`col-md-6 ${index % 2 === 1 ? 'order-md-1' : ''}`}>
              <div className="bg-light p-4 p-md-5 rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                <h4 className="mb-3" style={{ color: 'orange' }}>{item.postName}</h4>
                <p><strong>Minimum Age:</strong> {item.minAge}</p>
                <p><strong>Maximum Age (SC/ST, MBC/DNC, BC, BCM & DW’s of all castes):</strong> {item.maxAgeSCST}</p>
                <p><strong>Maximum Age (Others):</strong> {item.maxAgeOthers}</p>
                <p><strong>Educational Qualification:</strong> {item.qualification}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Eligibil;
