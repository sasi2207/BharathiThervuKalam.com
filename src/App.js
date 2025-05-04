import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GoogleTranslate from './Bharathi/Lan';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyModal from './Bharathi/Model';

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
   
    handleShow();
  }, []);

  return (
    <div className="my-app">
      <Helmet>
        <title>பாரதி தேர்வுக்களம்</title>
        <meta name="description" content="TamilNadu Best TNPSC ACADEMY" />
        <meta name="keywords" content="bharathithervukalam, bharathi, thervukalam,bharathiacademy" />
        <meta property="og:title" content="பாரதி தேர்வுக்களம்" />
        <meta property="og:description" content="Develop By SasiKumar" />
    
        <meta name="twitter:title" content="பாரதி தேர்வுக்களம்" />
        <meta name="twitter:description" content="BharathiThervukalam" />
      
      </Helmet>
      

      <GoogleTranslate />
     
      <MyModal show={show} handleClose={handleClose} /> 
      
    </div>
  );
}

export default App;
