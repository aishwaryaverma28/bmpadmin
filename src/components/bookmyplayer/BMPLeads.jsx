import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {
  GET_ACC_LEAD, getDecryptedToken,
} from "../utils/Constants";
import BMPLeadModal from './BMPLeadModal.jsx';
import Calender from "../../assets/image/calendar.svg";
import SearchIcon from "../../assets/image/search.svg";


const BMPLeads = () => {
  const decryptedToken = getDecryptedToken();
  const academyId = parseInt(localStorage.getItem("academy_id"));
  const [review, setReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDate = (isoDate) => {
    const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', options);
  };


  const filteredReviewData = review.filter((item) => {
    const fullName =item?.name?.toLowerCase() || "";
    const phone =item?.phone?.toLowerCase() || "";
    const description =item?.description?.toLowerCase() || "";
    const date = formatDate(item?.creation_date) || "";
    const searchReview = searchQuery.toLowerCase();


    // Check if the search query matches any of the fields
    const matchesSearchQuery =
      fullName.includes(searchReview) ||
      phone.includes(searchReview) ||
      description.includes(searchReview) ||
      date.includes(searchReview);

    return matchesSearchQuery;
  });

  const openModal = (data) => {
     setIsOpen(true);
     setItem(data);
  }

  const closeModal = () => {
    setIsOpen(false);

 }



  const reviewData = () => {
    axios.get(GET_ACC_LEAD +academyId+"/academy", {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    })
      .then((response) => {
        console.log(response?.data?.data)
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
  useEffect(() => {
    reviewData();
  }, [])

  return (
    <>

    <div>
      <p className='comon-fonts bmp_lead_text'>Leads</p>
    </div>

    <div className='bmp_search_lead'>

    <div className="recycle-search-box academy_search_box">
          <input
            type="text"
            className="recycle-search-input recycle-fonts"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="recycle-search-icon">
            <img src={SearchIcon} alt="" />
          </span>
        </div>

    <div className=''>
        <button className='common-fonts bmp_lead_date_button'><img src={Calender} alt="" />Any Date</button>
      </div>

    </div>






<div className='marketing-all-table leads_bmp_table'>
    <table>
      <thead>
        <tr>
          <th className='common-fonts'>S No</th>
          <th className='common-fonts'>DATE</th>
          <th className='common-fonts'>NAME</th>
          <th className='common-fonts'>PHONE</th>
          <th className='common-fonts'>DESCRIPTION</th>
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
        ) : filteredReviewData?.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              No data found
            </td>
          </tr>
        ) : (
          filteredReviewData.map((item, index) => (
            <tr key={item?.id} onClick={() => openModal(item)} >
              <td className='common-fonts'>{index + 1}</td>
              <td className='common-fonts'>{formatDate(item?.creation_date)}</td>
              <td className='common-fonts'>{item?.name}</td>
              <td className='common-fonts'>{item?.phone}</td>
              <td className='common-fonts'> {item?.description?.length > 50 ? (
                    <>{item?.description?.slice(0, 50)}...</>
                  ) : (
                    <>{item?.description}</>
                  )}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {
      isOpen && (
        <BMPLeadModal onClose={closeModal} item={item}/>
      )
    }

  </div>

    </>

  )
}

export default BMPLeads
