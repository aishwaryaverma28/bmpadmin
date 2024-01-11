import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  GET_ACADEMY,
  UPDATE_ACADEMY_TABLE2,
  UPDATE_ACADEMY,
  UPDATE_ACADMEY_STATUS,
  getDecryptedToken,
} from "../utils/Constants";
import Trash from "../../assets/image/red-bin.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteImage from "./DeleteImage.jsx";
import DisapproveModal from "./DisapproveModal.jsx";

const Training = ({ status, newAcadmeyData, keysOfNewAcadmeyData, updatedAcadmeyInfo, revokeId }) => {
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const role_name = localStorage.getItem("role_name");
  const [isUploadingMulti, setIsUploadingMulti] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [alertShown, setAlertShown] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteProp, setDeleteProp] = useState(null);
  const [alertVideoShown, setAlertVideoShown] = useState(false);
  const [isUploadingMulti2, setIsUploadingMulti2] = useState(false);
  const fileInputRef2 = useRef(null);
  const [alertShown2, setAlertShown2] = useState(false);
  const [photoUrls2, setPhotoUrls2] = useState([]);
  const [isDeleteModalOpen2, setIsDeleteModalOpen2] = useState(false);
  const [deleteIndex2, setDeleteIndex2] = useState(null);
  const [deleteProp2, setDeleteProp2] = useState(null);
  const [updatedFields, setUpdatedFields] = useState([]);
  const [stateBtn, setStateBtn] = useState(0);
  const [academyData, setAcademyData] = useState({});
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
//=====================================for disapprove modal
const [open, setOpen] = useState(false);
const [disapprovalReason, setDisapprovalReason] = useState('');

