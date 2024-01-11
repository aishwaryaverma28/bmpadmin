import React, { useState} from "react";
import axios from "axios";
import {
  ADD_DOCUMENT,
  getDecryptedToken,
} from "./utils/Constants";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecycleRestorePopUp = ({onClose, docsData, type}) => {
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem('org_id');
  const [doc, setDoc] = useState("");
  function handleNameChange(event) {
    setDoc(event.target.value)
  }

  const addFeild = (e) => {
    e.preventDefault();
    const updatedFormData = 
    {
      document_name: doc,
      source_type: type,
      is_required: 1,
      is_deleted: 0,
      org_id: orgId,
  }
    axios
      .post(ADD_DOCUMENT, updatedFormData , {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Document field added successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setDoc("");
        docsData();
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="recycle-popup-wrapper">        
    <div className="recycle-popup-container">
        <div className="recycle-popup-box">
            <p className="common-fonts restore-records">Add Documents <span className="common-fonts redAlert"> *</span></p>
               <input type="text" className='common-fonts common-input add-component-input'  name="document_name"
                id="document_name"
                placeholder="Please Document Name"
                onChange={handleNameChange}/>      
        </div>
    <div className="recycle-popup-btn">
        <button className="restore-no common-fonts" onClick={onClose}>Cancel</button>
        <button className="restore-yes common-fonts" onClick={addFeild}>Add</button>
      </div>
</div>
</div>
  )
}

export default RecycleRestorePopUp