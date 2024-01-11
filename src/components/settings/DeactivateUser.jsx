import React, { useState } from "react";
import LeadIcon from "../../assets/image/lead-icon.svg";
import DealIcon from "../../assets/image/deal-icon.svg";
import Reassign from "./Reassign";

const DeactivateUser = ({
  onClose,
  firstName,
  lastName,
  teamData,
  deactivate,
  id,
  leadIdArray,
  dealIdArray
}) => {
  const [isReassign, setIsReassign] = useState(false);

  const handleReassignOpen = () => {
    setIsReassign(true);
  };
  const handleReassignClose = () => {
    setIsReassign(false);
    onClose();
  };
  return (
    <div className="recycle-popup-wrapper">
      {!isReassign && (
        <div className="recycle-popup-container deactivate-container">
          <div className="recycle-popup-box">
            <p className="common-fonts restore-records">confirm Deactivation</p>
            <p className="common-fonts deactivate-note">
              Are you sure you want to deactivate {firstName} {lastName}?
            </p>
            <div>
              <p className="common-fonts deactivate-own">
                {firstName} {lastName} owns :
              </p>
              <p>
                <img src={LeadIcon} alt="" />{" "}
                <span className="common-fonts deactivate-lead">{leadIdArray.length} lead</span>
              </p>
              <p>
                <img src={DealIcon} alt="" />{" "}
                <span className="common-fonts deactivate-lead">{dealIdArray.length} deals</span>
              </p>
            </div>
          </div>

          <div className="recycle-popup-btn deactivate-btn">
          <div>
              <button className="restore-no common-fonts" onClick={onClose}>
                Cancel
              </button>
              {/* <button
                className="common-delete-button deactivate-delete common-fonts"
                onClick={() => {
                  deactivate(id);
                  onClose();
                }}
              >
                Deactivate
              </button> */}
            </div>
            <div>
              <button
                className="common-save-button common-fonts"
                onClick={handleReassignOpen}
              >
                Reassign
              </button>
            </div>

          </div>
        </div>
      )}

      {isReassign && (
        <Reassign onCloseReassign={handleReassignClose} teamData={teamData} id={id} leadIdArray={leadIdArray} dealIdArray={dealIdArray} deactivate={deactivate} />
      )}
    </div>
  );
};

export default DeactivateUser;
