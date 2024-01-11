import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  SEC_ADD,
  BLOG_GETID,
  BLOG_EDIT,
  SEC_GET,
  GET_TAG,
  GET_TAG_BY_SITE,
  SEC_UPDATE,
  getDecryptedToken,
  GET_TAG_CATEGORY,
} from "../utils/Constants";
import ReactEditor from "../ReactEditor";
import trash from "../../assets/image/delete-icon.svg";
import "../styles/BlogAdd.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeftArrow from "../../assets/image/arrow-left.svg";
const BlogUpdate = () => {
  const { id } = useParams();
  const org_id = localStorage.getItem("org_id");
  // section states
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSort, setSectionSort] = useState(null);
  const [dataFromChild, setDataFromChild] = useState("");
  const [isIndex, setIsIndex] = useState(-1);
  const [options, setOptions] = useState([]);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRefs = useRef(null);
  // const [childData, setChildData] = useState("");
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [showEditButton, setShowEditButton] = useState(false);
  const decryptedToken = getDecryptedToken();
  // tags states
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagId, setTagId] = useState("");
  const [selectSite, setSelectSite] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [category, setCategory] = useState([]);
  const [urlName, setUrlName] = useState("");
  const [views, setViews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    sport: "",
    description: "",
    meta_description: "",
    keywords: "",
    tag: "",
    image: "",
    date: "",
    site: "",
    route: "",
  });
  const [blogImg2, setBlogImg2] = useState("");
  const [blogImgName, setBlogImgName] = useState("");
  const [blogImgName2, setBlogImgName2] = useState("");
  const [blogImg3, setBlogImg3] = useState("");

  const [stateBtn, setStateBtn] = useState(0);
  const [updateStateBtn, setUpdateStateBtn] = useState(0);
  const editorRef = useRef();
  useEffect(() => {
    getBlogInfo();
    getTagCategory();
  }, []);

  const getTagCategory = () => {
    axios
      .get(GET_TAG_CATEGORY + org_id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response)
        setCategory(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateClick = (id) => {
    const updatedSection = sectionData.find((section) => section.id === id);

    if (!updatedSection) {
      console.error(`Section with id ${id} not found.`);
      return;
    }
    const plainText = removeHtmlTags(updatedSection.section);
    const updatedFormData = {
      heading: updatedSection.heading,
      sort: updatedSection.sort,
      image: updatedSection.image,
      section: plainText,
      blogid: updatedSection.blogid,
    };
    console.log(updatedFormData);
    axios
      .put(SEC_UPDATE + updatedSection.id, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Section updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Some error occured", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatDateForInput = (timestamp) => {
    const utcDate = new Date(timestamp);
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
    const formattedDate = istDate.toISOString().split("T")[0];
    return formattedDate;
  };
  async function getBlogInfo() {
    const response = await axios.get(BLOG_GETID + id, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
      },
    });
    const data = response.data.data[0];
    setViews(response?.data?.views);
    if (data) {
      setFormData({
        ...formData,
        title: data?.title,
        url: data?.url,
        description: data?.description,
        sport: data?.sport,
        meta_description: data?.meta_description,
        keywords: data?.keywords,
        tag: data?.tag,
        image: data?.image,
        date: data?.date ? formatDateForInput(data.date) : "",
        site: data?.site,
        route: data?.url,
      });
      setUrlName(data?.url);
      setBlogImg2(data?.image);
      setBlogImgName(data?.image?.split("blog/"));
      setTagId(data?.tag);
      setSelectSite(data?.site);
      // getTagBySite(data?.site);
    }
    const secResponse = await axios.get(SEC_GET + id, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
      },
    });
    const secData = secResponse.data.data;
    const sectionDataWithoutDate = removeDateFromSectionData(secData);
    setSectionData(sectionDataWithoutDate);
    tagData();
  }

  const removeDateFromSectionData = (data) => {
    return data?.map((section) => {
      const { date, ...newSection } = section;
      return newSection;
    });
  };
  //==========================================================================tag part
  useEffect(() => {
    const updatedForm = {
      condition: "all",
      org_id: org_id,
    };
    axios
      .post(GET_TAG, updatedForm, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setOptions(response?.data?.data);
        tagData(); // Call tagData() after receiving the tag data
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getTagBySite = (site) => {
    axios
      .get(GET_TAG_BY_SITE + site + "/" + org_id, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        setOptions(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const tagData = () => {
    const ids = tagId?.split(",");
    const newTags = [];
    ids.forEach((item) => {
      const option = options.find((opt) => opt.id == item);
      if (option && !selectedTags.includes(option.tag)) {
        newTags.push(option.tag);
      }
    });
    setSelectedTags((prevTags) => [...prevTags, ...newTags]);
  };

  useEffect(() => {
    tagData();
  }, [options]);

  const handleTagSelection = (event) => {
    const { name = "categoryDropdown", value } = event?.target || {};

    if (name === "categoryDropdown") {
      let updatedForm = {};

      if (value) {
        updatedForm = {
          sport: value,
          condition: "sport",
          org_id: org_id,
        };
      } else {
        updatedForm = {
          condition: "all",
          org_id: org_id,
        };
      }

      // Call your API with updatedForm object
      axios
        .post(GET_TAG, updatedForm, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          setOptions(
            response?.data?.data?.map((item) => ({ id: item.id, tag: item.tag }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (name === "tagDropdown") {
      const id = event.target.value;
      setStateBtn(1);
      setTagId((prevTags) => (prevTags ? `${prevTags},${id}` : id));
      options?.map((option) => {
        if (option.id == id) {
          setSelectedTags((prev) => [...prev, option.tag]);
        }
      });
    }
  };

  const handleTagRemoval = (index) => {
    setStateBtn(1);
    const numbersArray = tagId?.split(",");
    numbersArray.splice(index, 1);
    const updatedNumbersString = numbersArray.join(",");
    setTagId(updatedNumbersString);
    const tagUpdate = selectedTags.splice(index, 1);
  };

  function AddTag(event) {
    event.preventDefault();
  }
  // ==========================================================================================================================================
  function handleSiteSelection(event) {
    setSelectSite(event.target.value);
    setStateBtn(1);
    // getTagBySite(event.target.value);
  }

  // ==========================================================accordion of sub sections
  function accordianClick(index) {
    if (index === isIndex) {
      setIsIndex(-1);
    } else {
      setIsIndex(index);
    }
  }
  //=============================================================setion title
  const handleSecTitleChange = (event, index) => {
    const newSectionData = [...sectionData];
    newSectionData[index].heading = event.target.value;
    setSectionData(newSectionData);
    setUpdateStateBtn(1);
  };

  //==============================================================section sort
  const handleSortChange = (event, index) => {
    const newSectionData = [...sectionData];
    newSectionData[index].sort = event.target.value;
    setSectionData(newSectionData);
    setUpdateStateBtn(1);
  };
  //==============================================================sub section editor
  const handleEditorChange = (data, index) => {
    const newSectionData = [...sectionData];
    newSectionData[index].section = data;
    setSectionData(newSectionData);
    setUpdateStateBtn(1);
  };

  //=========================================================== sort and title data change
  const handleTitle = (event) => {
    const title = event.target.value;
    setSectionTitle(title);
  };

  const handleSecSortChange = (event) => {
    const sort = event.target.value;
    setSectionSort(sort);
  };

  //==================================================================editor data transfer
  const handleDataTransfer = (data) => {
    setDataFromChild(data);
  };

  const removeHtmlTags = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  //=========================================================handle section data in an array of objects

  const handleAddSection = (e) => {
    e.preventDefault();
    const plainText = removeHtmlTags(dataFromChild);
    const newSection = {
      heading: sectionTitle,
      sort: parseInt(sectionSort),
      image: blogImg3.split("blog/")[1]?.replace(/\.jpg$/, ""),
      section: plainText,
      // section: `${dataFromChild}`,
      site: "",
      alt: "",
    };
    axios
      .post(SEC_ADD + id, newSection, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response?.data?.status);
        if (response.data.status === 1) {
          toast.success("Section Added successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 2000,
          });
        }
        getBlogInfo();
      });
    setSectionTitle("");
    setSectionSort(parseInt(sectionSort) + 1);
    setDataFromChild("");
    setStateBtn(1);
    editorRef.current.clearEditorContent();
    setBlogImg3("");
  };

  // =====================================================================================delete the targeted section
  const handleDeleteSection = (index) => {
    const newSectionData = [...sectionData];
    newSectionData.splice(index, 1);
    setSectionData(newSectionData);
    setStateBtn(1);
  };
  // ========================================================================================================================================================================

  function handleChange(event) {
    const { name, value } = event.target;
    if (formData[name] !== value) setStateBtn(1);
    setFormData({ ...formData, [name]: value });
    let modifiedValue = value;
    if (name === "title") {
      modifiedValue = modifiedValue.toLowerCase();
      modifiedValue = modifiedValue.replace(/\s+/g, "-");
      modifiedValue = modifiedValue.replace(/[^\w\s-]/g, "");
      setFormData((prev) => {
        return { ...prev, url: modifiedValue };
      });
    }
    else if (name === "keywords") {
      modifiedValue = modifiedValue.toLowerCase();
      setFormData((prev) => {
        return { ...prev, keywords: modifiedValue };
      });
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      title: formData?.title,
      url: formData?.url,
      sport: formData?.sport,
      description: formData?.description,
      meta_description: formData?.meta_description,
      keywords: formData?.keywords,
      image: formData?.image,
      date: formData?.date,
      site: selectSite,
      tag: tagId,
      route: formData?.url,
    };
    try {
      const response = await fetch(BLOG_EDIT + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
        body: JSON.stringify(updatedFormData), // Convert the data to JSON string
      });

      const data = await response.json();
      console.log(data);
      if (data?.status === 1) {
        toast.success("Blog updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error(data?.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setStateBtn(0);
  }

  const submitImage2 = (file) => {
    const selectedImage = file;
    console.log(selectedImage);
    if (selectedImage) {
      const folder = "bookmyplayer/blog";
      const uniqueFileName = `${folder}/${selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      )}`;

      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setBlogImg2(data?.url);
          const part = selectedImage.name;
          setBlogImgName(part);
          setFormData((prev) => {
            return { ...prev, image: part };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitImage3 = (file) => {
    const selectedImage = file;
    if (selectedImage) {
      const folder = "bookmyplayer/blog";
      const uniqueFileName = `${folder}/${selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      )}`;

      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setBlogImg3(data?.url);
          setBlogImgName2(selectedImage.name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFileChange2 = (event) => {
    submitImage2(event.target.files[0]);
  };
  const handleFileChange3 = (event) => {
    submitImage3(event.target.files[0]);
  };

  const handleButtonClick2 = (event) => {
    event.preventDefault();
    fileInputRef2.current.click();
    setStateBtn(1);
  };
  const handleButtonClick3 = (event) => {
    event.preventDefault();
    fileInputRef3.current.click();
  };

  const handleReplaceImage = (event, index) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const folder = "bookmyplayer/blog";
      const uniqueFileName = `${folder}/${selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      )}`;

      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);

      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // Update the image URL in the sectionData state
          const newSectionData = [...sectionData];
          newSectionData[index].image = selectedImage.name;
          setSectionData(newSectionData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleViewSite = (e) => {
    e.preventDefault();
    if (selectSite === "bookmyplayer") {
      const newTab = window.open(
        `https://www.bookmyplayer.com/blog/${urlName}`,
        "_blank"
      );
      newTab.focus();
    }
  };

  return (
    <>
      <header className="headerEditor update-view">
        <p className="common-fonts add-new-blog">Update Blog</p>
        <p className="common-fonts add-new-blog">Number of views: {views}</p>
      </header>
      <div className="back-to-user general-refresh blog-back">
        <Link to={"/lp/settings/blog/view"}>
          <button className="common-fonts">
            <img src={LeftArrow} alt="" />
            <span>Back To Blog Table</span>
          </button>
        </Link>
      </div>
      <form className="scrollCover" onSubmit={handleFormSubmit}>
        <div className="addBlogContainer">
          {/*==============================================================right side of form starts here ============================================================*/}
          <div className="addBlogMainForm">
            <input
              type="file"
              id="imageUpload"
              ref={fileInputRef2}
              onChange={handleFileChange2}
              style={{ display: "none" }}
            />
            <div className="from-filed">
              <label htmlFor="title" className="common-fonts blogs-new-label">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                placeholder="Blog Title"
                onChange={handleChange}
              />
            </div>
            <div className="from-filed">
              <label htmlFor="title" className="common-fonts blogs-new-label">
                Url
              </label>
              <input
                type="text"
                name="url"
                id="url"
                placeholder="Url"
                value={formData.url}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="from-view-img">
              <div className="blog-update-img">
                <button
                  className="common-fonts blog-add-img add-img-2 update-img"
                  onClick={handleViewSite}
                >
                  View Site
                </button>
                <button
                  className="common-fonts blog-add-img add-img-2 update-img"
                  onClick={handleButtonClick2}
                >
                  Change Image
                </button>
                <div className="blog-new-img">
                  {blogImg2 ? blogImgName : <></>}
                </div>

              </div>
            </div>
            <div className="from-filed">
              <label htmlFor="title" className="common-fonts blogs-new-label">
                description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                placeholder="Description"
                onChange={handleChange}
              />
            </div>
            <div className="from-filed">
              <label htmlFor="sport" className="common-fonts blogs-new-label">
                Blog Sport
              </label>
              <input
                type="text"
                name="sport"
                id="sport"
                placeholder="Enter Blog Sport"
                value={formData.sport}
                onChange={handleChange}
              />
            </div>
            <div className="from-filed">
              <label htmlFor="title" className="common-fonts blogs-new-label">
                meta description
              </label>
              <input
                type="text"
                name="meta_description"
                id="meta_description"
                value={formData.meta_description}
                placeholder="Blog Meta Description"
                onChange={handleChange}
              />
            </div>
            <div className="from-filed">
              <label htmlFor="title" className="common-fonts blogs-new-label">
                keywords
              </label>
              <input
                type="text"
                name="keywords"
                id="keywords"
                value={formData.keywords}
                placeholder="Blog Keywords"
                onChange={handleChange}
                className="keywordsLower"
              />
            </div>
            <>
              <div className="addSection">
                <input
                  type="file"
                  id="imageUpload"
                  ref={fileInputRef3}
                  onChange={handleFileChange3}
                  style={{ display: "none" }}
                />
                <div className="from-blog-section from-filed">
                  <label htmlFor="title" className="common-fonts blogs-new-label">
                    Section Title<span className="common-fonts redAlert"> *</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitle"
                    id="sectiontitle"
                    placeholder="Section Title"
                    onChange={handleTitle}
                    value={sectionTitle}
                  />


                  <div className="formBtnBox">
                    <div className="blog-url-input-2 blog-sort">
                      <label
                        htmlFor="title"
                        className="common-fonts blogs-new-label"
                      >
                        Sort<span className="common-fonts redAlert"> *</span>
                      </label>
                      <input
                        type="text"
                        name="Sort"
                        id="Sort"
                        value={sectionSort}
                        placeholder="Sort"
                        onChange={handleSecSortChange}
                      />
                    </div>

                    <div className="blog-browse-img">
                      <button
                        className="common-fonts blog-add-img add-img-2 add-img-3"
                        onClick={handleButtonClick3}
                      >
                        Add Image
                      </button>

                      <div className="blog-new-img">{blogImg3 ? blogImgName2 : <></>}</div>
                    </div>
                    <button
                      onClick={handleAddSection}
                      className="common-fonts blog-add-img add-img-2 add-img-3"
                    >
                      Add Section<span className="common-fonts redAlert"> *</span>
                    </button>
                  </div>


                </div>

                <div className="formEditor">
                  <ReactEditor
                    ref={editorRef} // Attach the ref here
                    onDataTransfer={handleDataTransfer}
                  />
                </div>
              </div>

              {sectionData?.map((section, index) => (
                <div key={index} className={`section ${index === 0 ? 'first-section' : ''}`}>
                  <div
                    className="sectionDropdown"
                    onClick={() => accordianClick(index)}
                  >
                    <div className="accHead">
                      <h3>{section.sort}</h3>
                      <h3>{section.heading}</h3>
                    </div>
                    {isIndex === index ? (
                      <span>
                        <i class="fa-sharp fa-solid fa-minus"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fa-sharp fa-solid fa-plus"></i>
                      </span>
                    )}
                  </div>
                  <div
                    className={
                      isIndex === index ? "answer display_answer" : "answer"
                    }
                  >
                    <div className="sectionBlockOne">
                      <input
                        type="text"
                        name="Sort"
                        id="Sort"
                        placeholder="Sort"
                        className="SubsectionSort"
                        value={section.sort}
                        onChange={(event) => handleSortChange(event, index)}
                      />
                      <input
                        type="text"
                        name="heading"
                        id="heading"
                        placeholder="Section Title"
                        className="sectionHead"
                        value={section.heading}
                        onChange={(event) => handleSecTitleChange(event, index)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleReplaceImage(event, index)}
                        style={{ display: "none" }}
                        ref={(input) => (fileInputRefs[index] = input)}
                      />
                      <div className="blog-browse-img-2">
                        <button
                          className="common-fonts blog-add-img add-img-2"
                          onClick={(event) => {
                            event.preventDefault();
                            fileInputRefs[index].click();
                            setUpdateStateBtn(1);
                          }}
                        >
                          {section?.image ? " change image" : " add image"}
                        </button>
                        {section?.image ? (
                          <p className="common-fonts section-img-new">
                            {section?.image}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="formEditor">
                      <ReactEditor
                        onDataTransfer={(data) =>
                          handleEditorChange(data, index)
                        }
                        initialContent={section.section}
                      />
                    </div>
                    <div className="blog-disable">
                      {updateStateBtn === 0 ? (
                        <button
                          disabled
                          className="disabledBtn blog-update-btn"
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          className="common-fonts common-save-button blog-update-btn"
                          onClick={() => handleUpdateClick(section.id)}
                        >
                          Update
                        </button>
                      )}
                    </div>
                    {section.id ? (
                      <></>
                    ) : (
                      <div className="deleteContainer">
                        <button
                          onClick={() => handleDeleteSection(index)}
                          className="sectionDelete"
                        >
                          <img
                            src={trash}
                            className="deleteIcon"
                            alt="Delete"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>

            {/* ============================================================================================================================================== */}
          </div>
          <div className="addBlogRightForm">
            <div className="tags">
              <div className="tagContent tag-box">
                <h3>Tags</h3>
                <div className="contentBox">
                  <select
                    name="categoryDropdown"
                    onChange={handleTagSelection}
                    className="tagSelectBox"
                  >
                    <option value="">category</option>

                    {category?.map((data) => (
                      <option key={data?.sport} value={data?.sport}>
                        {data?.sport}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={handleTagSelection}
                    className="tagSelectBox"
                    name="tagDropdown"
                  >
                    <option value="">Select a tag</option>

                    {options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.tag}
                      </option>
                    ))}
                  </select>
                  {/* 
                  <button onClick={AddTag} type="button" className="primaryBtn">
                    Add
                  </button> */}
                </div>
                <div className="tagData">
                  {selectedTags &&
                    selectedTags?.map((tag, index) => (
                      <div key={index} className="tagItems">
                        {tag}

                        <i
                          className="fa-solid fa-x blog-cross"
                          onClick={() => handleTagRemoval(index)}
                        ></i>
                      </div>
                    ))}
                </div>
              </div>
              <div className="tagContent tag-box">
                <h3>Publish</h3>
                <div className="contentBox blog-add-date">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData?.date || ""}
                    placeholder="Please select a publish date"
                    onChange={handleChange}
                  />
                  <div className="saveBtnRight">
                    {stateBtn === 0 ? (
                      <button className="closeBtn">
                        <Link to={"/lp/settings/blog/view"}>Close</Link>
                      </button>
                    ) : (
                      <input
                        type="submit"
                        value="Save"
                        className="common-fonts common-save-button blog-publish"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="tags">
                <div className="tagContent tag-box tag-box-1">
                  <h3>Site</h3>
                  <div className="contentBox">
                    <select
                      onChange={handleSiteSelection}
                      className="SiteSelectBox"
                    >
                      <option value="">Select a Site</option>
                      <option value="leadplaner">leadplaner</option>
                      <option value="bookmyplayer">bookmyplayer</option>
                      <option value="ezuka">ezuka</option>
                      <option value="routplaner">routplaner</option>
                    </select>
                  </div>
                </div>
                <div className="tagData tag-box tag-box-2">
                  <div className={selectSite ? 'tagItems' : ''}>{selectSite}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default BlogUpdate;
