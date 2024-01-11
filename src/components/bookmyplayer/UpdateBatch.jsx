import React, { useState, useEffect } from "react";
import "../styles/HelpModal.css";
import axios from "axios";
import { getDecryptedToken, RESTRICTED_KEYWORDS, UPDATE_BATCH } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UpdateBatch = ({ onClose, fetchBatch, batchId, batch }) => {
  // console.log(batch);
  const decryptedToken = getDecryptedToken();
    const [selectedDays, setSelectedDays] = useState([]);
    const [batchTitle, setBatchTitle] = useState("");
    const [ageGroups, setAgeGroups] = useState([{ minAge: "", maxAge: "" }]);
    const [showMaxAgeMessage, setShowMaxAgeMessage] = useState(false);
    const [times, setTimes] = useState([{ minTime: "", maxTime: "" }]);
    const [showTimeMessage, setShowTimeMessage] = useState(false);
    const [feeGroups, setFeeGroups] = useState([{ month: "", fees: "" }]);
    const [showFeeMessage, setShowFeeMessage] = useState(false);
    const [stateBtn, setStateBtn] = useState(0);
    const id = localStorage.getItem("academy_id");
    const [keywords, setKeywords] = useState(["murder", "kill", "killer", "kill you"]);
    // const getAllKeywords = () => {
    //     axios.get(RESTRICTED_KEYWORDS, {
    //         headers: {
    //             Authorization: `Bearer ${decryptedToken}`,
    //         },
    //     })
    //         .then((response) => {
    //             const newKeywords = response?.data?.data.map(keywordObj => keywordObj.keyword);
    //             setKeywords(newKeywords);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }
    // useEffect(() => {
    //     getAllKeywords();
    // }, [])
    useEffect(() => {
      // Set the initial state using values from the 'batch' prop
      if (batch) {
        setBatchTitle(batch.title);  
        const ageGroupsArray = batch.age_group.split(', ').map((ageGroup) => {
          const [minAge, maxAge] = ageGroup.split('-');
          return { minAge, maxAge: maxAge.replace(/\D/g, '') };
        });
        setAgeGroups(ageGroupsArray);
        const selectedDaysArray = batch.weekly_days.split(', ');
        setSelectedDays(selectedDaysArray);
        const timingsArray = batch.timing.split(', ').map((timing) => {
          const [minTime, maxTime] = timing.split(' to ');
          return { minTime, maxTime };
        });
        setTimes(timingsArray);
        const feeGroupsArray = batch.fees.split(', ').map((feeGroup) => {
          const [month, fees] = feeGroup.split(' month-');
          return { month, fees };
        });
        setFeeGroups(feeGroupsArray);
      }
    }, [batch]);
  
   // ===========================================================function for batch name
   const handleInputChange = (e) => {
    const title = e.target.value;
    let redText = false;
    let disableSaveButton = false;
const words = title.split(' ');
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
  e.target.style.color = 'red';
} else {
  e.target.style.color = '';
}
    setBatchTitle(title);
    setStateBtn(disableSaveButton ? 0 : 1);
}
// ========================================================function for batch age
const handleMinAgeChange = (e, index) => {
    const ageGroupsCopy = [...ageGroups];
    ageGroupsCopy[index].minAge = e.target.value;
    setAgeGroups(ageGroupsCopy);
    setShowMaxAgeMessage(true);
    setStateBtn(0);
}

const handleMaxAgeChange = (e, index) => {
    const ageGroupsCopy = [...ageGroups];
    ageGroupsCopy[index].maxAge = e.target.value;
    setAgeGroups(ageGroupsCopy);
    setShowMaxAgeMessage(false);
    setStateBtn(1);
}

const addAgeGroup = () => {
    setAgeGroups([...ageGroups, { minAge: "", maxAge: "" }]);
}

const ageGroupStrings = ageGroups.map((group, index) => {
    return `${group.minAge}-${group.maxAge} yrs`;
});
// ===========================================================function for days
const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
        setSelectedDays(
            selectedDays.filter((selectedDay) => selectedDay !== day)
        );
    } else {
        setSelectedDays([...selectedDays, day]);
    }
};

// ========================================================function for batch fee
const handleMonthChange = (e, index) => {
    console.log(e.target.value)
    const feeGroupsCopy = [...feeGroups];
    feeGroupsCopy[index].month = e.target.value;
    setFeeGroups(feeGroupsCopy);
    setShowFeeMessage(true);
    setStateBtn(0);
}

