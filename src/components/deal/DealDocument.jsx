import React, { useEffect, useState, useRef } from "react";
import Device from "../../assets/image/device.svg";
import Cloud from "../../assets/image/cloud.svg";
// import DealDocPreview from "./DealDocPreview.jsx";
import DealRecipient from "./DealRecipient.jsx";
import axios from "axios";
import {
  ENVELOPE_TOKEN, //get api
  ENVELOPE_DETAILS, //get api with body
  UPDATE_DEAL,
} from "../utils/Constants";

const DealDocument = ({ dealId, email }) => {
  const [actionopen, setActionOpen] = useState(false);
  const [actionopen2, setActionOpen2] = useState(false);
  const [preview, setPreview] = useState(false);
  const actionDropDownRef = useRef(null);
  const actionDropDownRef2 = useRef(null);
  const [envToken, setEnvToken] = useState("");
  const [base64, setBase64] = useState("");
  const [fileView, setFileView] = useState(null);
  const fileInputRef = useRef(null);

  const toggleActionDropdown = () => {
    setActionOpen(!actionopen);
  };
  const toggleActionDropdown2 = () => {
    setActionOpen2(!actionopen2);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        actionDropDownRef.current &&
        !actionDropDownRef.current.contains(event.target)
      ) {
        setActionOpen(false);
      }
    };
    const handleOutsideClick2 = (event) => {
      if (
        actionDropDownRef2.current &&
        !actionDropDownRef2.current.contains(event.target)
      ) {
        setActionOpen2(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleOutsideClick2);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("click", handleOutsideClick2);
    };
  }, []);


  const handlePreviewClose = () => {
    setPreview(false);
  };

  //======================================================DOCUSIGN APIS CODE
  const getEnvelopeToken = () => {
    axios
      .get(ENVELOPE_TOKEN)
      .then((response) => {
        console.log(response?.data?.data?.access_token);
        setEnvToken(response?.data?.data?.access_token);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getEnvelopeToken();
  }, []);

  //   { GET API BODY
  //     "envelopId": "fca53720-11cf-4a30-b15a-8c906ae0a8b7",
  //     "bearerToken": "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAA_CgirPbSAgAgEMTr82z20gCADYV3rL58-xDiLmUHeKwuXAVAAEAAAAYAAEAAAAFAAAADQAkAAAANzYwMTk4ZTktYzIzMS00MmNlLWEyODMtYWFmZWZiMzIxZTUzIgAkAAAANzYwMTk4ZTktYzIzMS00MmNlLWEyODMtYWFmZWZiMzIxZTUzMAAACjVUQ7PbSDcAgkiZkDF9NUmIa0Hhp06GBw.TQcTyE0aVgpRHoUpKFlB7aHKM9DGFhuLWLgWhlkZoZqoYrX9-IVfET2SdTz_JwB0p61-L6hr1NeFQ3D9tCn2lwmZQrkU3aG2xK272JxdWLNpdPwAKvd-92f7kWL9-eCuh5XDJhhiivEaqU6bJ2sNakwPOXVZyCCIQJaSFjSG7uDoh2TvVhI5wezMmNcM7GHnRMdPsqTj6pmid8GG6f7YzpK55PaMPnjeFm-e1K-KkYYz81BSi2EMwI3zXWeIo5P9kgkUlWWvmyDRrjQDAe8Qr1Cp50zksF1IqOOCtoFoq73H6ryaLqbffJmZNWba4UgOElq-IKhoXUsF4NuVVh3z_Q"
  // }
  const handleButtonClick = () => {
     fileInputRef.current.click();
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFileView(file);
    if (file) {
      try {
        const base64Data = await convertToBase64(file);
        console.log(base64Data);
        setBase64(base64Data);
        handlePreview(base64Data);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const handlePreview = async (base64Data) => {
    setPreview(true);
  };

  return (
    <div className="deal-doc-wrapper">
      <div className="colapedEditor deal-doc-container">
        <p>Click here to add document</p>
      </div>

      <div className="deal-doc-top">
        <div className="deal-doc-flex">
        <input
                type="file"
                style={{
                  display: "none",
                }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
          <img src={Device} alt="" />
          <p className="common-fonts"onClick={handleButtonClick}>Upload from the device</p>
        </div>
        <div className="doc-line"></div>

        <div className="doc-cloud-comp">
          <img src={Cloud} alt="" className="doc-cloud-img" />
          <p className="common-fonts doc-cloud">connect cloud storage</p>
        </div>
      </div>

      <div className="deal-doc-box">
        <div>
          <p className="comon-fonts deal-doc-sample">docusign sample file</p>
          <div className="deal-doc-status">
            <div className="deal-doc-sent">
              <p className="common-fonts">sent</p>
            </div>

            <p className="common-fonts deal-doc-completed">0/1 completed</p>
          </div>
        </div>

        <div className="select deal-doc-wrap">
          <div className="dropdown-container" ref={actionDropDownRef}>
            <div className="deal-doc-action" onClick={toggleActionDropdown}>
              Action
              <i
                className={`fa-sharp fa-solid fa-angle-down deal-doc-angle`}
              ></i>
            </div>
            {actionopen && (
              <div className="dropdown-menu deal-doc-menu">
                <ul>
                  <li onClick={handlePreview}>Preview document</li>
                  <li>Share as link</li>
                  <li>Download PDF</li>
                  <li>Delete</li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <p className="common-fonts deal-doc-time">
              Created on Sept 13, 2023 at 10:00 AM GMT+5:30
            </p>
          </div>
        </div>
      </div>

      <div className="deal-doc-box">
        <div>
          <p className="comon-fonts deal-doc-sample">docusign sample file</p>
          <div className="deal-doc-status">
            <div className="deal-doc-comp">
              <p className="common-fonts">completed</p>
            </div>

            <p className="common-fonts deal-doc-completed">0/1 completed</p>
          </div>
        </div>

        <div className="select deal-doc-wrap">
          <div className="dropdown-container" ref={actionDropDownRef2}>
            <div className="deal-doc-action" onClick={toggleActionDropdown2}>
              Action
              <i
                className={`fa-sharp fa-solid fa-angle-down deal-doc-angle`}
              ></i>
            </div>
            {actionopen2 && (
              <div className="dropdown-menu deal-doc-menu">
                <ul>
                  <li onClick={handlePreview}>Preview document</li>
                  <li>Share as link</li>
                  <li>Download PDF</li>
                  <li>Delete</li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <p className="common-fonts deal-doc-time">
              Created on Sept 13, 2023 at 10:00 AM GMT+5:30
            </p>
          </div>
        </div>
      </div>
      {/* {preview && <DealDocPreview onClose={handlePreviewClose} fileView={fileView} dealId={dealId} token={envToken} doc={base64}/>} */}
      {preview &&  <DealRecipient onClose={handlePreviewClose}  dealId={dealId} token={envToken} doc={base64}/>}
    </div>
  );
};

export default DealDocument;
