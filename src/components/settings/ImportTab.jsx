import React, { useState, useRef } from "react";
import "../styles/CPGenral.css";
import Papa from "papaparse";
import axios from "axios";
import {
  GET_ALL_STAGE,
  IMPORT_CSV,
  IMPORT_DEAL,
  IMPORT_PEOPLE,
  IMPORT_COMPANY,
  IMPORT_DETAILS,
  getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const ImportTab = () => {
  const orgId = localStorage.getItem("org_id");
  const decryptedToken = getDecryptedToken();
  const fileLeadInputRef = useRef(null);
  const fileDealInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [activeTab, setActiveTab] = useState("leads");
  const [lead, setLead] = useState([]);
  const [deal, setDeal] = useState([]);
  const [people, setPeople] = useState([]);
  const [company, setCompany] = useState([]);
  const [fDealStageId, setFDealStageId] = useState(0);
  const [fLeadStageId, setFLeadStageId] = useState(0);
  function handleTabChange(tabName) {
    setActiveTab(tabName);
  }

  const fetchStatus = () => {
    const body = {
      org_id:orgId
    }
    axios
      .post(GET_ALL_STAGE + "/deal", body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const ids = response?.data?.message?.map((item) => item.id);
        if (ids && ids.length > 0) {
          const minId = Math.min(...ids);
          setFDealStageId(minId);
        }
      })
      .catch((error) => {
        console.log(error);
      });

      axios
      .post(GET_ALL_STAGE + "/lead", body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const ids = response?.data?.message?.map((item) => item.id);
        if (ids && ids.length > 0) {
          const minId = Math.min(...ids);
          setFLeadStageId(minId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
console.log(fLeadStageId, fDealStageId);
  const handleCsvLeadFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assume the first row contains headers
        complete: (result) => {
          const dataWithIntValues = result?.data.map((row) => ({
            ...row,
            value: parseInt(row?.value), // Parse the "value" field as an integer
            stage_id: parseInt(fLeadStageId),
            org_id: parseInt(orgId),
          }));
          // Store CSV data in state
          const dataWithoutLastValue = dataWithIntValues.slice(0, -1);
          postLeadCsvDataToAPI(dataWithoutLastValue);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    }
  };
  // Function to handle "Import" menu item click
  const handleLeadImportClick = () => {
    // Trigger a click event on the hidden file input element
    fileLeadInputRef.current.click();
  };
  const postLeadCsvDataToAPI = async (csvData) => {
    try {
      const response = await axios.post(
        IMPORT_CSV,
        {
          data: csvData,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        toast.success("Import successfull", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchImportLeadDetails();
      } else {
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error posting CSV data:", error);
      // Handle the error as needed
    }
  };

  const handleDealCsvFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assume the first row contains headers
        complete: (result) => {
          const dataWithIntValues = result?.data.map((row) => ({
            ...row,
            lead_id: parseInt(row?.lead_id),
            value: parseInt(row?.value),
            pipeline_id: parseInt(row?.pipeline_id),
            mobile: parseInt(row?.mobile),
            security_value: parseInt(row?.security_value),
            loan_amount: parseInt(row?.loan_amount),
            deposit: parseInt(row?.deposit),
            engagement_fee: parseInt(row?.engagement_fee),
            engagement_fee_paid: parseInt(row?.engagement_fee_paid),
            broker_fee: parseInt(row?.broker_fee),
            broker_fee_paid: parseInt(row?.broker_fee_paid),
            procuration_fee: parseInt(row?.procuration_fee),
            procuration_fee_paid: parseInt(row?.procuration_fee_paid),
            deal_commission: parseInt(row?.deal_commission),
            closure_date: formatDate(row?.closure_date),
            data_enquiry_receive: formatDate(row?.data_enquiry_receive),
            borrower_entry: formatDate(row?.borrower_entry),
            completion_date: formatDate(row?.completion_date),
            org_id: parseInt(orgId),
            stage_id: parseInt(fDealStageId),
          }));
          const dataWithoutLastValue = dataWithIntValues.slice(0, -1);
          postDealCsvDataToAPI(dataWithoutLastValue);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    }
  };
  const formatDate = (dateString) => {
    if (dateString) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
  };
  const handleDealImportClick = () => {
    fileDealInputRef.current.click();
  };
  const postDealCsvDataToAPI = async (csvData) => {
    try {
      const response = await axios.post(
        IMPORT_DEAL,
        {
          data: csvData,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        toast.success("Import successfull", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchImportDealDetails();
        } else {
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error posting CSV data:", error);
    }
  };
  const handleCsvFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assume the first row contains headers
        complete: (result) => {
          const dataWithIntValues = result?.data.map((row) => ({
            ...row,
            valuation: parseInt(row?.valuation),
            org_id: parseInt(orgId),
          }));
          const dataWithoutLastValue = dataWithIntValues.slice(0, -1);
          postCsvDataToAPI(dataWithoutLastValue);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    }
  };
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  const postCsvDataToAPI = async (csvData) => {
    try {
      const response = await axios.post(
        IMPORT_COMPANY,
        {
          data: csvData,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        toast.success("Import successfull", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchImportCompanyDetails();
      } else {
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error posting CSV data:", error);
      // Handle the error as needed
    }
  };

  const handleCsvFileImport2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assume the first row contains headers
        complete: (result) => {
          const dataWithOrgId = result?.data.map((row) => ({
            ...row,
            org_id: parseInt(orgId),
          }));
          const dataWithoutLastValue = dataWithOrgId.slice(0, -1);
          postCsvDataToAPI2(dataWithoutLastValue);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    }
  };
  // ==============================================Function to handle "Import" people item click
  const fetchImportLeadDetails = () => {
    axios
      .get(IMPORT_DETAILS + "lead:imported", {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setLead(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchImportDealDetails = () => {
    axios
      .get(IMPORT_DETAILS + "deal:imported", {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setDeal(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchImportCompanyDetails = () => {
    axios
      .get(IMPORT_DETAILS + "company:imported", {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setCompany(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchImportPeopleDetails = () => {
    axios
      .get(IMPORT_DETAILS + "people:imported", {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setPeople(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchStatus();
    fetchImportLeadDetails();
    fetchImportDealDetails();
    fetchImportCompanyDetails();
    fetchImportPeopleDetails();
  }, []);

  const handleImportClick2 = () => {
    fileInputRef2.current.click();
  };
  const postCsvDataToAPI2 = async (csvData) => {
    try {
      const response = await axios.post(
        IMPORT_PEOPLE,
        {
          data: csvData,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        toast.success("Import successfull", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchImportPeopleDetails();
      } else {
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error posting CSV data:", error);
      // Handle the error as needed
    }
  };

  const jsonLeadData = [
    {
      source: "google",
      lead_name: "sampleName",
      position: "samplePosition",
      company_name: "sampleCompany",
      registration_no: "sampleRegister",
      employees: "sampleEmployee",
      first_name: "sampleFname",
      last_name: "sampleLname",
      type: "open",
      value: 1000,
      address1: "sampleAddress1",
      address2: "sampleAddress2",
      city: "sampleCity",
      state: "sampleState",
      country: "sampleCountry",
      pin: "samplePin1",
      phone: "samplePhone",
      email: "sample@example.com",
      website: "https://wwww.example.com",
      stage_id: 13,
      stage_name: "New",
    },
    {
      source: "google",
      lead_name: "sampleName",
      position: "samplePosition",
      company_name: "sampleCompany",
      registration_no: "sampleRegister",
      employees: "sampleEmployee",
      first_name: "sampleFname",
      last_name: "sampleLname",
      type: "open",
      value: 1000,
      address1: "sampleAddress1",
      address2: "sampleAddress2",
      city: "sampleCity",
      state: "sampleState",
      country: "sampleCountry",
      pin: "samplePin1",
      phone: "samplePhone",
      email: "sample@example.com",
      website: "https://wwww.example.com",
      stage_id: 13,
      stage_name: "New",
    },
  ];

  const downloadLeadCSV = () => {
    const csv = Papa.unparse(jsonLeadData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_lead.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const jsonDealData = [
    {
      lead_id: 1111111,
      deal_name: "dealName",
      currency: "GBP",
      organization: "Ezuka",
      probability: "50",
      closure_date: "2022-02-12",
      value: 3000,
      email: "email@Ezuka.com",
      contact: "contact@Ezuka.com",
      pipeline_id: 1,
      mobile: "sampleMobileNumber",
      introducer_name: "John Due",
      introducer_firm_name: "Doe And Associates",
      data_enquiry_receive: "2023-08-24",
      borrower_entry: "2023-08-25",
      security_value: 10000,
      loan_amount: 50000,
      deposit: 2500,
      type_of_security: "Mortgage",
      loan_type: "Fixed Rate",
      lender: 1,
      lead_source: "Website",
      engagement_fee: 1500,
      engagement_fee_paid: 500,
      broker_fee: 2000,
      broker_fee_paid: 1000,
      procuration_fee: 800,
      procuration_fee_paid: 400,
      deal_commission: 3000,
      completion_date: "2023-09-15",
    },
    {
      lead_id: 1111111,
      deal_name: "dealName",
      currency: "GBP",
      organization: "Ezuka",
      probability: "50",
      closure_date: "2022-02-12",
      value: 3000,
      email: "email@Ezuka.com",
      contact: "contact@Ezuka.com",
      pipeline_id: 1,
      mobile: "sampleMobileNumber",
      introducer_name: "John Due",
      introducer_firm_name: "Doe And Associates",
      data_enquiry_receive: "2023-08-24",
      borrower_entry: "2023-08-25",
      security_value: 10000,
      loan_amount: 50000,
      deposit: 2500,
      type_of_security: "Mortgage",
      loan_type: "Fixed Rate",
      lender: 1,
      lead_source: "Website",
      engagement_fee: 1500,
      engagement_fee_paid: 500,
      broker_fee: 2000,
      broker_fee_paid: 1000,
      procuration_fee: 800,
      procuration_fee_paid: 400,
      deal_commission: 3000,
      completion_date: "2023-09-15",
    },
  ];

  const downloadDealCSV = () => {
    const csv = Papa.unparse(jsonDealData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_deal.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const jsonCompanyData = [
    // Your JSON data here
    {
      name: "ABC Inc.",
      orgid: "ORG123",
      address1: "123 Main Street",
      address2: "Suite 456",
      city: "Anytown",
      country: "UK",
      postcode: 1234,
      email: "abc@gmail.com",
      phone: "samplePhone",
      valuation: 100000,
      valuation_in: "GBP",
      domain: "abcinc.com",
      industry: "Technology",
    },
    {
      name: "ABC Inc.",
      orgid: "ORG123",
      address1: "123 Main Street",
      address2: "Suite 456",
      city: "Anytown",
      country: "UK",
      postcode: 1234,
      email: "abc@gmail.com",
      phone: "samplePhone",
      valuation: 100000,
      valuation_in: "GBP",
      domain: "abcinc.com",
      industry: "Technology",
    },
    // Add more data as needed
  ];

  const downloadCompanyCSV = () => {
    const csv = Papa.unparse(jsonCompanyData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_company.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const jsonPeopleData = [
    // Your JSON data here
    {
      name: "John Doe",
      organization: "ABC Corporation",
      phone: "+1-123-456-7890",
      email: "johndoe@example.com",
      city: "New York",
      state: "NY",
      postal_code: "10001",
    },
    {
      name: "John Doe",
      organization: "ABC Corporation",
      phone: "+1-123-456-7890",
      email: "johndoe@example.com",
      city: "New York",
      state: "NY",
      postal_code: "10001",
    },
  ];

  const downloadPeopleCSV = () => {
    const csv = Papa.unparse(jsonPeopleData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_people.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
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
              className="common-white-button common-fonts sample-download"
              onClick={downloadLeadCSV}
            >
              Sample Download
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileLeadInputRef}
              style={{ display: "none" }}
              onChange={handleCsvLeadFileImport}
            />
            <button
              className="common-save-button common-fonts"
              onClick={handleLeadImportClick}
            >
              Import
            </button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  {/* <th className="common-fonts">TOTAL COUNT</th> */}
                  {/* <th className="common-fonts">SUCCESS</th> */}
                  {/* <th className="common-fonts">FAILED</th> */}
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
                {lead.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center" }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  lead.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="common-fonts">{item.id}</td>
                        <td className="common-fonts">{item?.creation_date.split('T')[0]}</td>
                        <td className="common-fonts">Import Leads file</td>
                        {/* <td className="common-fonts">100</td> */}
                        {/* <td className="common-fonts">85</td> */}
                        {/* <td className="common-fonts">15</td> */}
                        <td className="common-fonts">{item?.created_userfname} {item?.created_userlname}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "deals" && (
        <div>
          <div className="import-tab-btn">
            <button
              className="common-white-button common-fonts sample-download"
              onClick={downloadDealCSV}
            >
              Sample Download
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileDealInputRef}
              style={{ display: "none" }}
              onChange={handleDealCsvFileImport}
            />
            <button
              className="common-save-button common-fonts"
              onClick={handleDealImportClick}
            >
              Import
            </button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  {/* <th className="common-fonts">TOTAL COUNT</th> */}
                  {/* <th className="common-fonts">SUCCESS</th> */}
                  {/* <th className="common-fonts">FAILED</th> */}
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
              {deal.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                deal.map((item) => {
                  return (
                    <tr key={item.id}>
                    <td className="common-fonts">{item.id}</td>
                    <td className="common-fonts">{item?.creation_date.split('T')[0]}</td>
                    <td className="common-fonts">Import Deal file</td>
                    {/* <td className="common-fonts">100</td> */}
                    {/* <td className="common-fonts">85</td> */}
                    {/* <td className="common-fonts">15</td> */}
                    <td className="common-fonts">{item?.created_userfname} {item?.created_userlname}</td>
                  </tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "company" && (
        <div>
          <div className="import-tab-btn">
            <button
              className="common-white-button common-fonts sample-download"
              onClick={downloadCompanyCSV}
            >
              Sample Download
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleCsvFileImport}
            />
            <button
              className="common-save-button common-fonts"
              onClick={handleImportClick}
            >
              Import
            </button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  {/* <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th> */}
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
              {company.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                company.map((item) => {
                  return (
                    <tr key={item.id}>
                    <td className="common-fonts">{item.id}</td>
                    <td className="common-fonts">{item?.creation_date.split('T')[0]}</td>
                    <td className="common-fonts">Import Company file</td>
                    {/* <td className="common-fonts">100</td> */}
                    {/* <td className="common-fonts">85</td> */}
                    {/* <td className="common-fonts">15</td> */}
                    <td className="common-fonts">{item?.created_userfname} {item?.created_userlname}</td>
                  </tr>
                );
              })
            )}
            
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "people" && (
        <div>
          <div className="import-tab-btn">
            <button
              className="common-white-button common-fonts sample-download"
              onClick={downloadPeopleCSV}
            >
              Sample Download
            </button>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef2}
              style={{ display: "none" }}
              onChange={handleCsvFileImport2}
            />
            <button
              className="common-save-button common-fonts"
              onClick={handleImportClick2}
            >
              Import
            </button>
          </div>

          <div className="import-tab-table">
            <table>
              <thead>
                <tr>
                  <th className="common-fonts">S NO</th>
                  <th className="common-fonts">DATE</th>
                  <th className="common-fonts">FILE NAME</th>
                  {/* <th className="common-fonts">TOTAL COUNT</th>
                  <th className="common-fonts">SUCCESS</th>
                  <th className="common-fonts">FAILED</th> */}
                  <th className="common-fonts">USER</th>
                </tr>
              </thead>
              <tbody>
              {people.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                people.map((item) => {
                  return (
                    <tr key={item.id}>
                    <td className="common-fonts">{item.id}</td>
                    <td className="common-fonts">{item?.creation_date.split('T')[0]}</td>
                    <td className="common-fonts">Import People file</td>
                    {/* <td className="common-fonts">100</td> */}
                    {/* <td className="common-fonts">85</td> */}
                    {/* <td className="common-fonts">15</td> */}
                    <td className="common-fonts">{item?.created_userfname} {item?.created_userlname}</td>
                  </tr>
                );
              })
            )}
            
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ImportTab;
