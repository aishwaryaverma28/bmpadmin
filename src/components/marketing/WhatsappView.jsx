import React from "react";
import NoImage from "../../assets/image/no-img.svg";
import Gallery from "../../assets/image/gallery-2.svg";
import { useRef } from "react";
import { useState } from "react";
import Video from "../../assets/image/video.svg";
import ReactEditor from "../ReactEditor";
import GreaterArrow from "../../assets/image/greater-arrow.svg";
import GreaterDown from "../../assets/image/greater-arrow-down.svg";

const WhatsappView = () => {
  const fileInputRef = useRef(null);
  const editorRef = useRef();
  const [fileName, setfileName] = useState("");
  const [selectedFile, setselectedFile] = useState(null);
  const [dataFromChild, setDataFromChild] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [buttons, setButtons] = useState([
    { id: 1, name: "Button 1", isVisible: true },
  ]);
  const [buttonTexts, setButtonTexts] = useState(Array(buttons.length).fill(""));

  const handleCTAButtonClick = () => {
    const newButtonName = `Button ${buttons.length + 1}`;
    const newButton = { id: buttons.length + 1, name: newButtonName, isVisible: true };
    const newButtons = [...buttons, newButton];
    setButtons(newButtons);
    setButtonTexts([...buttonTexts, ""]); // Set the buttonTexts state for the new button
  };
  
  
  const handleButtonTextChange = (event, index) => {

    const newButtonTexts = [...buttonTexts];
    newButtonTexts[index] = event.target.value;
    setButtonTexts(newButtonTexts);
  };
  

  const toggleButtonVisibility = (index) => {
    const updatedButtons = buttons.map((button, i) => {
      if (i === index) {
        return { ...button, isVisible: !button.isVisible };
      }
      return { ...button, isVisible: false }; // Hide other buttons
    });
    setButtons(updatedButtons);
  };

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      // If the day is already selected, remove it
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      // If the day is not selected, add it
      setSelectedDays([...selectedDays, day]);
    }
  };

  // const handleButtonTextChange = (event) => {
  //   setButtonText(event.target.value); // Update the state with the new input value
  // };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setfileName(file.name);
    setselectedFile(file);
  };

  const handleDataTransfer = (data) => {
    const sanitizedData = data.replace(/\n/g, "<br>");
    setDataFromChild(sanitizedData);
  };

  return (
    <div>
      <div className="whatsapp-view-container">
        <div className="whatsapp-view-left">
        
          <div className="whatsapp-display">
            <div className="whatsapp-img-display">
               {selectedFile && (
                <div className="bmp-image-preview-2 whatsapp-preview-img-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected Preview"
                    className="bmp-preview-image"
                  />
                </div>
              )}

              { !selectedFile &&
                <img src={NoImage} alt="" />
              }
            </div>
            <div className="whatsapp-dairy">
            <div className="whatsapp-content" contentEditable="true">
              {dataFromChild=== "" ? (
                <p className="common-fonts whatsapp-your-text">
                  Your Text Here
                </p>
              ) : (
                <p
                  className="common-fonts whatsapp-your-text"
                  dangerouslySetInnerHTML={{ __html: dataFromChild }}
                />
              )}
            </div>

            </div>

          </div>

          {
            buttons.map((val, index)=>{
              return (
                <div key={val.id} className="whatsapp-left-btn">
            <button className="common-fonts"> {buttonTexts[index]?.length !== 0 ? buttonTexts[index] : `Button ${index + 1}`}</button>
          </div>
              )
            })
          }
         
        </div>
        
        <div className="whatsapp-right-wrapper">
        <div className="whatsapp-right">
          <div className="whatsapp-top-label">
            <label htmlFor="" className="comon-fonts">
              Campaign Name
            </label>
            <input type="text" className="common-fonts common-input" />
          </div>

          <div>
            <div className="whatsapp-top-label">
              <label htmlFor="" className="comon-fonts whatsapp-new-label">
                Campaign Image
              </label>
            </div>
            <div className="bmp-upload-3 bmp-gap">
              <div className="contact-browse deal-doc-file">
                <span
                  className="common-fonts common-input contact-tab-input whatsapp-border"
                  style={{
                    position: "relative",
                    marginRight: "10px",
                  }}
                >
                  <button
                    className="contact-browse-btn common-fonts"
                    onClick={() => handleButtonClick()}
                  >
                    Add Image
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
                  <span className="common-fonts upload-file-name whatsapp-new-flex">
                    <img src={Gallery} alt="" />
                    <div className="whatsapp-para">
                      <p className="common-fonts light-color">
                        Add image from your computer
                      </p>
                      <p className="common-fonts bmp-format">
                        Support .jpg, .png, .gif, .mp4 max 10 mb
                      </p>
                    </div>
                  </span>
                </span>
              </div>

              {selectedFile && (
                <div className="bmp-image-preview-2 whatsapp-preview-img">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected Preview"
                    className="bmp-preview-image"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="whatsapp-react-editor">
            <div className="whatsapp-top-label">
              <label htmlFor="" className="comon-fonts whatsapp-new-label-2">
                Campaign Description
              </label>
              <div className="formEditor whatsapp-editor">
                <ReactEditor
                  ref={editorRef} // Add this line
                  onDataTransfer={handleDataTransfer}
                />
              </div>
            </div>
          </div>
<div className="whatsapp-cta-wrapper">

<div className="whatsapp-cta-btn">
          <p className="common-fonts">CTA Button</p>
          <button className="common-fonts common-white-blue-button" onClick={handleCTAButtonClick}>+ button</button>
          </div>

          {buttons.map((button, index) => (
        <div className="whatsapp-cta-btn-view" key={index}>
          <div className="whatsapp-btn-name" onClick={() => toggleButtonVisibility(index)}>
            <img src={button.isVisible ? GreaterDown : GreaterArrow} alt="" />
            <p className="common-fonts">{button.name}</p>
          </div>

          {button.isVisible && (
            <div className="whatsapp-btn-div">
              <div className="whatsapp-btn-label">
                <label htmlFor="" className="common-fonts">
                  Button Text
                </label>
                <input
                  type="text"
                  className="common-fonts common-input whatsapp-label-input"
                  value={buttonTexts[index]}
        onChange={(event) => handleButtonTextChange(event, index)}
      />

              </div>
              <div className="whatsapp-btn-label">
                <label htmlFor="" className="common-fonts">
                  Link Url
                </label>
                <input
                  type="text"
                  className="common-fonts common-input whatsapp-label-input"
                />
              </div>
            </div>
          )}
        </div>
      ))}

</div>


          <div className="whatsapp-participant">
            <label htmlFor="" className="common-fonts">Participant List</label>
            <select name="" id="" className="common-fonts common-input whatsapp-new-select">
              <option value="">Select Contact List</option>
            </select>
          </div>

          <div className="whatsapp-schedule">
          <label htmlFor="" className="common-fonts">Schedule Campaign</label>

          <div className="whatsapp-schedule-box">


          <div className="whatsapp-time-travel">
                  <div className="permission-input-box">
                    <label className="common-fonts whatsapp-date-label">Start Date</label>

                    <div className="custom-date-input">
                      <div className="whatsapp-date-wrapper">
                        <input
                          type="date"
                          name="scheduled_date"
                          className="whatsapp-date"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="common-fonts whatsapp-to">To</p>
                  </div>
                  <div className="permission-input-box">
                    <label className="common-fonts whatsapp-date-label">End Date</label>

                    <div className="custom-date-input">
                      <div className="whatsapp-date-wrapper">
                        <input
                          type="date"
                          name="scheduled_date"
                          className="whatsapp-date"
                        />
                      </div>
                    </div>
                  </div>
                  </div>

                  <div className="bmp-add-fields">
                  <label htmlFor="" className="common-fonts light-color">
                    Repeat days
                  </label>
                  <div className="bmp-days">
                    <div
                      className={`common-fonts bmp-add-days bmp-add-days-1 ${
                        selectedDays.includes("Sun") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Sun")}
                    >
                      Sun
                    </div>
                    <div
                      className={`common-fonts bmp-add-days ${
                        selectedDays.includes("Mon") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Mon")}
                    >
                      Mon
                    </div>
                    <div
                      className={`common-fonts bmp-add-days ${
                        selectedDays.includes("Tue") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Tue")}
                    >
                      Tue
                    </div>
                    <div
                      className={`common-fonts bmp-add-days ${
                        selectedDays.includes("Wed") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Wed")}
                    >
                      Wed
                    </div>
                    <div
                      className={`common-fonts bmp-add-days ${
                        selectedDays.includes("Thu") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Thu")}
                    >
                      Thu
                    </div>
                    <div
                      className={`common-fonts bmp-add-days ${
                        selectedDays.includes("Fri") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Fri")}
                    >
                      Fri
                    </div>
                    <div
                      className={`common-fonts bmp-add-days bmp-add-days-2 ${
                        selectedDays.includes("Sat") ? "blueDiv" : ""
                      }`}
                      onClick={() => handleDayClick("Sat")}
                    >
                      Sat
                    </div>
                  </div>
                </div>

                <div>
                    <label htmlFor="" className="common-fonts light-color">
                      Timings
                    </label>
                    <div className="bmp-input-flex-2 bmp-add-fields bmp-new-timing">
                      <div className="">
                        <input
                          className="common-fonts common-input common-fonts bmp-time-input"
                          placeholder="Enter Time"
                        ></input>
                      </div>
                      <select
                        name="time"
                        id=""
                        className="common-fonts common-input bmp-modal-select"
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>

                      <p className="common-fonts light-color bmp-to">To</p>

                      <div className="">
                        <input
                          className="common-fonts common-input common-fonts bmp-time-input"
                          placeholder="Enter Time" 
                        ></input>
                      </div>

                      <select
                        name=""
                        id=""
                        className="common-fonts common-input bmp-modal-select"
                       
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>


          </div>
          </div>

          
        </div>

        <div className="whatsapp-down-btn">
          <button className="common-fonts common-white-button">Cancel</button>
          <button className="common-fonts common-save-button whatsapp-new-save">Save</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappView;
