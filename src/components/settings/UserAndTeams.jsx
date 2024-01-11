import React, { useState, useEffect, useRef } from "react";
import "../styles/LPSetting.css";
import "../styles/LPUserAndTeam.css";
import axios from "axios";
import {
  GET_TEAM_MEM,
  GET_ACTIVE_TEAM_MEM,
  GET_DEACTIVE_TEAM_MEM,
  getDecryptedToken,
  UPDATE_TEAM_MEM,
  CHECK_LEAD_DEAL,
} from "../utils/Constants";
import SearchIcon from "../../assets/image/search.svg";
import ExportIcon from "../../assets/image/export.svg";
import ExportIcon2 from "../../assets/image/export2.svg";
import ArrowUp from "../../assets/image/arrow-up.svg";
import DarkArrowUp from "../../assets/image/dark-arrow-up.svg";
import ArrowDown from "../../assets/image/arrow-down.svg";
import User from "../../assets/image/user-icon.svg";
import CreateUserModal from "./CreateUserModal";
import CreateTeamModal from "./CreateTeamModal";
import { Link } from "react-router-dom";
import DeactivateUser from "./DeactivateUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserAndTeams = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false); // New state for modal
  const decryptedToken = getDecryptedToken();
  const [teamData, setTeamData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [deactiveData, setDeactiveData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTabName, setActiveTabName] = useState("All");
  const actionDropDownRef = useRef(null);
  const actionDropDownRefs = useRef({});
  const [actionopen, setActionOpen] = useState(false);
  const [userActionOpen, setUserActionOpen] = useState({});
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedLastName, setSelectedLastName] = useState("");
  const [newId, setNewId] = useState(0);
  const [leadId, setLeadId] = useState([]);
  const [dealId, setDealId] = useState([]);
  const orgId = localStorage.getItem('org_id');

  const HandleDeactivateUserModal = (id) => {
    setNewId(id);
    setIsDeactivateOpen(true);
  };

  const HandleCheckLeadDeal = (id) => {
    const updateForm = {
      member_id: id,
    };
    axios
      .post(CHECK_LEAD_DEAL, updateForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        if (response?.data?.leads || response?.data?.deals) {
          if (response?.data?.leads) {
            const extractedIds = response?.data?.leads.map((lead) => lead.id);
            setLeadId(extractedIds);
          }
          if (response?.data?.deals) {
            const extractedIds = response?.data?.deals.map((deals) => deals.id);
            setDealId(extractedIds);
          }
          HandleDeactivateUserModal(id);
        } else {
          HAndleDeactivateUserNormal(id);
        }
      })
      .catch((error) => {
        // Handle error
        toast.error("Error saving password", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  const HandleDeactivateUser = (id, firstName, lastName) => {
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
    HandleCheckLeadDeal(id);
  };

  const HAndleDeactivateUserNormal = (id) => {
    const updateForm = {
      is_deactivated: 1,
    };
    axios
      .put(UPDATE_TEAM_MEM + id, updateForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        // Handle successful response

        toast.error("Member Deactivated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        userAdded();
        userDeactive();
        userActive();
        toggleActionDropdown2(id);
      })
      .catch((error) => {
        // Handle error
        toast.error("Error saving password", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  const HandleActivateUser = (id) => {
    const updateForm = {
      is_deactivated: 0,
    };
    axios
      .put(UPDATE_TEAM_MEM + id, updateForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        // Handle successful response

        toast.success("Member Activated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        userAdded();
        userActive();
        userDeactive();
        toggleActionDropdown2(id);
      })
      .catch((error) => {
        // Handle error
        toast.error("Error saving password", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  const HandleDeactivateClose = () => {
    setIsDeactivateOpen(false);
  };

  const handleTabChange = (tabName) => {
    setActiveTabName(tabName);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleHover = () => {
    setIsHovered(!isHovered);
  };
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
  };

  const userAdded = () => {
    axios
      .post(GET_TEAM_MEM,{ orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setTeamData(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  
  const userActive = () => {
    axios
      .post(GET_ACTIVE_TEAM_MEM,{ orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setActiveData(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const userDeactive = () => {
    axios
      .post(GET_DEACTIVE_TEAM_MEM,{ orgId: orgId}, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setDeactiveData(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    userAdded();
    userActive();
    userDeactive();
  }, [orgId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTeamData = (teamData || []).filter((teamMember) => {
    const fullName =
      `${teamMember.first_name} ${teamMember.last_name}`.toLowerCase();
    const email = teamMember.email?.toLowerCase() || "";
    const searchLower = searchQuery.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const filteredActiveData = (activeData || []).filter((teamMember) => {
    const fullName =
      `${teamMember.first_name} ${teamMember.last_name}`.toLowerCase();
    const email = teamMember.email?.toLowerCase() || "";
    const searchLower = searchQuery.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const filteredDeactiveData = (deactiveData || []).filter((teamMember) => {
    const fullName =
      `${teamMember.first_name} ${teamMember.last_name}`.toLowerCase();
    const email = teamMember.email?.toLowerCase() || "";
    const searchLower = searchQuery.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const toggleActionDropdownStatic = () => {
    setActionOpen(!actionopen);
  };

  // Function to toggle the dropdown for a specific user ID
  const toggleActionDropdown = (userId) => {
    setUserActionOpen((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };
  const toggleActionDropdown2 = (userId) => {
    setUserActionOpen((prevState) => ({
      ...prevState,
      [userId]: false,
    }));
  };

  useEffect(() => {
    // Event listener callback for handling clicks outside the dropdown container
    const handleOutsideClick = (event) => {
      // Check each ref to see if the click occurred outside the corresponding dropdown
      Object.values(actionDropDownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          // Clicked outside, close the dropdown
          setUserActionOpen((prevState) => ({
            ...prevState,
            [ref.dataset.userId]: false,
          }));
        }
      });
    };

    const handleOutsideClick2 = (event) => {
      if (
        actionDropDownRef.current &&
        !actionDropDownRef.current.contains(event.target)
      ) {
        setActionOpen(false);
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleOutsideClick2);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("click", handleOutsideClick2);
    };
  }, []);

  const userTeamRefresh = () => {
    userAdded();
  };

  return (
    <>
      <main className="user-team-container">
        <div className="user-team-setting-btn user-team-font">
          <button
            className={`user-team-btn ${
              activeTab === "users" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("users")}
          >
            Users
          </button>
          <button
            className={`user-team-btn ${
              activeTab === "teams" ? "genral-active" : ""
            }`}
            onClick={() => handleTabClick("teams")}
          >
            Teams
          </button>
        </div>
        {activeTab === "users" && (
          <>
            <section className="top-msg-display">
              <p className="user-team-font">
                Create new users, customize user permissions, and remove users
                from your account
              </p>
            </section>

            <section>
              <div className="search-user-section">
                <div className="search-box">
                  <input
                    type="text"
                    className="search-input user-team-font"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <span className="search-icon">
                    <img src={SearchIcon} alt="" />
                  </span>
                </div>

                <div className="user-export">
                  <button
                    className="user-team-font export-user-btn"
                    onMouseEnter={handleHover}
                    onMouseLeave={handleHover}
                  >
                    {" "}
                    <img
                      src={isHovered ? ExportIcon2 : ExportIcon}
                      alt=""
                      className="export-icon"
                    />
                    Export Users
                  </button>
                  <button
                    className="create-user-btn user-team-font"
                    onClick={openModal}
                  >
                    {" "}
                    Create User
                  </button>
                </div>
              </div>
            </section>

            <section className="active-inactive">
              <div className="user-team-setting-btn user-team-font">
                <button
                  className={`user-team-btn ${
                    activeTabName === "All" ? "genral-active" : ""
                  }`}
                  onClick={() => handleTabChange("All")}
                >
                  All ({filteredTeamData.length})
                </button>
                <button
                  className={`user-team-btn ${
                    activeTabName === "Active" ? "genral-active" : ""
                  }`}
                  onClick={() => handleTabChange("Active")}
                >
                  Active ({filteredActiveData.length})
                </button>
                <button
                  className={`user-team-btn ${
                    activeTabName === "Invited" ? "genral-active" : ""
                  }`}
                  onClick={() => handleTabChange("Invited")}
                >
                  Invited (1)
                </button>
                <button
                  className={`user-team-btn ${
                    activeTabName === "Deactivated" ? "genral-active" : ""
                  }`}
                  onClick={() => handleTabChange("Deactivated")}
                >
                  Deactivated ({filteredDeactiveData.length})
                </button>
              </div>
              <button
                type="button"
                className="helpBtn genral-refresh-icon user-team-refresh-icon"
                title="Refresh"
                onClick={userTeamRefresh}
              >
                <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
            </section>

            {activeTabName === "All" && (
              <section className="user-table">
                {loading ? (
                  // Show a loading message or spinner while data is loading
                  <p className="common-fonts">Loading...</p>
                ) : (
                  <table>
                    <tr className="user-team-font">
                      <th>
                        <label class="custom-checkbox">
                          <input type="checkbox" className="cb1" />
                          <span class="checkmark"></span>
                        </label>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Name</p>
                          <div className="arrow-icon">
                            <img
                              src={DarkArrowUp}
                              className="arrow-up"
                              alt=""
                            />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>

                      <th>
                        <div className="name-info">
                          <p>Team</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Access</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Last Active</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                    {filteredTeamData.map((teamMember) => (
                      <tr key={teamMember.id}>
                        <td>
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb1" />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td>
                          <div className="user-info">
                            <div className="usericon-name-email">
                              <div className="user-icon-round">
                                <img src={User} alt="" />
                              </div>

                              <div className="user-name-info">
                                <p className="user-name-value">
                                  <Link
                                    to={
                                      "/lp/settings/usernteams/" + teamMember.id
                                    }
                                  >
                                    {teamMember.first_name +
                                      " " +
                                      teamMember.last_name}
                                  </Link>
                                </p>
                                <p className="email-case">{teamMember.email}</p>
                              </div>
                            </div>
                            <div className="select action-select">
                              <div
                                className="dropdown-container"
                                ref={(ref) =>
                                  (actionDropDownRefs.current[teamMember.id] =
                                    ref)
                                }
                                data-user-id={teamMember.id}
                              >
                                {/* Pass the user ID to the toggleActionDropdown function */}
                                <div
                                  className="dropdown-header2"
                                  onClick={() =>
                                    toggleActionDropdown(teamMember.id)
                                  }
                                >
                                  Actions{" "}
                                  <i
                                    className={`fa-sharp fa-solid ${
                                      userActionOpen[teamMember.id]
                                        ? "fa-angle-up"
                                        : "fa-angle-down"
                                    }`}
                                  ></i>
                                </div>
                                {userActionOpen[teamMember.id] && (
                                  <ul className="dropdown-menu user-team-dropdown-position">
                                    <li>
                                      <Link
                                        to={
                                          "/lp/settings/usernteams/" +
                                          teamMember.id
                                        }
                                      >
                                        Edit user
                                      </Link>
                                    </li>
                                    <li>Edit permissions</li>
                                    <li>Edit team</li>
                                    <li>Resend email invite</li>
                                    <li>Make Super Admin</li>
                                    {teamMember.is_deactivated === 0 ? (
                                      <li
                                        onClick={() =>
                                          HandleDeactivateUser(
                                            teamMember.id,
                                            teamMember.first_name,
                                            teamMember.last_name
                                          )
                                        }
                                      >
                                        Deactivate user
                                      </li>
                                    ) : (
                                      <li
                                        onClick={() =>
                                          HandleActivateUser(teamMember.id)
                                        }
                                      >
                                        Activate user
                                      </li>
                                    )}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                      </tr>
                    ))}
                  </table>
                )}
              </section>
            )}
            {activeTabName === "Active" && (
              <section className="user-table">
                {loading ? (
                  // Show a loading message or spinner while data is loading
                  <p>Loading...</p>
                ) : (
                  <table>
                    <tr className="user-team-font">
                      <th>
                        <label class="custom-checkbox">
                          <input type="checkbox" className="cb1" />
                          <span class="checkmark"></span>
                        </label>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Name</p>
                          <div className="arrow-icon">
                            <img
                              src={DarkArrowUp}
                              className="arrow-up"
                              alt=""
                            />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>

                      <th>
                        <div className="name-info">
                          <p>Team</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Access</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Last Active</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                    {filteredActiveData.map((teamMember) => (
                      <tr key={teamMember.id}>
                        <td>
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb1" />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td>
                          <div className="user-info">
                            <div className="usericon-name-email">
                              <div className="user-icon-round">
                                <img src={User} alt="" />
                              </div>

                              <div className="user-name-info">
                                <p className="user-name-value">
                                  {teamMember.first_name +
                                    " " +
                                    teamMember.last_name}
                                </p>
                                <p>{teamMember.email}</p>
                              </div>
                            </div>
                            <div className="select action-select">
                              <div
                                className="dropdown-container"
                                ref={(ref) =>
                                  (actionDropDownRefs.current[teamMember.id] =
                                    ref)
                                }
                                data-user-id={teamMember.id}
                              >
                                {/* Pass the user ID to the toggleActionDropdown function */}
                                <div
                                  className="dropdown-header2"
                                  onClick={() =>
                                    toggleActionDropdown(teamMember.id)
                                  }
                                >
                                  Actions{" "}
                                  <i
                                    className={`fa-sharp fa-solid ${
                                      userActionOpen[teamMember.id]
                                        ? "fa-angle-up"
                                        : "fa-angle-down"
                                    }`}
                                  ></i>
                                </div>
                                {userActionOpen[teamMember.id] && (
                                  <ul className="dropdown-menu user-team-dropdown-position">
                                    <li>Edit user</li>
                                    <li>Edit permissions</li>
                                    <li>Edit team</li>
                                    <li>Resend email invite</li>
                                    <li>Make Super Admin</li>
                                    <li
                                      onClick={() =>
                                        HandleDeactivateUser(
                                          teamMember.id,
                                          teamMember.first_name,
                                          teamMember.last_name
                                        )
                                      }
                                    >
                                      Deactivate user
                                    </li>
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                      </tr>
                    ))}
                  </table>
                )}
              </section>
            )}
            {activeTabName === "Invited" && (
              <section className="user-table">
                {loading ? (
                  // Show a loading message or spinner while data is loading
                  <p>Loading...</p>
                ) : (
                  <table>
                    <tr className="user-team-font">
                      <th>
                        <label class="custom-checkbox">
                          <input type="checkbox" className="cb1" />
                          <span class="checkmark"></span>
                        </label>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Name</p>
                          <div className="arrow-icon">
                            <img
                              src={DarkArrowUp}
                              className="arrow-up"
                              alt=""
                            />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>

                      <th>
                        <div className="name-info">
                          <p>Team</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Access</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Last Active</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <label class="custom-checkbox">
                          <input type="checkbox" className="cb1" />
                          <span class="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <div className="user-info">
                          <div className="usericon-name-email">
                            <div className="user-icon-round">
                              <img src={User} alt="" />
                            </div>

                            <div className="user-name-info">
                              <p className="user-name-value">
                                Anant Sign Chauhan
                              </p>
                              <p>anantsingh@123@gmail.com</p>
                            </div>
                          </div>
                          <div>
                            <select
                              name=""
                              id=""
                              className="select-action user-team-font"
                            >
                              <option value="">Action</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="user-team-font"></td>
                      <td className="user-team-font">Super Admin</td>
                      <td className="user-team-font">3 hours ago</td>
                    </tr>
                  </table>
                )}
              </section>
            )}
            {activeTabName === "Deactivated" && (
              <section className="user-table">
                {loading ? (
                  // Show a loading message or spinner while data is loading
                  <p>Loading...</p>
                ) : (
                  <table>
                    <tr className="user-team-font">
                      <th>
                        <label class="custom-checkbox">
                          <input type="checkbox" className="cb1" />
                          <span class="checkmark"></span>
                        </label>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Name</p>
                          <div className="arrow-icon">
                            <img
                              src={DarkArrowUp}
                              className="arrow-up"
                              alt=""
                            />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>

                      <th>
                        <div className="name-info">
                          <p>Team</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Access</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <div className="name-info">
                          <p>Last Active</p>
                          <div className="arrow-icon">
                            <img src={ArrowUp} className="arrow-up" alt="" />
                            <img
                              src={ArrowDown}
                              className="arrow-down"
                              alt=""
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                    {filteredDeactiveData.map((teamMember) => (
                      <tr key={teamMember.id}>
                        <td>
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb1" />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td>
                          <div className="user-info">
                            <div className="usericon-name-email">
                              <div className="user-icon-round">
                                <img src={User} alt="" />
                              </div>

                              <div className="user-name-info">
                                <p className="user-name-value">
                                  {teamMember.first_name +
                                    " " +
                                    teamMember.last_name}
                                </p>
                                <p>{teamMember.email}</p>
                              </div>
                            </div>
                            <div className="select action-select">
                              <div
                                className="dropdown-container"
                                ref={(ref) =>
                                  (actionDropDownRefs.current[teamMember.id] =
                                    ref)
                                }
                                data-user-id={teamMember.id}
                              >
                                {/* Pass the user ID to the toggleActionDropdown function */}
                                <div
                                  className="dropdown-header2"
                                  onClick={() =>
                                    toggleActionDropdown(teamMember.id)
                                  }
                                >
                                  Actions{" "}
                                  <i
                                    className={`fa-sharp fa-solid ${
                                      userActionOpen[teamMember.id]
                                        ? "fa-angle-up"
                                        : "fa-angle-down"
                                    }`}
                                  ></i>
                                </div>
                                {userActionOpen[teamMember.id] && (
                                  <ul className="dropdown-menu user-team-dropdown-position">
                                    <li>Edit user</li>
                                    <li>Edit permissions</li>
                                    <li>Edit team</li>
                                    <li>Resend email invite</li>
                                    <li>Make Super Admin</li>
                                    <li
                                      onClick={() =>
                                        HandleActivateUser(teamMember.id)
                                      }
                                    >
                                      Activate user
                                    </li>
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                        <td className="user-team-font"></td>
                      </tr>
                    ))}
                  </table>
                )}
              </section>
            )}
          </>
        )}

        {activeTab === "teams" && (
          <>
            <main className="team-container">
              <section className="top-msg-display">
                <p className="user-team-font">
                  Set up your team now for better management.
                </p>
              </section>

              <section>
                <div className="search-user-section">
                  <div className="search-box">
                    <input
                      type="text"
                      className="search-input font-style"
                      placeholder="Search..."
                    />
                    <span className="search-icon">
                      <img src={SearchIcon} alt="" />
                    </span>
                  </div>
                  <div className="user-export">
                    <button
                      className="create-user-btn user-team-font"
                      onClick={openTeamModal}
                    >
                      Create Team
                    </button>
                  </div>
                </div>
              </section>
              <section className="user-team-font no-team-added">
                <p className="no-team-para">No Teams added yet</p>
              </section>
            </main>
          </>
        )}
      </main>
      {isModalOpen && (
        <CreateUserModal onClose={closeModal} onUserAdded={userAdded} userActive={userActive} orgId={orgId}/>
      )}
      {isTeamModalOpen && <CreateTeamModal onCloseTeamModal={closeTeamModal} />}

      {isDeactivateOpen && (
        <DeactivateUser
          onClose={HandleDeactivateClose}
          firstName={selectedFirstName}
          lastName={selectedLastName}
          teamData={activeData}
          deactivate={HAndleDeactivateUserNormal}
          id={newId}
          leadIdArray={leadId}
          dealIdArray={dealId}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default UserAndTeams;
