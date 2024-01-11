import React, { useState } from 'react'
import "./styles/HeadFoot.css";
import "./styles/Login.css";
import LoginPageLogo from "../assets/image/leadplaner_logo.png";




const LoginHeader = () => {
    const [displayState, setDisplayState] = useState('none');
 

    const handleHambergurClick = () => {
        if (displayState === 'none') {
          setDisplayState('block');
        } else {
          setDisplayState('none');
        }
      };
      
   
  return (
    <nav className="main-nav">
    <div className="nav-wrapper">
        <div className="nav-section">
            <div className="registration-nav-logo">
                <img src={LoginPageLogo}/>
            </div>
    
            <div className="registration-navbar">
                <ul>
                    <li ><a href="" className="registration-active">Home</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">CRM</a></li>
                    <li><a href="">Pricing</a></li>
                    <li><a href="">Contact</a></li>
                    <li><a href="">Blog</a></li>
                    
                </ul>
    
                <div className="register-button">
    
                    <button className="four-min-demo"> <i className="fa fa-long-arrow-right register-arrow" aria-hidden="true"></i><span>4 min demo</span></button>
                    <button className="fee-trial"> <i className="fa fa-long-arrow-right register-arrow" aria-hidden="true"></i> <span>Start Your Free trial</span>
                    </button>
    
    
                </div>
    
    
            </div>

            <div className="registration-navbar-side" style={{ display: displayState }} >
                <div className="login-hamburgur2"  onClick={handleHambergurClick}>
                    <i className="fa fa-bars"></i>
                </div>
                <ul>
                    <li ><a href="" className="">Home</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">CRM</a></li>
                    <li><a href="">Pricing</a></li>
                    <li><a href="">Contact</a></li>
                    <li><a href="">Blog</a></li>
                    
                </ul>
    
                <div className="register-button">
    
                    <button className="four-min-demo"> <i className="fa fa-long-arrow-right register-arrow" aria-hidden="true"></i><span>4 min demo</span></button>
                    <button className="fee-trial"> <i className="fa fa-long-arrow-right register-arrow" aria-hidden="true"></i> <span>Start Your Free trial</span>
                    </button>
    
    
                </div>
    
    
            </div>

         

            <div className="login-hamburgur1" onClick={handleHambergurClick}>
                <i className="fa fa-bars"></i>
            </div>

        </div>

    </div>


</nav>
  )
}

export default LoginHeader