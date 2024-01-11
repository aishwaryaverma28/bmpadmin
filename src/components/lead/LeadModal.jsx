import React, { useState, useEffect, useRef } from "react";
import "./../styles/LPleads.css";
import axios from "axios";
import {
  UPDATE_LEAD,
  GETNOTEBYSOURCE,
  GET_LEAD_ID,
  GET_ACTIVE_TEAM_MEM,
  handleLogout,
  getDecryptedToken,
  GET_LABEL,
  GET_ALL_STAGE,
  UPLOADED_DOCS,
  GET_ACTIVITY,
  GET_FIELDS,
  POST_EMAIL,
} from "./../utils/Constants";
import userIcon from "../../assets/image/user-img.png";
import AddNotes from "../deal/AddNotes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDeal from "../deal/CreateDeal";
import DealAttachments from "../deal/DealAttachments";
import DealActivity from "../deal/DealActivity";
import DealEmail from "../deal/DealEmail.jsx";

const LeadModal = ({ selectedItem, closeModal, onLeadAdded}) => {
  const [isLoading, setIsLoading] = useState(true);
  const orgId = localStorage.getItem('org_id');
  const [isEditable, setIsEditable] = useState(false);
  const [editedItem, setEditedItem] = useState("");
  const [activeTab, setActiveTab] = useState("notes"); // Initial active tab
  const [notes, setNotes] = useState();
  const [activityCount, setActivityCount] = useState();
  const [stateBtn, setStateBtn] = useState(0);
  const decryptedToken = getDecryptedToken();
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [labelData, setLabelData] = useState([]);
  const [labelArray, setLabelArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvertItem, setSelectedConvertItem] = useState(null);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [stages, setStages] = useState([]);
  const [stageId, setStageId] = useState([]);
  const [attachedFile, setAttachedFiles] = useState();
  const [showOwner, setShowOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldNames, setFieldNames] = useState({});
  const [fields, setFields] = useState([]);
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [allEmails, setAllEmails] = useState([]);
  const [leadName, setLeadName] = useState("");
  const idOfOwner = parseInt(localStorage.getItem("id"));
  const [ownerId, setOwnerId] = useState(0);
  const [ownerName, setOwnerName] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState(
    editedItem?.stage_id || ""
  );
  const [inputAdress , setInputAddress] = useState("");
  const [adminInfo, setAdminInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id: 0,
  });

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

  

  const handleGetEmail = () => {
    const updatedFormData = {
      source: "lead",
      source_id: selectedItem.id,
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



  

  const [info, setInfo] = useState({});
  const role_name = localStorage.getItem("role_name");

  const fetchFields = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(GET_FIELDS + "lead", {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          setFields(response?.data?.data.reverse());
          const fieldsData = response?.data?.data.reverse();
          const newFieldNames = {};
          fieldsData?.forEach((field, index) => {
            newFieldNames[`field${index + 1}`] = field?.field_name;
          });
          setFieldNames(newFieldNames);

          setEditedItem((prevDealDetails) => {
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

  const fetchLead = () => {
    axios
      .get(GET_LEAD_ID + selectedItem?.id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setLeadName(response?.data?.data[0]?.lead_name);
        setOwnerId(response.data.data[0]?.owner);

        setEditedItem(response?.data?.data[0]);
        setInputAddress( response?.data?.data[0]?.address1)
        setName(
          response?.data?.data[0]?.first_name +
            " " +
            response?.data?.data[0]?.last_name
        );
        setOwner(
          response?.data?.data[0]?.ownerf_name +
            " " +
            response?.data?.data[0]?.ownerl_name
        );
        setSelectedStageId(response?.data?.data[0]?.stage_id);
        setIsLoading(false);
        adminInfo.first_name = response?.data?.data[0]?.ownerf_name || "";
        adminInfo.last_name = response?.data?.data[0]?.ownerl_name || "";
        adminInfo.phone = response?.data?.data[0]?.owner_phone || "";
        adminInfo.email = response?.data?.data[0]?.owner_email || "";
        adminInfo.id = response?.data?.data[0]?.owner || "";
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    handleGetEmail();
  }, []);

  useEffect(() => {
    fetchLead();
  }, [fieldNames]);

  const uploadedDocs = () => {
    axios
      .get(UPLOADED_DOCS + "lead" + "/" + selectedItem.id, {
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

  const openConvertModal = (item) => {
    setSelectedConvertItem(item); // Set the selected item
    setConvertModalVisible(true); // Open the modal
  };
  const closeConvertModal = () => {
    setSelectedConvertItem(null); // Clear the selected item
    setConvertModalVisible(false); // Close the modal
  };

  const fetchCall = () => {
    axios
      .get(GET_ACTIVITY + "lead/" + selectedItem.id, {
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

  const fetchStages = () => {
    const body = {
      org_id:orgId
    }
    axios
      .post(GET_ALL_STAGE + "/lead", body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const stageNames = response?.data?.message?.map(
          (item) => item.display_name
        );
        const stageIdArray = response?.data?.message?.map((item) => item.id);

        if (stageNames && stageNames?.length > 0) {
          setStages(stageNames.reverse());
          setStageId(stageIdArray.reverse());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchLabelData = async () => {
    const body = {
      org_id:orgId
    }
    try {
      const response = await axios.post(GET_LABEL, body,{
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

  useEffect(() => {
    // Set the initial state to the first user in the userData array
    if (userData?.length > 0) {
      setSelectedUser({
        email: userData[0]?.email,
        phone: userData[0]?.phone,
        id: userData[0]?.id,
      });
    }
  }, [userData]);

  useEffect(() => {
    fetchLead();
    fetchLabelData();
  }, []);

  const userAdded = () => {
    axios
      .post(GET_ACTIVE_TEAM_MEM,{orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const responseData = response?.data?.data;
        // const combinedData = [adminInfo, ...responseData];

        setUserData(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    userAdded();
  }, [orgId]);

  useEffect(() => {
    fetchNotes();
    fetchCall();
  }, []);

  const fetchNotes = () => {
    axios
      .get(GETNOTEBYSOURCE + selectedItem?.id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response?.data?.status === 1) {
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

    setEditedItem({
      ...editedItem,
      [name]: value,
    });

    if (name === "label") {
      const selectedLabelData = mergedLabels?.find(
        (label) => label.id === parseInt(value)
      );
      setEditedItem({
        ...editedItem,
        label_id: selectedLabelData.id,
      });
    } else if (name === "stage_id") {
      setSelectedStageId(value);
    } else if (name === "owner") {
      const selectedUserData = userData?.find(
        (user) => user.id === parseInt(value)
      );

      setInfo(selectedUserData);
      setOwnerName(selectedUserData);

      setSelectedUser({
        email: selectedUserData?.email || "",
        phone: selectedUserData?.phone || "",
        id: selectedUserData?.id || "",
      });
    }else if (name === "pin" && value?.length > 1 && value?.length <= 4) {
      setEditedItem({
        ...editedItem,
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

  const handleAddressChange = (e) => {
    const { name, value } = e?.target;
    setInputAddress(e?.target?.value);
    setEditedItem((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);

  };



  const handleAdressClick = (address) => {
    setInputAddress(address);
    setEditedItem((prevState) => ({ ...prevState, "address1": address }));
    setShowSearchResult(false);
  };

  const handleFields = () => {
    setIsFieldsOpen(!isFieldsOpen);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "label") {
  //     const selectedLabelData = mergedLabels.find(
  //       (label) => label.id === parseInt(value)
  //     );
  //     setEditedItem({
  //       ...editedItem,
  //       label_id: selectedLabelData.id,
  //     });
  //   } else if (name === "stage_id") {
  //     setSelectedStageId(e.target.value);
  //   } else if (name === "owner") {

  //     const selectedUserData = userData.find(
  //       (user) =>
  //          user.id === parseInt(value);
  //     );
  //   }

  //     // setInfo(selectedUserData)

  //     // setSelectedUser({
  //     //   email: selectedUserData?.email || "",
  //     //   phone: selectedUserData?.phone || "",
  //     //   id: selectedUserData?.id || "",
  //     // });
  //    else {
  //     setEditedItem({
  //       ...editedItem,
  //       [name]: value,
  //     });
  //   }

  //   setStateBtn(1);
  // };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setStateBtn(1);
  };

  const toggleEditable = (e) => {
    e.preventDefault();
    setIsEditable(!isEditable);
    setIsDisabled(!isDisabled);
  };

  const handleUpdateClick = (event) => {
    event.preventDefault();
    const fieldMappings = {};

    for (const key in fieldNames) {
      fieldMappings[fieldNames[key]] = editedItem?.[fieldNames[key]];
    }
    const updatedLead = {
      leadIds: [selectedItem?.id],
      lead_name: editedItem?.lead_name,
      first_name: name?.split(" ")[0],
      last_name: name?.split(" ")[1],
      position: editedItem?.position,
      phone: editedItem?.phone,
      source: editedItem?.source,
      company_name: editedItem?.company_name,
      value: editedItem?.value,
      email: editedItem?.email,
      type: editedItem?.type,
      label_id: editedItem?.label_id,
      address1: editedItem?.address1,
      address2: editedItem?.address2,
      city: editedItem?.city,
      state: editedItem?.state,
      country: editedItem?.country,
      pin: editedItem?.pin,
      owner: info?.id,
      stage_id: selectedStageId,
      status: editedItem?.status,
    };

    const newUpdatedLead = { ...updatedLead, ...fieldMappings };
    axios
      .put(UPDATE_LEAD, newUpdatedLead, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        toast.success("Lead data updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    setIsEditable(false);
    setIsDisabled(!isDisabled);
    setStateBtn(0);
    fetchLead();
    onLeadAdded();
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const normalStyling = {
    textAlign: "left",
    fontFamily: "Lexend Deca",
    fontSize: "1.125rem",
    fontWeight: 500,
    color: "#1e2224",
    lineHeight: "17px",
    border: "1px solid transparent",
    width: "12rem",
  };

  const editStyling = {
    border: "1px solid #dcdcdc",
    textAlign: "left",
    fontFamily: "Lexend Deca",
    fontSize: "1.125rem",
    fontWeight: 500,
    color: "#1e2224",
    lineHeight: "17px",
    width: "12rem",

    ":hover": {
      backgroundColor: isHoverDisabled ? "rgb(227, 225, 225)" : "",
      transition: isHoverDisabled ? "all .5s ease-in-out" : "",
      cursor: isHoverDisabled ? "pointer" : "",
    },
  };

  const normalStylingInput = {
    color: "#1e2224",
    fontWeight: 400,
    border: "1px solid #dcdcdc",
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
    border: "1px solid #dcdcdc",
    height: "2rem",

    ":hover": {
      backgroundColor: isHoverDisabled ? "rgb(227, 225, 225)" : "",
      transition: isHoverDisabled ? "all .5s ease-in-out" : "",
      cursor: isHoverDisabled ? "pointer" : "",
    },
    ":focus": {
      border: "1px solid #E2E9F2",
      boxShadow: "none",
    },
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
    backgroundColor: "#fff",
  };
  const normalStylingSelect2 = {
    /* height: 32px; */
    color: " #ffffff !important",
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
  };
  const editStylingSelect2 = {
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

  const mergedLabels = labelData
    .filter((item) => item?.entity?.includes("leads"))
    .map((item) => ({
      id: item?.id,
      name: item?.name,
      colour_code: item?.colour_code,
    }));

  const normalStylingSelect1 = {
    backgroundColor: editedItem?.label_id
      ? mergedLabels?.find((label) => label.id === editedItem?.label_id)
          ?.colour_code
      : "",
    /* height: 32px; */
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

  useEffect(() => {
    setOwnerName(userData?.find((item) => item.id === ownerId));
  }, []);

  return (
    <div className="modal">
      <div className="customization_popup_container">
        <span className="close" onClick={closeModal}>
          <i className="fa-sharp fa-solid fa-xmark"></i>
        </span>
        <div className="user-details--left">
          <div className="user-details--heading">
            <div className="user-details-imgBox">
              <img src={userIcon} alt="user" />
              <p>
                {isLoading ? (
                  <span>-</span>
                ) : (
                  <>
                    {" "}
                    <input
                      type="text"
                      name="lead_name"
                      value={editedItem?.lead_name}
                      onChange={handleInputChange}
                      style={isEditable ? editStyling : normalStyling}
                      disabled={isDisabled}
                    />
                    <br />
                  </>
                )}
              </p>
            </div>
            {ownerId === idOfOwner && (
              <a href="#" className="edit-details" onClick={toggleEditable}>
                <i className="fa-solid fa-pen"></i>
              </a>
            )}
          </div>
          <div className="leadDetailsLeft">
            <div className="detailsBox">
              <p className="detailHead">LEAD INFORMATION</p>
              <div className="detailsContent">
                <div className="detailsLeftContainer">
                  <p>Name</p>
                  <p>Title</p>
                  <p>Phone</p>
                  <p>Lead Source</p>
                  <p>Company</p>
                  <p>Annual Revenue</p>
                  <p>Email</p>
                  <p>Industry</p>
                  <p>Lables</p>
                  <p>Stages</p>
                </div>
                <div className="detailsRightContainer">
                  <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          value={name}
                          onChange={handleNameChange}
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
                          name="position"
                          value={editedItem?.position}
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
                          name="phone"
                          value={editedItem?.phone}
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
                          name="source"
                          value={editedItem?.source}
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
                          name="company_name"
                          value={editedItem?.company_name}
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
                          name="value"
                          value={editedItem?.value}
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
                          value={editedItem?.email}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                          className="email-case"
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
                          name="type"
                          value={editedItem?.type}
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
                          name="label_id"
                          id="label_id"
                          value={editedItem?.label_id || ""}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                          style={
                            isEditable
                              ? editStylingSelect1
                              : normalStylingSelect1
                          }
                          className={isDisabled ? "disabled" : ""}
                        >
                          {mergedLabels.map((item) => {
                            return (
                              <option key={item?.id} value={item?.id}>
                                {item?.name}
                              </option>
                            );
                          })}
                        </select>
                      </span>
                    )}
                  </p>
                  {isLoading ? (
                    <span>-</span>
                  ) : (
                    <span>
                      <select
                        name="stage_id"
                        id="stage_id"
                        value={editedItem?.stage_id}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                        style={
                          isEditable ? editStylingSelect2 : normalStylingSelect2
                        }
                        className={isDisabled ? "disabled" : ""}
                      >
                        {stages?.map((item, index) => {
                          return (
                            <option key={index} value={stageId[index]}>
                              {item}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="detailsBox">
              <p className="detailHead">LEAD OWNER</p>
              <div className="detailsContent">
                <div className="detailsLeftContainer">
                  <p>Lead Owner</p>
                  <p>Email</p>
                  <p>Contacts</p>
                </div>
                <div className="detailsRightContainer">
                  <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {role_name !== "admin" ? (
                          <input
                            type="text"
                            name=""
                            value={
                              editedItem.ownerf_name +
                              " " +
                              editedItem.ownerl_name
                            }
                            style={normalStylingInput}
                            disabled={true}
                            className="email-case"
                          />
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
                                  {`${
                                    item?.first_name?.charAt(0).toUpperCase() +
                                    item?.first_name?.slice(1)
                                  } ${
                                    item?.last_name?.charAt(0).toUpperCase() +
                                    item?.last_name?.slice(1)
                                  }`}
                                </option>
                              ))}
                          </select>
                        )}
                      </span>
                    )}
                  </p>

                  <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {role_name !== "admin" ? (
                          <input
                            type="email"
                            name="owner_email"
                            value={editedItem?.owner_email}
                            style={normalStylingInput}
                            disabled={true}
                            className="email-case"
                          />
                        ) : (
                          <input
                            type="email"
                            name="owner_email"
                            value={selectedUser?.owner_email}
                            style={normalStylingInput}
                            disabled={true}
                            className="email-case"
                          />
                        )}
                      </span>
                    )}
                  </p>
                  <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {role_name !== "admin" ? (
                          <input
                            type="text"
                            name="owner_phone"
                            value={editedItem?.owner_phone}
                            style={normalStylingInput}
                            disabled={true}
                          />
                        ) : (
                          <input
                            type="text"
                            name="owner_phone"
                            value={selectedUser?.phone}
                            style={normalStylingInput}
                            disabled={true}
                          />
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="detailsBox">
              <p className="detailHead">ADDRESS INFORMATION</p>
              <div className="detailsContent">
                <div className="detailsLeftContainer">
                  <p>City</p>
                  <p>State</p>
                  <p>Country</p>
                  <p>Zip Code</p>
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
                          type="text"
                          name="city"
                          value={editedItem?.city}
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
                          name="state"
                          value={editedItem?.state}
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
                          value={editedItem?.country}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                        />
                      </span>
                    )}
                  </p>
                  <div className="lead-new-position">
                  <p>
                    {isLoading ? (
                      <span>-</span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          name="pin"
                          value={editedItem?.pin}
                          onChange={handleInputChange}
                          style={
                            isEditable ? editStylingInput : normalStylingInput
                          }
                          disabled={isDisabled}
                          className="lead-pin-input"
                          autoComplete="off"
                        />
                      </span>
                    )}
                  </p>
                  {showSearchResult && address?.length > 1 && (
                <div className="search_result company-address-result lead-address-edit-result" ref={searchResultRef}>
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
                          value={editedItem?.address2}
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
            </div>

            <div className="detailsBox">
              <p className="detailHead">Fields</p>
              <div className="detailsContent">
                <div className="detailsLeftContainer">
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
                              isEditable ? editStylingInput : normalStylingInput
                            }
                            value={editedItem && editedItem[field.field_name]}
                            disabled={isDisabled}
                          />
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {isEditable ? (
            <div className="modalLeftBtnBox">
              <button
                className="convertToDeal"
                onClick={() => openConvertModal(selectedItem)}
              >
                Convert to deal
              </button>
              {stateBtn === 0 ? (
                <button disabled className="disabledBtn">
                  Save
                </button>
              ) : (
                <button onClick={handleUpdateClick} className="convertToDeal">
                  Save
                </button>
              )}
            </div>
          ) : (
            <div className="modalLeftBtnBox">
              <span></span>
              <button
                className="convertToDeal"
                onClick={() => openConvertModal(selectedItem)}
              >
                Convert to deal
              </button>
            </div>
          )}
        </div>

        {/* left side of modal ends here */}
        <div className="user-details--right">
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
              <i class="fa-sharp fa-regular fab fa-whatsapp"></i>
              Whatsapp
            </button>
            <button
              className={activeTab === "activity" ? "active" : ""}
              onClick={() => handleTabClick("activity")}
            >
              <i class="fa-solid fa-sharp fa-regular fa-calendar-days"></i>
              Activity ({activityCount})
            </button>
            <button
              className={activeTab === "attachment" ? "active" : ""}
              onClick={() => handleTabClick("attachment")}
            >
              <i className="fa-sharp fa-solid fa-paperclip"></i>
              Attachment ({attachedFile})
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "notes" && (
              <div className="notes-tab-content">
                <AddNotes
                  item={selectedItem}
                  onNotesNum={fetchNotes}
                  type="lead"
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                />
              </div>
            )}
            {activeTab === "email" && (
              <div className="email-tab-content">
                <DealEmail
                  id={selectedItem.id}
                  type="lead"
                  dealName={leadName}
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                  email={editedItem?.email}
                />
              </div>
            )}
            {activeTab === "activity" && (
              <div className="activity-tab-content">
                <DealActivity
                  item={selectedItem}
                  type={"lead"}
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
                  dealId={selectedItem.id}
                  type={"lead"}
                  onAttachNum={uploadedDocs}
                  ownerId={ownerId}
                  idOfOwner={idOfOwner}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* modal container ends here */}
      {convertModalVisible && (
        <CreateDeal
          isOpen={true}
          onClose={closeConvertModal}
          onLeadAdded={onLeadAdded}
          selectedItem={selectedConvertItem} // Pass the selected item to modal
        />
      )}
    </div>
  );
};

export default LeadModal;
