import React, { useState, useEffect } from "react";
import SearchIcon from "../assets/image/search.svg";
import axios from "axios";
import {
  GET_ALL_SEARCH,
  getDecryptedToken,
  handleLogout,
} from "./utils/Constants";

const QuestionTab = () => {
  const decryptedToken = getDecryptedToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const [selectedItemDetails, setSelectedItemDetails] = useState("");

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowSearchResult(query.length > 0);
  };

  const handleTitleClick = (title, details) => {
    setSelectedItemTitle(title);
    setSelectedItemDetails(details);
    setData([]);
  };

  function handleFormSubmit() {
    const updatedFormData = {
      // condition: "all",
      help_title: searchQuery,
    };
    console.log(updatedFormData);
    axios
      .post( GET_ALL_SEARCH, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response?.data?.data);
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    handleFormSubmit();
  }, [searchQuery]);

  return (
    <div className="question-tab">
      <p className="common-fonts question-tab-top">How can we help you?</p>
      <p className="common-fonts question-tab-note">
        Tell us your problem so we can get you the right help and support.
      </p>

      <div className="recycle-search-box">
        <span className="question-search-icon">
          <img src={SearchIcon} alt="" />
        </span>
        <input
          type="text"
          className="question-search-input recycle-fonts"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      {showSearchResult && (
        <div className="search_result">
          {data?.map((item, index) => (
            <>
              <p
                className="common-fonts searchTitle"
                key={item.id}
                onClick={() => handleTitleClick(item.title, item.details)}
              >
                {item.title}
              </p>
            </>
          ))}
        </div>
      )}
      {selectedItemDetails === "" ? (
        <p className="common-fonts question-para">
          Please Search for title in search bar
        </p>
      ) : (
        <>
          <p className="common-fonts question-para">{selectedItemTitle}</p>
          <p className="common-fonts answer-para">{selectedItemDetails}</p>
        </>
      )}
    </div>
  );
};

export default QuestionTab;
