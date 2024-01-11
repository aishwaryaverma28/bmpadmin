import React, { useState, useEffect } from "react";
import "../styles/Editor.css";
import axios from "axios";
import { BLOG_GET, getDecryptedToken } from "../utils/Constants";
import { Link } from "react-router-dom";
import TablePaginationBlog from "./TablePaginationBlog";

const EmployeeView = () => {
  const org_id = localStorage.getItem("org_id");
  const [value, setValue] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectSite, setSelectSite] = useState("bookmyplayer");
  const decryptedToken = getDecryptedToken();
  const blogData = () => {
    const siteName = {
      siteName: selectSite,
      org_id: org_id,
    };
    axios
      .post(BLOG_GET, siteName, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setTableData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    blogData();
  }, [selectSite]);

  const selectRows = (e) => {
    setValue(e.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = (tableData || []).filter((item) => {
    const values = Object.values(item);
    for (let i = 0; i < values?.length; i++) {
      if (
        values[i] &&
        values[i]?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  function handleSiteSelection(event) {
    setSelectSite(event.target.value);
  }
  return (
    <>
      <header className="headerEditor">
        <h2>View Blog Details</h2>
      </header>
      <div className="buttonBox">
        <div className="searchBar">
          <label>
            Search: <input type="text" onChange={handleSearchTermChange} />
          </label>
        </div>
        <div>
            <select onChange={handleSiteSelection} className="selectSec">
              <option value="bookmyplayer">bookmyplayer</option>
              <option value="leadplaner">leadplaner</option>              
              <option value="firstcron">firstcron</option>
              <option value="routplaner">routplaner</option>
            </select>
          <Link to="/lp/settings/blog/add">
            <button type="button" className="addBtn">
              add <i className="fas fa-plus"></i>
            </button>
          </Link>
          <label className="entriesLable">
            Show
            <select onChange={selectRows} className="entries">
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
            Entries
          </label>
        </div>
      </div>

      <div className="tableContainer">
        <TablePaginationBlog data={filteredItems} rowsPerPage={value} />
      </div>
    </>
  );
};

export default EmployeeView;
