import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Achivement.css'; // Import the updated CSS file

const Achivement = () => {
  const [group1List, setGroup1List] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGroup1List = async () => {
      // Show loading Swal alert before starting the data fetch
      Swal.fire({
        title: 'Loading...',
        text: 'Fetching achievement details, please wait...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const response = await axios.get('https://www.bharathithervukalam.com/achivers/all');
        setGroup1List(response.data);
        Swal.close(); // Close the loading alert after successful fetch
      } catch (error) {
        console.error('Error fetching Group1 list:', error);
        setMessage('Failed to load data.');
        Swal.fire('Error', 'Failed to load achievement details', 'error'); // Show error alert if fetch fails
      }
    };

    fetchGroup1List();
  }, []);

  return (
    <div className="group-details container-fluid">
      <h2 className="text-center">Achievements</h2>
      {message && <p className="message">{message}</p>}
      <div className="row">
        {group1List.map((group1) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
            key={group1.id}
          >
            <div className="card mb-3 pt-3" id="card-container">
              {group1.img && (
                <img
                  src={`data:image/jpeg;base64,${group1.img}`}
                  alt={group1.filename || 'Group image'}
                  className="card-img-top rounded-circle"
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{group1.syllabus}</h5>
                <h4 className="card-title">{group1.paper}</h4>
                <h5 className="card-subtitle">{group1.subject}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achivement;
