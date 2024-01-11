import React from "react";
import { useState } from "react";
import "../styles/Marketing.css";

import WhatsappCampaign from "./WhatsappCampaign.jsx";

const Campaign = () => {
  const [activeTab, setActiveTab] = useState("whatsapp");

  const handleTabClick = (tab) =>{
    setActiveTab(tab)
  }




  return (
    <div>

      <div className="contacts-top-flex ">
        <div className="genral-setting-btn genral-setting-fonts aaa">
          <button
            className={`genral-btn  ${
              activeTab === "whatsapp" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("whatsapp")}
          >
            <i class="fa-sharp fa-regular fab fa-whatsapp"></i>
            <span className="mrkt-whatsapp"> Whatsapp Campaign</span>
          </button>
          <button
            className={`genral-btn contact-genral-btn ${
              activeTab === "email" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("email")}
          >
            <i class="fa-sharp fa-regular fa-envelope"></i>
            <span className="mrkt-whatsapp"> Email Campaign</span>
          </button>
        </div>


        </div>
        {
        activeTab === "whatsapp"  && (
          <WhatsappCampaign/>
        )
      }
      </div>


  );
};

export default Campaign;
