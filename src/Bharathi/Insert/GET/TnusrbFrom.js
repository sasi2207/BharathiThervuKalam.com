import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const TnusrbForm = ({ fetchTnusrbList }) => {
  const [syllabus, setSyllabus] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('syllabus', syllabus);
      formData.append('paper', paper);
      formData.append('subject', subject);
      formData.append('img', img);

      await axios.post('https://www.bharathithervukalam.com/tnusrb', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Record added successfully.',
        icon: 'success',
        confirmButtonText: 'Okay'
      });
      fetchTnusrbList(); // Refresh the list after adding a new record
      setSyllabus('');
      setPaper('');
      setSubject('');
      setImg(null);
    } catch (error) {
      console.error('Error adding Tnusrb record:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue adding the record.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  return (
    <div className="container mt-4 ">
   
      <form onSubmit={handleSubmit} className="bg-light p-5 rounded shadow-sm">
      <h2 className="text-center mb-4">TNUSRB SYLLABUS & NOTES</h2>
          <div className=" col-md-6 mb-3 mb-md-0">
            <label htmlFor="syllabus" className="form-label">Syllabus:</label>
            <input
              type="text"
              className="form-control"
              id="syllabus"
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="paper" className="form-label">Paper:</label>
            <input
              type="text"
              className="form-control"
              id="paper"
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              required
            />
         
        </div>
       
          <div className=" col-md-6 mb-3 mb-md-0">
            <label htmlFor="subject" className="form-label">Subject:</label>
            <input
              type="text"
              className="form-control"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="img" className="form-label">Image:</label>
            <input
              type="file"
              className="form-control"
              id="img"
              onChange={(e) => setImg(e.target.files[0])}
              required
            />
          </div>
       
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">Add Tnusrb</button>
        </div>
      </form>
    </div>
  );
};

export default TnusrbForm;
