import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Logo1 from './img1/Logo.png'
import './Model.css'
const MyModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered  >
      <Modal.Header closeButton>
        {/* <Modal.Title>BharathiThervukalam</Modal.Title> */}
      </Modal.Header>
      <Modal.Body >
        <div className='container'>

        <img src={Logo1} className='img-container' ></img>
       

        </div>
       
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default MyModal;
