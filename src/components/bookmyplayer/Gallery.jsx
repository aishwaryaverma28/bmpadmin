import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  GET_ACADEMY,
  UPDATE_ACADEMY,
  UPDATE_ACADEMY_TABLE2,
  GET_UPDATED_ACADEMY_INFO,
  UPDATE_ACADMEY_STATUS,
  getDecryptedToken,
} from "../utils/Constants";
import "chart.js/auto";
import Photo from "../../assets/image/gallery.svg";
import Video from "../../assets/image/video.svg";
import Trash from "../../assets/image/red-bin.svg";
import Player from "../../assets/image/player.png";
import VideoPlay from "../../assets/image/video-play.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteImage from "./DeleteImage.jsx";
import ProgressBar from "./ProgressBar";
import Training from "./Training.jsx";
import DisapproveModal from "./DisapproveModal.jsx";

const Gallery = () => {
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const role_name = localStorage.getItem("role_name");
  const [status, setStatus] = useState(null);
  const [newAcadmeyData, setNewAcadmeyData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState([]);
  const [academyData, setAcademyData] = useState({});
  const [photoUrls, setPhotoUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [newName, setNewName] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteProp, setDeleteProp] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingMulti, setIsUploadingMulti] = useState(false);
  const [progress, setProgress] = useState(null);
  const [progressArray, setProgressArray] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
  const [stateBtn, setStateBtn] = useState(0);
  const [alertVideoShown, setAlertVideoShown] = useState(false);
  const [updatedFields, setUpdatedFields] = useState([]);
  const [number, setNumber] = useState(0);
  const [number1, setNumber1] = useState(0);
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/ogg",
  ];
  const [activeTab, setActiveTab] = useState("academy");
//======================================================================extra functions for approve n disapprove
  const [revokeId, setRevokeId] = useState(null);
  const [keysOfNewAcadmeyData, setKeysOfNewAcadmeyData] = useState([]);
//=====================================for disapprove modal
const [open, setOpen] = useState(false);
const [disapprovalReason, setDisapprovalReason] = useState('');

