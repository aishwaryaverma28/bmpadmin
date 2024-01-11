import React, { useState, useEffect } from "react";
import "../styles/RecycleBin.css";
import axios from "axios";
import {
  GETNOTE_FROM_TRASH,
  GETDEAL_FROM_TRASH,
  GET_BIN_COMPANY,
  getDecryptedToken,
  handleLogout,
  GET_ALL_FROM_TRASH
} from "../utils/Constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/image/calendar.svg";
import { format } from "date-fns";
import DeleteLeads from "./DeleteLeads";
import DeleteNotes from "./DeleteNotes";
import RecycleDeletePopUp from "./RecycleDeletePopUp";
import RecycleRestorePopUp from "./RecycleRestorePopUp";
import SearchIcon from "../../assets/image/search.svg";
import DeleteDeal from "./DeleteDeal";
import DeleteCompany from "./DeleteCompany";
import DeletePeople from "./DeletePeople";

const RecycleBin = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leadlen, setLeadlen] = useState(0);
  const [deallen, setDeallen] = useState(0);
  const [noteslen, setNoteslen] = useState(0);
  const [companylen, setCompanylen] = useState(0);
  const [peoplelen, setPeoplelen] = useState(0);
  const [activeTab, setActiveTab] = useState("Notes");
  // const [notesDataLength, setNotesDataLength] = useState(0);
  const decryptedToken = getDecryptedToken();
  const [isDeleteDealModalOpen, setIsDeleteDealModalOpen] = useState(false);
  const [isRestoreDealModalOpen, setIsRestoreDealModalOpen] = useState(false);
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] =
    useState(false);
  const [isRestoreCompanyModalOpen, setIsRestoreCompanyModalOpen] =
    useState(false);
  const [isDeleteContactModalOpen, setIsDeleteContactModalOpen] =
    useState(false);
  const [isRestoreContactModalOpen, setIsRestoreContactModalOpen] =
    useState(false);
    const orgId = localStorage.getItem("org_id");

  // function to open delete popup and close delete pop up for deal tab

  const dealsDeletePopUp = () => {
    setIsDeleteDealModalOpen(true);
  };

  const closeDealDeletePopUp = () => {
    setIsDeleteDealModalOpen(false);
  };

  // function to open restore popup and close restore pop up for deal tab
  const dealsRestorePopUp = () => {
    setIsRestoreDealModalOpen(true);
  };

  const closeDealRestorePopUp = () => {
    setIsRestoreDealModalOpen(false);
  };

  // function to open delete popup and close delete pop up for company tab

  const companyDeletePopUp = () => {
    setIsDeleteCompanyModalOpen(true);
  };

  const closeCompanyDeletePopUp = () => {
    setIsDeleteCompanyModalOpen(false);
  };

  // function to open restore popup and close restore pop up for company tab

  const companyRestorePopUp = () => {
    setIsRestoreCompanyModalOpen(true);
  };

  const closeCompanyRestorePopUp = () => {
    setIsRestoreCompanyModalOpen(false);
  };

  // function to open delete popup and close delete pop up for contact tab

  const contactDeletePopUp = () => {
    setIsDeleteContactModalOpen(true);
  };

  const closeContactDeletePopUp = () => {
    setIsDeleteContactModalOpen(false);
  };

  // function to open restore popup and close restore pop up for contact tab

  const contactRestorePopUp = () => {
    setIsRestoreContactModalOpen(true);
  };

  const closeContactRestorePopUp = () => {
    setIsRestoreContactModalOpen(false);
  };

  useEffect(() => {
    fetchData();
    fetchNotesData();
    fetchDealData();
    fetchCompanyData();
    fetchPeopleData();
    const validTabs = ["Notes", "Deals", "Leads", "Company", "People"];
    if (!validTabs.includes(localStorage.getItem("activeTab"))) {
      setActiveTab("Leads");
      localStorage.setItem("activeTab", "Leads");
    }
  }, []);
  const fetchData = async () => {
    const body = {
      org_id:orgId
    }
    try {
      const response = await axios.post(
        GET_ALL_FROM_TRASH, body,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        }
      );

      if (response.data.status === 1) {
        // console.log(response.data.data);
        setLeadlen(response.data.data.length);
      } else {
        if (response.data.message === "Token has expired") {
          alert(response.data.message);
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDealData = async () => {
    const body = {
      org_id: orgId
    }
    try {
      const response = await axios.post(
        GETDEAL_FROM_TRASH, body,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        }
      );

      if (response.data.status === 1) {
        // console.log(response.data.data);
        setDeallen(response.data.data.length);
      } else {
        if (response.data.message === "Token has expired") {
          alert(response.data.message);
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchNotesData = async () => {
    try {
      const response = await axios.get(GETNOTE_FROM_TRASH, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      if (response.data.status === 1) {
        setNoteslen(response.data.data.length);
      } else {
        if (response.data.message === "Token has expired") {
          alert(response.data.message);
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCompanyData = async () => {
    const body = {
        contactType: "xx_company",
        org_id:orgId
    }
    try {
      const response = await axios.post(GET_BIN_COMPANY, body,{
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      if (response?.data?.status === 1) {
        setCompanylen(response.data.data.length);
      } 
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  };
  const fetchPeopleData = async () => {
    const body = {
      contactType: "xx_contact_person",
      org_id:orgId
    }
    try {
      const response = await axios.post(GET_BIN_COMPANY, body,{
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      if (response?.data?.status === 1) {
        setPeoplelen(response.data.data.length);
      } 
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName); // Store the active tab in localStorage
  };

  return (
    <>
      <section className="recycle-container">
        <div className="recycle-top">
          <div>
            <p className="recycle-heading recycle-fonts">Recycle Bin</p>
            <p className="recycle-note recycle-fonts">
              Restore Deals deleted in the last 90 days
            </p>
          </div>
          <div className="recycle-top-right">
            <p className="default-days recycle-fonts">Default delete Days</p>
            <select name="" id="" className="recycle-fonts default-days-select" disabled>
              <option value="">90 days</option>
            </select>
          </div>
        </div>
        <div className="recycle-setting-btn ">
          <button
            className={`recycle-btn recycle-fonts ${
              activeTab === "Notes" ? "recycle-active" : ""
            }`}
            onClick={() => handleTabClick("Notes")}
          >
            Notes ({noteslen})
          </button>
          <button
            className={`recycle-btn recycle-fonts ${
              activeTab === "Deals" ? "recycle-active" : ""
            }`}
            onClick={() => handleTabClick("Deals")}
          >
            Deals ({deallen})
          </button>
          <button
            className={`recycle-btn recycle-fonts ${
              activeTab === "Leads" ? "recycle-active" : ""
            }`}
            onClick={() => handleTabClick("Leads")}
          >
            Leads ({leadlen})
          </button>
          <button
            className={`recycle-btn recycle-fonts ${
              activeTab === "Company" ? "recycle-active" : ""
            }`}
            onClick={() => handleTabClick("Company")}
          >
            Company ({companylen})
          </button>
          <button
            className={`recycle-btn recycle-fonts ${
              activeTab === "Contacts" ? "recycle-active" : ""
            }`}
            onClick={() => handleTabClick("People")}
          >
            People ({peoplelen})
          </button>
        </div>
        {activeTab === "Notes" && <DeleteNotes deleteCount={fetchNotesData} />}
        {activeTab === "Deals" && <DeleteDeal deleteCount={fetchDealData}/>}
        {activeTab === "Leads" && <DeleteLeads deleteCount={fetchData} />}
        {activeTab === "Company" && <DeleteCompany deleteCount={fetchCompanyData}/>}
        {activeTab === "People" && <DeletePeople deleteCount={fetchPeopleData}/>}
      </section>
    </>
  );
};

export default RecycleBin;

