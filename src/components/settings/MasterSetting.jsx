import React,  { useState } from 'react';
import '../styles/CPGenral.css';
import CurrencyTab from './CurrencyTab';
import LabelsTab from './LabelsTab';

const MasterSetting = () => {

    const [activeTab, setActiveTab] = useState('currency');

    function handleTabChange(tabName){
      setActiveTab(tabName)
    }
  return (
    
    <section>
        <div className="cp-billings-tabs">
    <button  
    className={`common-fonts ${activeTab === "currency" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('currency')}
    >Currency</button>


    <button className={`common-fonts ${activeTab === "labels" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('labels')}
    >Labels</button>
    </div>

    
  {activeTab === "currency" && 
    (
        <CurrencyTab/>
    )
  
         }
  {activeTab === "labels" && 
      (
        <LabelsTab/>
      )
  
         }

    </section>
  )
}

export default MasterSetting