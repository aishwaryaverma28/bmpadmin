import React, { useState, useEffect } from "react";
import "../styles/Editor.css";
import axios from "axios";
import { GET_SITEPGS, getDecryptedToken } from "../utils/Constants";
import TableWithSitePages from "./TableWithSitePages";
import { Link } from "react-router-dom";

const SitePagesView = () => {
  const [value, setValue] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const decryptedToken = getDecryptedToken();
  useEffect(() => {
    axios
      .get(GET_SITEPGS, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setTableData(response.data.data);
        console.log(response.data.data);
      });
  }, []);

  const selectRows = (e) => {
    setValue(e.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = (tableData || []).filter((item) => {
    const values = Object.values(item);
    for (let i = 0; i < values.length; i++) {
      if (
        values[i] &&
        values[i].toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });

  return (
    <>
      <header className="headerEditor">
        <h2>View your site</h2>
      </header>
      <div className="buttonBox">
        <div className="searchBar">
          <label>
            Search: <input type="text" onChange={handleSearchTermChange} />
          </label>
        </div>
        <div>
          <Link to="/lp/settings/sitePages/add">
            <button type="button" className="addBtn">
              add <i className="fas fa-plus"></i>
            </button>
          </Link>
          <label className="entriesLable">
            Show
            <select onChange={selectRows} className="entries">
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
            Entries
          </label>
        </div>
      </div>

      <div className="tableContainer">
        <TableWithSitePages data={filteredItems} rowsPerPage={value} />
      </div>
    </>
  );
};

export default SitePagesView;
