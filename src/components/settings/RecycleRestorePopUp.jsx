import React from 'react'

const RecycleRestorePopUp = ({onClose,onRestoreConfirmed}) => {
  return (
    <div className="recycle-popup-wrapper">
        
    <div className="recycle-popup-container">
        <div className="recycle-popup-box">
            <p className="common-fonts restore-records">Restore checked records</p>
      <p className="common-fonts selected-records-note">The selected record and their entities will get restored.</p>
      <p className="common-fonts restore-questions">Are you sure you want to permanently restore the record?  </p>        
        </div>
     


    <div className="recycle-popup-btn">
        <button className="restore-no common-fonts" onClick={onClose}>No</button>
        <button className="restore-yes common-fonts" onClick={onRestoreConfirmed}>Yes</button>
      </div>
</div>
</div>
  )
}

export default RecycleRestorePopUp