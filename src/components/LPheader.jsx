import React, { useState, useEffect, useRef, useContext } from "react";
import { LPContext } from "./LPContext";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./styles/LPheader.css";
import line from "../assets/image/Line.png";
import user from "../assets/image/user-img.png";
import logo from "../assets/image/logo.svg";
import vector from "../assets/image/Vector.svg";
import axios from "axios";
import {
  USER_INFO,
  BMP_USER,
  getDecryptedToken,
  getDecryptedUserPath,
} from "./utils/Constants";
import HelpModal from "./HelpModal";
import NotificationModal from "./NotificationModal.jsx";
import { useDispatch } from 'react-redux';
import { addItem } from "./utils/userInfoSlice.js";
const LPheader = () => {
  const { name } = useContext(LPContext);
  const landingUrl = localStorage.getItem("landingUrl");
  const userId = localStorage.getItem("id");
  const academyId = localStorage.getItem("academy_id");
  const role_name = localStorage.getItem("role_name");
  const url = localStorage.getItem("url");
  const [pageTitle, setPageTitle] = useState("Lead");
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [clientData, setClientData] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [pathAddress, setPathAddress] = useState(null);
  const decryptedToken = getDecryptedToken();
  const location = useLocation();
  const decryptedUserPath = getDecryptedUserPath();
  const [number, setNumber] = useState(null);
  let allowed = decryptedUserPath.split(",");
  // let allowed = [
  //   "/lp/lead",
  //   "/lp/bmp",
  //   "/lp/admin",
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
  //   "/lp/marketing"
  // ];
  if (landingUrl === "/lp/admin") {
    allowed = allowed.filter((path) => path !== "/lp/home");
  } else if (landingUrl === "/lp/home") {
    allowed = allowed.filter((path) => path !== "/lp/admin");
  }

  useEffect(() => {
    if (landingUrl === "/lp/admin") {
      setPathAddress("/lp/settings/viewProfile/employeeProfile");
    } else {
      setPathAddress("/lp/settings/general");
    }
  }, []);

  useEffect(() => {
    switch (landingUrl) {
      case "/lp/bmp/overview":
        setPageTitle("BMP");
        break;
      case "/lp/bmp/admin":
        setPageTitle("Manager");
        break;
      case "/lp/admin":
        setPageTitle("Home");
        break;
      case "/lp/home":
        setPageTitle("Home");
        break;
      default:
        setPageTitle("Lead"); // Default title
        break;
    }
  }, [landingUrl]);
  const handleBell = () => {
    setIsNotifyModalOpen(true);
  };
  const handleBellCLose = () => {
    setIsNotifyModalOpen(false);
  };

  const isPathAllowed = (path) => {
    if (allowed.length === 0) {
      return true;
    }
    const userRole = localStorage.getItem("role_name");
    if (userRole === "Academy Admin" && path === "/lp/bmp") {
      return false;
    }

    return allowed.includes(path);
  };

  async function getUser() {
    try {
      const response = await axios.get(USER_INFO, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response?.data?.data;
      localStorage.setItem("org_id", data[0].org_id);
      if (response.data.status === 1) {
        setClientData(data[0]);
        setNumber(0);
        dispatch(addItem(data));
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  }

  async function getBMPUser() {
    let body = {};
    // if(role_name === "Academy Admin")
    // {
    // body =  {
    //   userId: userId,
    // }}else{
    //   body =  {
    //     userId: academyId,
    //   }
    // }
    body = {
      userId: userId,
    }
    try {
      const response = await axios.post(
        BMP_USER, body,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      const data = response?.data?.user;
      // console.log(data);
      localStorage.setItem("org_id", data.org_id);
      if (response.data.status === 1) {
        setClientData(data);
        setNumber(1);
        dispatch(addItem(data));
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
    }
  }

  useEffect(() => {
    if (landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') {
      getBMPUser();
    } else if (landingUrl === "/lp/home" || landingUrl === '/lp/admin') {
      getUser();
    } else {
      getUser();
    }
  }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleRefresh = () => {
    window.location.reload(); // Reloads the current page
  };

  const handleOptionClick = (option) => {
    console.log("Selected option:", option);
    setIsOpen(false);
  };
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavigationClick = (title) => {
    setPageTitle(title);
  };

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleHelpModalOpen = () => {
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  const handleLogout = () => {
    // console.log(landingUrl)
    if (landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') {
      localStorage.clear();
      window.location.href = "https://www.bookmyplayer.com/login";
    } else {
      localStorage.clear();
      window.location.href = "https://www.leadplaner.com/user/login";
    }
  };
  const handleViewSite = (e) => {
    e.preventDefault();
   const siteUrl =url;
    if (siteUrl) {
      localStorage.clear();
      window.location.href = siteUrl;
    } else {
        alert('Site URL is not available');
    }
};

  return (
    <>
      <div className="nav">
        <div className="navHeader">
          <div className="navTitle">{pageTitle}</div>
        </div>
        <div className="navBtn">
          <label htmlFor="navCheck" onClick={handleNavToggle}>
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
        <input type="checkbox" id="navCheck" checked={isNavOpen} />
        <div className={`navLinks ${isNavOpen ? "open" : ""}`}>
          <div className="searchBox">
            <button className="searchBtn">
              <i className="fas fa-search"></i>
            </button>
            <input
              className="searchInput"
              type="text"
              placeholder="Search lead, contact and more"
            />
          </div>
          <div>
            <button type="button" className="plusBtn" title="Create Lead">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <ul className="icons">
            <li>
              <button type="button" className="bellBtn" title="Notification">
                <i className="far fa-bell" onClick={handleBell}></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="helpBtn"
                title="Help"
                onClick={handleHelpModalOpen}
              >
                <i className="far fa-question-circle"></i>
              </button>
            </li>
            <li>
              <Link to={pathAddress}>
                <button type="button" className="settingBtn" title="Settings">
                  <i className="fa-sharp fa-solid fa-gear"></i>
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="userDropdownContainer" ref={dropdownRef}>
          <div className="userImg" onClick={toggleDropdown}>
            <img className="borderLeft" src={line} alt="border-left" />
            <img src={user} alt="user" />
            {clientData ? (
              <p>
                {" "}
                {/* {name
                  ? name
                  : `${clientData?.first_name} ${clientData?.last_name}`} */}

                {
                  number === 0 ? (
                    `${clientData?.first_name} ${clientData?.last_name}`
                  ) : (
                    `${clientData?.name}`
                  )

                }
                <br />
                {(landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') ? (<span>{clientData?.type}</span>):
                  (<span>{clientData?.job_title}</span>)}
              </p>
            ) : (
              <p>
                John Wick
                <br />
                <span>admin</span>
              </p>
            )}
          </div>
          {isOpen && (
            <div className="logoutDropdown">
              <div className="logUserInfo">
                <img src={user} alt="user" />
                <div className="crmUserInfo">
                  <h5 className="crmUserInfoName">
                    {
                      number === 0 ? (
                        `${clientData?.first_name} ${clientData?.last_name}`
                      ) : (
                        `${clientData?.name}`
                      )

                    }
                  </h5>
                  <p className="email-case">{clientData?.email}</p>
                  {(landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') ? (<p>{clientData?.type}</p>):
                  (<p>{clientData?.job_title}</p>)}
                </div>
              </div>
              <div className="profileNPref">Profile & Preferences</div>
              <div className="userId">
                User Id: {(landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') ? (clientData?.id) : 123456789} <i className="far fa-question-circle"></i>
              </div>
              <div className="userId">
                <p>Invite & earn rewards</p>
                <p>Account & Billing </p>
                <p>Price & Features</p>
                <p>Training & Services</p>
                <p>About this application</p>
              </div>
              <div className="signOutDiv">
                <p onClick={handleLogout}>Sign Out</p>
                <p>Privacy policy</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Top Navigation End  */}
      {/* Bottom Navigation Start */}
      <nav className="navbar">
        <div className="navbarContainer">
          {(landingUrl === "/lp/bmp/overview" || landingUrl === '/lp/bmp/admin') ? (
            <img src={vector} alt="" className="BMPlogo" />
          ) : (
            <img src={logo} alt="" className="logo" />
          )}
          <input
            type="checkbox"
            name=""
            id=""
            checked={isMenuOpen}
            onChange={handleMenuToggle}
          />
          <div className="hamburgerLines">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
          <ul className={`menuItems ${isMenuOpen ? "open" : ""}`}>
            {isPathAllowed("/lp/home") && (
              <li onClick={() => handleNavigationClick("Home")}>
                <NavLink exact to="/lp/home" activeClassName="activeNav">
                  Home
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/admin") && (
              <li onClick={() => handleNavigationClick("Admin")}>
                <NavLink exact to="/lp/admin" activeClassName="activeNav">
                  Home
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/bmp") && (
              <li onClick={() => handleNavigationClick("BMP")}>
                <NavLink exact to="/lp/bmp" activeClassName="activeNav">
                  BMP
                </NavLink>
              </li>
            )}

            {isPathAllowed("/lp/lead") && (
              <li onClick={() => handleNavigationClick("Lead")}>
                <NavLink exact to="/lp/lead" activeClassName="activeNav">
                  Lead
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/deals") && (
              <li onClick={() => handleNavigationClick("Deal")}>
                <NavLink exact to="/lp/deals" activeClassName="activeNav">
                  Deal
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/mail") && (
              <li onClick={() => handleNavigationClick("Mail")}>
                <NavLink exact to="/lp/mail" activeClassName="activeNav">
                  Mail
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/contacts") && (
              <li onClick={() => handleNavigationClick("Contacts")}>
                <NavLink exact to="/lp/contacts" activeClassName="activeNav">
                  Contacts
                </NavLink>
              </li>
            )}
            {isPathAllowed("/lp/marketing") && (
              <li onClick={() => handleNavigationClick("Marketing")}>
                <NavLink exact to="/lp/marketing" activeClassName="activeNav">
                  Marketing
                </NavLink>
              </li>
            )}
          </ul>
          <span></span>
          {(landingUrl === "/lp/bmp/overview") ? (
            <button
              className="common-fonts bmpSiteBtn"
            onClick={handleViewSite}
            >
              View Site
            </button>
        ) : (
          <></>
        )}
        </div>
        
      </nav>
      
      {/* Bottom Navigation End */}

      {isHelpModalOpen && <HelpModal onClose={closeHelpModal} />}
      {isNotifyModalOpen && <NotificationModal onClose={handleBellCLose} />}
    </>
  );
};

export default LPheader;
