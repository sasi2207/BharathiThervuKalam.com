import'./Card.css';
import Mycard from './mycar';
import TNLogo from './img/TNLogo.jpg';
import TNLogo1 from './img/TNLogo1.jpg';
import Railway from './img/Railway.jpg';
import UPSC from './img/UPSC.PNG';
import Course from './Course';
import { Link } from 'react-router-dom';



import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Card(){
    

  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

    return(
      

        <div class="mycard">
        

        <div class="card custom-background shadow-lg"
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine">
  <img src={TNLogo1} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">TNPSC GROUP I</h3>
   
    <Link to={"/Group1"}><a href="#" class="card-link">Read More</a></Link>
    
  </div>
</div>




        <div class="card custom-background shadow-lg"data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0"
      >
  <img src={UPSC} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">Group-2A</h3>
    
    <Link to={'/Group-2A'}><a href="#" class="card-link">Read More</a></Link>
  </div>
</div>

  


<div class="card custom-background shadow-lg" data-aos="fade-left"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine">
  <img src={TNLogo1} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">TNPSC II & IIA</h3>
   
   <Link to={"/Group2"}><a href="#" class="card-link">Read More</a></Link> 
  </div>
</div>


<div class="card custom-background shadow-lg"
  data-aos="fade-right"
  data-aos-offset="300"
  data-aos-easing="ease-in-sine">
  <img src={TNLogo1} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">TNPSC GROUP IV & VAO</h3>
   
    
    <Link to={"/Group4"}> <a href="#" class="card-link">Read More</a></Link>
  </div>
</div>


<div class="card custom-background shadow-lg"data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0"
>
  <img src={TNLogo} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">TNUSRB SI / CONSTABLE</h3>
    
   <Link to={'/PC&SI'}> <a href="#" class="card-link">Read More</a></Link>
  </div>
</div>


<div class="card custom-background shadow-lg"   data-aos="fade-left"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine">
  <img src={Railway} alt="Image" class="card-img"></img>
  <div class="card-content">
    <h3 class="card-title">RRB</h3>
   
    <Link to={'/RRB'}><a href="#" class="card-link">Read More</a></Link>
  </div>
</div>













<Mycard></Mycard>
<Course></Course>

</div>
    )

}