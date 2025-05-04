import React, { useEffect, useState } from 'react';
import './WhyAbout.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

const WhyAbout = () => {
  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const texts = [
    "Bharathi Academy is started with the mission to cross socio-economic barriers and help aspiring students enter Government Service through Competitive Exams.",
    "Classes are conducted by persons who are currently working in various Government Departments, purely with the intention to serve the society and share their knowledge and experience with the fellow students.",
    "As Bharathi Academy is founded only with the aim of supporting the aspiring candidates, classes are taken at free of cost. Quality training is provided to all the students with complete guidance in all aspects.",
    "Various batches are taken up for all Competitive Exams at Erode.",
    "Fees is collected at a nominal cost only for the test batches conducted by the Academy."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const showNextLetter = () => {
      setText(prev => prev + texts[currentIndex][charIndex]);
      setCharIndex(prev => prev + 1);
    };

    if (charIndex < texts[currentIndex].length) {
      const timeoutId = setTimeout(showNextLetter, 100);
      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setCharIndex(0);
        setText('');
        setCurrentIndex((currentIndex + 1) % texts.length);
      }, 5000); // Adjust the delay before showing the next text
      return () => clearTimeout(timeoutId);
    }
  }, [charIndex, currentIndex, texts]);

  return (
    <div className="container">
    
       
      {/* <h1 id="animatedText" className='body p-3' data-aos="fade-up">{text}</h1> */}

      <div className="mt-5">
        <h2 className="mt-2 text-center"  data-aos="zoom-in-up">Why BHARATHI TNPSC ACADEMY</h2>

        <div className='mt-5 mb-5 p-5 bg-light' data-aos="zoom-in-up">
          <h2 id='grop'>WHY US BHARATHI ?</h2>
          <ul id='para' className='mt-5 '>
            <li>Bharathi Academy is started with the mission to cross socio-economic barriers and help aspiring students enter Government Service through Competitive Exams.</li>
            <li>Classes are conducted by persons who are currently working in various Government Departments, purely with the intention to serve the society and share their knowledge and experience with the fellow students.</li>
            <li>As Bharathi Academy is founded only with the aim of supporting the aspiring candidates, classes are taken at free of cost. Quality training is provided to all the students with complete guidance in all aspects.</li>
            <li>Various batches are taken up for all Competitive Exams at Erode.</li>
            <li>Fees is collected at a nominal cost only for the test batches conducted by the Academy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhyAbout;
