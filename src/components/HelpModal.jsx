import React, { useState } from "react";
import "./styles/HelpModal.css";
import Heaphone from "../assets/image/headphone.svg";
import HeaphoneBlue from "../assets/image/headphone-blue.svg";
import Question from "../assets/image/question-black.svg";
import QuestionBlue from "../assets/image/question-icon.svg";
import Time from "../assets//image/time.svg";
import TimeBlue from "../assets//image/time-blue.svg";
import QuestionTab from "./QuestionTab";
import HeadPhone from "./HeadPhone";
import TimeTab from "./TimeTab";

const HelpModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("question");

  function handleTabChange(tabName) {
    setActiveTab(tabName);
  }

  return (
    <>
      <div className="help-modal-container">
        <div className="help-modal-box">
          <section>
            <div className="cp-billings-tabs help-tabs">
              <button
                className={`common-fonts ${
                  activeTab === "question" ? "cp-active" : ""
                }`}
                onClick={() => handleTabChange("question")}
              >
                <img
                  src={activeTab === "question" ? QuestionBlue : Question}
                  alt=""
                />
              </button>

              <button
                className={`common-fonts ${
                  activeTab === "headphone" ? "cp-active" : ""
                }`}
                onClick={() => handleTabChange("headphone")}
              >
                <img
                  src={activeTab === "headphone" ? HeaphoneBlue : Heaphone}
                  alt=""
                />
              </button>

              <button
                className={`common-fonts ${
                  activeTab === "time" ? "cp-active" : ""
                }`}
                onClick={() => handleTabChange("time")}
              >
                <img src={activeTab === "time" ? TimeBlue : Time} alt="" />
              </button>
            </div>
          </section>
          {activeTab === "question" && <QuestionTab />}
          {activeTab === "headphone" && <HeadPhone />}
          {activeTab === "time" && <TimeTab />}
        </div>
        <div className="help-cross" onClick={onClose}>
          X
        </div>
      </div>
    </>
  );
};

export default HelpModal;
