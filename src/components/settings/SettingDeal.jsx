import React from 'react'
import "../styles/DealUpdate.css";
import { useState } from 'react';
import DealsSetup from './DealsSetup.jsx';
import Pipeline from './PipelineWorkflow/Pipeline.jsx';


const SettingDeal = () => {
  const [activeTab, setActiveTab] = useState("setup");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <section className='ds-container'>
    <p className='common-fonts ds-name'>deal</p>

    <div className="genral-setting-btn genral-setting-fonts">
            <button
              className={`genral-btn ${activeTab === "setup" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("setup")}
            >
              Set Up
            </button>
            <button
              className={`genral-btn ${activeTab === "pipeline" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("pipeline")}
            >
              Pipeline
            </button>
          </div>
       {
        activeTab === "setup" && (
          <DealsSetup type={"deal"}/>
        )
       }
       {
        activeTab === "pipeline" && (
          <Pipeline type={"deal"}/>
        )
       }
      
    </section>
  )
}

export default SettingDeal