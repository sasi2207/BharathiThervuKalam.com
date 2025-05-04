import React, { useEffect } from 'react';
import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import  bootstrap from'bootstrap/dist/js/bootstrap.bundle.min';
import Logo from './img1/Logo.png';

export default function Header() {
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        return () => {
            tooltipList.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    return (
        <header className="head ">
            <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
                {/* <img src={Logo} className="Logo-1 img-fluid  mb-md-0" alt="Logo" /> */}
                <div className="row justify-content-center w-100">
                    
                    <div className="col-12 col-md-10 d-flex flex-wrap justify-content-around contact-info">
                        <span className="ps-2 d-flex align-items-center "   data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="CHAKARVARTHY">
                            <i className="bi bi-whatsapp"></i>
                            <a href="https://wa.me/7338757194" className="hnum ps-1" >+91 7338757194</a>
                        </span>
                        <span className="ps-2 d-flex align-items-center"   data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="KANNAN ">
                            <i className="bi bi-whatsapp"></i>
                            <a href="https://wa.me/8012194136" className="hnum ps-1">+91 8012194136 </a>
                        </span>
                        {/* <span className="ps-2 d-flex align-items-center"   data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="PRABHU">
                            <i className="bi bi-telephone"></i>
                            <a href="https://wa.me/7904790618" className="hnum ps-1">+91 7904790618</a>
                        </span> */}
                        <span className="ps-2 d-flex align-items-center"   data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="SAKTHI">
                            <i className="bi bi-telephone"></i>
                            <a href="tel:/9791388577" className="hnum ps-1">+91 9791388577</a>
                        </span>

                        <span className="ps-2 d-flex align-items-center"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      data-bs-custom-class="custom-tooltip"
      data-bs-title="Thervukalam@gmail.com">
    <i className="bi bi-envelope"></i> 
    <a href="mailto:your-email@example.com" className="hnum ps-1">Thervukalam@gmail.com</a>
</span>

                    </div>
                </div>
            </div>
        </header>
    );
}
