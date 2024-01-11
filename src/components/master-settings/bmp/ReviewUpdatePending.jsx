import React, { useState } from 'react'
import star from "../../../assets/image/star.svg"
import ReviewPopup from './ReviewPopup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReviewUpdatePending = ({ data, reviewData, academyId}) => {
    const [isNotePopUpOpen, setIsNotePopUpOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState({});
    const formatDate = (isoDate) => {
        const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', options);
    };
    const handleNotePopUp = (item) => {
        setSelectedDescription(item);
        setIsNotePopUpOpen(true);
    }

    const closeNotePopUp = () => {
        setIsNotePopUpOpen(false);
    }
    return (
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
                    {data?.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                No data found
                            </td>
                        </tr>
                    ) : (
                        data?.map((item, index) => (
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
            <ReviewPopup onClose={closeNotePopUp} review={selectedDescription} reviewData={reviewData} academyId={academyId}/>
          )
        }
        <ToastContainer />
        </div>
    )
}

export default ReviewUpdatePending