import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { tnusrbApi } from '../../../Bharathi/Api/Api';

const TnusrbStudent = () => {
  const [tnusrbList, setTnusrbList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTnusrbList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tnusrbApi.common.getAll();
      if (Array.isArray(response.data)) {
        setTnusrbList(response.data);
      } else {
        setTnusrbList([]);
      }
    } catch (err) {
      console.error('Failed to load TNUSRB student materials:', err);
      setError('Unable to load materials from database');
      setTnusrbList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTnusrbList();
  }, []);

  const downloadFile = async (id, fallbackTitle) => {
    try {
      const response = await tnusrbApi.common.download(id);
      const contentDisposition = response.headers && response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.split(';')[0]?.replace(/"/g, '')
        : `${fallbackTitle || 'TNUSRB_Material'}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const TnusrbCard = ({ tnusrb }) => (
    <div className="col mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-3">
        <div className="card-body d-flex flex-column">
          <FontAwesomeIcon icon={faFilePdf} className="text-danger mb-3" style={{ fontSize: '2rem' }} />
          <h5 className="card-title fw-bold">{tnusrb.syllabus || tnusrb.title || 'TNUSRB Material'}</h5>
          <h6 className="card-subtitle mb-3 text-muted">{tnusrb.subject || tnusrb.paper || 'Study Material'}</h6>
          <div className="mt-auto">
            <button className="btn btn-primary w-100" onClick={() => downloadFile(tnusrb.id, tnusrb.syllabus)}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary fa-2x mb-3" />
          <p className="text-muted">Loading study materials dynamically from database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-warning text-center" role="alert">
          {error}
        </div>
      ) : tnusrbList.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No study materials uploaded yet.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {tnusrbList.map((tnusrb) => (
            <TnusrbCard key={tnusrb.id} tnusrb={tnusrb} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TnusrbStudent;
