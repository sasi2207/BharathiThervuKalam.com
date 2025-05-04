// RecruitmentPage.js

import React from 'react';
import './RecruitmentPage.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button,  Card ,Spinner} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';
const RecruitmentPage = () => {

  const [group1List, setGroup1List] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false); // Loading state for file download

  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/technical/view');
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
      const response = await axios.get(`https://www.bharathithervukalam.com/api/technical/download/${id}`, {
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
    <div className="container  ">
      <h2 className='text-center' >Recruitment for the Post of Sub-Inspector of Police (Technical)</h2>

      <section className=" p-5 border bg-light mt-5">
        <h2 id='grop'>1. Age</h2>
        <p id='para'>
          The applicant should have completed the age of 20 years and should not be aged above 30 years as on 1st July of the Notification year.
          <br />
          <br />
          <strong id='grop'>Upper age limit relaxation:</strong>
          <ul>
            <li>Backward Class, Backward Class (Muslim), Most Backward Class/Denotified Community: 32 yrs</li>
            <li>Scheduled Caste, Scheduled Caste (Arunthathiyar), Scheduled Tribe: 35 yrs</li>
            <li>Transgender, Destitute Widow: 35 yrs</li>
            <li>Ex-servicemen, Police Departmental candidates: 47 yrs</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>2. Educational Qualification</h2>
        <p id='para'>
          Candidates should possess minimum a second class diploma in Electronics and Communication Engineering awarded by the State Board of Technical Education, Tamil Nadu or a Degree (B.E/B.Tech) in Electronics and Communication engineering recognised by All India Council for Technical Education.
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>3. Communal Reservation</h2>
        <p id='para'>
            <strong>Communal reservation details:</strong>
          
          <ul id='para'>
            <li>Open Competition: 31%</li>
            <li>Backward Class: 26.5%</li>
            <li>Backward Class (Muslim): 3.5%</li>
            <li>Most Backward Class / Denotified Communities: 20%</li>
            <li>Scheduled Caste: 15%</li>
            <li>Scheduled Caste (Arunthathiyar): 3%</li>
            <li>Scheduled Tribe: 1%</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>4. 20% Police Departmental Quota</h2>
        <p id='para'>
          Police Constables and Head Constables and their equivalent ranks in the Taluk, Armed Reserve Police and Tamil Nadu Special Police can apply under 20% Departmental Quota. They should have completed 5 years of service as on the date of notification. Candidates applying under 20% departmental quota are exempted from Physical Measurement Test. However, they are required to attend the Certificate verification 1:5 ratio and Viva-Voce in 1:3 ratio.
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>5. Concessions for Special Categories</h2>
        <p id='para'>
          <strong>A. Ex-Servicemen / Serving Persons who are going to retire within one year from the last date of receipt of application:</strong>
          <ul id='para'>
            <li>Age Relaxation: The upper age limit shall be 47 years on the 1st July of the notification year.</li>
            <li>The Ex-servicemen who have not completed three years of period after discharge from service and the Armed Forces serving personnel who are going to retire within one year from the last date of receipt of online application only can apply for this recruitment.</li>
            <li>They should attend the Written Examination, Physical Measurement Test (PMT), Certificate Verification and Viva-Voce.</li>
          </ul>

          <strong>B. Destitute Widow:</strong>
          <ul>
            <li>Age Relaxation: The upper age limit shall be 37 years as on the 1st July of the notification year.</li>
            <li>The Destitute Widow candidates should obtain “Destitute Widow Certificate” from the Revenue Divisional Officer / Sub-Collector / Assistant Collector and upload the same along with the online application. Failing which they will not be considered under Destitute Widow category.</li>
          </ul>

          <strong>C. Transgender:</strong>
          <ul>
            <li>Age Relaxation: The upper age limit shall be 35 years as on the 1st July of the notification year.</li>
            <li>The Transgender candidates may decide their self-identified gender anyone such as male or female or as third gender.</li>
            <li>If transgender candidate applies under Third gender and will be treated like women candidate. The 30% reservation will apply to them.</li>
            <li>If the transgender candidates produce their community certificate, they can get the beneficiary of communal reservation like other candidates.</li>
            <li>If the transgender candidates do not produce their community certificate, they will be treated as Most Backward Class category.</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light ">
        <h2 id='grop'>6. Examination Fee</h2>
        <p id='para'>
          The Examination fee is Rs.500/-. If the Police Departmental candidates apply for both under open quota and departmental quota, he/she shall pay a sum of Rs.1000/- as examination fee, which shall be paid either through SBI cash challan or online payment.
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>7. Written Examination and Distribution of Marks</h2>
        <p id='para'>
          All the eligible candidates will be called for Written Examination.
          <br />
          <strong>Part I. Tamil Language Eligibility Test:</strong>
          <ul>
            <li>The Tamil Language Eligibility Test is qualifying in nature.</li>
            <li>It will be objective type in nature.</li>
            <li>It will consist of 100 questions for 100 marks and the duration of examination will be 100 minutes (1 Hr 40 mins.)</li>
            <li>The candidate has to obtain minimum of 40% marks in Tamil Language Eligibility test, for him/her to be eligible for the next level of evaluation of the main examination OMR answer sheet.</li>
            <li>The marks obtained in Tamil Language Eligibility Test will not be considered for preparation of provisional selection list at any stage.</li>
            <li>In respect of 20% Departmental candidates, the Tamil Language eligibility Test will be commonly conducted along with those who are applying in open quota</li>
            <li>The candidates who have applied under BOTH Open and Departmental category will have to write the commonly conducted Tamil Language Eligibility Test only once.</li>
          </ul>

          <strong>Part II. Main Written examination:</strong>
          <ul>
            <li>Marks distribution:
              <ul>
                <li>(a) General knowledge: 30 Marks</li>
                <li>(b) Technical subjects: 50 Marks</li>
              </ul>
            </li>
            <li>Marks for additional educational qualification: 5 Marks</li>
            <li>Special Marks: 5 Marks (Open candidates: NCC - 2 Marks, NSS - 1 Mark, Sports/Games - 2 Marks. Departmental candidates: National Police Duty Meet Gold – 5 Marks, Silver – 3 Marks, Bronze – 2 Marks)</li>
            <li>Viva-voce: 10 Marks</li>
            <li>Total: 100 Marks</li>
            <li>Minimum qualifying marks in the examination shall be 28 marks out of 80 marks.</li>
            <li>Question papers will contain 160 objective type questions. Each question carries ½ marks.</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>8. Physical Measurement Test</h2>
        <p id='para'>
          The number of candidates called for physical measurement test, after clearing the written examination, will be 5 times the number of vacancies. The physical measurement test comprises of height and chest measurement for men and height measurement for women and transgender candidates. The minimum eligibility requirement is as follows:
          <br />
          <strong>MEN:</strong>
          <ul>
            <li>Height:
              <ul>
                <li>OC, BC, BC(M), MBC/DNC: Minimum 163 cms</li>
                <li>SC, SC(A) and ST: Minimum 160 cms</li>
              </ul>
            </li>
            <li>Chest:
              <ul>
                <li>Normal: Minimum 80 cms</li>
                <li>Expansion: Minimum 85 cms</li>
              </ul>
            </li>
          </ul>

          <strong>WOMEN AND TRANSGENDER:</strong>
          <ul>
            <li>Height:
              <ul>
                <li>OC, BC, BC(M), MBC/DNC: Minimum 154 cms</li>
                <li>SC, SC(A) and ST: Minimum 152 cms</li>
              </ul>
            </li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>9. Certificate Verification at Centre</h2>
        <p id='para'>
          <ul>
            <li>The open candidates who qualify in Physical Measurement Test will be called for original certificate verification.</li>
            <li>The Departmental candidates will be called for in the 1:5 ratio for original certificate verification.</li>
            <li>The candidates who are called for Certificate Verification will have to produce their original certificates which they had uploaded during submission of the online application. Candidate who fails to produce the Original Certificates will lose his/her claims with regard to communal reservation, age relaxation and special quota. New certificates /claim other than uploaded certificates will not be entertained.</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>10. Viva-Voce</h2>
        <p id='para'>
          <ul>
            <li>The candidates who qualify in Written Examination, Physical Measurement Test and original certificate verification will be called for Viva-voce in the ratio of 1:3.</li>
            <li>The Viva-Voce will be conducted at TNUSRB, Chennai. Candidates who are called for Viva-Voce should produce all the Original Certificates at the time of Viva-Voce.</li>
            <li>Candidates who are serving as Government Servants (other than the departmental quota candidates) in State Government should produce “No Objection Certificate” obtained from their respective Unit Heads.</li>
            <li>Candidates who are possessing NCC / NSS / Sports Certificates or Medals received in National Police Duty Meet (in-case of Departmental candidates) should produce the Original Certificates along with one photo copy of the same at the time of Viva-Voce for awarding of special marks.</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>11. Marks for Additional Educational Qualifications</h2>
        <p id='para'>
          Marks shall be given to the candidates for possessing additional educational qualifications as detailed below, subject to a maximum of five marks. These additional marks will be awarded to the candidates possessing the following certificates during Viva-voce.
          <br />
          <strong>Educational Qualification</strong>
          <ul>
            <li>B.E. Degree in Electronics and Communication Engineering - 4 Years: 2 Marks</li>
            <li>BCA/B.Sc degree in Computer Science or B.Sc IT-3 years: 2 Marks</li>
            <li>B.E. or B.Tech Degree in Computer Science or I.T-4 Years: 3 Marks</li>
            <li>Post Graduate Diploma in Computer application-1 Year: 1 Mark</li>
            <li>M.E or M.Tech degree in Communication Systems - 2 Years: 1 Mark</li>
            <li>M.E or M.Tech degree in Computer Science - 2 Years: 2 Marks</li>
            <li>MCA-3 Years: 2 Marks</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>12. Special Marks for NCC/NSS/Sports/Games</h2>
        <p id='para'>
          Special marks shall be given to the candidates during viva-voce as detailed below, subject to a maximum of five marks.
          <br />
          <strong>Open Quota Candidates</strong>
          <ul>
            <li>National Cadet Corps (NCC): Maximum 2 Marks
              <ul>
                <li>One Year Member/ “A” certificate: ½ Mark</li>
                <li>Possession of “B” Certificate: 1 Mark</li>
                <li>Possession of “C” Certificate/Under Officer Best Cadet in All India level: 2 Marks</li>
              </ul>
            </li>
            <li>National Service Scheme (NSS): Maximum 1 Mark
              <ul>
                <li>Participation in a National Programme: ½ Mark</li>
                <li>Best Volunteer at State Level/National level: 1 Mark</li>
                <li>Regular activities or State Special camps: ½ Mark</li>
              </ul>
            </li>
            <li>Sports / Games: Maximum 2 Marks
              <ul>
                <li>Approved 16 games: Eligible for awarding of marks.</li>
                <li>Represented School in District level: ½ Mark</li>
                <li>Represented College in zonal level (Inter Collegiate): ½ Mark</li>
                <li>Represented University (Inter University): 1 Mark</li>
                <li>Represented State (National level): 1 ½ Mark</li>
                <li>Represented Nation in international Competition: 2 Marks</li>
              </ul>
            </li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>13. Provisional Select List</h2>
        <p id='para'>
          <ul>
            <li>Provisional Select List is drawn based on the total marks obtained in the Written Examination, Viva-Voce and Special marks subject to communal reservation and total vacancies.</li>
            <li>If there is a tie in marks, the candidate senior in age shall be given priority in selection.</li>
            <li>If the marks secured are equal and date of birth is same preference shall be given to the candidate who is an outstanding scout, having received an award from the President of India.</li>
            <li>20% of all vacancies shall be set apart on preferential basis for the persons who studied from 1st Standard to Diploma / graduation in Tamil medium.</li>
          </ul>
        </p>
      </section>

      <section className="section p-5 border bg-light">
        <h2 id='grop'>14. Medical Examination and Verification of Character and Antecedents</h2>
        <p id='para'>
          Provisionally selected candidates will have to undergo medical examination and verification of character and antecedents through Police Department.
        </p>
      </section>


      <h2 className='text-center'>Sub-Inspector of Police (Technical) Syllabus & Notes</h2>
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
              src={`https://www.bharathithervukalam.com/api/fingerprints/view/${currentGroup.id}`} // Correctly constructed URL
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

export default RecruitmentPage;
