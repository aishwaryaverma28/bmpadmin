
import React, { useState, useRef, useEffect } from "react";
import "chart.js/auto";
import GreaterArrow from "../../assets/image/greater-arrow.svg";
import GreaterDown from "../../assets/image/greater-arrow-down.svg";
import Trash from "../../assets/image/TrashFill.svg";
import Pen from "../../assets/image/pen.svg";
import axios from "axios";
import {
  GET_BATCH, GET_ACADEMY, UPDATE_BATCH,
  UPDATE_ACADEMY, getDecryptedToken
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";
import AddBatch from "./AddBatch.jsx";
import UpdateBatch from "./UpdateBatch.jsx";

const FeesNBatches = () => {
  const decryptedToken = getDecryptedToken();
  //=========================================================================
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
const [batchObject, setBatchObject] = useState({});
  //=========================================================================
  const [batch, setBatch] = useState([]);
  const id = localStorage.getItem('academy_id');
  const [batchId, setBatchId] = useState(null);
  const [academyData, setAcademyData] = useState({});
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [openBatch, setOpenBatch] = useState(0);
  const [progress, setProgress]= useState(null);
  const [progressArray, setProgressArray] = useState([]);
  const allowedImageTypes = ["application/pdf"];
  const academyDetails = () => {
    axios
      .get(GET_ACADEMY + id,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
      .then((response) => {
        setAcademyData(response?.data?.data[0])        
        setProgress(response?.data?.data[0]?.completion_percentage);
        if (response?.data?.data[0]?.completion_percentage !== "" && response?.data?.data[0]?.completion_percentage !== null) {
          setProgressArray(response?.data?.data[0]?.completion_percentage.split(","));
          };
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchBatch = () => {
    const body = {
      object_id: parseInt(id),
      object_type: "academy"
  }
    axios
      .post(GET_BATCH, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setBatch(response?.data?.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchBatch();
    academyDetails();
  }, []);

  const handleBatchClick = (index) => {
    setOpenBatch(openBatch === index ? null : index);
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };
  const processImageName = (imageName) => {
    const nameParts = imageName.split('.');
    if (nameParts.length > 1) {
        const namePart = nameParts.slice(0, -1).join('.');
        const processedName = namePart.replace(/[^\w-]/g, '-');
        return `${processedName}.${nameParts[nameParts.length - 1]}`;
    } else {
        return imageName.replace(/[^\w-]/g, '-');
    }
};

  const handleFileChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        alert("Please choose a valid PDF file to upload.");
        return;
      }
    submitImage(event.target.files[0]);
    }
  };
  const submitImage = (file) => {
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 5 * 1024 * 1024) {
        alert("PDF size should be less than 5MB. Please choose a smaller PDF.");
        return;
      }
           const folder = "bookmyplayer/academy/" + id;
      // const uniqueFileName = `${folder}/${selectedImage.name.replace(
      //   /\.[^/.]+$/,
      //   ""
      // )}`;
      const imageNameWithoutExtension = selectedImage.name.replace(/\.[^/.]+$/, "");
      const sanitizedImageName = imageNameWithoutExtension.replace(/[^\w-]/g, '-');
      const uniqueFileName = `${folder}/${sanitizedImageName}`;
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFileName(processImageName(selectedImage.name));
          handleSubmit(processImageName(selectedImage.name));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function handleSubmit(file) {

    axios
      .put(UPDATE_ACADEMY + id, { brochure: file }, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Details updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Some Error Occurred", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while updating details", {
          position: "top-center",
          autoClose: 2000,
        });
      })
  }
//===================================================================
  const handleBatchOpen = () => {
    setIsBatchOpen(true);
  };
  const handleBatchClose = () => {
    setIsBatchOpen(false);
  };
  const handleUpdateOpen = (batchId, batch) => {
    setIsUpdateOpen(true);
    setBatchId(batchId);
    setBatchObject(batch);
  };
  const handleUpdateClose = () => {
    setIsUpdateOpen(false);
    setBatchId(null);
  };
//=========================================================================
 
  const handleDeleteBatch = (batchId) => {
    axios
      .put(UPDATE_BATCH + batchId, { is_deleted: 1 }, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Batch deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          // After deleting the batch, you can refresh the batch list
          fetchBatch();
        } else {
          toast.error("Some Error Occurred", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while deleting the batch", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  
  return (
    <div>
      <div className="bmp-fee-container">
        <div className="bmp-fee-left">
          <p className="common-fonts bmp-fee-timing">Timimg & Fee</p>
          <div className="bmp-new-flex">
          {/* //========================================================================= */}
          <button
              className="common-save-button common-fonts bmp-batch-btn"
              onClick={handleBatchOpen}
            >
              Add Batch
            </button>
            {/* //========================================================================= */}
            {/* <button
              className="common-save-button common-fonts bmp-batch-btn"
              onClick={() => handleBatchModal("post")}
            >
              Add Batch
            </button> */}
            <div className="file-input-wrapper">
              <label htmlFor="file-input" className="custom-new-btn" onClick={handleButtonClick}>
                Upload Broucher
              </label>
              <input
                type="file"
                id="file-input"
                className="file-input-new"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {
                fileName ? (
                  <span id="file-name">{fileName?.toString()?.split('/')?.pop()}</span>
                ) : (
                  <span id="file-name">{academyData?.brochure?.toString()?.split('/')?.pop()}</span>
                )
              }
            </div>
          </div>
        </div>
        <ProgressBar array={progressArray}/>
      </div>

      <div className="bmp-fee-middle">
        {batch?.map((batch, index) => (
          <>
            <div className="bmp-fee-batch">
              <img
                src={openBatch === index ? GreaterDown : GreaterArrow}
                alt=""
                onClick={() => handleBatchClick(index)}
              />
              <div className="bmp-batch-date">
                <p className="common-fonts" onClick={() => handleBatchClick(index)}>
                  {batch?.title}
                </p>
                {openBatch === index ? (
                  <></>
                ) : (
                  <div className="bmp-fee-corner">
                    <p className="common-fonts">created on {batch?.creation_date?.split('T')[0]}</p>
                    <img src={Pen} alt="" className="bmp-fee-pen" onClick={() => handleUpdateOpen(batch.id, batch)} />
                    <img src={Trash} alt="" onClick={() => handleDeleteBatch(batch.id)} />
                  </div>
                )}
              </div>
            </div>

            {openBatch === index && (
              <div className="bmp-fee-box">
                <div className="bmp-box-top">
                  <p className="common-fonts">Age Group</p>
                  <div className="bmp-fee-corner">
                    <p className="common-fonts">created on {batch?.creation_date?.split('T')[0]}</p>
                    <img src={Pen} alt="" className="bmp-fee-pen" onClick={() => handleUpdateOpen(batch.id, batch)} />
                    <img src={Trash} alt="" onClick={() => handleDeleteBatch(batch.id)} />
                  </div>
                </div>

                <div className="bmp-yrs">

                  {batch?.age_group.split(',')?.map((age, index) => {
                    return (
                      <div className="common-fonts bmp-fee-yrs" key={index}>
                        {age}
                      </div>
                    )
                  })}
                </div>

                <div className="bmp-box-top">
                  <p className="common-fonts">Weekly Days</p>
                </div>

                <div className="bmp-yrs">
                  <div className="common-fonts bmp-fee-yrs">{batch?.weekly_days.split(',').join('-')}</div>
                </div>
                <div className="bmp-box-top">
                  <p className="common-fonts">Timings</p>
                </div>

                <div className="bmp-yrs">

                  {batch?.timing.split(',')?.map((time, index) => {
                    return (
                      <div className="common-fonts bmp-fee-yrs">
                        {time}
                      </div>
                    )
                  })}
                </div>

                <div className="bmp-box-top">
                  <p className="common-fonts">Fee</p>
                </div>

                <div className="bmp-double-flex">
                  {
                    batch?.fees?.split(',')?.map((fees, index) => {
                      return (
                        <div className="bmp-fee-input-flex">
                          <div className="bmp-input-fields">
                            <label htmlFor="" className="common-fonts bmp-fee-label">
                              Months
                            </label>
                            <input
                              type="number"
                              className="common-fonts common-input bmp-fee-input"
                              value={fees.split(' ')[0]}
                              disabled
                            />
                          </div>
                          <div className="bmp-input-fields">
                            <label htmlFor="" className="common-fonts bmp-fee-label">
                              Amout
                            </label>
                            <input
                              type="number"
                              className="common-fonts common-input bmp-fee-input"
                              value={fees.split('month-')[1]}
                              disabled
                            />
                          </div>
                        </div>
                      )
                    })
                  }

                </div>
              </div>
            )}
          </>
        ))}
      </div>
      {isUpdateOpen && <UpdateBatch onClose={handleUpdateClose} fetchBatch={fetchBatch} batchId={batchId} batch= {batchObject}/>}
      {isBatchOpen && <AddBatch onClose={handleBatchClose} fetchBatch={fetchBatch} array={progressArray}/>}
      <ToastContainer />
    </div>
  );
};

export default FeesNBatches;
