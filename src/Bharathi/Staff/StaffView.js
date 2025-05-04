import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './StaffView.css'; // Add a custom CSS file for animations

const StaffView = ({ staffId }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get('http://www.bharathithervukalam.com/staff/view/all');
        setStaffData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Staff member not found.');
        } else {
          setError('Failed to fetch staff details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [staffId]);

  const handleEdit = (staff) => {
    setCurrentStaff(staff);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://www.bharathithervukalam.com/staff/delete/${id}`);
      setStaffData(staffData.filter((staff) => staff.id !== id));
      Swal.fire('Deleted!', 'Staff member has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete staff member.', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(currentStaff).forEach((key) => {
      if (key !== 'file') {
        formData.append(key, currentStaff[key]);
      } else if (currentStaff.file) {
        formData.append('file', currentStaff.file);
      }
    });

    try {
      await axios.put(`http://www.bharathithervukalam.com/staff/update/${currentStaff.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Updated!', 'Staff member details have been updated.', 'success');
      setEditMode(false);
      const response = await axios.get('http://www.bharathithervukalam.com/staff/view/all');
      setStaffData(response.data);
    } catch (err) {
      Swal.fire('Error!', 'Failed to update staff details.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCurrentStaff({
      ...currentStaff,
      [name]: value,
      file: files ? files[0] : currentStaff.file,
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Retry',
    });
    return <div className="text-danger text-center">{error}</div>;
  }

  if (editMode && currentStaff) {
    return (
      <div className="container">
        <h3>Edit Staff Member</h3>
        <form onSubmit={handleUpdate}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>ID</label>
                <input type="text" className="form-control" value={currentStaff.id} disabled />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="username" className="form-control" value={currentStaff.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Date Of Birth</label>
                <input type="date" name="dob" className="form-control" value={currentStaff.dob} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" className="form-control" value={currentStaff.phoneNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="text" name="whatsappNumber" className="form-control" value={currentStaff.whatsappNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={currentStaff.email} onChange={handleChange} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Blood Group</label>
                <input type="text" name="bloodgroup" className="form-control" value={currentStaff.bloodgroup} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" className="form-control" value={currentStaff.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" name="designation" className="form-control" value={currentStaff.designation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Upload Image</label>
                <input type="file" name="file" className="form-control" onChange={handleChange} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    );
  }

  return (
    <div className="table-responsive container">
      <table className="table table-hover table-striped table-bordered animated-table">
        <thead className="thead-dark">
          <tr className="table-dark">
            <th className="text-center">Id</th>
            <th className="text-center">Name</th>
            <th className="text-center">Image</th>
            <th className="text-center">Date Of Birth</th>
            <th className="text-center">Phone Number</th>
            <th className="text-center">Email</th>
            <th className="text-center">Blood Group</th>
            <th className="text-center">Edit</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((user, index) => (
            <tr key={user.id}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{user.username}</td>
              <td className="text-center">
                {user.file && (
                  <img
                    src={`data:image/jpeg;base64,${user.file}`}
                    alt={user.filename || 'Group image'}
                    className="img-thumbnail rounded-circle"
                    style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td className="text-center">{user.dob}</td>
              <td className="text-center">{user.phoneNumber}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.bloodgroup}</td>
              <td className="text-center">
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(user)}>Edit</button>
              </td>
              <td className="text-center">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffView;
