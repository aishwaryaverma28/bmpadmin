import React from 'react'
import '../styles/Error.css';
import ErrorImg from "../../assets/image/404.jpg";

const SettingUsage = () => {
    const handleGoBack = () => {
        window.history.back(); // Navigate back in the browser history
      };
  return (
    <section className="lead-error-page">
    <div>
        <img src={ErrorImg} alt=""/>
    </div>
    <div className="lead-error-content error-font-style">
        <p>404</p>
        <p>page not found</p>
        <p>We’re sorry, the page you requested could not be found. Please go back to the homepage</p>
        <button onClick={handleGoBack}>Go back</button>
    </div>
</section>
  )
}

export default SettingUsage