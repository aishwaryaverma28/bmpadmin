import React from 'react'
import "./styles/HeadFoot.css";
import Award1 from "../assets/image/award-image1.png";
import Award2 from "../assets/image/award-image2.png";
import Award3 from "../assets/image/award-image3.png";
import Award4 from "../assets/image/award-image4.png";
import Award5 from "../assets/image/award-image5.png";
import Award6 from "../assets/image/award-image6.png";
import Award7 from "../assets/image/award-image7.png";

const LoginFooter = () => {
  return (
    <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

<footer className="registration-footer1">
        <div className="footer-contact">
            <p>Contact</p>
            <p>78, St John Street, London UK. EC1V 4PW</p>

        </div>

        <div className="footer-follow">
            <p>Follow Us On</p>
            
            <div className='footer-media-flex'>
            <div className='footer-media'>
            <i className="fa fa-facebook" aria-hidden="true"></i>
            </div>
            <div className='footer-media footer-twitter'>
            <i className="fa fa-twitter" aria-hidden="true"></i>
            </div>
            <div className='footer-media'>
            <i className="fa fa-linkedin" aria-hidden="true"></i>
            </div>
            </div>

            <div className="footer-nav-item">
                <ul>
                    <li><a href="" className="registration-footer-active">Home</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">CRM</a></li>
                    <li><a href="">Pricing</a></li>
                    <li><a href="">Contact</a></li>
                    <li><a href="">Privacy</a></li>
                    <li><a href="">Terms</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-desc">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim soluta hic quibusdam? Odit necessitatibus
                autem sed non esse, nihil qui omnis porro explicabo totam ducimus quod, est velit quo optio!</p>
        </div>

        <div></div>


        <div className="award-images">
            <img src={Award1} className="footer-img-fluid" alt=""/>
            <img src={Award2} className="footer-img-fluid" alt=""/>
            <img src={Award3} className="footer-img-fluid" alt=""/>
            <img src={Award4} className="footer-img-fluid" alt=""/>
            <img src={Award5} className="footer-img-fluid" alt=""/>
            <img src={Award6} className="footer-img-fluid" alt=""/>
            <img src={Award7} className="footer-img-fluid" alt=""/>
    

        </div>

    </footer>

    <footer className="registration-footer2">
        <div className="footer-bottom">
            <p>Copyright © 2023 <span>LeadPlaner CRM</span>. All Rights Reserved</p>
            <p>LeadPlaner CRM®</p>
        </div>


    </footer>

    </>
  )
}

export default LoginFooter