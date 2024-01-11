import React, { useState } from "react";


const CreateModal = ({onClose}) => {


  return (
    <div className="recycle-popup-wrapper">
      <div className="mrkt-modal">
        <div className="mrkt-modal-flex">
            <p className="common-fonts mrkt-modal-listname">Add List Name</p>
            <p className="mrkt-close"  onClick={onClose}>X</p>
        </div>

        <div>
            <input type="text" className="common-fonts common-input mrkt-modal-input" placeholder="Enter Name" />
        </div>
        <div className="mrkt-modal-bottom-btn">
            <button className="common-fonts common-white-button"  onClick={onClose}>Cancel</button>
            <button className="common-fonts common-save-button">Save</button>
        </div>
       
      </div>
     
    </div>
  );
};

export default CreateModal;
