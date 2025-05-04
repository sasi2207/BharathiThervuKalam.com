import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './FacultyView.css'; // Import the CSS file for styling

const GroupIIAView = () => {
  const [group1List, setGroup1List] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    syllabus: '',
    paper: '',
    subject: '',
    file: null,
  });

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/group2A/all');
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
        await axios.delete(`https://www.bharathithervukalam.com/api/group2A/delete/${id}`);
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
      syllabus: group1.syllabus,
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
    updatedFormData.append('syllabus', formData.syllabus);
    updatedFormData.append('paper', formData.paper);
    updatedFormData.append('subject', formData.subject);
    if (formData.file) {
      updatedFormData.append('file', formData.file);
    }

    try {
      const response = await axios.put(`https://www.bharathithervukalam.com/api/group2A/update/${currentGroup.id}`, updatedFormData, {
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

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/api/group2A/download/${id}`, {
        responseType: 'blob',
      });
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].split(';')[0]
        : `file_${id}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire('Error', 'Failed to download file', 'error');
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="container">
      <h2 className='text-center'>GROUP II-A SYLLABUS & NOTES</h2>
      {message && <p className="message">{message}</p>}
      <div className="table-responsive mt-5">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope='col'>Id</th>
              <th scope="col">Icon</th>
              <th scope="col">Syllabus</th>
              <th scope="col">Paper</th>
              <th scope="col">Subject</th>
              <th scope="col">Download</th>
              <th scope='col'>Edit</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {group1List.map((group1) => (
              <tr key={group1.id}>
                <td>{group1.id}</td>
                <td>
                  <FontAwesomeIcon icon={faFilePdf} className="icon-large" />
                </td>
                <td>{group1.syllabus}</td>
                <td>{group1.paper}</td>
                <td>{group1.subject}</td>
                <td>
                  <Button className="btn btn-primary mr-2" onClick={() => downloadFile(group1.id)}>
                    Download PDF
                  </Button>
                </td>
                <td>
                  <Button className="btn btn-primary mr-2" onClick={() => handleUpdate(group1)}>
                    Update
                  </Button>
                </td>
                <td>
                  <Button className="btn btn-danger" onClick={() => handleDelete(group1.id)}>
                    Delete
                  </Button>
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

export default GroupIIAView;
