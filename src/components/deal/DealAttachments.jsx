import React, { useState, useRef, useEffect } from "react";
import {
  handleLogout,
  getDecryptedToken,
  REQ_DOCUMENT,
  UPLOAD_ATTACHMENTS,
  VIEW_DOC,
  UPLOADED_DOCS,
} from "../utils/Constants";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notUpload from "../../assets/image/notupload.svg";

const DealAttachments = ({ dealId, type, onAttachNum, ownerId, idOfOwner }) => {
  const decryptedToken = getDecryptedToken();
  const orgId = localStorage.getItem('org_id');
  const [documentList, setDocumentList] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [fileName, setFileName] = useState("");
  const [docId, setDocId] = useState(0);
  const [attachment, setAttachment] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadedDocumentNames, setUploadedDocumentNames] = useState([]);


  const fetchDocuments = () => {
    axios
      .post(REQ_DOCUMENT + type, {org_id: orgId},{
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const requiredDocuments = response?.data?.data.filter(
          (doc) => doc.is_required === 1
        );
        setDocumentList(requiredDocuments);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };
  const uploadedDocs = () => {
    axios
      .get(UPLOADED_DOCS + type + "/" + dealId, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setAttachment(response?.data?.message);

        const uploadedNames = response?.data?.message.map(
          (doc) => doc.document_name
        );
        setUploadedDocumentNames(uploadedNames);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
          handleLogout();
        }
      });
  };

  useEffect(() => {
    fetchDocuments();
    uploadedDocs();
  }, []);
  console.log(attachment);

  const handleDocumentChange = (event) => {
    const selectedDocumentName = event.target.value;
    const selectedDocument = availableDocuments.find(
      (doc) => doc.document_name === selectedDocumentName
    );

    if (selectedDocument) {
      setSelectedDocuments((prevSelected) => [
        ...prevSelected,
        selectedDocument,
      ]);
    }

    setFileName("");
  };

  const availableDocuments = documentList.filter(
    (doc) => !selectedDocuments.some((selectedDoc) => selectedDoc.id === doc.id)
  );

  const handleButtonClick = (doc) => {
    setDocId(doc.id);
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFileName(event.target.files[0]);
    handleBrowseClick(event.target.files[0]);
  };

  const handleBrowseClick = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("source_type", type);
    formData.append("source_id", dealId);
    formData.append("docId", docId);
    formData.append("ldDoc", file);

    try {
      const response = await axios.post(UPLOAD_ATTACHMENTS, formData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(`File uploaded successfully`);
        setSelectedDocuments((prevSelected) =>
          prevSelected.filter((selectedDoc) => selectedDoc.id !== docId)
        );
        uploadedDocs();
        onAttachNum();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };
  const handleViewDocument = (imageUrl) => {
    window.open(VIEW_DOC + imageUrl, "_blank");
  };

  return (
    <div>
    {
      ownerId === idOfOwner && (
        <div className="deal-doc-list">
        <p className="common-fonts deal-browse-doc">Browse-documents</p>
        <div>
          <select
            name=""
            id=""
            className="deal-doc-select"
            onChange={handleDocumentChange}
            value=""
          >
            <option value="" disabled>
              Select a document
            </option>
            {availableDocuments
              .filter(
                (doc) => !uploadedDocumentNames.includes(doc.document_name)
              )
              .map((doc) => (
                <option key={doc.id} value={doc.document_name}>
                  {doc.document_name}
                </option>
              ))}
          </select>
        </div>
      </div>
      )
    }


      {selectedDocuments.map((doc, index) => (
        <div key={index} className="contact-tab-fields deal-doc-verify">
          <label className="common-fonts contact-tab-label deal-doc-label">
            <span>{doc.document_name}</span>

            <img src={notUpload} alt="" />
            <span>(Not Uploaded)</span>
          </label>
          <div className="contact-browse deal-doc-file">
            <span
              className="common-fonts common-input contact-tab-input"
              style={{
                position: "relative",
                marginRight: "10px",
              }}
            >
              <button
                className="contact-browse-btn common-fonts"
                onClick={() => handleButtonClick(doc)}
              >
                Browse
              </button>

              <input
                type="file"
                style={{
                  display: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {/* <button className="deal-doc-eye">
                {" "}
                <i className="fa-sharp fa-solid fa-eye "></i>
              </button> */}
              {fileName && (
                <span className="common-fonts upload-file-name">
                  Selected File: {fileName.name}
                </span>
              )}
            </span>
          </div>
        </div>
      ))}

      {attachment.map((doc, index) => (
        <div key={index} className="contact-tab-fields deal-doc-verify">
          <label className="common-fonts contact-tab-label deal-doc-label">
            <span>{doc.document_name}</span>
            <i
              className="fa fa-check-circle deal-doc-tick"
              aria-hidden="true"
            ></i>{" "}
            <span>(Uploaded)</span>
          </label>
          <div className="contact-browse deal-doc-file">
            <span
              className="common-fonts common-input contact-tab-input"
              style={{
                position: "relative",
                marginRight: "10px",
              }}
            >
              {/* <button
                className="contact-browse-btn common-fonts"
                onClick={() => handleButtonClick(doc)}
              >
                Browse
              </button> */}

              <input
                type="file"
                style={{
                  display: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                className="deal-doc-eye-2"
                onClick={() => handleViewDocument(doc.document_url)}
              >
                <i className="fa-sharp fa-solid fa-eye"></i>
              </button>
              <span className="common-fonts upload-file-name">
                Selected File: {doc.document_url.length<30 ?  doc.document_url : doc.document_url.slice(0,30)+"..."}
              </span>
            </span>
          </div>
        </div>
      ))}

      {/* <div className="deal-doc-btn">
        <button className="common-fonts common-white-button">Cancel</button>
        <button className="common-fonts common-save-button">Save</button>
      </div> */}
    </div>
  );
};

export default DealAttachments;
