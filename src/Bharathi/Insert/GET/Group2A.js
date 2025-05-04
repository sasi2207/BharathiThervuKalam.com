import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GroupI.css'; // Ensure this CSS file is created for custom animations

const GroupIIA = () => {
    const [syllabus, setSyllabus] = useState('');
    const [paper, setPaper] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [uploadSuccess, setUploadSuccess] = useState(false); // Add success state

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'No File Selected',
                text: 'Please select a file to upload.'
            });
            return;
        }

        const formData = new FormData();
        formData.append('syllabus', syllabus);
        formData.append('paper', paper);
        formData.append('subject', subject);
        formData.append('file', file);

        setLoading(true); // Start loading
        setUploadSuccess(false); // Reset success state

        try {
            const response = await axios.post('https://www.bharathithervukalam.com/api/group2A/save', formData);
            console.log('Faculty saved:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Syllabus PDF added successfully!',
                timer: 2000,
                showConfirmButton: false
            });
            setUploadSuccess(true); // Set success state
            // Optionally reset form fields after successful save
            setSyllabus('');
            setPaper('');
            setSubject('');
            setFile(null);
        } catch (error) {
            console.error('Error saving faculty:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error saving syllabus. Please try again.'
            });
            setUploadSuccess(false); // Ensure success state is reset on error
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="container mt-4 animated fadeIn col-lg-8 col-md-10">
            <form onSubmit={handleSubmit} className="row g-3 bg-light p-5 rounded shadow-sm">
                <h2 className="text-center mb-4">GROUP II-A SYLLABUS & NOTES</h2>
                <div className="mb-3 col-md-6">
                    <label htmlFor="syllabus" className="form-label">Syllabus</label>
                    <input
                        type="text"
                        className="form-control"
                        id="syllabus"
                        value={syllabus}
                        onChange={(e) => setSyllabus(e.target.value)}
                        placeholder="Syllabus"
                    />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="paper" className="form-label">Paper</label>
                    <input
                        type="text"
                        className="form-control"
                        id="paper"
                        value={paper}
                        onChange={(e) => setPaper(e.target.value)}
                        placeholder="Paper"
                    />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                    />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="file" className="form-label">File</label>
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

export default GroupIIA;
