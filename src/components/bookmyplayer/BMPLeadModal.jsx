import React from 'react'
import "../styles/Comment.css";
import { useState } from 'react';
import axios from 'axios';
import {getDecryptedToken} from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';

const BMPLeadModal = ({ onClose, item }) => {
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div class="recycle-popup-wrapper">
      <div class="recycle-popup-container">
        <div className="approval_box">
          <div className="approval_cross_lead common-fonts" onClick={onClose}>
            <p className="common-fons">Anant Singh Chauhan</p>
            <p className="common-fons">X</p>
          </div>

          <div className="approval_flex">
            <label htmlFor="">Id</label>
            <input type="text" className="common-fonts common-input approval_input" />
          </div>

          <div className="approval_flex">
            <label htmlFor="">Date</label>
            <input type="date" className="common-fonts common-input approval_input" />
          </div>

          <div className="approval_flex">
            <label htmlFor="">Phone Number</label>
            <input type="number" className="common-fonts common-input approval_input" />
          </div>

          <div className="approval_flex">
            <label htmlFor="">Description</label>
            <textarea name="" id="" cols="30" rows="5" className="common-fonts approval_textarea"></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BMPLeadModal