const openModal = () => {
  setOpen(true)
}
const closeModal = () => {
  setOpen(false);
}

  const updatedAcadmeyInfo = () => {
    axios
      .post(
        GET_UPDATED_ACADEMY_INFO,
        {
          academy_id: academyId,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        if (response?.data?.data[0] !== undefined || response?.data?.data[0]?.status !== null) {
          setRevokeId(response?.data?.data[0]?.id);
          const statusValue = response?.data?.data[0]?.status;
          setStatus(statusValue);
          const rawData = response?.data?.data[0];
          const filteredData = Object.fromEntries(
            Object.entries(rawData).filter(
              ([key, value]) =>
                value !== null &&
                ![
                  "creation_date",
                  "update_date",
                  "status",
                  "id",
                  "academy_id",
                ].includes(key)
            )
          );
          setNewAcadmeyData(filteredData);
          const keys = Object.keys(filteredData);
          setKeysOfNewAcadmeyData(keys);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateAcadmeyData = () => {
    if (keysOfNewAcadmeyData.includes("photos")) {
      if (
        newAcadmeyData?.photos !== "" &&
        newAcadmeyData?.photos !== null
      ) {
        setPhotoUrls(newAcadmeyData?.photos?.split(",")?.reverse());
      }
    }
    if (keysOfNewAcadmeyData.includes("videos")) {
      if (
        newAcadmeyData?.videos !== "" &&
        newAcadmeyData?.videos !== null
      ) {
        setVideoUrls(newAcadmeyData?.videos?.split(",")?.reverse());
      }
    }
  }
  useEffect(() => {
    if (status === 0 && role_name === "Academy Admin") {
      updateAcadmeyData();
    }
  }, [newAcadmeyData, status, role_name]);
  //==========================================================================

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const academyDetails = () => {
    axios
      .get(GET_ACADEMY + academyId, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setAcademyData(response?.data?.data[0]);
        setProgress(response?.data?.data[0]?.completion_percentage);
        if (
          response?.data?.data[0]?.completion_percentage !== "" &&
          response?.data?.data[0]?.completion_percentage !== null
        ) {
          setProgressArray(
            response?.data?.data[0]?.completion_percentage.split(",")
          );
        }
        if (
          response?.data?.data[0]?.photos !== "" &&
          response?.data?.data[0]?.photos !== null
        ) {
          setPhotoUrls(response?.data?.data[0]?.photos?.split(",")?.reverse());
        }
        if (
          response?.data?.data[0].videos !== "" &&
          response?.data?.data[0].videos !== null
        ) {
          setVideoUrls(response.data.data[0].videos?.split(",").reverse());
        }
        if (
          response?.data?.data[0].updated_column !== "" &&
          response?.data?.data[0].updated_column !== null
        ) {
          updatedFields(
            response.data.data[0].updated_column?.split(",").reverse()
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    academyDetails();
    updatedAcadmeyInfo();
  }, []);

  const initialPhotoUrls = [...photoUrls];
  const initialVideoUrls = [...videoUrls];
  const initialFileName = fileName;
  const initialFileName2 = fileName2;
  const initialSelectedFile = selectedFile;
  const initialSelectedFile2 = selectedFile2;

  const resetState = () => {
    setPhotoUrls(initialPhotoUrls);
    setVideoUrls(initialVideoUrls);
    setFileName(initialFileName);
    setFileName2(initialFileName2);
    setSelectedFile(initialSelectedFile);
    setSelectedFile2(initialSelectedFile2);
  };

  const updateField = (fieldName) => {
    if (!updatedFields.includes(fieldName)) {
      setUpdatedFields([...updatedFields, fieldName]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const processImageName = (imageName) => {
    const nameParts = imageName.split(".");
    if (nameParts.length > 1) {
      const namePart = nameParts.slice(0, -1).join(".");
      const processedName = namePart.replace(/[^\w-]/g, "-");
      return `${processedName}.${nameParts[nameParts.length - 1]}`;
    } else {
      return imageName.replace(/[^\w-]/g, "-");
    }
  };

  const handleFileChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        alert("Please choose a valid image file (JPEG, PNG, GIF).");
        return;
      }
      submitImage(event.target.files[0]);
      setNewName(selectedImage.name);
    }
  };

  const submitImage = (file) => {
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 2 * 1024 * 1024) {
        alert(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        return;
      }
      const folder = "bookmyplayer/academy/" + academyId;
      const imageNameWithoutExtension = selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedImageName = imageNameWithoutExtension.replace(
        /[^\w-]/g,
        "-"
      );
      const uniqueFileName = `${folder}/${sanitizedImageName}`;
      setIsUploading(true);
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
          setSelectedFile(selectedImage);
          setFileName(processImageName(selectedImage.name));
          updateField("banner");
          setStateBtn(1);
          handleSubmit(processImageName(selectedImage.name));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  const showAlertOnce = (message) => {
    if (!alertVideoShown) {
      alert(message);
      setAlertVideoShown(true);
    }
  };

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
    setAlertVideoShown(false);
    setAlertShown(false);
  };
  const handleFileChange2 = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedFileTypes.includes(file.type)) {
        if (!alertShown) {
          alert("Please choose a valid video file.");
          setAlertShown(true);
        }
        return;
      } else if (!allowedFileTypes.includes(file.type)) {
        if (!alertShown) {
          alert("Please choose a valid image file.");
          setAlertShown(true);
        }
        return;
      }
      if (file.type.startsWith("image/")) {
        submitImage2(file);
      } else if (file.type.startsWith("video/")) {
        submitVideo2(file);
      }
    }
  };

  const submitImage2 = (file) => {
    setIsUploadingMulti(true);
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 2 * 1024 * 1024) {
        showAlertOnce(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        setIsUploadingMulti(false);
        return;
      }
      const folder = "bookmyplayer/academy/" + academyId;
      const imageNameWithoutExtension = selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedImageName = imageNameWithoutExtension.replace(
        /[^\w-]/g,
        "-"
      );
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
          setFileName2(processImageName(selectedImage.name));
          const imageUrl = processImageName(selectedImage.name);
          if (data.secure_url) {
            photoUrls.push(imageUrl);
            setPhotoUrls(photoUrls);
            updateField("photos");
            setStateBtn(1);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploadingMulti(false);
        });
    }
  };

  const submitVideo2 = (file) => {
    setIsUploadingMulti(true);
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 10 * 1024 * 1024) {
        showAlertOnce(
          "Video size should be less than 10MB. Please choose a smaller video."
        );
        setIsUploadingMulti(false);
        return;
      }
      const folder = "bookmyplayer/academy/" + academyId;
      const imageNameWithoutExtension = selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedImageName = imageNameWithoutExtension.replace(
        /[^\w-]/g,
        "-"
      );
      const uniqueFileName = `${folder}/${sanitizedImageName}`;
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);

      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/video/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFileName2(processImageName(selectedImage.name));
          const imageUrl = processImageName(selectedImage.name);
          if (data.secure_url) {
            videoUrls.push(imageUrl);
            setVideoUrls(videoUrls);
            updateField("videos");
            setStateBtn(1);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploadingMulti(false);
        });
    }
  };

  function handleSubmit(file) {
    if (!progressArray?.includes("4")) {
      progressArray.push("4");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray.join(",");
    let body = {};
    body = {
      banner: file,
      completion_percentage: combinedProgress,
    };

    axios
      .put(UPDATE_ACADEMY + academyId, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
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
      });
  }

  function handleSubmit2() {
    if (!progressArray?.includes("4")) {
      progressArray.push("4");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray.join(",");
    let body = {};
    body.academy_id = academyId;
    const progressChanged =
      combinedProgress !== academyData?.completion_percentage;


    const photoUrlsChanged =
      photoUrls.slice().sort().join(",") !==
      academyData?.photos.split(",").slice().sort().join(",");

    const videoUrlsChanged =
      videoUrls.slice().sort().join(",") !==
      academyData?.videos.split(",").slice().sort().join(",");

    if (photoUrlsChanged && photoUrls.slice().sort().join(",").length !== "") {
      body.photos = photoUrls.join(",");
    }

    if (videoUrlsChanged && videoUrls.slice().sort().join(",").length !== "") {
      body.videos = videoUrls.join(",");
    }

    if (progressChanged && combinedProgress !== "") {
      body.completion_percentage = combinedProgress;
    }

    if (newAcadmeyData !== null) {
      Object.keys(newAcadmeyData).forEach((key) => {
        if (!body.hasOwnProperty(key)) {
          body[key] = newAcadmeyData[key];
        }
      });
    }
    axios
      .post(UPDATE_ACADEMY_TABLE2, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
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
        setAlertVideoShown(false);
        setStateBtn(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while updating details", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }

  const handleDeleteOpen = (index, prop) => {
    setIsDeleteModalOpen(true);
    setDeleteIndex(index);
    setDeleteProp(prop);
  };
  const handleDeleteConfirm = () => {
    if (deleteProp === "image") {
      deleteStrategy();
    } else if (deleteProp === "video") {
      deleteVideo();
    }
    setIsDeleteModalOpen(false);
  };

  const deleteStrategy = () => {
    if (deleteIndex !== null) {
      const updatedNameOfStrategy = [...photoUrls];
      updatedNameOfStrategy.splice(deleteIndex, 1);
      setPhotoUrls(updatedNameOfStrategy);
      updateDataAndCallAPI(updatedNameOfStrategy);
    }
  };
  const updateDataAndCallAPI = (updatedNameArray) => {
    const updatedNameString = updatedNameArray.reverse().join(",");
    axios
      .put(
        UPDATE_ACADEMY + academyId,
        {
          photos: updatedNameString,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        academyDetails();
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  };

  const deleteVideo = () => {
    if (deleteIndex !== null) {
      const updatedNameOfStrategy = [...videoUrls];
      updatedNameOfStrategy.splice(deleteIndex, 1);
      setPhotoUrls(updatedNameOfStrategy);
      updateData(updatedNameOfStrategy);
    }
  };
  const updateData = (updatedNameArray) => {
    const updatedNameString = updatedNameArray.reverse().join(",");
    axios
      .put(
        UPDATE_ACADEMY + academyId,
        {
          videos: updatedNameString,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        academyDetails();
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  };
  //==========================================================================approve function
  const handleApprove = () => {
    axios.put(UPDATE_ACADMEY_STATUS + revokeId, { status: 1 },
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`
        }
      }).then((response) => {
        if (response?.data?.status === 1) {
          toast.success("Academy info updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        }
        ApproveSubmit();
      }).catch((error) => {
        console.log(error);
      })
    setRevokeId(null);
  }

  const ApproveSubmit = () => {
    if (!progressArray?.includes("4")) {
      progressArray.push("4");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray?.join(",");

    const updatedFormData = {
      completion_percentage: combinedProgress,
      photos: photoUrls.join(","),
      videos: videoUrls.join(","),
    }
    axios
      .put(UPDATE_ACADEMY + academyId, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
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
        updatedAcadmeyInfo();
        academyDetails();
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while updating details", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setStateBtn(0);
      });
  }
  //==========================================================================approve function
  const handleDisapprove = () => {
    const body = { 
      status: 2,
      rejection_reason: disapprovalReason,
     }
    axios.put(UPDATE_ACADMEY_STATUS + revokeId, body,
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`
        }
      }).then((response) => {
        if (response?.data?.status === 1) {
          toast.success("Academy info updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        }

      }).catch((error) => {
        console.log(error);
      })
    closeModal();
    setRevokeId(null);
    updatedAcadmeyInfo();
    academyDetails();
  }

  return (
    <div className="bmp-main-wrapper">
      <div className="bmp-fee-container">
        <div className="bmp-fee-left">
          <p className="common-fonts bmp-fee-timing-2">
            Photos & Video Gallery
          </p>
          <p className="common-fonts bmp-add-photo">
            Add photos and videos of your academy.
          </p>
          <p className="common-fonts bmp-prefer">
            Psst! A secret People prefer videos more than photos.
          </p>

          <div className="contacts-top-flex ">
            <div className="genral-setting-btn genral-setting-fonts aaa">
              <button
                className={`genral-btn  ${activeTab === "academy" ? "genral-active" : ""
                  }`}
                onClick={() => handleTabClick("academy")}
              >
                <span className="mrkt-whatsapp">Academy & Banner</span>
              </button>
              <button
                className={`genral-btn contact-genral-btn ${activeTab === "training" ? "genral-active" : ""
                  }`}
                onClick={() => handleTabClick("training")}
              >
                <span className="mrkt-whatsapp">
                  Training Ground & Tournaments
                </span>
              </button>
            </div>
          </div>
        </div>
        <ProgressBar array={progressArray} />
      </div>

      {activeTab === "academy" && (
        <>
          <div className="bmp-upload-img">
            <div>
              <div>
                <p className="common-fonts bmp-banner-upload">
                  Upload banner image
                </p>
                <p className="common-fonts light-color">
                  Recommended image size 820x312
                </p>
                <div className="bmp-upload-2">
                  <div className="contact-browse deal-doc-file">
                    <span
                      className="common-fonts common-input contact-tab-input bmp-border"
                      style={{
                        position: "relative",
                        marginRight: "10px",
                      }}
                    >
                      <button
                        className="contact-browse-btn common-fonts"
                        onClick={() => handleButtonClick()}
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
                      {isUploading ? (
                        <span className="common-fonts upload-file-name">
                          Uploading...
                        </span>
                      ) : (
                        <span className="common-fonts upload-file-name">
                          {fileName ? fileName : academyData?.banner}
                        </span>
                      )}
                    </span>
                  </div>

                  {selectedFile && (
                    <div className="bmp-image-preview">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected Preview"
                        className="bmp-preview-image"
                      />
                    </div>
                  )}

                  {!selectedFile && (
                    <div className="bmp-image-preview">
                      <img
                    src={academyData?.banner === null
                      ? `https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/default/${academyData?.sport}_banner.webp`
                      : `https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${academyData?.banner}`}
                    alt=""
                    className="bmp-preview-image"
                  />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bmp-heading-flex">
              <div>
                <p className="common-fonts bmp-banner-upload">
                  Upload Academy images/videos
                </p>
                <p className="common-fonts light-color bmp-size">
                  Recommended image size 820x312
                </p>
              </div>
              <div className="bmp-total-img">
                <p className="common-fonts bmp-prefer">
                  Upload minimum 25 images & videos 6/25
                </p>
              </div>
            </div>

            <div className="bmp-upload-3 bmp-gap">
              <div className="contact-browse deal-doc-file">
                <span
                  className="common-fonts common-input contact-tab-input bmp-border-2"
                  style={{
                    position: "relative",
                    marginRight: "10px",
                  }}
                >
                  <button
                    className="contact-browse-btn common-fonts"
                    onClick={handleButtonClick2}
                    disabled={status === 0 && role_name === 'Academy'}
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
                    ref={fileInputRef2}
                    onChange={handleFileChange2}
                    multiple
                  />
                  {isUploadingMulti ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      <p className="common-fonts light-color">
                        You can upload multiple videos and images{" "}
                      </p>
                      <p className="common-fonts bmp-format">
                        Upload image/videos in format png, jpg, jpeg, gif, webp,
                        mp4{" "}
                      </p>
                      { }
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <>
            {status === 0 && role_name === "Academy Admin" ?
              <>
                <div className="outerBox">
                  {videoUrls?.map((video, index) => (
                    <div className="bmp-new-img" style={{
                      border: academyData?.videos?.split(",")?.includes(video) ? 'none' : '2px solid red'
                    }}>
                      <div className="bmp-img-top-icon">
                        <div className="bmp-img-name">
                          <div className="bmp-video">
                            <img
                              src={Video}
                              alt=""
                            />
                          </div>
                          <p className="common-fonts bmp-tour">
                            {video?.length > 20 ? (
                              <>{video?.slice(0, 20) + "..."}</>
                            ) : (
                              <>{video}</>
                            )}
                          </p>
                        </div>
                        <div className="bmp-trash">
                          <img
                            src={Trash}
                            alt=""
                            onClick={() => handleDeleteOpen(index, "video")}
                          />
                        </div>
                      </div>
                      <div className="bmp-player-img">
                        <video width="270" height="140" controls>
                          <source
                            src={`https://res.cloudinary.com/cloud2cdn/video/upload/bookmyplayer/academy/${academyId}/${video}`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                  ))}
                </div>
              </> :
              <>
                {videoUrls?.length === 0 ? (
                  <div className="support-no-ticket-found">
                    <p className="common-fonts">No videos added</p>
                  </div>
                ) : (
                  <div className="outerBox">
                    {videoUrls?.map((video, index) => (
                      <div className="bmp-new-img">
                        <div className="bmp-img-top-icon">
                          <div className="bmp-img-name">
                            <div className="bmp-video">
                              <img
                                src={Video}
                                alt=""
                              />
                            </div>
                            <p className="common-fonts bmp-tour">
                              {video?.length > 20 ? (
                                <>{video?.slice(0, 20) + "..."}</>
                              ) : (
                                <>{video}</>
                              )}
                            </p>
                          </div>
                          <div className="bmp-trash">
                            <img
                              src={Trash}
                              alt=""
                              onClick={() => handleDeleteOpen(index, "video")}
                            />
                          </div>
                        </div>
                        <div className="bmp-player-img">
                          <video width="270" height="140" controls>
                            <source
                              src={`https://res.cloudinary.com/cloud2cdn/video/upload/bookmyplayer/academy/${academyId}/${video}`}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          </>
          <>
            {status === 0 && role_name === "Academy Admin" ?
              <>
                {/* ====================================================map for admin photos */}
                <div className={`outerBox`}>
                  {photoUrls?.map((photo, index) => (
                    <div className="bmp-new-img" style={{
                      border: academyData?.photos?.split(",")?.includes(photo) ? 'none' : '2px solid red'
                    }}>
                      <div className="bmp-img-top-icon">
                        <div className="bmp-img-name">
                          <div className="bmp-video" >
                            <img
                              src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${photo}`}
                              alt="Selected Preview"
                            />
                          </div>

                          <p className="common-fonts bmp-tour">
                            {photo?.length > 20 ? (
                              <>{photo?.slice(20)}...</>
                            ) : (
                              <>{photo}</>
                            )}
                          </p>
                        </div>
                        <div className="bmp-trash">
                          <img
                            src={Trash}
                            alt=""
                            onClick={() => handleDeleteOpen(index, "image")}
                          />
                        </div>
                      </div>
                      <img
                        src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${photo}`}
                        alt="Selected Preview"
                        key={index}
                      />
                    </div>
                  ))}
                </div>
              </> :
              <>
                {photoUrls?.length === 0 ? (
                  <div className={`support-no-ticket-found`}>
                    <p className="common-fonts">No photos added</p>
                  </div>
                ) : (
                  <div className={`outerBox`}>
                    {photoUrls?.map((photo, index) => (
                      <div className="bmp-new-img">
                        <div className="bmp-img-top-icon">
                          <div className="bmp-img-name">
                            <div className="bmp-video">
                              <img
                                src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${photo}`}
                                alt="Selected Preview"
                              />
                            </div>

                            <p className="common-fonts bmp-tour">
                              {photo?.length > 20 ? (
                                <>{photo?.slice(20)}...</>
                              ) : (
                                <>{photo}</>
                              )}
                            </p>
                          </div>
                          <div className="bmp-trash">
                            <img
                              src={Trash}
                              alt=""
                              onClick={() => handleDeleteOpen(index, "image")}
                            />
                          </div>
                        </div>
                        <img
                          src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${photo}`}
                          alt="Selected Preview"
                          key={index}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          </>
          <div className="bmp-bottom-btn">
            {status === 0 && role_name === "Academy Admin" ?
              <>
                <button
                  onClick={openModal}
                  className="common-save-button common-delete-button">
                  Disapprove
                </button>
                <button
                  onClick={handleApprove}
                  className="common-save-button common-save">
                  Approve
                </button>
              </>
              :
              <>
                <button
                  className="common-fonts common-white-button"
                  onClick={resetState}
                >
                  Cancel
                </button>
                {stateBtn === 0 ? (
                  <button className="disabledBtn" disabled>
                    Save
                  </button>
                ) : (
                  <button
                    className="common-fonts common-save-button"
                    onClick={handleSubmit2}
                  >
                    Save
                  </button>
                )}
              </>
            }
          </div>

          {isDeleteModalOpen && (
            <DeleteImage
              onClose={() => {
                setIsDeleteModalOpen(false);
              }}
              onDelete={handleDeleteConfirm}
              prop={deleteProp}
            />
          )}
        </>
      )}

      {activeTab === "training" && (
        <Training status={status} newAcadmeyData={newAcadmeyData} keysOfNewAcadmeyData={keysOfNewAcadmeyData} updatedAcadmeyInfo={updatedAcadmeyInfo} revokeId={revokeId}/>
      )}

      <ToastContainer />
      {
        open && (
          <DisapproveModal
          onClose={closeModal}
          onEnter={handleDisapprove}
          disapprovalReason={disapprovalReason}
          setDisapprovalReason={setDisapprovalReason}
        />
        )
      }

    </div>
  );
};

export default Gallery;
