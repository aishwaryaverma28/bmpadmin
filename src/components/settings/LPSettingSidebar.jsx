import React, { useState } from "react";
import "../styles/LPSetting.css";
import { NavLink } from "react-router-dom";
import arrowLeft from "../../assets/image/arrow-left.svg";
import GreaterDown from "../../assets/image/greater-arrow-down.svg";
import GreaterUp from "../../assets/image/greater-up.svg";
import { getDecryptedUserPath } from "../utils/Constants";

const LPSettingSidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [masterSubMenu, setMasterSubMenu] = useState(null);
  const decryptedUserPath = getDecryptedUserPath();
  const allowed = decryptedUserPath.split(",");
  // const allowed = [
  //   "/lp/lead",
  //   "/lp/home",
  //   "/lp/mail",
  //   "/lp/contacts",
  //   "/lp/deals",
  //   "/lp/settings",
  //   "/lp/settings/general",
  //   "/lp/settings/notification",
  //   "/lp/settings/usernteams",
  //   "/lp/settings/companysettings",
  //   "/lp/settings/recyclebin",
  //   "/lp/settings/privacyConcent",
  //   "/lp/settings/settingLeads",
  //   "/lp/settings/settingDeal",
  //   "/lp/settings/settingUsage",
  //   "/lp/settings/settingImpExp",
  //   "/lp/settings/blog/add",
  //   "/lp/settings/blog/view",
  //   "/lp/settings/sitePages/add",
  //   "/lp/settings/sitePages/view",
  //   "/lp/settings/helpSection/add",
  //   "/lp/settings/helpSection/update",
  //   "/lp/settings/userManagement/add",
  //   "/lp/settings/userManagement/update",
  //   "/lp/settings/employee/add",
  //   "/lp/settings/employee/view",
  //   "/lp/settings/accessManagement",
  //   "/lp/settings/reportsAndAnalytics",
  //   "/lp/settings/masterSettings/City",
  //   "/lp/settings/system/state",
  //   "/lp/settings/viewProfile/employeeProfile",
  //     "/lp/settings/viewProfile/timeSheet",
  //     "/lp/settings/viewProfile/documents",
  //     "/lp/settings/viewProfile/salarySlip",
  // ];
  const isPathAllowed = (path) => {
    if (allowed.length === 0) {
      return true; // All paths are allowed when allowed array is empty
    }
    return allowed.includes(path);
  };

  const handleGoBack = () => {
    window.history.back(); // Navigate back in the browser history
  };

  const toggleSubMenu = (submenu) => {
    setOpenSubMenu((prevSubMenu) => (prevSubMenu === submenu ? null : submenu));
  };
  const toggleMasterSubMenu = (submenu) => {
    setMasterSubMenu((prevSubMenu) =>
      prevSubMenu === submenu ? null : submenu
    );
  };
  return (
    <section className="setting-side-panel">
      <div className="go-back-btn ">
        <button className="setting-font-style" onClick={handleGoBack}>
          <img src={arrowLeft} alt="" />
          <span>Go Back</span>
        </button>
      </div>
      <div>
        <p className="setting-heading setting-font-style">Settings</p>
      </div>
      {(isPathAllowed("/lp/settings/general") ||
        isPathAllowed("/lp/settings/notification")) && (
          <div>
            <div
              className="setting-arrow"
              onClick={() => toggleSubMenu("yourPreferences")}
            >
              <p className="prefrence setting-font-style">Your Prefrences</p>
              <img
                src={openSubMenu === "yourPreferences" ? GreaterUp : GreaterDown}
                alt=""
              />
            </div>
            {openSubMenu === "yourPreferences" && (
              <>
                {isPathAllowed("/lp/settings/general") && (
                  <p className="prefrence-options setting-font-style">
                    <NavLink exact to="/lp/settings/general">
                      General
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/notification") && (
                  <p className="prefrence-options setting-font-style">
                    <NavLink exact to="/lp/settings/notification">
                      Notification
                    </NavLink>
                  </p>
                )}
                {/* Add more submenu items here as needed */}
              </>
            )}
          </div>
        )}
      {(isPathAllowed("/lp/settings/usernteams") ||
        isPathAllowed("/lp/settings/privacyConcent")) && (
          <div>
            <div
              className="setting-arrow"
              onClick={() => toggleSubMenu("account")}
            >
              <p className="account-setup setting-font-style">Account Setup</p>
              <img
                src={openSubMenu === "account" ? GreaterUp : GreaterDown}
                alt=""
              />
            </div>
            {openSubMenu === "account" && (
              <>
                {isPathAllowed("/lp/settings/usernteams") && (
                  <p className="account-options setting-font-style">
                    {" "}
                    <NavLink
                      exact
                      to="/lp/settings/usernteams"
                      activeClassName="activeLink"
                    >
                      Users & Teams
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/privacyConcent") && (
                  <p className="account-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/privacyConcent"
                      activeClassName="activeLink"
                    >
                      Privacy & Consent
                    </NavLink>
                  </p>
                )}
              </>
            )}
          </div>
        )}
      {(isPathAllowed("/lp/settings/companysettings") ||
        isPathAllowed("/lp/settings/settingLeads") ||
        isPathAllowed("/lp/settings/settingDeal") ||
        isPathAllowed("/lp/settings/workflow") ||
        isPathAllowed("/lp/settings/settingUsage") ||
        isPathAllowed("/lp/settings/recyclebin")) && (
          <div>
            <div
              className="setting-arrow"
              onClick={() => toggleSubMenu("company")}
            >
              <p className="company-setup setting-font-style">Company</p>
              <img
                src={openSubMenu === "company" ? GreaterUp : GreaterDown}
                alt=""
              />
            </div>

            {openSubMenu === "company" && (
              <>
                {isPathAllowed("/lp/settings/companysettings") && (
                  <p className="company-options setting-font-style">
                    {" "}
                    <NavLink
                      exact
                      to="/lp/settings/companysettings"
                      activeClassName="activeLink"
                    >
                      Company Settings
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/settingLeads") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/settingLeads"
                      activeClassName="activeLink"
                    >
                      Leads
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/settingDeal") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/settingDeal"
                      activeClassName="activeLink"
                    >
                      Deals
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/settingUsage") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/settingUsage"
                      activeClassName="activeLink"
                    >
                      Usage
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/settingImpExp") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/settingImpExp"
                      activeClassName="activeLink"
                    >
                      Import & Export
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/workflow") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/workflow"
                      activeClassName="activeLink"
                    >
                      WorkFlow
                    </NavLink>
                  </p>
                )}
                {isPathAllowed("/lp/settings/recyclebin") && (
                  <p className="company-options setting-font-style">
                    <NavLink
                      exact
                      to="/lp/settings/recyclebin"
                      activeClassName="activeLink"
                    >
                      Recycle Bin
                    </NavLink>
                  </p>
                )}
              </>
            )}
          </div>
        )}
      <div>
        {isPathAllowed("/lp/settings/viewProfile/employeeProfile") && (
          <div
            className="setting-arrow"
            onClick={() => toggleSubMenu("master")}
          >
            <p className="company-setup setting-font-style">Master Settings</p>
            <img
              src={openSubMenu === "master" ? GreaterUp : GreaterDown}
              alt=""
            />
          </div>
        )}
      </div>

      {openSubMenu === "master" && (
        <>
          {isPathAllowed("/lp/settings/viewProfile/employeeProfile") && (
            <p className="prefrence-options setting-font-style">
              <NavLink exact to="/lp/settings/viewProfile/employeeProfile">
                View Profile
              </NavLink>
            </p>
          )}

          {(isPathAllowed("/lp/settings/blog/add") ||
            isPathAllowed("/lp/settings/blog/view")) && (
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("blog")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  Blog
                </p>
                <img
                  src={masterSubMenu === "blog" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
            )}

          {masterSubMenu === "blog" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/blog/add") && (
                <p className="company-options setting-font-style blog-options">
                  <NavLink
                    exact
                    to="/lp/settings/blog/add"
                    activeClassName="activeLink"
                  >
                    Add
                  </NavLink>
                </p>
              )}
              {isPathAllowed("/lp/settings/blog/view") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/blog/view"
                    activeClassName="activeLink"
                  >
                    View
                  </NavLink>
                </p>
              )}
            </div>
          )}

          {isPathAllowed("/lp/settings/review/view") && (
            <>
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("review")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  Review
                </p>
                <img
                  src={masterSubMenu === "review" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
              {masterSubMenu === "review" && (
                <div className="sub-sub-menu">
                  {isPathAllowed("/lp/settings/review/view") && (
                    <p className="company-options setting-font-style">
                      <NavLink
                        exact
                        to="/lp/settings/review/view"
                        activeClassName="activeLink"
                      >
                        View
                      </NavLink>
                    </p>
                  )}
                </div>
              )}
            </>
          )}


          {(isPathAllowed("/lp/settings/tournament/add") ||
            isPathAllowed("/lp/settings/tournament/view")) && (
              <>
                <div
                  className="master-arrow"
                  onClick={() => toggleMasterSubMenu("tournament")}
                >
                  <p className="company-options master-settings-options setting-font-style">
                    Tournament
                  </p>
                  <img
                    src={masterSubMenu === "tournament" ? GreaterUp : GreaterDown}
                    alt=""
                  />
                </div>
                {masterSubMenu === "tournament" && (
                  <div className="sub-sub-menu">
                    {isPathAllowed("/lp/settings/tournament/add") && (
                      <p className="company-options setting-font-style blog-options">
                        <NavLink
                          exact
                          to="/lp/settings/tournament/add"
                          activeClassName="activeLink"
                        >
                          Add
                        </NavLink>
                      </p>
                    )}
                    {isPathAllowed("/lp/settings/tournament/view") && (
                      <p className="company-options setting-font-style">
                        <NavLink
                          exact
                          to="/lp/settings/tournament/view"
                          activeClassName="activeLink"
                        >
                          View
                        </NavLink>
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

          {(isPathAllowed("/lp/settings/sitePages/add") ||
            isPathAllowed("/lp/settings/sitePages/view")) && (
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("site")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  Site
                </p>
                <img
                  src={masterSubMenu === "site" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
            )}

          {masterSubMenu === "site" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/sitePages/add") && (
                <p className="company-options  setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/sitePages/add"
                    activeClassName="activeLink"
                  >
                    Add
                  </NavLink>
                </p>
              )}
              {isPathAllowed("/lp/settings/sitePages/view") && (
                <p className="company-options  setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/sitePages/view"
                    activeClassName="activeLink"
                  >
                    View
                  </NavLink>
                </p>
              )}
            </div>
          )}

          {(isPathAllowed("/lp/settings/helpSection/add") ||
            isPathAllowed("/lp/settings/helpSection/update")) && (
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("help")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  Help
                </p>
                <img
                  src={masterSubMenu === "help" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
            )}

          {masterSubMenu === "help" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/helpSection/add") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/helpSection/add"
                    activeClassName="activeLink"
                  >
                    Add
                  </NavLink>
                </p>
              )}
              {isPathAllowed("/lp/settings/helpSection/update") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/helpSection/update"
                    activeClassName="activeLink"
                  >
                    Update
                  </NavLink>
                </p>
              )}
            </div>
          )}

          {(isPathAllowed("/lp/settings/userManagement/add") ||
            isPathAllowed("/lp/settings/userManagement/update")) && (
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("user")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  User Management
                </p>
                <img
                  src={masterSubMenu === "user" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
            )}

          {masterSubMenu === "user" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/userManagement/add") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/userManagement/add"
                    activeClassName="activeLink"
                  >
                    Add
                  </NavLink>
                </p>
              )}
              {isPathAllowed("/lp/settings/userManagement/update") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/userManagement/update"
                    activeClassName="activeLink"
                  >
                    Update
                  </NavLink>
                </p>
              )}
            </div>
          )}

          {(isPathAllowed("/lp/settings/employee/add") ||
            isPathAllowed("/lp/settings/employee/view")) && (
              <div
                className="master-arrow"
                onClick={() => toggleMasterSubMenu("employee")}
              >
                <p className="company-options master-settings-options setting-font-style">
                  Employee
                </p>
                <img
                  src={masterSubMenu === "employee" ? GreaterUp : GreaterDown}
                  alt=""
                />
              </div>
            )}
          {masterSubMenu === "employee" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/employee/add") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/employee/add"
                    activeClassName="activeLink"
                  >
                    Add
                  </NavLink>
                </p>
              )}
              {isPathAllowed("/lp/settings/employee/view") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/employee/view"
                    activeClassName="activeLink"
                  >
                    View
                  </NavLink>
                </p>
              )}
            </div>
          )}
          {isPathAllowed("/lp/settings/accessManagement") && (
            <p className="prefrence-options setting-font-style">
              <NavLink exact to="/lp/settings/accessManagement">
                Access Management
              </NavLink>
            </p>
          )}
          {isPathAllowed("/lp/settings/reportsAndAnalytics") && (
            <p className="prefrence-options setting-font-style">
              <NavLink exact to="/lp/settings/reportsAndAnalytics">
                Report Anad Analytics
              </NavLink>
            </p>
          )}

          {isPathAllowed("/lp/settings/masterSettings/City") && (
            <div
              className="master-arrow"
              onClick={() => toggleMasterSubMenu("master-setting")}
            >
              <p className="company-options master-settings-options setting-font-style">
                Master Settings
              </p>
              <img
                src={
                  masterSubMenu === "master-setting" ? GreaterUp : GreaterDown
                }
                alt=""
              />
            </div>
          )}

          {masterSubMenu === "master-setting" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/masterSettings/City") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/masterSettings/City"
                    activeClassName="activeLink"
                  >
                    City
                  </NavLink>
                </p>
              )}
            </div>
          )}

          {isPathAllowed("/lp/settings/system/state") && (
            <div
              className="master-arrow"
              onClick={() => toggleMasterSubMenu("system")}
            >
              <p className="company-options master-settings-options setting-font-style">
                System
              </p>
              <img
                src={masterSubMenu === "system" ? GreaterUp : GreaterDown}
                alt=""
              />
            </div>
          )}
          {masterSubMenu === "system" && (
            <div className="sub-sub-menu">
              {isPathAllowed("/lp/settings/system/state") && (
                <p className="company-options setting-font-style">
                  <NavLink
                    exact
                    to="/lp/settings/system/state"
                    activeClassName="activeLink"
                  >
                    State
                  </NavLink>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default LPSettingSidebar;
