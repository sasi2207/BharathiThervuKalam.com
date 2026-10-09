import React, { useState, useEffect } from 'react';
import './Custom.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { coursesApi } from './Api/Api';

const KEY_TO_ROUTE = {
  group1: '/Group1',
  group2: '/Group2',
  group2A: '/Group-2A',
  group4: '/Group4',
  siTechnical: '/Si-Recruitment',
  siFingerprint: '/Si-FingerFrint',
  commonRecruitment: '/Common',
  jointRecruitment: '/JointRecritment',
};

export default function CustomCarousel() {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const seen = new Set();
          const unique = [];
          res.data.forEach((c) => {
            const key = c.course_key || c.id;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(c);
            }
          });
          setCoursesList(unique);
        } else {
          setCoursesList([]);
        }
      } catch (err) {
        console.error('Failed to load courses for CustomCarousel:', err);
        setCoursesList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {coursesList.map((course, index) => {
            const link = KEY_TO_ROUTE[course.course_key] || `/${course.course_key || 'Group1'}`;
            const title = course.title || course.syllabus || 'Course';
            const description = course.subject || `Comprehensive syllabus and preparation guide for ${title}.`;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={course.id || index}>
                <div className="course-card d-flex align-items-center" data-aos={`zoom-in-${index % 2 === 0 ? 'right' : 'left'}`}>
                  <FontAwesomeIcon icon={faUser} className="course-icon me-3" />
                  <div>
                    <h5 className="course-title text-center">{title}</h5>
                    <p className="course-description">{description}</p>
                    <Link
                      to={link}
                      className="btn btn-primary d-flex justify-content-center"
                      onClick={() => { scrollToTop(); }}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
