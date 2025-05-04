import Count from './Admin/Count';
import EnrollForm from './EnrollForm';
import './Topnav.css';
import React, { useEffect, useState } from 'react';
import wal from './img1/Logo.png'
import { Link } from 'react-router-dom';

export default function Topnav() {



  const texts = ["Group-I", "Group-II", "Group-II-A", "Group-IV&VAO","Joint Recruitment(SIs & SOs)","SI (Technical)","SI(Finger Print)","Common Recruitment","Test-Series"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const textElement = document.getElementById('animatedText');

    const showText = () => {
      if (textElement) {
        textElement.innerHTML = ''; // Clear the previous text
        const currentText = texts[currentIndex];
        currentText.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'letter';
          span.style.animationDelay = `${index * 0.1}s`; // Delay each letter
          textElement.appendChild(span);
        });
      }
    };

    showText(); // Show the first text immediately
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, texts]);


  const handleDownload = () => {
    // Trigger the download using the anchor tag
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/SATURDAY TIME TABLE-1.pdf`;  // Path to the PDF file in the public folder
    link.download = 'SATURDAY TIME TABLE-1.pdf';  // Optional: specify the name for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  // Clean up the DOM
  };


  const handleDownload1 = () => {
    // Trigger the download using the anchor tag
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/SUNDAY GRP 4 SCHEDULE -2025.pdf`;  // Path to the PDF file in the public folder
    link.download = 'SUNDAY GRP 4 SCHEDULE -2025.pdf';  // Optional: specify the name for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  // Clean up the DOM
  };

  return (
    <div >

 <div className='bg-light'>
<div className="container const ">
      <div className="text-container">
        <h1 id="animatedText"></h1>
        <p className="mt-3" id="no">பாரதி தேர்வுக் களம்</p>
        <div className="mt-5">
          <h2>Group 1, Group 2, Group 2A, Group 4 & VAO</h2>
          <h2>Joint Recruitment(SIs & SOs), SI (Technical), SI(Finger Print), Common Recruitment</h2>
        </div>
        <div className="mt-5">
          <h3 className="letter" id="let">"வெற்றியின் முதல் படி !"</h3>
        </div>
      </div>
      <div className="img-container mt-5 ">
        <img src={wal} alt="Image" />
        <div className="mt-2 mb-5">
       <Link to={'/Student-Register'}>    <button className="btn btn-primary p-3" id="dot">Admission Open - Join Now</button> </Link>
        </div>
      </div>
    </div>

    <div className="row ">
          <div className="col-12 text-center">
            <h2> SATURDAY TEST SERIES 2025 SCHEDULE</h2>
           

            <button onClick={handleDownload} className="btn btn-primary mb-5 mt-3">
        Download PDF
      </button>
          </div>


          <div className="col-12 text-center">
            <h2> SUNDAY TEST SERIES 2025 SCHEDULE</h2>
           

            <button onClick={handleDownload1} className="btn btn-primary mb-5 mt-3">
        Download PDF
      </button>
          </div>
        </div>

     </div>
      <Count/>
      <EnrollForm/>
    </div>
  );
}
