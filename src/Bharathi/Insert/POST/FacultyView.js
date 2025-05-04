import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './FacultyView.css'; // Import the CSS file for styling

const FacultyView = () => {
  const [group1List, setGroup1List] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    paper: '',
    subject: '',
    file: null,
  });

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/group1/all');
        setGroup1List(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch data', 'error');
        console.error('Error fetching Group1 list:', error);
      }
    };

    fetchGroup1List();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://www.bharathithervukalam.com/api/group1/delete/${id}`);
        setGroup1List(group1List.filter((group1) => group1.id !== id));
        Swal.fire('Deleted!', 'Group has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete group', 'error');
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleUpdate = (group1) => {
    setCurrentGroup(group1);
    setFormData({
      username: group1.username,
      paper: group1.paper,
      subject: group1.subject,
      file: null,
    });
    setShowModal(true);
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
    const updatedFormData = new FormData();
    updatedFormData.append('username', formData.username);
    updatedFormData.append('paper', formData.paper);
    updatedFormData.append('subject', formData.subject);
    if (formData.file) {
      updatedFormData.append('file', formData.file);
    }

    try {
      const response = await axios.put(`https://www.bharathithervukalam.com/api/group1/update/${currentGroup.id}`, updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setGroup1List((prev) =>
        prev.map((group1) => (group1.id === currentGroup.id ? response.data : group1))
      );
      setMessage('Group updated successfully');
      setShowModal(false);
      Swal.fire('Updated!', 'Group has been updated.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update group', 'error');
      console.error('Error updating group:', error);
    }
  };

  return (
    <div className="container">
      <h2 className='text-center mb-3'>Faculty</h2>
      {message && <p className="message">{message}</p>}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope='col'>Id</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Paper</th>
              <th scope="col">Subject</th>
              <th scope="col">Edit</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {group1List.map((group1) => (
              <tr key={group1.id}>
                <td>{group1.id}</td>
                <td>
                  {group1.img && (
                    <img
                      src={`data:image/jpeg;base64,${group1.img}`}
                      alt={group1.filename || 'Group image'}
                      className="img-thumbnail"
                      style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{group1.username}</td>
                <td>{group1.paper}</td>
                <td>{group1.subject}</td>
                <td>
                  <button className="btn btn-info mr-2" onClick={() => handleUpdate(group1)}>
                    Update
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(group1.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
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
            <Form.Group controlId="formFile">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" name="file" onChange={handleFormChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FacultyView;
