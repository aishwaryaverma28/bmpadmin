import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  GET_SITEPGS,
  PUT_SITEPGS,
  getDecryptedToken,
} from "../utils/Constants";
import "../styles/EmployeeUpdate.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SitePagesUpdate = () => {
  const { id } = useParams();
  const [empData, setEmpData] = useState([]);
  const [currentEmp, setCurrentEmp] = useState({});
  const [originalFormData, setOriginalFormData] = useState({});
  const decryptedToken = getDecryptedToken();
  const [formData, setFormData] = useState({
    site: "",
    route: "",
    view_page: "",
    title: "",
    description: "",
    sitemap: 0,
  });
  const [stateBtn, setStateBtn] = useState(0);
  const [updateMessage, setUpdateMessage] = useState("");
  useEffect(() => {
    getEmployeeInfo();
  }, []);

  async function getEmployeeInfo() {
    const response = await axios.get(GET_SITEPGS, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
      },
    });
    const data = response.data.data;
    setEmpData(data);
    searchData(data);
  }

  function searchData(data) {
    const employee = data.find((item) => item.id == id);
    if (employee) {
      setCurrentEmp(employee);
      setOriginalFormData({
        ...formData,
        site: employee.site,
        route: employee.route,
        view_page: employee.view_page,
        title: employee.title,
        description: employee.description,
        sitemap: employee.sitemap,
      });
      setFormData({
        ...formData,
        site: employee.site,
        route: employee.route,
        view_page: employee.view_page,
        title: employee.title,
        description: employee.description,
        sitemap: employee.sitemap,
      });
    }
  }
  function handleChange(event) {
    const { name, value } = event.target;
    if (formData[name] !== value) setStateBtn(1);
    setFormData({ ...formData, [name]: value });
  }

  function handleCancel() {
    setFormData(originalFormData);
    setStateBtn(0);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      site: formData.site,
      route: formData.route,
      view_page: formData.view_page,
      title: formData.title,
      description: formData.description,
      sitemap: formData.sitemap,
    };
    axios
      .put(PUT_SITEPGS + id, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Site Pages data updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      });
    setStateBtn(0);
  }

  return (
    <>
      <header className="headerEditor">
        <h2>Update Employee Details</h2>
      </header>
      {updateMessage && <p className="updateMsg">{updateMessage}</p>}
      <form className="addEmployeeFrom" onSubmit={handleSubmit}>
        <div className="formDiv">
          <div className="leftForm">
            <div className="fromFiled">
              <label htmlFor="site">Site</label>
              <input
                type="text"
                name="site"
                onChange={handleChange}
                id="site"
                value={formData.site}
                placeholder="Please Enter Site Name"
              />
            </div>
            <div className="fromFiled">
              <label for="route">Route</label>

              <input
                type="text"
                name="route"
                id="route"
                value={formData.route}
                placeholder="Please Enter Route"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="description">Description</label>

              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                placeholder="Please Enter Description"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="rightForm">
            <div className="fromFiled">
              <label for="view_page">View Page</label>

              <input
                type="text"
                name="view_page"
                id="view_page"
                value={formData.view_page}
                placeholder="Please Enter View Page"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="title">Title</label>

              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                placeholder="Please Enter Title"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="sitemap">Sitemap</label>

              <input
                type="number"
                name="sitemap"
                id="sitemap"
                value={formData.sitemap}
                onChange={handleChange}
                placeholder="Please Enter Sitemap"
              />
            </div>
          </div>
          <div className="saveBtnRight">
            <button type="button" className="cancleBtn" onClick={handleCancel}>
              Cancel
            </button>
            {stateBtn === 0 ? (
              <button className="closeBtn">
                <Link to={"/lp/settings/sitePages/view"}>Close</Link>
              </button>
            ) : (
              <input
                type="submit"
                value="Save"
                className="secondaryBtn saveBtn"
              />
            )}
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default SitePagesUpdate;