const openModal = () => {
  setOpen(true)
}
const closeModal = () => {
  setOpen(false);
}

  const updateAcadmeyData = () => {
    if (keysOfNewAcadmeyData.includes("training_ground_photos")) {
      if (
        newAcadmeyData?.training_ground_photos !== "" &&
        newAcadmeyData?.training_ground_photos !== null
      ) {
        setPhotoUrls(newAcadmeyData?.training_ground_photos?.split(",")?.reverse());
      }
    }
    if (keysOfNewAcadmeyData.includes("tournament_photos")) {
      if (
        newAcadmeyData?.tournament_photos !== "" &&
        newAcadmeyData?.tournament_photos !== null
      ) {
        setPhotoUrls2(newAcadmeyData?.tournament_photos?.split(",")?.reverse());
      }
    }
  }
  useEffect(() => {
    if (status === 0 && role_name === "Academy Admin") {
      updateAcadmeyData();
    }
  }, [newAcadmeyData, status, role_name, academyData]);
  //==========================================================================
  const academyDetails = () => {
    axios
      .get(GET_ACADEMY + academyId, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setAcademyData(response?.data?.data[0]);

        if (
          response?.data?.data[0]?.training_ground_photos !== "" &&
          response?.data?.data[0]?.training_ground_photos !== null
        ) {
          setPhotoUrls(
            response?.data?.data[0]?.training_ground_photos
              ?.split(",")
              ?.reverse()
          );
        }
        if (
          response?.data?.data[0]?.tournament_photos !== "" &&
          response?.data?.data[0]?.tournament_photos !== null
        ) {
          setPhotoUrls2(
            response?.data?.data[0]?.tournament_photos?.split(",")?.reverse()
          );
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
  }, []);
  const updateField = (fieldName) => {
    if (!updatedFields.includes(fieldName)) {
      setUpdatedFields([...updatedFields, fieldName]);
    }
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
  const showAlertOnce = (message) => {
    if (!alertVideoShown) {
      alert(message);
      setAlertVideoShown(true);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
    setAlertShown(false);
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedImageTypes.includes(file.type)) {
        if (!alertShown) {
          alert("Please choose a valid image file.");
          setAlertShown(true);
        }
        return;
      }
      if (file.type.startsWith("image/")) {
        submitImage(file);
      }
    }
  };
  const submitImage = (file) => {
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
          setFileName(processImageName(selectedImage.name));
          const imageUrl = processImageName(selectedImage.name);
          if (data.secure_url) {
            photoUrls.push(imageUrl);
            setPhotoUrls(photoUrls);
            updateField("training_ground_photos");
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
  const handleDeleteOpen = (index, prop) => {
    setIsDeleteModalOpen(true);
    setDeleteIndex(index);
    setDeleteProp(prop);
  };
  const handleDeleteConfirm = () => {
    if (deleteProp === "image") {
      deleteStrategy();
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
          training_ground_photos: updatedNameString,
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
  // {/* //////////////////////////////////////////////////////////////////code for tournaments////////////////////////////////////////////////////////////////////////////////////// */}

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
    setAlertShown2(false);
  };
  const handleFileChange2 = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedImageTypes.includes(file.type)) {
        if (!alertShown2) {
          alert("Please choose a valid image file.");
          setAlertShown2(true);
        }
        return;
      }
      if (file.type.startsWith("image/")) {
        submitImage2(file);
      }
    }
  };
  const submitImage2 = (file) => {
    setIsUploadingMulti2(true);
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 2 * 1024 * 1024) {
        showAlertOnce(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        setIsUploadingMulti2(false);
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
          setFileName(processImageName(selectedImage.name));
          const imageUrl = processImageName(selectedImage.name);
          if (data.secure_url) {
            photoUrls2.push(imageUrl);
            setPhotoUrls2(photoUrls2);
            updateField("tournament_photos");
            setStateBtn(1);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploadingMulti2(false);
        });
    }
  };
  const handleDeleteOpen2 = (index, prop) => {
    setIsDeleteModalOpen2(true);
    setDeleteIndex2(index);
    setDeleteProp2(prop);
  };
  const handleDeleteConfirm2 = () => {
    if (deleteProp2 === "image") {
      deleteStrategy2();
    }
    setIsDeleteModalOpen2(false);
  };
  const deleteStrategy2 = () => {
    if (deleteIndex2 !== null) {
      const updatedNameOfStrategy = [...photoUrls2];
      updatedNameOfStrategy.splice(deleteIndex2, 1);
      setPhotoUrls2(updatedNameOfStrategy);
      updateDataAndCallAPI2(updatedNameOfStrategy);
    }
  };
  const updateDataAndCallAPI2 = (updatedNameArray) => {
    const updatedNameString = updatedNameArray.reverse().join(",");
    axios
      .put(
        UPDATE_ACADEMY + academyId,
        {
          tournament_photos: updatedNameString,
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
  // {/* //////////////////////////////////////////////////////////////////code for tournaments////////////////////////////////////////////////////////////////////////////////////// */}
  const initialPhotoUrls = [...photoUrls];
  const initialFileName = fileName;

  const resetState = () => {
    setPhotoUrls(initialPhotoUrls);
    setFileName(initialFileName);
  };

  function handleSubmit() {
    let body = {};
    body.academy_id = academyId;
    const photoUrlsChanged =
      photoUrls.slice().sort().join(",") !==
      academyData?.training_ground_photos.split(",").slice().sort().join(",");
    const photoUrlsChanged2 =
      photoUrls2.slice().sort().join(",") !==
      academyData?.tournament_photos.split(",").slice().sort().join(",");

    if (photoUrlsChanged && photoUrls.slice().sort().join(",").length !== "") {
      body.training_ground_photos = photoUrls.join(",");
    }

    if (
      photoUrlsChanged2 &&
      photoUrls2.slice().sort().join(",").length !== ""
    ) {
      body.tournament_photos = photoUrls2.join(",");
    }
    if (newAcadmeyData !== null) {
      Object.keys(newAcadmeyData).forEach((key) => {
        if (!body.hasOwnProperty(key)) {
          body[key] = newAcadmeyData[key];
        }
      });
    }
    console.log("updated training body");
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
}

const ApproveSubmit = () => {

  const updatedFormData = {
    training_ground_photos: photoUrls.join(","),
    tournament_photos: photoUrls2.join(","),
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
  updatedAcadmeyInfo();
  academyDetails();
}

  return (
    <div>
      <>
        <div className="bmpTab2ImgSection">
          <div className="bmp-heading-flex">
            <div>
              <p className="common-fonts bmp-banner-upload">
                Upload training ground images
              </p>
              <p className="common-fonts light-color bmp-size">
                Recommended image size less than 2Mb
              </p>
            </div>
            <div className="bmp-total-img">
              <p className="common-fonts bmp-prefer">
                Upload minimum 25 images & tournament_photos 6/25
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
                  onClick={handleButtonClick}
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
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                />
                {isUploadingMulti ? (
                  <span className="common-fonts upload-file-name">
                    Uploading...
                  </span>
                ) : (
                  <span className="common-fonts upload-file-name">
                    <p className="common-fonts light-color">
                      You can upload multiple images{" "}
                    </p>
                    <p className="common-fonts bmp-format">
                      Upload image in format png, jpg, jpeg, webp{" "}
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
              {/* ====================================================map for admin photos */}
              <div className={`outerBox`}>
                {photoUrls?.map((photo, index) => (
                  <div className="bmp-new-img" style={{
                    border: academyData?.training_ground_photos?.split(",")?.includes(photo) ? 'none' : '2px solid red'
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
                <div className="support-no-ticket-found">
                  <p className="common-fonts">No photos added</p>
                </div>
              ) : (
                <div className="outerBox">
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
        {/* /////////////////////////////////////////////////////////////////////////////code for tournaments/////////////////////////////////////////////////////////////////////////// */}
        <>
          <div className="bmpTab2ImgSection">
            <div className="bmp-heading-flex">
              <div>
                <p className="common-fonts bmp-banner-upload">
                  Upload Tournament images
                </p>
                <p className="common-fonts light-color bmp-size">
                  Recommended image size less than 2Mb
                </p>
              </div>
              <div className="bmp-total-img">
                <p className="common-fonts bmp-prefer">
                  Upload minimum 25 images & tournament_photos 6/25
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
                  {isUploadingMulti2 ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      <p className="common-fonts light-color">
                        You can upload multiple images{" "}
                      </p>
                      <p className="common-fonts bmp-format">
                        Upload image in format png, jpg, jpeg, webp{" "}
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
                <div className={`outerBox`}>
                  {photoUrls2?.map((photo, index) => (
                    <div className="bmp-new-img" style={{
                      border: academyData?.tournament_photos?.split(",")?.includes(photo) ? 'none' : '2px solid red'
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
                {photoUrls2?.length === 0 ? (
                  <div className="support-no-ticket-found">
                    <p className="common-fonts">No photos added</p>
                  </div>
                ) : (
                  <div className="outerBox">
                    {photoUrls2?.map((photo, index) => (
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
                              onClick={() => handleDeleteOpen2(index, "image")}
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
            <button className="disabledBtn">Save</button>
          ) : (
            <button
              className="common-fonts common-save-button"
              onClick={handleSubmit}
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
        {isDeleteModalOpen2 && (
          <DeleteImage
            onClose={() => {
              setIsDeleteModalOpen2(false);
            }}
            onDelete={handleDeleteConfirm2}
            prop={deleteProp2}
          />
        )}
      </>
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

export default Training;
