import React from 'react';
import { useState } from 'react';
import AllCampaignTable from './AllCampaignTable.jsx';
import ListTable from './ListTable.jsx';


const WhatsappCampaign = () => {
  const [activeTab, setActiveTab] = useState("campaign");



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
    <div className="cp-billings-tabs">
    <button  
    className={`common-fonts ${activeTab === "campaign" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('campaign', '+ Create Campaign')}
    >All Campaign</button>


    <button className={`common-fonts ${activeTab === "list" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('list', "+ Create List")}
    >Campaign List</button>

  </div>
  {
    activeTab === "campaign" && (
      <AllCampaignTable/>
    )
  }
  {
    activeTab === "list" && (
      <ListTable/>
    )
  }
  </>
  )
}

export default WhatsappCampaign
