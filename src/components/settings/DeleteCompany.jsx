import React, { useState, useEffect } from "react";
import "../styles/RecycleBin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/image/calendar.svg";
import axios from "axios";
import {
  GET_BIN_COMPANY,
  RESTORE_COMPANY,
  DELETE_COMPANY,
  getDecryptedToken,
  handleLogout,
} from "../utils/Constants";
import { format } from "date-fns";
import RecycleDeletePopUp from "./RecycleDeletePopUp";
import RecycleRestorePopUp from "./RecycleRestorePopUp";
import NotePopUp from "./NotePopUp";
import SearchIcon from '../../assets/image/search.svg';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteCompany = ({deleteCount}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActiveTab] = useState("Company");
  const [recycleData, setRecycleData] = useState([]);
  const decryptedToken = getDecryptedToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const orgId = localStorage.getItem("org_id");

  const handleDeletePopUp = ()  => {
    setIsDeleteModalOpen(true);
  }

  const handleRestorePopUp = () => {
    setIsRestoreModalOpen(true);
  }

  const onCloseNoteDeletePopUp = () => {
    setIsDeleteModalOpen(false);
  }

  const onCloseNoteRestorePopUP = () => {
    setIsRestoreModalOpen(false);
  }

  

  useEffect(() => {
    fetchData();
  }, [decryptedToken]);

  const fetchData = async () => {
    const body = {
        contactType: "xx_company",
        org_id:orgId
    }
    try {
      const response = await axios.post(GET_BIN_COMPANY, body,{
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      if (response?.data?.status === 1) {
        setRecycleData(
          response?.data?.data.map((item) => ({ ...item, isChecked: false }))
        );
      } 
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error?.response?.data?.message === "Invalid or expired token.") {
        alert(error?.response?.data?.message);
        handleLogout();
      }
      setIsLoading(false);
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy"); // Change the format as per your requirement
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredRecycleData = recycleData.filter((recycleItem) => {
    const name = recycleItem.name?.toLowerCase() || "";  
    const searchRecycle = searchQuery.toLowerCase();

    const itemDate = new Date(recycleItem.update_date);
    itemDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

    // Check if the search query matches any of the fields
    const matchesSearchQuery =
      name.includes(searchRecycle);

    // Check if the item date falls within the specified date range
    const withinDateRange =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    // Show all data when both start and end dates are null, and search box is empty
    if (!startDate && !endDate && !searchQuery) {
      return true;
    }

    // Show all data when start date and end date are null, and search query matches any field
    if (!startDate && !endDate && matchesSearchQuery) {
      return true;
    }
    // Filter based on regular conditions (search query and date range)
    return matchesSearchQuery && withinDateRange;
  });

  const handleTableHeaderCheckboxChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      // If the header checkbox is checked, select all rows
      const allRowIds = recycleData.map((item) => item.id);
      setSelectedRows(allRowIds);
    } else {
      // If the header checkbox is unchecked, deselect all rows
      setSelectedRows([]);
    }
    setRecycleData((prevState) =>
      prevState.map((item) => ({ ...item, isChecked: checked }))
    );
  };
  const handleTableRowCheckboxChange = (event, itemId) => {
    const { checked } = event.target;
    setRecycleData((prevState) =>
      prevState.map((item) =>
        item.id === itemId ? { ...item, isChecked: checked } : item
      )
    );

    setSelectedRows((prevSelectedRows) =>
      checked
        ? [...prevSelectedRows, itemId]
        : prevSelectedRows.filter((id) => id !== itemId)
    );
  };
  const handleRestoreNote = () => {
    const updatedFormData = {
        contactType: "xx_company",
        contactIds: selectedRows,
    };
    axios
      .post(RESTORE_COMPANY, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        fetchData();
        deleteCount();
        onCloseNoteRestorePopUP();
        setSelectedRows([]);
        toast.success("Company restored successfully", {
          position:"top-center",
          autoClose:2000
        })
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteNote = () => {
    const updatedFormData = {
        contactType: "xx_company",
      contactIds: selectedRows,
    };
    axios
      .delete(DELETE_COMPANY, {
        data:updatedFormData,
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        fetchData();
        deleteCount();
        onCloseNoteDeletePopUp();
        setSelectedRows([]);
        toast.error("Company delete successfully", {
          position:"top-center",
          autoClose:2000
        })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetData = () => {
    fetchData();
  }

  
  const isTableHeaderCheckboxChecked =
    recycleData.length > 0 && selectedRows.length === recycleData.length;
    
    
  return (
    <>
      <div className="recycle-search-user-section">
        <div className="recycle-search-box">
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

        <div className="recycle-date">
          <div className="custom-date-input">
            <div className="date-input-wrapper">
              <img src={CalendarIcon} alt="Delete" className="delete-icon" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="recycle-date-input"
                dateFormat="dd/MM/yyyy"
                value={startDate}
                placeholderText="dd/mm/yyyy"
              />
            </div>
          </div>
          <span className="recycle-fonts date-to">To</span>
          <div className="custom-date-input">
            <div className="date-input-wrapper">
              <img src={CalendarIcon} alt="Delete" className="delete-icon" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="recycle-date-input"
                dateFormat="dd/MM/yyyy"
                value={endDate}
                placeholderText="dd/mm/yyyy"
              />
            </div>
          </div>
        </div>

        <div className="recycle-btn">
          <button
              className={recycleData.length <= 0 || selectedRows.length  === 0  ?'common-inactive-button inactive-delete  recycle-fonts ' : 'recycle-delete recycle-fonts' }
             disabled={recycleData.length <= 0 || selectedRows.length  === 0  ? true : false}
            onClick={handleDeletePopUp}

          >
            Delete
          </button>
          <button
            className={recycleData.length <= 0 || selectedRows.length  === 0  ?'common-inactive-button recycle-fonts ' : 'recycle-restore recycle-fonts' }
            disabled={recycleData.length <= 0 || selectedRows.length  === 0  ? true : false}
            onClick={handleRestorePopUp}
          >
            Restore
          </button>
          <button type="button" className="helpBtn recycle-refresh-icon" title="Refresh" onClick={resetData}>
              <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
        </div>
      </div>
      <div className="recycle-list-table recycle-fonts">
        <table className="recycle-table" id="recycle-border">
          <thead>
            <tr className="table-text">
              <th>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    className="cb1"
                    name="allSelect"
                    checked={isTableHeaderCheckboxChecked}
                    onChange={handleTableHeaderCheckboxChange}
                  />
                  <span className="checkmark"></span>
                </label>
              </th>
              <th>Company Name</th>
              <th>Created By</th>
              <th>Deleted By</th>
              <th>Date Deleted</th>
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
            ) : filteredRecycleData.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredRecycleData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        className="cb1"
                        name={item.id}
                        checked={item.isChecked}
                        onChange={(e) =>
                          handleTableRowCheckboxChange(e, item.id)
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    {item.name}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isDeleteModalOpen && (
         <RecycleDeletePopUp onClose={onCloseNoteDeletePopUp} onDeleteConfirmed={handleDeleteNote} />
      )}

      {
        isRestoreModalOpen && (
          <RecycleRestorePopUp onClose={onCloseNoteRestorePopUP} onRestoreConfirmed={handleRestoreNote} />
        )
      }
      <ToastContainer/>
    </>
  );
};

export default DeleteCompany;
