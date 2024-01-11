import React, { useState } from "react";
import TimeSheetTable from "./TimeSheetTable";
import "../styles/EmployeeProfile.css";

const TimeSheet = () => {
  const [value, setValue] = useState(10);
  // const [tableData, setTableData] = useState([])
  const tableData = [
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "APPROVED",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "REJECTED",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {
      column1: "JUNE 20, 2023",
      column2: "08:00",
      column3: "18:00",
      column4: "IN-PROGRESS",
      column5: "JULY 01, 2023",
      column6: "LOREM IPSUM DOLOR",
    },
    {},
  ];

  const selectRows = (e) => {
    setValue(e.target.value);
  };
  return (
    <>

      {/* <div className="buttonBox"> */}
      {/* <div className="searchBar"> <label>Search: <input type="text" onChange={handleSearchTermChange}/></label></div> */}
      <div className="timeButton">
        <button type="button" className="timeBtn">
          add <i className="fas fa-plus"></i>
        </button>
        <button type="button" className="timeBtn">
          Edit <i className="fa-solid fa-pen"></i>
        </button>
        <button type="button" className="timeBtn">
          Delete <i className="fas fa-trash-alt"></i>
        </button>
        <button type="button" className="timeBtn">
          Update <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <lable className="entriesLable">
          {" "}
          Show
          <select onChange={selectRows} className="entries">
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
          Entries
        </lable>
      </div>

      {/* </div> */}

      <div className="tableContainer">
        <TimeSheetTable data={tableData} rowsPerPage={value} />
      </div>
    </>
  );
};

export default TimeSheet;
