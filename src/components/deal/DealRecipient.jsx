import React, { useState} from "react";
import trash from "../../assets/image/TrashFill.svg";
import axios from "axios";
import {
  SEND_ENVELOPE,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const DealRecipient = ({ onClose, dealId, token, doc }) => {
  const [recipients, setRecipients] = useState([
    {
      recipientId: 1,
      name: "",
      email: "",
    },
  ]);

  const addRecipient = () => {
    if (recipients.length < 10) {
      const newRecipient = {
        recipientId: recipients.length + 1,
        name: "",
        email: "",
      };
      setRecipients([...recipients, newRecipient]);
    }
  };

  const removeRecipient = (index) => {
    const updatedRecipients = [...recipients];
    updatedRecipients.splice(index, 1);
    setRecipients(updatedRecipients);
  };

  // function handleSubmit (event){
  //   event.preventDefault();
  //   const updatedFormData = {
  //       dealId: parseInt(dealId),
  //       recipatant: recipients,
  //       bearerToken: token,
  //       DocBase64: doc
  //   }
  //   axios.post(SEND_ENVELOPE, updatedFormData).then((response) => {
  //     console.log(response);
  //     }).catch((error) => {
  //     console.log(error);
  //   })
  // }

  function handleSubmit(event) {
    event.preventDefault();
    let idCounter = 1; 
  
    // Create an array to store recipient objects with name and email
    const recipientData = recipients.map((recipient) => {
      const recipientId = idCounter++;
      return {
        name: recipient.name,
        email: recipient.email,
        recipientId:recipientId.toString()
      };
    });
  
    const updatedFormData = {
      dealId: parseInt(dealId),
      recipatant: [...recipientData], 
      bearerToken: token,
      DocBase64: doc,
    };

    axios
      .post(SEND_ENVELOPE, updatedFormData)
      .then((response) => {
        console.log(response);
        console.log("hello")
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleNameChange = (index, event) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].name = event.target.value;
    setRecipients(updatedRecipients);
  };

  // Function to handle email input change
  const handleEmailChange = (index, event) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].email = event.target.value;
    setRecipients(updatedRecipients);
  };
  

  return (
    <>
      <div className="help-modal-container">
        <div className="help-modal-box recipient-modal-box">
          <div className="doc-preview-top">
            <div className="doc-preview-number">
              <p className="common-fonts doc-preview-one">2</p>
            </div>

            <div className="doc-preview-para">
              <p className="common-fonts doc-preview-heading">Add Recipients</p>
            </div>
          </div>

          <div>
            <div className="recipient-top">
              {/* <label className="custom-checkbox">
                <input type="checkbox" className="cb1" name="headerCheckBox" />
                <span className="checkmark"></span>
              </label>
              <p className="common-fonts signing-order">Set Signing Order</p> */}
            </div>

            {recipients.map((recipient, index) => (
              <div className="recipient-start" key={recipient.recipientId}>
                <div className="recipient-input-flex">
                  <label htmlFor="" className="common-fonts recipient-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="common-fonts common-input recipient-input"
                    value={recipient.name}
                  onChange={(event) => handleNameChange(index, event)}
                  />
                </div>
                <div className="recipient-input-flex">
                  <label htmlFor="" className="common-fonts recipient-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="common-fonts common-input recipient-input email-recipient-input"
                    value={recipient.email}
                  onChange={(event) => handleEmailChange(index, event)}
                  />
                </div>

                <div className="recipient-input-flex">
                  <div className="recipient-trash">
                    <img
                      src={trash}
                      alt=""
                      onClick={() => removeRecipient(index)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="count-add-recipients">
              <p className="common-fonts add-recipients" onClick={addRecipient}>
                + Add recipients
              </p>
              <p className="common-fonts count-recipients">
                {recipients.length}/10 recipients
              </p>
            </div>

            <div className="recipient-bottom-btn">
              <button className="common-fonts recipient-save common-save-button" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
        <div
          className="help-cross recipient-cross"
          onClick={() => {
            onClose();
          }}
        >
          X
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default DealRecipient;
