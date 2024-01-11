import React, { useState, useEffect, useRef } from "react";
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
  UPDATE_COMPANY,
  GET_COMPANY,
  POST_EMAIL,
  GETNOTECOMPANY,
  handleLogout,
  GET_ACTIVITY,
  GET_ACTIVE_TEAM_MEM,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateLead from "../lead/CreateLead.jsx";
import CreateDeal from "../deal/CreateDeal.jsx";

const CompanyUpdate = () => {
  const { id } = useParams();
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem('org_id');
  const [searchQuery, setSearchQuery] = useState("");
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
  const [activityCount, setActivityCount] = useState();
  const [userData, setUserData] = useState([]);
  const [inputAdress, setInputAddress] = useState("");
  const [isModalDealOpen, setIsModalDealOpen] = useState(false);
  const [editedItem, setEditedItem] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    domain: "",
    valuation: "",
    industry: "",
    phone: "",
    email: "",
    city: "",
    country: "",
    address1: "",
    address2: "",
    postcode: "",
  });
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notes");
  const [allEmails, setAllEmails] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const searchResultRef = useRef(null);

  const apiKey = "XAEyAvpfkruAZLgil1zyBbTSHw9dGWBC";

  async function postcode(code) {
    axios
      .get(
        "https://api.os.uk/search/places/v1/postcode?postcode=" +
          code.toUpperCase() +
          "&key=" +
          apiKey
      )
      .then((response) => {
        // var response = JSON.stringify(response.data, null, 2);
        setAddress(response.data.results?.map((result) => result.DPA.ADDRESS));
      });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e?.target;
    setInputAddress(e?.target?.value);
    setEditedItem((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);
  };

  const handleAdressClick = (address) => {
    setInputAddress(address);
    setEditedItem((prevState) => ({ ...prevState, address1: address }));
    setShowSearchResult(false);
  };

  const fetchNotes = () => {
    axios
      .get(GETNOTECOMPANY + id, {
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
      source: "xx_company",
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

  const fetchCall = () => {
    axios
      .get(GET_ACTIVITY + "xx_company/" + id, {
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

  const userAdded = () => {
    axios
      .post(GET_ACTIVE_TEAM_MEM,{orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const responseData = response?.data?.data;
        setUserData(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleGetEmail();
  }, [allEmails]);

  useEffect(() => {
    fetchCall();
  }, [activityCount]);

  const fetchData = () => {
    const body = {
      contactType: "xx_company",
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
        setCompanyName(response?.data?.data[0]?.name);
        setInputAddress( response?.data?.data[0]?.address1)
        const updatedCompanyDetails = {
          name: responseData.name,
          domain: responseData.domain,
          valuation: responseData.valuation,
          industry: responseData.industry,
          phone: responseData.phone,
          email: responseData.email,
          city: responseData.city,
          country: responseData.country,
          address1: responseData.address1,
          address2: responseData.address2,
          postcode: responseData.postcode,
        };
        setCompanyDetails(updatedCompanyDetails);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

    const inputArray = [
      "AB",
      "AL",
      "B",
      "BA",
      "BB",
      "BF",
      "BD",
      "BH",
      "BL",
      "BN",
      "BR",
      "BS",
      "BT",
      "BX",
      "CA",
      "CB",
      "CF",
      "CH",
      "CM",
      "CO",
      "CR",
      "CT",
      "CV",
      "CW",
      "DA",
      "DD",
      "DE",
      "DG",
      "DH",
      "DL",
      "DN",
      "DT",
      "DY",
      "E",
      "EC",
      "EH",
      "EN",
      "EX",
      "FK",
      "FY",
      "G",
      "GL",
      "GY",
      "GU",
      "HA",
      "HD",
      "HG",
      "HP",
      "HR",
      "HS",
      "HU",
      "HX",
      "IG",
      "IM",
      "IP",
      "IV",
      "JE",
      "KA",
      "KT",
      "KW",
      "KY",
      "L",
      "LA",
      "LD",
      "LE",
      "LL",
      "LN",
      "LS",
      "LU",
      "M",
      "ME",
      "MK",
      "ML",
      "N",
      "NE",
      "NG",
      "NN",
      "NP",
      "NR",
      "NW",
      "OL",
      "OX",
      "PA",
      "PE",
      "PH",
      "PL",
      "PO",
      "PR",
      "RG",
      "RH",
      "RM",
      "S",
      "SA",
      "SE",
      "SG",
      "SK",
      "SL",
      "SM",
      "SN",
      "SO",
      "SP",
      "SR",
      "SS",
      "ST",
      "SW",
      "SY",
      "TA",
      "TD",
      "TF",
      "TN",
      "TQ",
      "TR",
      "TS",
      "TW",
      "UB",
      "W",
      "WA",
      "WC",
      "WD",
      "WF",
      "WN",
      "WR",
      "WS",
      "WV",
      "YO",
      "ZE",
    ];

    const query = value;
    setSearchQuery(query);
    setShowSearchResult(query?.length > 0);

    setCompanyDetails({
      ...companyDetails,
      [name]: value,
    });

    if (name === "postcode" && value?.length > 1 && value?.length <= 4) {
      setCompanyDetails({
        ...companyDetails,
        [name]: value,
      });
      const regexPattern = new RegExp(
        `^(${inputArray.join("|")}|${inputArray
          .slice(0, 2)
          .join("|")})\\d{1}[A-Za-z0-9]*$`
      );

      if (regexPattern.test(value?.toUpperCase())) {
        setShowSearchResult(value?.length > 1);
        postcode(value);
      }

      
    } else{
      setAddress([])
    }
    setStateBtn(1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateClick = (event) => {
    event.preventDefault();
    axios
      .put(UPDATE_COMPANY + id, companyDetails, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Company updated successfully", {
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
                  value={companyDetails.name}
                  style={isEditable ? editStyling : normalStyling}
                  disabled={isDisabled}
                  onChange={handleInputChange}
                  name="name"
                />
              )}

              {isLoading ? (
                <span>-</span>
              ) : (
                <input
                  type="text"
                  value={companyDetails.domain}
                  style={isEditable ? editStylingInput : normalStylingInput}
                  disabled={isDisabled}
                  onChange={handleInputChange}
                  name="domain"
                />
              )}

              {isLoading ? (
                <span>-</span>
              ) : (
                <input
                  type="number"
                  value={companyDetails.phone}
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
              About Company
            </p>
            {/* <p className="addProduct cpu-add">
              <i class="fa-sharp fa-solid fa-plus"></i>Add
            </p> */}
          </div>
          {isSummaryOpen && (
            <div className="detailsContent cpu-content">
              <div className="dealsLeftContainer cpu-p">
                <p>Name</p>
                <p>Domain</p>
                <p>Valuation</p>
                <p>Industry</p>
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
                        value={companyDetails.name}
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
                        type="text"
                        name="domain"
                        value={companyDetails.domain}
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
                        name="valuation"
                        value={companyDetails.valuation}
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
                      <select
                        name="industry"
                        onChange={handleInputChange}
                        disabled={isDisabled}
                        style={
                          isEditable ? editStylingSelect1 : normalStylingSelect1
                        }
                        className={`${isDisabled ? "disabled" : ""}`}
                        id="cpu-tech"
                        value={companyDetails.industry}
                      >
                        <option value="tech">Tech</option>
                        <option value="non tech">Non Tech</option>
                      </select>
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          <div className="summaryDiv cpu-section">
            <p className="dealSectionHead" onClick={handleDetails}>
              {isDetailsOpen ? (
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
          {isDetailsOpen && (
            <div className="detailsContent cpu-content">
              <div className="dealsLeftContainer cpu-p">
                <p>Phone</p>
                <p>Email</p>
                <p>Country</p>
                <p>City</p>
                <p>Postal Code</p>
                <p>Address 1</p>
                <p>Address 2</p>
              </div>

              <div className="detailsRightContainer">
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="number"
                        name="phone"
                        value={companyDetails.phone}
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
                        value={companyDetails.email}
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
                        type="text"
                        name="country"
                        value={companyDetails.country}
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
                        value={companyDetails.city}
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
                <div className="cpu-postal-code">
                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        name="postcode"
                        value={companyDetails.postcode}
                        onChange={handleInputChange}
                        style={
                          isEditable ? editStylingInput : normalStylingInput
                        }
                        disabled={isDisabled}
                        className="cpu-value cpu-postcode"
                        autoComplete="off"
                      />
                    </span>
                  )}
                </p>
                {showSearchResult && address?.length > 1 && (
                <div className="search_result company-address-result cpu-address-view" ref={searchResultRef}>
                  {address?.map((item) => (
                    <>
                      <p
                        className="common-fonts searchTitle"
                        key={item}
                        onClick={() => handleAdressClick(item)}
                      >
                        {item}
                      </p>
                    </>
                  ))}
                </div>
              )}
                </div>

                <p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        name="address1"
                        value={inputAdress}
                          onChange={handleAddressChange}
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
                        name="address2"
                        value={companyDetails.address2}
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
              <AddNotes type="xx_company" onNotesNum={fetchNotes} />
            </div>
          )}
          {activeTab === "email" && (
            <div className="email-tab-content">
              <DealEmail
                type="xx_company"
                id={id}
                dealName={companyName}
                email={companyDetails.email}
              />
            </div>
          )}
          {activeTab === "activity" && (
            <div className="activity-tab-content">
              <DealActivity
                id={id}
                type={"xx_company"}
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
        text="contact" 
        contact= {companyDetails}       
      />
      <CreateDeal
        isOpen={isModalDealOpen}
        onClose={closeDealModal}
        text="contact"  
        contact= {companyDetails}        
      />
      <ToastContainer />
    </div>
  );
};

export default CompanyUpdate;
