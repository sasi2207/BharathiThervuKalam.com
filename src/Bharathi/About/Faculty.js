import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Faculty = ({ staffId }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      Swal.fire({
        title: 'Loading staff data...',
        text: 'Please wait while staff details are being fetched.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await axios.get('https://www.bharathithervukalam.com/staff/view/all');
        setStaffData(response.data);
        Swal.close();
      } catch (err) {
        Swal.close();
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
    Swal.fire({
      title: 'Deleting staff member...',
      text: 'Please wait while the staff member is being deleted.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.delete(`https://www.bharathithervukalam.com/staff/delete/${id}`);
      setStaffData(staffData.filter((staff) => staff.id !== id));
      Swal.fire('Deleted!', 'Staff member has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete staff member.', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Updating staff member...',
      text: 'Please wait while staff details are being updated.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    Object.keys(currentStaff).forEach((key) => {
      if (key !== 'file') {
        formData.append(key, currentStaff[key]);
      } else if (currentStaff.file) {
        formData.append('file', currentStaff.file);
      }
    });

    try {
      await axios.put(`https://www.bharathithervukalam.com/staff/update/${currentStaff.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Updated!', 'Staff member details have been updated.', 'success');
      setEditMode(false);
      const response = await axios.get('https://www.bharathithervukalam.com/staff/view/all');
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
    return <div>Loading...</div>;
  }

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
    });
    return <div className="text-danger text-center">{error}</div>;
  }

  if (editMode && currentStaff) {
    return (
      <div className="container mt-4">
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
                <label>Department</label>
                <input type="text" name="department" className="form-control" value={currentStaff.department} onChange={handleChange} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Upload Image</label>
                <input type="file" name="file" className="form-control" onChange={handleChange} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Update</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {staffData.map((user) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={user.id}>
            <div className="card h-100 text-center">
              <img
                src={user.file ? `data:image/jpeg;base64,${user.file}` : 'placeholder.jpg'}
                alt={user.username}
                className="card-img-top rounded-circle p-3 mx-auto"
                style={{ height: '150px', width: '150px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">
                  <strong>Department:</strong> <p id="card-sub">{user.department}</p>
                </p>
                <button onClick={() => handleEdit(user)} className="btn btn-warning btn-sm me-2">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faculty;
