import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../POST/Tnusrb.css';

const Tnusrb = () => {
  const [tnusrbList, setTnusrbList] = useState([]);

  const fetchTnusrbList = async () => {
    try {
      const response = await axios.get('https://www.bharathithervukalam.com/tnusrb/ALL');
      setTnusrbList(response.data);
    } catch (error) {
      console.error('Error fetching Tnusrb list:', error);
    }
  };

  useEffect(() => {
    fetchTnusrbList();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/tnusrb/download/${id}`, {
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
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th scope='col'>Id</th>
              <th scope="col">Syllabus</th>
              <th scope="col">Subject</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tnusrbList.map((tnusrb) => (
              <tr key={tnusrb.id}>
                <td>{tnusrb.id}</td>
                <td>{tnusrb.syllabus}</td>
                <td>{tnusrb.subject}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => downloadFile(tnusrb.id)}>
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tnusrb;
