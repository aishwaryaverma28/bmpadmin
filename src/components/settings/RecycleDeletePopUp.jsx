import React from 'react';
import "../styles/RecycleBin.css";

const RecycleDeletePopUp = ({ onClose, onDeleteConfirmed }) => {
  return (
    <div className="recycle-popup-wrapper">
        
    <div className="recycle-popup-container">
        <div className="recycle-popup-box">
            <p className="common-fonts restore-records">Delete checked record</p>
      <p className="common-fonts selected-records-note">The selected record and their entities will get permanently deleted.</p>
      <p className="common-fonts restore-questions">Are you sure you want to permanently delete the records?    </p>        
        </div>
     


    <div className="recycle-popup-btn">
        <button className="restore-no common-fonts" onClick={onClose}>Cancel</button>
        <button className="restore-delete common-fonts" onClick={onDeleteConfirmed}>Delete</button>
      </div>
</div>
</div>
  )
}

export default RecycleDeletePopUp