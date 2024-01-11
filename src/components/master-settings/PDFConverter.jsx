import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import ezukaLogo from "../../assets/image/ezukaLogo.png";
import axios from "axios";
import { PAYSLIP, getDecryptedToken } from "../utils/Constants";

const PDFConverter = ({ id }) => {
  const [empdata, setEmpData] = useState(null);
  const [payData, setPayData] = useState(null);
  const decryptedToken = getDecryptedToken();
  const [data, setData] = useState({
    name: "",
    month: "",
    year: "",
    hire_date: "",
    emp_no: "",
    country: "",
    department: "",
    working_days: "",
    bank_details: "",
    position: "",
    salary: "",
    tax: "",
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(PAYSLIP + id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      });
      setEmpData(response.data.data.employee);
      setPayData(response.data.data.payroll);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (empdata && payData) {
      setData({
        name: empdata.first_name + " " + empdata.last_name,
        month: payData.month,
        year: payData.year,
        hire_date: empdata.hire_date.split("T")[0],
        emp_no: empdata.emp_no,
        country: empdata.country,
        department: empdata.department,
        working_days: payData.working_days,
        bank_details: empdata.bank_details,
        position: empdata.position,
        salary: payData.salary,
        tax: payData.tax,
      });
    }
  }, [empdata, payData]);

  const handleDownload = () => {
    console.log(decryptedToken);
    const formattedSalary = parseFloat(data.salary).toLocaleString("en-IN");
    const pdfName = `SalarySlip-${data.name} ${data.month},${data.year}.pdf`;
    // Get the HTML content as a string
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
    <table class="custom-table" border="1" width="650" style="border-collapse: collapse; text-align: center; border: 1px solid black;" cellpadding="2" cellspacing="10">
    <tr>
      <th colspan="1" style="border: 1px solid black;">
        <img src=${ezukaLogo} alt="" style="width: 160px;" />
      </th>
      <th colspan="4" style="border: 1px solid black;">
        Ezuka Services Ltd <br />
        Bourne Business Park, 4 Dashwood Lang Rd, Addlestone KT15 2HJ, United Kingdom
      </th>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Employee Name</th>
      <td style="border: 1px solid black;">${data.name}</td>
      <th style="border: 1px solid black;border-bottom: none;"></th>
      <th style="border: 1px solid black;">Date Of Joining</th>
      <td style="border: 1px solid black;">${data.hire_date}</td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Employee Code</th>
      <td style="border: 1px solid black;">${data.emp_no}</td>
      <th style="border: 1px solid black;border-bottom: none; border-top: none;"></th>
      <th style="border: 1px solid black;">Place of Posting</th>
      <td style="border: 1px solid black;">${data.country}</td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Department</th>
      <td style="border: 1px solid black;">${data.department}</td>
      <th style="border: 1px solid black;border-bottom: none; border-top: none;"></th>
      <th style="border: 1px solid black;">Working Days</th>
      <td style="border: 1px solid black;">${data.working_days}</td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Month</th>
      <td style="border: 1px solid black;">${data.month}</td>
      <th style="border: 1px solid black;border-bottom: none; border-top: none;"></th>
      <th style="border: 1px solid black;">Bank / Account Number</th>
      <td style="border: 1px solid black;">${data.bank_details}</td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Position</th>
      <td style="border: 1px solid black;">${data.position}</td>
      <th style="border: 1px solid black; border-top: none;"></th>
      <th style="border: 1px solid black;">Sort Code</th>
      <td style="border: 1px solid black;">202464</td>
    </tr>
    <tr>
      <td colspan="5" style="height: 20px;border: 1px solid black;"></td>
    </tr>
    <tr>
      <th colspan="3" style="border: 1px solid black;">Earnings (Rs)</th>
      <th colspan="3" style="border: 1px solid black;">Deductions (Rs)</th>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Particulars</th>
      <th style="border: 1px solid black;">Actual Amount</th>
      <th style="border: 1px solid black;">Payable Amt</th>
      <th style="border: 1px solid black;">Particulars</th>
      <th style="border: 1px solid black;">Amount</th>
    </tr>
    <tr>
      <th style="border: 1px solid black;"><b>Basic Salary</b></th>
      <td style="border: 1px solid black;">${formattedSalary}</td>
      <td style="border: 1px solid black;">${formattedSalary}</td>
      <th style="border: 1px solid black;">Tax</th>
      <td style="border: 1px solid black;">${data.tax}</td>
    </tr>
    <tr>
      <td colspan="3" style="border: 1px solid black;"></td>
      <th style="border: 1px solid black;">NI Contribution</th>
      <td style="border: 1px solid black;">0</td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Incentives</th>
      <td style="border: 1px solid black;"></td>
      <td style="border: 1px solid black;"></td>
      <td colspan="2" style="border: 1px solid black;border-bottom: none;"></td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Arrears</th>
      <td style="border: 1px solid black;"></td>
      <td style="border: 1px solid black;"></td>
      <td colspan="2" style="border: 1px solid black; border-top: none;"></td>
    </tr>
    <tr>
      <th style="border: 1px solid black;">Total</th>
      <td style="border: 1px solid black;">${formattedSalary}</td>
      <td style="border: 1px solid black;">${formattedSalary}</td>
      <th style="border: 1px solid black;">Total Deductions</th>
      <td style="border: 1px solid black;">0</td>
    </tr>
    <tr>
      <td colspan="3" style="border: 1px solid black;"></td>
      <th style="border: 1px solid black;">Net Salary</th>
      <td style="border: 1px solid black;">${formattedSalary}</td>
    </tr>
    <tr>
      <td colspan="5" style="border: 1px solid black;">
        <b>For Ezuka Services Ltd</b> <br />
        <i>This is computer-generated statement; hence signature is not required.</i>
      </td>
    </tr>
  </table>
    </body>
    </html>
    `;

    // Set the options for PDF generation
    const options = {
      margin: 10,
      filename: pdfName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Create the PDF using html2pdf
    html2pdf().set(options).from(htmlContent).save();
  };

  return (
    <div>
      <button onClick={handleDownload} className="downBtn">
        <i class="fa-sharp fa-solid fa-download"></i>
      </button>
    </div>
  );
};

export default PDFConverter;
