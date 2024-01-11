import React, { useState } from "react";
import "../styles/EmployeeView.css";
import { Link } from "react-router-dom";
const TablePaginationBlog = ({ data, rowsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    const middlePage = Math.ceil(maxVisiblePages / 2);
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= middlePage) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + middlePage > totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - middlePage + 1;
      endPage = currentPage + middlePage - 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          className="numBtn"
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            fontWeight: currentPage === i ? "bolder" : "normal",
          }}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };
  const formatDateWithTimestamp = (timestamp) => {
    const utcDate = new Date(timestamp);
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
    const formattedDate = istDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    return formattedDate;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Section Count</th>
            {/* <th>Site</th> */}
            <th>Date</th>

          </tr>
        </thead>
        <tbody>
          {currentRows?.map((row, index) => (
            <tr key={index}>
              <td className="employeeId">{row?.id}</td>
              <td className="employeeName"><Link to={"/lp/settings/blog/view/" + row.id}>{row?.title}</Link></td>
              <td className="sectionCount">{row?.section_count}</td>
              <td className="employeeDate">{row?.date ? formatDateWithTimestamp(row?.date) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="paginationContent">
          <button
            className="prevBtn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            className="prevBtn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePaginationBlog;
