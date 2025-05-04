import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TestView = () => {
    const [posts, setPosts] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [formData, setFormData] = useState({
        syllabus: '',
        paper: '',
        subject: '',
        file: null,
    });

    useEffect(() => {
        const fetchPosts = async () => {
            // Show Swal loading animation
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we fetch the posts',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading(); // Shows a spinner inside Swal
                }
            });

            try {
                const response = await axios.get('https://www.bharathithervukalam.com/test/all');
                setPosts(response.data);
                Swal.close(); // Close loading animation after success
            } catch (error) {
                Swal.close(); // Close loading animation in case of error
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to fetch posts',
                    icon: 'error',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutDown'
                    }
                });
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleUpdate = (post) => {
        setCurrentPost(post);
        setFormData({
            syllabus: post.namepost, // Assuming 'namepost' maps to 'syllabus'
            paper: post.paper,
            subject: post.department, // Assuming 'department' maps to 'subject'
            file: null,
        });
        setShowUpdateModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Show Swal loading animation before submitting the form
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait while we save your changes',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Shows the loading spinner
            }
        });

        const updatedFormData = new FormData();
        updatedFormData.append('syllabus', formData.syllabus);
        updatedFormData.append('paper', formData.paper);
        updatedFormData.append('subject', formData.subject);
        if (formData.file) {
            updatedFormData.append('file', formData.file);
        }

        try {
            const response = await axios.put(`https://www.bharathithervukalam.com/test/update/${currentPost.id}`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPosts((prev) =>
                prev.map((post) => (post.id === currentPost.id ? response.data : post))
            );
            setShowUpdateModal(false);

            Swal.fire({
                title: 'Success',
                text: 'Post updated successfully',
                icon: 'success',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error updating post. Check console for details.',
                icon: 'error',
                showClass: {
                    popup: 'animate__animated animate__shakeX'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown'
                }
            });
            console.error('Error updating post:', error);
        } finally {
            Swal.close(); // Ensure to close loading Swal in case of success or error
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://www.bharathithervukalam.com/test/delete/${id}`);
                setPosts(posts.filter(post => post.id !== id));
                Swal.fire('Deleted!', 'Post has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting post:', error);
                Swal.fire('Error', 'Error deleting post. Check console for details.', 'error');
            }
        }
    };

    const handleView = (post) => {
        setCurrentPost(post);
        setShowPdfModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setShowPdfModal(false);
        setCurrentPost(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Test - Series</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>S.No</th>
                            <th>Exam Type</th>
                            <th>Department</th>
                            <th>Subject</th>
                            <th>Paper Type</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>View PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post, index) => (
                            <tr key={post.id}>
                                <td>{index + 1}</td> {/* Serial Number */}
                                <td>{post.namepost}</td>
                                <td>{post.department}</td>
                                <td>{post.paper}</td>
                                <td>{post.standard}</td>
                                <td>
                                    <Button className="btn btn-primary me-2" onClick={() => handleUpdate(post)}>
                                        Update
                                    </Button>
                                </td>
                                <td>
                                    <Button className="btn btn-danger" onClick={() => handleDelete(post.id)}>
                                        Delete
                                    </Button>
                                </td>
                                <td>
                                    <Button className="btn btn-info" onClick={() => handleView(post)}>
                                        View PDF
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing PDF */}
            <Modal show={showPdfModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{currentPost ? currentPost.namepost : 'PDF Viewer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentPost && (
                        <iframe
                            src={`https://www.bharathithervukalam.com/test/view/${currentPost.id}`}
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

            {/* Modal for updating post */}
            <Modal show={showUpdateModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formSyllabus">
                                    <Form.Label>Syllabus</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="syllabus"
                                        value={formData.syllabus}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPaper">
                                    <Form.Label>Paper</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="paper"
                                        value={formData.paper}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="formSubject">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formFile">
                                    <Form.Label>File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="file"
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TestView;
