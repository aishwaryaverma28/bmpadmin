import React, { useState } from "react";
import axios from "axios";
import { getDecryptedToken, ADD_PEOPLE } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PeopleModal = ({ onClose , fetchPeople }) => {
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem("org_id");
  const [people, setPeople] = useState({
    name: "",
    organization: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    postal_code: "",
    org_id: orgId
  });
  const [stateBtn, setStateBtn] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeople((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);
  };

  const resetForm = () => {
    setPeople({
      name: "",
      organization: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      postal_code: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(ADD_PEOPLE, people, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response.data.status);
        if (response.data.status == 1) {
          toast.success("People is added successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          fetchPeople();
          onClose();
        } else {
          toast.error(response.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setPeople({
          name: "",
          organization: "",
          phone: "",
          email: "",
          city: "",
          state: "",
          postal_code: "",
        });
        setStateBtn(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error("some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="popup-wrapper">
      <div className="product-popup-container">
        <div className="product-popup-box">
          <p className="common-fonts add-product-heading">Add Person</p>
          <div className="product-popup-content">
            <form action="">
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Name
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <input
                  type="text"
                  className="common-input"
                  name="name"
                  onChange={handleChange}
                  value={people.name}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Organization
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  className="common-input"
                  name="organization"
                  onChange={handleChange}
                  value={people.organization}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Phone
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="number"
                  className="common-input"
                  name="phone"
                  onChange={handleChange}
                  value={people.phone}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Email
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="email"
                  className="common-input"
                  name="email"
                  onChange={handleChange}
                  value={people.email}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  City
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="email"
                  className="common-input"
                  name="city"
                  onChange={handleChange}
                  value={people.city}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  State
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="email"
                  className="common-input"
                  name="state"
                  onChange={handleChange}
                  value={people.state}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Postal Code
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="email"
                  className="common-input"
                  name="postal_code"
                  onChange={handleChange}
                  value={people.postal_code}
                />
              </div>
            </form>
            <div className="product-popup-bottom">
              <button className="common-white-button" onClick={handleClose}>
                Cancel
              </button>
              {stateBtn === 0 ? (
                <button className="disabledBtn" disabled>
                  Save
                </button>
              ) : (
                <button
                  className="common-save-button product-popup-save"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="help-cross" onClick={handleClose}>
        X
      </div>
    </div>
  );
};

export default PeopleModal;
