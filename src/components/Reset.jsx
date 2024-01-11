import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { VERIFY_OTP, MAIN_PASS, GET_PASSWORD } from "./utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";
import CRMImage from "../assets/image/crm.svg";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState(0);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const [passDes, setPassDes] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [minLength, setMinLength] = useState(false);
  const [hasNumberSymbolWhitespace, setHasNumberSymbolWhitespace] =
    useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passBtn, setPassBtn] = useState(false);
  const [input, setInput] = useState(false);
  const orgId = localStorage.getItem("org_id");

  const passGet = () => {
    axios
    .get(GET_PASSWORD + (orgId ? `/${orgId}` : `/${email}`) + (orgId ? "/true" : "/false"))
    .then((response) => {
      setPassDes(response?.data?.data);
      response?.data?.data?.forEach((condition) => {
        console.log(condition);
        switch (condition.term) {
          case "password_length":
            setMinLength(condition.active === 1);
            break;
          case "number_symbol":
            setHasNumberSymbolWhitespace(condition.active === 1);
            break;
          case "uppercase":
            setHasUppercase(condition.active === 1);
            break;
          case "lowercase":
            setHasSpecialCharacter(condition.active === 1);
            break;
          // Add more cases for other conditions if needed
          default:
            break;
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  

  };
  useEffect(() => {
    passGet();
  }, []);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassBtn(true);
    setPassword(newPassword);
    // Use the passDes array to dynamically update the password criteria
    passDes.forEach((condition) => {
      switch (condition.term) {
        case "password_length":
          setMinLength(newPassword.length >= parseInt(condition.value));
          break;
        case "number_symbol":
          setHasNumberSymbolWhitespace(
            new RegExp(`[${condition.value}]`).test(newPassword)
          );
          break;
        case "uppercase":
          setHasUppercase(
            (newPassword.match(/[A-Z]/g) || []).length >=
              parseInt(condition.value)
          );
          break;
        case "lowercase":
          setHasSpecialCharacter(
            (newPassword.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g) || [])
              .length >= parseInt(condition.value)
          );
          break;
        // Add more cases for other conditions if needed
        default:
          break;
      }
    });

    if (confirmPassword !== "") {
      setPasswordMatch(newPassword === confirmPassword);
    }
  };
  const handleChange = (event) => {
    setPassword(event.target.value);
    setPassBtn(true);
  };
  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(newConfirmPassword === password);
  };

  const handleSave = () => {
    if (passwordMatch) {
      if (
        minLength &&
        hasNumberSymbolWhitespace &&
        hasUppercase &&
        hasSpecialCharacter
      ) {
        const updatedForm = {
          email: email,
          otp: otp,
          password: password,
        };
        axios
          .post(MAIN_PASS, updatedForm)
          .then((response) => {
            // Handle successful response
            toast.success("Password saved successfully", {
              position: "top-center",
              autoClose: 2000,
            });
            navigate("/");
          })
          .catch((error) => {
            // Handle error
            toast.error("Error saving password", {
              position: "top-center",
              autoClose: 2000,
            });
          });
      } else {
        toast.error("Fulfil password policy", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  const handleSave2 = () => {
    if (passwordMatch) {
      console.log(password);
      const updatedForm = {
        email: email,
        otp: otp,
        password: password,
      };
      axios
        .post(MAIN_PASS, updatedForm)
        .then((response) => {
          toast.success("Password saved successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          navigate("/");
        })
        .catch((error) => {
          // Handle error
          toast.error("Error saving password", {
            position: "top-center",
            autoClose: 2000,
          });
        });
    }
  };

  // Handle OTP input change for individual digits
  const handleOtpChange = (index, event) => {
    const value = event.target.value;

    if (/^[0-9]$/.test(value) && index < otpDigits.length) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      // Move cursor to the next input field
      if (index < otpDigits.length - 1) {
        otpInputRefs[index + 1].current.focus();
      }

      // Check if all 4 digits are entered and make the API call
      if (newOtpDigits.every((digit) => digit !== "")) {
        const enteredOtp = newOtpDigits.join("");
        makeApiCallForOtpValidation(enteredOtp);
        setOtp(enteredOtp);
      }
    }
  };

  // Function to make the API call for OTP validation
  const makeApiCallForOtpValidation = (otp) => {
    // Replace with your API endpoint for OTP validation
    const updatedForm = {
      email: email,
      otp: parseInt(otp),
    };
    axios
      .post(VERIFY_OTP, updatedForm)
      .then((response) => {
        const data = response?.data;
        const status = response?.data?.status;
        setInput(true);
        console.log(data);
        if (status === 0) {
          alert(data.message);
        } else if (status === 1) {
          setOtp(parseInt(otp));
        }
      })
      .catch((error) => {
        // Handle error response
        console.error("OTP validation error:", error);
        // Add your logic to display an error message to the user
      });
  };

  return (
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
          <h2 className="login-form-heading">Forgot Password</h2>

          <>
            <div className="login-page-fields">
              <label for="" className="login-labels">
                OTP
              </label>
              <br />
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="number" // Keep input type as "number"
                  className="otpBoxNum"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  ref={otpInputRefs[index]} // Set the ref for focus control
                />
              ))}
            </div>

            <div>
              {input ? (
                <>
                  <div>
                    <div className="pwd-label">
                      <label htmlFor="" className="common-fonts pwd-heading">
                        New Password
                      </label>
                      <div className="password-input-wrapper">
                        {/* ========================================================================================================== */}
                        {passDes &&
                        passDes.some(
                          (condition) =>
                          condition.term === "is_enabled" && condition.active === 1
                        ) ? (
                          <input
                            type={showPassword ? "text" : "password"}
                            className="common-fonts common-input pwd-input"
                            onChange={handlePasswordChange}
                            value={password}
                          />
                        ) : (
                          <input
                            type={showPassword ? "text" : "password"}
                            onChange={handleChange}
                            className="common-fonts common-input pwd-input"
                            value={password}
                          />
                        )}
                        {/* =================================================================================================================== */}
                        <button
                          className="password-toggle-button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <i className="fa-sharp fa-solid fa-eye-slash "></i>
                          ) : (
                            <i className="fa-sharp fa-solid fa-eye "></i>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="pwd-label">
                      <label htmlFor="" className="common-fonts pwd-heading">
                        Confirm Password
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`common-fonts common-input pwd-input ${
                            confirmPassword && !passwordMatch
                              ? "password-mismatch"
                              : ""
                          }`}
                          onChange={handleConfirmPasswordChange}
                          value={confirmPassword}
                        />
                        <button
                          className="password-toggle-button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <i className="fa-sharp fa-solid fa-eye-slash "></i>
                          ) : (
                            <i className="fa-sharp fa-solid fa-eye "></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="pwd-label">
                      <label htmlFor="" className="common-fonts pwd-heading">
                        New Password
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          disabled
                          type={showPassword ? "text" : "password"}
                          className="common-fonts common-input pwd-input"
                          onChange={handlePasswordChange}
                          value={password}
                        />
                        <button className="password-toggle-button">
                          {" "}
                          <i className="fa-sharp fa-solid fa-eye "></i>
                        </button>
                      </div>
                    </div>
                    <div className="pwd-label">
                      <label htmlFor="" className="common-fonts pwd-heading">
                        Confirm Password
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          disabled
                          className={`common-fonts common-input pwd-input`}
                        />
                        <button className="password-toggle-button">
                          <i className="fa-sharp fa-solid fa-eye "></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {passDes &&
              passDes.some(
                (condition) => condition.term === "is_enabled" && condition.active === 1
              ) ? (
                <div className="pwd-rules">
                  <p className="common-fonts pwd-policy">Password policy :</p>
                  {/* Minimum 8 characters long */}
                  {passDes.map((item) =>
                     item.term === "password_length" ? (
                      <p key={item.id} className="common-fonts password-text">
                        <div className="password-rules">
                          <div>
                            <label className="custom-checkbox password-checkbox">
                              <input
                                type="checkbox"
                                className="cb1"
                                checked={minLength}
                                readOnly
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <p className="common-fonts password-text">
                            Minimum {item.value} characters long
                          </p>
                        </div>
                      </p>
                    ) : null
                  )}

                  {/* 1 number, symbol, or whitespace character */}
                  {passDes.map((item) =>
                    item.term === "number_symbol" ? (
                      <p key={item.id} className="common-fonts password-text">
                        <div className="password-rules">
                          <div>
                            <label className="custom-checkbox password-checkbox">
                              <input
                                type="checkbox"
                                className="cb1"
                                checked={hasNumberSymbolWhitespace}
                                readOnly
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div>
                            <p className="common-fonts password-text">
                              {item.value} number, symbol, or whitespace
                              character
                            </p>
                          </div>
                        </div>
                      </p>
                    ) : null
                  )}

                  {/* 1 uppercase letter */}
                  {passDes.map((item) =>
                    item.term === "uppercase" ? (
                      <p key={item.id} className="common-fonts password-text">
                        <div className="password-rules">
                          <div>
                            <label className="custom-checkbox password-checkbox">
                              <input
                                type="checkbox"
                                className="cb1"
                                checked={hasUppercase}
                                readOnly
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div>
                            <p className="common-fonts password-text">
                              {item.value} uppercase letter
                            </p>
                          </div>
                        </div>
                      </p>
                    ) : null
                  )}

                  {/* 1 special character */}
                  {passDes.map((item) =>
                    item.term === "lowercase" ? (
                      <p key={item.id} className="common-fonts password-text">
                        <div className="password-rules">
                          <div>
                            <label className="custom-checkbox password-checkbox">
                              <input
                                type="checkbox"
                                className="cb1"
                                checked={hasSpecialCharacter}
                                readOnly
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div>
                            <p className="common-fonts password-text">
                              {item.value} special character
                            </p>
                          </div>
                        </div>
                      </p>
                    ) : null
                  )}
                </div>
              ) : (
                <></>
              )}
              {passBtn ? (
                <div className="recycle-popup-btn">
                  {passDes &&
                  passDes.some(
                    (condition) => condition.term === "is_enabled" && condition.active === 1
                  ) ? (
                    <button
                      className="restore-yes common-fonts"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="restore-yes common-fonts"
                      onClick={handleSave2}
                    >
                      Save
                    </button>
                  )}
                </div>
              ) : (
                <div className="recycle-popup-btn">
                  <button className="common-inactive-button" disable>
                    Save
                  </button>
                </div>
              )}
            </div>
            <ToastContainer />
          </>
        </div>
      </main>

      <LoginFooter />
    </>
  );
};

export default Reset;
