import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button,  Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Group2() {


  const [group1List, setGroup1List] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/group2/all');
        setGroup1List(response.data);
      } catch (error) {
        console.error('Error fetching Group1 list:', error);
      }
    };

    fetchGroup1List();
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/api/group2/download/${id}`, {
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
      {/* <h2 className='text-center'id='title' >Bharathi Thervu Kalam</h2> */}
      <h2 className='text-center' >TNPSC GROUP-II</h2>
      <Container>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h3 id='grop'>Tamil Nadu Public Service Commission</h3>
              <p id='para'>
                TNPSC is responsible for recruiting personnel to the civil services in Tamil Nadu. TNPSC deals with all matters relating to methods of recruitment to Civil Services and for civil posts and also on the principles to be followed in making appointments to Civil services and posts and in making promotions and transfers. TNPSC job notifications are common and usually rolled out by TNPSC every year to recruit the civil servants to work under the Government of Tamil Nadu directly.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <div className="p-5 border bg-light">
              <h3 id='grop'>Group II – Interview Post Services (Posting)</h3>
              <ListGroup variant="flush" id='para'>
                <ListGroup.Item>Deputy Commercial Tax Officer (DCTO)</ListGroup.Item>
                <ListGroup.Item>Sub Registrar</ListGroup.Item>
                <ListGroup.Item>Probation Officer in the Prison Department</ListGroup.Item>
                <ListGroup.Item>Assistant Inspector of Labour</ListGroup.Item>
                <ListGroup.Item>Junior Employment Officer</ListGroup.Item>
                <ListGroup.Item>Assistant Section Officer in Law Department/ TNPSC/ Finance Department/ Various Departments in the Tamil Nadu Ministerial Service/ Secretariat Service</ListGroup.Item>
                <ListGroup.Item>Assistant Inspector in Local Fund Audit Department</ListGroup.Item>
                <ListGroup.Item>Special Assistant in the Vigilance and Anti-Corruption Department</ListGroup.Item>
                <ListGroup.Item>Audit Inspector in the Audit Wing of Hindu Religious and Charitable Endowments</ListGroup.Item>
                <ListGroup.Item>Supervisor of Industrial Co-operatives</ListGroup.Item>
                <ListGroup.Item>Senior Inspector of cooperative societies</ListGroup.Item>
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
              <p id='para'> Any Degree / final year student also apply posting.</p>
              <h4 id='grop'>Selection Process</h4>
              <ul id='para'>
                <li>Preliminary Examination</li>
                <li>Main Written Examination</li>
                <li>Interview</li>
              </ul>
              <h4 id='grop'>Language of Exam</h4>
              <ul id='para'>
                <li>English</li>
                <li>Tamil</li>
              </ul>
              <h4 id='grop'>Duration of Exam</h4>
              <ul id='para'>
                <li>Prelims: 3 hours</li>
                <li>Mains: 1 hour 30 minutes (Paper I) + 3 hours (Paper II)</li>
              </ul>
              <h4 id='grop'>Age Limit</h4>
              <p id='para'>18-32 years</p>
              <h4 id='grop'>Pattern</h4>
              <ul id='para'>
                <li>Preliminary Examination: 300 Marks – 1 Hour 30 Mins</li>
                <li>Main Paper I: 300 Marks – 1 Hour 30 Mins</li>
                <li>Main Paper II: 300 Marks – 3 Hours</li>
                <li>Interview: 40 Marks</li>
              </ul>
            </div>
          </Col>
        </Row>
      
      </Container>



      {/* {message && <p className="message">{message}</p>} */}

      <h2 className='text-center'>TNPSC Group-II Syllabus & Notes</h2>
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
              src={`https://www.bharathithervukalam.com/api/group2/view/${currentGroup.id}`} // Correctly constructed URL
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
