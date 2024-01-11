import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getDecryptedToken, ADD_COMPANY } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyModal = ({ onClose, fetchCompany }) => {
  const decryptedToken = getDecryptedToken();
  const orgNewId = localStorage.getItem("org_id");
  const [company, setCompany] = useState({
    name: "",
    // orgid: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    postcode: "",
    email: "",
    phone: "",
    valuation: 0,
    valuation_in: "",
    domain: "",
    industry: "",
    org_id:orgNewId
  });
  const [stateBtn, setStateBtn] = useState(0);
  const [address, setAddress] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adressInput, setAddressInput] = useState("");
  const searchResultRef = useRef(null);

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

    setCompany((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);
    if (name === "postcode" && value?.length > 1 && value?.length <= 4) {
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInput(e.target.value);
    setCompany((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);
  };

  const handleAdressClick = (address) => {
    setAddressInput(address);
    setCompany((prevState) => ({ ...prevState, "address1": address }));
    setShowSearchResult(false);
  };

  const resetForm = () => {
    setCompany({
      name: "",
      // orgid: "",
      address1: "",
      address2: "",
      city: "",
      country: "",
      postcode: "",
      email: "",
      phone: "",
      valuation: 0,
      valuation_in: "",
      domain: "",
      industry: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(ADD_COMPANY, company, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Company is added successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          fetchCompany();
          onClose();
        } else {
          toast.error(response.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setCompany({
          name: "",
          // orgid: "",
          address1: "",
          address2: "",
          city: "",
          country: "",
          postcode: "",
          email: "",
          phone: "",
          valuation: 0,
          valuation_in: "",
          domain: "",
          industry: "",
        });
        setStateBtn(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error("some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

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

  return (
    <div className="popup-wrapper">
      <div className="product-popup-container">
        <div className="product-popup-box">
          <p className="common-fonts add-product-heading">Add Company</p>
          <div className="product-popup-content">
            <form action="">
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Company Name
                  <span className="common-fonts redAlert"> *</span>
                </label>
                <input
                  type="text"
                  className="common-input"
                  name="name"
                  onChange={handleChange}
                  value={company.name}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Company Domain
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  className="common-input"
                  name="domain"
                  onChange={handleChange}
                  value={company.domain}
                />
              </div>
              {/* <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                 Company Owner
                </label>
                <select name="" id="" className="common-select">
                    <option value="">Select Owner</option>
                </select>
              </div> */}
              <div className="product-popup-fields">
                {/* <label htmlFor="" className="common-fonts">
                  Organization Id
                </label>
                <input
                  type="text"
                  className="common-input"
                  name="orgid"
                  onChange={handleChange}
                  value={company.orgid}
                /> */}
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Industry
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <select
                  name="industry"
                  id=""
                  className="common-select"
                  onChange={handleChange}
                  value={company.industry}
                >
                  <option value="">Select Industry</option>
                  <option value="tech">Tech</option>
                  <option value="non-tech">Non-Tech</option>
                </select>
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Value
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <div className="product-two-input">
                  <input
                    type="number"
                    className="common-input product-popup-input"
                    name="valuation"
                    onChange={handleChange}
                    value={company.valuation}
                  />
                  <select
                    name="valuation_in"
                    id=""
                    className="common-input product-popup-select"
                    value={company.valuation_in}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency  
                    {/* <span className="common-fonts redAlert"> *</span> */}
                    </option>
                    {/* <option value="usd">US Dollar (USD)</option> */}
                    <option value="Gbp">GBP</option>
                  </select>
                </div>
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Phone
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="number"
                  name="phone"
                  value={company.phone}
                  onChange={handleChange}
                  className="common-input"
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Email
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={handleChange}
                  className="common-input"
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Postal Code
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  name="postcode"
                  onChange={handleChange}
                  className="common-input postal-input"
                  autoComplete="off"
                />
              </div>
              {showSearchResult && address?.length > 1 && (
                <div className="search_result company-address-result" ref={searchResultRef}>
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
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Address 1
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  className="common-input"
                  onChange={handleAddressChange}
                  name="address1"
                  value={adressInput}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Address 2
                </label>
                <input
                  type="text"
                  name="address2"
                  onChange={handleChange}
                  className="common-input"
                  value={company.address2}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  City
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  className="common-input"
                  onChange={handleChange}
                  value={company.city}
                  name="city"
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Country
                  {/* <span className="common-fonts redAlert"> *</span> */}
                </label>
                <input
                  type="text"
                  className="common-input"
                  onChange={handleChange}
                  value={company.country}
                  name="country"
                />
              </div>
            </form>
            <div className="product-popup-bottom">
              <button className="common-white-button" onClick={handleClose}>
                Cancel
              </button>
              {stateBtn === 0 ? (
                <button className="disabledBtn" disabled>
                  Save
                </button>
              ) : (
                <button
                  className="common-save-button product-popup-save"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="help-cross" onClick={handleClose}>
        X
      </div>
    </div>
  );
};

export default CompanyModal;
