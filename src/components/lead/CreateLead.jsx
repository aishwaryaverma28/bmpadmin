import React, { useEffect, useState, useRef } from "react";
import "../styles/CreateLead.css";
import axios from "axios";
import { ADD_LEAD, getDecryptedToken, GET_ALL_STAGE, GET_LABEL } from "../utils/Constants";
import { countryPhoneCodes, worldCurrencies } from "../utils/CodeCurrency";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateLead = ({ isOpen, onClose, onLeadAdded, pplname, text, contact }) => {
  const orgId = localStorage.getItem('org_id');
  const [name, setName] = useState("");
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const decryptedToken = getDecryptedToken();
  const [isDisable, setIsDisable] = useState(true);
  const [stages, setStages] = useState([]);
  const [stageId, setStageId] = useState([]);
  const [selectedStageName, setSelectedStageName] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState([]);
  const [adressInput, setAddressInput] = useState("");
  const [labelData, setLabelData] = useState([]);
  const [leadData, setLeadData] = useState({
    position: "",
    lead_name: "",
    company_name: "",
    registration_no: "",
    employees: "",
    type: "",
    phone: "",
    email: null,
    value: 0,
    label_id: 0,
    source: "",
    stage_id: 1,
    pin: "",
    address1: "",
    address2: "",
    org_id: orgId
  });

  const resetForm = () => {
    setLeadData({
      position: "",
      lead_name: "",
      company_name: "",
      registration_no: "",
      employees: "",
      type: "",
      phone: "",
      email: null,
      value: 0,
      label_id: 0,
      source: "",
      stage_id: 1,
      pin: "",
      address1: "",
      address2: "",
      org_id: orgId
    });
    setName("");
    setfName("");
    setlName("");
    setAddressInput("");
  };
  const searchResultRef = useRef(null);
  const data = () => {
    setLeadData({
      company_name: contact?.name,
      type: contact?.industry,
      phone: contact?.phone,
      email: contact?.email,
      pin: contact?.postcode,
      address1: contact?.address1,
      address2: contact?.address2,
    });
  }
  useEffect(() => {
    if (contact) {
      data();
    }
  }, [contact]);
  const nameUpdate = () => {
    setName(pplname.name);
    if (pplname.name.length >= 1) {
      setfName(pplname.name[0]);
      setlName(pplname.name[pplname.name.length - 1]);
    }
  }
  useEffect(() => {
    if (pplname) {
      nameUpdate();
    }
  }, [pplname]);


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

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleAddressChange = (e) => {
    const { name, value } = e?.target;
    setAddressInput(e?.target?.value);
    setLeadData((prevState) => ({ ...prevState, [name]: value }));
    setIsDisable(false);

  };

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


  const mergedLabels = labelData
    .filter((item) => item?.entity?.includes(text))
    .map((item) => ({
      id: item?.id,
      name: item?.name,
      colour_code: item?.colour_code,
    }));


  const handleAdressClick = (address) => {
    setAddressInput(address);
    setLeadData((prevState) => ({ ...prevState, "address1": address }));
    setShowSearchResult(false);
  };




  const fetchStages = () => {
    const body = {
      org_id: orgId
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

        if (stageNames && stageNames.length > 0) {
          setStages(stageNames.reverse());
          setStageId(stageIdArray.reverse());
        }

      })
      .catch((error) => {
        console.log(error);
        toast.error("error in fetch Stages", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  useEffect(() => {
    fetchStages();
    fetchLabelData();
  }, []);

  if (!isOpen) {
    return null;
  }

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

  function handleChangeName(event) {
    setIsDisable(false);
    const empName = event.target.value;
    setName(empName);
    let arr = empName.split(" ");
    if (arr.length >= 1) {
      setfName(arr[0]);
      setlName(arr[arr.length - 1]);
    }
  }

  const handleChange = (e) => {
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

    setLeadData((prevState) => ({ ...prevState, [name]: value }));
    setIsDisable(false);
    if (name === "pin" && value?.length > 1 && value?.length <= 4) {
      const regexPattern = new RegExp(
        `^(${inputArray.join("|")}|${inputArray
          .slice(0, 2)
          .join("|")})\\d{1}[A-Za-z0-9]*$`
      );

      if (regexPattern.test(value?.toUpperCase())) {
        setShowSearchResult(value?.length > 1);
        postcode(value);
      }
    } else {
      setAddress([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...leadData,
      first_name: fname,
      last_name: lname,
      status: "New",
      org_id: orgId
    };

    axios
      .post(ADD_LEAD, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 0) {
          toast.error(
            "Please check all fields",
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        } else {
          toast.success("Lead data added successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          setLeadData({
            position: "",
            lead_name: "",
            company_name: "",
            registration_no: "",
            employees: "",
            type: "",
            phone: "",
            email: null,
            value: 0,
            label_id: 0,
            source: "",
            stage_id: 1,
            pin: "",
            address1: "",
            address2: "",
            org_id: orgId
          });
          setName("");
          setAddressInput("");
          onLeadAdded();
          onClose();
        }
        data();
        nameUpdate();
        onLeadAdded();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div class="create-lead-top">
          <p>Create Lead</p>
          <p className="close-icon" onClick={handleClose}>
            X
          </p>
        </div>
        <div className="create-lead-form">
          <form>
            <section class="form-area">
              <div className="form-section-1">
                {/* <div>
                  <p className="lead-label2">Lead Image</p>
                  <i className="fa-solid fa-plus"></i>
                </div> */}

                <label htmlFor="lead_name" className="lead-label">
                  Title 
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <input
                  id="lead_name"
                  type="text"
                  name="lead_name"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.lead_name} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="registration_no">
                  Postal Code
                </label>
                <div className="lead-new-fix">
                  <input
                    id="pin"
                    type="text"
                    name="pin"
                    className="lead-input lead-pin-input"
                    onChange={handleChange}
                    autoComplete="off"
                    value={leadData?.pin}
                  />
                  {showSearchResult && address?.length > 1 && (
                    <div className="search_result company-address-result lead-address-result" ref={searchResultRef}>
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


                <label className="lead-label" htmlFor="">
                  Address 1
                </label>
                <input
                  id="address1"
                  type="text"
                  name="address1"
                  className="lead-input"
                  onChange={handleAddressChange}
                  value={adressInput} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="company_name">
                  organization
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="company_name"
                  type="text"
                  name="company_name"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.company_name} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="name">
                  Lead Owner
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="lead-input"
                  placeholder="Please Enter Name"
                  onChange={handleChangeName}
                  value={name} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="position">
                  Position
                </label>
                <input
                  id="position"
                  type="text"
                  className="lead-input"
                  name="position"
                  onChange={handleChange}
                  value={leadData.position} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="source">
                  Lead source
                </label>
                <input
                  id="source"
                  type="text"
                  className="lead-input"
                  name="source"
                  onChange={handleChange}
                  value={leadData.source} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="value">
                  Value
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <div className="currency-section">
                  <input
                    id="value"
                    type="text"
                    className="currency-input"
                    name="value"
                    onChange={handleChange}
                    value={leadData.value} // Add value prop for controlled input
                  />
                  <select name="" id="" className="currency-value">
                    {worldCurrencies?.map((currency, index) => (
                      <option key={index} value={currency.code}>
                        {`${currency.code} ${currency.currency}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section-2">
                <label className="lead-label" htmlFor="phone">
                  Phone Number
                </label>
                <div className="phone-input-section">
                  {/* <select name="" id="" class="country-code">
                    {countryPhoneCodes.map((countryPhoneCode) => (
                      <option
                        key={countryPhoneCode.code}
                        value={countryPhoneCode.code}
                      >
                        {`${countryPhoneCode.code} ${countryPhoneCode.country}`}
                      </option>
                    ))}
                  </select> */}
                  <input
                    id="phone"
                    className="phone-input"
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    value={leadData.phone} // Add value prop for controlled input
                  />
                </div>

                <label className="lead-label" htmlFor="email">
                  Email
                  {/* <span className="common-fonts redAlert"> *</span>/ */}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="lead-input email-case"
                  onChange={handleChange}
                  value={leadData.email} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="">
                  Address 2
                </label>
                <input
                  id="address2"
                  type="text"
                  name="address2"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.address2} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="employees">
                  Employees
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="employees"
                  type="text"
                  name="employees"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.employees} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="registration_no">
                  Registration No
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  id="registration_no"
                  type="text"
                  name="registration_no"
                  className="lead-input"
                  onChange={handleChange}
                  value={leadData.registration_no} // Add value prop for controlled input
                />
                <label className="lead-label" htmlFor="">
                  Contact Person
                </label>
                <input
                  id=""
                  type="text"
                  name=""
                  className="lead-input"
                // onChange={handleChange}
                />
                <label className="lead-label" htmlFor="label_id">
                  Lables
                </label>
                <select
                  name="label_id"
                  id="label_id"
                  className="lead-priority"
                  onChange={handleChange}
                >
                  <option value="">Select Label</option>
                  {mergedLabels?.map((item) => {
                    return (
                      <option key={item?.id} value={item?.id}>
                        {item?.name}
                      </option>
                    );
                  })}
                </select>
                <label className="lead-label" htmlFor="label_id">
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
                  Create Lead
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

export default CreateLead;
