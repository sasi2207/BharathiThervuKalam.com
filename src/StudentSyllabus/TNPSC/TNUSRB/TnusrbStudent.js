import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { tnusrbApi } from '../../../Bharathi/Api/Api';

const DEFAULT_TNUSRB_MATERIALS = [
  { id: 1, syllabus: 'TNUSRB SI Technical - Electronics & Communications', subject: 'Core Technical Syllabus & Model Questions' },
  { id: 2, syllabus: 'TNUSRB SI Finger Print - Forensic Chemistry & Biology', subject: 'Forensic & Mental Ability Study Guide' },
  { id: 3, syllabus: 'TNUSRB Common Recruitment - Police Constables', subject: 'Tamil Eligibility & General Knowledge Notes' }
];

const TnusrbStudent = () => {
  const [tnusrbList, setTnusrbList] = useState([]);

  const fetchTnusrbList = async () => {
    try {
      const response = await tnusrbApi.common.getAll();
      if (Array.isArray(response.data) && response.data.length > 0) {
        setTnusrbList(response.data);
      } else {
        setTnusrbList(DEFAULT_TNUSRB_MATERIALS);
      }
    } catch (error) {
      setTnusrbList(DEFAULT_TNUSRB_MATERIALS);
    }
  };

  useEffect(() => {
    fetchTnusrbList();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await tnusrbApi.common.download(id);
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
      const link = document.createElement('a');
      link.href = '/SUNDAY GRP 4 SCHEDULE -2026.pdf';
      link.setAttribute('download', 'TNUSRB_Study_Material.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
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
