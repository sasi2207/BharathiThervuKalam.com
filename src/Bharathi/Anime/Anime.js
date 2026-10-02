import React, { useState, useEffect } from 'react';
import './Anime.css'; 

export default function Anime () {

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    
    setAnimate(true);
  }, []);

  return (
    <div className={`box ${animate ? 'animate' : ''}`}>
      Bharathi TNPSC Academy
    </div>
  );
};


