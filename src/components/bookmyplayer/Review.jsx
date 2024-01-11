import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {
  GET_ALL_REVIEW, GET_ACC_REVIEW, getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import star from "../../assets/image/star.svg"
import Comment from './Comment';
const Review = () => {
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const [review, setReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotePopUpOpen, setIsNotePopUpOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState({});

  const formatDate = (isoDate) => {
    const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', options);
  };

  const reviewData = () => {
    const body = {
      object_id: parseInt(academyId),
      object_type: "academy",
      status:1
    }
    axios.post(GET_ALL_REVIEW, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        // console.log(response?.data?.data)
        if (response?.data?.status === 1) {
          setReview(response?.data?.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);
      })
  }

  const getAccReview = () => {
    const body = {
      object_id: parseInt(academyId),
      object_type: "academy"
    }
    axios.post(GET_ACC_REVIEW, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        if (response?.data?.status === 1) {
          // console.log(response?.data?.data)
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);
      })
  }

  useEffect(() => {
    reviewData();
    getAccReview();
  }, [])

  const handleNotePopUp = (item) => {
    setSelectedDescription(item);
    setIsNotePopUpOpen(true);
  }

  const closeNotePopUp = () => {
    setIsNotePopUpOpen(false);
  }

  return (
    <>
      <div>
        <p className='comon-fonts bmp_lead_text'>Reviews</p>
      </div>
      <div className='marketing-all-table market-review-table review-table'>
        <table>
          <thead>
            <tr>
              <th className='common-fonts'>S No</th>
              <th className='common-fonts'>DATE</th>
              <th className='common-fonts'>RATING (5 <img className="pound" src={star} alt='star' />)</th>
              <th className='common-fonts'>NAME</th>
              <th className='common-fonts'>REPLY</th>
              <th className='common-fonts'>COMMENT</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "1.5rem", textAlign: "center" }}
                >
                  Loading...
                </td>
              </tr>
            ) : review?.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              review?.map((item, index) => (
                <tr key={item?.id} onClick={() => handleNotePopUp(item)}>
                  <td className='common-fonts'>{index + 1}</td>
                  <td className='common-fonts'>{formatDate(item?.creation_date)}</td>
                  <td className='common-fonts'>{item?.rating} <img className="pound" src={star} alt='star' /></td>
                  <td className='common-fonts'>{item?.name}</td>
                  <td className='common-fonts'>{item?.total_reply}</td>
                  <td className='common-fonts'> {item?.comment?.length > 50 ? (
                    <>{item?.comment?.slice(0, 50)}...</>
                  ) : (
                    <>{item?.comment}</>
                  )}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {
          isNotePopUpOpen && (
            <Comment onClose={closeNotePopUp} review={selectedDescription} reviewData={reviewData} />
          )
        }
        <ToastContainer />
      </div>

    </>

  )
}

export default Review;
