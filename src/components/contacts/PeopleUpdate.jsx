import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import arrowLeft from "../../assets/image/arrow-left.svg";
import Building from "../../assets/image/building.svg";
import User from "../../assets/image/user-icon.svg";
import Calender from "../../assets/image/calendar-new.svg";
import Copy from "../../assets/image/copy.svg";
import AddNotes from "../deal/AddNotes.jsx";
import DealEmail from "../deal/DealEmail.jsx";
import DealActivity from "../deal/DealActivity.jsx";
import axios from "axios";
import {
  getDecryptedToken,
  UPDATE_PEOPLE,
  GET_COMPANY,
  POST_EMAIL,
  GETNOTEPEOPLE,
  handleLogout,
  GET_ACTIVE_TEAM_MEM,
  GET_ACTIVITY,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateLead from "../lead/CreateLead.jsx";
import CreateDeal from "../deal/CreateDeal.jsx";

const CompanyUpdate = () => {
  const { id } = useParams();
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem('org_id');
  const [notes, setNotes] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [ShowUpdateButton, setShowUpdateButton] = useState(false);
  const [stateBtn, setStateBtn] = useState(0);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isDealOpen, setIsDealsOpen] = useState(false);
  const [isLeadsOpen, setIsLeadssOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [allEmails, setAllEmails] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activityCount, setActivityCount] = useState();
  const [peopleDetails, setpeopleDetails] = useState({
    name: "",
    organization: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDealOpen, setIsModalDealOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openDealModal = () => {
    setIsModalDealOpen(true);
  };

  const closeDealModal = () => {
    setIsModalDealOpen(false);
  };
  const userAdded = () => {
    axios
      .post(GET_ACTIVE_TEAM_MEM,{orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const responseData = response?.data?.data;
        console.log("dddw");
        setUserData(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchNotes = () => {
    axios
      .get(GETNOTEPEOPLE + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          setNotes(response?.data?.data?.length);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };

  useEffect(() => {
    fetchNotes();
  }, [notes]);

  const handleGetEmail = () => {
    const updatedFormData = {
      source: "xx_contact_person",
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
    handleGetEmail();
  }, [allEmails]);

  const fetchData = () => {
    const body = {
      contactType: "xx_contact_person",
      contactId: id,
    };

    axios
      .post(GET_COMPANY, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const responseData = response?.data?.data[0];
        setCompanyName(response?.data?.data[0]?.organization);
        const updatedpeopleDetails = {
          name: responseData.name,
          organization: responseData.organization,
          phone: responseData.phone,
          email: responseData.email,
          city: responseData.city,
          state: responseData.state,
          postal_code: responseData.postal_code,
        };
        setpeopleDetails(updatedpeopleDetails);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchCall = () => {
    axios
      .get(GET_ACTIVITY + "xx_contact_person/" + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setActivityCount(response?.data?.data?.length);
      })

      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };

  useEffect(() => {
    fetchCall();
  }, [activityCount]);

  useEffect(() => {
    fetchData();
    userAdded();
  }, []);

  const handleSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };
  const handleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };
  const handleContacts = () => {
    setIsContactsOpen(!isContactsOpen);
  };
  const handleLeads = () => {
    setIsLeadssOpen(!isLeadsOpen);
  };
  const handleDeals = () => {
    setIsDealsOpen(!isDealOpen);
  };

  const handleGoBack = () => {
    window.history.back(); // Navigate back in the browser history
  };

  const toggleEditable = (e) => {
    e.preventDefault();
    setIsEditable(!isEditable);
    setIsDisabled(!isDisabled);
    setShowUpdateButton(!ShowUpdateButton);
    setStateBtn(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setpeopleDetails({
      ...peopleDetails,
      [name]: value,
    });
    setStateBtn(1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateClick = (event) => {
    event.preventDefault();
    axios
      .put(UPDATE_PEOPLE + id, peopleDetails, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Person details updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          fetchData();
        } else {
          toast.error("Some error occured", {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setShowUpdateButton(false);
        setStateBtn(0);
      })
      .catch((error) => {
        console.log(error);
        setShowUpdateButton(false);
        setStateBtn(0);
      });

    setIsEditable(false);
    setIsDisabled(!isDisabled);
    setStateBtn(0);
  };

  const normalStylingInput = {
    color: "#1e2224",
    fontWeight: 400,
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    padding: "0.3rem",
    border: "1px solid transparent",
    height: "2rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
  };

  const editStylingInput = {
    color: "#1e2224",
    fontWeight: 400,
    border: "1px solid #dcdcdc",
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    padding: "0.3rem",
    height: "2rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
  };

  const normalStyling = {
    textAlign: "left",
    fontFamily: "Lexend Deca",
    fontSize: "1.125rem",
    fontWeight: 500,
    color: "#1e2224",
    lineHeight: "17px",
    border: "1px solid transparent",
    width: "100%",
    backgroundColor: "white",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
  };

  const editStyling = {
    border: "1px solid #dcdcdc",
    textAlign: "left",
    fontFamily: "Lexend Deca",
    fontSize: "1.125rem",
    fontWeight: 500,
    color: "#1e2224",
    lineHeight: "17px",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
  };

  const normalStylingSelect1 = {
    fontSize: " 0.8rem",
    fontFamily: '"Lexend Deca", sans-serif',
    fontWeight: 400,
    padding: "0.3rem",
    textTransform: "capitalize",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    border: "1px solid transparent",
    height: "2rem",
    width: "fit-content",
    color: " #1e2224",
    borderRadius: "5px",
  };

  const editStylingSelect1 = {
    width: "100%",
    color: " #1e2224",
    fontWeight: 400,
    border: "1px solid #dcdcdc",
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    padding: "0.1rem",
    height: "2rem",
    borderRadius: "5px",
  };

  return (
    <div className="contact-cpu-container">
      <div className="cpu-left-wrapper">
        <div className="cpu-left">
          <div className="go-back-btn cpu-back ">
            <button
              className="setting-font-style"
              onClick={handleGoBack}
              style={{ backgroundColor: "white" }}
            >
              <img src={arrowLeft} alt="" />
              <span>Go Back</span>
            </button>
          </div>

          <div className="cpu-top-details">
            <div className="cpu-building">
              <img src={Building} alt="" />
            </div>

            <div className="cpu-input-container">
              {isLoading ? (
                <span>-</span>
              ) : (
                <input
                  type="text"
                  value={peopleDetails.organization}
                  style={isEditable ? editStyling : normalStyling}
                  disabled={isDisabled}
                  onChange={handleInputChange}
                  name="organization"
                />
              )}

              {isLoading ? (
                <span>-</span>
              ) : (
                <input
                  type="number"
                  value={peopleDetails.phone}
                  style={isEditable ? editStylingInput : normalStylingInput}
                  disabled={isDisabled}
                  onChange={handleInputChange}
                  name="phone"
                />
              )}
            </div>

            <div className="cpu-icons">
              <i
                className="fa-solid fa-pen cpu-pen"
                onClick={toggleEditable}
              ></i>
              <i className="fas fa-ellipsis-h cpu-dot"></i>
            </div>
          </div>

          <div className="summaryDiv cpu-section">
            <p className="dealSectionHead" onClick={handleSummary}>
              {isSummaryOpen ? (
                <i class="fa-sharp fa-solid fa-angle-up"></i>
              ) : (
                <i class="fa-sharp fa-solid fa-angle-down"></i>
              )}
              Details
            </p>
            {/* <p className="addProduct cpu-add">
              <i class="fa-sharp fa-solid fa-plus"></i>Add
            </p> */}
          </div>
          {isSummaryOpen && (
            <div className="detailsContent cpu-content">
              <div className="dealsLeftContainer cpu-p">
                <p>Name</p>
                <p>Phone</p>
                <p>Email</p>
                <p>City</p>
                <p>State</p>
                <p>Postal Code</p>
              </div>

              <div className="detailsRightContainer">
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        name="name"
                        value={peopleDetails.name}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                      />
                    </span>
                  )}
                </p>

                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="number"
                        name="phone"
                        value={peopleDetails.phone}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                      />
                    </span>
                  )}
                </p>

                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="email"
                        name="email"
                        value={peopleDetails.email}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                        className="cpu-value"
                      />
                    </span>
                  )}
                </p>
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        name="city"
                        value={peopleDetails.city}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                        className="cpu-value"
                      />
                    </span>
                  )}
                </p>
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        name="state"
                        value={peopleDetails.state}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                        className="cpu-value"
                      />
                    </span>
                  )}
                </p>
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="number"
                        name="postal_code"
                        value={peopleDetails.postal_code}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                        className="cpu-value"
                      />
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="summaryDiv cpu-section">
            <p className="dealSectionHead" onClick={handleContacts}>
              {isContactsOpen ? (
                <i class="fa-sharp fa-solid fa-angle-up"></i>
              ) : (
                <i class="fa-sharp fa-solid fa-angle-down"></i>
              )}
              Contacts (2)
            </p>
            {/* <p className="addProduct cpu-add">
              <i class="fa-sharp fa-solid fa-plus"></i>Add
            </p> */}
          </div>
          {isContactsOpen && (
            <>
              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-name">Kevin doms</p>
                  <p className="common-fonts cpu-manager">Manager at hertz </p>
                  <p className="common-fonts cpu-mail">
                    kevin@mail.com <img src={Copy} alt="" />
                  </p>
                  <p className="common-fonts cpu-mail">
                    +62 8564239548 <img src={Copy} alt="" />
                  </p>
                  <div className="cpu-user-icon">
                    <img src={User} alt="" />
                  </div>
                  <div className="cpu-user-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>

              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-name">Kevin doms</p>
                  <p className="common-fonts cpu-manager">Manager at hertz </p>
                  <p className="common-fonts cpu-mail">
                    kevin@mail.com <img src={Copy} alt="" />
                  </p>
                  <p className="common-fonts cpu-mail">
                    +62 8564239548 <img src={Copy} alt="" />
                  </p>
                  <div className="cpu-user-icon">
                    <img src={User} alt="" />
                  </div>
                  <div className="cpu-user-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="summaryDiv cpu-section">
            <p className="dealSectionHead" onClick={handleLeads}>
              {isLeadsOpen ? (
                <i class="fa-sharp fa-solid fa-angle-up"></i>
              ) : (
                <i class="fa-sharp fa-solid fa-angle-down"></i>
              )}
              Leads (2)
            </p>
            <p className="addProduct cpu-add" onClick={openModal}>
              <i class="fa-sharp fa-solid fa-plus"></i>Add
            </p>
          </div>
          {isLeadsOpen && (
            <>
              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-lead">Hertz Deal</p>
                  <p className="common-fonts cpu-amount">
                    Amount: <span>$120000</span>{" "}
                  </p>
                  <p className="common-fonts cpu-amount">
                    Close Date: <span>July 16, 2023</span>{" "}
                  </p>
                  <div className="cpu-stage">
                    <span className="common-fonts cpu-amount">stage:</span>
                    <select name="" id="" className="cpu-select">
                      <option value="">Select Stage</option>
                    </select>
                  </div>

                  <div className="cpu-lead-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>
              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-lead">Hertz Deal</p>
                  <p className="common-fonts cpu-amount">
                    Amount: <span>$120000</span>{" "}
                  </p>
                  <p className="common-fonts cpu-amount">
                    Close Date: <span>July 16, 2023</span>{" "}
                  </p>
                  <div className="cpu-stage">
                    <span className="common-fonts cpu-amount">stage:</span>
                    <select name="" id="" className="cpu-select">
                      <option value="">Select Stage</option>
                    </select>
                  </div>

                  <div className="cpu-lead-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="summaryDiv cpu-section">
            <p className="dealSectionHead" onClick={handleDeals}>
              {isDealOpen ? (
                <i class="fa-sharp fa-solid fa-angle-up"></i>
              ) : (
                <i class="fa-sharp fa-solid fa-angle-down"></i>
              )}
              Deals (2)
            </p>
            <p className="addProduct cpu-add" onClick={openDealModal}>
              <i class="fa-sharp fa-solid fa-plus"></i>Add
            </p>
          </div>
          {isDealOpen && (
            <>
              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-lead">Hertz Deal</p>
                  <p className="common-fonts cpu-amount">
                    Amount: <span>$120000</span>{" "}
                  </p>
                  <p className="common-fonts cpu-amount">
                    Close Date: <span>July 16, 2023</span>{" "}
                  </p>
                  <div className="cpu-stage">
                    <span className="common-fonts cpu-amount">stage:</span>
                    <select name="" id="" className="cpu-select">
                      <option value="">Select Stage</option>
                    </select>
                  </div>

                  <div className="cpu-lead-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>
              <div className="detailsContent cpu-content">
                <div className="cpu-contact-box">
                  <p className="common-fonts cpu-contact-lead">Hertz Deal</p>
                  <p className="common-fonts cpu-amount">
                    Amount: <span>$120000</span>{" "}
                  </p>
                  <p className="common-fonts cpu-amount">
                    Close Date: <span>July 16, 2023</span>{" "}
                  </p>
                  <div className="cpu-stage">
                    <span className="common-fonts cpu-amount">stage:</span>
                    <select name="" id="" className="cpu-select">
                      <option value="">Select Stage</option>
                    </select>
                  </div>

                  <div className="cpu-lead-cal">
                    <img src={Calender} alt="" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="deal-update-btn">
          {stateBtn === 0 ? (
            <button disabled className="disabledBtn ">
              Update
            </button>
          ) : (
            <button className="convertToDeal" onClick={handleUpdateClick}>
              Update
            </button>
          )}
        </div>
      </div>

      <div className="cpu-right">
        <div className="tab-navigation">
          <button
            className={activeTab === "notes" ? "active" : ""}
            onClick={() => handleTabClick("notes")}
          >
            <i className="fa-sharp fa-regular fa-note-sticky"></i>
            Notes ({notes})
          </button>
          <button
            className={activeTab === "email" ? "active" : ""}
            onClick={() => handleTabClick("email")}
          >
            <i className="fa-sharp fa-regular fa-envelope-open"></i>
            Email ({allEmails.length})
          </button>
          <button
            className={activeTab === "whatsapp" ? "active" : ""}
            onClick={() => handleTabClick("whatsapp")}
          >
            <i className="fa-sharp fa-regular fab fa-whatsapp"></i>
            Whatsapp
          </button>
          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => handleTabClick("activity")}
          >
            <i className="fa-sharp fa-regular fa-calendar"></i>
            Activity ({activityCount})
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "notes" && (
            <div className="notes-tab-content">
              <AddNotes onNotesNum={fetchNotes} type="xx_contact_person" />
            </div>
          )}
          {activeTab === "email" && (
            <div className="email-tab-content">
              <DealEmail
                dealName={companyName}
                id={id}
                type="xx_contact_person"
                email={peopleDetails.email}
              />
            </div>
          )}
          {activeTab === "activity" && (
            <div className="activity-tab-content">
              <DealActivity
                id={id}
                type={"xx_contact_person"}
                count={fetchCall}
                userData={userData}
              />
            </div>
          )}
        </div>
      </div>
      <CreateLead
        isOpen={isModalOpen}
        onClose={closeModal}
        pplname={peopleDetails}
        text="contact"        
      />
      <CreateDeal
        isOpen={isModalDealOpen}
        onClose={closeDealModal}
        text="contact"        
      />
      <ToastContainer />
    </div>
  );
};

export default CompanyUpdate;
