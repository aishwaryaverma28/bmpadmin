import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewProfile from "./ViewProfile";
import profile from "../../assets/image/profile-2.jpg";
import "../styles/EmployeeProfile.css";
import {
  EMPLOYEE_UPDATE,
  REMOVE_DOC,
  UPLOAD_DOC,
  VIEW_IMG,
  getDecryptedToken,
  handleLogout,
  GET_USER_EMPLOYEE,
} from "../utils/Constants";
import TimeSheet from "./TimeSheet.jsx";
import EmployeeDocuments from "./EmployeeDocuments.jsx";
import SalarySlip from "./SalarySlip.jsx";
const userId = localStorage.getItem("id");
const EmployeeProfile = () => {
  const [empData, setEmpData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [address, setAddress] = useState("");
  const [age, setAge] = useState(null);
  const [pic, setPic] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const decryptedToken = getDecryptedToken();
  const [formData, setFormData] = useState({
    profile: "",
  });
  const fileInputRef = useRef(null);
  const [initialEmpData, setInitialEmpData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  useEffect(() => {
    getUser();
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    ageCal();
  }, [empData]); // Call ageCal whenever empData changes

  async function getUser() {
    try {
      const response = await axios.get(GET_USER_EMPLOYEE, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response?.data?.data;
      if (response?.data?.status === 1) {
        setEmpData(data[0]);
        console.log(response.data[0])
        setInitialEmpData(data[0]);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  }


  function ageCal() {
    if (empData && empData?.creation_date) {
      let dob = empData?.dob ? empData?.dob.split("T")[0].split("-")[0] : "";
      let empAge = currentYear - dob;
      setAge(empAge);
      let add =
        empData?.address1 + ", " + empData?.city + ", " + empData?.state;
      setAddress(add);
      setDocumentUrl(empData?.profile_image);
      setPic(VIEW_IMG + empData?.profile_image);
    }
  }
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

    if (documentUrl) {
      // Delete the previously uploaded image
      try {
        await axios.delete(REMOVE_DOC + documentUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
        });
      } catch (error) {
        console.error("Error deleting previous image:", error);
      }
    }

    try {
      const response = await axios.post(UPLOAD_DOC, formData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      console.log("Image uploaded successfully:", response?.data);
      setSelectedImage(file);
      setDocumentUrl(response?.data?.data);
      setPic(VIEW_IMG + response?.data?.data);
      // setProfileImage(VIEW_IMG + response.data.data);
      // Perform any additional actions on successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error condition
    }
  };
  //  console.log(pic)
  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      profile_image: documentUrl,
    };
    axios
      .put(EMPLOYEE_UPDATE + userId, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
      });
  }
  const resetForm = () => {
    setEmpData(initialEmpData);
    setSelectedImage(null);
    setDocumentUrl("");
    setFormData({
      profile: "",
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* <ViewProfile />
      <div className="userProfile">
        <div className="profileImage">
          <p>profile image</p>
          <img src={pic ? pic : profile} alt="image" />
          <br />
          <input
            type="file"
            name="employeeDoc"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
          <button onClick={handleButtonClick} className="browseBtn">
            change profile image
          </button>
        </div>
        <div className="dateTime">
          <p>
            added on{" "}
            {empData && empData?.creation_date
              ? empData?.creation_date.split("T")[0]
              : "-"}
          </p>
        </div>
      </div>

      <div className="personalDetails">
        <div className="detailsFirstSection">
          <p>employee details</p>
          <ul>
            <li>
              <p>First Name</p>
              <span>
                {empData && empData?.first_name !== undefined
                  ? empData?.first_name
                  : "-"}
              </span>
            </li>
            <li>
              <p>Middle Name</p>
              <span>-</span>
            </li>
            <li>
              <p>Last Name</p>
              <span>
                {empData && empData?.last_name !== undefined
                  ? empData?.last_name
                  : "-"}
              </span>
            </li>
            <li>
              <p>Age </p>
              <span>{age}</span>
            </li>
            <li>
              <p>DOB </p>
              <span>
                {empData && empData?.dob ? empData?.dob.split("T")[0] : "-"}
              </span>
            </li>
            <li>
              <p>Working Since </p>
              <span>
                {empData && empData?.hire_date
                  ? empData?.hire_date.split("T")[0]
                  : ""}
              </span>
            </li>
            <li>
              <p>Job Title </p>
              <span>
                {empData && empData?.hire_date
                  ? empData?.hire_date.split("T")[0]
                  : ""}
              </span>
            </li>
            <li>
              <p>Permanent Address </p>
              <span>{address}</span>
            </li>
            <li>
              <p>Country</p>{" "}
              <span>
                {empData && empData?.country !== undefined
                  ? empData?.country
                  : "-"}
              </span>
            </li>
          </ul>
        </div>
        <div className="detailsSecondSection">
          <p>contact details</p>
          <ul>
            <li>
              <p>Personal Number </p>
              <span>
                {empData && empData?.mobile !== undefined
                  ? empData?.mobile
                  : "-"}
              </span>
            </li>
            <li>
              <p>Work Phone </p>
              <span>
                {empData && empData?.mobile !== undefined
                  ? empData?.mobile
                  : "-"}
              </span>
            </li>
            <li>
              <p>Work Email </p>
              <span>
                {empData && empData?.personal_email !== undefined
                  ? empData?.personal_email
                  : "-"}
              </span>
            </li>
            <li>
              <p>Email </p>
              <span>
                {empData && empData?.personal_email !== undefined
                  ? empData?.personal_email
                  : "-"}
              </span>
            </li>
          </ul>
          <p>manager details</p>
          <ul>
            <li>
              <p>Reporting Manager </p>
              <span>John wick</span>
            </li>
            <li>
              <p>Contact Number </p>
              <span>8954123974</span>
            </li>
            <li>
              <p>Email id </p>
              <span>johnwick001@gmail.com</span>
            </li>
          </ul>
          <p>social media links</p>
          <ul>
            <li>
              <p>LinkedIn </p>
              <span>
                {empData && empData?.social1 !== undefined
                  ? empData?.social1
                  : "-"}
              </span>
            </li>
            <li>
              <p>Facebook </p>
              <span>
                {empData && empData?.social2 !== undefined
                  ? empData?.social2
                  : "-"}
              </span>
            </li>
          </ul>
        </div>
        <div className="detailsSecondSection">
          <p>Bank Details</p>
          <ul>
            <li>
              <p>Bank Name </p>
              <span>
                {empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[0]
                  : ""}
              </span>
            </li>
            <li>
              <p>Account Number </p>
              <span>
                {empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[1]
                  : ""}
              </span>
            </li>
            <li>
              <p>IFSC Code</p>
              <span>
                {empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[2]
                  : ""}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="timesheetSaveBtn">
        <button type="button" className="cancleBtn" onClick={resetForm}>
          cancel
        </button>
        <button type="button" className="changesaveBtn" onClick={handleSubmit}>
          Save Changes
        </button>
      </div> */}

      <p className="common-fonts profile-heading">Profile</p>

      <div className="user-team-setting-btn user-team-font">
          <button
            className={`user-team-btn ${
              activeTab === "personal" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("personal")}
          >
            Personal Details
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "timesheets" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("timesheets")}
          >
            Time Sheet
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "documents" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("documents")}
          >
            Documents
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "salary" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("salary")}
          >
            Salary
          </button>
        </div>
        {
          activeTab==="personal" && (
            <>

            <div className="profile-pic-btn">

            <div className="profile-top-pic">
            <img src={pic ? pic : profile} alt="image" />
            <input
            type="file"
            name="employeeDoc"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
            </div>

            <button onClick={handleButtonClick} className="common-fonts common-white-green-button">Change Profile Image</button>
            </div>

            
            <div className="profile-view-all">
              <div>
              <div className="profile-new-box">
              <div className="profile-employee-heading">
                    <p className="common-fonts profile-emp-details">Employee Details</p>
                </div>
                <div className="profile-employee-info">
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">First Name</p>
                    <p className="common-fonts "> {empData && empData?.first_name !== undefined
                  ? empData?.first_name
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Middle Name</p>
                    <p className="common-fonts ">-</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Last Name</p>
                    <p className="common-fonts "> {empData && empData?.last_name !== undefined
                  ? empData?.last_name
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Age</p>
                    <p className="common-fonts ">{age}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Dob</p>
                    <p className="common-fonts "> {empData && empData?.dob ? empData?.dob.split("T")[0] : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Working Since</p>
                    <p className="common-fonts">{empData && empData?.hire_date
                  ? empData?.hire_date.split("T")[0]
                  : ""}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Job Title</p>
                    <p className="common-fonts">{empData && empData?.hire_date
                  ? empData?.hire_date.split("T")[0]
                  : ""}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Permanent Address</p>
                    <p className="common-fonts">{address}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Country</p>
                    <p className="common-fonts">{empData && empData?.country !== undefined
                  ? empData?.country
                  : "-"}</p>
                   </div>
                </div>
              </div>
              <div className="profile-new-box">
              <div className="profile-employee-heading">
                    <p className="common-fonts profile-emp-details">Contact Details</p>
                </div>
                <div className="profile-employee-info">
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Personal Number</p>
                    <p className="common-fonts"> {empData && empData?.mobile !== undefined
                  ? empData?.mobile
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Work Phone</p>
                    <p className="common-fonts"> {empData && empData?.mobile !== undefined
                  ? empData?.mobile
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Work Email</p>
                    <p className="common-fonts profile-new-email"> {empData && empData?.personal_email !== undefined
                  ? empData?.personal_email
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Email</p>
                    <p className="common-fonts profile-new-email"> {empData && empData?.personal_email !== undefined
                  ? empData?.personal_email
                  : "-"}</p>
                   </div>
                </div>
              </div>

              </div>

              <div>
              <div className="profile-new-box">
              <div className="profile-employee-heading">
                    <p className="common-fonts profile-emp-details">Manager Details</p>
                </div>
                <div className="profile-employee-info">
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Reporting Manager</p>
                    <p className="common-fonts">John wick</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Contact Number</p>
                    <p className="common-fonts">9698587415</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Email</p>
                    <p className="common-fonts profile-new-email">johnwick001@gmail.com</p>
                   </div>
                </div>
              </div>

              <div className="profile-new-box">
              <div className="profile-employee-heading">
                    <p className="common-fonts profile-emp-details">Social Media Links</p>
                </div>
                <div className="profile-employee-info">
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">LinkedIn</p>
                    <p className="common-fonts"> {empData && empData?.social1 !== undefined
                  ? empData?.social1
                  : "-"}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Facebook</p>
                    <p className="common-fonts">{empData && empData?.social2 !== undefined
                  ? empData?.social2
                  : "-"}</p>
                   </div>
                </div>
              </div>

              <div className="profile-new-box">
              <div className="profile-employee-heading">
                    <p className="common-fonts profile-emp-details">Bank Details</p>
                </div>
                <div className="profile-employee-info">
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Bank Name</p>
                    <p className="common-fonts"> {empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[0]
                  : ""}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">Account Number</p>
                    <p className="common-fonts"> {empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[1]
                  : ""}</p>
                   </div>
                   <div className="info-of-employee">
                    <p className="common-fonts profile-left-side">IFSC Code</p>
                    <p className="common-fonts profile-new-email">{empData && empData?.bank_details
                  ? empData?.bank_details.split(",")[2]
                  : ""}</p>
                   </div>
                </div>
              </div>

              </div>
            </div>

            <div className="profile-bottom-btn">
              <button className="common-fonts common-white-button" onClick={resetForm}>Cancel</button>
              <button className="common-save-button" onClick={handleSubmit}>Save</button>
            </div>
           
           
            </>
          )
        }
        {
          activeTab==="timesheets" && (
            <TimeSheet/>
          )
        }
        {
          activeTab==="documents" && (
            <EmployeeDocuments/>
          )
        }
        {
          activeTab==="salary" && (
            <SalarySlip/>
          )
        }
    </>
  );
};

export default EmployeeProfile;
