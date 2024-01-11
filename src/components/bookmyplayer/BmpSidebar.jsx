import React from "react";
import "../styles/LPSetting.css";
import "../styles/bmp.css";
import { NavLink, useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/image/arrow-left.svg";

const BmpSidebar = () => {
  const userRole = localStorage.getItem("role_name");
  const navigate = useNavigate();
  const id = localStorage.getItem("academy_id");
  const handleBackToTable = () => {
    localStorage.removeItem("academy_id");
    navigate("/lp/bmp/admin");
  };

  return (
    <section className="setting-side-panel">
      {userRole === "Academy Admin" && (
        <div className="back-to-user general-refresh blog-back">
          <button className="common-fonts" onClick={handleBackToTable}>
            <img src={LeftArrow} alt="" />
            <span>Back To Table</span>
          </button>
        </div>
      )}
      <p className="prefrence-options setting-font-style bmp-profile-txt common-fonts">
        Profile
      </p>
      <p className="prefrence-options setting-font-style">

      {
        userRole === "Academy Admin" ? (
          <NavLink exact to={`/lp/bmp/overview/${id}`}>
          Overview
        </NavLink>
        ) : (
          <NavLink exact to={`/lp/bmp/overview`}>
          Overview
        </NavLink>
        )
      }
      </p>
      {/* <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/fees">
          Fees and Batches
        </NavLink>
      </p> */}
      {/* <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/training">
          Training Strategy
        </NavLink>
      </p> */}
      <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/gallery">
          Photos & Video
        </NavLink>
      </p>

      <p className="prefrence-options setting-font-style bmp-profile-txt common-fonts">
        System
      </p>

      <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/approval">
          Approval Status
        </NavLink>
      </p>
      <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/reviews">
          Reviews
        </NavLink>
      </p>
      <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/leads">
          Leads
        </NavLink>
      </p>
      <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/support">
          Contact Support
        </NavLink>
      </p>
      {/* <p className="prefrence-options setting-font-style">
        <NavLink exact to="/lp/bmp/help">
          Help
        </NavLink>
      </p> */}
    </section>
  );
};

export default BmpSidebar;
