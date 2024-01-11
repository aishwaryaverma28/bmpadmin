import React, { useState } from "react";
import LPSettingSidebar from "./LPSettingSidebar";
import "../styles/LPSettingsNotification.css";
import ArrowGreater from "../../assets/image/greater-arrow.svg";
import SearchIcon from "../../assets/image/search.svg";
import Envelope from "../../assets/image/envelope.svg";
import GreaterArrowDown from "../../assets/image/greater-arrow-down.svg";
import LPNotificationContent from "./LPNotificationContent";

const LPSettingsNotification = () => {
  const [activeTab, setActiveTab] = useState("email");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <section className="notification-setting-container notification-setting-fonts">
        <p className="notification-heading">Notification</p>

        <div className="notification-setting-btn notification-setting-fonts">
          <button
            className={`notification-btn ${
              activeTab === "email" ? "notification-active" : ""
            }`}
            onClick={() => handleTabClick("email")}
          >
            Email
          </button>
          <button
            className={`notification-btn ${
              activeTab === "desktop" ? "notification-active" : ""
            }`}
            onClick={() => handleTabClick("desktop")}
          >
            Desktop
          </button>
          <button
            className={`notification-btn ${
              activeTab === "otherApps" ? "notification-active" : ""
            }`}
            onClick={() => handleTabClick("otherApps")}
          >
            Other Apps
          </button>
        </div>
        {activeTab === "email" && (
          <>
            <div className="notification-email-section">
              <div className="envelope-section">
                <img src={Envelope} alt="" />
                <div className="notification-email-description">
                  <p>Email</p>
                  <p>
                    Notification will be sent to your saved mail. (You can
                    change your email anytime)
                  </p>
                </div>
              </div>

              <div>
                <label className="notification-switch">
                  <input type="checkbox" />
                  <span className="notification-slider notification-round"></span>
                </label>
              </div>
            </div>

            <LPNotificationContent />
          </>
        )}

        {activeTab === "desktop" && (
          <>
            <div className="desktop-notification">
              <table
                className="desktop-table"
                id="desktop-border"
                style={{ border: "none" }}
              >
                <tr>
                  <td className="desktop-content" id="desktop-item">
                    <div>
                      <p id="desktop-bell">Bell</p>
                      <p id="desktop-note">
                        Bell notifications appear as a red badge on the bell
                        icon in your navigation bar. You can click on the bell
                        anytime to see your most recent notifications.
                      </p>
                    </div>

                    <div>
                      <label className="notification-switch">
                        <input type="checkbox" />
                        <span className="notification-slider notification-round"></span>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="desktop-content" id="desktop-item">
                    <div>
                      <p id="desktop-bell2">pop-up</p>
                      <p id="desktop-note2">
                        Pop-up notifications appear on your screen when you’re
                        active in LeadPlaner.
                      </p>
                    </div>

                    <div>
                      <label className="notification-switch">
                        <input type="checkbox" />
                        <span className="notification-slider notification-round"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <LPNotificationContent />
          </>
        )}
        {activeTab === "otherApps" && <>other apps</>}
      </section>
    </>
  );
};

export default LPSettingsNotification;
