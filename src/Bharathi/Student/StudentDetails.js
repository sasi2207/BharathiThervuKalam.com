import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './UserDetails.css'; // Import custom CSS for styling

const DownloadPDFButton = ({ userId }) => {
  const downloadPDF = async () => {
    try {
      const response = await fetch(`https://www.bharathithervukalam.com/exportToPDF/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_${userId}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Swal.fire('Error', 'Failed to download PDF', 'error');
    }
  };

  return (
    <Button onClick={downloadPDF} className="download-btn">
      Download PDF
    </Button>
  );
};

export default function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/students');
        console.log('API response:', response.data); 
        if (Array.isArray(response.data)) {
          setUsers(response.data); 
        } else {
          console.error('Expected an array but got:', response.data);
          setError('Unexpected data format received.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-details-container">
      <h2 className="text-center mb-3">Student Details</h2>

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading user details...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {users.length > 0 && !loading ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>RegisterNo</th>
                <th>Father/Husband Name</th>
                <th>DateOfBirth</th>
                <th>Qualification</th>
                <th>Phone</th>
                <th>WhatsApp</th>
                <th>Father'sPhone/Husband Phone</th>
                <th>Email</th>
                <th>Aadhaar</th>
                <th>Community</th>
                <th>Blood Group</th>
                <th>Ex-Serviceman</th>
                <th>Destitute Widow</th>
                <th>PSTM</th>
                <th>Address</th>
                <th>Payment ID</th>
                <th>Download PDF</th>
              </tr>
            </thead>
            <tbody>
              {users.map((student, index) => (
                <tr key={index}>
                  <td>{student.id}</td>
                  <td>{student.username}</td>
                  <td>{student.registerNo}</td>
                  <td>{student.fatherName}</td>
                  <td>{student.dob}</td>
                  <td>{student.qualification}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.whatsappNumber}</td>
                  <td>{student.fatherPhoneNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.aadhaarNumber}</td>
                  <td>{student.caste}</td>
                  <td>{student.bloodGroup}</td>
                  <td>{student.exServiceman === 'yes' ? 'Yes' : 'No'}</td>
                  <td>{student.destitute === 'yes' ? 'Yes' : 'No'}</td>
                  <td>
                    {student.pstmtenth && '10th '}
                    {student.pstmtowelth && '12th '}
                    {student.pstmug && 'UG '}
                    {student.pstmpg && 'PG'}
                  </td>
                  <td>{student.address}</td>
                  <td>{student.paymentId}</td>
                  <td className="text-center">
                    <DownloadPDFButton userId={student.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <h2 className="text-center mt-5 mb-5">No user details available.</h2>
      )}
    </div>
  );
}
