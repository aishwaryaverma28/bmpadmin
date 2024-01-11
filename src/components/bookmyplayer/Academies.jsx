import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import { GET_ACADEMY_STATUS, getDecryptedToken } from '../utils/Constants.js';
import SearchIcon from "../../assets/image/search.svg";
import Logo from "../../assets/image/blue_logo.png";
import PendingAcademies from './PendingAcademies.jsx';
import RejectedAcademy from './RejectedAcademy.jsx';
import { Link } from 'react-router-dom';

const Academies = () => {
  const [activeTab, setActiveTab] = useState("all");
  const decryptedToken = getDecryptedToken();
  const [data, setData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [arrayLength, setArrayLength] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleArrayLength = (length) => {
    setArrayLength(length);
  };

  const getAllAcademy = () => {
    axios.post(GET_ACADEMY_STATUS, {
      status: 4
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setData(response?.data?.data);
    }).catch((error) => {
      console.log(error);
    });
  }
  const getPendingAcademy = () => {
    axios.post(GET_ACADEMY_STATUS, {
      status: 0
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setPendingData(response?.data?.data);
    }).catch((error) => {
      console.log(error);
    });
  }
  const getRejectedAcademy = () => {
    axios.post(GET_ACADEMY_STATUS, {
      status: 2
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      }
    }).then((response) => {
      setRejectedData(response?.data?.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getAllAcademy();
    getPendingAcademy();
    getRejectedAcademy();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      String(item.id).includes(searchInput.toLowerCase())
    )
  });

  return (
    <div className='academy_rejected'>
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
          className={`genral-btn contact-genral-btn ${activeTab === "rejected" ? "genral-active" : ""
            }`}
          onClick={() => handleTabClick("rejected")}
        >
          <span className="mrkt-whatsapp">Rejected ({rejectedData?.length})</span>
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
                  {filteredData.map((data) => (
                    <tr key={data?.id}>
                      <td>
                        <Link to={"/lp/bmp/overview/" + data?.id}>
                          {data?.id}
                        </Link>
                      </td>
                      <td>
                        <Link to={"/lp/bmp/overview/" + data?.id}>
                          <div className='academy_new_blue_logo'>
                            <img src={Logo} alt="" />
                            <p> {data?.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td><Link to={"/lp/bmp/overview/" + data?.id}>2023-10-05</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      {
        activeTab === "pending" && <PendingAcademies sendLengthToParent={handleArrayLength} />
      }
      {
        activeTab === "rejected" && <RejectedAcademy />
      }
    </div >
  )
}

export default Academies
