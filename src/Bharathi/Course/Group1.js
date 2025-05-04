import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './Group.css';

const Group1 = () => {
  const [group1List, setGroup1List] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/faculty/all');
        setGroup1List(response.data);
      } catch (error) {
        console.error('Error fetching Group1 list:', error);
      }
    };

    fetchGroup1List();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/api/faculty/download/${id}`, {
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

  const openPDFViewer = (group1) => {
    setCurrentGroup(group1);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="group-details container">
      {/* <h2 className='text-center'id='title'>Bharathi Thervu Kalam</h2> */}
      <h2 className='text-center' >TNPSC GROUP-I</h2>
      <Container>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light" >
              <h3 id="grop">Tamil Nadu Public Service Commission</h3>
              <p id="para">
                TNPSC is responsible for recruiting personnel to the civil services in Tamil Nadu. TNPSC deals with all
                matters relating to methods of recruitment to Civil Services and for civil posts and also on the
                principles to be followed in making appointments to Civil services and posts and in making promotions
                and transfers. TNPSC job notifications are common and usually rolled out by TNPSC every year to recruit
                the civil servants to work under the Government of Tamil Nadu directly.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light ">
              <h3 id='grop'>TNPSC Group I Services (Posting)</h3>
              <ListGroup variant="flush" id='para'>
                <ListGroup.Item>Deputy Collector</ListGroup.Item>
                <ListGroup.Item>Deputy Superintendent of Police (Category-I)</ListGroup.Item>
                <ListGroup.Item>Deputy Registrar of Co-operative Societies</ListGroup.Item>
                <ListGroup.Item>Assistant Director of Rural Development Department</ListGroup.Item>
                <ListGroup.Item>Assistant Commissioner in the Tamil Nadu Hindu Religious and Charitable Endowments Administration Department</ListGroup.Item>
                <ListGroup.Item>Assistant Commissioner – Commercial Tax officer</ListGroup.Item>
                <ListGroup.Item>District Registrar</ListGroup.Item>
                <ListGroup.Item>Divisional Officer in Fire and Rescue services Department</ListGroup.Item>
                <ListGroup.Item>Assistant Conservator of Forest</ListGroup.Item>
                <ListGroup.Item>District Employment Officer</ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light"  >
              <h4 id="grop">Qualification</h4>
              <p id="para">Any Degree / final year student also apply posting.</p>
              <h4 id="grop">Selection Process</h4>
              <ul id="para">
                <li>Preliminary Examination</li>
                <li>Main Written Examination</li>
                <li>Interview</li>
              </ul>
              <h4 id="grop">Age Limit</h4>
              <ul id="para">
                <li>Minimum Age: 21 years</li>
                <li>Maximum Age: BC/MBC/SC/ST – 35 Years, Others - 30 Years</li>
                <li>BL Degree: BC/MBC/SC/ST – 36 Years, Others - 31 Years</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h3 id="grop">Preliminary Exam</h3>
              <p id="para">200 Questions (Objective Type – 3 hours) - 300 Marks</p>
              <ul id="para">
                <li>General Studies – 175</li>
                <li>Aptitude & Mental Ability – 25</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h3 id="grop">Main Exam</h3>
              <ul id="para">
                <li>Paper I – 300 mark (3 hours – descriptive type)</li>
                <li>Paper II – 300 mark (3 hours – descriptive type)</li>
                <li>Paper III – 300 mark (3 hours – descriptive type)</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h3 id="grop">Interview</h3>
              <p id="para">120 mark</p>
            </div>
          </Col>
        </Row>
      </Container>

      {message && <p className="message">{message}</p>}


      <h2 className='text-center'>TNPSC Group-I Syllabus & Notes</h2>
      <div className="card-container">
     

        {group1List.map((group1) => (
          
          <div className="mb-5" key={group1.id}>
            
            <Card className="mb-1" style={{ width: '18rem' }}>
              <Card.Body>
                <FontAwesomeIcon icon={faFilePdf} className="icon-large" />
                <Card.Title>{group1.syllabus}</Card.Title>
                <Card.Text>{group1.paper}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{group1.subject}</Card.Subtitle>
                <Button className="mr-2" onClick={() => openPDFViewer(group1)}>
                  View PDF
                </Button>
                <Button onClick={() => downloadFile(group1.id)}>Download PDF</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal for PDF Viewer */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentGroup && currentGroup.syllabus}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentGroup && (
            <iframe
              src={`https://www.bharathithervukalam.com/api/faculty/view/${currentGroup.id}`} // Correctly constructed URL
              width="100%"
              height="500px"
              title="PDF Viewer"
            ></iframe>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Group1;
