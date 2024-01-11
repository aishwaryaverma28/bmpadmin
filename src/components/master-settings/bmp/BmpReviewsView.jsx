import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { BMP_ACADEMY_ALL_REVIEWS, getDecryptedToken } from '../../utils/Constants.js';
import SearchIcon from "../../../assets/image/search.svg";
import Logo from "../../../assets/image/blue_logo.png";
import { Link } from 'react-router-dom';
import PendingReviews from './PendingReviews.jsx';
import ApproveReview from './ApproveReview.jsx';


const BmpReviewsView = () => {
  const [activeTab, setActiveTab] = useState("all");
  const decryptedToken = getDecryptedToken();
  const [data, setData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [approveData, setApproveData] = useState([]);
  const [arrayLength, setArrayLength] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleArrayLength = (length) => {
    setArrayLength(length);
  };

  const getAllAcademy = () => {
    axios.post(BMP_ACADEMY_ALL_REVIEWS, {
      object_type: "academy",
      status: 10
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setData(response?.data?.data);
      // console.log(response?.data?.data)
    }).catch((error) => {
      console.log(error);
    });
  }
  const getPendingAcademy = () => {
    axios.post(BMP_ACADEMY_ALL_REVIEWS, {
      object_type: "academy",
      status: 0
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setPendingData(response?.data?.data);
      // console.log(response?.data?.data);
    }).catch((error) => {
      console.log(error);
    });
  }
  const getApproveAcademy = () => {
    axios.post(BMP_ACADEMY_ALL_REVIEWS, {
      object_type: "academy",
      status: 1
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setApproveData(response?.data?.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getAllAcademy();
    getPendingAcademy();
    getApproveAcademy();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredData = data?.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      String(item.id).includes(searchInput.toLowerCase())
    )
  });

  return (
    <div className='academy_rejected review_academy_top'>
      <div className="genral-setting-btn genral-setting-fonts aaa">
        <button
          className={`genral-btn  ${activeTab === "all" ? "genral-active" : ""
            }`}
          onClick={() => handleTabClick("all")}
        >
          <span className="mrkt-whatsapp">All ({data?.length})</span>
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
        activeTab === "all" && (
          <>
            <div className='academy_top'>
              <div className="recycle-search-box academy_search_box">
                <input
                  type="text"
                  className="recycle-search-input recycle-fonts"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <span className="recycle-search-icon">
                  <img src={SearchIcon} alt="" />
                </span>
              </div>
            </div>


            <div className='bmp_admin_table bmp_admin_table_2'>
              <table>
                <thead>

                  <tr>
                    <th>id</th>
                    <th>Academy Name</th>
                    <th>Last Updated</th>
                  </tr>

                </thead>

                <tbody>
                  {filteredData?.map((data) => (
                    <tr key={data?.id}>
                      <td>
                        <Link to={"/lp/settings/review/view/" + data?.id}>
                          {data?.id}
                        </Link>
                      </td>
                      <td>
                        <Link to={"/lp/settings/review/view/" + data?.id}>
                          <div className='academy_new_blue_logo'>
                            <img src={Logo} alt="" />
                            <p> {data?.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td><Link to={"/lp/settings/review/view/" + data?.id}>{data?.update_date?.split("T")[0]}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      {
        activeTab === "pending" && <PendingReviews />
      }
      {
        activeTab === "approve" && <ApproveReview />
      }
    </div >

  )
}

export default BmpReviewsView