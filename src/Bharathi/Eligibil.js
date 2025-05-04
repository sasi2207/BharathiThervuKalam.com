import React, { useEffect } from 'react';
import './Eligibil.css';
import group1 from './img/group1.jpg';
import group2 from './img/group2.jpg';
import group3 from './img/group3.jpg';
import group4 from './img/group4.jpg';

import 'aos/dist/aos.css';
import AOS from 'aos';
import 'bootstrap/dist/css/bootstrap.min.css';

const eligibilityData = [
  {
    postName: "TNPSC Group I Services",
    minAge: "21 Years",
    maxAgeSCST: "35 Years",
    maxAgeOthers: "30 Years",
    qualification: "Any Degree",
    image: group1
  },
  {
    postName: "TNPSC Group II Services",
    minAge: "21 Years",
    maxAgeSCST: "No Maximum Age Limit",
    maxAgeOthers: "30 Years",
    qualification: "Any Degree",
    image: group2
  },
  {
    postName: "TNPSC Group II A Services (Non-Interview post)",
    minAge: "21 Years",
    maxAgeSCST: "No Maximum Age Limit",
    maxAgeOthers: "30 Years",
    qualification: "Any Degree",
    image: group3
  },
  {
    postName: "TNPSC Group IV & VAO Exams",
    minAge: "21 Years",
    maxAgeSCST: "No Maximum Age Limit",
    maxAgeOthers: "No Maximum Age Limit",
    qualification: "10th Std",
    image: group4
  }
];

const Eligibil = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5" data-aos="fade-up">TNPSC Exams Eligibility</h2>

      {eligibilityData.map((item, index) => (
        <div className="row mb-5 align-items-center" data-aos="fade-up" key={index}>
          <div className={`col-md-6 mb-4 mb-md-0 ${index % 2 === 1 ? 'order-md-2' : ''}`}>
            <img src={item.image} alt={item.postName} className="img-fluid rounded shadow-sm w-100" />
          </div>
          <div className={`col-md-6 ${index % 2 === 1 ? 'order-md-1' : ''}`}>
            <div className="bg-light p-4 p-md-5 rounded shadow-sm h-100 d-flex flex-column justify-content-center">
              <h4 className="mb-3" style={{color:'orange'}}>{item.postName}</h4>
              <p><strong>Minimum Age:</strong> {item.minAge}</p>
              <p><strong>Maximum Age (SC/ST, MBC/DNC, BC, BCM & DW’s of all castes):</strong> {item.maxAgeSCST}</p>
              <p><strong>Maximum Age (Others):</strong> {item.maxAgeOthers}</p>
              <p><strong>Educational Qualification:</strong> {item.qualification}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Eligibil;
