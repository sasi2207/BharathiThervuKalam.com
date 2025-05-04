import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StaffFaculty.css';

const StaffFaculty = ({ staffId }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      Swal.fire({
        title: 'Loading...',
        text: 'Fetching staff details, please wait...',
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
        setError('Failed to fetch staff details. Please try again later.');
        Swal.fire('Error', 'Failed to load staff details', 'error');
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
      await axios.delete(`https://www.bharathithervukalam.com/staff/delete/${id}`);
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
      formData.append(key, currentStaff[key]);
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
    return <div className="text-danger text-center">{error}</div>;
  }

  if (editMode && currentStaff) {
    return (
      <div className="container mt-4">
        <h3>Edit Staff Member</h3>
        <form onSubmit={handleUpdate}>
          {/* form content */}
        </form>
      </div>
    );
  }

  return (
    <div className="container ">
      <h2 className="text-center" id="title-1">Our Faculty Team</h2>
      <div className="row">
        {staffData.map((user) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={user.id}>
            <div className="card h-100 custom-card">
              <img
                src={user.file ? `data:image/jpeg;base64,${user.file}` : 'placeholder.jpg'}
                alt={user.username}
                className="card-img-top rounded-circle passport-photo mx-auto mt-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">
                  <strong>Department:</strong> <span id="card-sub">{user.department}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffFaculty;
