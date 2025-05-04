// src/Achieve.js

import React, { useState } from 'react';
import './Achieve.css';

const Achieve = () => {
  const [name, setName] = useState('');
  const [img, setImg] = useState(null);
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('img', img);
    formData.append('age', age);
    formData.append('location', location);
    
    try {
      const response = await fetch('https://your-server-endpoint.com/api/data', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('Data posted successfully!');
        setName('');
        setImg(null);
        setAge('');
        setLocation('');
      } else {
        setStatus('Error posting data');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error posting data');
    }
  };

  return (
    <div className="achieve">
      <h1>Air Civilization</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="img">Image File:</label>
          <input 
            type="file" 
            id="img"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input 
            type="number" 
            id="age"
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input 
            type="text" 
            id="location"
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Post Data</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Achieve;
