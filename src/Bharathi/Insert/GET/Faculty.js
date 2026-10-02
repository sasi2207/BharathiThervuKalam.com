import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const FacultyForm = () => {
  const [username, setUsername] = useState('');
  const [paper, setPaper] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [uploadSuccess, setUploadSuccess] = useState(false); // Upload success state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('paper', paper);
    formData.append('subject', subject);
    formData.append('file', file);

    setLoading(true); // Start loading
    setUploadSuccess(false); // Reset success state

    try {
      await axios.post('https://www.bharathithervukalam.com/api/group1/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data uploaded successfully!'
      });
      setUploadSuccess(true); // Set success state
      // Clear form fields after successful upload
      setUsername('');
      setPaper('');
      setSubject('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading data:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Error uploading data: ${error.response ? error.response.data.error : 'Please try again.'}`
      });
      setUploadSuccess(false); // Ensure success state is reset on error
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="container col-lg-8 col-md-10 mt-5 mb-5">
      <form onSubmit={handleSubmit} className="row g-3 bg-light p-5 rounded shadow-sm">
        <h2 className="mt-4 mb-4 text-center">Staff Faculty Form</h2>
        
        <div className="mb-3 col-md-6">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="paper" className="form-label">Paper:</label>
          <input
            type="text"
            className="form-control"
            id="paper"
            value={paper}
            onChange={(e) => setPaper(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="subject" className="form-label">Subject:</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="file" className="form-label">File:</label>
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : uploadSuccess ? (
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

export default FacultyForm;
