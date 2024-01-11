import React, { useState }   from 'react'
import '../styles/Import.css';
import ImportTab from './ImportTab.jsx';
import ExportTab from './ExportTab.jsx';



const SettingImpExp = () => {
  const [activeTab, setActiveTab] = useState("import");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
    
  return (
     <div className='ip-exp-container'>
      <p className='common-fonts ip-exp-heading'>Import & Export</p>
      {/* <p className='common-fonts imp-data'>Import data</p> */}
      <div className="genral-setting-btn genral-setting-fonts">
            <button
              className={`genral-btn ${activeTab === "import" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("import")}
            >
              Import
            </button>
            <button
              className={`genral-btn ${activeTab === "export" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("export")}
            >
              Export
            </button>
          </div>
            {
              activeTab === "import" && (
                       <ImportTab/>
          )}
            {
              activeTab === "export" && (
                       <ExportTab/>
          )}

     </div>
  )
}

export default SettingImpExp