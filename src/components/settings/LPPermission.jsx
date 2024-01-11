import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  GET_USER_ID,
  GET_ACTIVE_TEAM_MEM,
  GET_ALL_ROLES,
  UPDATE_TEAM_MEM,
  getDecryptedToken,
  GET_ROLES_BY_USER,
  handleLogout
} from "../utils/Constants";
import "../styles/Permissions.css";
import User from "../../assets/image/user-icon.svg";
import LeftArrow from "../../assets/image/arrow-left.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/image/calendar-edit.svg";
import AddRolePopUp from "./AddRolePopUp";
import ResetPassword from "./ResetPassword";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LPPermission = () => {
  const { id } = useParams();
  const [actionOpen, setActionOpen] = useState(false);
  const [isAssignRole, setisAssignRole] = useState(false);
  const [isResetPassowrd, setIsResetPassword] = useState(false);
  const [initialTeamData, setInitialTeamData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [startDate1, setStartDate1] = useState(null);
  const [startDate2, setStartDate2] = useState(null);
  const [startDate3, setStartDate3] = useState(null);
  const [startDate4, setStartDate4] = useState(null);
  const [startDate5, setStartDate5] = useState(null);

  const [endDate1, setEndDate1] = useState(null);
  const [endDate2, setEndDate2] = useState(null);
  const [endDate3, setEndDate3] = useState(null);
  const [endDate4, setEndDate4] = useState(null);
  const [endDate5, setEndDate5] = useState(null);
  const decryptedToken = getDecryptedToken();
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [stateBtn, setStateBtn] = useState(0);
  const [roles, setRoles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [assignRolesArray, setAssignRoles] = useState([]);


//===================================fetch data
  useEffect(() => {
    fetchData();
}, [decryptedToken]);

const fetchData = async () => {
  try {
      const response = await axios.get(GET_ROLES_BY_USER + id, {
          headers: {
              Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
          },
      });
      if (response.data.status === 1) {
        setTableData(response?.data?.data);
        const extractedNames = response?.data?.data?.map(item => item?.name);
        setAssignRoles(extractedNames);
      } else {
          if (response.data.message === "Token has expired") {
              alert(response?.data?.message);
              handleLogout();
          }
      }
      setLoading(false);
  } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
  }
};

  //========================================================modal box functions
  function handleTeamDisplay() {
    setActionOpen(!actionOpen);
  }

  const handleAddRoleOpen = () => {
    setisAssignRole(true);
  };

  const handleAddRoleClose = () => {
    setisAssignRole(false);
  };

  const handleResetPasswordOpen = () => {
    setIsResetPassword(true);
  };

  const handleResetPasswordClose = () => {
    setIsResetPassword(false);
  };

  const resetForm = () => {
    setTeamData(initialTeamData);
    setStateBtn(0);
    setStartDate(null);
  }
  //===========================================================api calls
  const userAdded = () => {
    axios
      .post(GET_USER_ID, {
        userId:id
    },
    {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log(response?.data?.data)
        const filteredData = response?.data?.data
        setTeamData(filteredData[0]);
        setInitialTeamData(filteredData[0]); // Store initial data here
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //===========================================================================================================================================
  const getAllRoles = () => {
    axios
      .get(GET_ALL_ROLES, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        const filteredRoles = response?.data?.data?.filter(item => item?.company === "fiduciagroup");

        setRoles(filteredRoles);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //==============================================================================================================================================
  useEffect(() => {
    userAdded();
    getAllRoles();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setTeamData((prev) => {
      return { ...prev, [name]: value };
    });
    setStateBtn(1);
  }
  // console.log(teamData);
  const handleSave = () => {
    const updatedData = {
      first_name: teamData?.first_name,
      last_name: teamData?.last_name,
      email: teamData?.email,
    };
    axios
      .put(UPDATE_TEAM_MEM + teamData?.id, updatedData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("User data saved successfully", {
          position: "top-center",
          autoClose:2000
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error saving roles", {
          position: "top-center",
          autoClose:2000
        });
      });
  };

  const refreshData = () => {
    fetchData();
    userAdded();
    setStateBtn(0);
  }
  return (
    <>

        <section className="permission-container">
          <div className="back-to-user general-refresh">
            <Link to={"/lp/settings/usernteams"}>
              <button className="common-fonts">
                <img src={LeftArrow} alt="" />
                <span>Back To User</span>
              </button>
            </Link>
            <button type="button" className="permission-refresh-icon" title="Refresh" onClick={refreshData}>
              <i class="fa-sharp fa-solid fa-rotate permission-rotate-icon "></i>
              </button>
          </div>
          <div className="permission-user-container">
            <div className="permission-user-icon">
              <img src={User} alt="loading..." />
            </div>

            <div className="permission-user-details">
              <p className="common-fonts permission-username">
                {loading ? "" :teamData?.first_name + " " + teamData?.last_name}
              </p>
              <p className="common-fonts permission-email email-case">{loading ? "" :teamData?.email}</p>
            </div>

            <div>
              <button
                className="permission-reset-btn common-fonts"
                onClick={handleResetPasswordOpen}
              >
                Reset Password
              </button>
            </div>
          </div>

          <div className="permission-wrapper">
            <form action="">
              <div className="permission-display">
                <div>
                  <p className="common-fonts permission-user-info">
                    User Information
                  </p>

                  <div className="permission-input-box">
                    <label className="common-fonts permission-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      onChange={handleChange}
                      value={loading ? "-" :teamData?.first_name}
                      className="permission-input common-fonts"
                    />
                  </div>
                  <div className="permission-input-box">
                    <label className="common-fonts permission-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      onChange={handleChange}
                      value={loading ? "-" :teamData?.last_name}
                      className="permission-input common-fonts"
                    />
                  </div>
                  <div className="permission-input-box">
                    <label className="common-fonts permission-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      value={loading ? "-" :teamData?.email}
                      className="permission-input common-fonts email-case"
                    />
                  </div>
                </div>

                <div>
                  <p className="common-fonts permission-user-info">
                    Account Information
                  </p>

                  <div className="permission-input-box">
                    <label className="common-fonts permission-label">
                      password expiration date
                    </label>
                    <div className="custom-date-input">
                      <div className="permission-date-wrapper">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className="permission-date-input"
                          dateFormat="dd/MM/yyyy"
                          value={startDate}
                          placeholderText="dd/mm/yyyy"
                        />
                        <img
                          src={CalendarIcon}
                          alt="Delete"
                          className="permission-calender-icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div>
            <p className="permission-team-heading common-fonts">teams</p>
            {/* <p className="permission-note common-fonts">
              To create or edit a team, go to{" "}
              <a href="" className="permission-team-link">
                <span>&nbsp;Teams&nbsp;&nbsp;</span>
                <img src={TeamArrow} alt="" />
              </a>
            </p> */}
          </div>

          <div>
            <p className="common-fonts permission-assign-team">Assigned team</p>
            <p className="common-fonts permission-assign-note">
              Assigned team member will have all the access to teams lead,
              deals, contacts & companies. They will be the part of team
              notification, tasks, notes, workflow.
            </p>

            <div
              className="permission-input team-angel"
              onClick={handleTeamDisplay}
            >
              <i
                className={`fa-sharp fa-solid ${
                  actionOpen ? "fa-angle-up" : "fa-angle-down"
                }`}
              ></i>
            </div>
          </div>
          {actionOpen && (
            <div className="team-div-display">
              <ul className="common-fonts">
                <li>Anant Team</li>
                <li>Mahesh Team</li>
                <li>Aishwarya Team</li>
              </ul>
            </div>
          )}

          <div className={ loading ? 'permission-table-info permission-manage' : 'permission-table-info'}>
            <div className={loading && 'permission-manage'}>
              <p className="common-fonts permission-name">permissions</p>
              <p className="common-fonts permission-line">
                Permissions manage which tools are available to users.
              </p>
            </div>
            <div>
              <button
                onClick={handleAddRoleOpen}
                disabled = {loading ? true : false }
                className={loading ? "common-inactive-button" : "common-save-button"}
              >
                Assign Role
              </button>
            </div>
          </div>

          {
            loading ? (
              <>

              </>
            ) : (
              <>
              <div>
            <table className="permission-table">
              <thead>
                <tr className="common-fonts permission-table-heading">
                  <th>ROLE</th>
                  <th>MODULE</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                </tr>
              </thead>
              <tbody>
              {
                tableData?.map((data)=>{
                  return(
                    <tr className="common-fonts permission-table-heading" key={data?.id}>
                  <td>{data?.name}</td>
                  <td>contacts</td>
                  <td>
                    <div className="custom-date-input">
                      <div className="permission-date">
                        <DatePicker
                          selected={startDate1}
                          onChange={(date) => setStartDate1(date)}
                          className="permission-date-table"
                          dateFormat="dd/MM/yyyy"
                          value={startDate1}
                          placeholderText="dd/mm/yyyy"
                        />
                        <img src={CalendarIcon} alt="" className="cal-icon" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="custom-date-input">
                      <div className="permission-date">
                        <DatePicker
                          selected={endDate1}
                          onChange={(date) => setEndDate1(date)}
                          className="permission-date-table"
                          dateFormat="dd/MM/yyyy"
                          value={endDate1}
                          placeholderText="dd/mm/yyyy"
                        />
                        <img src={CalendarIcon} alt="" className="cal-icon" />
                      </div>
                    </div>
                  </td>
                </tr>

                  )
                })
              }

              </tbody>
            </table>
          </div>

          <div className="permission-page-btn">
            <button className="common-delete-button" onClick={resetForm}>Discard</button>
            {stateBtn === 0 ? (
              <button className="disabledBtn" disabled>
                Save
              </button>
            ) : (
              <button
                className="common-save-button permission-save-btn"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
              </>
              )
          }
        </section>
      {isAssignRole && (
        <AddRolePopUp
          onClose={handleAddRoleClose}
          roles={roles}
          user_id={id}
          email={teamData?.email}
          assignRoles={assignRolesArray}
          setData={fetchData}
        />
      )}
      {isResetPassowrd && (
        <ResetPassword onClose={handleResetPasswordClose} user={id} />
      )}
      <ToastContainer />
    </>
  );
};

export default LPPermission;
