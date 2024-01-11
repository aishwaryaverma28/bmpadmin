import React, { useState, useRef, useEffect } from "react";
import "../styles/bmp.css";
import { useParams } from "react-router-dom";
import Map from "../../assets/image/map.png";
import DisapproveModal from "./DisapproveModal.jsx";
import "chart.js/auto";
import axios from "axios";
import {
  GET_ACADEMY,
  UPDATE_ACADEMY,
  UPDATE_ACADMEY_STATUS,
  GET_UPDATED_ACADEMY_INFO,
  ADDRESS_API,
  getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";
import Dash from "../../assets/image/red-dash.svg";
import { removeHtmlTags } from "./removeHtml.js";
import { splitAddress } from "./splitAddress.js";
const OverviewById = () => {
  const { id } = useParams();
  localStorage.setItem("academy_id", id);
  const role_name = localStorage.getItem("role_name");
  const decryptedToken = getDecryptedToken();
  const [revokeId, setRevokeId] = useState(null);
  const [status, setStatus] = useState(null);
  const [newAcadmeyData, setNewAcadmeyData] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [keysOfNewAcadmeyData, setKeysOfNewAcadmeyData] = useState([]);
  const [academyData, setAcademyData] = useState({});
  const [academyDataOld, setAcademyDataOld] = useState({});
  const [phoneNumberCount, setPhoneNumberCount] = useState(1);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isWhatsappActivated, setIsWhatsappActivated] = useState(true);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [stateBtn, setStateBtn] = useState(0);
  const [selectedDaysString, setSelectedDaysString] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [updatedFields, setUpdatedFields] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedLanguageName, setSelectedLanguageName] = useState("");
  const [mappedLanguages, setMappedLanguages] = useState([]);
  const [languageString, setLanguageString] = useState("");
  const [progress, setProgress] = useState(null);
  const [progressArray, setProgressArray] = useState([]);
  const [number, setNumber] = useState(0);
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [number3, setNumber3] = useState(0);
  const [number4, setNumber4] = useState(0);
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  let joinLanguage;
  const languages = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Russian", label: "Russian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Telugu", label: "Telugu" },
    { value: "Kannada", label: "Kannada" },
    { value: "Tamil", label: "Tamil" },
    { value: "Marathi", label: "Marathi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Urdu", label: "Urdu" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Odia", label: "Odia" },
    { value: "Sindhi", label: "Sindhi" },
    { value: "Bhojpuri", label: "Bhojpuri" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapLink, setMapLink] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const result={}
  //=====================================for disapprove modal
  const [open, setOpen] = useState(false);
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [keywords, setKeywords] = useState([
    "murder",
    "kill",
    "killer",
    "kill you",
  ]);

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = () => {
    setOpen(false);
  }



  //===================================================================extra functions for approve n disapprove
  const updatedAcadmeyInfo = () => {
    axios
      .post(
        GET_UPDATED_ACADEMY_INFO,
        {
          academy_id: id,
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
    if (newAcadmeyData && Object.keys(newAcadmeyData).length > 0) {
      setAcademyData((prevAcadmeyData) => {
        return { ...prevAcadmeyData, ...newAcadmeyData };
      });
    }
    if (keysOfNewAcadmeyData.includes("sport")) {
      setSelectedDays(newAcadmeyData?.sport?.split(",") || []);
    }
    if (keysOfNewAcadmeyData.includes("spoken_languages")) {
      const languages = newAcadmeyData?.spoken_languages?.split(", ");
      const newLanguage = languages?.map((lang) => {
        const [language, level] = lang.split("(");
        return {
          language: language.trim(),
          level: level.substring(0, level.length - 1).trim(),
        };
      });
      setMappedLanguages([...newLanguage]);
    }
    if (keysOfNewAcadmeyData.includes("address1")) {
      const addressComponents = [
        newAcadmeyData?.address1,
        newAcadmeyData?.address2,
        newAcadmeyData?.city,
        newAcadmeyData?.state,
      ];
      const formattedAddress = addressComponents
        .filter((component) => component && component.trim() !== "")
        .join(", ");
      setAddress(formattedAddress || "");
      setCoordinate(newAcadmeyData?.coordinate || "");
      setMapLink(newAcadmeyData?.map || "");
    }
    if (keysOfNewAcadmeyData.includes("timing")) {
      console.log(newAcadmeyData?.timing)
      const timingParts = newAcadmeyData?.timing?.split(" - ");
      console.log(timingParts)
      if (timingParts.length === 2) {
        // const [startTime, endTime] = timingParts;
        const [startTime, endTime] = timingParts.map(time => time.trim());
        setSelectedStartTime(startTime);
        setSelectedEndTime(endTime);
      }
    }
    if (keysOfNewAcadmeyData.includes("logo")) {
      setFileName(newAcadmeyData.logo);
    }
  };
  useEffect(() => {
    if (status === 0 && role_name === "Academy") {
      updateAcadmeyData();
    }
  }, [newAcadmeyData, status, role_name]);

  // console.log(newAcadmeyData);
  // console.log(academyData);
  // console.log(keysOfNewAcadmeyData);
  //==============================================================acadmey data
  const academyDetails = () => {
    axios
      .get(GET_ACADEMY + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const academyName = response?.data?.data[0]?.name;
        const cityName = response?.data?.data[0]?.city;
        console.log(response?.data?.about[0]?.about.replace('ACADENY_NAME', academyName).replace('CITY_NAME', cityName));
        const intro = removeHtmlTags(response?.data?.about[0]?.about.replace('ACADENY_NAME', academyName).replace('CITY_NAME', cityName))
        
        setIntroduction(intro);
        console.log(intro)
        const addressComponents = [
          response?.data?.data[0]?.address1,
          response?.data?.data[0]?.address2,
          response?.data?.data[0]?.city,
          response?.data?.data[0]?.state,
        ];
        const formattedAddress = addressComponents
          .filter((component) => component && component?.trim() !== "")
          .join(", ");
        setSelectedLanguage(response?.data?.data[0]?.spoken_languages);
        setAcademyData(response?.data?.data[0]);
        setAcademyDataOld(response?.data?.data[0]);
        setAddress(formattedAddress || "");
        setCoordinate(response?.data?.data[0]?.coordinate || "");
        setMapLink(response?.data?.data[0]?.map || "");
        setProgress(response?.data?.data[0]?.completion_percentage);
        setSelectedDays(response?.data?.data[0]?.sport?.split(",") || []);
        if (
          response?.data?.data[0]?.completion_percentage !== "" &&
          response?.data?.data[0]?.completion_percentage !== null
        ) {
          setProgressArray(
            response?.data?.data[0]?.completion_percentage.split(",")
          );
        }
        if (response?.data?.data[0]?.spoken_languages === null) {
          setMappedLanguages([
            {
              language: "Hindi",
              level: "Intermediate",
            },
            {
              language: "English",
              level: "Intermediate",
            },
          ]);
        } else {
          const languages = response?.data?.data[0]?.spoken_languages.split(", ");
  
          const newLanguage = languages.map((lang) => {
            const [language, level] = lang.split("(");
            return {
              language: language.trim(),
              level: level.substring(0, level.length - 1).trim(),
            };
          });
  
          setMappedLanguages([...newLanguage]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        setIsLoading(false);
      });
  };
  //=======================================================================language
  const handlelanguageNameChange = (e) => {
    setSelectedLanguageName(e.target.value);
  };
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };
  const handleAddLanguage = () => {
    setStateBtn(1);
    updateField("spoken_languages");
    if (selectedLanguageName && selectedLevel) {
      const newLanguage = {
        language: selectedLanguageName,
        level: selectedLevel,
      };
      setMappedLanguages([...mappedLanguages, newLanguage]);
      joinLanguage = mappedLanguages?.concat(newLanguage)?.map((lang) => `${lang.language}(${lang.level})`)?.join(", ");
      setLanguageString(joinLanguage);
    }
  };
  const handleDeleteLanguage = (index) => {
    setStateBtn(1);
    const updatedLanguages = [...mappedLanguages];
    const newArr = [
      ...updatedLanguages.slice(0, index),
      ...updatedLanguages.slice(index + 1),
    ];
    if (newArr.length === 0) {
      setNumber(1);
    } else {
      setNumber(0);
    }
    setMappedLanguages([...newArr]);

    joinLanguage = newArr
      .map((lang) => `${lang.language}(${lang.level})`)
      .join(", ");
    setLanguageString(joinLanguage);
  };
  //=================================================================google address
  const handleInputChange = async (value) => {
    setStateBtn(1);
    setAddress(value);
    try {
      const response = await axios.get(`https://www.zomato.com/webroutes/location/search?q=${value}`);
      // console.log(response?.data?.locationSuggestions);
      if (response?.status === 200) {
        setSuggestions(response?.data?.locationSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };


  const handleSelectAddress = (selectedAddress) => {
    result = splitAddress(selectedAddress)
    // console.log(selectedAddress)
    setAddress(selectedAddress?.entity_name);
    if (selectedAddress?.length === 0) {
      setNumber2(1);
    } else {
      setNumber2(0);
    }
    setStateBtn(1);
    setCoordinate(`${selectedAddress?.entity_latitude},${selectedAddress?.entity_longitude}`);
    if (`${selectedAddress?.entity_latitude},${selectedAddress?.entity_longitude}`.length === 0) {
      setNumber4(1);
    } else {
      setNumber4(0);
    }
    setMapLink(
      `https://www.google.com/maps?q=${selectedAddress?.entity_latitude},${selectedAddress?.entity_longitude}`
    );
    if (mapLink.length === 0) {
      setNumber3(1);
    } else {
      setNumber3(0);
    }
    setSuggestions([]);

  };

  const updateField = (fieldName) => {
    if (!updatedFields.includes(fieldName)) {
      setUpdatedFields([...updatedFields, fieldName]);
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsWhatsappActivated(checked);

    if (checked) {
      setPhoneNumberCount(1);
      setIsButtonVisible(true);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const hour = hours < 10 ? `0${hours}` : `${hours}`;
        const minute = minutes === 0 ? "00" : `${minutes}`;
        const time = `${hour}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
    updateField("timing");
    setStateBtn(1);
  };
  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
    updateField("timing");
    setStateBtn(1);
  };

  useEffect(() => {
    academyDetails();
    updatedAcadmeyInfo();
  }, []);
  useEffect(() => {
    if (academyData && academyData.timing !== null) {
      const timingParts = academyData?.timing?.split("-")?.map(part => part?.trim());
      if (timingParts?.length === 2) {
        const [startTime, endTime] = timingParts;
        setSelectedStartTime(startTime);
        setSelectedEndTime(endTime);
      }
    } else {
      // If academyData.timing is null, set default values
      setSelectedStartTime("10:00");
      setSelectedEndTime("19:00");
    }
  }, [academyData]);
  
  
  const processImageName = (imageName) => {
    const nameParts = imageName?.split(".");
    if (nameParts.length > 1) {
      const namePart = nameParts?.slice(0, -1)?.join(".");
      const processedName = namePart?.replace(/[^\w-]/g, "-");
      return `${processedName}.${nameParts[nameParts.length - 1]}`;
    } else {
      return imageName.replace(/[^\w-]/g, "-");
    }
  };

  const handleFileChange = (event) => {
    setStateBtn(1);
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        alert("Please choose a valid image file (JPEG, PNG, GIF).");
        return;
      }
      submitImage(event.target.files[0]);
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
      const folder = "bookmyplayer/academy/" + id;
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
          updateField("logo");
          setFileName(processImageName(selectedImage.name));
          if (processImageName(selectedImage.name).length === 0) {
            setNumber1(1)
          } else {
            setNumber1(0)
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };
  function handleChange(event) {
    const { name, value } = event.target;
    let redText = false;
    let disableSaveButton = false;
    const words = value.split(" ");
    let textRestrict = "";
    words.forEach((word) => {
      if (keywords.includes(word?.toLowerCase())) {
        textRestrict = word;
        redText = true;
        disableSaveButton = true;
      }
    });
    if (redText) {
      alert(`Warning: The word "${textRestrict}" is a restricted keyword.`);
      event.target.style.color = "red";
    } else {
      event.target.style.color = "";
    }
    if (academyData[name] !== value) {
      setStateBtn(disableSaveButton ? 0 : 1);
      updateField(name);
    }
    setAcademyData({ ...academyData, [name]: value });
  }

  const handleDayClick = (day) => {
    setStateBtn(1);
    if (selectedDays?.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
      updateField("sport");
    } else {
      setSelectedDays([...selectedDays, day]);
      updateField("sport");
    }
  };

  useEffect(() => {
    setSelectedDaysString(selectedDays.join(","));
  }, [selectedDays]);

  const handleButtonClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };


  const addPhoneNumberInput = () => {
    setIsWhatsappActivated(false);
    setPhoneNumberCount(phoneNumberCount + 1);
    setIsButtonVisible(false);
  };
  const startAndEndTime = `${selectedStartTime} - ${selectedEndTime}`;

  // console.log(selectedDays)
  function handleSubmit(event) {
    event.preventDefault();
    if (!progressArray?.includes("1")) {
      progressArray.push("1");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray?.join(",");
    const spokenLanguagesChanged =
      languageString !== academyData?.spoken_languages;
    const sportsChanged =
      selectedDaysString?.replace(/^,+/g, "") !== academyData?.sport;
    const addressComponents = [
      academyData?.address1,
      academyData?.address2,
      academyData?.city,
      academyData?.state,
    ];
    const formattedAddress = addressComponents
      .filter((component) => component && component.trim() !== "")
      .join(", ");
    const addressChanged = address !== formattedAddress;
    const maplinkChanged = mapLink !== academyData?.map;
    const coordinateChanged = coordinate !== academyData?.coordinate;
    const timingChanged = startAndEndTime !== academyData?.timing;
    const logoChanged = fileName !== academyData?.fileName;
    const progressChanged = combinedProgress !== academyData?.completion_percentage;
    const updatedFormData = {};
    const hasChanged = (field) =>
      academyData?.[field] !== academyDataOld?.[field];
    if (hasChanged("name")) {
      updatedFormData.name = academyData.name;
    }
    if (hasChanged("about")) {
      updatedFormData.about = academyData.about;
    }
    if (hasChanged("phone")) {
      updatedFormData.phone = academyData.phone;
    }
    if (hasChanged("whatsapp")) {
      updatedFormData.whatsapp = academyData.whatsapp;
    }
    if (hasChanged("experience")) {
      updatedFormData.experience = academyData.experience;
    }
    if (hasChanged("facebook")) {
      updatedFormData.facebook = academyData.facebook;
    }
    if (hasChanged("instagram")) {
      updatedFormData.instagram = academyData.instagram;
    }
    if (hasChanged("website")) {
      updatedFormData.website = academyData.website;
    }
    if (hasChanged("email")) {
      updatedFormData.email = academyData.email;
    }
    if (hasChanged("timing")) {
      updatedFormData.timing = startAndEndTime;
    }
    if (spokenLanguagesChanged && languageString !== "") {
      updatedFormData.spoken_languages = languageString;
    }
    if (number === 1) {
      updatedFormData.spoken_languages = languageString;
    }
    if (sportsChanged) {
      updatedFormData.sport = selectedDaysString?.replace(/^,+/g, "");
    }
    if (timingChanged) {
      updatedFormData.timing = startAndEndTime;
    }
    if (logoChanged && fileName !== "") {
      updatedFormData.logo = fileName;
    }
    if (progressChanged && combinedProgress !== "") {
      updatedFormData.completion_percentage = combinedProgress;
    }
    if (number1 === 1) {
      updatedFormData.logo = fileName;
    }
    if (addressChanged && address !== "") {
      updatedFormData.address1 = address;
    }
    if (maplinkChanged && mapLink !== "") {
      updatedFormData.map = mapLink;
    }
    if (coordinateChanged && coordinate !== "") {
      updatedFormData.coordinate = coordinate;
    }
    if (number2 === 1) {
      updatedFormData.address1 = address;
    }
    if (number3 === 1) {
      updatedFormData.map = mapLink;
    }
    if (number4 === 1) {
      updatedFormData.coordinate = coordinate;
    }
    axios
      .put(UPDATE_ACADEMY + id, updatedFormData, {
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
    if (!progressArray?.includes("1")) {
      progressArray.push("1");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray?.join(",");

    const updatedFormData = {
      completion_percentage: combinedProgress,
      name: academyData.name,
      about: academyData.about,
      phone: academyData.phone,
      whatsapp: academyData.whatsapp,
      sport: selectedDaysString?.replace(/^,+/g, ""),
      experience: academyData.experience,
      facebook: academyData.facebook,
      instagram: academyData.instagram,
      website: academyData.website,
      email: academyData.email,
      timing: startAndEndTime,
      spoken_languages: academyData.spoken_languages,
      logo: academyData.logo,
      address1: address,
      map: mapLink,
      coordinate: coordinate
    }
    axios
      .put(UPDATE_ACADEMY + id, updatedFormData, {
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
    <>
      <div className="bmp-container">
        <div>
          <p className="common-fonts bmp-top">Address & Contact details</p>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Academy name
            </label>
            <input
              type="text"
              className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("name") ? "redBorderLine" : ""}`}
              name="name"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.name || ""}
            />
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Introduction
            </label>
            <textarea
              name="about"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.about === null ? introduction : academyData?.about}
              id=""
              className={`common-fonts bmp-textarea ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("about") ? "redBorderLine" : ""}`}
              rows="2"
            ></textarea>
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Address
            </label>
            <div className="relativeInput">
              <input
                type="text"
                value={address}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type your address..."
                className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("address1") ? "redBorderLine" : ""}`}
              />
              {suggestions?.length > 0 && address?.length !== 0 && (
                <div className="autocomplete-dropdown">
                  {suggestions.map((address) => (
                    <div
                      key={address?.entity_latitude}
                      onClick={() => handleSelectAddress(address)}
                    >
                      {address?.entity_name}
                    </div>
                  ))}
                </div>
              )}
              {/* {address && (
                <div>
                  <p>Selected Address: {address}</p>
                  <p>
                    Selected Coordinates: {coordinate}
                  </p>
                  <p>
                    Google Map Link:{' '}
                    <a href={mapLink} target="_blank" rel="noopener noreferrer">
                      {mapLink}
                    </a>
                  </p>
                </div>
              )} */}
            </div>
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Select your sport
            </label>
            <div className={`bmp-games ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("sport") ? "redBorderLine" : ""}`}>

              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("arts") ? "bmp-game-active" : ""
                  } `}
                onClick={() => handleDayClick("arts")}
              >
                Arts
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("atheletics")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("atheletics")}
              >
                Atheletics
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("badminton")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("badminton")}
              >
                Badminton
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("basketball")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("basketball")}
              >
                Basketball
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("billiards")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("billiards")}
              >
                Billiards
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("boxing")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("boxing")}
              >
                Boxing
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("chess")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("chess")}
              >
                Chess
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("cricket")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("cricket")}
              >
                Cricket
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("fencing")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("fencing")}
              >
                fencing
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("football")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("football")}
              >
                football
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("golf")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("golf")}
              >
                golf
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("hockey")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("hockey")}
              >
                hockey
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("kabaddi")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("kabaddi")}
              >
                Kabaddi
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("kho-kho")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("kho-kho")}
              >
                kho-kho
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("mma")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("mma")}
              >
                MMA
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("motor sports")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("motor sports")}
              >
                Motor sports
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("shooting")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("shooting")}
              >
                Shooting
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("skating")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("skating")}
              >
                Skating
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("squash")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("squash")}
              >
                Squash
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("swimming")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("swimming")}
              >
                Swimming
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("table-tennis")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("table-tennis")}
              >
                Table-tennis
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("taekwondo")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("taekwondo")}
              >
                Taekwondo
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("tennis")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("tennis")}
              >
                Tennis
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("volleyball")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("volleyball")}
              >
                Volleyball
              </div>
              <div
                className={`common-fonts bmp-game-list ${selectedDays?.includes("wrestling")
                  ? "bmp-game-active"
                  : ""
                  } `}
                onClick={() => handleDayClick("wrestling")}
              >
                Wrestling
              </div>
            </div>
          </div>
          {[...Array(phoneNumberCount)]?.map((_, index) => (
            <div className="bmp-input-flex" key={index}>
              <div className="bmp-phone-field">
                <label htmlFor="" className="common-fonts bmp-academy-name">
                  {index === 0 ? "Phone Number" : `Whatsapp Number`}
                </label>

                {index === 0 && (
                  <div className="bmp-whatsapp-check">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                        checked={isWhatsappActivated}
                        onChange={handleCheckboxChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <p className="common-fonts light-color">
                      Whatsapp Activated
                    </p>
                  </div>
                )}
              </div>

              <input
                type="number"
                className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("phone") ? "redBorderLine" : ""}`}
                name={index === 0 ? "phone" : "whatsapp"}
                onChange={handleChange}
                value={
                  isLoading
                    ? "-"
                    : index === 0
                      ? academyData?.phone
                      : academyData?.whatsapp
                }
              />
            </div>
          ))}

          {isButtonVisible && (
            <div>
              <button
                className="common-fonts common-white-blue-button bmp-add-phone"
                onClick={addPhoneNumberInput}
              >
                + Add Phone Number
              </button>
            </div>
          )}

          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Email
            </label>
            <input
              type="email"
              name="email"
              className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("email") ? "redBorderLine" : ""}`}
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.email || ""}
              style={{ textTransform: "none" }}
            />
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Website
            </label>
            <input
              type="text"
              name="website"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.website || ""}
              className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("website") ? "redBorderLine" : ""}`}
            />
          </div>

          <div className="bmp-input-flex">
            <label className="common-fonts bmp-academy-name">
              Experience:{" "}
            </label>
            <select
              className={`common-fonts common-input langSelect ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("experience") ? "redBorderLine" : ""}`}
              name="experience"
              onChange={handleChange}
            >
              <option value="">Select Experience</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="20+">20+</option>
            </select>
          </div>

          <div className="bmp-input-flex bmp-last-time">
            <div className="bmp-phone-field">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Open Timings
              </label>
              
            </div>
            <div className="bmp-input-flex-2 bmp-add-fields bmp-new-timing">
              <select
                className={`common-fonts common-input bmp-modal-select-2 overviewTime ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("timing") ? "redBorderLine" : ""}`}
                value={selectedStartTime}
                onChange={handleTimeChange}
              >
                <option value="">Select Opening time</option>
                {timeOptions?.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <p className="common-fonts light-color bmp-to">To</p>
              <select
                className={`common-fonts common-input bmp-modal-select-2 overviewTime ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("timing") ? "redBorderLine" : ""}`}
                value={selectedEndTime}
                onChange={handleEndTimeChange}
              >
                <option value="">Select closing time</option>
                {timeOptions?.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <ProgressBar array={progressArray} />
          <div className="bmp-right-fields">
            <p className="common-fonts">Upload Academic Logo</p>
            <p className="common-fonts">Recommended image size 190x190</p>

            <div className="bmp-upload">
              <div className="contact-browse deal-doc-file">
                <span
                  className={`common-fonts common-input contact-tab-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("logo") ? "redBorderLine" : ""}`}
                  style={{
                    position: "relative",
                    marginRight: "10px",
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
                  />
                  {isUploading ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      {fileName ? fileName : academyData?.logo}
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
                    src={academyData?.logo === null
                      ? "https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/510/download--1-.png"
                      : `https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${id}/${academyData?.logo}`}
                    alt=""
                    className="bmp-preview-image"
                  />
                </div>
              )}
            </div>

            <p className="common-fonts bmp-social">
              Connect Social Media Account
            </p>

            <div className="bmp-input-flex">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Facebook
              </label>
              <input
                type="text"
                className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("facebook") ? "redBorderLine" : ""}`}
                name="facebook"
                onChange={handleChange}
                value={isLoading ? "-" : academyData?.facebook || ""}
              />
            </div>
            <div className="bmp-input-flex">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Instagram
              </label>
              <input
                type="text"
                className={`common-fonts common-input bmp-input ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("instagram") ? "redBorderLine" : ""}`}
                name="instagram"
                onChange={handleChange}
                value={isLoading ? "-" : academyData?.instagram || ""}
              />
            </div>

            <div className="bmp_overview_language_flex">
              <p className="common-fonts bmp-social">Language</p>

              <button
                className="common-white-blue-button"
                onClick={handleAddLanguage}
              >
                + Add Language
              </button>
            </div>

            <div className="bmp-input-flex bmp_language_box">
              <div>
                <label className="common-fonts bmp-academy-name">
                  Language
                </label>
                <select
                  value={selectedLanguageName}
                  onChange={handlelanguageNameChange}
                  className="common-fonts common-input langSelect level_input"
                >
                  <option value="">Select your language</option>
                  {languages?.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="common-fonts bmp-academy-name">Level</label>
                <select
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="common-fonts common-input langSelect level_input"
                >
                  <option value="">Select your Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Mastery">Mastery</option>
                </select>
              </div>
            </div>

            {mappedLanguages?.map((mappedLanguage, index) => (
              <div className={`bmp_overview_language_map ${status === 0 && role_name === "Academy Admin" && keysOfNewAcadmeyData.includes("spoken_languages") ? "redBorderLine" : ""}`} key={index}>
                <p className="common-fonts">
                  {mappedLanguage.language} ({mappedLanguage.level})
                </p>
                <img
                  src={Dash}
                  alt=""
                  onClick={() => handleDeleteLanguage(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bmp-bottom-btn">
        {status === 0 && role_name === "Academy Admin" ? <>
          <button onClick={openModal}
            className="common-save-button common-delete-button">
            Disapprove
          </button>
          <button onClick={handleApprove}
            className="common-save-button common-save">
            Approve
          </button>
        </>
          : <>
            <button className="common-fonts common-white-button">cancel</button>
            {stateBtn === 0 ? (
              <button className="disabledBtn">Save</button>
            ) : (
              <button
                className="common-save-button common-save"
                onClick={handleSubmit}
              >
                Save
              </button>
            )}
          </>
        }
      </div>
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
    </>
  );
};

export default OverviewById;
