import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AchieversForm = () => {
  const [syllabus, setSyllabus] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const [submitSuccess, setSubmitSuccess] = useState(false); // New success state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('syllabus', syllabus);
    formData.append('paper', paper);
    formData.append('subject', subject);
    formData.append('file', file);

    setLoading(true); // Set loading state to true

    try {
      await axios.post('https://www.bharathithervukalam.com/achivers/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data uploaded successfully!'
      });
      setSubmitSuccess(true); // Set success state to true
      // Optionally clear form fields or do something else after successful upload
      setSyllabus('');
      setPaper('');
      setSubject('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error uploading data. Please try again.'
      });
      setSubmitSuccess(false); // Set success state to false
    } finally {
      setLoading(false); // Set loading state to false regardless of outcome
    }
  };

  return (
    <div className="container col-lg-8 col-md-10 mt-5 mb-5">
      <form onSubmit={handleSubmit} className='row g-3 bg-light p-3 rounded shadow-sm'>
        <h2 className="mt-4 text-center mb-4">Achievers Form</h2>
        <div className="mb-3 col-md-6">
          <label htmlFor="syllabus" className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            id="syllabus"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="paper" className="form-label">Batch:</label>
          <input
            type="text"
            className="form-control"
            id="paper"
            value={paper}
            onChange={(e) => setPaper(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="subject" className="form-label">Department:</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="file" className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        
        <div className='col-12 text-center'>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : submitSuccess ? (
              'Uploaded!'
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AchieversForm;
