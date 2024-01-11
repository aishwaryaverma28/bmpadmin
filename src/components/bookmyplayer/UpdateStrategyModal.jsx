import React, { useState, useEffect } from "react";
import "../styles/HelpModal.css";
import axios from "axios";
import { UPDATE_ACADEMY, RESTRICTED_KEYWORDS, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateStrategyModal = ({ onClose,fetchData, updateIndex, name, description}) => {
console.log(name);
console.log(description)
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const [stateBtn, setStateBtn] = useState(0);
  const [sName, setSName] = useState(name[updateIndex]);
  const [descrip, setDescrip] = useState(description[updateIndex]);
  const [initialName, setInitialName] = useState(name[updateIndex]);
  const [initialDescrip, setInitialDescrip] = useState(description[updateIndex]);
  const [keywords, setKeywords] = useState(["murder", "kill", "killer", "kill you"]);
  // const getAllKeywords = () => {
  //   axios.get(RESTRICTED_KEYWORDS, {
  //     headers: {
  //       Authorization: `Bearer ${decryptedToken}`,
  //     },
  //   })
  //     .then((response) => {
  //       const newKeywords = response?.data?.data.map(keywordObj => keywordObj.keyword);
  //       setKeywords(newKeywords);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  // useEffect(() => {
  //   getAllKeywords();
  // }, [])

  const handleNameChange = (e) => {
    const newStrategyName = e.target.value;let redText = false;
    let disableSaveButton = false;
    const words = newStrategyName.split(' ');
    let textRestrict = "";
    words.forEach((word) => {
      if (keywords.includes(word?.toLowerCase())) {
        textRestrict = word;
        redText = true;
        disableSaveButton = true;
      }
    });
    if (redText) {
      alert(`Warning: The word "${textRestrict}" is a restricted keyword.`);
      e.target.style.color = 'red';
    } else {
      e.target.style.color = '';
    }
    setStateBtn(disableSaveButton ? 0 : 1);
    setSName(newStrategyName);
  };

  const handleDescChange = (e) => {
    const newStrategyName = e.target.value;
    let redText = false;
    let disableSaveButton = false;
    const words = newStrategyName.split(' ');
    let textRestrict = "";
    words.forEach((word) => {
      if (keywords.includes(word?.toLowerCase())) {
        textRestrict = word;
        redText = true;
        disableSaveButton = true;
      }
    });
    if (redText) {
      alert(`Warning: The word "${textRestrict}" is a restricted keyword.`);
      e.target.style.color = 'red';
    } else {
      e.target.style.color = '';
    }
    setStateBtn(disableSaveButton ? 0 : 1);
    setDescrip(newStrategyName);
  };

  const handleCancel = () => {
    setSName(initialName);
    setDescrip(initialDescrip);
    setStateBtn(0);
  };

  const handleUpdate = () => {
    const updatedNameArray = [...name];
    const updatedDescriptionArray = [...description];
    updatedNameArray[updateIndex] = sName;
    updatedDescriptionArray[updateIndex] = descrip;
    const updatedNameString = updatedNameArray?.reverse()?.join('$@$@$');
    const updatedDescriptionString = updatedDescriptionArray?.reverse()?.join('$@$@$');
    axios
      .put(
        UPDATE_ACADEMY + academyId,
        {
          strategy_name: updatedNameString,
          training_strategy: updatedDescriptionString,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          }
        }
      )
      .then((response) => {
        fetchData();
        onClose();
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  };


  return (
    <>
      <div className="help-modal-container">
        <div className="help-modal-box">
          <section>
            <div className="bmp-add-new-batch">
              <p className="common-fonts bmp-add-heading">Update Strategy</p>
            </div>

            <div className="bmp-modal-form">
              <div className="bmp-add-fields">
                <label htmlFor="" className="common-fonts light-color">
                  Strategy Name
                </label>
                <input
                  type="text"
                  className="common-fonts common-input bmp-modal-input"
                  value={sName}
                  onChange={handleNameChange}
                />
              </div>
              <div className="bmp-add-fields">
                <label htmlFor="" className="common-fonts light-color">
                  Strategy Description
                </label>
                <textarea
                  name=""
                  id=""
                  rows="5"
                  className="common-fonts bmp-strategy-input bmp-modal-input"
                  value={descrip}
                  onChange={handleDescChange}
                ></textarea>
              </div>
            </div>

            <div className="bmp-add-bottom-btn">
              <button className="common-fonts common-white-button" onClick={handleCancel}>
                Cancel
              </button>
              {stateBtn === 0 ? (
                <button className="disabledBtn">Update</button>
              ) : (
                <button
                  className="common-fonts common-save-button"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              )}
            </div>
          </section>
        </div>
        <div className="help-cross" onClick={onClose}>
          X
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateStrategyModal;
