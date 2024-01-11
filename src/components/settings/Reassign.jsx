import React from "react";
import axios from "axios";
import {
  getDecryptedToken,
  UPDATE_LEAD,
  UPDATE_DEAL,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Reassign = ({
  onCloseReassign,
  teamData,
  id,
  dealIdArray,
  leadIdArray,
  deactivate,
}) => {
  const decryptedToken = getDecryptedToken();
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const filteredTeamData = teamData.filter((member) => member.id !== id);

  const handleRadioChange = (event) => {
    setSelectedOwnerId(event.target.value);
  };

  const handleConfirmed = () => {
    if (leadIdArray.length > 0) {
      const body = {
        leadIds: leadIdArray, // Use the stored ID
        owner: selectedOwnerId,
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
            toast.success("Lead reassign Successfully", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (dealIdArray.length > 0) {
      const body = {
        dealId: dealIdArray,
        owner: selectedOwnerId,
      };

      axios
        .put(UPDATE_DEAL, body, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        })
        .then((response) => {
          console.log(response);
          if (response?.data?.status === 1) {
            toast.success("Deal reassign Successfully", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };
  return (
    <div className="recycle-popup-wrapper">
    <div className="reassign-wrapper">
      <div className="recycle-popup-container reassign-container">
        <div className="recycle-popup-box">
          <p className="common-fonts restore-records">reassign data</p>
          <p className="common-fonts deactivate-note">List of users :</p>
        </div>

        <div className="reassign-members">
          {filteredTeamData.map((members) => {
            return (
              <div className="reassign-label common-fonts">
                <label className="common-fonts">
                  <input
                    type="radio"
                    name="owner"
                    value={members.id}
                    onChange={handleRadioChange}
                    className="reassign-radio"
                  />
                  {members.first_name} {members.last_name}
                </label>
              </div>
            );
          })}

          <ToastContainer />
        </div>


      </div>
      <div className="recycle-popup-btn reassign-popup-btn">
          <button className="restore-no common-fonts" onClick={onCloseReassign}>
            Cancel
          </button>
          <button
            className="common-save-button reassign-save common-fonts"
            onClick={() => {
              handleConfirmed();
              deactivate(id);
              onCloseReassign();
            }}
          >
            Reassign
          </button>
        </div>
    </div>
    </div>
  );
};

export default Reassign;
