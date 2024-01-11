import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  EMPLOYEE_GET,
  EMPLOYEE_UPDATE,
  getDecryptedToken,
} from "../utils/Constants";
import "../styles/EmployeeUpdate.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EmployeeUpdate = () => {
  const { id } = useParams();
  const [empData, setEmpData] = useState([]);
  const [currentEmp, setCurrentEmp] = useState({});
  const [originalFormData, setOriginalFormData] = useState({});
  const decryptedToken = getDecryptedToken();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    position: "",
    personalEmail: "",
    mobile: "",
    social1: "",
    social2: "",
    salary: "",
    aadhaar: "",
    hire_date: "",
    aadhaar_no: "",
    dob: "",
    gender: "Male",
    department: "",
  });
  const [stateBtn, setStateBtn] = useState(0);

  useEffect(() => {
    getEmployeeInfo();
  }, []);

  async function getEmployeeInfo() {
    const response = await axios.get(EMPLOYEE_GET, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
      },
    });
    const data = response.data.data;
    setEmpData(data);
    searchData(data);
  }

  function searchData(data) {
    const employee = data.find((item) => item.id == id);
    if (employee) {
      setCurrentEmp(employee);
      setOriginalFormData({
        ...formData,
        name: employee.first_name + " " + employee.last_name,
        address: employee.address1,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        postcode: employee.postcode,
        personalEmail: employee.personal_email,
        position: employee.position,
        mobile: employee.mobile,
        social1: employee.social1,
        social2: employee.social2,
        salary: employee.salary,
        aadhaar_no: employee.aadhaar_no,
        hire_date: formatDate(employee.hire_date),
        dob: formatDate(employee.dob),
        gender: employee.gender,
        department: employee.department,
      });
      setFormData({
        ...formData,
        name: employee.first_name + " " + employee.last_name,
        address: employee.address1,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        postcode: employee.postcode,
        personalEmail: employee.personal_email,
        position: employee.position,
        mobile: employee.mobile,
        social1: employee.social1,
        social2: employee.social2,
        salary: employee.salary,
        aadhaar_no: employee.aadhaar_no,
        hire_date: formatDate(employee.hire_date),
        dob: formatDate(employee.dob),
        gender: employee.gender,
        department: employee.department,
      });
    }
  }

  function formatDate(date) {
    return date ? date.split("T")[0] : "";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (formData[name] !== value) setStateBtn(1);
    setFormData({ ...formData, [name]: value });
  }

  function handleCancel() {
    setFormData(originalFormData);
    setStateBtn(0);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      first_name: formData.name.split(" ")[0],
      last_name: formData.name.split(" ")[1],
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postcode: formData.postcode,
      dob: formData.dob,
      personal_email: formData.personalEmail,
      hire_date: formData.hire_date,
      mobile: formData.mobile,
      position: formData.position,
      department: formData.department,
      social1: formData.social1,
      social2: formData.social2,
      address1: formData.address,
      gender: formData.gender,
      aadhaar_no: formData.aadhaar_no,
      salary: formData.salary,
    };
    axios
      .put(EMPLOYEE_UPDATE + id, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Employee data updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }

  return (
    <>
      <header className="headerEditor">
        <h2>Update Employee Details</h2>
      </header>
      <form className="addEmployeeFrom" onSubmit={handleSubmit}>
        <div className="formDiv">
          <div className="leftForm">
            <div className="fromFiled">
              <label for="">
                employee code<span>*</span>
              </label>
              <input
                type="text"
                name="emp_no"
                id="employeecode"
                placeholder="Please Enter Code"
                value={currentEmp.emp_no}
              />
            </div>
            <div className="fromFiled">
              <label for="">
                employee name<span>*</span>
              </label>

              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label htmlFor="address1">
                current address<span>*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="5"
                cols="5"
                placeholder="Please Enter Address"
              ></textarea>
            </div>
            <div className="fromFiled">
              <label for="">
                City<span>*</span>
              </label>

              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Please Enter City"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                State<span>*</span>
              </label>

              <input
                type="text"
                name="state"
                id="state"
                placeholder="Please Enter State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Country<span>*</span>
              </label>

              <input
                type="text"
                name="country"
                id="country"
                placeholder="Please Enter Country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Postcode<span>*</span>
              </label>

              <input
                type="text"
                name="postcode"
                id="postcode"
                placeholder="Please Enter Postcode"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Personal Email<span>*</span>
              </label>

              <input
                type="email"
                name="personalEmail"
                id="personal_email"
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="Please Enter Email"
                className="email-case"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                date of joining<span>*</span>
              </label>

              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                id="date"
                placeholder=""
              />
            </div>

            <div className="fromFiled">
              <label for="">
                client/franchisee<span>*</span>
              </label>

              <input
                type="text"
                name="client"
                id="client"
                placeholder="Please Enter Cilent"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                remarks<span>*</span>
              </label>

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
              <label for="">
                employee type<span>*</span>
              </label>

              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Please Enter Employee Type"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                phone number<span>*</span>
              </label>

              <input
                type="tel"
                name="mobile"
                id="phonenumber"
                maxlength="13"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Please Enter Phone Number"
              />
            </div>

            <div className="fromFiled">
              <label for="">
                Date of Birth<span>*</span>
              </label>

              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Please Enter Birth date"
              />
            </div>
            <div className="fromFiled">
              <label htmlFor="gender">
                Gender<span>*</span>
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="fromFiled">
              <label for="">
                Department<span>*</span>
              </label>

              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Please Enter Department"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Salary<span>*</span>
              </label>

              <input
                type="text"
                name="salary"
                id="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Please Enter Salary"
              />
            </div>

            <div className="fromFiled">
              <label for="">
                Aadhaar Number<span>*</span>
              </label>

              <input
                type="number"
                name="aadhaar_no"
                id="aadhaar_no"
                value={formData.aadhaar_no}
                onChange={handleChange}
                placeholder="Please Enter Aadhar number"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Social Account<span>*</span>
              </label>

              <input
                type="text"
                name="social1"
                id="social1"
                value={formData.social1}
                onChange={handleChange}
                placeholder="Please Enter Social Account"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                Social Account<span>*</span>
              </label>

              <input
                type="text"
                name="social2"
                id="social2"
                value={formData.social2}
                onChange={handleChange}
                placeholder="Please Enter Social Account"
              />
            </div>

            <div className="fromFiled">
              <label for="">
                password<span>*</span>
              </label>

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Please Enter Password"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                org name<span>*</span>
              </label>

              <input
                type="text"
                name="orgname"
                id="orgname"
                placeholder="Please Enter Organisation Name"
              />
            </div>
            <div className="fromFiled">
              <label for="">
                OTP<span>*</span>
              </label>

              <input
                type="text"
                name="otp"
                id="otp"
                placeholder="Please Enter the OTP"
              />
            </div>
            <div className="saveBtnRight">
              <button
                type="button"
                className="cancleBtn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              {stateBtn === 0 ? (
                <button className="closeBtn">
                  <Link to={"/lp/settings/employee/view"}>Close</Link>
                </button>
              ) : (
                <input
                  type="submit"
                  value="Save"
                  className="secondaryBtn saveBtn"
                />
              )}
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default EmployeeUpdate;
