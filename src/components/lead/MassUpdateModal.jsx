import React, { useState } from "react";
import axios from "axios";
import { UPDATE_LEAD,getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MassUpdateModal = ({ onClose, userData, text, ids, handleDataReceived, fetchLeadsData }) => {
  const decryptedToken = getDecryptedToken();
  const [ownerId, setOwnerId] = useState(1);

  const handleOwnerClick = (id) => {
    setOwnerId(id);
    handleDataReceived(id);
  };

  const handleConfirmed = () => {
    if (text === "Lead") {
      const body = {
        leadIds: ids, // Use the stored ID
        owner: ownerId,
      };
      console.log(body);
      axios
        .put(UPDATE_LEAD, body, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        })
        .then((response) => {
          console.log(response);
          if (response?.data?.status === 1) {
            toast.success("Lead tranfered successfully", {
              position: "top-center",
              autoClose: 2000,
            });
            fetchLeadsData()
          }
          onClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (text === "Deal") {
      const body = {
        dealId: ids, // Use the stored ID
        owner: parseInt(ownerId),
      };
      console.log(body);
      axios
        .put("http://core.leadplaner.com:3001/api/deal/edit", body, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        })
        .then((response) => {
          console.log(response);
          if (response?.data?.status === 1) {
            toast.success("Deal tranfered successfully", {
              position: "top-center",
              autoClose: 2000,
            });
            fetchLeadsData()
          }
          onClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
            {userData.map((item) => (
              <option key={item?.id} value={item?.id} className="owner-val">
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

export default MassUpdateModal;
