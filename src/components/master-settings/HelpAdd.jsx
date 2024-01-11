import React from "react";
import "../styles/HelpAdd.css";
import axios from "axios";
import { ADD_HELP, getDecryptedToken } from "../utils/Constants";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const HelpAdd = () => {
  const decryptedToken = getDecryptedToken();
  const [helpData, setHelpData] = useState({
    site: "",
    slug: "",
    title: "",
    details: "",
    category: "8",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setHelpData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  const onSave = () => {
    const helpDataBody = {
      site: helpData.site,
      slug: helpData.title.toLowerCase().replace(/\s+/g, "-"),
      title: helpData.title,
      details: helpData.details,
      category: helpData.category,
    };
    // console.log(helpDataBody);

    axios
      .post(ADD_HELP, helpDataBody, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("label added successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        setHelpData({
          site: "",
          slug: "",
          title: "",
          details: "",
          category: "8",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <header className="helpHead">
        <h2>Add Help</h2>
      </header>
      <div className="helpContainer">
        <div className="helpBody">
          <p className="helpTitle">Question Title <span className="common-fonts redAlert"> *</span></p>
          <input
            type="text"
            placeholder="Enter Question"
            name="title"
            value={helpData.title}
            onChange={handleChange}
          ></input>
          <p className="helpTitle">Answer Description <span className="common-fonts redAlert"> *</span></p>
          <textarea
            name="details"
            type="textarea"
            rows="5"
            cols="5"
            placeholder="Enter Answer"
            value={helpData.details}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="helpRight">
          <div className="siteBox">
            <div className="siteHead">
              <h3>Site <span className="common-fonts redAlert"> *</span></h3>
            </div>
            <div className="help-content-box">
              <select
                className="SiteSelectBox"
                onChange={handleChange}
                value={helpData.site}
                name="site"
              >
                <option value="">Select a Site</option>
                <option value="leadplaner">leadplaner</option>
                <option value="bookmyplayer">bookmyplayer</option>
                <option value="routplaner">routplaner</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="help-bottom-btn">
        <button className="common-fonts common-delete-button">Cancel</button>
        <button
          className="common-fonts common-save-button help-save"
          onClick={onSave}
        >
          Save
        </button>
      </div>

      <ToastContainer />
    </>
  );
};

export default HelpAdd;
