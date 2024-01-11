import React, { useState, useEffect } from "react";
import "../../styles/Tournament.css"
import axios from "axios";
import { GET_ALL_LEAGUE, getDecryptedToken } from "../../utils/Constants";
import { Link } from "react-router-dom";
import TournamentTable from "./TournamentTable";

const ViewTournament = () => {
  const [value, setValue] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const decryptedToken = getDecryptedToken();

  function handleFormSubmit() {
    axios
      .get(GET_ALL_LEAGUE, {
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
  }

  useEffect(() => {
    handleFormSubmit();
  }, []);

  const selectRows = (e) => {
    setValue(e.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = (tableData || [])?.filter((item) => {
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

  return (
    <>
      <header className="headerEditor">
                <p className="common-fonts add-new-blog"> View Tournaments</p>
            </header>
      <div className="buttonBox">
        <div className="searchBar">
          <label>
            Search: <input type="text" onChange={handleSearchTermChange} />
          </label>
        </div>
        <div>
          <Link to="/lp/settings/helpSection/add">
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
        <TournamentTable data={filteredItems} rowsPerPage={value} />
      </div>
    </>
  )
}

export default ViewTournament