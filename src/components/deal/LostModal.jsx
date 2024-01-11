import React from "react";
import axios from "axios";
import { UPDATE_DEAL, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const RecycleRestorePopUp = ({ onClose, fetchDeal, id }) => {
  const decryptedToken = getDecryptedToken();
  const [description, setDescription] = useState({});
  const [stateBtn, setStateBtn] = useState(0);
  const handleLostStatus = () => {
    const updateForm = {
      dealId: [id],
      stage_id: 35,
      lost_description: description.lost_description,
    };

    axios
      .put(UPDATE_DEAL, updateForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        fetchDeal();
        // alert(response?.data.message);
        if (response.data.status === 1) {
          toast.success(response?.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error(response?.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        }

        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Some Error Occured", {
          position: "top-center",
          autoClose: 2000,
        });
        onClose();
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDescription({
      [name]: value,
    });
    setStateBtn(1);
  };

  return (
    <div className="recycle-popup-wrapper">
      <div className="recycle-popup-container">
        <div className="recycle-popup-box">
          <p className="common-fonts restore-records">Add Lost Reason</p>
          <div className="lost-flex">
            <label htmlFor="" className="common-fonts">
              Lost Reason
            </label>
            <textarea
              name=""
              id=""
              cols="45"
              rows="5"
              name="lost_description"
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <div className="recycle-popup-btn">
          <button className="restore-no common-fonts" onClick={onClose}>
            Cancel
          </button>
          {stateBtn === 0 ? (
            <button disabled className="common-inactive-button lost-save">
              Save
            </button>
          ) : (
            <button
              className="restore-yes common-fonts"
              onClick={handleLostStatus}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecycleRestorePopUp;
