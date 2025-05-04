import React, { useEffect } from 'react';
import './Custom.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';

export default function CustomCarousel() {
  const location = useLocation();

  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="container ">
      <hr className="line" />
      
      <div className="marquee-container">
        <div className="marquee-text">Best Coaching Institute In Tamil Nadu</div>
      </div>
     
      <hr className="line" />
      
      <h1 className="text-center my-4" id="title-1"> Course Details</h1>
      
      <div className="row g-4">
        {[
          { title: "Group-I", link: "/Group1", description: "For more Group-I exam details." },
          { title: "Group-II", link: "/Group2", description: "For more Group-II exam details." },
          { title: "Group-II-A", link: "/Group-2A", description: "For more Group-II-A exam details." },
          { title: "Group-IV", link: "/Group4", description: "For more Group-IV exam details." },
        
          { title: "SI (Technical)", link: "/Si-Recruitment", description: "For more SI (Technical) exam details." },
          { title: "SI (Finger Print)", link: "/Si-FingerFrint", description: "For more SI (Finger Print) exam details." },
          { title: "Common Recruitment", link: "/Common", description: "For more Common Recruitment exam details." },
          { title: "Joint Recruitment (SIs & SO)", link: "/JointRecritment", description: "For more Joint Recruitment (SIs & SO) exam details." }
        ].map((course, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className="course-card d-flex align-items-center" data-aos={`zoom-in-${index % 2 === 0 ? 'right' : 'left'}`}>
              <FontAwesomeIcon icon={faUser} className="course-icon me-3" />
              <div>
                <h5 className="course-title text-center">{course.title}</h5>
                <p className="course-description">{course.description}</p>
                <Link to={course.link} className="btn btn-primary d-flex justify-content-center"  onClick={() => { scrollToTop();  }}>Read More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
