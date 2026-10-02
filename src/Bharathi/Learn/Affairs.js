import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Day from './img/live-news.png';
import Quiz from './img/quiz.png';
import Answer from './img/exam.png';
import Video from './img/play-button.png';
import Book from './img/open-book.png';
import Down from './img/download.png';
import Jop from './img/notification.png';
import Test from './img/online-test.png';
import Topper from './img/leadership.png';


import  { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import './Affair.css';

// Custom CSS for centering images
const centerImg = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
};

export default function Affairs() {

    useEffect(() => {
        AOS.init(); // Initialize AOS
      }, []);

    return (
        <div className='mt-5'>
            <div className="container mt-5">
                <h1 className="text-center mt-5">Current Affairs</h1>

                <div className="row">
                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center"> {/* Added text-center class for vertical centering */}
                                <img src={Day} className="img-fluid rounded mx-auto d-block" alt="Day" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Daily News</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Quiz} className="img-fluid rounded mx-auto d-block" alt="Quiz" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Daily Current Affairs Quiz</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Answer} className="img-fluid rounded mx-auto d-block" alt="Answer" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Daily Answer Writing</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Video} className="img-fluid rounded mx-auto d-block" alt="Video" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Civispedia</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down" >
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Book} className="img-fluid rounded mx-auto d-block" alt="Book" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">General Studies</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Down} className="img-fluid rounded mx-auto d-block" alt="Down" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Downloads</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Jop} className="img-fluid rounded mx-auto d-block" alt="Jop" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Job Notification</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Test} className="img-fluid rounded mx-auto d-block" alt="Test" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Online Test Series</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4" data-aos="zoom-in-down">
                        <div className="card custom-background shadow-lg">
                            <div className="card-body text-center">
                                <img src={Topper} className="img-fluid rounded mx-auto d-block" alt="Topper" style={{ ...centerImg, maxWidth: '150px', maxHeight: '150px' }} />
                                <h3 className="card-title mt-3">Topper Corner</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
