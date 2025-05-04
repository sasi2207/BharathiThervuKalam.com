import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestForm.css'; 

const TestForm = () => {
    const [formData, setFormData] = useState({
        namepost: '',
        department: '',
        paper: '',
        standard: '',
        pdf: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pdf: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true when submission starts

        const postData = new FormData();
        postData.append('namepost', formData.namepost);
        postData.append('department', formData.department);
        postData.append('paper', formData.paper);
        postData.append('standard', formData.standard);
        postData.append('file', formData.pdf);

        try {
            const response = await axios.post('https://www.bharathithervukalam.com/test/upload', postData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created successfully:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Post created successfully!',
                timer: 2000,
                showConfirmButton: false
            });
            setFormData({
                namepost: '',
                department: '',
                paper: '',
                standard: '',
                pdf: null
            });
        } catch (error) {
            console.error('Error creating post:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error creating post. Check the console for details.'
            });
        } finally {
            setLoading(false);  // Set loading to false once submission is complete
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                        <h2 className="text-center mb-4">TestSeries</h2>
                        
                        {/* Exam Type Field */}
                        <div className="mb-3">
                            <label htmlFor="namepost" className="form-label">Exam Type</label>
                            <select
                                className="form-select"
                                name="namepost"
                                value={formData.namepost}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Exam Type</option>
                                <option value="TNPSC">TNPSC</option>
                                <option value="TNUSRB">TNUSRB</option>
                            </select>

                            {/* TNPSC and TNUSRB Additional Links */}
                            {formData.namepost === 'TNPSC' && (
                                <div className="mt-2">
                                    <a href="#group1" className="btn btn-outline-info btn-sm me-2">Group I</a>
                                    <a href="#group2" className="btn btn-outline-info btn-sm me-2">Group II</a>
                                    <a href="#group2a" className="btn btn-outline-info btn-sm">Group II-A</a>
                                </div>
                            )}
                            {formData.namepost === 'TNUSRB' && (
                                <div className="mt-2">
                                    <a href="#si-fingerpost" className="btn btn-outline-warning btn-sm me-2">SI Fingerpost</a>
                                    <a href="#si-technical" className="btn btn-outline-warning btn-sm me-2">SI Technical</a>
                                    <a href="#common-recruitment" className="btn btn-outline-warning btn-sm">Common Recruitment</a>
                                </div>
                            )}
                        </div>

                        {/* Department Field */}
                        <div className="mb-3">
                            <label htmlFor="department" className="form-label">Department</label>
                            <select
                                className="form-select"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="GROUP I">GROUP I</option>
                                <option value="GROUP II">GROUP II</option>
                                <option value="GROUP II-A">GROUP II-A</option>
                                <option value="GROUP IV">GROUP IV</option>
                                <option value="TNUSRB">TNUSRB</option>
                            </select>
                        </div>

                        {/* Subject Field */}
                        <div className="mb-3">
                            <label htmlFor="paper" className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                name="paper"
                                value={formData.paper}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Paper Type Field */}
                        <div className="mb-3">
                            <label htmlFor="standard" className="form-label">Paper Type</label>
                            <select
                                className="form-select"
                                name="standard"
                                value={formData.standard}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Paper Type</option>
                                <option value="Question">Question</option>
                                <option value="Answer">Answer</option>
                            </select>
                        </div>

                        {/* File Upload Field */}
                        <div className="mb-3">
                            <label htmlFor="pdf" className="form-label">Upload PDF</label>
                            <input type="file" className="form-control" name="pdf" onChange={handleFileChange} required />
                        </div>

                        {/* Submit Button with Loading Spinner */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Uploading...</span>
                                    </span>
                                ) : (
                                    'Upload'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestForm;
