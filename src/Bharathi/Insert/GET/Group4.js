import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GroupI.css'; // Ensure this CSS file is created for custom animations

const GroupIV = () => {
    const [syllabus, setSyllabus] = useState('');
    const [paper, setPaper] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

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

        setUploading(true);
        setProgress(0);

        try {
            const response = await axios.post('https://www.bharathithervukalam.com/api/group4/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (event) => {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setProgress(percentCompleted);
                }
            });

            console.log('Faculty saved:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Syllabus PDF added successfully!',
                timer: 2000,
                showConfirmButton: false
            });
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
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="container mt-4 animated fadeIn col-lg-8 col-md-10">
            <form onSubmit={handleSubmit} className="row g-3 bg-light p-5 rounded shadow-sm">
                <h2 className="text-center mb-4">GROUP IV SYLLABUS & NOTES</h2>
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
                    <label htmlFor="file" className="form-label">File</label>
                    <input
                        type="file"
                        className="form-control"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading ? `Uploading ${progress}%` : 'Upload'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GroupIV;
