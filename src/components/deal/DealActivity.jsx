import React, { useState, useEffect } from "react";
import Call from "../../assets/image/call-activity.svg";
import Meeting from "../../assets/image/meeting.svg";
import Task from "../../assets/image/task.svg";
import Deadline from "../../assets/image/deadline.svg";
import bin from "../../assets/image/TrashFill.svg";
import axios from "axios";
import {
  GET_ACTIVITY,
  handleLogout,
  getDecryptedToken,
  ADD_ACTIVITY,
  DELETE_LEAD_ACTIVITY,
  UPDATE_LEAD_ACTIVITY,
} from "../utils/Constants";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/image/calendar-edit.svg";
import TextIcon from "../../assets/image/text-icon.svg";
import GreaterArrow from "../../assets/image/greater-arrow.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DealActivity = ({ item, type, id, count, userData, ownerId, idOfOwner }) => {
  const decryptedToken = getDecryptedToken();
  const [activeTab, setActiveTab] = useState("call");
  const [openEditor, setOpenEditor] = useState(false);
  const [stateBtn, setStateBtn] = useState(0);
  const [updateBtn, setUpdateBtn] = useState(0);
  const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expansion, setExpansion] = useState(false);
  const [tick, setTick] = useState(false);
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const [timeOptionsTo, setTimeOptionsTo] = useState(timeOptions);
  const [activity, setActivity] = useState([]);
  const [replaceAct, setReplaceAct] = useState([]);
  const selectedTimeFromIndex = timeOptionsTo.indexOf(selectedTimeFrom);
  const nextIndex = selectedTimeFromIndex + 1;
  const newTime =
    nextIndex < timeOptionsTo.length ? timeOptionsTo[nextIndex] : null;
  const [form, setForm] = useState({
    activity_description: "",
    activity_for: type,
    activity_name: "",
    scheduled_date: "",
    scheduled_time: "",
    activity_title: "",
    end_time: "",
    is_completed: null,
    source_id: type === "lead" ? item.id : id,
  });

  const fetchCall = () => {
    if (type === "lead") {
      axios
        .get(GET_ACTIVITY + "lead/" + item.id, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          setActivity(response?.data?.data);
          console.log(response.data.data)
          setReplaceAct(response?.data?.data);
        })

        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.message === "Invalid or expired token.") {
            alert(error?.response?.data?.message);
            handleLogout();
          }
        });
    } else if (type === "deal") {
      axios
        .get(GET_ACTIVITY + "deal/" + id, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          // console.log(response?.data?.data);
          setActivity(response?.data?.data);
          setReplaceAct(response?.data?.data);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.message === "Invalid or expired token.") {
            alert(error?.response?.data?.message);
            handleLogout();
          }
        });
    }else if (type === "xx_company") {
      axios
        .get(GET_ACTIVITY + "xx_company/" + id, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          // console.log(response?.data?.data);
          setActivity(response?.data?.data);
          setReplaceAct(response?.data?.data);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.message === "Invalid or expired token.") {
            alert(error?.response?.data?.message);
            handleLogout();
          }
        });
    }else if (type === "xx_contact_person") {
      axios
        .get(GET_ACTIVITY + "xx_contact_person/" + id, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          // console.log(response?.data?.data);
          setActivity(response?.data?.data);
          setReplaceAct(response?.data?.data);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.message === "Invalid or expired token.") {
            alert(error?.response?.data?.message);
            handleLogout();
          }
        });
    }
  };

  const handleActivityDelete = (id) => {
    axios
      .delete(DELETE_LEAD_ACTIVITY + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then(() => {
        toast.success("Activity Deleted successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchCall();
        count();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Invalid or expired token.") {
          alert(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    fetchCall();
  }, []);

  useEffect(() => {
    if (selectedTimeFrom) {
      // Filter timeOptions to get options for the second dropdown
      const filteredOptions = timeOptions.filter(
        (time) => time > selectedTimeFrom
      );
      setTimeOptionsTo(filteredOptions);
      setStateBtn(1);
    }
  }, [selectedTimeFrom]);

  const expandEditor = () => {
    setOpenEditor(true);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setStateBtn(1);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
    setStateBtn(1);
  }

  const handleAddNote = () => {
    let updatedEndTime;
    if (form.end_time === "") {
      updatedEndTime = newTime;
    } else {
      updatedEndTime = form.end_time;
    }

    const updatedFormData = {
      ...form,
      activity_for: type,
      activity_name: activeTab,
      scheduled_time: selectedTimeFrom,
      end_time: updatedEndTime,
      source_id: type === "lead" ? item.id : id,
    };
    axios
      .post(ADD_ACTIVITY, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if(response.data.status===0){
          toast.error(
               response.data.message,
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
         }else{
          toast.success("Activity added successfully", {
            position: "top-center",
            autoClose: 2000,
          });

         }
       
        setForm({
          activity_description: "",
          activity_name: "",
          scheduled_date: "",
          scheduled_time: "",
          end_time: "",
        });
        setActiveTab("call");
        fetchCall();
        count();
      })
      .catch((error) => {
        console.log(error);
      });
    fetchCall();
    setOpenEditor(false);
    setStateBtn(0);
  };

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setExpansion(false);
    } else {
      setExpandedIndex(index);
      setExpansion(true);
    }
  };

  const toggleCompletion = (index) => {
    setActivity((prevActivity) => {
      const newActivity = [...prevActivity];
      newActivity[index].is_completed = newActivity[index].is_completed === null ? 1 : null;
      return newActivity;
    });
    setUpdateBtn(1);
  };
  

  const handleTitleChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].activity_title = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };
  const handleDescriptionChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].activity_description = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };

  const handleDateChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].scheduled_date = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };

  const handleTimeChange = (event, index) => {
    const newActivity = [...activity];
    const selectedStartTime = event.target.value;
    newActivity[index].scheduled_time = selectedStartTime;
    const [hours, minutes] = selectedStartTime.split(":");
    const startTime = new Date();
    startTime.setHours(parseInt(hours, 10));
    startTime.setMinutes(parseInt(minutes, 10));
    startTime.setMinutes(startTime.getMinutes() + 15);
    const endHours = String(startTime.getHours()).padStart(2, "0");
    const endMinutes = String(startTime.getMinutes()).padStart(2, "0");
    const formattedEndTime = `${endHours}:${endMinutes}`;
    newActivity[index].end_time = formattedEndTime;
    setActivity(newActivity);
    setUpdateBtn(1);
  };

  const handleEndTimeChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].end_time = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };
  const handleAssignChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].assigned_to = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };

  const handleTypeChange = (event, index) => {
    const newActivity = [...activity];
    newActivity[index].activity_name = event.target.value;
    setActivity(newActivity);
    setUpdateBtn(1);
  };

  const handleCancleChange = () => {
   fetchCall();
  };

  const handleActivityUpdate = (actId, index) => {
    const newActivity = [...activity];
    const updatedData = {
      activity_for: type,
      activity_title: newActivity[index].activity_title,
      activity_description: newActivity[index].activity_description,
      scheduled_time: newActivity[index].scheduled_time,
      end_time: newActivity[index].end_time,
      activity_name: newActivity[index].activity_name,
      scheduled_date: newActivity[index].scheduled_date.split("T")[0],
      is_completed: newActivity[index].is_completed ,
      assigned_to:newActivity[index].assigned_to
    };
    console.log(updatedData);
    axios
      .put(UPDATE_LEAD_ACTIVITY + actId, updatedData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Activity updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchCall();
      })
      .catch((error) => {
        console.log(error);
      });
    setUpdateBtn(0);
  };

  const handleClose = () => {
    setOpenEditor(false);
    setForm({
      activity_description: "",
      activity_name: "",
      scheduled_date: "",
      scheduled_time: "",
      activity_title: "",
      end_time: "",
    });
    setActiveTab("call");
    setStateBtn(0);
  };

  return (
    <>
      <div className="activity-container ">
           {
            ownerId === idOfOwner && (
              <>
              {!openEditor ? (
          <div className="colapedEditor" onClick={expandEditor}>
            <p>Click here to add an activity</p>
          </div>
        ) : (
          <div className="activityBox">
            <div className="add-call">
              <input
                type="text"
                placeholder="Add Title *"
                name="activity_title"
                onChange={handleChange}
              />
            </div>
            <div className="genral-setting-btn activity-tab genral-setting-fonts">
              <button
                className={`genral-btn ${
                  activeTab === "call" ? "genral-active" : ""
                }`}
                onClick={() => handleTabClick("call")}
              >
                Call
              </button>
              <button
                className={`genral-btn ${
                  activeTab === "meeting" ? "genral-active" : ""
                }`}
                onClick={() => handleTabClick("meeting")}
              >
                Meeting
              </button>
              <button
                className={`genral-btn ${
                  activeTab === "task" ? "genral-active" : ""
                }`}
                onClick={() => handleTabClick("task")}
              >
                Task
              </button>
              <button
                className={`genral-btn ${
                  activeTab === "deadline" ? "genral-active" : ""
                }`}
                onClick={() => handleTabClick("deadline")}
              >
                Deadline
              </button>
            </div>

            <div className="tab-content">
              <div>
                <div className="activity-call-btn">
                  <button className="common-fonts log-meeting">Log Call</button>
                  <button className="common-fonts log-meeting call-btn-active">
                    Make a Phone Call
                  </button>
                </div>

                <div className="activity-time-travel">
                  <div className="permission-input-box">
                    <label className="common-fonts activity-label">Date  <span className="common-fonts redAlert"> *</span></label>

                    <div className="custom-date-input">
                      <div className="activity-date-wrapper">
                        <input
                          type="date"
                          onChange={handleChange}
                          name="scheduled_date"
                          className="activity-date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="permission-input-box">
                    <label className="common-fonts activity-label activity-label-2">
                      Time From
                      <span className="common-fonts redAlert"> *</span>
                    </label>
                    <select
                      name="timeFrom"
                      id="timeFrom"
                      className="common-fonts activity-select"
                      onChange={(e) => setSelectedTimeFrom(e.target.value)}
                    >
                      {timeOptions?.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="permission-input-box">
                    <label className="common-fonts activity-label activity-label-2">
                      Time To
                      <span className="common-fonts redAlert"> *</span>
                    </label>

                    <select
                      name="end_time"
                      id="timeTo"
                      onChange={handleChange}
                      className="common-fonts activity-select"
                    >
                      {timeOptionsTo?.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="activity-text">
                  <img src={TextIcon} alt="" />
                  <textarea
                    name="activity_description"
                    id="activity_description"
                    cols="30"
                    rows="10"
                    className="common-fonts activity-text-area"
                    placeholder="Write Here"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="activity-text">
                  <img src={TextIcon} alt="" />
                  <select
                    name="assigned_to"
                    onChange={handleChange}
                    id=""
                    className="common-fonts activity-select-area"
                  >
                  <option value="">Select Assign to *</option>
                                             {userData?.map((item) => (
                            <option
                              key={item?.id}
                              value={item?.id}
                              className="owner-val"
                            >
                              {`${
                                item?.first_name.charAt(0).toUpperCase() +
                                item?.first_name.slice(1)
                              } ${
                                item?.last_name.charAt(0).toUpperCase() +
                                item?.last_name.slice(1)
                              }`}
                            </option>
                          ))}
                  </select>
                </div>

                <div className="activity-button deal-activity-btn">
                  <button className="common-fonts common-white-button" onClick={handleClose}>Cancel</button>
                  {stateBtn === 0 ? (
                    <button disabled className="common-fonts common-inactive-button">
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={handleAddNote}
                      className="common-fonts common-save-button"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
              </>
            )
           }
        <div className="activity-height">
          {activity &&
            activity?.map((item, index) => (
              <div className="activity-task-map">
                <div className="activity-bottom">
                  <div className="savedNotes activity-save-note">
                    <>
                      <section className="note-display">
                        <div className="note-content activity-content">
                          <div
                            className="arrow-greater activity-new-arrow"
                            onClick={() => toggleExpand(index)}
                          >
                            <img src={GreaterArrow} alt="" />
                          </div>

                          <div className="notes-main">
                            <div className="activity-flex">
                              <div
                                className="notes-by activity-by "
                                onClick={() => toggleExpand(index)}
                              >
                                <p className="common-fonts activity-assigned-to">
                                  {item.activity_name} Assigned to :
                                  <span>{item.assigned_user_fname} {item.assigned_user_lname}</span>
                                </p>

                                <div className="activity-date-time">
                                  <img src={CalendarIcon} alt="" />
                                  <p className="common-fonts activity-due">
                                    {item.scheduled_date &&
                                    item.scheduled_date.includes("T") &&
                                    item.scheduled_date.includes(".")
                                      ? item.scheduled_date.split("T")[0] +
                                        " at " +
                                        item.scheduled_date
                                          .split("T")[1]
                                          .split(".")[0]
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                              {
                                ownerId === idOfOwner && (
                                  <div className="three-side-dots activity-del">
                                <img
                                  src={bin}
                                  alt="trash"
                                  title="Delete"
                                  onClick={() => handleActivityDelete(item.id)}
                                  className="activity-trash"
                                />
                              </div>
                                )
                              }

                            </div>

                            <div
                              className={`activity-phone ${
                                expandedIndex !== index
                                  ? "activity-disable-white"
                                  : "activity-new-call"
                              }`}
                            >
                              <div className="activity-ring">
                                <i
                                  className={`fa fa-check-circle ${
                                    expandedIndex !== index
                                      ? "hide-activity-tick"
                                      : "show-activity-tick"
                                  } ${
                                    item.is_completed === 1
                                      ? "green-activity-tick"
                                      : "white-activity-tick"
                                  } `}
                                  onClick={() => {
    if (ownerId === idOfOwner) {
      toggleCompletion(index);
    }
  }}
                                  aria-hidden="true"
                                ></i>
                                <input
                                  disabled={
                                    expandedIndex !== index ? true : false
                                  }
                                  className={`common-fonts activity-call-name ${
                                    expandedIndex !== index
                                      ? "activity-new-disable-white"
                                      : "activity-new-input"
                                  }`}
                                  type="text"
                                  value={item?.activity_title}
                                  name="activity_title"
                                  onChange={(event) =>
                                    handleTitleChange(event, index)
                                  }
                                />
                              </div>
                            </div>

                            {expandedIndex === index && (
                              <>
                                <div className="activity-open-time">
                                  <div className="activity-timefrom">
                                    <label>Due Date</label>

                                    <div className="custom-date-input activity-new-date">
                                      <div className="">
                                        <input
                                          type="date"
                                          value={
                                            item.scheduled_date.split("T")[0]
                                          }
                                          name="scheduled_date"
                                          onChange={(event) =>
                                            handleDateChange(event, index)
                                          }
                                          disabled={ownerId!==idOfOwner}
                                          id="date-bg"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="activity-timefrom">
                                    <label htmlFor="">Time From</label>
                                    <select
                                      name="scheduled_time"
                                      id=""
                                      className="common-fonts activity-timefrom-select"
                                      value={item?.scheduled_time?.slice(0, 5)}
                                      onChange={(event) =>
                                        handleTimeChange(event, index)
                                      }
                                      disabled={ownerId!==idOfOwner}
                                    >
                                      {timeOptions?.map((time, index) => (
                                        <option key={index} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="activity-timefrom">
                                    <label htmlFor="">Time To</label>
                                    <select
                                      name="end_time"
                                      id=""
                                      className="common-fonts activity-timefrom-select"
                                      value={item?.end_time?.slice(0, 5)}
                                      onChange={(event) =>
                                        handleEndTimeChange(event, index)
                                      }
                                      disabled={ownerId!==idOfOwner}
                                    >
                                      {timeOptions?.map((time, index) => (
                                        <option key={index} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="activity-timefrom">
                                    <label htmlFor="">Type</label>
                                    <select
                                      name="activity_name"
                                      id="activity_name"
                                      value={item?.activity_name}
                                      className="common-fonts activity-timefrom-select"
                                      onChange={(event) =>
                                        handleTypeChange(event, index)
                                      }
                                      disabled={ownerId!==idOfOwner}
                                    >
                                      <option value="Call">Call</option>
                                      <option value="Meeting">Meeting</option>
                                      <option value="Task">Task</option>
                                      <option value="Deadline">Deadline</option>
                                    </select>
                                  </div>
                                  <div className="activity-timefrom">
                                    <label htmlFor="">Assign To</label>
                                    <select
                                      name=""
                                      id=""
                                      className="common-fonts activity-timefrom-select"
                                      onChange={(event) =>
                                        handleAssignChange(event, index)
                                      }
                                      value={item?.assigned_to}
                                      disabled={ownerId!==idOfOwner}
                                    >
                                                                                  {userData?.map((item,index) => (
                            <option
                              key={item?.id}
                              value={item?.id}
                              className="owner-val"
                            >
                              {`${
                                item?.first_name.charAt(0).toUpperCase() +
                                item?.first_name.slice(1)
                              } ${
                                item?.last_name.charAt(0).toUpperCase() +
                                item?.last_name.slice(1)
                              }`}
                            </option>
                          ))}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <p className="common-fonts activity-describe">
                                    Description
                                  </p>
                                  <textarea
                                    name="activity_description"
                                    cols="30"
                                    rows="5"
                                    className="activity-big-textarea"
                                    value={item?.activity_description}
                                    onChange={(event) =>
                                      handleDescriptionChange(event, index)
                                    }
                                    disabled={ownerId!==idOfOwner}
                                  ></textarea>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </section>

                      {expandedIndex === index && (
                        <div className={"answer display_answer"}></div>
                      )}
                    </>
                  </div>
                </div>
                {
                  ownerId===idOfOwner && (
                    <>
                    {expandedIndex === index && (
                  <div className="activity-bottom-buttons">
                    <button
                      className="common-fonts common-white-button"
                      onClick={handleCancleChange}
                    >
                      Cancel
                    </button>

                    {updateBtn === 0 ? (
                      <button disabled className="common-fonts common-inactive-button note-btn">
                        Save
                      </button>
                    ) : (
                      <button
                        className="common-save-button common-fonts activity-save-button note-btn"
                        onClick={() => handleActivityUpdate(item.id, index)}
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}
                    </>
                  )
                }
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DealActivity;
