import React, { useState } from "react";
import { getDecryptedToken, ADD_LEAGUE } from "../../utils/Constants";
import "../../styles/Tournament.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import TournamentModal from "./TournamentModal.jsx";
const AddTournament = () => {
  const decryptedToken = getDecryptedToken();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [stateBtn, setStateBtn] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    title: "title",
    sport: "",
    website: "",
    intro: "",
    phone: "",
    email: "",
    pathway: "",
    advantages: "",
    rules: "",
    description: "",
    level: "",
    category: "",
    keywords: "",
    contact: "",
  });

  const modalOpen = () => {
    setOpen(true);
  }
  const modalClose = () => {
    setOpen(false);
  }



  //===================================================================form function
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
    setStateBtn(1);
  }

  const onSave = (e) => {
    e.preventDefault();
    axios
      .post(ADD_LEAGUE, formData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setId(response?.data?.data?.insertId)
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(modalOpen, 1500);
        setFormData({
          name: "",
          title: "title",
          sport: "",
          website: "",
          intro: "",
          phone: "",
          email: "",
          pathway: "",
          advantages: "",
          rules: "",
          description: "",
          level: "",
          category: "",
          keywords: "",
          contact: "",
        })
        setStateBtn(0);
      })
      .catch((error) => {
        toast.error("some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  return (
    <>
      <header className="headerEditor">
        <p className="common-fonts add-new-blog"> Add a new Tournament</p>
      </header>
      <div className="helpContainer">
        <div className="helpBody">
          <div>
            <p className="helpTitle">
              Tournament Title
              <span className="common-fonts redAlert"> *</span>
            </p>
            <input
              type="text"
              placeholder="Enter Tournament Title"
              name="name"
              value={formData?.name}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <p className="helpTitle">
              Introduction
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <textarea
              name="intro"
              type="textarea"
              rows="3"
              cols="3"
              placeholder="Enter Tournament Introduction"
              value={formData?.intro}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <p className="helpTitle">
              Description
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <textarea
              name="description"
              type="textarea"
              rows="3"
              cols="3"
              placeholder="Enter Tournament Description"
              value={formData?.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <p className="helpTitle">
              Pathway
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <textarea
              name="pathway"
              type="textarea"
              rows="3"
              cols="3"
              placeholder="Enter Tournament Pathway"
              value={formData?.pathway}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <p className="helpTitle">
              Advantages
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <textarea
              name="advantages"
              type="textarea"
              rows="3"
              cols="3"
              placeholder="Enter Tournament Advantages"
              value={formData?.advantages}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <p className="helpTitle">
              Rules
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <textarea
              name="rules"
              type="textarea"
              rows="3"
              cols="3"
              placeholder="Enter Tournament Rules"
              value={formData?.rules}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="helpRight tourHead">
          <div className="tournamentRight">
            <p className="helpTitle">
              Website
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Website"
              name="website"
              value={formData?.website}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Sport
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Sport"
              name="sport"
              value={formData?.sport}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Phone
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Phone"
              name="phone"
              value={formData?.phone}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Email
            </p>
            <input
              className="tournamentInput"
              type="email"
              placeholder="Enter Tournament Email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Level
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Level"
              name="level"
              value={formData?.level}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Category
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Category"
              name="category"
              value={formData?.category}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Keywords
              {/* <span className="common-fonts redAlert"> *</span> */}
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Keywords"
              name="keywords"
              value={formData?.keywords}
              onChange={handleChange}
            ></input>
          </div>
          <div className="tournamentRight">
            <p className="helpTitle">
              Contact Person
            </p>
            <input
              className="tournamentInput"
              type="text"
              placeholder="Enter Tournament Contact Person"
              name="contact"
              value={formData?.contact}
              onChange={handleChange}
            ></input>
          </div>
        </div>
      </div>

      <div className="help-bottom-btn">
        <button className="common-fonts common-delete-button">Cancel</button>
        {stateBtn === 0 ? (
          <button className="disabledBtn" disabled>
            Save
          </button>
        ) : (
          <button
            className="common-fonts common-save-button help-save"
            onClick={onSave}
          >
            Save
          </button>
        )}
      </div>
      <ToastContainer />
      {
        open && (
          <TournamentModal onClose={modalClose} id={id} />
        )
      }
    </>
  );
};

export default AddTournament;
