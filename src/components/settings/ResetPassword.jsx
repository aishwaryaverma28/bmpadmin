import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library
import {
  UPDATE_TEAM_MEM,
  getDecryptedToken,
  GET_PASSWORD,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = ({ onClose, user }) => {
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
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem("org_id");
  const email = localStorage.getItem("email");

  const passGet = () => {
      axios
      .get(GET_PASSWORD + (orgId ? `/${orgId}` : `/${email}`) + (orgId ? "/true" : "/false"), {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          setPassDes(response?.data?.data);
          response?.data?.data?.forEach((condition) => {
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
        axios
          .put(
            UPDATE_TEAM_MEM + user,
            { password: password },
            {
              headers: {
                Authorization: `Bearer ${decryptedToken}`,
              },
            }
          )
          .then((response) => {
            // Handle successful response

            toast.success("Password saved successfully", {
              position: "top-center",
              autoClose: 2000,
            });
            onClose();
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
      axios
        .put(
          UPDATE_TEAM_MEM + user,
          { password: password },
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        )
        .then((response) => {
          // Handle successful response

          toast.success("Password saved successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          onClose();
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
  return (
    <div className="recycle-popup-wrapper">
      <div className="assign-role-popup-container">
        <div className="recycle-popup-box reset-password-box">
          <p className="common-fonts reset-password-heading">Reset password</p>
        </div>

        <div>
          <div className="pwd-label">
            <label htmlFor="" className="common-fonts pwd-heading">
              New Password
            </label>
            <div className="password-input-wrapper">
              {/* ========================================================================================================== */}
              {passDes?.some(
                (condition) => condition.term === "is_enabled" && condition.active === 1
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
                  confirmPassword && !passwordMatch ? "password-mismatch" : ""
                }`}
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
              />
              <button
                className="password-toggle-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        {passDes?.some(
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
                        {item.value} number, symbol, or whitespace character
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
        <div className="recycle-popup-btn">
          <button className="restore-no common-fonts" onClick={onClose}>
            Cancel
          </button>
          {passDes?.some(
            (condition) => condition.term === "is_enabled" && condition.active === 1
          ) ? (
            <button className="restore-yes common-fonts" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="restore-yes common-fonts" onClick={handleSave2}>
              Save
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
