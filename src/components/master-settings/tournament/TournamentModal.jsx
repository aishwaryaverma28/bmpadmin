import React, { useState, useRef } from "react";
import "../../styles/HelpModal.css";
import { getDecryptedToken, UPDATE_LEAGUE } from "../../utils/Constants";
import axios from "axios";
import Trash from "../../../assets/image/red-bin.svg";
import { toast, ToastContainer } from "react-toastify";

const TournamentModal = ({ onClose, id }) => {
  const decryptedToken = getDecryptedToken();
  const [stateBtn, setStateBtn] = useState(0);
  //==============================================multiple photo upload
  const fileInputRef = useRef(null);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isUploadingMulti, setIsUploadingMulti] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const [alertVideoShown, setAlertVideoShown] = useState(false);
  //==================================================logo upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLogoName, setFileLogoName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileLogoInputRef = useRef(null);
  //=======================================================banner upload
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [fileBannerName, setFileBannerName] = useState("");
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const fileBannerInputRef = useRef(null);

  console.log(id);

  //==============================================================multiple image upload
  const processImageName = (imageName) => {
    const nameParts = imageName.split(".");
    if (nameParts?.length > 1) {
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
      const folder = "bookmyplayer/league/" + id + "/";
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

  //=======================================================logo upload
  const handleLogoButtonClick = (event) => {
    event.preventDefault();
    fileLogoInputRef.current.click();
  };
  const handleLogoFileChange = (event) => {
    setStateBtn(1);
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        alert("Please choose a valid image file (JPEG, PNG, GIF).");
        return;
      }
      submitLogoImage(event.target.files[0]);
    }
  };
  const submitLogoImage = (file) => {
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 2 * 1024 * 1024) {
        alert(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        return;
      }
      const folder = "bookmyplayer/league/" + id + "/";
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
      setIsUploading(true);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setSelectedFile(selectedImage);
          setFileLogoName(processImageName(selectedImage.name));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  //=======================================================banner upload
  const handleBannerButtonClick = (event) => {
    event.preventDefault();
    fileBannerInputRef.current.click();
  };
  const handleBannerFileChange = (event) => {
    setStateBtn(1);
    const selectedBannerImage = event.target.files[0];
    if (selectedBannerImage) {
      if (!allowedImageTypes.includes(selectedBannerImage.type)) {
        alert("Please choose a valid image file (JPEG, PNG, GIF).");
        return;
      }
      submitBannerImage(event.target.files[0]);
    }
  };
  const submitBannerImage = (file) => {
    const selectedBannerImage = file;
    if (selectedBannerImage) {
      if (selectedBannerImage.size > 2 * 1024 * 1024) {
        alert(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        return;
      }
      const folder = "bookmyplayer/league/" + id + "/";
      const imageNameWithoutExtension = selectedBannerImage.name.replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedImageName = imageNameWithoutExtension.replace(
        /[^\w-]/g,
        "-"
      );
      const uniqueFileName = `${folder}/${sanitizedImageName}`;
      const data = new FormData();
      data.append("file", selectedBannerImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);
      setIsBannerUploading(true);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setSelectedBannerFile(selectedBannerImage);
          setFileBannerName(processImageName(selectedBannerImage.name));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsBannerUploading(false);
        });
    }
  };

  //===================================================================form function
  const handleDelete = (index) => {
    const updatedPhotoUrls = [...photoUrls];
    const deletedPhoto = updatedPhotoUrls.splice(index, 1)[0];
    setPhotoUrls(updatedPhotoUrls);
    setStateBtn(1);
  };

  const onSave = (e) => {
    e.preventDefault();
    const updatedFormData = {
      logo: fileLogoName,
      banner: fileBannerName,
      photos: photoUrls.join(","),
    };
    axios
      .put(UPDATE_LEAGUE + id, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);

        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 1000,
        });

        setStateBtn(0);
      })
      .catch((error) => {
                toast.error("some error occured", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  return (
    <>
      <div className="help-modal-container">
        <div className="help-modal-box">
          <header className="headerEditor">
            <p className="common-fonts add-new-blog">
              {" "}
              Upload Tournament Images
            </p>
          </header>
          <div>
            <p className="helpTitle tour_upload_logo">Upload Logo</p>
            <div className="bmp-upload">
              <div className="contact-browse deal-doc-file">
                <span
                  className="common-fonts tour_modal_input contact-tab-input"
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    className="contact-browse-btn common-fonts"
                    onClick={handleLogoButtonClick}
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
                    ref={fileLogoInputRef}
                    onChange={handleLogoFileChange}
                  />
                  {isUploading ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      {fileLogoName ? fileLogoName : ""}
                      {}
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
                    src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/league/${id}/${fileLogoName}`}
                    alt="logo"
                    className="bmp-preview-image"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="helpTitle tour_upload_logo">Upload Banner</p>
            <div className="bmp-upload">
              <div className="contact-browse deal-doc-file">
                <span
                  className="common-fonts tour_modal_input contact-tab-input"
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    className="contact-browse-btn common-fonts"
                    onClick={handleBannerButtonClick}
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
                    ref={fileBannerInputRef}
                    onChange={handleBannerFileChange}
                  />
                  {isBannerUploading ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      {fileBannerName ? fileBannerName : ""}
                      {}
                    </span>
                  )}
                </span>
              </div>

              {selectedBannerFile && (
                <div className="bmp-image-preview">
                  <img
                    src={URL.createObjectURL(selectedBannerFile)}
                    alt="Selected Preview"
                    className="bmp-preview-image"
                  />
                </div>
              )}

              {!selectedBannerFile && (
                <div className="bmp-image-preview">
                  <img
                    src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/league/${id}/${fileBannerName}`}
                    alt="logo"
                    className="bmp-preview-image"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="tour_new_file bmp-gap">
            <div className="contact-browse deal-doc-file tour_upload">
              <span
                className="common-fonts tour_modal_input tour_modal_input_2 contact-tab-input tour-border"
                style={{
                  position: "relative",
                }}
              >
                <button
                  className="contact-browse-btn common-fonts"
                  onClick={handleButtonClick}
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
                    {}
                  </span>
                )}
              </span>
            </div>
          </div>
          {photoUrls?.length === 0 ? (
            <div className={`support-no-ticket-found`}>
              <p className="common-fonts">No photos added</p>
            </div>
          ) : (
            <div className={`outerBox`}>
              {photoUrls?.map((photo, index) => (
                <div className="bmp-new-img tour_new_img">
                  <div className="bmp-img-top-icon">
                    <div className="bmp-img-name">
                      <div className="bmp-video">
                        <img
                          src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/league/${id}/${photo}`}
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
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </div>
                  <img
                    src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/league/${id}/${photo}`}
                    alt="Selected Preview"
                    key={index}
                  />
                </div>
              ))}
            </div>
          )}
          {stateBtn === 0 ? (
            <div className="tour_save">
              <button className="disabledBtn" disabled>
                Save
              </button>
            </div>
          ) : (
            <div className="tour_save">
              <button
                className="common-fonts common-save-button help-save"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="help-cross" onClick={onClose}>
          X
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default TournamentModal;