const handleFeeChange = (e, index) => {
    console.log(e.target.value)
    const feeGroupsCopy = [...feeGroups];
    feeGroupsCopy[index].fees = e.target.value;
    setFeeGroups(feeGroupsCopy);
    setShowFeeMessage(false);
    setStateBtn(1);
}

const addFeeGroup = () => {
    setFeeGroups([...feeGroups, { month: "", fees: "" }]);
}

const feeGroupStrings = feeGroups.map((group, index) => {
    return `${group.month} month-${group.fees}`;
});

// ========================================================function for batch age
const timeOptions = [];
for (let hours = 0; hours <= 23; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeOptions.push(formattedTime);
    }
}
const handleMinTimeChange = (e, index) => {
    const timeCopy = [...times];
    timeCopy[index].minTime = e.target.value;
    setTimes(timeCopy);
    setShowTimeMessage(true);
    setStateBtn(0);
}

const handleMaxTimeChange = (e, index) => {
    const timeCopy = [...times];
    timeCopy[index].maxTime = e.target.value;
    setTimes(timeCopy);
    setShowTimeMessage(false);
    setStateBtn(1);
}

const addTimeGroup = () => {
    setTimes([...times, { minTime: "", maxTime: "" }]);
}

const timeStrings = times.map((group, index) => {
    return `${group.minTime} to ${group.maxTime}`;
});
// ========================================================function to add new batch
const fetchBatchData = (event) => {
    event.preventDefault();
    console.log("Batch Title:", batchTitle);
    console.log("Age Groups:", ageGroupStrings.join(", "));
    console.log("Days:", selectedDays.join(", "));
    console.log("Time:", timeStrings.join(", "));
    console.log("Fee Groups:", feeGroupStrings.join(", "));
    const body = {
        object_id: parseInt(id),
        object_type: "academy",
        title: batchTitle,
        age_group: ageGroupStrings.join(", "),
        weekly_days: selectedDays.join(", "),
        timing: timeStrings.join(", "),
        fees: feeGroupStrings.join(", ")
    }
    axios
        .put(UPDATE_BATCH + batchId, body, {
            headers: {
                Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
            },
        })
        .then((response) => {
            console.log(response)
            if (response?.data?.status === 1) {
                toast.success("Batch added successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
                onClose();
            } else {
                toast.error(
                    response?.data?.message,

                    {
                        position: "top-center",
                        autoClose: 2000,
                    }
                );
            }
            fetchBatch();
        })
        .catch((error) => {
            toast.error("Some Error Occoured!", {
                position: "top-center",
                autoClose: 2000,
            });
        })
}


  return (
    <>
    <div className="help-modal-container">
        <div className="help-modal-box">
            <section>
                <div className="bmp-add-new-batch">
                    <p className="common-fonts bmp-add-heading">Update Batch</p>
                </div>

                <div className="bmp-wrapper">
                    <div className="bmp-modal-form">
                        <div className="bmp-add-fields">
                            <label htmlFor="" className="common-fonts light-color">
                                Batch Name
                            </label>
                            <input
                                type="text"
                                className="common-fonts common-input bmp-modal-input"
                                name="title"
                                onChange={handleInputChange}
                                value={batchTitle}
                            />
                        </div>
                        <div className="bmp-agegroup">
                            <label htmlFor="" className="common-fonts light-color batchErrorLable">
                                Age Group {showMaxAgeMessage ? (
                                    <p className="common-fonts redAlert">Please enter maximum age</p>
                                ) : (
                                    <p className="common-fonts light-color" style={{ visibility: 'hidden' }}>
                                        &nbsp;
                                    </p>
                                )}
                            </label>
                            {ageGroups.map((group, index) => (
                                <div key={index}>
                                    <div className="bmp-input-flex-2 bmp-add-fields">
                                        <input
                                            type="number"
                                            className="common-fonts common-input bmp-modal-input"
                                            placeholder="Min Age"
                                            onChange={(e) => handleMinAgeChange(e, index)}
                                            value={group.minAge}
                                        />
                                        <p className="common-fonts light-color bmp-to">To</p>
                                        <input
                                            type="number"
                                            className="common-fonts common-input bmp-modal-input"
                                            placeholder="Max Age"
                                            onChange={(e) => handleMaxAgeChange(e, index)}
                                            value={group.maxAge}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bmp-group">
                            <button
                                className="common-fonts common-white-blue-button"
                                onClick={addAgeGroup}
                            >
                                + Add Groups
                            </button>
                        </div>

                        <div className="bmp-add-fields">
                            <label htmlFor="" className="common-fonts light-color">
                                Weekly days
                            </label>
                            <div className="bmp-days">
                                <div
                                    className={`common-fonts bmp-add-days bmp-add-days-1 ${selectedDays.includes("Sun") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Sun")}
                                >
                                    Sun
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days ${selectedDays.includes("Mon") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Mon")}
                                >
                                    Mon
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days ${selectedDays.includes("Tue") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Tue")}
                                >
                                    Tue
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days ${selectedDays.includes("Wed") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Wed")}
                                >
                                    Wed
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days ${selectedDays.includes("Thu") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Thu")}
                                >
                                    Thu
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days ${selectedDays.includes("Fri") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Fri")}
                                >
                                    Fri
                                </div>
                                <div
                                    className={`common-fonts bmp-add-days bmp-add-days-2 ${selectedDays.includes("Sat") ? "blueDiv" : ""
                                        }`}
                                    onClick={() => handleDayClick("Sat")}
                                >
                                    Sat
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="common-fonts light-color batchErrorLable">
                                Timings {showTimeMessage ? (
                                    <p className="common-fonts redAlert">Please enter closing time</p>
                                ) : (
                                    <p className="common-fonts light-color" style={{ visibility: 'hidden' }}>
                                        &nbsp;
                                    </p>
                                )}

                            </label>
                            {times.map((group, index) => (
                                <div key={index}>
                                    <div className="bmp-input-flex-2 bmp-add-fields  bmp-new-timing">
                                        <select
                                            onChange={(e) => handleMinTimeChange(e, index)}
                                            value={group.minTime}
                                            name=""
                                            id=""
                                            className="common-fonts common-input bmp-modal-select-2 bmp-select-fee"
                                        >
                                            <option value="">Start time</option>
                                            {timeOptions.map((time, index) => (
                                                <option key={index} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            onChange={(e) => handleMaxTimeChange(e, index)}
                                            value={group.maxTime}
                                            name=""
                                            id=""
                                            className="common-fonts common-input bmp-modal-select-2 bmp-select-fee"
                                        >
                                            <option value="">End time</option>
                                            {timeOptions.map((time, index) => (
                                                <option key={index} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bmp-group">
                            <button
                                className="common-fonts common-white-blue-button"
                                onClick={addTimeGroup}
                            >
                                + Add Timings
                            </button>
                        </div>
                        <div>
                            <label htmlFor="" className="common-fonts light-color batchErrorLable">
                                Fee {showFeeMessage ? (
                                    <p className="common-fonts redAlert">Please enter amount</p>
                                ) : (
                                    <p className="common-fonts light-color" style={{ visibility: 'hidden' }}>
                                        &nbsp;
                                    </p>
                                )}
                            </label>
                            {feeGroups.map((group, index) => (
                                <div key={index}>
                                    <div className="bmp-input-flex-2 bmp-add-fields  bmp-new-timing">
                                        <select
                                            onChange={(e) => handleMonthChange(e, index)}
                                            value={group.month}
                                            name=""
                                            id=""
                                            className="common-fonts common-input bmp-modal-select-2 bmp-select-fee"
                                        >
                                            <option value="">Months</option>
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
                                        </select>
                                        <input
                                            type="text"
                                            className="common-fonts common-input bmp-modal-input"
                                            placeholder="Enter your amount"
                                            onChange={(e) => handleFeeChange(e, index)}
                                            value={group.fees}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                className="common-fonts common-white-blue-button"
                                onClick={addFeeGroup}
                            >
                                + Add fields
                            </button>
                        </div>
                    </div>

                    <div className="bmp-add-bottom-btn">
                        <button className="common-fonts common-white-button" onClick={onClose}>
                            Cancel
                        </button>
                        {stateBtn === 0 ? (
                            <button className="disabledBtn">Save</button>
                        ) : (
                            <button
                                className="common-save-button common-save"
                                onClick={fetchBatchData}
                            >
                                Update
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
        <div className="help-cross" onClick={onClose}>
            X
        </div>
    </div>
</>
  )
}

export default UpdateBatch