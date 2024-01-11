import React, { useState, useEffect } from "react";
import Search from "../../assets/image/search.svg";
import User from "../../assets/image/user.svg";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import axios from "axios";
import {
  getDecryptedToken,
  ALL_PEOPLE,
  LOG_RECORD,
} from "../utils/Constants.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PeopleTable = ({ personData, loading, onSelectedIdsChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const orgId = localStorage.getItem("org_id");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isTableHeaderChecked, setIsTableHeaderChecked] = useState(false);
  const [jsonPeopleData, setJsonPeopleData] = useState([]);
  const decryptedToken = getDecryptedToken();

  const fetchPeopleData = () => {
    const body={
      org_id:orgId
    }
    axios
      .post(ALL_PEOPLE, body, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setJsonPeopleData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPeopleData();
  }, []);

  const logRecord = () => {
    const updatedFormData = {
      attr1: `people:export`,
      attr4: `people exported`,
    };
    axios
      .post(LOG_RECORD, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(`export successfull`, {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Some Error Occured", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const downloadPeopleCSV = () => {
    const csv = Papa.unparse(jsonPeopleData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "people.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord("people");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy"); // Change the format as per your requirement
  };

  const filteredPersonData = personData.filter((item) => {
    const name = item?.name?.toLowerCase() || "";
    const company = item?.organization?.toLowerCase() || "";
    const creationDate = formatDate(item?.creation_date) || "";
    const updateDate = formatDate(item?.update_date) || "";
    const email = item?.email?.toLowerCase() || "";
    const phone = item?.phone?.toLowerCase() || "";
    const state = item?.state?.toLowerCase() || "";
    const city = item?.city?.toLowerCase() || "";
    const searchPerson = searchQuery.toLowerCase();

    // Check if the search query matches any of the fields
    const matchesSearchQuery =
      name?.includes(searchPerson) ||
      company?.includes(searchPerson) ||
      email?.includes(searchPerson) ||
      phone?.includes(searchPerson) ||
      state?.includes(searchPerson) ||
      city?.includes(searchPerson) ||
      creationDate?.includes(searchPerson) ||
      updateDate?.includes(searchPerson);

    return matchesSearchQuery;
  });

  const handleTableHeaderCheckboxChange = () => {
    if (isTableHeaderChecked) {
      setSelectedIds([]);
      onSelectedIdsChange(selectedIds);
    } else {
      const allIds = filteredPersonData.map((company) => company.id);
      setSelectedIds(allIds);
      onSelectedIdsChange(selectedIds);
    }
    setIsTableHeaderChecked(!isTableHeaderChecked);
  };

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      // If the ID is already selected, remove it
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      onSelectedIdsChange(selectedIds);
    } else {
      // If the ID is not selected, add it
      setSelectedIds([...selectedIds, id]);
      onSelectedIdsChange(selectedIds);
    }
  };

  // Use useEffect to monitor changes in selectedIds and update isTableHeaderChecked accordingly
  useEffect(() => {
    const isAllChecked = filteredPersonData.every((company) =>
      selectedIds.includes(company.id)
    );
    onSelectedIdsChange(selectedIds);
    setIsTableHeaderChecked(isAllChecked);
  }, [selectedIds, filteredPersonData]);

  return (
    <div>
      <div className="contact-search-container">
        <div className="recycle-search-box">
          <input
            type="text"
            className="recycle-search-input recycle-fonts"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="recycle-search-icon">
            <img src={Search} alt="" />
          </span>
        </div>

        <div>
          <button
            className="common-fonts common-white-green-button"
            onClick={downloadPeopleCSV}
          >
            Export
          </button>
        </div>
      </div>
      <div className="people-cp-table">
        {loading ? (
          <p>Loading....</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="contact-box">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      className="cb1"
                      name=""
                      checked={isTableHeaderChecked}
                      onChange={handleTableHeaderCheckboxChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                </th>
                <th className="common-fonts contact-th">Name</th>
                <th className="common-fonts contact-th">Company</th>
                <th className="common-fonts contact-th">Email</th>
                <th className="common-fonts contact-th">Phone</th>
                <th className="common-fonts contact-th">State</th>
                <th className="common-fonts contact-th">City</th>
                <th className="common-fonts contact-th">Creation Date</th>
                <th className="common-fonts contact-th">Update Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonData.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                filteredPersonData.map((person) => {
                  return (
                    <tr key={person.id}>
                      <th className="contact-box">
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            className="cb1"
                            name=""
                            checked={selectedIds.includes(person.id)}
                            onChange={() => handleCheckboxChange(person.id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </th>
                      <td className="common-fonts ">
                        <Link to={`/lp/contacts/people/${person.id}`}>
                          <span className="contact-building">
                            <img src={User} alt="" />
                          </span>{" "}
                          {person.name}
                        </Link>
                      </td>
                      <td className="common-fonts">{person.organization}</td>
                      <td className="common-fonts person-email">
                        {person.email}
                      </td>
                      <td className="common-fonts">{person.phone}</td>
                      <td className="common-fonts">{person.state}</td>
                      <td className="common-fonts">{person.city}</td>
                      <td className="common-fonts">
                        {formatDate(person.creation_date.split("T")[0])}
                      </td>
                      <td className="common-fonts">
                        {formatDate(person.update_date.split("T")[0])}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PeopleTable;
