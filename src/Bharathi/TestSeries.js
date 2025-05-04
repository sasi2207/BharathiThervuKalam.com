import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TestSeries = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [currentFilename, setCurrentFilename] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                Swal.fire({
                    title: 'Loading test series...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                const response = await axios.get('https://www.bharathithervukalam.com/test/all');
                setPosts(response.data);
                Swal.close(); // Close loading alert when data is fetched
            } catch (error) {
                Swal.close(); // Ensure SweetAlert is closed even on error
                Swal.fire('Error', 'Error fetching posts', 'error');
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const downloadFile = async (id) => {
        try {
            Swal.fire({
                title: 'Downloading file...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await axios.get(`https://www.bharathithervukalam.com/test/download/${id}`, {
                responseType: 'blob',
            });
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '')
                : `file_${id}.pdf`;

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            Swal.close(); // Close SweetAlert when file download is complete
        } catch (error) {
            Swal.close();
            Swal.fire('Error', 'Error downloading file', 'error');
            console.error('Error downloading file:', error);
        }
    };

    const openPDFViewer = (id, filename) => {
        setCurrentFile(`https://www.bharathithervukalam.com/test/view/${id}`);
        setCurrentFilename(filename);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        });
    
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Logging out...',
                text: 'Please wait a moment.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                Swal.close();
                navigate("/");
            }, 2000);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `${process.env.PUBLIC_URL}/Tnpsc - OMR Sheet-1.pdf`;
        link.download = 'Tnpsc - OMR Sheet-1.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container">
            <button className='btn btn-danger' onClick={handleLogout}>LogOut</button>
            <h2 className='text-center'>TEST SERIES QUESTIONS & ANSWER</h2>

            <div className="row">
                <div className="col-12 text-center">
                    <h2 id="omr">TNPSC - OMR Sheet</h2>
                    <button onClick={handleDownload} className="btn btn-primary mb-5 mt-3">Download PDF</button>
                </div>
            </div>

            {/* Display posts */}
            <div className="row mt-3">
                {posts.map(post => (
                    <div className="col-md-4" key={post.id}>
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body">
                                <FontAwesomeIcon icon={faFilePdf} className="icon-large" />
                                <h5 className="card-title">Exam Type: {post.namepost}</h5>
                                <h5 className="card-subtitle text-muted">Department: {post.department}</h5>
                                <p className="card-text">Subject: {post.paper}</p>
                                <p className="card-text">Paper Type: {post.standard}</p>
                                <button className='btn btn-primary' onClick={() => downloadFile(post.id)}>Download File</button>
                            </div>
                        </div>

                        {/* Modal for viewing the PDF */}
                        <Modal show={showModal} onHide={handleCloseModal} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Viewing: {currentFilename}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {currentFile && (
                                    <iframe
                                        src={currentFile}
                                        width="100%"
                                        height="500px"
                                        title="PDF Viewer"
                                    ></iframe>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestSeries;
