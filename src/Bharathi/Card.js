import './Card.css';
import Logo from './img1/Logo.png';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'bootstrap/dist/css/bootstrap.min.css';
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

export default function Card() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Deduplicate by course_key to show primary course tiles
          const seen = new Set();
          const unique = [];
          res.data.forEach((c) => {
            const k = c.course_key || c.id;
            if (!seen.has(k)) {
              seen.add(k);
              unique.push(c);
            }
          });
          setCourses(unique);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to load courses dynamically:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mycard">
      {courses.map((course, idx) => {
        const link = KEY_TO_ROUTE[course.course_key] || `/${course.course_key || 'Group1'}`;
        const aosEffect = idx % 3 === 0 ? 'fade-right' : idx % 3 === 1 ? 'fade-zoom-in' : 'fade-left';

        return (
          <div
            key={course.id || idx}
            className="card custom-background shadow-lg"
            data-aos={aosEffect}
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
          >
            <img src={Logo} alt={course.title || 'Bharathi Course'} className="card-img" />
            <div className="card-content">
              <h3 className="card-title">{course.title || course.syllabus || 'Competitive Course'}</h3>
              <Link to={link} className="card-link">Read More</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

