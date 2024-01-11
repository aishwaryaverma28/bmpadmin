import React, { useEffect, useState, useRef } from "react";
import DealRecipient from "./DealRecipient.jsx";

const DealDocPreview = ({ onClose , fileView, dealId, token, doc }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [recipient, setRecipient] = useState(false);

  useEffect(() => {
    if (fileView) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(fileView);
    }
  }, [fileView]);

  const handleRecipients = () => {
    setRecipient(true)
  }
  const handleRecipientsClose = () => {
    setRecipient(false);
  }
  return (
    <>
      <div className="help-modal-container">
           <div className="help-modal-box">
              <div className="doc-preview-top">
                <div className="doc-preview-number">
                  <p className="common-fonts doc-preview-one">1</p>
                </div>

                <div className="doc-preview-para">
                  <p className="common-fonts doc-preview-heading">Document Preview</p>
                </div>
              </div>
              <div className="doc-preview-sample">
                <button className="common-white-green-button common-fonts">docusign sample file <i class="fa fa-pencil preview-pen"></i></button>
              </div>

              <div className="doc-preview-img">
                <img src={imageSrc} alt="" />
              </div>

              <div className="preview-btn">
                <button className="common-fonts common-white-button">Cancle</button>
                <button className="common-fonts common-save-button" onClick={handleRecipients}>Next</button>
              </div>
           </div>
        <div className="help-cross" onClick={onClose}>
          X
        </div>
      </div>
      {
        recipient && (
         <DealRecipient onClose={handleRecipientsClose} onClosePrevious={onClose} dealId={dealId} token={token} doc={doc}/>
        )
      }
    </>
  );
};

export default DealDocPreview;
