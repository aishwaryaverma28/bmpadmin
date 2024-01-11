import React, { useState } from "react";
import axios from "axios";
import { getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignModal = ({ onClose, userData, text,handleConfirmed, handleDataReceived}) => {
  const decryptedToken = getDecryptedToken();
  const [ownerId, setOwnerId] = useState(1);

  const handleOwnerClick = (id) => {
    console.log(id);
    setOwnerId(id);
    handleDataReceived(id);
  };

  return (
    <div className="recycle-popup-wrapper">
      <div className="recycle-popup-container">
        <div className="recycle-popup-box">
          <p className="common-fonts restore-records">Reassign {text}</p>
          <p className="common-fonts selected-mass-user">Reassign To:</p>
          <select
            name=""
            id=""
            className="common-input mass-update-input"
            onChange={(e) => handleOwnerClick(e.target.value)}
          >
          <option value="">Select Owner</option>
            {userData.slice().reverse().map((item) => (
              <option  key={item?.id} value={item?.id} className="owner-val">
                {`${
                  item?.first_name.charAt(0).toUpperCase() +
                  item?.first_name.slice(1)
                } ${
                  item?.last_name.charAt(0).toUpperCase() +
                  item?.last_name.slice(1)
                }`}
              </option>
            ))}
          </select>
          <div className="recycle-popup-btn mass-update-btn">
            <button className="restore-no common-fonts" onClick={onClose}>
              Cancel
            </button>
            <button
              className="restore-yes common-fonts"
              onClick={handleConfirmed}
            >
              Reassign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
