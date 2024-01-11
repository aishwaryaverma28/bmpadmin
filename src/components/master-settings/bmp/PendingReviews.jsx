import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import { BMP_ACADEMY_ALL_REVIEWS, getDecryptedToken } from '../../utils/Constants.js';
import SearchIcon from "../../../assets/image/search.svg";
import Logo from "../../../assets/image/blue_logo.png";
import { Link } from 'react-router-dom';

const PendingReviews = () => {
    const decryptedToken = getDecryptedToken();
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const getAllAcademy = () => {
        axios.post(BMP_ACADEMY_ALL_REVIEWS, {
            object_type: "academy",
            status: 0
        }, {
          headers: {
            Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
          }
        }).then((response) => {
          setData(response?.data?.data);
          console.log(response?.data?.data);
        }).catch((error) => {
          console.log(error);
        });
      }
    
      useEffect(() => {
        getAllAcademy();
      }, []);
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
    <div className='bmp_admin_table'>
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
              <td>{data?.id}</td>
              <td>
                <Link to={"/lp/settings/review/view/" + data?.id}>
                  <div className='academy_new_blue_logo'>
                    <img src={Logo} alt="" />
                    <p> {data?.name}</p>
                  </div>
                </Link>
              </td>
              <td>{data?.update_date?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  )
}

export default PendingReviews