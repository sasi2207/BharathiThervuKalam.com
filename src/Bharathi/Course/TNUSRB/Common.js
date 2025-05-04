import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button,  Card ,Spinner} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';
const Common = () => {

  const [group1List, setGroup1List] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false); // Loading state for file download

  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/tnusrbs/view');
        setGroup1List(response.data);
      } catch (error) {
        console.error('Error fetching Group1 list:', error);
      }
    };

    fetchGroup1List();
  }, []);


  const downloadFile = async (id) => {
    setDownloadLoading(true); // Start loading
    try {
      const response = await axios.get(`https://www.bharathithervukalam.com/api/tnusrbs/download/${id}`, {
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
      Swal.fire('Error', 'Failed to download file', 'error');
      console.error('Error downloading file:', error);
    } finally {
      setDownloadLoading(false); // End loading
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
    <div className="container ">
      <h2 className="text-center mb-4" >Common Recruitment for Various Posts</h2>
      
      <div className=" mb-4 border bg-light p-5">
        <div className="">
          <h4 id='grop'>1. Educational Qualification</h4>
        </div>
        <div className="">
          <ul id='para'>
            <li>Candidate should have passed 10th Standard/SSLC.</li>
            <li>Those who have not passed 10th standard and have more than that qualification are ineligible to apply.</li>
          </ul>
        </div>
      </div>
      
      <div className=" mb-4 border bg-light p-5">
        <div className="">
          <h4 id='grop'>2. Age Limits for All the Posts</h4>
        </div>
        <div className="">
          <p id='para'>The applicant should have completed the age of 18 years and should not be aged above 26 years as on 1st July of the Notification year.</p>
          <table className="table table-bordered" >
            <thead>
              <tr>
                <th>Category</th>
                <th>Upper Age Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backward Class, Backward Class (Muslim), Most Backward Class/ Denotified Community</td>
                <td>28 yrs</td>
              </tr>
              <tr>
                <td>Scheduled Caste, Scheduled Caste (Arunthathiyar), Scheduled Tribe</td>
                <td>31 yrs</td>
              </tr>
              <tr>
                <td>Transgender</td>
                <td>31 yrs</td>
              </tr>
              <tr>
                <td>Destitute Widow</td>
                <td>37 yrs</td>
              </tr>
              <tr>
                <td>Ex-servicemen (Discharged from service within 3 years preceding from the date of notification) / Serving persons who are going to retire within one year from the last date of receipt of application</td>
                <td>47 yrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className=" mb-4 border bg-light p-5">
        <div className="">
          <h4 id='grop'>3. Communal Reservation</h4>
        </div>
        <div className="">
          <ul id='para'>
            <li>The following communal reservation will be followed as per existing rules and Government Orders:</li>
          </ul>
          <table className="table table-bordered" id='para'>
            <thead>
              <tr>
                <th>Category</th>
                <th>Reservation Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Open Competition</td>
                <td>31%</td>
              </tr>
              <tr>
                <td>Backward Class</td>
                <td>26.5%</td>
              </tr>
              <tr>
                <td>Backward Class (Muslim)</td>
                <td>3.5%</td>
              </tr>
              <tr>
                <td>Most Backward Class / Denotified Communities</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>Scheduled Caste</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>Scheduled Caste (Arunthathiyar)</td>
                <td>3%</td>
              </tr>
              <tr>
                <td>Scheduled Tribe</td>
                <td>1%</td>
              </tr>
            </tbody>
          </table>
          <p id='para'>Community Certificate issued by Tamil Nadu Government only will be considered for communal reservation.</p>
        </div>
      </div>




      <div >
      
      
      <div className=" bg-light p-5 mb-4">
        <div className="" >
          <h4 id='grop'>I. Eligibility for Applying under 10% Sports Quota</h4>
        </div>
        <div id='para'>
          <p id='para'>
            Candidates applying under the 10% Sports Quota should fulfill all the norms prescribed for open candidates. In addition, the candidate is required to produce Form-I/Form-II/Form-III for the approved 16 games/sports for an event held within 5 years preceding the date of notification.
          </p>
          <p id='para'>Details of certificates required for claiming sports quota:</p>
          <table className="table table-bordered" >
            <thead>
              <tr>
                <th>Name of the Form</th>
                <th>Level of Participation</th>
                <th>Issuing Authority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FORM-I</td>
                <td>Represented India at International Competition</td>
                <td>Secretary of the National Federation of the game concerned</td>
              </tr>
              <tr>
                <td>FORM-II</td>
                <td>Represented Tamil Nadu State at National Level Competition</td>
                <td>Secretary of the National Federation or Secretary of the State Association of the game concerned</td>
              </tr>
              <tr>
                <td>FORM-III</td>
                <td>Represented Tamil Nadu University at Inter-University Competition</td>
                <td>Director or other officer in-charge of sports in the University</td>
              </tr>
            </tbody>
          </table>
          <p id='para'>List of approved Games and Sports:</p>
          <ul>
            <li>Basketball</li>
            <li>Football</li>
            <li>Hockey</li>
            <li>Volleyball</li>
            <li>Handball</li>
            <li>Kabbadi</li>
            <li>Wrestling</li>
            <li>Boxing</li>
            <li>Gymnastics</li>
            <li>Judo</li>
            <li>Weight Lifting</li>
            <li>Aquatics (Swimming)</li>
            <li>Athletics</li>
            <li>Equitation (Horse riding)</li>
            <li>Rifle Shooting</li>
            <li>Silambam</li>
          </ul>
        </div>
      </div>
      
      <div className=" bg-light p-5 mb-4">
        <div className="">
          <h4 id='grop'>II. 5% Reservation</h4>
        </div>
        <div className="">
          <ul id='para'>
            <li>5% of the vacancies will be reserved for Ex-servicemen (Discharged from service within 3 years preceding from the date of notification) / Serving persons who are going to retire within one year from the last date of receipt of application.</li>
            <li>If the Ex-servicemen fail to upload their discharge certificate, their application will not be considered under the Ex-Serviceman category.</li>
            <li>The serving Armed Forces personnel who are going to retire within one year from the last date of receipt of online application should upload a certificate with a self-undertaking, obtained from the Commanding Officer of their unit in the prescribed format. Failing which they will not be considered for this reservation.</li>
            <li>The Ex-Servicemen who have not completed 3 years after discharge from service only are eligible for applying for this recruitment.</li>
          </ul>
        </div>
      </div>
      
      <div className=" mb-4 bg-light p-5">
        <div className="">
          <h4 id='grop'>III. Destitute Widow</h4>
        </div>
        <div className="">
          <ul id='para'>
            <li>3% of the vacancies in the District/City Armed reserve (women) and prison warder (women) will be allocated for destitute widows.</li>
            <li>Destitute Widow candidates should obtain a “Destitute Widow Certificate” from the Revenue Divisional Officer / Sub-Collector / Assistant Collector and upload the same along with the online application. Failing which they will not be considered under the Destitute Widow category.</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>5. 20% PSTM Preference</h4>
        </div>
        <div >
          <p id='para'>
            20% of all vacancies shall be set apart on a preferential basis for candidates who studied in Tamil Medium from 1st standard to 10th standard based on their community.
          </p>
        </div>
      </div>

      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>6. Transgender</h4>
        </div>
        <div>
          <ul id='para'>
            <li>
              The Transgender candidates may decide their self-identified gender such as Male, Female, or Third Gender. A Transgender candidate applying under the third gender should upload an Identity Card obtained from the Tamil Nadu Transgender Welfare Board.
            </li>
            <li>
              If a transgender candidate chooses the gender as Male, they should participate in the Physical Measurement Test, Endurance Test, Physical Efficiency Test, and Certificate Verification along with Male candidates. If choosing Female, they should participate along with Female candidates.
            </li>
            <li>
              Transgender candidates applying under Third Gender will be treated like Female candidates.
            </li>
            <li>
              Transgender candidates producing their community certificate will get the benefit of communal reservation like other candidates.
            </li>
            <li>
              If they do not produce their community certificate, they will be treated as Most Backward Class category.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>7. Marks Allocation</h4>
        </div>
        <div >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Written Examination</td>
                <td>70 Marks</td>
              </tr>
              <tr>
                <td>Physical Efficiency Test</td>
                <td>24 Marks</td>
              </tr>
              <tr>
                <td>Special Marks</td>
                <td>6 Marks</td>
              </tr>
              <tr>
                <th>Total</th>
                <th>100 Marks</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>8. Written Examination</h4>
        </div>
        <div >
          <h5 id='sum'>Part I. Tamil Language Eligibility Test:</h5>
          <ul id='para'>
            <li>The Tamil Language Eligibility Test is qualifying in nature.</li>
            <li>It will be objective type in nature.</li>
            <li>Consists of 80 questions for 80 marks, with a duration of 80 minutes (1 Hr. 20 mins).</li>
            <li>A minimum of 40% marks is required to qualify for the next level of evaluation of the main examination OMR answer sheet.</li>
            <li>The marks obtained in the Tamil Language Eligibility Test will not be considered for the preparation of the provisional selection list at any stage.</li>
          </ul>
          <h5 id='sum'>Part II. Main Written Examination:</h5>
          <ul id='para'>
            <li>Part-A: General Knowledge – 45 Marks (objective type questions).</li>
            <li>Part-B: Psychology – 25 Marks (objective type questions).</li>
            <li>Duration: 1 hr 20 min</li>
            <li>A minimum of 25 marks is required to qualify in the written examination.</li>
          </ul>
        </div>
      </div>



      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>9. Physical Measurement Test</h4>
        </div>
        <div className="bg-light p-5">
          <h5 id='sum'>Men:</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Category</th>
                <th>Height</th>
                <th>Chest Measurement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OC, BC, BC(M), MBC/DNC</td>
                <td>Minimum 170cms</td>
                <td>Normal: Minimum 81cms<br />Expansion: Minimum 5 cms, 86 cms on expansion</td>
              </tr>
              <tr>
                <td>SC, SC (A), ST</td>
                <td>Minimum 167cms</td>
                <td>Normal: Minimum 81cms<br />Expansion: Minimum 5 cms, 86 cms on expansion</td>
              </tr>
            </tbody>
          </table>

          <h5 id='sum'>Women and Transgender:</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Category</th>
                <th>Height</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OC, BC, BC(M), MBC/DNC</td>
                <td>Minimum 159cms</td>
              </tr>
              <tr>
                <td>SC, SC (A), ST</td>
                <td>Minimum 157cms</td>
              </tr>
            </tbody>
          </table>

          <p id='para'>Ex-servicemen (Discharged within 3 years) / Serving personnel retiring within one year are exempted from the Physical Measurement Test.</p>
        </div>
      </div>

      {/* Endurance Test */}
      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>10. Endurance Test</h4>
        </div>
        <div className="bg-light p-5">
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Category</th>
                <th>Test</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Men</td>
                <td>1500 metres run</td>
                <td>7 minutes</td>
              </tr>
              <tr>
                <td>Women/Transgender</td>
                <td>400 metres run</td>
                <td>2 minutes 30 seconds</td>
              </tr>
              <tr>
                <td>Ex-servicemen/Serving personnel retiring within one year</td>
                <td>1500 metres run</td>
                <td>8 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Physical Efficiency Test */}
      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>11. Physical Efficiency Test</h4>
        </div>
        <div className="bg-light p-5">
          <h5 id='sum'>Men Candidates:</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Event</th>
                <th>One Star (4 Marks)</th>
                <th>Two Stars (8 Marks)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rope Climbing</td>
                <td>5.0 metres</td>
                <td>6.0 metres</td>
              </tr>
              <tr>
                <td>Long Jump / High Jump</td>
                <td>Long Jump: 3.80 metres<br />High Jump: 1.20 metres</td>
                <td>Long Jump: 4.50 metres<br />High Jump: 1.40 metres</td>
              </tr>
              <tr>
                <td>100 mts run / 400 mts run</td>
                <td>100 mts: 15.00 seconds<br />400 mts: 80.00 seconds</td>
                <td>100 mts: 13.50 seconds<br />400 mts: 70.00 seconds</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>Three chances will be given for rope climbing.</li>
            <li>Three chances will be given for long jump/high jump, with the highest score considered.</li>
            <li>Only one chance for 100 metres/400 metres run.</li>
          </ul>

          <h5 id='sum'>Women and Transgender Candidates:</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Event</th>
                <th>One Star (4 Marks)</th>
                <th>Two Stars (8 Marks)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Long Jump</td>
                <td>3.0 metres</td>
                <td>3.75 metres</td>
              </tr>
              <tr>
                <td>Shotput / Cricket Ball Throw</td>
                <td>Shotput (4 kg): 4.25 metres<br />Cricket Ball Throw: 17 metres</td>
                <td>Shotput (4 kg): 5.50 metres<br />Cricket Ball Throw: 24 metres</td>
              </tr>
              <tr>
                <td>100 mts run / 200 mts run</td>
                <td>100 mts: 17.50 seconds<br />200 mts: 38.00 seconds</td>
                <td>100 mts: 15.50 seconds<br />200 mts: 33.00 seconds</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>Three chances for long jump and shotput/cricket ball throw.</li>
            <li>Only one chance for 100 metres/200 metres run.</li>
          </ul>

          <h5 id='sum'>Ex-servicemen and Serving Personnel Retiring Within One Year:</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Event</th>
                <th>One Star (4 Marks)</th>
                <th>Two Stars (8 Marks)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Shotput (7.26 kg)</td>
                <td>5.0 metres</td>
                <td>6.0 metres</td>
              </tr>
              <tr>
                <td>Long Jump / High Jump</td>
                <td>Long Jump: 3.25 metres<br />High Jump: 0.90 metres</td>
                <td>Long Jump: 4.50 metres<br />High Jump: 1.40 metres</td>
              </tr>
              <tr>
                <td>100 mts run / 400 mts run</td>
                <td>100 mts: 17.00 seconds<br />400 mts: 85.00 seconds</td>
                <td>100 mts: 13.50 seconds<br />400 mts: 70.00 seconds</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>Three chances for shotput and long jump/high jump.</li>
            <li>Only one chance for 100 metres/400 metres run.</li>
          </ul>
        </div>
      </div>
       


      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>12. Original Certificate Verification</h4>
        </div>
        <div >
          <p id='para'>Candidates called for certificate verification must produce their original certificates that were uploaded during the online application submission. Failure to produce the original certificates will result in the loss of claims related to communal reservation, age relaxation, and special quota. New certificates or claims beyond what was uploaded will not be accepted.</p>
        </div>
      </div>

      {/* Special Marks */}
      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>13. Special Marks for NCC/NSS/Sports/Games</h4>
        </div>
        <div >
          <h5 id='sum'>a) National Cadet Corps (NCC) (Maximum 2 Marks):</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Certificate</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>One Year Member / “A” Certificate</td>
                <td>½ Mark</td>
              </tr>
              <tr>
                <td>Possession of “B” Certificate</td>
                <td>1 Mark</td>
              </tr>
              <tr>
                <td>Possession of “C” Certificate / Under Officer Best Cadet in All India Level</td>
                <td>2 Marks</td>
              </tr>
            </tbody>
          </table>

          <h5 id='sum'>b) National Service Scheme (NSS) (Maximum 2 Marks):</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Certificate/Participation</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>State Youth Award, National Youth Award, Participation in Interstate or International Programme, etc.</td>
                <td>2 Marks</td>
              </tr>
              <tr>
                <td>Completion of 2 years / Participation in NSS with norms as per G.O.No.8 dated:21.01.2002</td>
                <td>1 Mark</td>
              </tr>
              <tr>
                <td>Best Volunteer for Participation in Inter District Competition</td>
                <td>½ Mark</td>
              </tr>
            </tbody>
          </table>

          <h5 id='sum'>c) Sports / Games (Maximum 2 Marks):</h5>
          <table className="table table-bordered mb-3">
            <thead>
              <tr>
                <th>Level of Representation</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Represented School in District Level</td>
                <td>½ Mark</td>
              </tr>
              <tr>
                <td>Represented College in Zonal Level (Inter Collegiate)</td>
                <td>½ Mark</td>
              </tr>
              <tr>
                <td>Represented University (Form-III) (Inter University)</td>
                <td>1 Mark</td>
              </tr>
              <tr>
                <td>Represented District in Inter District Tournament</td>
                <td>1 Mark</td>
              </tr>
              <tr>
                <td>Represented State (Form-II) (Tamil Nadu)</td>
                <td>1½ Marks</td>
              </tr>
              <tr>
                <td>Represented Nation in International Competition (Form-I) (India)</td>
                <td>2 Marks</td>
              </tr>
            </tbody>
          </table>
          <p id='para'>Only the highest certificate yielding maximum marks will be considered. A maximum of 6 marks can be claimed under special marks for NCC/NSS/Sports/Games.</p>
        </div>
      </div>

      {/* Final Provisional Select List */}
      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>14. Final Provisional Select List</h4>
        </div>
        <div id='para'>
          <p id='para'>
            a. The Provisional Select List will be based on the total marks obtained in the Written Examination, Physical Efficiency Test, and Special Marks for NCC/NSS/Sports/Games, subject to communal reservation and total vacancies.
          </p>
          <p id='para'>
            b. In case of a tie in marks, priority will be given based on the date of birth and age. If marks and date of birth are the same, preference will be given to candidates who are outstanding scouts with awards from the President of India.
          </p>
          <p id='para'>
            c. 20% of vacancies are reserved preferentially for candidates who studied in Tamil Medium from 1st to 10th standard.
          </p>
          <p id='para'>
            b. Provisionally selected candidates must undergo medical examination and verification of character and antecedents through the Police Department.
          </p>
        </div>
      </div>

      {/* Examination Fee */}
      <div className="bg-light p-5 mb-4">
        <div >
          <h4 id='grop'>15. Examination Fee</h4>
        </div>
        <div >
          <p id='para'>The Examination fee is Rs.250/-. It should be paid through SBI Bank e-challan or online payment only. Other payment methods are not accepted.</p>
        </div>
      </div>
          
          
      <h2 className='text-center'>Common Recruitment for Various Posts Syllabus & Notes</h2>
      <div className="card-container">
     

        {group1List.map((group1) => (
          
          <div className="mb-5" key={group1.id}>
            
            <Card className="mb-1" style={{ width: '18rem' }}>
              <Card.Body>
                <FontAwesomeIcon icon={faFilePdf} className="icon-large" />
                <Card.Title>{group1.syllabus}</Card.Title>
                <Card.Text>{group1.paper}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{group1.subject}</Card.Subtitle>
                {/* <Button className="mr-2" onClick={() => openPDFViewer(group1)}>
                  View PDF
                </Button> */}
             <Button 
  className="btn btn-primary mr-2" 
  onClick={() => downloadFile(group1.id)} 
  disabled={downloadLoading}
>
  {downloadLoading ? (
    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
  ) : (
    'Download PDF'
  )}
</Button>

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

export default Common;
