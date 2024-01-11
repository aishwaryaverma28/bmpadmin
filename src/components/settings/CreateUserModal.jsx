import React, { useState, useEffect } from "react";
import axios from "axios";
import { ADD_USER, getDecryptedToken, GET_PASSWORD } from "../utils/Constants";
import "../styles/LPUserAndTeam.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUserModal = ({ onClose, onUserAdded, userActive, orgId }) => {
  const decryptedToken = getDecryptedToken();
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    org_id: orgId,
  });

  const [passDes, setPassDes] = useState([]);
  const [password, setPassword] = useState("");
  const [minLength, setMinLength] = useState(false);
  const [hasNumberSymbolWhitespace, setHasNumberSymbolWhitespace] =
    useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
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

  console.log(passDes);

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
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  }
  function handlePasswordEye(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  const handleSave = (e) => {
    e.preventDefault();
     if(minLength && hasNumberSymbolWhitespace && hasUppercase && hasSpecialCharacter)
        {
     const updated = { ...details, password: password, org_id:orgId };
      axios
        .post(ADD_USER, updated, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        })
        .then((response) => {
          console.log(response);
          onUserAdded(); // Call the onLeadAdded function from props
          userActive();
          if(response.data.status===1){
            toast.success("User added successfully", {
              position: "top-center",
              autoClose:2000
            });
          }else{
            toast.error(response?.data?.message, {
              position: "top-center",
              autoClose:2000
            });
          }

          onClose();
        })
        .catch((error) => {
          console.log(error);
        });
      }
          else{
          toast.error("Fulfil password policy", {
            position: "top-center",
            autoClose:2000
          });
        }
    };

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(ADD_USER, details, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if(response.data.status===1){
          toast.success("User added successfully", {
            position: "top-center",
            autoClose:2000
          });
        }else{
          toast.error(response.data.message, {
            position: "top-center",
            autoClose:2000
          });
        }

        setDetails({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          password: "",
        });
        onUserAdded(); // Call the onLeadAdded function from props
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="modalUserOverlay">
      <div className="userModal">
        <div className="modalHeading">
          <p>Add User</p>
          <span className="modal-close" onClick={onClose}>
            X
          </span>
        </div>
        <form className="createUserForm">
          <div className="inputDiv">
            <label htmlFor="first_name">First Name <span className="common-fonts redAlert"> *</span></label>
            <br />
            <input
              type="text"
              name="first_name"
              onChange={handleChange}
              id="first_name"
              placeholder="First Name"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="last_name">Last Name <span className="common-fonts redAlert"> *</span></label>
            <br />
            <input
              type="text"
              name="last_name"
              onChange={handleChange}
              id="last_name"
              placeholder="Last Name"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="phone">Contact <span className="common-fonts redAlert"> *</span></label>
            <br />
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              id="phone"
              placeholder="Phone"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="email">Email <span className="common-fonts redAlert"> *</span></label>
            <br />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              id="email"
              placeholder="email"
              className="email-case"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="profile">Profile</label>
            <br />
            <input
              type="text"
              name=""
              // onChange={handleChange}
              id="profile"
              placeholder="profile"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="password">Password <span className="common-fonts redAlert"> *</span></label>
            <br />
            <div className="create-user-input-wrapper">
              {passDes?.some(
                (condition) => condition.term === "is_enabled" && condition.active === 1
              ) ? (
                <input
                  type={showPassword ? "text" : "password"}
                  className="common-fonts"
                  onChange={handlePasswordChange}
                  value={password}
                />
              ) : (
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  className="common-fonts"
                  // value={password}
                  name="password"
                />
              )}
              <button
                className="create-user-toggle-button "
                onClick={handlePasswordEye}
              >
                {showPassword ? (
                  <i className="fa-sharp fa-solid fa-eye-slash "></i>
                ) : (
                  <i className="fa-sharp fa-solid fa-eye "></i>
                )}
              </button>
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
                <p className="common-fonts password-text">{item.value} uppercase letter</p>
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
                <p className="common-fonts password-text">{item.value} special character</p>
              </div>
            </div>
                </p>
              ) : null
            )}
            
          </div>
        ) : (
          <></>
        )}
          <div className="submitBtnBox">
            <button className="userCancelBtn">Cancel</button>
            {passDes?.some(
              (condition) => condition.term === "is_enabled" && condition.active === 1
            ) ? (
              <button className="restore-yes common-fonts" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button
                className="restore-yes common-fonts"
                onClick={handleSubmit}
              >
                Save2
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateUserModal;
