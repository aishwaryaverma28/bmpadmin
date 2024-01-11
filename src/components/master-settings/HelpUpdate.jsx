import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  GET_HELP_ID,
  UPDATE_HELP,
  getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import LeftArrow from "../../assets/image/arrow-left.svg";

const HelpUpdate = () => {
  const { id } = useParams();
  const decryptedToken = getDecryptedToken();
  const [helpData, setHelpData] = useState({
    site: "",
    slug: "",
    title: "",
    details: "",
    category: "8",
  });
  async function getHelp() {
    const response = await axios.get(GET_HELP_ID + id, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
      },
    });
    const data = response?.data?.data[0];
    setHelpData({
      ...helpData,
      site: data.site,
      slug: data.slug,
      title: data.title,
      details: data.details,
    });
    console.log(data);
  }
  useEffect(() => {
    getHelp();
  }, []);

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
      .put(UPDATE_HELP + id, helpDataBody, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("label added successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <header className="helpHead">
        <h2>Update Help</h2>
      </header>
      <div className="back-to-user general-refresh">
        <Link to={"/lp/settings/helpSection/update"}>
          <button className="common-fonts">
            <img src={LeftArrow} alt="" />
            <span>Back To Help Table</span>
          </button>
        </Link>
      </div>
      <div className="helpContainer">
        <div className="helpBody">
          <p className="helpTitle">Question Title</p>
          <input
            type="text"
            placeholder="Enter Question"
            name="title"
            value={helpData.title}
            onChange={handleChange}
          ></input>
          <p className="helpTitle">Answer Description</p>
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
              <h3>Site</h3>
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

export default HelpUpdate;
