import React, { useState } from "react";
import axios from "axios";
import { UPDATE_PRODUCT, getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPopUp = ({ onClose, editData, getProduct }) => {
    console.log(editData)
  const decryptedToken = getDecryptedToken();
  const [product, setProduct] = useState({
    product_code: editData.product_code,
    product_price: editData.product_price,
    description: editData.description,
    name: editData.name
  });
  const [stateBtn, setStateBtn] = useState(0);

  // const handleCancel = (e) => {
  //    e.preventDefault();
  // }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({ ...prevState, [name]: value }));
    setStateBtn(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product)
    axios
      .put(UPDATE_PRODUCT+editData.id, product, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        getProduct();
        onClose();
        toast.success("Product is updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setStateBtn(0);
        editData();
         })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="popup-wrapper">
      <div className="product-popup-container">
        <div className="product-popup-box">
          <p className="common-fonts add-product-heading">edit product</p>
          <div className="product-popup-content">
            <form action="">
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Name
                </label>
                <input type="text" className="common-input" name="name"
                  onChange={handleChange}
                  value={product.name}  />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Product Code
                </label>
                <input type="text" className="common-input" name="product_code"
                  onChange={handleChange}
                  value={product.product_code}/>
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Description
                </label>
                <input
                  type="text"
                  className="common-input"
                  placeholder="add important details like features, options or measurements."
                  name="description"
                  onChange={handleChange}
                  value={product.description}
                />
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Price
                </label>
                <div className="product-two-input">
                  <input
                    type="text"
                    className="common-input product-popup-input"
                    name="product_price"
                  onChange={handleChange}
                  value={product.product_price}
                  />
                  <select
                    name=""
                    id=""
                    className="common-input product-popup-select"
                  >
                    <option value="">US Dollar</option>
                  </select>
                </div>
              </div>
              <div className="product-popup-fields">
                <label htmlFor="" className="common-fonts">
                  Tax %
                </label>
                <input type="text" className="common-input" />
              </div>
            </form>
            <div className="product-popup-bottom">
              {/* <button className='common-white-button' onClick={handleCancel}>Cancel</button> */}
              {stateBtn === 0 ? (
                <button className="disabledBtn" disabled>
                  Save
                </button>
              ) : (
                <button
                  className="common-save-button product-popup-save"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="help-cross" onClick={onClose}>
        X
      </div>
    </div>
  );
};

export default ProductPopUp;
