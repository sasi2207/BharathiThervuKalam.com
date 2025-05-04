import React from 'react';
import { Container, Row, Col, ListGroup,Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button,  Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Group4() {


  const [group1List, setGroup1List] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/group4/all');
        setGroup1List(response.data);
      } catch (error) {
        console.error('Error fetching Group1 list:', error);
      }
    };

    fetchGroup1List();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/api/group4/download/${id}`, {
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
    <div className="container">
      {/* <h1 id='title' >Bharathi Thervu Kalam</h1> */}
      <h2 className='text-center'>TNPSC GROUP-IV</h2>
      <Container>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h4 id='grop'>Tamil Nadu Public Service Commission</h4>
              <p id='para'>
                TNPSC is responsible for recruiting personnel to the civil services in Tamil Nadu. TNPSC deals with all matters relating to methods of recruitment to Civil Services and for civil posts and also on the principles to be followed in making appointments to Civil services and posts and in making promotions and transfers. TNPSC job notifications are common and usually rolled out by TNPSC every year to recruit the civil servants to work under the Government of Tamil Nadu directly.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h4 id='grop'>Group IV – Services (Posting)</h4>
              <ListGroup variant="flush" id='para'>
                <ListGroup.Item>Junior Assistant</ListGroup.Item>
                <ListGroup.Item>Typist</ListGroup.Item>
                <ListGroup.Item>Steno Typist − Grade III</ListGroup.Item>
                <ListGroup.Item>EXECUTIVE OFFICER, GRADE-III in the Tamil Nadu Hindu Religious and Charitable Endowments Administration Department</ListGroup.Item>
                <ListGroup.Item>Junior Assistant (Security)</ListGroup.Item>
                <ListGroup.Item>Bill Collector Grade-I</ListGroup.Item>
                <ListGroup.Item>Junior Assistant (Non-Security)</ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h4 id='grop'>Mode of Exam</h4>
              <p id='para'>Offline</p>
              <h4 id='grop'>Mode of Counselling</h4>
              <p id='para'>Offline</p>
              <h4 id='grop'>Qualification</h4>
              <p id='para'>Minimum 10th std</p>
              <h4 id='grop'>Selection Process</h4>
              <ul id='para'>
                <li>Written Test (Objective Type Exam)</li>
                <li>Document Verification (Certificate Verification)</li>
              </ul>
              <h4 id='grop'>Language of Exam</h4>
              <ul id='para'>
                <li>English</li>
                <li>Tamil</li>
              </ul>
              <h4 id='grop'>Duration of Exam</h4>
              <p id='para'>3 hours</p>
              <h4 id='grop'>Age Limit</h4>
              <p id='para'>18-42 years</p>
            </div>
          </Col>
        </Row>
        
      </Container>


      <h2 className='text-center'>TNPSC Group-IV Syllabus & Notes</h2>
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
              src={`https://www.bharathithervukalam.com/api/group4/view/${currentGroup.id}`} // Correctly constructed URL
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
}
