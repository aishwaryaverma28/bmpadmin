import React, { useEffect, useState } from "react";
import Search from "../../assets/image/search.svg";
import User from "../../assets/image/user-icon.svg";
import CreateModal from "./CreateModal.jsx";


const ListFilter = () => {
const [create, setCreate] = useState(false);

const handleCreate = () =>{
  setCreate(true)
}
const handleCreateClose = () =>{
  setCreate(false)
}


  useEffect(() => {
    // Set body overflow to hidden when the component mounts
    document.body.style.overflow = 'hidden';

    // Revert body overflow to its original value when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <div>
      <div className="mrkt-list-container">
        <div className="mrkt-list-left-wrapper">
          <div className="mrkt-list-left">
            <div className="mrkt-list-top-filter">
              <p className="common-fonts">Filter</p>
              <p className="common-fonts">Clear Filter</p>
            </div>

            <div className="filter-list-option mrkt-first-filter">
              <label htmlFor="">Company</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select Company</option>
              </select>
            </div>

            <div className="filter-list-option">
              <label htmlFor="">Industry</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select Industry</option>
              </select>
            </div>

            <div className="filter-list-option">
              <label htmlFor="">Owner</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select Owner</option>
              </select>
            </div>

            <div className="filter-list-option">
              <label htmlFor="">Atleast have leads</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select</option>
              </select>
            </div>

            <div className="filter-list-option">
              <label htmlFor="">Atleast have Deals</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select</option>
              </select>
            </div>

            <div className="filter-list-option filter-last-option">
              <label htmlFor="">Country</label>
              <select name="" id="" className="mrkt-list-select">
                <option value="">Please Select</option>
              </select>
            </div>

            <div className="mrkt-list-checkbox">
               <input type="checkbox" className="mtkt-check" />
              <span className="common-fonts">Closed Atleast one deal</span>
            </div>
          </div>

          <div className="left-list-btn">
            <button className="common-fonts common-save-button">Apply</button>
          </div>
        </div>

        <div className="mrkt-right-wrapper">
          <div className="mrkt-list-right">
            <div className="mrkt-top-flex mrkt-add-all">
              <div className="recycle-search-box">
                <input
                  type="text"
                  className="recycle-search-input recycle-fonts"
                  placeholder="Search..."
                />
                <span className="recycle-search-icon">
                  <img src={Search} alt="" />
                </span>
              </div>

              <div>
                <button className="common-fonts common-save-button mrkt-new-btn">
                  + Add All
                </button>
              </div>
            </div>
          </div>

          <div className="mrkt-table-wrapper">
          <div className="mrkt-right-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th className="common-fonts">Name</th>
                  <th className="common-fonts">Company</th>
                  <th className="common-fonts">Email</th>
                  <th className="common-fonts">Phone</th>
                  <th className="common-fonts">Leads</th>
                  <th className="common-fonts">Deals</th>
                </tr>
              </thead>
               <tbody>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               <tr>
                  <td>
                    <label className="custom-checkbox mrkt-box">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts">Frank</p>
                    </div>
                  </td>
                  <td>
                    <div className="mrkt-username">
                      <div className="mrkt-username-img">
                        <img src={User} alt="" srcset="" />
                      </div>

                      <p className="common-fonts mrkt-blue">Nector</p>
                    </div>
                  </td>

                  <td>
                    <p className="common-fonts" style={{"textTransform":"none"}}>anantsingh@gmail.com</p>
                  </td>

                  <td>
                    <p className="common-fonts">9874563210</p>
                  </td>

                  <td>
                    <p className="common-fonts">1</p>
                  </td>

                  <td>
                    <p className="common-fonts">2</p>
                  </td>
                </tr>
               </tbody>
            </table>
          </div>

          <div className="mrkt-apply-btn">
            <button className="common-white-button common-fonts">Cancel</button>
            <button className="common-save-button common-fonts" onClick={handleCreate}>Create</button>
          </div>

          </div>


        </div>
      </div>
      {
        create && (
          <CreateModal onClose={handleCreateClose}/>
        )
      }
    </div>
  );
};

export default ListFilter;
