import React from 'react';
import "../styles/RecycleBin.css";

const ContactDeleteModal = ({ onClose, handleDropdownClick, action}) => {

    const handleDelete = () => {
        handleDropdownClick(action);
        onClose();
    }

    const handleClose = () => {
        onClose(); 
    }
  return (
    <div className="recycle-popup-wrapper">
        
    <div className="recycle-popup-container">
        <div className="recycle-popup-box">
            <p className="common-fonts restore-records">Delete checked record</p>
      <p className="common-fonts selected-records-note">The selected record and their entities will moved to recycle bin.</p>
      <p className="common-fonts restore-questions">Are you sure you want to delete the records?    </p>        
        </div>
     


    <div className="recycle-popup-btn">
        <button className="restore-no common-fonts" onClick={handleClose}>Cancel</button>
        <button className="restore-delete common-fonts" onClick={handleDelete}>Delete</button>
      </div>
</div>
</div>
  )
}

export default ContactDeleteModal