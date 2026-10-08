import React, { useState, useEffect } from 'react';
import GoogleTranslate from './Bharathi/Lan';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import './App.css';
import MyModal from './Bharathi/Model';

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });

    // Reset any legacy theme states
    try {
      localStorage.removeItem('bharathi_theme');
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark-theme');
      document.body.removeAttribute('data-theme');
      document.body.classList.remove('dark-theme');
    } catch (e) {}
  }, []);

  return (
    <div className="my-app">
      <GoogleTranslate />
      <MyModal show={show} handleClose={handleClose} /> 
    </div>
  );
}

export default App;
