import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  GET_ALL_REVIEW, GET_ACC_REVIEW, getDecryptedToken,
} from "../../utils/Constants";
import "react-toastify/dist/ReactToastify.css";
import ReviewUpdatePending from "./ReviewUpdatePending";
import arrowLeft from "../../../assets/image/arrow-left.svg";

const BmpReviewsUpdate = () => {
  const { id } = useParams();
  const decryptedToken = getDecryptedToken();
  const [activeTab, setActiveTab] = useState("all");
  const [review, setReview] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [approveData, setApproveData] = useState([]);

  const reviewData = () => {
    const body = {
      object_id: parseInt(id),
      object_type: "academy"
      
    }
    axios.post(GET_ALL_REVIEW, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        if (response?.data?.status === 1) {
          console.log(response?.data?.data)
          const allReviews = response?.data?.data;
          const pendingReviews = allReviews.filter(item => item.status === 0);
          const approveReviews = allReviews.filter(item => item.status === 1);
          setReview(allReviews);
          setPendingData(pendingReviews);
          setApproveData(approveReviews);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getAccReview = () => {
    const body = {
      object_id: parseInt(id),
      object_type: "academy"
    }
    axios.post(GET_ACC_REVIEW, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        if (response?.data?.status === 1) {
          console.log(response?.data?.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    reviewData();
    getAccReview();
  }, [])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  
  return (
    <>
      <div className='academy_rejected'>
      <div className="go-back-btn ">
        <Link to={"/lp/settings/review/view"}>
        <button className="setting-font-style">
          <img src={arrowLeft} alt="" />
          <span>Go Back</span>
        </button>
        </Link>
      </div>
        <div>
          <p className='comon-fonts bmp_lead_text'>Reviews</p>
        </div>
        <div className="genral-setting-btn genral-setting-fonts aaa">
          <button
            className={`genral-btn  ${activeTab === "all" ? "genral-active" : ""
              }`}
            onClick={() => handleTabClick("all")}
          >
            <span className="mrkt-whatsapp">All ({review?.length})</span>
          </button>

          <button
            className={`genral-btn contact-genral-btn ${activeTab === "pending" ? "genral-active" : ""
              }`}
            onClick={() => handleTabClick("pending")}
          >
            <span className="mrkt-whatsapp">Pending ({pendingData?.length})</span>
          </button>

          <button
            className={`genral-btn contact-genral-btn ${activeTab === "approve" ? "genral-active" : ""
              }`}
            onClick={() => handleTabClick("approve")}
          >
            <span className="mrkt-whatsapp">Approve ({approveData?.length})</span>
          </button>
        </div>
        {
          activeTab === "all" && <ReviewUpdatePending data={review} reviewData={reviewData} academyId={id}/>
          }
          {
        activeTab === "pending" && <ReviewUpdatePending data={pendingData} reviewData={reviewData} academyId={id}/>
      }
      {
        activeTab === "approve" && <ReviewUpdatePending data={approveData} reviewData={reviewData} academyId={id}/>
      }
      </div>
    </>
  )
}

export default BmpReviewsUpdate