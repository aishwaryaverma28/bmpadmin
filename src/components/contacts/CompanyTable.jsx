import React,{ useState, useEffect } from "react";
import Search from "../../assets/image/search.svg";
import Building from "../../assets/image/building.svg";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getDecryptedToken, ALL_COMPANY, LOG_RECORD } from "../utils/Constants.js";
import Papa from "papaparse";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyTable = ({ companyData, loading, onSelectedIdsChange  }) => {
  console.log(companyData)
  console.log("hello")
  const [searchQuery, setSearchQuery] = useState("");
  const orgId = localStorage.getItem("org_id");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isTableHeaderChecked, setIsTableHeaderChecked] = useState(false);
  const [jsonCompanyData, setJsonCompanyData] = useState([]);
  const decryptedToken = getDecryptedToken();

  const fetchCompanyData = () => {
    const body = {
      org_id: orgId
    }
    axios.post(ALL_COMPANY, body, {
      headers: {
        Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
      },
    })
    .then((response) => {
      setJsonCompanyData(response?.data?.data);
    })
    .catch((error) => {
      console.log(error)
    });
  };

  useEffect(()=>{
  fetchCompanyData();
  }, [])

  const logRecord = () => {
    const updatedFormData = {
      attr1: `company:export`,
      attr4: `company exported`,
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

  const downloadCompanyCSV = () => {
    const csv = Papa.unparse(jsonCompanyData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "company.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    logRecord();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy"); // Change the format as per your requirement
  };

  const filteredCompanyData = companyData.filter((item) => {
    const name = item?.name?.toLowerCase() || "";
    const industry = item?.industry?.toLowerCase() || "";
    const email = item?.email?.toLowerCase() || "";
    const phone = item?.phone?.toLowerCase() || "";
    const country = item?.country?.toLowerCase() || "";
    const city = item?.city?.toLowerCase() || "";
    const creationDate = formatDate(item?.creation_date) || "";
    const valuationIn = item?.valuation_in?.toLowerCase() || "";
    const domain = item?.domain?.toLowerCase() || "";
    const fullVal =
      `${item.valuation} ${item.valuation_in}`.toLowerCase() || "";
    const searchCompany = searchQuery.toLowerCase();

    // Check if the search query matches any of the fields
    const matchesSearchQuery =
      name?.includes(searchCompany) ||
      industry?.includes(searchCompany) ||
      email?.includes(searchCompany) ||
      phone?.includes(searchCompany) ||
      country?.includes(searchCompany) ||
      city?.includes(searchCompany) ||
      valuationIn?.includes(searchCompany) ||
      fullVal?.includes(searchCompany) ||
      creationDate?.includes(searchCompany) ||
      domain?.includes(searchCompany);

    return matchesSearchQuery;
  });
  const handleTableHeaderCheckboxChange = () => {
    if (isTableHeaderChecked) {
      setSelectedIds([]);
      onSelectedIdsChange(selectedIds);
    } else {
      const allIds = filteredCompanyData.map((company) => company.id);
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
    const isAllChecked = filteredCompanyData.every((company) =>
      selectedIds.includes(company.id)
    );
    onSelectedIdsChange(selectedIds);
    setIsTableHeaderChecked(isAllChecked);
  }, [selectedIds, filteredCompanyData]);

  return (
    <>
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
          <button className="common-fonts common-white-green-button" onClick={downloadCompanyCSV}>
            Export
          </button>
        </div>
      </div>

      <div className="cp-table-container">

<div className="contact-cp-table" >
{
  loading ?  (
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
        <th className="common-fonts contact-th">Company Name</th>
        <th className="common-fonts contact-th">Industry</th>
        <th className="common-fonts contact-th">Email</th>
        <th className="common-fonts contact-th">Phone</th>
        <th className="common-fonts contact-th">Postal Code</th>
        <th className="common-fonts contact-th">Address 1</th>
        <th className="common-fonts contact-th">Address 2</th>
        <th className="common-fonts contact-th">Country</th>
        <th className="common-fonts contact-th">City</th>
        <th className="common-fonts contact-th">Valuation</th>
        <th className="common-fonts contact-th">Domain</th>
        <th className="common-fonts contact-th">Creation Date</th>
      </tr>
    </thead>
    <tbody>
      { filteredCompanyData.length === 0 ? (
        <tr>
          <td colSpan={10} style={{ textAlign: "center" }}>
            No data found
          </td>
        </tr>
      ) : (
        filteredCompanyData.map((company) => {
          return (
            <tr key={company.id}>
              <th className="contact-box">
                <label className="custom-checkbox">
                <input
                type="checkbox"
                className="cb1"
                name=""
                checked={selectedIds.includes(company.id)}
                onChange={() => handleCheckboxChange(company.id)}
              />
                  <span className="checkmark"></span>
                </label>
              </th>
              <td className="common-fonts ">
                <Link to={`/lp/contacts/company/${company.id}`}>
                  <span className="contact-building">
                    <img src={Building} alt="" />
                  </span>{" "}
                  {company.name}
                </Link>
              </td>

              <td className="common-fonts">{company.industry}</td>
              <td className="common-fonts person-email">
                {company.email}
              </td>
              <td className="common-fonts">{company.phone}</td>
              <td className="common-fonts postal-cp">{company.postcode}</td>
              <td className="common-fonts">{company.address1}</td>
              <td className="common-fonts">{company.address2}</td>
              <td className="common-fonts">{company.country}</td>
              <td className="common-fonts">{company.city}</td>
              <td className="common-fonts">
                {company.valuation} {company.valuation_in}
              </td>
              <td className="common-fonts company-domain-case">{company.domain}</td>
              <td className="common-fonts">
                {formatDate(company.creation_date.split("T")[0])}
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
  )
}

</div>
</div>
    </>

  );
};

export default CompanyTable;
