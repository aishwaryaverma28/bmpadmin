import React, { useEffect } from "react";
import "../styles/CPGenral.css";
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { getDecryptedToken, GET_LEAD, GET_ALL_DEAL, ALL_COMPANY, ALL_PEOPLE, LOG_RECORD } from "../utils/Constants.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExportTab = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const orgId = localStorage.getItem("org_id");
  const [jsonLeadData, setJsonLeadData] = useState([]);
  const [jsonDealData, setJsonDealData] = useState([]);
  const [jsonCompanyData, setJsonCompanyData] = useState([]);
  const [jsonPeopleData, setJsonPeopleData] = useState([]);
  const decryptedToken = getDecryptedToken();

  const fetchLeadData = () => {
    axios.get(GET_LEAD, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      },
    })
    .then((response) => {
      setJsonLeadData(response?.data?.data);
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const logRecord = (type) => {
    const updatedFormData = {
      attr1: `${type}:export`,
      attr4: `${type} exported`,
    };
    axios
      .post(LOG_RECORD, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
      if(response?.data?.status===1){
        toast.success(`${type} export successfull`, {
          position: "top-center",
          autoClose: 2000,
        });
      }else{
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const downloadLeadCSV = () => {
    const csv = Papa.unparse(jsonLeadData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord("lead");
  };

  const fetchDealData = () => {
    axios.get(GET_ALL_DEAL, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      },
    })
    .then((response) => {
      setJsonDealData(response?.data?.data);
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const downloadDealCSV = () => {
    const csv = Papa.unparse(jsonDealData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deal.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord("deal");
  };
  const fetchCompanyData = () => {
    const body = {
      org_id: orgId
    }
    axios.post(ALL_COMPANY, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      },
    })
    .then((response) => {
      setJsonCompanyData(response?.data?.data);
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const downloadCompanyCSV = () => {
    const csv = Papa.unparse(jsonCompanyData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "company.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord("company");
  };
  const fetchPeopleData = () => {
    const body={
      org_id:orgId
    }
    axios.post(ALL_PEOPLE,body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      },
    })
    .then((response) => {
      setJsonPeopleData(response?.data?.data);
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const downloadPeopleCSV = () => {
    const csv = Papa.unparse(jsonPeopleData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "people.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord("people");
  };



  useEffect(() => {
    fetchLeadData();
    fetchDealData();
    fetchCompanyData();
    fetchPeopleData();
  }, []);

  function handleTabChange(tabName) {
    setActiveTab(tabName);
  }
  return (
    <div>
      <div className="cp-billings-tabs">
        <button
          className={`common-fonts ${activeTab === "leads" ? "cp-active" : ""}`}
          onClick={() => handleTabChange("leads")}
        >
          Leads
        </button>

        <button
          className={`common-fonts ${activeTab === "deals" ? "cp-active" : ""}`}
          onClick={() => handleTabChange("deals")}
        >
          Deals
        </button>

        <button
          className={`common-fonts ${
            activeTab === "company" ? "cp-active" : ""
          }`}
          onClick={() => handleTabChange("company")}
        >
          Company
        </button>
        <button
          className={`common-fonts ${
            activeTab === "people" ? "cp-active" : ""
          }`}
          onClick={() => handleTabChange("people")}
        >
          People
        </button>
      </div>

      {activeTab === "leads" && (
        <div>
          <div className="import-tab-btn">
            <button
              className="common-save-button common-fonts"
              onClick={downloadLeadCSV}
            >
              Export
            </button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th>
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="common-fonts">1</td>
                  <td className="common-fonts">Sep 6, 2023</td>
                  <td className="common-fonts">Import Leads file</td>
                  <td className="common-fonts">100</td>
                  <td className="common-fonts">85</td>
                  <td className="common-fonts">15</td>
                  <td className="common-fonts">Anant Singh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "deals" && (
        <div>
          <div className="import-tab-btn">
            <button className="common-save-button common-fonts" onClick={downloadDealCSV}>Export</button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th>
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="common-fonts">1</td>
                  <td className="common-fonts">Sep 6, 2023</td>
                  <td className="common-fonts">Import Leads file</td>
                  <td className="common-fonts">100</td>
                  <td className="common-fonts">85</td>
                  <td className="common-fonts">15</td>
                  <td className="common-fonts">Anant Singh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "company" && (
        <div>
          <div className="import-tab-btn">
            <button className="common-save-button common-fonts" onClick={downloadCompanyCSV}>Export</button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th>
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="common-fonts">1</td>
                  <td className="common-fonts">Sep 6, 2023</td>
                  <td className="common-fonts">Import Leads file</td>
                  <td className="common-fonts">100</td>
                  <td className="common-fonts">85</td>
                  <td className="common-fonts">15</td>
                  <td className="common-fonts">Anant Singh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "people" && (
        <div>
          <div className="import-tab-btn">
            <button className="common-save-button common-fonts" onClick={downloadPeopleCSV}>Export</button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th>
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="common-fonts">1</td>
                  <td className="common-fonts">Sep 6, 2023</td>
                  <td className="common-fonts">Import Leads file</td>
                  <td className="common-fonts">100</td>
                  <td className="common-fonts">85</td>
                  <td className="common-fonts">15</td>
                  <td className="common-fonts">Anant Singh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ExportTab;
