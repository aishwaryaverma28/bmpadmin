import React, { useState, useEffect } from "react";
import "../styles/CPGenral.css";
import axios from "axios";
import {
  USER_INFO,
  GET_ORG_DATA,
  getDecryptedToken,
  handleLogout,
} from "../utils/Constants";

const CPGenral = () => {
  const decryptedToken = getDecryptedToken();
  const [orgId, setOrgId] = useState(null);
  const [company, setCompany] = useState({
    name: "",
    address: "",
    industry: "",
    city: "",
    country: "",
    state: "",
    postcode: "",
  });

  const userInfo = () => {
    axios
      .get(USER_INFO, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const data = response?.data?.data;
        // console.log(data[0]);
        setOrgId(data[0]?.org_id);
        companyData(data[0]?.org_id);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };
  const companyData = (id) => {
    axios
      .get(GET_ORG_DATA + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const data = response?.data?.data;
        console.log(data[0]);
        setCompany({
          name: data[0].name,
          address: data[0].address,
          industry: data[0].industry,
          city: data[0].city,
          country: data[0].country,
          state: data[0].state,
          postcode: data[0].postcode,
        });
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
    userInfo();
  }, []);

  return (
    <section className="cp-genral">
      <form action="">
        <div className="cp-lead">
          <label htmlFor="">company name</label>
          <input
            type="text"
            className="common-input common-fonts cp-input"
            name = "name"
            value={company.name}
            disabled
          />
        </div>

        <div className="cp-lead">
          <label htmlFor="">fiscal year</label>
          <select name="" id="" className="common-input common-fonts cp-input">
            <option value="">january - december </option>
          </select>
        </div>

        <div>
          <p className="common-fonts cp-info">Company Information</p>

          <div className="cp-form-down">
            <div className="cp-lead">
              <label htmlFor="">company name</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                name = "name"
               value={company.name}
               disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">city</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                name = "city"
            value={company.city}
            disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">company domain</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">country</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">Industry</label><input
                type="text"
                className="common-input common-fonts cp-input"
                name="industry"
                value={company.industry}
                disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">state</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                name="state"
                value={company.state}
                disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">company address</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                name="address"
                value={company.address}
                disabled
              />
            </div>
            <div className="cp-lead">
              <label htmlFor="">zip</label>
              <input
                type="text"
                className="common-input common-fonts cp-input"
                name="postcode"
                value={company.postcode}
                disabled
              />
            </div>
          </div>
        </div>

        {/* <div className="cp-bottom">
          <button className="common-white-button">Cancel</button>
          <button className="common-save-button cp-save">Save</button>
        </div> */}
      </form>
    </section>
  );
};

export default CPGenral;
