import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import './About.css';
import Img from '../img1/Logo.png';

const About = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="container">
      <h2 data-aos="fade-down" className="text-center mb-4" >About Us</h2>
      <div className="row">
        <div className="col-md-6 d-flex flex-column justify-content-center mt-3" data-aos="fade-up">
          <div className="bg-light p-5 rounded">
            <h1 data-aos="fade-right" id='sum'>Providing the best learning methods since 2017</h1>
            <p data-aos="fade-left" id='para'>
              Bharathi Academy was the brainchild of a team of youngsters who were preparing for competitive 
              exams with the main motive of entering Government Service. The academy was kick-started on 12.08.2017
              and has successfully produced more than 130+ candidates till date, who are now placed in various Government 
              Departments across the State. The main motto of the Academy is to impart a positive change in the society by 
              joining Government Service through Competitive Exams.
            </p>
            <div className="contact-section mt-4" data-aos="fade-right">
              <i className="bi bi-telephone-outbound btn btn-info me-2"></i>
              <div>
                <h6>Call to ask any question</h6>
                <a href="tel:+7338757194" className="number">7338757194</a>
              </div>
            </div>
            <button className="btn btn-info mt-4" data-aos="fade-left">Contact Us</button>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center  mt-5" id='rmg' data-aos="fade-up-left">
          <img src={Img} alt="Bharathi Academy" className='img-fluid rounded' />
        </div>
      </div>

      <div className="bg-light p-4 rounded mt-5" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
        <h1 className="text-center" id='sum'>Vision</h1>
        <p id='para'>
          To become a renowned institution producing eminent and responsible civil servants for the society.
          To give hope and opportunity to aspirants from various social-economic backgrounds to realize their
          dream of becoming civil servants.
        </p>
      </div>

      <div className="bg-light p-4 rounded mt-5 mb-5" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
        <h1 className="text-center" id='sum'>Mission</h1>
        <p id='para'>To provide meticulous and focused training to the aspirants to succeed in the Civil Services examination.</p>
        <p className="mt-3" id='para'>
          To create an environment where the students have access to all that is required to prepare for the civil services
          examination effectively, efficiently, and enthusiastically by ensuring them with excellent coaching and
          finest study materials.
        </p>
      </div>
    </div>
  );
};

export default About;
