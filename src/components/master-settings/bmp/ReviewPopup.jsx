import React, { useState, useEffect } from 'react'
import star from "../../../assets/image/star.svg"
import axios from 'axios';
import { ADD_REPLY, UPDATE_ACADEMY_REVIEW, GET_REVIEW_REPLY, getDecryptedToken } from "../../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pen from "../../../assets/image/small-pen.svg";
import { useSelector } from "react-redux";

const ReviewPopup = ({ onClose, review, reviewData, academyId }) => {
    const decryptedToken = getDecryptedToken();
    const userName = useSelector(store => store.user.items);
    const [reply, setReply] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [stateReviewBtn, setStateReviewBtn] = useState(0);
    const [stateBtn, setStateBtn] = useState(0);
    const [stateReplyBtn, setStateReplyBtn] = useState(0);
    const [acaReply, setAcaReply] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(review.comment);
    const [editedCommentIndex, setEditedCommentIndex] = useState(null);
    const [isReplyEditing, setIsReplyEditing] = useState(false);
// console.log(userName[0][0])
    const reviewReply = () => {
        const body = {
            review_id: review.id
        }
        axios.post(GET_REVIEW_REPLY, body, {
            headers: {
                Authorization: `Bearer ${decryptedToken}`,
            },
        })
            .then((response) => {
                if (response?.data?.status === 1) {
                    // console.log(response?.data?.data)
                    setAcaReply(response?.data?.data?.reverse());
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false);
            })
    }
    useEffect(() => {
        reviewReply();
    }, [])

    const handleEditClick = () => {
        setIsEditing((prevState) => !prevState);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
    }
    const handleSaveEdit = () => {
        axios.put(UPDATE_ACADEMY_REVIEW + review.id, { comment: editedComment }, {
            headers: {
                Authorization: `Bearer ${decryptedToken}`
            }
        }).then((response) => {
            // console.log(response);
            toast.success("review updated successfully", {
                position: "top-center",
                autoClose: 2000,
            })
        }).catch((error) => {
            console.log(error);
        })
        setIsEditing(false);
    }
    const handleEditCommentChange = (e) => {
        setEditedComment(e.target.value);
        setStateReviewBtn(1);
    }
    const handleReplyChange = (e) => {
        setStateBtn(1);
        const newStrategyName = e.target.value;
        setReply(newStrategyName);
    }

    const handleSave = () => {
        const body = {
            parent_id: review.id,
            type: "bmp-response",
            object_type: "academy",
            object_id: parseInt(academyId),
            name: userName[0][0]?.first_name+" "+userName[0][0]?.last_name,
            comment: reply,
            status: 1,
            user_id: userName[0][0]?.id
        };
        axios.post(ADD_REPLY, body, {
            headers: {
                Authorization: `Bearer ${decryptedToken}`,
            },
        })
            .then((response) => {
                if (response?.data?.status === 1) {
                    // console.log(response?.data?.data)
                    toast.success("Reply send successfully!", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                }
                reviewReply();
                reviewData();
                setReply("");
                setStateBtn(0);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleDisapprove = () => {
        axios.put(UPDATE_ACADEMY_REVIEW + review.id, { status: 0 }, {
            headers: {
                Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
            }
        }).then((response) => {
            // console.log(response);
            if (response?.data?.status === 1) {
                toast.success("review disapproved successfully", {
                    position: "top-center",
                    autoClose: 2000,
                })
            }
            onClose();
        }).catch((error) => {
            console.log(error);
        })
        reviewData();
    }
    const handleApprove = () => {
        axios.put(UPDATE_ACADEMY_REVIEW + review.id, { status: 1 }, {
            headers: {
                Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
            }
        }).then((response) => {
            // console.log(response);
            if (response?.data?.status === 1) {
                toast.success("review approved successfully", {
                    position: "top-center",
                    autoClose: 2000,
                })
            }
            onClose();
        }).catch((error) => {
            console.log(error);
        })
        reviewData();
    }

    const handleEditReplyClick = (index) => {
        setEditedCommentIndex(index);
        setIsReplyEditing((prevState) => !prevState);
        setStateReplyBtn(0);
        
    };
    
    const handleCancelReplyEdit = () => {
        reviewReply();
        setIsReplyEditing(false);
        setEditedCommentIndex(null);
    };
    const handleSaveReplyEdit = (id, comment) => {
        axios.put(UPDATE_ACADEMY_REVIEW + id, { comment: comment }, {
            headers: {
                Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
            }
        }).then((response) => {
            // console.log(response);
            toast.success("reply updated successfully", {
                position: "top-center",
                autoClose: 2000,
            })
        }).catch((error) => {
            console.log(error);
        })
        setIsReplyEditing(false);
        setEditedCommentIndex(null);
        setStateReplyBtn(0);
    };
    const handleEditReplyChange = (e,index) => {
        const newReplyData = [...acaReply];
        newReplyData[index].comment = e.target.value;
        setAcaReply(newReplyData);
        setStateReplyBtn(1);
    }
    return (
        <div class="recycle-popup-wrapper">
            <div class="review_new_container">
                <div className='review-top-flex'>
                    <div class="recycle-popup-box">
                        <p class="common-fonts restore-comment">Respond to review</p>
                        <p class="common-fonts selected-comment write_review">Write a response message on review</p>
                    </div>
                    <div className='common-fonts review-modal-cross' onClick={onClose}>X</div>
                </div>
                <div className='box-border'>
                    <div>
                        <div className='review-top-flex'>
                            <p class="common-fonts comment-head">{review?.name}<span className='review-rating'>{review?.rating}<img className="pound" src={star} alt='star' /></span></p>
                            <div className='review-top-flex pen-flex' onClick={handleEditClick}>
                                <img src={Pen} alt="" />
                                <p className="common-fonts selected-comment">Edit</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="bmp-add-fields">
                                <textarea
                                    name=""
                                    id=""
                                    rows="2"
                                    className="common-fonts bmp-strategy-input bmp-modal-input"
                                    value={editedComment}
                                    onChange={handleEditCommentChange}
                                ></textarea>
                                <div class="review-popup-btn">
                                    <button class="common-white-button common-fonts" onClick={handleCancelEdit}>Cancel</button>
                                    {stateReviewBtn === 0 ? (
                                        <button className="common-inactive-button review-inactive">Save</button>
                                    ) : (
                                        <button
                                            className="common-fonts common-save-button comment-save"
                                            onClick={handleSaveEdit}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="common-fonts selected-comment">{review?.comment}</p>
                            </>
                        )}
                    </div>

                    <br />
                    <div className={`replysContainer ${isReplyEditing ? 'expanded' : 'collapsed'} replyHeightChanged`}>
                        {isLoading ? (
                            <><p class="common-fonts selected-comment">Loading ...</p></>
                        ) : acaReply?.length === 0 ? (
                            <><p class="common-fonts selected-comment">No data found</p></>
                        ) :
                            (
                                acaReply?.map((item, index) => (
                                    <div className='replyName' key={index}>
                                        <div className='review-top-flex'>
                                            <p className="common-fonts reply-head">{item?.name}</p>
                                            <div className='review-top-flex pen-flex' onClick={() => handleEditReplyClick(index)}>
                                                <img src={Pen} alt="" />
                                                <p className="common-fonts selected-comment" >
                                                    Edit
                                                </p>
                                            </div>
                                        </div>
                                        {isReplyEditing && editedCommentIndex === index ? (
                                            <div className="bmp-add-fields">
                                                <textarea
                                                    name=""
                                                    id=""
                                                    rows="2"
                                                    className="common-fonts bmp-strategy-input bmp-modal-input"
                                                    value={item?.comment}
                                                    onChange={e => handleEditReplyChange(e, index)}
                                                ></textarea>
                                                <div className="review-popup-btn">
                                                    <button className="common-white-button common-fonts" onClick={handleCancelReplyEdit}>Cancel</button>
                                                    {stateReplyBtn === 0 ? (
                                                        <button className="common-inactive-button review-inactive">Save</button>
                                                    ) : (
                                                        <button
                                                            className="common-fonts common-save-button comment-save"
                                                            onClick={() => handleSaveReplyEdit(item.id, item.comment)}
                                                        >
                                                            Save
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="common-fonts selected-comment">{item?.comment}</p>
                                        )}
                                    </div>
                                ))
                            )}
                    </div>
                    <br />
                    <br />
                    <br/>
                    <div className="bmp-add-fields">
                        <textarea
                            name=""
                            id=""
                            rows="3"
                            className="common-fonts bmp-strategy-input bmp-modal-input"
                            placeholder='Type your response here *'
                            value={reply}
                            onChange={handleReplyChange}
                        ></textarea>
                        <div class="review-popup-btn">

                            {stateBtn === 0 ? (
                                <button className="common-inactive-button review-inactive">Save</button>
                            ) : (
                                <button
                                    className="common-fonts common-save-button comment-save"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div class="recycle-popup-btn">
                    <button class="common-delete-button common-fonts" onClick={handleDisapprove}>Disapprove</button>
                    <button
                        className="common-fonts common-white-green-button comment-save"
                        onClick={handleApprove}
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewPopup