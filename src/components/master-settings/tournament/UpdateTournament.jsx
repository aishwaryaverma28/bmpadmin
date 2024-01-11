import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
    getDecryptedToken, UPDATE_LEAGUE, GET_LEAGUE_BY_ID
} from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import LeftArrow from "../../../assets/image/arrow-left.svg";
import Trash from "../../../assets/image/red-bin.svg"
const UpdateTournament = () => {
    const { id } = useParams();
    const decryptedToken = getDecryptedToken();
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

    const [stateBtn, setStateBtn] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        sport: "",
        website: "",
        intro: "",
        phone: "",
        email: "",
        pathway: "",
        advantages: "",
        rules: "",
        description: "",
        level: "",
        category: "",
        keywords: "",
        contact: "",
        url: "",
    });
    //==============================================================get data
    const getTournamnet = () => {
        axios.get(GET_LEAGUE_BY_ID + id, {
            headers: {
                Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
            },
        })
            .then((response) => {
                // console.log(response.data.data[0])
                const data = response.data.data[0];
                setFormData({
                    ...formData,
                    name: data?.name,
                    sport: data?.sport,
                    website: data?.website,
                    intro: data?.intro,
                    phone: data?.phone,
                    email: data?.email,
                    pathway: data?.pathway,
                    advantages: data?.advantages,
                    rules: data?.rules,
                    description: data?.description,
                    level: data?.level,
                    category: data?.category,
                    keywords: data?.keywords,
                    contact: data?.contact,
                    url: data?.url,
                })
                setFileLogoName(data?.logo);
                setFileBannerName(data?.banner);
                if (
                    response?.data?.data[0]?.photos !== "" &&
                    response?.data?.data[0]?.photos !== null
                ) {
                    setPhotoUrls(data?.photos?.split(","))
                }
            })
    }
    useEffect(() => {
        getTournamnet();
    }, [])
    //==============================================================multiple image upload
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
    }
    const handleViewSite = (e) => {
        e.preventDefault();
       const siteUrl = formData?.url;
        if (siteUrl) {
            window.open(siteUrl, '_blank');
        } else {
            alert('Site URL is not available');
        }
    };
    
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => {
            return { ...prev, [name]: value };
        });
        setStateBtn(1);
    }

    const onSave = (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            logo: fileLogoName,
            banner: fileBannerName,
            photos: photoUrls.join(","),
        };
        axios.put(UPDATE_LEAGUE + id, updatedFormData, {
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
                console.log(error);
                toast.error("some error occured", {
                    position: "top-center",
                    autoClose: 1000,
                });
            })
    }
    return (
        <>
            <header className="headerEditor">
                <p className="common-fonts add-new-blog"> Add a new Tournament</p>
            </header>
            <div className="back-to-user general-refresh blog-back">
                <Link to={"/lp/settings/tournament/view"}>
                    <button className="common-fonts">
                        <img src={LeftArrow} alt="" />
                        <span>Back To Tournament Table</span>
                    </button>
                </Link>
            </div>
            <div className="helpContainer">
                <div className="helpBody">
                    <div>
                        <p className="helpTitle">Tournament Title</p>
                        <input
                            type="text"
                            placeholder="Enter Tournament Title"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div>
                        <p className="helpTitle">Introduction</p>
                        <textarea
                            name="intro"
                            type="textarea"
                            rows="3"
                            cols="3"
                            placeholder="Enter Tournament Introduction"
                            value={formData?.intro}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <p className="helpTitle">Description</p>
                        <textarea
                            name="description"
                            type="textarea"
                            rows="3"
                            cols="3"
                            placeholder="Enter Tournament Description"
                            value={formData?.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <p className="helpTitle">Pathway</p>
                        <textarea
                            name="pathway"
                            type="textarea"
                            rows="3"
                            cols="3"
                            placeholder="Enter Tournament Pathway"
                            value={formData?.pathway}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <p className="helpTitle">Advantages</p>
                        <textarea
                            name="advantages"
                            type="textarea"
                            rows="3"
                            cols="3"
                            placeholder="Enter Tournament Advantages"
                            value={formData?.advantages}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <p className="helpTitle">Rules</p>
                        <textarea
                            name="rules"
                            type="textarea"
                            rows="3"
                            cols="3"
                            placeholder="Enter Tournament Rules"
                            value={formData?.rules}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <p className="helpTitle">Upload Logo</p>
                        <div className="bmp-upload">
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
                                            { }
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
                        <p className="helpTitle">Upload Banner</p>
                        <div className="bmp-upload">
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
                                            { }
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
                                className="common-fonts common-input contact-tab-input tour-border"
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
                                        { }
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="helpRight tourHead">
                    <div className='tournamentRight'>
                        <p className="helpTitle">Website</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Website"
                            name="website"
                            value={formData?.website}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Sport</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Sport"
                            name="sport"
                            value={formData?.sport}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Phone</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Phone"
                            name="phone"
                            value={formData?.phone}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Email</p>
                        <input
                            className='tournamentInput'
                            type="email"
                            placeholder="Enter Tournament Email"
                            name="email"
                            value={formData?.email}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Level</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Level"
                            name="level"
                            value={formData?.level}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Category</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Category"
                            name="category"
                            value={formData?.category}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Keywords</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Keywords"
                            name="keywords"
                            value={formData?.keywords}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <p className="helpTitle">Contact Person</p>
                        <input
                            className='tournamentInput'
                            type="text"
                            placeholder="Enter Tournament Contact Person"
                            name="contact"
                            value={formData?.contact}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className='tournamentRight'>
                        <br/>
                        <button
                            className="common-fonts blog-add-img add-img-2 update-img"
                            onClick={handleViewSite}
                        >
                            View Site
                        </button>
                    </div>
                </div>
            </div>
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
            <div className="help-bottom-btn">
                <button className="common-fonts common-delete-button">Cancel</button>
                {stateBtn === 0 ? (
                    <button className="disabledBtn" disabled>
                        Save
                    </button>
                ) : (
                    <button
                        className="common-fonts common-save-button help-save"
                        onClick={onSave}
                    >
                        Save
                    </button>
                )}
            </div>
            <ToastContainer />
        </>
    )
}

export default UpdateTournament