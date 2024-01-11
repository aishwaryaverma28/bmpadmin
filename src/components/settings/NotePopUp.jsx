import React from 'react';
import "../styles/RecycleBin.css";

const NotePopUp = ({onClose, description}) => {
    const fullNote = description.substring(3, description.length - 4);
 
  return (
    <div class="recycle-popup-wrapper">
        
    <div class="recycle-popup-container">
        <div class="recycle-popup-box">
            <p class="common-fonts restore-records">Notes Description</p>
      <p class="common-fonts selected-records-note">{fullNote}</p>      
        </div>
     


    <div class="recycle-popup-btn">
        <button class="restore-no common-fonts" onClick={onClose}>Close</button>

      </div>
</div>
</div>
  )
}

export default NotePopUp