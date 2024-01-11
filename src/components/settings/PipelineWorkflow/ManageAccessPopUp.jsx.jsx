import React from "react";
import { useState } from "react";
import User from '../../../assets/image/user-icon.svg';

const ManageAccessPopUp = ({ onClose }) => {

  const [activeTab, setActiveTab] = useState("team");
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div class="create-lead-top">
          <p>Assign users and team</p>
          <p className="close-icon" onClick={onClose}>
            X
          </p>
        </div>
        <div className="manage-content">
          <p className="common-fonts manage-note">
            Assign users & teams This only restricts users access to the
            pipeline, not the records in the pipeline{" "}
          </p>
          <div className="manage-radio-section">
          <div className="manage-input">
          <input type="radio" id="manage-radio" name="manage-radio" value="" />
          <label htmlFor="manage-radio" className="common-fonts manage-radio-label">Private to me</label>
          </div>
          <div className="manage-input">
          <input type="radio" id="manage-radio2" name="manage-radio" value="" />
          <label htmlFor="manage-radio2" className="common-fonts manage-radio-label">Available to everyone</label>
          </div>
          <div className="manage-input">
          <input type="radio" id="manage-radio3" name="manage-radio" value="" />
          <label htmlFor="manage-radio3" className="common-fonts manage-radio-label">Select users and teams who can edit</label>
          </div> 
          </div>
        </div>
        <div className="genral-setting-btn genral-setting-fonts">
            <button
              className={`genral-btn ${activeTab === "team" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("team")}
            >
              Team
            </button>
            <button
              className={`genral-btn ${activeTab === "user" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("user")}
            >
              User
            </button>
          </div>

          {
        activeTab === "team" && (
           <>
            <div className="manage-check-team">
              <div className="manage-team-flex">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="cb1"
                  name="headerCheckBox"
                />
                <span className="checkmark"></span>
              </label>
              <div className="manage-icon-round">
                                <img src={User} alt="" />
                              </div>
              <p className="common-fonts manage-name">Team 1</p>
              </div>
              <div className="manage-team-flex">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="cb1"
                  name="headerCheckBox"
                />
                <span className="checkmark"></span>
              </label>
              <div className="manage-icon-round">
                                <img src={User} alt="" />
                              </div>
              <p className="common-fonts manage-name">Anant Team</p>


              </div>
              <div className="manage-btn">
              <div className="manage-btn-box">
              <button className="common-delete-button">Cancel</button>
                <button className="common-save-button ">Save</button>
              </div>
             
              </div>
            </div>
           </>
        )
       }
       {
        activeTab === "user" && (
          <>
            <div className="manage-check-team">
              <div className="manage-team-flex">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="cb1"
                  name="headerCheckBox"
                />
                <span className="checkmark"></span>
              </label>
              <div className="manage-icon-round">
                                <img src={User} alt="" />
                              </div>
              <p className="common-fonts manage-name">anant singh chauhan <span>(anantsingh123@gmail.com)</span></p>
              </div>
              <div className="manage-team-flex">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="cb1"
                  name="headerCheckBox"
                />
                <span className="checkmark"></span>
              </label>
              <div className="manage-icon-round">
                                <img src={User} alt="" />
                              </div>
              <p className="common-fonts manage-name">ameesha kapoor <span>(ameeshk123@gmail.com)</span></p>


              </div>
              <div className="manage-btn">
              <div className="manage-btn-box">
              <button className="common-delete-button">Cancel</button>
                <button className="common-save-button ">Save</button>
              </div>
             
              </div>
            </div>
           </>
        )
       }
      </div>
    </div>
  );
};

export default ManageAccessPopUp;
