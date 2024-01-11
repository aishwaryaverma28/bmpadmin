import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/DealUpdate.css";
import LeftArrow from "../../assets/image/arrow-left.svg";
import GreaterLeft from "../../assets/image/greater-left.svg";
import GreaterRight from "../../assets/image/greater-right.svg";
import axios from "axios";
import {
  GETNOTEDEAL,
  GET_DEAL_ID,
  UPDATE_DEAL,
  ELIGIBLE_LOANS,
  handleLogout,
  getDecryptedToken,
  GET_LABEL,
  GET_ALL_STAGE,
  UPLOADED_DOCS,
  GET_ACTIVITY,
  GET_ACTIVE_TEAM_MEM,
  GET_FIELDS,
  POST_EMAIL,
} from "../utils/Constants";
import AddNotes from "./AddNotes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DealAttachments from "./DealAttachments.jsx";
import DealActivity from "./DealActivity";
import DealEmail from "./DealEmail.jsx";
import DealDocument from "./DealDocument.jsx";
import LostModal from "./LostModal.jsx";
import BankEligibility from "./BankEligibility";

const DealUpdate = () => {
  const { id } = useParams();
  const decryptedToken = getDecryptedToken();
  const [labelData, setLabelData] = useState([]);
  const orgId = localStorage.getItem('org_id');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabelColor, setSelectedLabelColor] = useState("");
  const [stages, setStages] = useState([]);
  const [actionopen, setActionOpen] = useState(false);
  const actionDropDownRef = useRef(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [similarStage, setSimilarStage] = useState([]);
  const [ShowUpdateButton, setShowUpdateButton] = useState(false);
  const [activityCount, setActivityCount] = useState();
  const [info, setInfo] = useState({});
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stagesId, setStagesId] = useState([]);
  const [won, setWon] = useState(false);

  const [adminInfo, setAdminInfo] = useState({
    first_name: "",
    last_name: "",
    id: 0,
  });
  const [dealName, setDealName] = useState("");
  const [fieldNames, setFieldNames] = useState({});
  const [loanDetails, setLoanDetails] = useState({
    age_of_business: null,
    company_type: "",
    industry_type: "",
    turnover: null,
    location_of_company: "",
    duration: "",
    individual_or_company: "",
    loan_amount: null,
    loan_type: "",
  });
  const [loan, setLoan] = useState([]);
  const [dealDetails, setDealDetails] = useState({
    closure_date: "",
    contact: "",
    deal_name: "",
    doc_number: "",
    document_verified: 0,
    email: "",
    is_deleted: 0,
    label_id: null,
    mobile: "",
    organization: "",
    // ownerf_name: "",
    // ownerl_name: "",
    pipeline_id: 1,
    probability: "",
    status: "",
    // value: null,
    introducer_name: "",
    introducer_firm_name: "",
    // data_enquiry_receive: "",
    // borrower_entry: "",
    security_value: null,
    loan_amount: null,
    deposit: null,
    type_of_security: "",
    loan_type: "",
    lender: null,
    lead_source: "",
    engagement_fee: null,
    engagement_fee_paid: null,
    broker_fee: null,
    broker_fee_paid: null,
    procuration_fee: null,
    procuration_fee_paid: null,
    deal_commission: null,
    completion_date: "",
    stage_id: null,
    age_of_business: null,
    company_type: "",
    duration: "",
    company_location: "",
    turnover: "",
    industry_type: "",
    individual_or_company: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [activeTab, setActiveTab] = useState("notes"); // Initial active tab
  const [notes, setNotes] = useState();
  const [attachedFile, setAttachedFiles] = useState();
  // const [value, setValue] = useState("");
  const [stateBtn, setStateBtn] = useState(0);
  const [editedItem, setEditedItem] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStageButton, setIsStageButton] = useState(true);
  const [status, setStatus] = useState([]);
  const [userData, setUserData] = useState([]);
  const role_name = localStorage.getItem("role_name");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allEmails, setAllEmails] = useState([]);
  const [ownerId, setOwnerId] = useState(0);
  const idOfOwner = parseInt(localStorage.getItem("id"));
  const [lostModal, setLostModal] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLostModal = () => {
    setLostModal(true);
    setWon(false);
  };
  const handleLostModalClose = () => {
    setLostModal(false);
  };

  // function getTextWidth(text) {
  //   const font = '16px Arial'; // You can adjust the font size and style here
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   context.font = font;
  //   const width = context.measureText(text).width+50;
  //   return width;
  // }

  const handleGetEmail = () => {
    const updatedFormData = {
      source: "deal",
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
    setOwnerName(userData?.find((item) => item.id === ownerId));
  }, []);

  const fetchFields = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(GET_FIELDS + "deal", {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          setFields(response?.data?.data.reverse());
          const fieldsData = response?.data?.data.reverse();
          const newFieldNames = {};
          fieldsData.forEach((field, index) => {
            newFieldNames[`field${index + 1}`] = field.field_name;
          });
          setFieldNames(newFieldNames);

          setDealDetails((prevDealDetails) => {
            const updatedDealDetails = { ...prevDealDetails };

            for (const key in newFieldNames) {
              updatedDealDetails[newFieldNames[key]] = "";
            }

            return updatedDealDetails;
          });
          setLoading(false);
          resolve(); // Resolve the promise when the fetch is successful
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.message === "Invalid or expired token.") {
            alert(error?.response?.data?.message);
            handleLogout();
          }
          reject(error); // Reject the promise if there is an error
        });
    });
  };

  const fetchDeal = () => {
    axios
      .get(GET_DEAL_ID + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        const details = response?.data?.data[0];
        setOwnerId(details?.owner);
        setDealName(response?.data?.data[0]?.deal_name);

        const fieldMappings = {};
        for (const key in fieldNames) {
          // Use the value from fieldNames as the key in fieldMappings
          fieldMappings[fieldNames[key]] = details?.[fieldNames[key]];
        }
        setDealDetails({
          ...dealDetails,
          ...fieldMappings,
          dealId: [id],
          closure_date: details.closure_date?.split("T")[0],
          contact: details.contact,
          deal_name: details.deal_name,
          doc_number: details.doc_number,
          document_verified: details.document_verified,
          email: details.email,
          is_deleted: details.is_deleted,
          label_id: details.label_id,
          mobile: details.mobile,
          organization: details.organization,
          // ownerf_name: details.ownerf_name,
          // ownerl_name: details.ownerl_name,
          pipeline_id: 1,
          probability: details.probability,
          status: details.status,
          // value: details.value,
          introducer_name: details.introducer_name,
          introducer_firm_name: details.introducer_firm_name,
          // data_enquiry_receive: details.data_enquiry_receive,
          // borrower_entry: details.borrower_entry,
          security_value: details.security_value,
          loan_amount: details.loan_amount,
          deposit: details.deposit,
          type_of_security: details.type_of_security,
          loan_type: details.loan_type,
          lender: details.lender,
          lead_source: details.lead_source,
          engagement_fee: details.engagement_fee,
          engagement_fee_paid: details.engagement_fee_paid,
          broker_fee: details.broker_fee,
          broker_fee_paid: details.broker_fee_paid,
          procuration_fee: details.procuration_fee,
          procuration_fee_paid: details.procuration_fee_paid,
          deal_commission: details.deal_commission,
          completion_date: details.completion_date?.split("T")[0],
          stage_id: details.stage_id,
          owner: info?.id,
          age_of_business: details.age_of_business,
          company_type: details.company_type,
          duration: details.duration,
          company_location: details.company_location,
          turnover: details.turnover,
          industry_type: details.industry_type,
          individual_or_company: details.individual_or_company,
        });
        setLoanDetails({
          ...loanDetails,
          age_of_business: details?.age_of_business,
          company_type: details?.company_type,
          industry_type: details?.industry_type,
          turnover: details?.turnover,
          location_of_company: details?.company_location,
          duration: details?.duration,
          individual_or_company: details?.individual_or_company,
          loan_amount: details?.loan_amount,
          loan_type: details?.loan_type,
        });
        adminInfo.first_name = response?.data?.data[0]?.ownerf_name || "";
        adminInfo.last_name = response?.data?.data[0]?.ownerl_name || "";
        adminInfo.id = response?.data?.data[0]?.owner || "";
        filterBanks();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const fetchBanks = () => {
    axios
      .get(ELIGIBLE_LOANS, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const loanData = response?.data?.data.map((item) => {
          const { age_of_business, ...rest } = item;
          const modifiedItem = {
            ...rest, // Copy other properties from the item
            age_of_business:
              age_of_business !== undefined ? age_of_business.toString() : null,
          };
          return modifiedItem;
        });
        setLoan(loanData);
      })

      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };

  const filterBanks = () => {
    const filteredLoanDetails = {};
    for (const key in loanDetails) {
      if (loanDetails[key] !== null && loanDetails[key] !== "") {
        filteredLoanDetails[key] = loanDetails[key];
      }
    }

    const matchingLoans = loan.filter((loanItem) => {
      return Object.entries(filteredLoanDetails).every(([key, value]) => {
        return (
          loanItem[key].toString().toLowerCase() ===
          value.toString().toLowerCase()
        );
      });
    });

    const loanOfferedByValues = matchingLoans.map(
      (loanItem) => loanItem.loan_offered_by
    );
    setBanks(loanOfferedByValues);
  };

  const userAdded = () => {
    axios
      .post(
        GET_ACTIVE_TEAM_MEM,
        { orgId: orgId },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const responseData = response?.data?.data;
        // const combinedData = [adminInfo, ...responseData];
        setUserData(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCall = () => {
    axios
      .get(GET_ACTIVITY + "deal/" + id, {
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
    fetchLabelData();
    fetchNotes();
    fetchFields();
    fetchCall();
    handleGetEmail();
    fetchBanks();
    filterBanks();
  }, []);

  useEffect(() => {
    userAdded();
  }, [orgId]);

  useEffect(() => {
    fetchDeal();
  }, [fieldNames]);

  useEffect(() => {
    filterBanks();
  }, [loanDetails]);

  useEffect(() => {
    fetchFields() // Fetch fields first
      .then(() => {
        // Once fields are fetched, fetchDeal
        fetchDeal();
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch other data like labels and notes here if needed
    fetchLabelData();
    fetchNotes();
  }, []);

  const handleStageClickFromList = (event, stageId) => {
    const selectedStageName = similarStage.find(
      (stage) => stage.id === stageId
    );
    setSelectedStage(selectedStageName.display_name);
    setSelectedStageId(stageId);
    setIsStageButton(false);

    const liElements = document.querySelectorAll(".dropdown-menu li");
    liElements.forEach((li) => {
      li.classList.remove("active-stage");
    });
    // Add active class to the clicked li element
    event.target.classList.add("active-stage");
  };

  const handleChangeStatusClick = (selectedStageId) => {
    setIsStageButton(true);
    if (selectedStageId !== null && selectedStageId === 35) {
      setActionOpen(!actionopen);
      setLostModal(true);
      return;
    } else if (selectedStageId !== null) {
      const updateForm = {
        dealId: [id],
        stage_id: selectedStageId,
      };
      axios
        .put(UPDATE_DEAL, updateForm, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        })
        .then((response) => {
          fetchDeal();
          // alert(response?.data.message);
          toast.success(response?.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setActionOpen(!actionopen);
  };

  const toggleActionDropdownStatic = () => {
    setActionOpen(!actionopen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        actionDropDownRef.current &&
        !actionDropDownRef.current.contains(event.target)
      ) {
        setActionOpen(false);
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const fetchStages = () => {
    const body = {
      org_id: orgId
    }
    axios
      .post(GET_ALL_STAGE + "/deal", body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const displayNames = response?.data?.message?.map(
          (item) => item.display_name
        );

        const displayId = response?.data?.message
          ?.map((item) => item.id)
          .reverse();

        setSimilarStage(response?.data?.message.reverse());

        // Sort displayNames based on item.id in ascending order
        const sortedDisplayNamesAsc = [...displayNames].sort((a, b) => {
          const itemA = response.data.message.find(
            (item) => item.display_name === a
          );
          const itemB = response.data.message.find(
            (item) => item.display_name === b
          );
          return itemA.id - itemB.id;
        });

        setStages(sortedDisplayNamesAsc);
        setStagesId(displayId);

        const statusNames = response?.data?.message?.map(
          (item) => item.stage_name
        );
        if (statusNames && statusNames.length > 0) {
          setStatus(statusNames.reverse());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };
  const handleCompany = () => {
    setIsCompanyOpen(!isCompanyOpen);
  };
  const handleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };
  const handleFields = () => {
    setIsFieldsOpen(!isFieldsOpen);
  };
  const handleBank = () => {
    setIsBankOpen(!isBankOpen);
  };

  // const status = [
  //   "enquiry_received",
  //   "contact_made",
  //   "illustration_sent",
  //   "all_docs_received",
  //   "compliance",
  //   "sourced",
  //   "application_received",
  //   "valuation",
  //   "formal_offer_sent",
  //   "compliance_check",
  //   "legals",
  //   "completion",
  // ];

  const normalStylingInput = {
    color: "#1e2224",
    fontWeight: 400,
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    borderRadius: "0.3125rem",
    padding: "0.3rem",
    border: "1px solid transparent",
    height: "2rem",
  };

  const editStylingInput = {
    color: "#1e2224",
    fontWeight: 400,
    border: "1px solid #dcdcdc",
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    borderRadius: "0.3125rem",
    padding: "0.3rem",
    height: "2rem",
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
  };

  const normalStylingSelect3 = {
    /* height: 32px; */
    fontSize: " 0.8rem",
    fontFamily: '"Lexend Deca", sans-serif',
    padding: "0.3rem",
    borderRadius: "5px",
    textTransform: "capitalize",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    border: "1px solid transparent",
    height: "2rem",
  };

  const editStylingSelect3 = {
    width: "100%",
    color: " #1e2224",
    border: "1px solid #dcdcdc",
    outline: "rgb(59, 59, 59)",
    backgroundColor: "#ffffff",
    fontSize: "0.8rem",
    fontFamily: "Lexend Deca",
    borderRadius: "0.3125rem",
    padding: "0.1rem",
    height: "2rem",
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleStages = stages?.slice(currentIndex, currentIndex + 6);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const canShowPrev = currentIndex > 0;

  const lastVisibleStageIndex = currentIndex + visibleStages?.length - 1;
  const lastStageIndex = stages?.length - 1;
  const canShowLeftScrollArrow = lastVisibleStageIndex < lastStageIndex;

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchLabelData = async () => {
    const body = {
      org_id: orgId
    }
    try {
      const response = await axios.post(GET_LABEL, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });
      if (response.data.status === 1) {
        setLabelData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  };

  const handleUpdateClick = (event) => {
    event.preventDefault();
    axios
      .put(UPDATE_DEAL, dealDetails, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Deal data updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Some error occured", {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setShowUpdateButton(false);
        setStateBtn(0);
        fetchDeal();
      })
      .catch((error) => {
        console.log(error);
        setShowUpdateButton(false);
        setStateBtn(0);
      });

    setIsEditable(false);
    setIsDisabled(!isDisabled);
    setStateBtn(0);
    fetchDeal();
    filterBanks();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const uploadedDocs = () => {
    axios
      .get(UPLOADED_DOCS + "deal" + "/" + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setAttachedFiles(response?.data?.message?.length);
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
    uploadedDocs();
  }, []);

  const fetchNotes = () => {
    axios
      .get(GETNOTEDEAL + id, {
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

  const toggleEditable = (e) => {
    e.preventDefault();
    setIsEditable(!isEditable);
    setIsDisabled(!isDisabled);
    setShowUpdateButton(!ShowUpdateButton);
    setStateBtn(0);
  };

  const mergedLabels = labelData
    ?.filter((item) => item?.entity?.includes("deals"))
    ?.map((item) => ({
      id: item?.id,
      name: item?.name,
      colour_code: item?.colour_code,
    }));

  const normalStylingSelect1 = {
    backgroundColor:
      selectedLabelColor === ""
        ? dealDetails?.label_id
          ? mergedLabels.find((label) => label.id === dealDetails?.label_id)
            ?.colour_code
          : ""
        : selectedLabelColor,
    color: "white !important",
    fontSize: " 0.8rem",
    fontFamily: '"Lexend Deca", sans-serif',
    fontWeight: 400,
    padding: "0.3rem",
    borderRadius: "5px",
    textTransform: "capitalize",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    border: "1px solid transparent",
    height: "2rem",
    width: "fit-content",
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
    borderRadius: "0.3125rem",
    padding: "0.1rem",
    height: "2rem",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "label_id") {
      const selectedLabel = mergedLabels.find(
        (label) => label.id === parseInt(value)
      );
      setDealDetails({
        ...dealDetails,
        label_id: selectedLabel.id,
      });
      if (selectedLabel) {
        setSelectedLabelColor(selectedLabel.colour_code);
      }
    } else if (name === "owner") {
      const selectedUserData = userData?.find(
        (user) => user.id === parseInt(value)
      );

      setInfo(selectedUserData);
      setOwnerName(selectedUserData);
    }
    setDealDetails({
      ...dealDetails,
      [name]: value,
    });
    setStateBtn(1);
  };

  const getStageName = (stageId) => {
    const stage = similarStage.find((item) => item.id === stageId);
    return stage ? stage.stage_name : "Unknown Stage";
  };

  // Example usage
  const stageId = dealDetails.stage_id;
  const stageName = getStageName(stageId);

  return (
    <>
      <div className="backToDeal">
        <Link to={"/lp/deals"}>
          <button className="common-fonts">
            <img src={LeftArrow} alt="" />
          </button>
        </Link>
        <p>
          {isLoading ? (
            <span>-</span>
          ) : (
            <>
              {" "}
              <input
                type="text"
                name="deal_name"
                value={dealDetails?.deal_name}
                onChange={handleInputChange}
                style={isEditable ? editStyling : normalStyling}
                disabled={isDisabled}
              />
              <br />
            </>
          )}
        </p>
        {ownerId === idOfOwner && (
          <i className="fa-solid fa-pen" onClick={toggleEditable}></i>
        )}

        <i className="fas fa-ellipsis-h"></i>
      </div>
      <div className="dealHead"></div>

      <div className="arrow-container">
        <div className="arrow-section">
          <button
            className="arrow-scroll-left"
            onClick={handlePrevClick}
            disabled={!canShowPrev}
          >
            <img src={GreaterLeft} alt="" class="deals-arrow-left" />
          </button>

          {/* <div className="arrow-pointer">
            <p className="common-fonts arrow-text">enquiry received (888 days)</p>
          </div>
          <div className="arrow-pointer arrow-pointer-2">
            <p className="common-fonts arrow-text arrow-text-2">contact made (888 days)</p>
          </div> */}

          {isLoading ? (
            <p className="deal-loading">loading...</p>
          ) : (
            <>
              {visibleStages?.map((stage, index) => {
                // Find the corresponding id for the current stage
                const stageId = stagesId[currentIndex + index];

                const isActive = stageId === dealDetails.stage_id;
                const activeIndex = dealDetails.stage_id;
                const backgroundColor = isActive
                  ? "#2b74da"
                  : activeIndex > stageId
                    ? "#077838"
                    : "#f3f3f3";
                const textColor =
                  isActive ||
                    backgroundColor === "#077838" ||
                    backgroundColor === "#2b74da"
                    ? "white"
                    : "#1e2224";

                const arrowClass = isActive
                  ? "arrow-blue"
                  : backgroundColor === "#077838"
                    ? "arrow-green"
                    : "";

                return (
                  <div
                    className={`arrow-pointer ${arrowClass}`}
                    style={{ backgroundColor, color: textColor }}
                    key={index}
                  >
                    <p
                      className="common-fonts arrow-text"
                      style={{ color: textColor }}
                    >
                      {stage}
                    </p>
                  </div>
                );
              })}
            </>
          )}

          <button
            className="arrow-scroll-right"
            onClick={handleNextClick}
            disabled={!canShowLeftScrollArrow}
          >
            <img src={GreaterRight} alt="" class="deals-arrow-right" />
          </button>
        </div>
        <div className="arrow-btn">
          <button
            className="arrow-won common-fonts"
            onClick={() => handleChangeStatusClick(34)}
          >
            Won
          </button>
          <button className="arrow-lost common-fonts" onClick={handleLostModal}>
            Lost
          </button>
          <button className="bank-button common-fonts" onClick={openModal}>
            All Band Criteria
          </button>
        </div>
      </div>

      <div className="ud-stages">
        <p className="common-fonts ud-stage-name">Stage: </p>
        <div className="select action-select">
          <div className="dropdown-container" ref={actionDropDownRef}>
            <div
              className="dropdown-header2 pipeline-dropdown"
              onClick={toggleActionDropdownStatic}
            >
              <p className="common-fonts ud-stage-name">{stageName}</p>
              <i
                className={`fa-sharp fa-solid ${actionopen ? "fa-angle-up" : "fa-angle-down"
                  }`}
              ></i>
            </div>

            {actionopen && (
              <div className="stage-outer-div">
                <ul
                  className="dropdown-menu stage-position stage-dropdown"
                  id="stage-list"
                >
                  {similarStage?.map(
                    (stage, index) =>
                      dealDetails?.stage_id !== stage.id && (
                        <li
                          key={stage.id}
                          onClick={(e) => handleStageClickFromList(e, stage.id)}
                          className=""
                        >
                          {stage.display_name}
                        </li>
                      )
                  )}
                </ul>
                <button
                  className={
                    isStageButton
                      ? `common-inactive-button stage-save-btn`
                      : `common-save-button stage-save-btn`
                  }
                  onClick={() => handleChangeStatusClick(selectedStageId)}
                  disabled={isStageButton}
                >
                  Change Status
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="dealcontainer">
        <div className="deal-left-wrapper">
          <div className="dealLeftSection">
            <section>
              <div className="summaryDiv">
                <p className="dealSectionHead" onClick={handleSummary}>
                  {isSummaryOpen ? (
                    <i class="fa-sharp fa-solid fa-angle-up"></i>
                  ) : (
                    <i class="fa-sharp fa-solid fa-angle-down"></i>
                  )}
                  Summary
                </p>
                <p className="addProduct">
                  <i class="fa-sharp fa-solid fa-plus"></i>Add Product
                </p>
              </div>
              {isSummaryOpen && (
                <div className="detailsContent">
                  <div className="dealsLeftContainer">
                    {/* <p>Value</p> */}
                    <p>Lable</p>
                    {/* <p>Contact Person</p> */}
                    <p>Organization</p>
                    <p>Deal Owner</p>
                    <p>Closing Date</p>
                  </div>

                  <div className="detailsRightContainer">
                    {/* <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="text"
                            name="value"
                            value={dealDetails?.value}
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p> */}

                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <select
                            name="label_id"
                            id="label_id"
                            value={dealDetails?.label_id || ""}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            style={
                              isEditable
                                ? editStylingSelect1
                                : normalStylingSelect1
                            }
                            className={isDisabled ? "disabled" : ""}
                          >
                            {mergedLabels?.map((item) => (
                              <option key={item?.id} value={item?.id}>
                                {item?.name}
                              </option>
                            ))}
                          </select>
                        </span>
                      )}
                    </p>

                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}

                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="text"
                            name="organization"
                            value={dealDetails?.organization}
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                    {role_name === "admin" ? (
                      <p>
                        {isLoading ? (
                          <span>-</span>
                        ) : (
                          <select
                            id="lp-main-owner"
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            className={isDisabled ? "disabled" : ""}
                            name="owner"
                            value={ownerName ? ownerName.id : ""}
                          >
                            {userData
                              ?.slice()
                              ?.reverse()
                              ?.map((item) => (
                                <option
                                  key={item?.id}
                                  value={item?.id}
                                  className="owner-val"
                                >
                                  {`${item?.first_name?.charAt(0)?.toUpperCase() +
                                    item?.first_name?.slice(1)
                                    } ${item?.last_name?.charAt(0)?.toUpperCase() +
                                    item?.last_name?.slice(1)
                                    }`}
                                </option>
                              ))}
                            {/* <option value="Imp">{owner}</option> */}
                          </select>
                        )}
                      </p>
                    ) : (
                      <p>
                        {isLoading ? (
                          <span>-</span>
                        ) : (
                          <span>
                            <input
                              type="text"
                              name="value"
                              disabled={true}
                              style={normalStylingInput}
                            />
                          </span>
                        )}
                      </p>
                    )}

                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="date"
                            value={dealDetails?.closure_date?.split("T")[0]}
                            name="closure_date"
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="summaryDiv">
                <p className="dealSectionHead" onClick={handleCompany}>
                  {isCompanyOpen ? (
                    <i class="fa-sharp fa-solid fa-angle-up"></i>
                  ) : (
                    <i class="fa-sharp fa-solid fa-angle-down"></i>
                  )}
                  Company
                </p>
              </div>

              {isCompanyOpen && (
                <div className="detailsContent">
                  <div className="dealsLeftContainer">
                    <p>Name</p>
                    {/* <p>Address</p> */}
                    <p>Phone No.</p>
                    <p>Email</p>
                    <p>Age Of Buiseness</p>
                    <p>Company Type</p>
                    <p>Duration</p>
                    <p>Location</p>
                    <p>Loan Type</p>
                    <p>Turnover</p>
                    <p>Industry Type</p>
                    <p>Type</p>
                  </div>

                  <div className="detailsRightContainer">
                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="text"
                            name="organization"
                            value={dealDetails?.organization}
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}

                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="text"
                            value={dealDetails?.mobile}
                            onChange={handleInputChange}
                            name="mobile"
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
                            name="email"
                            value={dealDetails?.email}
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
                            name="age_of_business"
                            value={dealDetails?.age_of_business}
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
                          <select
                            name="company_type"
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            className={isDisabled ? "disabled" : ""}
                            value={dealDetails?.company_type}
                          >
                            <option value="Corporation">Corporation</option>
                            <option value="limited company">
                              Limited Company
                            </option>
                            <option value="private limited">
                              Private Limited
                            </option>
                            <option value="public company">
                              Public Company
                            </option>
                            <option value="joint venture">Joint Venture</option>
                            <option value="Sole Proprietorship">
                              Sole Proprietorship
                            </option>
                            <option value="LLC">LLC</option>
                          </select>
                        </span>
                      )}
                    </p>
                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <select
                            className={isDisabled ? "disabled" : ""}
                            name="duration"
                            disabled={isDisabled}
                            onChange={handleInputChange}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            value={dealDetails?.duration}
                          >
                            <option value="Short-term">Short term</option>
                            <option value="Medium-term">Medium term</option>
                            <option value="Long-term">Long term</option>
                          </select>
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
                            name="company_location"
                            value={dealDetails?.company_location}
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
                          <select
                            className={isDisabled ? "disabled" : ""}
                            name="loan_type"
                            disabled={isDisabled}
                            onChange={handleInputChange}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            value={dealDetails?.loan_type}
                          >
                            <option value="Home loan">Home loan</option>
                            <option value="Business">Business</option>
                            <option value="Personal">Personal</option>
                            <option value="car finance">car finance</option>
                            <option value="business loan">business loan</option>
                            <option value="term loan">term loan</option>
                            <option value="secured loan">secured loan</option>
                          </select>
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
                            name="turnover"
                            value={dealDetails?.turnover}
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
                          <select
                            className={isDisabled ? "disabled" : ""}
                            name="industry_type"
                            disabled={isDisabled}
                            onChange={handleInputChange}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            value={dealDetails?.industry_type}
                          >
                            <option value="Textile">Textile</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Finance">Finance</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Mining">Mining</option>
                            <option value="Hospitality">Hospitality</option>
                            <option value="Retail">Retail</option>
                            <option value="Aerospace">Aerospace</option>
                            <option value="Technology">Technology</option>
                          </select>
                        </span>
                      )}
                    </p>
                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <select
                            className={isDisabled ? "disabled" : ""}
                            name="individual_or_company"
                            disabled={isDisabled}
                            onChange={handleInputChange}
                            style={
                              isEditable
                                ? editStylingSelect3
                                : normalStylingSelect3
                            }
                            value={dealDetails?.individual_or_company}
                          >
                            <option value="individual">Individual</option>
                            <option value="Company">Company</option>
                          </select>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="summaryDiv">
                <p className="dealSectionHead" onClick={handleDetails}>
                  {isDetailsOpen ? (
                    <i class="fa-sharp fa-solid fa-angle-up"></i>
                  ) : (
                    <i class="fa-sharp fa-solid fa-angle-down"></i>
                  )}
                  Details
                </p>
              </div>

              {isDetailsOpen && (
                <div className="detailsContent">
                  <div className="dealsLeftContainer">
                    <p>Introducer Name</p>
                    <p>Introducer Firm Name</p>
                    {/* <p>Data Enquiry Recieve</p> */}
                    {/* <p>Borrower Entry</p> */}
                    {/* <p>Security Value</p> */}
                    <p>Loan Amount</p>
                    <p>Deposit</p>
                    <p>Type Of Security</p>
                    <p>Lender</p>
                    <p>Lead Source</p>
                    <p>Engagement Fee</p>
                    <p>Engagement Fee Paid</p>
                    <p>Broker Fee</p>
                    <p>Broker Fee Paid</p>
                    <p>Procuration Fee</p>
                    <p>Procuration Fee Paid</p>
                    <p>Deal Commission</p>
                    <p>Completion Date</p>
                    {/* <p>Commercial Finance-File Completion Checklist</p> */}
                  </div>

                  <div className="detailsRightContainer">
                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="text"
                            name="introducer_name"
                            value={dealDetails.introducer_name}
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
                            name="introducer_firm_name"
                            value={dealDetails.introducer_firm_name}
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          name="data_enquiry_receive"
                          value={dealDetails.data_enquiry_receive}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}
                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          name="borrower_entry"
                          value={dealDetails.borrower_entry}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}
                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="number"
                          name="security_value"
                          value={dealDetails.security_value}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}
                    <p>
                      {isLoading ? (
                        <span>-</span>
                      ) : (
                        <span>
                          <input
                            type="number"
                            name="loan_amount"
                            value={dealDetails.loan_amount}
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
                            name="deposit"
                            value={dealDetails.deposit}
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
                            name="type_of_security"
                            value={dealDetails.type_of_security}
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
                            name="lender"
                            value={dealDetails.lender}
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
                            name="lead_source"
                            value={dealDetails.lead_source}
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
                            name="engagement_fee"
                            value={dealDetails.engagement_fee}
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
                            name="engagement_fee_paid"
                            value={dealDetails.engagement_fee_paid}
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
                            name="broker_fee"
                            value={dealDetails.broker_fee}
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
                            name="broker_fee_paid"
                            value={dealDetails.broker_fee_paid}
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
                            name="procuration_fee"
                            value={dealDetails.procuration_fee}
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
                            name="procuration_fee_paid"
                            value={dealDetails.procuration_fee_paid}
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
                            name="deal_commission"
                            value={dealDetails.deal_commission}
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
                            type="date"
                            name="completion_date"
                            value={dealDetails?.completion_date?.split("T")[0]}
                            onChange={handleInputChange}
                            style={
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                    {/* <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p> */}
                  </div>
                </div>
              )}

              <div className="summaryDiv">
                <p className="dealSectionHead" onClick={handleFields}>
                  {isFieldsOpen ? (
                    <i class="fa-sharp fa-solid fa-angle-up"></i>
                  ) : (
                    <i class="fa-sharp fa-solid fa-angle-down"></i>
                  )}
                  Additional Fields
                </p>
              </div>

              {isFieldsOpen && (
                <div className="detailsContent">
                  <div className="dealsLeftContainer">
                    {fields.map((field) => (
                      <p key={field.id}>{field.field_name}</p>
                    ))}
                  </div>

                  <div className="detailsRightContainer">
                    {fields.map((field, index) => (
                      <p key={field.id}>
                        {isLoading ? (
                          <span>-</span>
                        ) : (
                          <span>
                            <input
                              type="text"
                              name={field.field_name}
                              onChange={handleInputChange}
                              style={
                                isEditable
                                  ? editStylingInput
                                  : normalStylingInput
                              }
                              value={dealDetails[field.field_name]}
                              disabled={isDisabled}
                            />
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="summaryDiv">
                <p className="dealSectionHead" onClick={handleBank}>
                  {isBankOpen ? (
                    <i class="fa-sharp fa-solid fa-angle-up"></i>
                  ) : (
                    <i class="fa-sharp fa-solid fa-angle-down"></i>
                  )}
                  Banks
                </p>
              </div>

              {isBankOpen && (
                <div className="detailsContent">
                  <div className="dealsLeftContainer">
                    {banks?.length > 0 ? (
                      banks?.map((banks, index) => <p key={index}>{banks}</p>)
                    ) : (
                      <p className="common-fonts">No Banks Available</p>
                    )}
                  </div>
                </div>
              )}
            </section>
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

        <div className="divRightSection">
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
            <button
              className={activeTab === "attachment" ? "active" : ""}
              onClick={() => handleTabClick("attachment")}
            >
              <i className="fa-sharp fa-solid fa-paperclip"></i>
              Attachment ({attachedFile})
            </button>
            <button
              className={activeTab === "document" ? "active" : ""}
              onClick={() => handleTabClick("document")}
            >
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              Document
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "notes" && (
              <div className="notes-tab-content">
                <AddNotes
                  onNotesNum={fetchNotes}
                  type="deal"
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                />
              </div>
            )}
            {activeTab === "email" && (
              <div className="email-tab-content">
                <DealEmail
                  type="deal"
                  id={id}
                  dealName={dealName}
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                  email={dealDetails?.email}
                />
              </div>
            )}
            {activeTab === "activity" && (
              <div className="activity-tab-content">
                <DealActivity
                  id={id}
                  type={"deal"}
                  count={fetchCall}
                  userData={userData}
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                />
              </div>
            )}
            {activeTab === "attachment" && (
              <div className="attachment-tab-content">
                <DealAttachments
                  dealId={id}
                  type={"deal"}
                  onAttachNum={uploadedDocs}
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                />
              </div>
            )}
            {activeTab === "document" && (
              <div className="attachment-tab-content">
                <DealDocument dealId={id} email={dealDetails?.email} />
              </div>
            )}
          </div>
        </div>
      </section>
      <ToastContainer />
      {isModalOpen && (
        <BankEligibility
          onClose={closeModal}
          loan = {loan}
        />
      )}
      {lostModal && (
        <LostModal
          onClose={handleLostModalClose}
          fetchDeal={fetchDeal}
          id={id}
        />
      )}
    </>
  );
};

export default DealUpdate;
