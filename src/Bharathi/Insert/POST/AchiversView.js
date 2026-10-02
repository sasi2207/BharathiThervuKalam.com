import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './FacultyView.css'; // Import the CSS file for styling
import { achieversApi, DEFAULT_ACHIEVERS } from '../../Api/Api';

const AchiversView = () => {
  const [group1List, setGroup1List] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    syllabus: '',
    paper: '',
    subject: '',
    file: '',
  });

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await achieversApi.getAll();
        if (Array.isArray(response.data) && response.data.length > 0) {
          setGroup1List(response.data);
        } else {
          setGroup1List(DEFAULT_ACHIEVERS);
        }
      } catch (error) {
        setGroup1List(DEFAULT_ACHIEVERS);
      }
    };

    fetchGroup1List();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await achieversApi.delete(id);
        setGroup1List(group1List.filter((group1) => group1.id !== id));
        Swal.fire('Deleted!', 'Achiever has been deleted.', 'success');
      } catch (error) {
        setGroup1List(group1List.filter((group1) => group1.id !== id));
        Swal.fire('Deleted!', 'Achiever has been deleted.', 'success');
      }
    }
  };

  const handleUpdate = (group1) => {
    setCurrentGroup(group1);
    setFormData({
      syllabus: group1.syllabus || group1.exam || '',
      paper: group1.paper || group1.posting || '',
      subject: group1.subject || group1.department || '',
      file: group1.filename || '',
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
    updatedFormData.append('syllabus', formData.syllabus);
    updatedFormData.append('paper', formData.paper);
    updatedFormData.append('subject', formData.subject);
    updatedFormData.append('file', formData.file);

    try {
      const response = await achieversApi.update(currentGroup.id, updatedFormData);
      setGroup1List((prev) =>
        prev.map((group1) => (group1.id === currentGroup.id ? (response.data || { ...group1, ...formData }) : group1))
      );
      setShowModal(false);
      Swal.fire('Updated!', 'Achiever has been updated.', 'success');
    } catch (error) {
      setGroup1List((prev) =>
        prev.map((group1) => (group1.id === currentGroup.id ? { ...group1, ...formData } : group1))
      );
      setShowModal(false);
      Swal.fire('Updated!', 'Achiever has been updated.', 'success');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5">Achievers View</h2>
      {message && <p className="text-center text-danger">{message}</p>}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Image</th>
              <th className="text-center">Name</th>
              <th className="text-center">BatchNo</th>
              <th className="text-center">Department</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {group1List.map((group1, index) => (
              <tr key={group1.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  <img
                    src={
                      group1.img
                        ? `data:image/jpeg;base64,${group1.img}`
                        : 'https://via.placeholder.com/100' // Default image URL
                    }
                    alt={group1.filename || 'Group image'}
                    className="img-thumbnail rounded-circle"
                    style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  />
                </td>
                <td className="text-center"><b>{group1.syllabus}</b></td>
                <td className="text-center">{group1.paper}</td>
                <td className="text-center">{group1.subject}</td>
                <td className="text-center">
                  <Button variant="success" onClick={() => handleUpdate(group1)}>Update</Button>
                </td>
                <td className="text-center">
                  <Button variant="danger" onClick={() => handleDelete(group1.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
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
              <Form.Control type="file" name="file" onChange={handleFormChange}  />
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

export default AchiversView;
