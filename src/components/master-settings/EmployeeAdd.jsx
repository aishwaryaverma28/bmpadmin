import React, { useState } from "react";
import "../styles/EmployeeUpdate.css";
import axios from "axios";
import { EMPLOYEE_ADD, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeAdd = () => {
  const [name, setName] = useState("");
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const decryptedToken = getDecryptedToken();
  const [details, setDetails] = useState({
    hire_date: "",
    emp_no: "",
    position: "",
    mobile: "",
    dob: "",
    gender: "",
    department: "",
    salary: "",
    personal_email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    social1: "",
    social2: "",
    tax_id: "",
    aadhaar_no: "",
    password: "",
  });
  function handleNameChange(event) {
    const empName = event.target.value;
    setName(empName);
    let arr = empName.split(" ");
    if (arr.length > 1) splitEmployeeNme(arr);
  }
  function splitEmployeeNme(arr) {
    setfName(arr[0]);
    setlName(arr[arr.length - 1]);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      ...details,
      first_name: fname,
      last_name: lname,
    };
    axios
      .post(EMPLOYEE_ADD, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Employee data added successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setDetails({
          hire_date: "",
          emp_no: "",
          position: "",
          mobile: "",
          dob: "",
          gender: "",
          department: "",
          salary: "",
          personal_email: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          country: "",
          postcode: "",
          social1: "",
          social2: "",
          tax_id: "",
          aadhaar_no: "",
          password: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <header className="headerEditor">
        <h2>Add a new Employee</h2>
      </header>
      <form className="addEmployeeFrom" onSubmit={handleSubmit}>
        <div className="formDiv">
          <div className="leftForm">
            <div className="fromFiled">
              <label htmlFor="employeecode">
                employee code<span>*</span>
              </label>
              <input
                type="text"
                name="emp_no"
                onChange={handleChange}
                id="employeecode"
                placeholder="Please Enter Code"
              />
            </div>
            <div className="fromFiled">
              <label for="">employee name</label>

              <input
                type="text"
                name="employeename"
                id="employeename"
                placeholder="Please Enter Name"
                onChange={handleNameChange}
              />
            </div>
            <div className="fromFiled" top-align>
              <label for="">current address</label>

              <textarea
                type="textarea"
                id="currentaddress"
                name="address1"
                onChange={handleChange}
                rows="5"
                cols="5"
                placeholder="Please Enter Address"
              ></textarea>
            </div>
            <div className="fromFiled">
              <label for="">City</label>

              <input
                type="text"
                name="city"
                id="city"
                placeholder="Please Enter City"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">State</label>

              <input
                type="text"
                name="state"
                id="state"
                placeholder="Please Enter State"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Country</label>

              <input
                type="text"
                name="country"
                id="country"
                placeholder="Please Enter Country"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Postcode</label>

              <input
                type="text"
                name="postcode"
                id="postcode"
                placeholder="Please Enter Postcode"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Personal Email</label>

              <input
                type="email"
                name="personal_email"
                id="personal_email"
                placeholder="Please Enter Email"
                className="email-case"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">date of joining</label>

              <input
                type="date"
                name="hire_date"
                onChange={handleChange}
                id="date"
                placeholder=""
              />
            </div>

            <div className="fromFiled">
              <label for="">client/franchisee</label>

              <input
                type="text"
                name="client"
                id="client"
                placeholder="Please Enter Cilent"
              />
            </div>
            <div className="fromFiled">
              <label for="">remarks</label>

              <input
                type="text"
                name="remarks"
                id="remarks"
                placeholder="Please Enter Remarks"
              />
            </div>
          </div>
          <div className="rightForm">
            <div className="fromFiled">
              <label for="">employee type</label>

              <input
                type="text"
                name="position"
                onChange={handleChange}
                id="employeetype"
                placeholder="Please Enter Employee Type"
              />
            </div>
            <div className="fromFiled">
              <label for="">phone number</label>

              <input
                type="tel"
                name="mobile"
                onChange={handleChange}
                id="phonenumber"
                maxLength="10"
                placeholder="Please Enter Phone Number"
              />
            </div>
            <div className="fromFiled">
              <label for="">Date of Birth</label>

              <input
                type="date"
                name="dob"
                id="dob"
                placeholder="Please Enter Birth date"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label htmlFor="gender">
                Gender<span>*</span>
              </label>
              <select name="gender" id="gender" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="fromFiled">
              <label for="">Department</label>

              <input
                type="text"
                name="department"
                id="department"
                placeholder="Please Enter Department"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Salary</label>

              <input
                type="text"
                name="salary"
                id="salary"
                placeholder="Please Enter Salary"
                onChange={handleChange}
              />
            </div>

            <div className="fromFiled">
              <label for="">Aadhaar Number</label>

              <input
                type="number"
                name="aadhaar_no"
                id="aadhaar_no"
                placeholder="Please Enter Aadhar number"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Social Account</label>

              <input
                type="text"
                name="social1"
                id="social1"
                placeholder="Please Enter Social Account"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">Social Account</label>

              <input
                type="text"
                name="social2"
                id="social2"
                placeholder="Please Enter Social Account"
                onChange={handleChange}
              />
            </div>

            <div className="fromFiled">
              <label for="">password</label>

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Please Enter Password"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">org name</label>

              <input
                type="text"
                name="orgname"
                id="orgname"
                placeholder="Please Enter Organisation Name"
              />
            </div>
            <div className="fromFiled">
              <label for="">OTP</label>

              <input
                type="text"
                name="otp"
                id="otp"
                placeholder="Please Enter the OTP"
              />
            </div>
            <div className="saveBtnRight">
              <input
                type="submit"
                value="Add Employee"
                className="secondaryBtn saveBtn"
              />
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default EmployeeAdd;
