import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_ACADEMY_STATUS, getDecryptedToken } from '../utils/Constants.js';
import SearchIcon from "../../assets/image/search.svg";
import Logo from "../../assets/image/blue_logo.png";
import { Link } from 'react-router-dom';
const PendingAcademies = () => {
  const decryptedToken = getDecryptedToken();
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const getAllAcademy = () => {
    axios.post(GET_ACADEMY_STATUS, {
      status: 0
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
                  <Link to={"/lp/bmp/overview/" + data?.id}>
                    <div className='academy_new_blue_logo'>
                      <img src={Logo} alt="" />
                      <p> {data?.name}</p>
                    </div>
                  </Link>
                </td>
                <td>2023-10-05</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
export default PendingAcademies