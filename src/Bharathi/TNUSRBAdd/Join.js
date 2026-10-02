import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const JoinAdd = () => {
    const [syllabus, setSyllabus] = useState('');
    const [paper, setPaper] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [loadingSwal, setLoadingSwal] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Show loading spinner
        const swalLoading = Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your data.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        setLoadingSwal(swalLoading);

        const formData = new FormData();
        formData.append('syllabus', syllabus);
        formData.append('paper', paper);
        formData.append('subject', subject);
        formData.append('file', file);

        try {
            const response = await axios.post('https://www.bharathithervukalam.com/api/join/save', formData);
            console.log('Faculty saved:', response.data);
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Syllabus PDF added successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error saving faculty:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error saving syllabus. Please try again.'
            });
        } finally {
            if (loadingSwal) {
                loadingSwal.close(); // Close the loading spinner
            }
            // Optionally reset form fields after successful save
            setSyllabus('');
            setPaper('');
            setSubject('');
            setFile(null);
        }
    };

    return (
        <div className="container mt-4 animated fadeIn col-lg-8 col-md-10">
            <form onSubmit={handleSubmit} className="row g-3 bg-light p-5 rounded shadow-sm">
                <h2 className="text-center mb-4">Joint Recruitment for Various Posts SYLLABUS & NOTES</h2>
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
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    );
};

export default JoinAdd;
