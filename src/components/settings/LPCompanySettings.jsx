import React, { useEffect } from "react";
import "../styles/CompanySettings.css";
import { useState } from "react";
import CPPasswordPolicy from "./CPPasswordPolicy";
import CPProducts from "./CPProducts";
import CPBillings from "./CPBillings";
import CPGenral from "./CPGenral";
import MasterSetting from "./MasterSetting";
import SupportTab from "./SupportTab";
import AuditTab from "./AuditTab";

const LPCompanySettings = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "general"
  );
  // const [activeTab, setActiveTab] = useState("general");
useEffect(() => {
  const validTabs = ["general", "products", "billings", "master-settings","password-policy", "support", "audit"];
  if (!validTabs.includes(localStorage.getItem("activeTab"))) {
    setActiveTab("general");
    localStorage.setItem("activeTab", "general");
  }
},[])
  function handleTabChange(tabName) {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName); // Store the active tab in localStorage
  }
  return (
    <>
      <section className="cs-container">
        <div>
          <p className="common-fonts cs-heading">company settings</p>
        </div>

        <div className="user-team-setting-btn common-fonts cs-tabs">
          <button
            className={`user-team-btn ${
              activeTab === "general" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("general")}
          >
            General
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "products" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("products")}
          >
            Products
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "billings" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("billings")}
          >
            Billings
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "master-settings" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("master-settings")}
          >
            Master Settings
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "password-policy" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("password-policy")}
          >
            Password Policy
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "support" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("support")}
          >
            Support
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "audit" ? "common-active" : ""
            }`}
            onClick={() => handleTabChange("audit")}
          >
            Audit
          </button>
        </div>

        {activeTab === "general" && (
          <>
            <CPGenral />
          </>
        )}

        {activeTab === "products" && (
          <>
            <CPProducts />
          </>
        )}
        {activeTab === "billings" && (
          <>
            <CPBillings />
          </>
        )}
        {activeTab === "master-settings" && (
          <>
            <MasterSetting />
          </>
        )}
        {activeTab === "password-policy" && (
          <>
            <CPPasswordPolicy />
          </>
        )}
        {activeTab === "support" && (
          <>
            <SupportTab />
          </>
        )}
        {activeTab === "audit" && (
          <>
            <AuditTab/>
          </>
        )}
      </section>
    </>
  );
};

export default LPCompanySettings;
