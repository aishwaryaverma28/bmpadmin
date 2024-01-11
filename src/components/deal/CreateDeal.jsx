import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ELIGIBLE_LOANS,
  ADD_DEAL,
  getDecryptedToken,
  GET_LABEL,
  GET_ALL_STAGE,
  handleLogout,
} from "../utils/Constants";
import { countryPhoneCodes, worldCurrencies } from "../utils/CodeCurrency";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateDeal = ({ isOpen, onClose, onLeadAdded, text, contact, selectedItem }) => {
  console.log(contact);
  const [stages, setStages] = useState([]);
  const [status, setStatus] = useState([]);
  const [stageId, setStageId] = useState([]);
  const [loan, setLoan] = useState([]);
  // const [name, setName] = useState("");
  // const [fname, setfName] = useState("");
  // const [lname, setlName] = useState("");
  const decryptedToken = getDecryptedToken();
  const [isDisable, setIsDisable] = useState(true);
  const [labelData, setLabelData] = useState([]);
  const navigate = useNavigate();
  const orgId = localStorage.getItem('org_id');

  const [leadData, setLeadData] = useState({
    probability: "",
    deal_name: "",
    organization: "",
    mobile: "",
    email: "",
    // value: 0,
    label_id: 36,
    closure_date: null,
    stage_id: 1,
    pipeline_id: 1,
    lead_id: 0,
    age_of_business: null,
    company_type: "",
    industry_type: "",
    turnover: null,
    company_location: "",
    duration: "",
    individual_or_company: "",
    loan_amount: null,
    loan_type: "",
  });
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

  const resetForm = () => {
    setLeadData({
      probability: "",
      deal_name: "",
      organization: "",
      mobile: "",
      email: "",
      label_id: 36,
      closure_date: null,
      stage_id: 1,
      pipeline_id: 1,
      lead_id: 0,
      age_of_business: null,
      company_type: "",
      industry_type: "",
      turnover: null,
      company_location: "",
      duration: "",
      individual_or_company: "",
      loan_amount: null,
      loan_type: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fetchCall = () => {
    axios
      .get(ELIGIBLE_LOANS, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setLoan(response?.data?.data);
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
    const body = { org_id: orgId }

    axios
      .post(GET_ALL_STAGE + "/deal", body,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,

          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        const stageNames = response?.data?.message?.map((item) => item.display_name);
        const stageIdArray = response?.data?.message?.map((item) => item.id);
        const statusNames = response?.data?.message?.map((item) => item.stage_name);

        if (stageNames && stageNames.length > 0) {
          setStages(stageNames.reverse());
          setStageId(stageIdArray.reverse());
        }
        if (statusNames && statusNames.length > 0) {
          setStatus(statusNames.reverse());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchStages();
    fetchCall();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setLeadData({
        lead_id: selectedItem.id,
        deal_name: selectedItem.lead_name,
        organization: selectedItem.company_name,
        mobile: selectedItem.phone,
        email: selectedItem.email,
        // value: selectedItem.value,
        label_id: selectedItem.label_id,
        pipeline_id: 1,
        stage_id: selectedItem.stage_id,
        loan_amount: selectedItem.value,
      });
    }
  }, [selectedItem]);

  const data = () => {
    setLeadData({
      organization: contact?.name,
      mobile: contact?.phone,
      email: contact?.email,
    });
  }
  useEffect(() => {
    if (contact) {
      data();
    }
  }, [contact]);

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
      } else {
        if (response.data.message === "Token has expired") {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLabelData();
  }, []);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    // Check if the name is one of the fields that should be integers
    if (
      name === "turnover" ||
      name === "loan_amount" ||
      name === "age_of_business"
    ) {
      // Use parseInt to convert the value to an integer
      parsedValue = parseInt(value); // Base 10
      // Check if the conversion was successful (not NaN)
      if (isNaN(parsedValue)) {
        // Handle the case where parsing fails (e.g., display an error message)
        console.error(`Failed to parse ${name} as an integer`);
        // You can set a default value or handle the error as needed
        parsedValue = 0; // Set a default value, for example
      }
    }

    setLeadData((prevState) => ({ ...prevState, [name]: parsedValue }));
    if (name === "company_location") {
      setLoanDetails((prevState) => ({
        ...prevState,
        location_of_company: parsedValue,
      }));
    } else if (
      name === "age_of_business" ||
      name === "company_type" ||
      name === "industry_type" ||
      name === "turnover" ||
      name === "duration" ||
      name === "individual_or_company" ||
      name === "loan_amount" ||
      name === "loan_type"
    ) {
      setLoanDetails((prevState) => ({
        ...prevState,
        [name]: parsedValue,
      }));
    }
    setIsDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loanDetails);
    // Filter out empty or null values from loanDetails
    const filteredLoanDetails = {};
    for (const key in loanDetails) {
      if (loanDetails[key] !== null && loanDetails[key] !== "") {
        filteredLoanDetails[key] = loanDetails[key];
      }
    }
    console.log(filteredLoanDetails);
    // Find objects in the loan array that match all key-value pairs in filteredLoanDetails
    const matchingLoans = loan.filter((loanItem) => {
      // Check if every key-value pair in filteredLoanDetails exists in loanItem
      return Object.entries(filteredLoanDetails).every(([key, value]) => {
        return loanItem[key] === value;
      });
    });

    // Extract loan_offered_by values from matchingLoans
    const loanOfferedByValues = matchingLoans.map(
      (loanItem) => loanItem.loan_offered_by
    );
    console.log(loanOfferedByValues);
    const updatedForm = { ...leadData, value: leadData.loan_amount, org_id: orgId };
    axios
      .post(ADD_DEAL, updatedForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        if (response.data.status === 0) {
          toast.error(response.data.message, {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.success(
            loanOfferedByValues.length > 0
              ? `Deal created. Banks list: ` + loanOfferedByValues.join(",")
              : "Deal Created",
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
          setLeadData({
            probability: "",
            deal_name: "",
            organization: "",
            mobile: "",
            email: "",
            // value: 0,
            label_id: 36,
            closure_date: null,
            stage_id: 1,
            pipeline_id: 1,
            lead_id: 0,
            age_of_business: null,
            company_type: "",
            industry_type: "",
            turnover: null,
            company_location: "",
            duration: "",
            individual_or_company: "",
            loan_amount: null,
            loan_type: "",
          });
          onClose();
        }
        data();
        // setName("");
        onLeadAdded();
        // navigate("/lp/deals");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const mergedLabels = labelData
    .filter((item) => item?.entity?.includes(text))
    .map((item) => ({
      id: item?.id,
      name: item?.name,
      colour_code: item?.colour_code,
    }));

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div class="create-lead-top">
          <p>Create Deal</p>
          <p className="close-icon" onClick={handleClose}>
            X
          </p>
        </div>
        <div className="create-lead-form">
          <form>
            <section class="form-area">
              <div className="form-section-1">
                <label htmlFor="deal_name" className="lead-label">
                  Title
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <input
                  id="deal_name"
                  type="text"
                  name="deal_name"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.deal_name} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="organization">
                  organization
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="organization"
                  type="text"
                  name="organization"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.organization} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="name">
                  Deal Owner
                </label>
                <input
                  id="name"
                  type="text"
                  className="lead-input"
                  placeholder="Please Enter Name"
                // onChange={handleChangeName}
                // value={name} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="value">
                  Loan Amount
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <div className="currency-section">
                  <input
                    id="loan_amount"
                    type="number"
                    className="currency-input"
                    name="loan_amount"
                    onChange={handleChange}
                    value={leadData.value}
                  />
                  <select name="" id="" className="currency-value">
                    {worldCurrencies.map((currency, index) => (
                      <option key={index} value={currency.code}>
                        {`${currency.code} ${currency.currency}`}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="lead-label" htmlFor="probability">
                  Probability
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="probability"
                  type="text"
                  className="lead-input"
                  name="probability"
                  onChange={handleChange}
                  value={leadData.probability}
                />
                {/* <label className="lead-label" htmlFor="pipeline_id">
                  Pipeline
                </label>
                <select className="lead-input">
                  <option value=""></option>
                  <option value=""></option>
                </select> */}
                <label className="lead-label" htmlFor="closure_date">
                  Expected Closing Date
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="closure_date"
                  type="date"
                  className="lead-input"
                  name="closure_date"
                  onChange={handleChange}
                  value={leadData.closure_date}
                />
                <label className="lead-label" htmlFor="status">
                  Stages
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <select
                  name="stage_id"
                  id="stage_id"
                  className="lead-priority"
                  onChange={handleChange}
                >
                  <option value="">Select Stages</option>
                  {stages?.map((item, index) => {
                    return (
                      <option key={index} value={stageId[index]}>
                        {item}
                      </option>
                    );
                  })}
                </select>

                <label className="lead-label" htmlFor="pipeline_id">
                  Loan Type
                </label>
                <select
                  className="lead-input deal-new-select"
                  name="loan_type"
                  onChange={handleChange}
                >
                  <option value="">Select Loan Type</option>
                  <option value="Home loan">Home loan</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                  <option value="car finance">car finance</option>
                  <option value="business loan">business loan</option>
                  <option value="term loan">term loan</option>
                  <option value="secured loan">secured loan</option>
                </select>

                <div className="deal-bottom-radio">
                  <div className="deal-radio-input">
                    <input
                      type="radio"
                      id="individual"
                      name="individual_or_company"
                      value="Individual"
                      onChange={handleChange}
                    />
                    <label className="deal-label" htmlFor="individual">
                      Individual
                    </label>
                  </div>
                  <div className="deal-radio-input">
                    <input
                      type="radio"
                      id="company"
                      name="individual_or_company"
                      value="Company"
                      onChange={handleChange}
                    />
                    <label className="deal-label" htmlFor="company">
                      Company
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section-2">
                <label className="lead-label" htmlFor="mobile">
                  Phone Number
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <div className="phone-input-section">
                  <input
                    id="mobile"
                    className="phone-input"
                    type="text"
                    name="mobile"
                    onChange={handleChange}
                    value={leadData.mobile}
                  />
                </div>

                <label className="lead-label" htmlFor="email">
                  Email
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="lead-input email-case"
                  onChange={handleChange}
                  value={leadData.email}
                />
                <label className="lead-label" htmlFor="label_id">
                  Lables
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <select
                  name="label_id"
                  id="label_id"
                  className="lead-priority"
                  onChange={handleChange}
                >
                  <option value="">Select Label</option>
                  {mergedLabels.map((item) => {
                    return (
                      <option key={item?.id} value={item?.id}>
                        {item?.name}
                      </option>
                    );
                  })}
                </select>

                <label className="lead-label" htmlFor="pipeline_id">
                  Company Type
                </label>
                <select
                  className="lead-input deal-new-select"
                  name="company_type"
                  onChange={handleChange}
                >
                  <option value="">Select Company Type</option>
                  <option value="Corporation">Corporation</option>
                  <option value="limited company">Limited Company</option>
                  <option value="private limited">Private Limited</option>
                  <option value="public company">Public Company</option>
                  <option value="joint venture">Joint Venture</option>
                  <option value="Sole Proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="LLC">LLC</option>
                </select>

                <label className="lead-label" htmlFor="pipeline_id">
                  Duration
                </label>
                <select
                  className="lead-input deal-new-select"
                  name="duration"
                  onChange={handleChange}
                >
                  <option value="">Select Duration</option>
                  <option value="Short-term">Short term</option>
                  <option value="Medium-term">Medium term</option>
                  <option value="Long-term">Long term</option>
                </select>
                <label className="lead-label" htmlFor="pipeline_id">
                  Location of Company/Individual
                </label>
                <input
                  id="company_location"
                  type="text"
                  className="lead-input email-case"
                  name="company_location"
                  onChange={handleChange}
                />
                <label className="lead-label" htmlFor="age_of_business">
                  Age of Business
                </label>
                <input
                  id="age_of_business"
                  type="number"
                  name="age_of_business"
                  className="lead-input"
                  onChange={handleChange}
                />

                <label className="lead-label" htmlFor="turnover">
                  Turnover
                </label>
                <input
                  id="turnover"
                  type="number"
                  name="turnover"
                  className="lead-input"
                  onChange={handleChange}
                />

                <label className="lead-label" htmlFor="industry_type">
                  Industry Type
                </label>
                <select
                  className="lead-input deal-new-select"
                  name="industry_type"
                  onChange={handleChange}
                >
                  <option value="">Select Industry Type</option>
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
              </div>
            </section>

            <section className="bottom-section font-style">
              <div>
                <button className="cancel-btn" onClick={handleClose}>
                  Cancel
                </button>
              </div>

              <div>
                {/* <button className="add-btn">Create And Add another</button> */}
                <button
                  className={
                    isDisable ? "common-inactive-button" : "create-lead-btn"
                  }
                  onClick={handleSubmit}
                  disabled={isDisable}
                >
                  Create Deal
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateDeal;
