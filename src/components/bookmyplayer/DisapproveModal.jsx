import React from 'react';
import "../styles/RecycleBin.css";

const DisapproveModal = ({ onClose, onEnter, disapprovalReason, setDisapprovalReason }) => {
  const handleTextAreaChange = (event) => {
    setDisapprovalReason(event.target.value);
  }

  return (
    <div className="recycle-popup-wrapper">
      <div className="recycle-popup-container">
        <div className="recycle-popup-box">
          <p className="common-fonts restore-records">Disapprove Modal</p>
          <p className="common-fonts reason_for">Reason for disapproval?</p>

          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            className='disapproval_input'
            placeholder='Enter your reason'
            value={disapprovalReason}
            onChange={handleTextAreaChange}
          ></textarea>

        </div>

        <div className="recycle-popup-btn">
          <button className="restore-no common-fonts" onClick={onClose}>Cancel</button>
          <button className="common-save-button disapprove_new common-fonts" onClick={onEnter}>Enter</button>
        </div>
      </div>
    </div>
  );
}

export default DisapproveModal;
