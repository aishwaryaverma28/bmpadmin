import React, { useState, useEffect } from "react";
import axios from "axios";
import { PAYSLIPS, getDecryptedToken } from "../utils/Constants";
import "../styles/EmployeeProfile.css";
import PDFConverter from "./PDFConverter";
const SalarySlip = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const decryptedToken = getDecryptedToken();
  useEffect(() => {
    getEmployeeInfo();
  }, []);

  async function getEmployeeInfo() {
    try {
      const response = await axios.get(PAYSLIPS, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      const data = response.data.data;
      setTableData(data);
      setLoading(false);
    } catch (error) {
      console.error(error); // Handle the error as needed
    }
  }

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value)); // Parse the selected value to a number
  };

  useEffect(() => {
    // Filter the table data based on the selected year whenever it changes
    if (tableData) {
      const filteredTableData = tableData.filter(
        (item) => item && item.year && item.year === selectedYear
      );
      setFilteredTableData(filteredTableData);
    }
  }, [tableData, selectedYear]);

  return (
    <div className="salary-slip-container">


      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="selectYear"
      >
        <option value={2023}>2023</option>
        <option value={2024}>2024</option>
        <option value={2025}>2025</option>
      </select>

      <table className="salaryTable">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
          <td className="slaryMonth">
            <PDFConverter/>
          </td>
          </tr> */}
          {loading ? (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          ) : (
            filteredTableData.map((item, index) => (
              <tr key={index} style={{ borderBottom: "2px solid #d3d6d6" }}>
                <td className="sno">{index + 1}</td>
                <td className="slaryMonth">
                  {item.month + (item.year ? ", " + item.year : "")}
                  <PDFConverter id={item.id} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalarySlip;
