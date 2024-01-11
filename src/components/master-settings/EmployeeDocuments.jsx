import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeProfile.css";
import notUpload from "../../assets/image/notupload.svg";
import upload from "../../assets/image/upload.svg";
import {
  EMPLOYEE_GETID,
  EMPLOYEE_UPDATE,
  REMOVE_DOC,
  UPLOAD_DOC,
  VIEW_IMG,
  getDecryptedToken,
} from "../utils/Constants";
const decryptedToken = getDecryptedToken();
const userId = localStorage.getItem("id");

function DocumentUpload({ label, imageUrl, setImageUrl }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageSelect = (event) => {
    setSelectedImage(event.target.files[0]);
    uploadImage(event.target.files[0]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("employeeDoc", file);

    if (imageUrl) {
      try {
        await axios.delete(REMOVE_DOC + imageUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const response = await axios.post(UPLOAD_DOC, formData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      console.log("Image uploaded successfully:", response.data);
      setImageUrl(response.data.data);
      // Perform any additional actions on successful upload
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDocument = () => {
    if (imageUrl) {
      window.open(VIEW_IMG + imageUrl, "_blank");
    }
  };

  return (
    <div className="docImage">
      <div className="aadhar">
        <div className="docTitle">
          <p className="docName">{label}</p>
          {imageUrl ? (
            <div className="docStatus">
              <img src={upload} alt="upload" />
              <p>(Uploaded)</p>
            </div>
          ) : (
            <div className="docStatus">
              <img src={notUpload} alt="notupload" />
              <p>(Not Uploaded)</p>
            </div>
          )}
        </div>

        <div className="docData">
          {!imageUrl ? <span></span> : null}
          <input
            type="file"
            name="employeeDoc"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />

          {imageUrl && <p className="imageUrl">{imageUrl}</p>}
          <span>
            {imageUrl && (
              <button onClick={handleViewDocument} className="viewBtn">
                <i className="fa-sharp fa-solid fa-eye"></i>
              </button>
            )}
            <button onClick={handleButtonClick} className="browseBtn">
              Browse
            </button>
          </span>
        </div>
      </div>

      {imageUrl && (
        <img src={VIEW_IMG + imageUrl} alt="image" className="docUpImg" />
      )}
    </div>
  );
}

function EmployeeDocuments() {
  const [aadharUrl, setAadharUrl] = useState("");
  const [panUrl, setPanUrl] = useState("");
  const [checkUrl, setCheckUrl] = useState("");
  const [passbookUrl, setPassbookUrl] = useState("");
  const [empData, setEmpData] = useState([]);
  const [initialEmpData, setInitialEmpData] = useState({});
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    getEmployeeInfo();
  }, []);

  async function getEmployeeInfo() {
    try {
      const response = await axios.get(EMPLOYEE_GETID, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response.data.data;
      setEmpData(data[0]);
      setInitialEmpData(data[0]);
      setData(data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  function setData(data) {
    if (data) {
      setAadharUrl(data.aadhaar_image);
      setPanUrl(data.tax_image);
      setCheckUrl(data.bank_image);
      setPassbookUrl("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      aadhaar_image: aadharUrl,
      tax_image: panUrl,
      bank_image: checkUrl,
    };
    axios
      .put(EMPLOYEE_UPDATE + userId, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        setUploadMessage("Documents uploaded successfully");
        setTimeout(() => {
          setUploadMessage("");
        }, 30000); // Clear message after 1 minute (60000 milliseconds)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const resetForm = () => {
    setAadharUrl(initialEmpData.aadhaar_image);
    setPanUrl(initialEmpData.tax_image);
    setCheckUrl(initialEmpData.bank_image);
    setPassbookUrl("");
  };

  return (
    <>
      {uploadMessage && <p className="updateMsg">{uploadMessage}</p>}
      <DocumentUpload
        label="Aadhar Card"
        imageUrl={aadharUrl}
        setImageUrl={setAadharUrl}
      />
      <DocumentUpload
        label="Pan Card"
        imageUrl={panUrl}
        setImageUrl={setPanUrl}
      />
      <DocumentUpload
        label="Canceled Check"
        imageUrl={checkUrl}
        setImageUrl={setCheckUrl}
      />
      <DocumentUpload
        label="Pass Book"
        imageUrl={passbookUrl}
        setImageUrl={setPassbookUrl}
      />
      <div className="timesheetSaveBtn">
        <button type="button" className="cancleBtn" onClick={resetForm}>
          Cancel
        </button>
        <button type="button" className="changesaveBtn" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </>
  );
}

export default EmployeeDocuments;
