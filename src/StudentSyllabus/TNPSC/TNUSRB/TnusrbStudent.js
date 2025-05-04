import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import TnusrbForm from '../GET/TnusrbFrom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';


const TnusrbStudent = () => {
  const [tnusrbList, setTnusrbList] = useState([]);

  const fetchTnusrbList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tnusrb/ALL');
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
      const response = await axios.get(`http://localhost:8080/tnusrb/download/${id}`, {
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

  const TnusrbCard = ({ tnusrb }) => (
    <div className="col mb-4">
      <div className="card h-100">
        <div className="card-body">
          <FontAwesomeIcon icon={faFilePdf} className="icon-large" />
          <h5 className="card-title title-large">{tnusrb.syllabus}</h5>
          <h6 className="card-subtitle mb-2 text-muted subtitle-large">{tnusrb.subject}</h6>
          <button className="btn btn-primary" onClick={() => downloadFile(tnusrb.id)}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* <h2 className="my-4 text-center heading-large">Tnusrb Records</h2> */}
      {/* <TnusrbForm fetchTnusrbList={fetchTnusrbList} /> */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {tnusrbList.map((tnusrb) => (
          <TnusrbCard key={tnusrb.id} tnusrb={tnusrb} />
        ))}
      </div>
    </div>
  );
};

export default TnusrbStudent;
