import React, { useState } from 'react';
import Academies from './Academies.jsx';


const BmpAdmin = () => {
  const [activeTab, setActiveTab] = useState("academies");

  const handleTabClick = (tab) =>{
    setActiveTab(tab)
  }


  return (

    <div>
    <div className="genral-setting-btn genral-setting-fonts aaa">
      <button
        className={`genral-btn  ${
          activeTab === "academies" ? "genral-active" : ""
        }`}
        onClick={() => handleTabClick("academies")}
      >
        <span className="mrkt-whatsapp">Academies</span>
      </button>

      <button
        className={`genral-btn contact-genral-btn ${
          activeTab === "players" ? "genral-active" : ""
        }`}
        onClick={() => handleTabClick("players")}
      >
        <span className="mrkt-whatsapp">Players</span>
      </button>
            
      <button
        className={`genral-btn contact-genral-btn ${
          activeTab === "coaches" ? "genral-active" : ""
        }`}
        onClick={() => handleTabClick("coaches")}
      >
        <span className="mrkt-whatsapp">Coaches</span>
      </button>
            
      <button
        className={`genral-btn contact-genral-btn ${
          activeTab === "club" ? "genral-active" : ""
        }`}
        onClick={() => handleTabClick("club")}
      >
        <span className="mrkt-whatsapp">Clubs</span>
      </button>

            
      <button
        className={`genral-btn contact-genral-btn ${
          activeTab === "league" ? "genral-active" : ""
        }`}
        onClick={() => handleTabClick("league")}
      >
        <span className="mrkt-whatsapp">Leagues</span>
      </button>
    </div>


      {
        activeTab === "academies"  && (
         <Academies/>
        )

      }



    </div>

  )
}

export default BmpAdmin