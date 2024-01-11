import React, { useState, useEffect } from "react";
import "../styles/LPleads.css";
import CRMEmail from "../CRMEmail";
import CalendarIcon from "../../assets/image/calendar-edit.svg";
import GreaterArrow from "../../assets/image/greater-arrow.svg";
import GreaterDown from "../../assets/image/greater-arrow-down.svg";
import Arrow from "../../assets/image/arrow-right.svg";
import axios from "axios";
import {
  ADD_EMAIL,
  POST_EMAIL,
  handleLogout,
  USER_INFO,
  getDecryptedToken,
} from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DealEmail = ({ type, id, dealName, ownerId, idOfOwner, email }) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [stateAdd, setStateAdd] = useState(0);
  const [dataFromChild, setDataFromChild] = useState("");
  const decryptedToken = getDecryptedToken();
  const [emailInput, setEmailInput] = useState("");
  const [toEmails, setToEmails] = useState(email ? [{ email: email, name: dealName }] : []);
  const [emailInput2, setEmailInput2] = useState("");
  const [toEmails2, setToEmails2] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [owner, setOwner] = useState("");
  const [openEmailId, setOpenEmailId] = useState(null);
  const [number, setNumber] = useState(0);
  const toggleEmail = (emailId) => {
    if (openEmailId === emailId) {
      setOpenEmailId(null);
      setNumber(0);
    } else {
      setOpenEmailId(emailId);
      setNumber(1);
    }
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleSelectChange = (e) => {
    setSubject(e.target.value);
  };
  const handleEmailInputKeyPress = (event) => {
    if (event.key === "Enter" && emailInput.trim() !== "") {
      setToEmails([...toEmails, { email: emailInput.trim(), name: dealName }]);
      setEmailInput("");
    }
  };

  function extractTextFromHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  function extractTextFromHtml2(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (textContent.length > 120) {
      textContent = textContent.slice(0, 120) + "...";
    }

    return textContent;
  }

  const handleEmailInputChange2 = (event) => {
    setEmailInput2(event.target.value);
  };
  const handleEmailInputKeyPress2 = (event) => {
    if (event.key === "Enter" && emailInput2.trim() !== "") {
      setToEmails2([
        ...toEmails2,
        { email: emailInput2.trim(), name: dealName },
      ]);
      setEmailInput2("");
    }
  };

  const handleRemoveEmail = (index, listType) => {
    if (listType === "toEmails") {
      const updatedToEmails = [...toEmails];
      updatedToEmails.splice(index, 1);
      setToEmails(updatedToEmails);
    } else if (listType === "toEmails2") {
      const updatedToEmails2 = [...toEmails2];
      updatedToEmails2.splice(index, 1);
      setToEmails2(updatedToEmails2);
    }
  };

  async function getUser() {
    try {
      const response = await axios.get(USER_INFO, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response?.data?.data;
      if (response.data.status === 1) {
        setOwner(data[0]);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  }

  const handleDataTransfer = (data) => {
    setDataFromChild(data);
    setStateAdd(1);
  };

  const expandEditor = () => {
    setOpenEditor(true);
  };

  const closeEditor = () => {
    setOpenEditor(false);
    setStateAdd(0);
  };

  const handleAddEmail = () => {
    let updatedTo = toEmails;
    let updatedCc = toEmails2;

    if (emailInput.trim() !== "") {
      updatedTo = [...updatedTo, { email: emailInput.trim(), name: dealName }];
    }

    if (emailInput2.trim() !== "") {
      updatedCc = [...updatedCc, { email: emailInput2.trim(), name: dealName }];
    }
    if (emailInput2.trim() === "" && emailInput.trim() !== "") {
      updatedCc = [...updatedCc, { email: emailInput.trim(), name: dealName }];
    }

    if (updatedCc.length === 0) {
      updatedCc = [...updatedTo];
    }

    const updatedFormData = {
      source_id: id,
      source: type,
      subject: subject,
      html: dataFromChild,
      to: updatedTo,
      cc: updatedCc,
    };

    console.log(updatedFormData);
    axios
      .post(ADD_EMAIL, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        if (response?.data?.status === 1) {
          console.log(response?.data);
          toast.success("Email send successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          handleGetEmail();
        } else {
          toast.error("Something went wrong", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setToEmails([]);
    setToEmails2([]);
    setDataFromChild("");
    setEmailInput("");
    setEmailInput2("");
    setOpenEditor(false);
    setStateAdd(0);
  };

  const handleGetEmail = () => {
    const updatedFormData = {
      source: type,
      source_id: id,
    };
    axios
      .post(POST_EMAIL, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        if (response?.data?.status === 1) {
          setAllEmails(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    handleGetEmail();
  }, []);

  return (
    <>
    {
      ownerId === idOfOwner && (
        <>
        {!openEditor ? (
        <div className="colapedEditor" onClick={expandEditor}>
          <p>Click here to send email</p>
        </div>
      ) : (
        <>
          <div
            className={`email-top-cc ${
              type === "deal"
                ? " email-top-deal"
                : type === "lead"
                ? " email-top-lead"
                : type === "xx_company"
                ? " email_xx_company"
                : type === "xx_contact_person"
                ? " email_xx_contact_person"
                : ""
            }`}
          >
            <div>
              <div>
                <label htmlFor="emailInput" className="email-to">
                  To :
                </label>
                <input
                  type="email"
                  id="emailInput"
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  onKeyPress={handleEmailInputKeyPress}
                  className={`email-to-input${
                    type === "deal"
                      ? " email-deal"
                      : type === "lead"
                      ? " email-lead"
                      : ""
                  }`}
                />
              </div>
              <div>
                <ul className="email-ul">
                  {toEmails.map((email, index) => (
                    <li key={index}>
                      <span
                        className="email-cross"
                        onClick={() => handleRemoveEmail(index, "toEmails")}
                      >
                        X
                      </span>
                      {email?.email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div>
                <label htmlFor="emailInput">Cc:</label>
                <input
                  type="email"
                  id="emailInput2"
                  value={emailInput2}
                  onChange={handleEmailInputChange2}
                  onKeyPress={handleEmailInputKeyPress2}
                  className={`email-to-input${
                    type === "deal"
                      ? " email-deal"
                      : type === "lead"
                      ? " email-lead"
                      : ""
                  }`}
                />
              </div>
              <div>
                <ul className="email-ul">
                  {toEmails2.map((email, index) => (
                    <li key={index}>
                      <span
                        className="email-cross"
                        onClick={() => handleRemoveEmail(index, "toEmails2")}
                      >
                        X
                      </span>
                      {email?.email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div>
                <label htmlFor="emailInput">Subject:</label>
                <input
                  type="text"
                  id="emailInput3"
                  className={`email-to-input${
                    type === "deal"
                      ? " email-deal"
                      : type === "lead"
                      ? " email-lead"
                      : ""
                  }`}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
          </div>

          <div className="notesEditor">
            <CRMEmail onDataTransfer={handleDataTransfer} type={type} />
          </div>
          <div className="addNoteBtn email-save-cancel">
            <button
              className="common-fonts common-white-button"
              onClick={closeEditor}
            >
              Cancel
            </button>
            {stateAdd === 0 ? (
              <button
                disabled
                className="common-fonts common-inactive-button note-btn"
              >
                Send
              </button>
            ) : (
              <button
                className="common-fonts common-save-button note-btn"
                onClick={handleAddEmail}
              >
                Send
              </button>
            )}
          </div>
        </>
      )}

        </>
      )
    }


      {allEmails.map((mail) => {
        const recipientData = JSON.parse(mail.recipient);
        const recipientEmails = recipientData
          .map((recipient) => recipient.email)
          .join(", ");
        const emailClassName =
          openEmailId === mail.id ? "email-open" : "email-close";
        return (
          <div
            className="activity-task-map email-map"
            key={mail.id}
            onClick={() => toggleEmail(mail.id)}
          >
            <div className="activity-bottom">
              <div className="savedNotes activity-save-note">
                <>
                  <section
                    className={`note-display email-task-map ${emailClassName}`}
                  >
                    <div className="note-content activity-content">
                      <div className="arrow-greater activity-new-arrow">
                        {openEmailId === mail.id ? (
                          <img src={GreaterDown} alt="" />
                        ) : (
                          <img src={GreaterArrow} alt="" />
                        )}
                      </div>

                      <div className="notes-main">
                        <div className="activity-flex">
                          <div className="notes-by activity-by ">
                            <p className="common-fonts email-call">
                              {mail.subject}
                            </p>

                            <div className="activity-date-time">
                              <img src={CalendarIcon} alt="" />
                              <p className="common-fonts activity-due">
                                {mail.sent_date &&
                                mail.sent_date.includes("T") &&
                                mail.sent_date.includes(".")
                                  ? mail.sent_date.split("T")[0] +
                                    " at " +
                                    mail.sent_date.split("T")[1].split(".")[0]
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {openEmailId !== mail.id && (
                          <div className={`activity-phone email-tab-view`}>
                            <p className="common-fonts email-assign-arrow">
                              <span>
                                {owner.first_name} {owner.last_name}
                              </span>
                              <img src={Arrow} alt="" />{" "}
                              <span>{recipientEmails}</span>
                            </p>
                            <p className="common-fonts">
                              {extractTextFromHtml2(mail.html)}
                            </p>
                          </div>
                        )}

                        {openEmailId === mail.id && (
                          <>
                            <div className={`activity-phone email-tab-view`}>
                              <p className="common-fonts email-sender-name">
                                <span>From:</span> {owner.first_name}{" "}
                                {owner.last_name}
                              </p>
                              <p className="common-fonts email-reciever-name">
                                <span>To:</span>
                                {recipientEmails}
                              </p>
                              <p className="common-fonts">
                                {extractTextFromHtml(mail.html)}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DealEmail;
