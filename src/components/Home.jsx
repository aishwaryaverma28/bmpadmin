import React, { useState } from "react";
import "./styles/Home.css";
import dollar from "../assets/image/dollar-circle.svg";
import call from "../assets/image/call.svg";
import profile from "../assets/image/profile-circle.svg";
import CalenderIcon from "../assets/image/calender2.svg";
import ProfilePic from "../assets/image/profile-pic.jpg";
import GreaterRight from "../assets/image/greater-right.svg";
import TimeIcon from "../assets/image/time-icon.svg";

const Home = () => {
 
  const [activeTab, setActiveTab] = useState('opentask');

  function handleTabChange(tabName){
    setActiveTab(tabName)
  }
  return (
    <>
      <header className="homeHeader">
        <section className="homeSecOne">
          <div className="greyHead">
            <img src={dollar} alt="$" />
            <p className="home">My Open Deals</p>
          </div>
          <div className="greyHead">
            <p className="homeNum">25</p>
            <p className="colorOval">
              <i class="fa-sharp fa-solid fa-arrow-up"></i> 0.08%
            </p>
          </div>
          <div className="greyHead">
            <p className="home">Last Month : 31</p>
          </div>
        </section>
        <section className="homeSecOne">
          <div className="greyHead">
            <i className="fa-sharp fa-regular fa-calendar"></i>
            <p className="home">My Untouched Deals</p>
          </div>
          <div className="greyHead">
            <p className="homeNum">35</p>
            <p className="colorRedOval">
              <i class="fa-sharp fa-solid fa-arrow-down"></i> 0.08%
            </p>
          </div>
          <div className="greyHead">
            <p className="home">Last Month : 31</p>
          </div>
        </section>
        <section className="homeSecOne">
          <div className="greyHead">
            <img src={call} alt="$" />
            <p className="home">My Calls Today</p>
          </div>
          <div className="greyHead">
            <p className="homeNum">35</p>
            <p className="colorOval">
              <i class="fa-sharp fa-solid fa-arrow-up"></i> 0.08%
            </p>
          </div>
          <div className="greyHead">
            <p className="home">Last Month : 10</p>
          </div>
        </section>
        <section className="homeSecOne">
          <div className="greyHead">
            <img src={profile} alt="$" />
            <p className="home">Leads</p>
          </div>
          <div className="greyHead">
            <p className="homeNum">159</p>
            <p className="colorOval">
              <i class="fa-sharp fa-solid fa-arrow-up"></i> 0.08%
            </p>
          </div>
          <div className="greyHead">
            <p className="home">Last Month : 166</p>
          </div>
        </section>
      </header>

      <main className="home-main-container">
        <section className="home-my-task"> 
          <section className="home-top">
          <p className="common-fonts my-task-heading">My Task</p>
        <div className="cp-billings-tabs">
    <button  
    className={`common-fonts ${activeTab === "opentask" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('opentask')}
    >Open Task</button>


    <button className={`common-fonts ${activeTab === "completed" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('completed')}
    >Completed</button>
    </div>
    </section>
    
  {activeTab === "opentask" && 
    (
        <>
        <div className="home-open-task">
          <table id='home-table'>
            <thead>
              <tr>
                <th className="common-fonts">Task Name</th>
                <th className="common-fonts">Status</th>
                <th className="common-fonts">Due Date</th>
                <th className="common-fonts">Contact Name</th>
              </tr>
            </thead>

            <tbody>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-element`}
                   >
                    <span>In Progress</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-todo`}
                   >
                    <span>To Do</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-todo`}
                   >
                    <span>To Do</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-element`}
                   >
                    <span>In Progress</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-element`}
                   >
                    <span>In Progress</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
              <tr className="home-table-value">
                <td>Create Schedule Meeting</td>
                <td>
                <div className="elements">
                  <span
                    className={`status-value new-todo`}
                   >
                    <span>To Do</span>
                  </span>
                </div>
                </td>

                <td>
                  <div className="home-today">
                  <div>
                    <img src={CalenderIcon} alt=""/>
                  </div>
                    <div>
                      <p className="common-fonts">Today</p>
                      <p className="common-fonts home-today-txt">At 12:00 AM</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="home-profile-pic">
                  <div className="home-person-details">
                  <img src={ProfilePic} alt="" />
                    <p className="common-fonts home-fox">John Fox</p>
                  </div>

                    <img src={GreaterRight} alt="" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </>
    )
  
         }
  {activeTab === "completed" && 
      (
        <>
          <p>complted</p>
        </>
      )
  
         }


        </section>
        <section className="home-right-container">
        <p className="common-fonts home-meetings">today Meetings</p>

        <div className="home-meetings-time">
          <div >
          <p className="common-fonts home-time"> 7:00 AM</p>
          </div>
         <div>
          <div className="home-call">
          <div className="home-call-img">
          <img src={call} alt="" />
          </div>

            <p className="common-fonts">meeting title Lorem Ipsum</p>
          </div>
         </div>
          <div className="time-icon">
            <img src={TimeIcon} alt="" />
          </div>
        </div>

        <div className="home-meetings-time">
          <div >
          <p className="common-fonts home-time"> 7:00 AM</p>
          </div>
         <div>
          <div className="home-call">
          <div className="home-call-img">
          <img src={call} alt="" />
          </div>

            <p className="common-fonts">meeting title Lorem Ipsum</p>
          </div>
         </div>
         <div className="time-icon">
            <img src={TimeIcon} alt="" />
          </div>
        </div>
        <div className="home-meetings-time">
          <div >
          <p className="common-fonts home-time"> 7:00 AM</p>
          </div>
         <div>
          <div className="home-call">
          <div className="home-call-img">
          <img src={call} alt="" />
          </div>

            <p className="common-fonts">meeting title Lorem Ipsum</p>
          </div>
         </div>
         <div className="time-icon">
            <img src={TimeIcon} alt="" />
          </div>
        </div>
        <div className="home-meetings-time">
          <div >
          <p className="common-fonts home-time"> 7:00 AM</p>
          </div>
         <div>
          <div className="home-call">
          <div className="home-call-img">
          <img src={call} alt="" />
          </div>

            <p className="common-fonts">meeting title Lorem Ipsum</p>
          </div>
         </div>
        </div>

        </section>
      </main>
    </>
  );
};

export default Home;
