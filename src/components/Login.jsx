import React, { useState, useEffect } from "react";
import axios from "axios";
import { LOGIN, BMP_LOGIN, OTP } from "./utils/Constants";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";
import CRMImage from "../assets/image/crm.svg";
import CryptoJS from "crypto-js";
const secretKey = 'mySecretKey123';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const encryptedToken = localStorage.getItem("jwtToken");
    if (encryptedToken) {
      const landingUrl = localStorage.getItem("landingUrl");
      navigate(landingUrl);
    }
  }, []);

  const handleUserName = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateForm = {
      username: email,
      password: password,
    };
    axios
      .post(LOGIN, updateForm)
      .then((response) => {
        const data = response?.data;
        const status = response?.data?.status;
        console.log(data);
        if (status === 0) {
          alert(data.message);
        } else if (status === 1) {
          const token = response.data.token;
          const encryptedToken = CryptoJS.AES.encrypt(
            token,
            secretKey
          ).toString();
          localStorage.setItem("jwtToken", encryptedToken);
          const role_name = data?.role_name;
          localStorage.setItem("role_name", role_name);
          localStorage.setItem("id", data?.user[0].id);
          const landingUrl = response.data.landingurl;
          localStorage.setItem("landingUrl", landingUrl);
          const userPath = data.user[0].permissions.split(",");
          userPath.push(landingUrl);
          const userPathTot = userPath.join(",");
          const encryptedUserPathTot = CryptoJS.AES.encrypt(
            userPathTot,
            secretKey
          ).toString();
          localStorage.setItem("encryptedUserPathTot", encryptedUserPathTot);
          navigate(landingUrl);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "Invalid or expired token."
        ) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("jwtToken");
          navigate("/");
        } else {
          console.log(error);
        }
      });
  };
  const handleSubmit2 = (e) => {
    e.preventDefault();
    const updateForm = {
      username: email,
      otp: password,
    };
    axios
      .post(BMP_LOGIN, updateForm)
      .then((response) => {
        // console.log(response?.data);
        const data = response?.data;
        const status = response?.data?.status;
        if (status === 0) {
          alert(data.message);
        } else if (status === 1) {
          const token = response?.data?.token;
          const encryptedToken = CryptoJS.AES.encrypt(
            token,
            secretKey
          ).toString();
          localStorage.setItem("jwtToken", encryptedToken);
          const role_name = data?.user?.type;
          localStorage.setItem("role_name", role_name);
          if (role_name === "Academy Admin")
            localStorage.setItem("id", data?.user?.id);
          else
          {localStorage.setItem("id", data?.user?.id);
            localStorage.setItem("academy_id", data?.user?.parent_id);
          }
          const landingUrl = response?.data?.landingurl;
          localStorage.setItem("landingUrl", landingUrl);
          const userPath = data?.permissions?.split(",");
          userPath.push(landingUrl);
          const userPathTot = userPath.join(",");
          const encryptedUserPathTot = CryptoJS.AES.encrypt(
            userPathTot,
            secretKey
          ).toString();
          localStorage.setItem("encryptedUserPathTot", encryptedUserPathTot);
          navigate(landingUrl);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "Invalid or expired token."
        ) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("jwtToken");
          navigate("/");
        } else {
          console.log(error);
        }
      });
  };
  const forgetPass = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("please the email");
    }
    const updateForm = {
      email: email,
    };
    axios
      .post(OTP, updateForm)
      .then((response) => {
        const data = response?.data;
        const status = response?.data?.status;
        console.log(data);
        if (status === 0) {
          alert(data.message);
        } else if (status === 1) {
          localStorage.setItem("email", email);
          navigate("/reset");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "Invalid or expired token."
        ) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("jwtToken");
          navigate("/");
        } else {
          console.log(error);
        }
      });
  }
  const renderLoginForm = () => {
    const encryptedToken = localStorage.getItem("jwtToken");
    return encryptedToken ? null : (
      <>
        <LoginHeader />
        <main className="main-registration">
          <div className="free-trial-section">
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

            <img src={CRMImage} alt="" />
          </div>

          <div className="login-form-section">
            <h2 className="login-form-heading">
              Login To <span>Lead</span>Planer
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="login-page-fields">
                <label for="" className="login-labels">
                  Work Email *
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={handleUserName}
                  className="login-form-input"
                  placeholder="Enter Email Address"
                  id=""
                />
              </div>

              <div className="login-page-fields">
                <label for="" className="login-labels">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePassword}
                  className="login-form-input"
                  placeholder="Enter Password"
                />
              </div>

              <div>
                <p className="login-forget-password" onClick={forgetPass}>forget Password?</p>
              </div>

              <div className="login-checkbox">
                <input type="checkbox" />
                <label for="">Remember me?</label>
              </div>

              <input
                type="submit"
                value="Login"
                className="login-continue-btn"
              />
            </form>
          </div>
        </main>

        <LoginFooter />
      </>
    );
  };

  return <>{renderLoginForm()}</>;
};

export default Login;
