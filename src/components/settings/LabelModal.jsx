import React, { useState } from 'react';
import axios from "axios";
import {  ADD_LABEL, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const LabelModal = ({onClose, fetchColor}) => {
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem('org_id');
  const [labelData, setLabelData] = useState({
    name: "",
    colour_code: "",
    org_id: orgId,
  });

  const handleLabelInput = (e) => {
    let labelName =  e.target.value;
    setLabelData((prev) => {
      return { ...prev, name: labelName };
    });
  }

  const handleColor = (event,colorCode)=> {
    const allCircles = document.querySelectorAll('.genral-circle');
    allCircles.forEach((circle) => {
      circle.style.border = 'none';
    });

    // Set border for the selected circle
    const selectedCircle = event.target;
    selectedCircle.style.border = '3px solid #2b74da';
    setLabelData((prev) => {
      return { ...prev, colour_code: colorCode };
    });
  }

  const onSave = () => {
    const updatedFormData = {
      "name":labelData.name,
      "colour_code":labelData.colour_code,
      "org_id": orgId,
    };

    console.log(updatedFormData);

    axios
      .post(ADD_LABEL, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
        toast.success("label added successfully", {
          position: "top-center",
          autoClose: 2000,
        })
      }
            fetchColor();
            onClose();
      })
      .catch((error) => {
        console.log(error);
      });
      

  }
  return (
    <div className="recycle-popup-wrapper">
    <div className="recycle-popup-container">
        <div className="recycle-popup-box">
            <p className="common-fonts restore-records">add new label</p>
       <div>
        <label htmlFor="" className='common-fonts'>Label name  <span className="common-fonts redAlert"> *</span></label>
        <input type="text" className='common-input label-input' onChange={handleLabelInput} />
        </div>    

                <div>
            <p className='common-fonts'>Label color  <span className="common-fonts redAlert"> *</span></p>
            <div className='circle-flex'>
                <div className='genral-circle circle1' onClick={(e) => handleColor(e, "#4164D4")}></div>
                <div className='genral-circle circle2' onClick={(e) => handleColor(e, "#7FD6B6")}></div>
                <div className='genral-circle circle3' onClick={(e) => handleColor(e, "#FAE021")}></div>
                <div className='genral-circle circle4' onClick={(e) => handleColor(e, "#D63033")}></div>
                <div className='genral-circle circle5' onClick={(e) => handleColor(e, "#A0419D")}></div>
                <div className='genral-circle circle6' onClick={(e) => handleColor(e, "#E4E5E5")}></div>
                <div className='genral-circle circle7' onClick={(e) => handleColor(e, "#9A592B")}></div>
                <div className='genral-circle circle8' onClick={(e) => handleColor(e, "#FFAD58")}></div>
                <div className='genral-circle circle9' onClick={(e) => handleColor(e, "#6B6E6F")}></div>
                <div className='genral-circle circle10' onClick={(e) => handleColor(e, "#F88FBE")}></div>
            </div>
        </div>
         
        </div>




    <div className="recycle-popup-btn">
        <button className="restore-no common-fonts" onClick={onClose}>Cancel</button>
        <button className="restore-yes common-fonts" onClick={onSave}>Save</button>
      </div>
</div>

</div>
  )
}

export default LabelModal