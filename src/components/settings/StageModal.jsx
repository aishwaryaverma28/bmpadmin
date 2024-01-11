import React from "react";
import axios from "axios";
import {
  getDecryptedToken,
  ADD_FIELDS,
  handleLogout,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const StageModal = ({ onClose, type, fields, fetchFields }) => {
  const decryptedToken = getDecryptedToken();


  const [form, setForm] = useState({
    oldFieldName: "",
    newFieldName: "",
    tableName: type,
    isActive: 0,
  });

  const handleAddField = () => {
    const updatedFormData = {
      ...form,
      oldFieldName: form.oldFieldName,
      newFieldName: form.newFieldName,
      tableName: type,
      isActive: 0,
    };
    axios
      .post(ADD_FIELDS, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if(response.data.status===1){
          toast.success("Field added successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        }else{
          toast.error("Failed to create field. Please check all required fields", {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setForm({
          oldFieldName: "",
          newFieldName: "",
          tableName: type,
          isActive: 0,
        });
        fetchFields();
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
    // setStateBtn(1);
  }

  return (
    <div className="recycle-popup-wrapper">
      <div className="recycle-popup-container">
        <div className="recycle-popup-box">
          <p className="common-fonts restore-records">Add Field</p>

          <div>
          {
            fields.length===5 && (
              <p className="common-fonts fields-msg">You can add maximum 5 fields only.To add new field please select from dropdowm which field to replace</p>
            )
          }
            <label htmlFor="" className="common-fonts" ds-stage-label>
             New Field Name <span className="common-fonts redAlert"> *</span> (required)
            </label>
            <input
              type="text"
              name="newFieldName"
              onChange={handleChange}
              className="common-fonts common-input ds-stage-input"
            />

            {
              fields.length===5 && (
                <>
                  
            <label htmlFor="" className="common-fonts ds-stage-label">
              Select Field to replace <span className="common-fonts redAlert"> *</span>(required)
            </label>
            <select name="oldFieldName" onChange={handleChange} id="" className="fields-select ds-setup-select">
            <option value="">Select Field</option>
              {fields.map((field) => (
                <option key={field.id} value={field.field_name}>
                  {field.field_name}
                </option>
              ))}
            </select>
                </>

              )
            }


          </div>
        </div>

        <div className="recycle-popup-btn">
          <button className="restore-no common-fonts" onClick={onClose}>
            Cancel
          </button>
          <button className="restore-yes common-fonts" onClick={handleAddField}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageModal;
