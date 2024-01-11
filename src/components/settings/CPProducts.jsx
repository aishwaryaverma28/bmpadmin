import React, { useRef, useState, useEffect } from "react";
import "../styles/CompanyProducts.css";
import ProductPopUp from "./ProductPopUp";
import axios from "axios";
import {
   GET_ALL_PRODUCT,
  getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProductPopUp from "./EditProductPopUp";

const CPProducts = () => {
  const decryptedToken = getDecryptedToken();
  const actionDropDownRef = useRef({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userActionOpen, setUserActionOpen] = useState({});
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditOpen = (item) => {
    setSelectedProduct(item)
    setIsEditPopUpOpen(true);
  }

  const handleEditPopUpClose = () => {
    setIsEditPopUpOpen(false);

  }


  const getProduct = () => {
    axios
      .get(GET_ALL_PRODUCT, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setProduct(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    getProduct();
  }, []);


  const toggleActionDropdown = (userId) => {
    setUserActionOpen((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };


  const handleAddProduct = () => {
    setIsProductModalOpen(true);
  };

  const handleCloseAddProduct = () => {
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    // Event listener callback for handling clicks outside the dropdown container
    const handleOutsideClick = (event) => {
      // Check each ref to see if the click occurred outside the corresponding dropdown
      Object.values(actionDropDownRef.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          // Clicked outside, close the dropdown
          setUserActionOpen((prevState) => ({
            ...prevState,
            [ref.dataset.userId]: false,
          }));
        }
      });
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const productRefresh = () => {
    getProduct();
  }

  return (
    <section>
      <div className="cp-top">
        <button className="common-save-button" onClick={handleAddProduct}>
          Add Product
        </button>
        <button type="button" className="helpBtn genral-refresh-icon label-refresh-icon" title="Refresh" onClick={productRefresh}>
              <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
      </div>
      {loading ? (
        // Show a loading message or spinner while data is loading
        <p>Loading...</p>
      ) : (
        <div className="cp-table">
          <table>
            <thead>
              <tr>
                <th>
                  <label className="cp-checkbox">
                    <input type="checkbox" className="cb1" />
                    <span className="checkmark"></span>
                  </label>
                </th>
                <th className="common-fonts">name</th>
                <th className="common-fonts">product code</th>
                <th className="common-fonts">unit price</th>
                <th className="common-fonts">create date</th>
              </tr>
            </thead>
            {product.length === 0 ? (
              <p>No Product found</p>
            ) : (
              <tbody>
                {product.map((item) => (
                <tr key={item.id}>
                  <td>
                    <label className="cp-checkbox">
                      <input type="checkbox" className="cb1" />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="cp-action">
                      <p className="common-fonts">{item.name}</p>
                      <div className="select action-select">
                        <div
                          className="dropdown-container"
                          ref={(ref) =>
                            (actionDropDownRef.current[item.id] =
                              ref)
                          }
                          data-user-id={item.id}
                        >
                          <div
                            className="dropdown-header2"
                            onClick={() => toggleActionDropdown(item.id)}
                          >
                            Actions{" "}
                            <i
                              className={`fa-sharp fa-solid ${
                                userActionOpen[item.id] ? "fa-angle-up" : "fa-angle-down"
                              }`}
                            ></i>
                          </div>
                          {userActionOpen[item.id] && (
                            <ul className="dropdown-menu product-dropdown-menu">
                              <li  onClick={() => handleEditOpen(item)}>Edit</li>
                              <li>Clone</li>
                              <li>Delete</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="common-fonts cp-code">{item.product_code}</td>
                  <td className="common-fonts">{item.product_price}</td>
                  <td className="common-fonts">{item.creation_date.split("T")[0]}</td>
                </tr>
                ))}                
              </tbody>
            )}
          </table>
        </div>
      )}
      {isProductModalOpen && <ProductPopUp onClose={handleCloseAddProduct} getCall={getProduct}/>}
      <ToastContainer />
      {
        isEditPopUpOpen && (
          <EditProductPopUp onClose={handleEditPopUpClose} editData={selectedProduct} getProduct={getProduct}/>
        )
      }
    </section>
  );
};

export default CPProducts;
