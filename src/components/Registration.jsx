import React, { useState, useEffect } from "react";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";
import "./styles/Registration.css";
import axios from "axios";
import CRMImage from "../assets/image/crm.svg";
import { CREATE_ACC, COUNTRIES } from "./utils/Constants";
const Registration = () => {
  const [country, setCountry] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    company: "",
    employee: "",
    job_title: "",
    role: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await axios.get(COUNTRIES);
      const data = response.data.data;
      console.log(data);
      setCountry(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Make an API call to pass the form data
    axios
      .post(CREATE_ACC, formData)
      .then((response) => {
        // Handle the response as needed
        if (response.status === 200) {
          console.log("Registration successful");
        } else {
          console.log("Registration failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <LoginHeader />
      <main className="main-registration">
        <div className="free-trial-section">
          <div>
            <h2 className="free-trial-heading">Start Your Free Trial</h2>
            <h3 className="no-credit">
              No credit card required, no software to install.
            </h3>
            <p className="day-trial">With your 30-day trial, you get:</p>
            <div className="data-load">
              <ul>
                <li>Pre-loaded data or upload your own</li>
                <li>Pre-configured processes, reports, and dashboards</li>
                <li>
                  Guided experiences for sales reps, leaders, and administrators
                </li>
                <li>Online training and live onboarding webinars</li>
              </ul>
            </div>

            <p className="looking-support">
              Looking for support? Visit the{" "}
              <span> LeadPlaner Support Center</span> or email
            </p>
            <p className="help-email">help@leadplaner.com</p>
            <div>
              <img src={CRMImage} alt="" />
            </div>
          </div>
        </div>

        <div className="registration-form-section">
          <h2 className="registration-form-heading">
            Sign Up For LeadPlaner - Your <br /> Comprehensive Lead <br />{" "}
            Management Solution.
          </h2>
          <p className="welcome-planer">
            Welcome To LeadPlaner! Take The First Step Towards Revolutionizing
            Your Lead Management And Driving Sales Success By Signing Up For Our
            Powerful Lead Management Platform.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-division">
              <div>
                <input
                  type="text"
                  className="registration-form-input"
                  placeholder="First Name*"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  className="registration-form-input email-case"
                  placeholder="Work Email*"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="registration-form-input"
                  placeholder="Phone No*"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="registration-form-input"
                  placeholder="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="registration-form-input"
                  placeholder="Last Name*"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  className="registration-form-input"
                  placeholder="Password*"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <select
                  className="registration-form-input"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                >
                  <option value="">Job Title*</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Marketing/ PR Manager">
                    Marketing/ PR Manager
                  </option>
                  <option value="Customer Service Manager">
                    Customer Service Manager
                  </option>
                  <option value="Cxo General Manager">
                    Cxo General Manager
                  </option>
                </select>
                <select
                  className="registration-form-input"
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                >
                  <option value="">Employee*</option>
                  <option value="15">1- 15 Employees</option>
                  <option value="50">16 - 50 Employees</option>
                  <option value="200">51 - 200 Employees</option>
                  <option value="500">201 - 500 Employees</option>
                </select>
              </div>
            </div>
            <div className="two-select">
              <select
                value={formData.country}
                name="country"
                onChange={handleChange}
              >
                <option value="">Select a country</option>
                {country &&
                  country.slice(0, 100).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                {country &&
                  country.slice(100, 200).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                {country &&
                  country.slice(200, 250).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                {/* {country.map((count) => (
                  <option key={count.id} value={count.country_code}>
                    {count.country_name}
                  </option>
                ))} */}
                {console.log(country[0])}
              </select>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Role*</option>
                <option value="1">Client</option>
                <option value="3">Employee</option>
              </select>
            </div>
            <div>
              <input type="checkbox" className="agree-tick" />
              <label for="" className="agree-checkbox">
                I agree to the <span>Main Service Agreement</span>
              </label>
            </div>

            <div className="confirm-register">
              <p>
                By Registering, You Confirm That You Agree To The Storing And
                Processing Of Your Personal Data By LeadPlaner As Described In
                The <span> Privacy Statement.</span>
              </p>
            </div>

            <input
              type="submit"
              value="submit"
              className="registration-form-submit"
            />
          </form>
        </div>
      </main>
      <LoginFooter />
    </>
  );
};

export default Registration;
