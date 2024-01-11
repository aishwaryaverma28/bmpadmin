import React, { useEffect, useState, useRef } from "react";
import "./styles/HelpModal.css";
import Filter from "../assets/image/filter.svg";
import Peoples from "../assets/image/peoples.svg";
import Arrow from "../assets/image/arrow-right.svg";
import BlueDot from "../assets/image/bluedot.svg";


const NotificationModal = ({ onClose }) => {
  const [actionopen, setActionOpen] = useState(false);
  const actionDropDownRef = useRef(null);

  const toggleActionDropdown = () => {
    setActionOpen(!actionopen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        actionDropDownRef.current &&
        !actionDropDownRef.current.contains(event.target)
      ) {
        setActionOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="help-modal-container">
        <div className="help-modal-box">
          <p className="common-fonts notify-heading">Notification</p>

          <div className="select action-select notify-action">
            <div className="dropdown-container" ref={actionDropDownRef}>
              <div className="dropdown-header2" onClick={toggleActionDropdown}>
                Filter
                 <img src={Filter} alt="" />
              </div>
              {actionopen && (
                <div className="dropdown-menu notify-menu">
                  <p className="common-fonts notify-filter-by">Filter by</p>
                  <div className="notify-filter-menu">
                    <div className="notify-check">
                      <label className="cp-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="common-fonts">All</label>
                    </div>

                    <div className="notify-check">
                      <label className="cp-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="common-fonts">Mentions</label>
                    </div>

                    <div className="notify-check">
                      <label className="cp-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="common-fonts">Unread</label>
                    </div>

                    <div className="notify-check">
                      <label className="cp-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="common-fonts">Comments</label>
                    </div>

                    <div className="notify-check">
                      <label className="cp-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="common-fonts">Assign to you</label>
                    </div>


                  </div>

                  <div className="notify-btns">
                    <button className="common-fonts common-white-button">Cancel</button>
                    <button className="common-fonts notify-done common-save-button">Done</button>
                  </div>
                </div>
              )}
            </div>
            <div>
                <button className="common-fonts common-white-green-button">Mark all as read</button>
            </div>
          </div>

          <p className="common-fonts notify-day">Today</p>

          <div className="notify-box">
              <div className="notify-meeting">
                <img src={Peoples} alt="" />
                <div className="notify-meeting-text">
                    <p className="common-fonts notify-meet">Meeting</p>
                    <p className="common-fonts">4:00 PM <img src={Arrow} alt="" /> 5:00 PM</p>
                    <p className="common-fonts notify-view">View Full Schedule</p>
                </div>
              </div>

              <div>
                <p className="common-fonts notify-ago">44 minutes ago</p>
              </div>
          </div>

          <div className="notify-new-box">
          <div className="notify-dot">
          <img src={BlueDot} alt="" />
           <p className="common-fonts notify-edit-deal"> <span>Jenny</span> edited the deal <span>Hertz Deal</span></p>
          </div>
          
           <p className="common-fonts notify-dates">Sep 1, 10:12 AM</p>
          </div>

          <div className="notify-new-box-2">
          <div className="notify-dot">
          <img src={BlueDot} alt="" />
           <p className="common-fonts notify-edit-deal"> <span>Sammy</span> mentioned you in a comment on lead <span>Test Lead</span></p>
          </div>
          
           <p className="common-fonts notify-dates">Sep 1, 10:12 AM</p>
          </div>

          <p className="common-fonts notify-day">Yesterday</p>

          <div className="notify-new-box-2">
          <div className="notify-dot">
          <img src={BlueDot} alt="" />
           <p className="common-fonts notify-edit-deal"> <span>Helena Aston</span> assigned deal <span>Test Deal</span>from <span>Taher</span> to you</p>
          </div>
          
           <p className="common-fonts notify-dates">Sep 1, 10:12 AM</p>
          </div>

          <div className="notify-new-box-2 notify-last">
          <div className="notify-dot">
          <img src={BlueDot} alt="" />
           <p className="common-fonts notify-edit-deal"> <span>Helena Aston</span> assigned deal <span>Test Deal</span>from <span>Taher</span> to you</p>
          </div>
          
           <p className="common-fonts notify-dates">Sep 1, 10:12 AM</p>
          </div>
        </div>
        <div className="help-cross" onClick={onClose}>
          X
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
