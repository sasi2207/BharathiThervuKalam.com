import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button,  Card ,Spinner,Table} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';


const JointRecruitmentDetails = () => {


  
  const [group1List, setGroup1List] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false); // Loading state for file download
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroup1List = async () => {
      try {
        const response = await axios.get('https://www.bharathithervukalam.com/api/join/view');
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
      const response = await axios.get(`https://www.bharathithervukalam.com/api/join/download/${id}`, {
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
      <h2 className="mb-4 text-center" >Joint Recruitment for Various Posts</h2>
      
      <div className=" mb-4 border bg-light p-5">
        <h2  id='grop'>1. Educational Qualification</h2>
        <div className="" >
          <p id='para'>Candidates should have a Bachelor’s Degree from any University recognised by UGC / Government on the date of Notifications.</p>
        </div>
      </div>
      
      <div className=" mb-4 p-5 border bg-light">
        <h2 id='grop'>2. Age</h2>
        <div className=" " >
          <p id='para'>The applicants should have attained the age of 20 years and should not be aged above 30 years as on 1st July of the Notification year. The upper age limit relaxation given to certain categories is as follows:</p>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>Category</th>
                <th>Upper age limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backward Class, Backward Class (Muslim), Most Backward Class/Denotified Community</td>
                <td>32 yrs</td>
              </tr>
              <tr>
                <td>Scheduled Caste, Scheduled Caste (Arunthathiyar), Scheduled Tribe</td>
                <td>35 yrs</td>
              </tr>
              <tr>
                <td>Transgender</td>
                <td>35 yrs</td>
              </tr>
              <tr>
                <td>Destitute Widow</td>
                <td>37 yrs</td>
              </tr>
              <tr>
                <td>Ex-servicemen/ Ex-personnel of CAPF (Discharged from service within 3 years from the date of notification) / Serving persons of Armed Forces/CAPF who are going to retire within one year from the last date of receipt of application</td>
                <td>47 yrs</td>
              </tr>
              <tr>
                <td>Police and Fire & Rescue Services Departmental candidates appearing for departmental quota examination</td>
                <td>47 yrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className=" mb-4 border bg-light p-5">
        <h2 id='grop'>3. Communal Reservation</h2>
        <div >
          <p id='para'>The following communal reservation will be followed as per existing rules and Government Orders:</p>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>Category</th>
                <th>Reservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Open Competition [OC]</td>
                <td>31%</td>
              </tr>
              <tr>
                <td>Backward Class [BC]</td>
                <td>26.5%</td>
              </tr>
              <tr>
                <td>Backward Class (Muslim) [BC(M)]</td>
                <td>3.5%</td>
              </tr>
              <tr>
                <td>Most Backward Class / Denotified Communities [MBC / DNC]</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>Scheduled Caste [SC]</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>Scheduled Caste (Arunthathiyar) [SC(A)]</td>
                <td>3%</td>
              </tr>
              <tr>
                <td>Scheduled Tribe [ST]</td>
                <td>1%</td>
              </tr>
            </tbody>
          </table>
          <p id='para'>Community Certificate issued by Tamil Nadu Government only will be considered for communal reservation.</p>
        </div>
      </div>


      <div className=" mb-4 border bg-light p-5">
        <h2 id='grop' >4. Special Quotas</h2>
        <div className='mt-4 ' >
          <h5 id='sum' >A. 20% Reservation for Police and Fire & Rescue Services Departmental Quota Candidates</h5>
          <h6 id='grop' className='mt-4'>(i) 20% Police Departmental Quota</h6>
          <p id='para'>Gr.II PCs, Gr.I PCs and Head Constables and their equivalent ranks in the Taluk, AR and TSP can apply under 20% Police Departmental Quota. They should have completed 5 years of service as on the date of notification. Written Examination for Police Departmental quota will be held separately.</p>
          <h6 id='grop'>(ii) 20% Fire Departmental Quota</h6>
          <p id='para'>Firemen, Leading Firemen, Firemen Driver and Driver Mechanic in the Fire and Rescue Services Department can apply under 20% Fire Departmental Quota. They should have completed 5 years of service as on the date of notification. Written Examination for Fire Departmental quota will be held separately.</p>

          <h5 id='sum'>B. 10% Reservation for Sports Quota Candidates (For Police Department Only)</h5>
          <p id='para'>Candidates applying under 10% Sports Quota should fulfil all the norms prescribed for open candidates. In addition, the candidate is required to produce Form-I or Form-II or Form-III for any of the approved 16 games/sports for an event held within 5 years preceding the date of notification. The details of certificates required for claiming sports quota are as follows:</p>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>Type of the form</th>
                <th>Level of participation</th>
                <th>Issuing authority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FORM-I</td>
                <td>Represented India at International Competition</td>
                <td>Secretary of the National Federation of the game concerned.</td>
              </tr>
              <tr>
                <td>FORM-II</td>
                <td>Represented Tamil Nadu State at National Level Competition</td>
                <td>Secretary of the National Federation or Secretary of the State Association of the game concerned.</td>
              </tr>
              <tr>
                <td>FORM-III</td>
                <td>Represented any University in Tamil Nadu at Inter-University Competition</td>
                <td>Director or other officer in-charge of sports in the University.</td>
              </tr>
            </tbody>
          </table>
          <h2 className='mt-4 mb-4' id='grop'>List of approved Games and Sports:</h2>
          <ul>
            <li>Basket Ball</li>
            <li>Football</li>
            <li>Hockey</li>
            <li>Volley Ball</li>
            <li>Hand Ball</li>
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

          <h5 id='sum'>C. 10% Reservation for Wards cum Dependent Quota (For Police Department Only)</h5>
          <p id='para'>
            <strong>i.</strong> Wards cum dependent of serving / retired / deceased or medically invalidated Police personnel and ministerial staff of Police Department can avail this quota.
          </p>
          <p id='para'>
            <strong>ii.</strong> Wards cum dependent certificate should be obtained from the competent authority not below the rank of Superintendent of Police where the parent is serving or was last serving.
          </p>
          <p id='para'>
            <strong>iii.</strong> Wards cum dependent certificate should be obtained after the date of notification only.
          </p>
          <p id='para'>
            <strong>iv.</strong> If the Wards cum dependent certificate is not obtained in the prescribed format, then the candidate will be treated as an Open candidate.
          </p>
          <p id='para'>
            <strong>v.</strong> Only one ward of the Police Personnel/Ministerial Staff shall apply under the "Wards cum Dependent" quota.
          </p>
          <p id='para'>
            <strong>vi.</strong> Candidates already serving under Central / State Government services are not eligible for this wards cum dependent quota.
          </p>
          <p id='para'>
            <strong>vii.</strong> In case required numbers of candidates are not available in the Wards Quota, the vacancies would be transferred to open quota of the same community.
          </p>
        </div>
      </div>

      <section className="section border bg-light p-5">
        <h3 id='grop'>5.20% PSTM Preference</h3>
        <p id='para'>
          20% of all vacancies shall be set apart on a preferential basis for the open candidates who studied from 1st Standard to the Bachelor’s degree (qualifying degree) in Tamil Medium.
        </p>
      </section>
      
      <section className="section border bg-light p-5 " >
        <h3 id='grop' >6. Concessions for Special Categories</h3>

        <h5 id='sum' className='mt-4'>A. Ex-Servicemen / Serving Persons:</h5>
        <ul id='para'>
          <li>Age relaxation is given up to 47 years.</li>
          <li>
            The Ex-Servicemen who have not completed 3 years after discharge from service and the serving Armed Forces personnel who are going to retire within one year from the last date of receipt of online application and Ex-personnel of Central Armed Police Force [CAPF] who have not completed 3 years after discharge from service and the serving persons of CAPF who are going to retire within one year from the last date of receipt of application are eligible for applying for this recruitment.
          </li>
        </ul>

        <h5 id='sum'>B. Destitute Widow:</h5>
        <ul>
          <li>Age relaxation is given up to 37 years.</li>
          <li>
            The Destitute Widow candidates should obtain "Destitute Widow Certificate" from the Revenue Divisional Officer / Sub-Collector / Assistant Collector and upload the same along with the online application. Failing which they will not be considered under Destitute Widow category.
          </li>
        </ul>
      </section>

      <section className="section bg-light border p-5">
        <h3 id='grop'>7. Transgender (For Police Department Only)</h3>
        <ul id='para'>
          <li>Age relaxation is given up to 35 years.</li>
          <li>
            The Transgender candidates may decide any of the genders such as man or woman or third gender for the Physical Measurement Test, Endurance Test, Physical Efficiency Test.
          </li>
          <li>If transgender candidates apply under Third gender, they will be treated like women candidates. The 30% reservation will apply to them.</li>
          <li>
            If the transgender candidates produce their community certificate, they can get the benefit of communal reservation like other candidates.
          </li>
          <li>If the transgender candidate does not produce their community certificate, they will be treated as Most Backward Class category.</li>
        </ul>
      </section>

      <section className="section border bg-light p-5">
        <h3 id='grop'>8. Marks Allocation for Open and Departmental Candidates</h3>
        <table className="table table-striped table-responsive mt-4">
          <thead>
            <tr>
              <th>Description</th>
              <th>Open</th>
              <th>Departmental Quota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Written Examination</td>
              <td>70 Marks</td>
              <td>85 Marks</td>
            </tr>
            <tr>
              <td>Physical Efficiency Test</td>
              <td>15 Marks</td>
              <td>Exempted</td>
            </tr>
            <tr>
              <td>Viva-Voce</td>
              <td>10 Marks</td>
              <td>10 Marks</td>
            </tr>
            <tr>
              <td>Special Marks</td>
              <td>5 Marks</td>
              <td>5 Marks</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>100 Marks</td>
              <td>100 Marks</td>
            </tr>
          </tbody>
        </table>
      </section>




      <div className=" mt-3 border bg-light p-5">
      <h2 id='grop'> 9.Stages of Recruitment for Open Candidates</h2>

      <div className="stage">
        <h4 id='sum'>1. Written Examination:</h4>

        <div className="sub-stage">
          <h5 id='grop'>Part I. Tamil Language Eligibility Test:</h5>
          <ul id='para'>
            <li>The Tamil Language Eligibility Test is qualifying in nature.</li>
            <li>It will be objective type in nature.</li>
            <li>It will consist of 100 questions for 100 marks and the duration of the examination will be 100 minutes (1 Hr 40 mins).</li>
            <li>The candidate has to obtain a minimum of 40% marks in the Tamil Language Eligibility Test, to be eligible for the next level of evaluation of the main examination OMR answer sheet.</li>
            <li>The marks obtained in the Tamil Language Eligibility Test will not be considered for preparation of the provisional selection list at any stage.</li>
            <li>In respect of 20% Departmental candidates, the Tamil Language eligibility Test will be commonly conducted along with those who are applying in the open quota.</li>
            <li>The candidates who have applied under BOTH Open and Departmental category will have to write the commonly conducted Tamil Language Eligibility Test only once.</li>
          </ul>
        </div>

        <div className="sub-stage">
          <h5 id='grop'>Part II. Main Written Examination:</h5>
          <p id='para'>The Main Written examination will consist of Part A - General Knowledge and Part B - Psychology Test: Logical Analysis, Numerical skills, Mental Ability, Communication Skills, and Information Handling Ability. Written examination: Total marks - 70.</p>
          <ul id='para'>
            <li>Part A – 40 Marks (objective type). 80 Questions.</li>
            <li>Part B – 30 marks (objective type). 60 Questions.</li>
            <li>Each question carries ½ marks.</li>
            <li>Duration 2 ½ Hrs.</li>
            <li>The candidates should get a minimum of 25 marks to qualify in the written examination</li>
            <li>All questions will be Bilingual (Tamil & English).</li>
          </ul>
        </div>
      </div>

      <div className="stage">
        <h4 id='sum'>2. Certificate Verification:</h4>
        <ul>
          <li>The certificate verification will be carried out before the Physical Measurement Test, Endurance Test, and Physical Efficiency Test for open candidates.</li>
          <li>The candidates who are called for Certificate Verification will have to produce all the relevant original certificates. Candidate who fails to produce the Original Certificates will lose his/her claims with regard to communal reservation, age relaxation, and special quota.</li>
        </ul>
      </div>

      <div className="stage">
        <h4 id='sum'>3. Physical Measurement Test:</h4>
        <p id='grop'>Height Measurement:</p>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Community</th>
              <th>Men</th>
              <th>Women & Transgender</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OC, BC, BC(M), MBC/DNC</td>
              <td>170 cms</td>
              <td>159 cms</td>
            </tr>
            <tr>
              <td>SC, SC(A), ST</td>
              <td>167 cms</td>
              <td>157 cms</td>
            </tr>
          </tbody>
        </table>
        <p id='grop'>Chest Measurement (for Men only):</p>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
            
              <th>Normal</th>
              <th>Expansion in full inspiration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
             
              <td>81 Cms</td>
              <td>81 cms to 86 cms (5 cms)</td>
            </tr>
          </tbody>
        </table>
        <p id='para'>Ex-servicemen / Serving persons who are going to retire within one year/ Ex-personnel of CAPF / Serving persons of CAPF who are going to retire within one year: Exempted from Physical Measurement Test.</p>
      </div>

      <div className="stage">
        <h4 id='sum'>4. Endurance Test:</h4>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Category</th>
              <th>Men</th>
              <th>Women/Transgender</th>
              <th>Ex-servicemen / CAPF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Run</td>
              <td>1500 metres in 7 minutes</td>
              <td>400 metres in 2 minutes 30 seconds</td>
              <td>1500 metres in 8 minutes</td>
            </tr>
          </tbody>
        </table>
        <ul id='para' className='mt-4 mb-4'>
          <li>Endurance Test is qualifying in nature.</li>
          <li>Only the candidates who qualify in the Endurance Test will be allowed to participate in the Physical Efficiency Test.</li>
        </ul>
      </div>

      <div className="stage ">
        <h4 id='sum'>5. Physical Efficiency Test:</h4>
        <p id='para'>Total marks for PET is 15. Candidates are required to attend all the events in PET.</p>

        <h5 id='grop'>Men candidates:</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Events</th>
              <th>Zero Star (0 Mark)</th>
              <th>One Star (2 Marks)</th>
              <th>Two Stars (5 Marks)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rope Climbing</td>
              <td>Less than 5.0 metres</td>
              <td>5.0 metres</td>
              <td>6.0 metres</td>
            </tr>
            <tr>
              <td>Long Jump</td>
              <td>Less than 3.80 metres</td>
              <td>3.80 metres</td>
              <td>4.50 metres</td>
            </tr>
            <tr>
              <td>High Jump</td>
              <td>Less than 1.20 metres</td>
              <td>1.20 metres</td>
              <td>1.40 metres</td>
            </tr>
            <tr>
              <td>100 mts run</td>
              <td>More than 15.00 seconds</td>
              <td>15.00 seconds</td>
              <td>13.50 seconds</td>
            </tr>
            <tr>
              <td>400 mts run</td>
              <td>More than 80.00 seconds</td>
              <td>80.00 seconds</td>
              <td>70.00 seconds</td>
            </tr>
          </tbody>
        </table>
        <ul id='para' className='mt-4 mb-4'>
          <li>Two chances will be given to the candidates in rope climbing and long jump/high jump.</li>
          <li>Only one chance will be given for 100 metres/400 metres run.</li>
        </ul>

        <h5 id='grop'>Women and Transgender candidates:</h5>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Events</th>
              <th>Zero Star (0 Mark)</th>
              <th>One Star (2 Marks)</th>
              <th>Two Stars (5 Marks)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Long jump</td>
              <td>Less than 3.0 metres</td>
              <td>3.0 metres</td>
              <td>3.75 metres</td>
            </tr>
            <tr>
              <td>Shotput</td>
              <td>Less than 4.25 metres</td>
              <td>4.25 metres</td>
              <td>5.50 metres</td>
            </tr>
            <tr>
              <td>Cricket ball throw</td>
              <td>Less than 17 metres</td>
              <td>17 metres</td>
              <td>24 metres</td>
            </tr>
            <tr>
              <td>100 mts run</td>
              <td>More than 17.50 seconds</td>
              <td>17.50 seconds</td>
              <td>15.50 seconds</td>
            </tr>
            <tr>
              <td>200 mts run</td>
              <td>More than 38.00 seconds</td>
              <td>38.00 seconds</td>
              <td>33.00 seconds</td>
            </tr>
          </tbody>
        </table>
        <ul id='para' className='mt-4 mb-4'>
          <li>Two chances will be given for long jump, Shot-Put/Cricket ball throw.</li>
          <li>Only one chance will be given in 100 metres/200 metres run.</li>
        </ul>

        <h5 id='sum'>Ex-servicemen and Serving personnel who are going to retire within one year/ Ex-personnel of CAPF / Serving persons of CAPF who are going to retire within one year:</h5>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Events</th>
              <th>Zero Star (0 Mark)</th>
              <th>One Star (2 Marks)</th>
              <th>Two Stars (5 Marks)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shotput</td>
              <td>Less than 5.0 metres</td>
              <td>5.0 metres</td>
              <td>6.0 metres</td>
            </tr>
            <tr>
              <td>Long Jump</td>
              <td>Less than 3.25 metres</td>
              <td>3.25 metres</td>
              <td>4.50 metres</td>
            </tr>
            <tr>
              <td>High Jump</td>
              <td>Less than 0.90 metres</td>
              <td>0.90 metres</td>
              <td>1.40 metres</td>
            </tr>
            <tr>
              <td>100 mts run</td>
              <td>More than 17.00 seconds</td>
              <td>17.00 seconds</td>
              <td>13.50 seconds</td>
            </tr>
            <tr>
              <td>400 mts run</td>
              <td>More than 85.00 seconds</td>
              <td>85.00 seconds</td>
              <td>70.00 seconds</td>
            </tr>
          </tbody>
        </table>
        <ul id='para' className='mt-4 mb-3'>
          <li>Two chances will be given for the events of Shot-Put throw and Long jump or High jump.</li>
          <li>Only one chance will be given to the candidates in 100 metres/400 metres run.</li>
        </ul>
      </div>
    </div>




    <div className="recruitment-container bg-light p-5 mt-4">
      <h2 id='grop'>10.Stages of Recruitment for Departmental Candidates</h2>

      <section>
        <h3 id='sum'>A. Written Examination</h3>
        
        <h4 id='grop'>Part I. Tamil Language Eligibility Test</h4>
        <p id='para'>Tamil Language Eligibility Test for Departmental candidates will be the same as conducted for Open candidates.</p>

        <h4 id='grop'>Part II(A). Main Written Examination for 20% Police Departmental Quota</h4>
        <p id='sum'>Main Written examination will consist of:</p>
        <ul id='para'>
          <li>Part A - General Knowledge</li>
          <li>Part B - Psychology Test: Logical Analysis, Numerical skills, Mental Ability, Communication Skills, and Information Handling Ability.</li>
          <li>Indian Penal Code, Criminal Procedure Code, Indian Evidence Act, Police Standing Orders, and Police Administration.</li>
        </ul>
        <p id='sum'>Written examination: Total marks - 85.</p>
        <ul>
          <li>Part A – 15 Marks (objective type), 30 Questions.</li>
          <li>Part B - 70 Marks (objective type), 140 Questions.</li>
          <li>Each question carries ½ marks.</li>
          <li>Duration: 3 hours.</li>
          <li>The candidates should get a minimum of 30 marks to qualify in the written examination.</li>
        </ul>

        <h4 id='grop'>Part II(B). Main Written Examination for 20% Fire & Rescue Services Departmental Quota</h4>
        <p id='sum'>Main Written examination will consist of:</p>
        <ul id='para'>
          <li>Part A - General Knowledge</li>
          <li>Part B - Psychology Test: Logical Analysis, Numerical skills, Mental Ability, Communication Skills, and Information Handling Ability.</li>
          <li>Rules and Regulations relating to Fire & Rescue Services, Station Routine, Tamil Nadu Fire Service Manual, and Administration of Fire & Rescue Services.</li>
        </ul>
        <p id='sum'>Written examination: Total marks - 85.</p>
        <ul>
          <li>Part A – 15 Marks (objective type), 30 Questions.</li>
          <li>Part B - 70 Marks (objective type), 140 Questions.</li>
          <li>Each question carries ½ marks.</li>
          <li>Duration: 3 hours.</li>
          <li>The candidates should get a minimum of 30 marks to qualify in the written examination.</li>
        </ul>
      </section>

      <section>
        <h3 id='sum'>B. Certificate Verification</h3>
        <p id='para'>The candidates who are called for Certificate Verification will have to produce their original certificates which they had uploaded during submission of the online application. Candidate who fails to produce the Original Certificates will lose his/her claims with regard to communal reservation and age relaxation.</p>
      </section>

      <section>
        <h3 id='sum'>C. Departmental Quota Candidates Exemptions</h3>
        <p id='para'>Departmental Quota candidates are exempted from Physical Measurement Test and Physical Efficiency Test.</p>
      </section>

      <section>
        <h3 id='sum'>D. Endurance Test</h3>
        <ul>
          <li>1500 metres run in 7 minutes for men candidates</li>
          <li>400 metres run in 2 minutes and 30 seconds for women candidates</li>
        </ul>
        <p id='para'>Endurance Test is qualifying in nature.</p>
      </section>

   
    </div>

    <section className='bg-light mt-4 p-5'>
        <h3 className='mb-3' id='grop'>11. Viva-Voce</h3>
        <ul>
          <li>Viva-Voce will be conducted for 10 marks. Marks will be awarded based on the performance of the candidates.</li>
          <li>The candidates who qualify in Certificate Verification, Physical Measurement Test, Endurance Test and Physical Efficiency Test will be called for Viva-Voce. The number of candidates called for Viva-Voce will be 2 times the number of vacancies.</li>
        </ul>
      </section>
    
      <div className='bg-light mt-4 p-5'>
        

      <h3 id='grop' >12.Special Marks for NCC/NSS/Sports/Games for Open Candidates</h3>
      <Table bordered className="mt-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Criteria</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="3">National Cadet Corps (NCC) (Maximum 2 Marks)</td>
            <td>One Year Member/ "A" certificate</td>
            <td>½ Mark</td>
          </tr>
          <tr>
            <td>Possession of "B" Certificate</td>
            <td>1 Mark</td>
          </tr>
          <tr>
            <td>Possession of "C" Certificate/Under Officer Best Cadet in All India level</td>
            <td>2 Marks</td>
          </tr>
          <tr>
            <td rowSpan="3">National Service Scheme (NSS) (Maximum 1 Mark)</td>
            <td>Participation in a National Programme like Republic Day parade in New Delhi/National Integration and Motivation Camps/Inter State Youth Exchange Programme by the Department of Youth Affairs and Sports of State Government.</td>
            <td>½ Mark</td>
          </tr>
          <tr>
            <td>Participation in regular activities or State Special camps as per G.O.No.8 dated: 21.01.2002.</td>
            <td>½ Mark</td>
          </tr>
          <tr>
            <td>Best Volunteer at State Level/National level or Best NSS Cadet at Republic Day Parade in New Delhi</td>
            <td>1 Mark</td>
          </tr>
          <tr>
            <td rowSpan="6">Sports / Games (Maximum 2 Marks)</td>
            <td>Represented School in District level</td>
            <td>½ Mark</td>
          </tr>
          <tr>
            <td>Represented College in zonal level (Inter Collegiate)</td>
            <td>½ Mark</td>
          </tr>
          <tr>
            <td>Represented University (Form-III) (Inter University)</td>
            <td>1 Mark</td>
          </tr>
          <tr>
            <td>Represented District in Inter District tournament</td>
            <td>1 Mark</td>
          </tr>
          <tr>
            <td>Represented State (Form-II) (Tamil Nadu)</td>
            <td>1 ½ Mark</td>
          </tr>
          <tr>
            <td>Represented Nation in international Competition (Form-I) (India)</td>
            <td>2 Marks</td>
          </tr>
        </tbody>
      </Table>

      <h3 className="mt-4" id='grop'>13(A)Special Marks for Police Departmental Candidates</h3>
      <Table bordered className="mt-3">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gold Medal</td>
            <td>5 Marks</td>
          </tr>
          <tr>
            <td>Silver Medal</td>
            <td>3 Marks</td>
          </tr>
          <tr>
            <td>Bronze Medal</td>
            <td>2 Marks</td>
          </tr>
        </tbody>
      </Table>

      <h3 className="mt-4" id='grop'>(B)Special Marks for Fire & Rescue Services Departmental Candidates</h3>
      <Table bordered className="mt-3">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>President’s Fire Service Medal for gallantry (or) Fire Services Medal for gallantry (or) Tamil Nadu Chief Minister’s Fire Service Medal for gallantry (Anna Medal) on the occasion of Anna’s Birthday</td>
            <td>5 Marks</td>
          </tr>
          <tr>
            <td>Tamil Nadu Chief Minister’s Fire Service Medal for Excellence (or) Tamil Nadu Chief Minister’s Anna Medal for gallantry on the occasion of Republic Day</td>
            <td>3 Marks</td>
          </tr>
          <tr>
            <td>Fire Service Medal for Meritorious Service (or) Tamil Nadu Chief Minister’s Fire Service Medal (Anna Medal) on the occasion of Anna’s Birthday</td>
            <td>2 Marks</td>
          </tr>
          <tr>
            <td>Tamil Nadu Chief Minister’s Fire Service Medal on Pongal Day</td>
            <td>1 Mark</td>
          </tr>
        </tbody>
      </Table>
      </div>



      <div className=" mt-4 bg-light p-5">
     

      <div className=" mt-3">
        <h3 id='grop'>
          14. PROVISIONAL SELECTION LIST
        </h3>
        <div c>
          <ol>
            <li>
              Provisional Selection List is drawn based on the total marks obtained in the Written Examination, Physical Efficiency Test, Viva-Voce and Special marks subject to communal reservation, candidate’s category and total vacancies.
            </li>
            <li>
              For the post of Station Officer, provided that other things being equal, preference shall be given to persons who have successfully undergone any of the training course at National Fire Service College, Nagpur.
            </li>
            <li>
              If the marks secured are equal and date of birth is same, preference shall be given to the candidate who is an outstanding scout, having received an award from the President of India.
            </li>
            <li>
              If there is a tie in marks, the candidate senior in age shall be given priority in selection.
            </li>
          </ol>
        </div>
      </div>
    
    </div>

    <div className=" mt-3 bg-light p-5">
        <h3 id='grop'>
          15. MEDICAL EXAMINATION AND VERIFICATION OF CHARACTER AND ANTECEDENTS
        </h3>
        <div id='para'>
          Provisionally selected candidates will have to undergo medical examination and verification of character & antecedents through respective Department.
        </div>
      </div>


    <div className="mt-3 bg-light p-5">
        <h3 id='grop'>
          16. EXAMINATION FEE
        </h3>
        <div >
          <p id='para'>The Examination fee is Rs.500/-. If the Departmental candidates apply for both open quota and departmental quota, he/she shall pay a sum of Rs.1000/- as examination fee, which shall be paid either through cash challan or online payment.</p>
        </div>
      </div>






      <h2 className='text-center' id='title-1'>Joint Recruitment for Various Posts Syllabus & Notes</h2>
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
              src={`https://www.bharathithervukalam.com/api/join/view/${currentGroup.id}`} // Correctly constructed URL
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

export default JointRecruitmentDetails;
