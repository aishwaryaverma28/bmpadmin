import React, { useRef, useState } from "react";
import "../styles/CPGenral.css";
import axios from "axios";
import { UPDATE_TICKET, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRequest = ({ onClose, ticket }) => {
  const decryptedToken = getDecryptedToken();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [stateBtn, setStateBtn] = useState(0);
  const [details, setDetails] = useState({
    title: ticket.title,
    description: ticket.description,
    email: ticket.email,
    mobile: ticket.mobile,
    category: ticket.category,
    priority: ticket.priority,
  });
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
    setStateBtn(1);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // You can upload the file to the server here using APIs, if needed.
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    console.log(details);
    axios
      .put(UPDATE_TICKET + ticket?.id, details, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Employee data updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  return (
    <div className="popup-wrapper">
      <div className="product-popup-container">
        <div className="product-popup-box edit-service-box">
          <div>
            <p className="common-fonts contact-support-heading">Edit Service</p>
            <div>
              <form>
                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    className="common-fonts common-input contact-tab-input"
                    value={details?.title}
                  />
                </div>

                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    onChange={handleChange}
                    className="common-fonts common-input contact-tab-input contact-tab-textarea"
                    placeholder="Describe your issue in detail"
                    value={details?.description}
                  ></textarea>
                </div>

                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Moblie No.
                  </label>
                  <div>
                    <input
                      type="text"
                      name="mobile"
                      onChange={handleChange}
                      className="common-input contact-tab-input"
                      value={details?.mobile}
                    />
                  </div>
                </div>

                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Confirm email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    className="common-fonts common-input contact-tab-input email-case"
                    value={details?.email}
                  />
                </div>

                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Type of issue
                  </label>
                  <select
                    name="category"
                    onChange={handleChange}
                    className="common-input contact-type-of-issue"
                    value={details?.category}
                  >
                    <option value="technical">Technical</option>
                    <option value="Non Technical">Non Technical</option>
                  </select>
                </div>

                <div className="contact-tab-fields">
                  <label htmlFor="" className="common-fonts contact-tab-label">
                    Priority
                  </label>
                  <select
                    name="priority"
                    onChange={handleChange}
                    className="common-input contact-type-of-issue"
                    value={details?.priority}
                  >
                    <option value="Low">Low</option>
                    <option value="Average">Average</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="contact-tab-fields">
                  <label
                    htmlFor="fileInput"
                    className="common-fonts contact-tab-label"
                  >
                    Attachment
                  </label>
                  <div className="contact-browse">
                    <span
                      className="common-fonts common-input contact-tab-input"
                      style={{
                        position: "relative",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <button
                        onClick={handleBrowseClick}
                        className="contact-browse-btn common-fonts"
                      >
                        Browse
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        style={{
                          opacity: 0,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          cursor: "pointer",
                        }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      {fileName && (
                        <span className="common-fonts upload-file-name">
                          Selected File: {fileName}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="contact-support-button">
                  {stateBtn === 0 ? (
                    <button className="disabledBtn" disabled>
                      Update
                    </button>
                  ) : (
                    <button
                      className="common-save-button permission-save-btn"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  )}
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
      <div className="help-cross" onClick={onClose}>
        X
      </div>
    </div>
  );
};

export default EditRequest;
