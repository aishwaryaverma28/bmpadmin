import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import latest from "../assets/image/latest.jpg";
import amirAli from "../assets/image/amir-ali.png";
import ashwariya from "../assets/image/ashwariya.png";
import moira from "../assets/image/moira.png";
import rahul from "../assets/image/rahul.png";
import veneet from "../assets/image/veneet.png";
import may from "../assets/image/may.png";
import performance from "../assets/image/performence.svg";
import career from "../assets/image/career.svg";
import finance from "../assets/image/finance.svg";
import health from "../assets/image/health.svg";
import forms from "../assets/image/forms.svg";
import "./styles/Editor.css";
const Editor = () => {
  const [value, onChange] = useState(new Date());
  return (
    <>
      <header className="headerEditor">
        <h2>Dashboard</h2>
        
      </header>

      <main>
        <section className="dashboard">
          <div className="dashboardLeft">
            <div className="announcement-content">
              <img src={latest} alt="image" />
              <div className="announcementRight">
                <div className="announcementHeading">
                  <h2>Latest Announcement</h2>
                  <button type="button" className="secondary-btn view-btn">
                    view all
                  </button>
                </div>
                <div className="announcementContent">
                  <ul>
                    <li className="bg-active">
                      <a href="#">staff briefing - mandatory reading</a>
                      <i class="fa-sharp fa-solid fa-angle-right"></i>
                    </li>
                    <li>
                      <a href="#">
                        Office Relocation Update: What you need to
                        <br />
                        know before June 2023
                      </a>
                      <i class="fa-sharp fa-solid fa-angle-right"></i>
                    </li>
                    <li>
                      <a href="#">
                        Office Closures: Inform employees about planned office
                        closures due to holidays, maintenance, or any other
                        reasons.
                      </a>
                      <i class="fa-sharp fa-solid fa-angle-right"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboardRight">
            <div className="block">
              <div class="ceoMessage">
                <h2>CEO Message</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Etiam velit nisl
                  natoque sed neque molestie arcu habitasse. Nunc diam urna
                  vitae facilisi velit egestas cursus. Accumsan nisi gravida
                  nulla morbi nunc amet varius ornare. Consectetur dignissim
                  lectus purus cras et non condimentum et in.Lorem ipsum dolor
                  sit amet consectetur. Etiam velit nisl natoque sed neque
                  molestie arcu habitasse. Nunc diam urna vitae facilisi velit
                  egestas cursus. Accumsan nisi gravid.
                </p>
                <span>- vaneet gupta</span>
              </div>
            </div>
          </div>
        </section>
        <section className="dashboard">
          <div className="block">
            <div class="companyPeople">
              <h2>People at our Company</h2>

              <ul>
                <li>
                  <img src={amirAli} alt="" />
                  <p>
                    amir ali
                    <br />
                    <span>19 june - happy birthday</span>
                  </p>
                </li>

                <li>
                  <img src={rahul} alt="" />
                  <p>
                    rahul ali
                    <br />
                    <span>19 june - happy birthday</span>
                  </p>
                </li>

                <li>
                  <img src={moira} alt="" />
                  <p>
                    moira andrews
                    <br />
                    <span>19 june - happy birthday</span>
                  </p>
                </li>

                <li>
                  <img src={ashwariya} alt="" />
                  <p>
                    Aishwarya Ray
                    <br />
                    <span>03 june - happy birthday</span>
                  </p>
                </li>

                <li>
                  <img src={veneet} alt="" />
                  <p>
                    veneet gupta
                    <br />
                    <span>01 july - 7th anniversay</span>
                  </p>
                </li>

                <li>
                  <img src={may} alt="" />
                  <p>
                    may rueda
                    <br />
                    <span>29 july - 1st anniversay</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="blockCalender">
            <h2> Calendar</h2>
            <div className="calender">
              <Calendar onChange={onChange} value={value} />
            </div>
            <div className="calenderContent">
              <p>upcoming events</p>
              <ul>
                <li className="bg-active">
                  <a href="#">24 june 2023 - company meeting</a>
                  <i class="fa-sharp fa-solid fa-angle-right"></i>
                </li>
                <li className="calendarLi">
                  <a href="#">28 june 2023 - monthly catchup</a>
                  <i class="fa-sharp fa-solid fa-angle-right"></i>
                </li>
              </ul>
            </div>
          </div>
          <div className="block">
            <div class="links">
              <h2>Quick Links</h2>

              <div className="link-details">
                <ul>
                  <li>
                <a href="#" className="bg-active">
                  <img src={performance} alt="" />
                  <p>performance management</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <img src={career} alt="" />
                  <p>career</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <img src={finance} alt="" />
                  <p>finances</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <img src={health} alt="" />
                  <p>health & safety</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <img src={forms} alt="" />
                  <p>forms</p>
                </a>
                </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Editor;