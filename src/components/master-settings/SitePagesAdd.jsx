import React, { useState } from "react";
import axios from "axios";
import { ADD_SITEPGS, getDecryptedToken } from "../utils/Constants";
import "../styles/EmployeeUpdate.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SitePagesAdd = () => {
  const [updateMessage, setUpdateMessage] = useState("");
  const decryptedToken = getDecryptedToken();
  const [stateBtn, setStateBtn] = useState(0);
  const [details, setDetails] = useState({
    site: "",
    route: "",
    view_page: "",
    title: "",
    description: "",
    sitemap: 0,
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
    setStateBtn(1);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      ...details,
    };
    console.log(updatedFormData);

    axios
      .post(ADD_SITEPGS, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        // setUpdateMessage("Site Page data added successfully");
        // setTimeout(() => {
        //   setUpdateMessage("");
        // }, 30000); // Clear message after 1 minute (60000 milliseconds)
        toast.success("Site Page data added successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setDetails({
          site: "",
          route: "",
          view_page: "",
          title: "",
          description: "",
          sitemap: 0,
        });
        setStateBtn(0);
      });
  }
  return (
    <>
      <header className="headerEditor">
        <h2>Add new pages of your site</h2>
      </header>
      {updateMessage && <p className="updateMsg">{updateMessage}</p>}
      <form className="addEmployeeFrom" onSubmit={handleSubmit}>
        <div className="formDiv">
          <div className="leftForm">
            <div className="fromFiled">
              <label htmlFor="site">Site  <span className="common-fonts redAlert"> *</span></label>
              <input
                type="text"
                name="site"
                onChange={handleChange}
                id="site"
                placeholder="Please Enter Site Name"
              />
            </div>
            <div className="fromFiled">
              <label for="route">Route  <span className="common-fonts redAlert"> *</span></label>

              <input
                type="text"
                name="route"
                id="route"
                placeholder="Please Enter Route"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="description">Description  <span className="common-fonts redAlert"> *</span></label>

              <input
                type="text"
                name="description"
                id="description"
                placeholder="Please Enter Description"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="rightForm">
            <div className="fromFiled">
              <label for="view_page">View Page  <span className="common-fonts redAlert"> *</span></label>

              <input
                type="text"
                name="view_page"
                id="view_page"
                placeholder="Please Enter View Page"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="title">Title  <span className="common-fonts redAlert"> *</span></label>

              <input
                type="text"
                name="title"
                id="title"
                placeholder="Please Enter Title"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="sitemap">Sitemap  <span className="common-fonts redAlert"> *</span></label>

              <input
                type="number"
                name="sitemap"
                id="sitemap"
                placeholder="Please Enter Sitemap"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="saveBtnRight">
            {stateBtn === 0 ? (
              <button className="closeBtn" disabled>
                Save
              </button>
            ) : (
              <input type="submit" value="Add Site" className="secondaryBtn" />
            )}
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default SitePagesAdd;
