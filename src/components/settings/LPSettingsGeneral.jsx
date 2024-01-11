import React, { useState, useEffect,useContext } from "react";
import { LPContext } from "../LPContext";
import LPSettingSidebar from "./LPSettingSidebar";
import "../styles/LPSetting.css";
import UserIcon from "../../assets/image/user-icon.svg"
import "../styles/LPGeneral.css";
import axios from "axios";
import { USER_INFO, USER_UPDATE, COUNTRIES,getDecryptedToken, handleLogout } from "../utils/Constants";
import EmailSyncTick from '../../assets/image/email-sync-tick.svg';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LPSettingsGeneral = () => {
  const { setName } = useContext(LPContext);
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const decryptedToken = getDecryptedToken();
  const [activeTab, setActiveTab] = useState("profile");
  const [stateBtn, setStateBtn] = useState(0);  
  const [country, setCountry] = useState("");

  useEffect(() => {
    getUser();
    getData();
  }, []);

  async function getUser() {
    try {
      const response = await axios.get(USER_INFO, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response.data.data;
      if (response.data.status === 1) {
        setClientData(data[0]);
        //   setPic(VIEW_IMG + data[0].profile_image);
      } else {
        if (response.data.message === "Token has expired") {
          alert(response.data.message);
          handleLogout();
        }
      }
      setIsLoading(false); // Set isLoading to false after data is fetched
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set isLoading to false after data is fetched
    }
  }
  async function getData() {
    try {
      const response = await axios.get(COUNTRIES);
      const data = response.data.data;
      console.log(data);
      setCountry(data);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(country);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  function handleChange(event) {
    const { name, value } = event.target;
    if (clientData[name] !== value) setStateBtn(1);
    setClientData({ ...clientData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      phone: clientData.phone,
      address1: clientData.address1,
      city: clientData.city,
      state: clientData.state,
      postcode: clientData.postcode,
    };
    setName(clientData.first_name+" "+clientData.last_name);
    axios.put(USER_UPDATE, updatedFormData, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      console.log(response);
      toast.success("User data updated successfully", {
        position:"top-center",
        autoClose:2000
      })
      
    });
    setStateBtn(0);
  }

  const resetClientData = () => {
    getUser();
  };

  return (
      <>
      <section className="genral-setting-container genral-setting-fonts">
        <div className="general-refresh">
        <p className="genral-heading">General</p>
        <button type="button" className="helpBtn genral-refresh-icon" title="Refresh" onClick={resetClientData}>
              <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
        </div>
         

          <div className="genral-setting-btn genral-setting-fonts">
            <button
              className={`genral-btn ${activeTab === "profile" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("profile")}
            >
              Profile
            </button>
            <button
              className={`genral-btn ${activeTab === "email" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("email")}
            >
              Email Sync
            </button>
            <button
              className={`genral-btn ${activeTab === "contact" ? "genral-active" : ""
                }`}
              onClick={() => handleTabClick("contact")}
            >
              Contact Sync
            </button>
          </div>
          {activeTab === "profile" && (
            <>
              <div className="genral-user genral-setting-fonts">
                <p>Profile Image</p>
                <div className="genral-image">
                  <img src={UserIcon} alt="" />
                </div>
              </div>

                <div className="genral-setting-form genral-setting-fonts">
                  <form action="">
                    <div className="genral-form-division">
                      <div className="genral-form-section1">
                        <div className="genral-form-fields">
                          <label htmlFor="">First Name</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="first_name"
                            onChange={handleChange}
                            value={isLoading ? '-' :clientData?.first_name || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">Last Name</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="last_name"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.last_name || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">Phone Number</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="phone"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.phone || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">Timezone</label>
                          <select
                            name=""
                            id=""
                            className="genral-form-select genral-setting-fonts genral-timezone"
                          >
                            <option value="">(+05:30) asia/kolkata</option>
                            {country &&
                  country.slice(0, 100).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                {country &&
                  country.slice(100, 200).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                {country &&
                  country.slice(200, 250).map((count) => (
                    <option key={count.id} value={count.country_code}>
                      {count.country_name}
                    </option>
                  ))}
                          </select>
                          <p className="timezone-note">
                            Timezone is updated automatically to match your
                            computer timezone
                          </p>
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="" className="genral-language">
                            Language
                          </label>
                          <select
                            name=""
                            id=""
                            className="genral-form-select genral-setting-fonts genral-timezone"
                          >
                            <option value="">English</option>
                          </select>
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="" className="genral-language">
                            date, time/number format{" "}
                          </label>
                          <select
                            name=""
                            id=""
                            className="genral-form-select genral-setting-fonts genral-timezone"
                          >
                            <option value="">English (united kingdom) </option>
                          </select>
                        </div>
                      </div>
                      <div className="genral-form-section2">
                        <div className="genral-form-fields">
                          <label htmlFor="">Address</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="address1"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.address1 || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">City</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="city"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.city || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">State</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="state"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.state || ""}
                          />
                        </div>

                        <div className="genral-form-fields">
                          <label htmlFor="">Postcode</label>
                          <input
                            type="text"
                            className="genral-form-input genral-setting-fonts"
                            name="postcode"
                            onChange={handleChange}
                            value={isLoading ? '-' : clientData?.postcode || ""}
                          />
                        </div>

                      </div>
                    </div>

                    <div className="general-page-btn">
                      <button className="common-white-button common-fonts left-space">Discard</button>
                      {stateBtn === 0 ? (
                        <button className="disabledBtn">Save</button>
                      ) : (
                        <button className="common-fonts common-save-button left-space" onClick={handleSubmit}>Save</button>
                      )}
                    </div>
                  </form>
                </div>

            </>
          )}
          {activeTab === "email" && <>

            <section className="genral-setting-container genral-setting-fonts">



              <div className="email-sync-content genral-setting-fonts">
                <p>Connect you personal email accounts to LeadPlaner to log, track, send and receive emails in LeadPlaner.</p>
                <ul className="email-sync-list">
                  <li><span><img src={EmailSyncTick} alt="" /></span><span>Send and schedule emails from LeadPlaner</span></li>
                  <li><span><img src={EmailSyncTick} alt="" /></span><span>Sync with any major email provider</span></li>
                  <li><span><img src={EmailSyncTick} alt="" /></span><span>Track email engagement</span></li>
                </ul>

                <button className="connect-email-btn genral-setting-fonts">Connect personal email</button>
              </div>




            </section>



          </>}

          {activeTab === "contact" && <>

            <section className="genral-setting-container genral-setting-fonts">

              <div className="contact-sync-para">
                <p className="genral-setting-fonts general-sync-note">Sync your contacts in LeadPlaner with your Google or Outlook contact lists. To get started, add a new account below. After that, you can define your sync preferences.</p>
              </div>
              <div>
                <button className="add-contact-sync-btn genral-setting-fonts">Add account</button>
              </div>


            </section>


          </>}
        </section>
      <ToastContainer/>
    </>
  );
};

export default LPSettingsGeneral;
