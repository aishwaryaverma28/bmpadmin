import React from 'react';
import Search from "../../assets/image/search.svg";
import { Link } from 'react-router-dom';

const CampaignListTable = () => {
  return (
    <div>
              <div className='mrkt-top-flex'>
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

          <Link to="/lp/marketing/list">
          <div>
          <button className="common-fonts common-save-button mrkt-new-btn">+ Create List</button>
          </div>
          </Link>
         
          </div>
          <div className='marketing-all-table mrkt-list-table'>
        <table>
            <thead>
                <tr>
                    <th className='common-fonts'>S No</th>
                    <th className='common-fonts'>List Name</th>
                    <th className='common-fonts'>Created On</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='common-fonts'>1</td>
                    <td className='common-fonts'>Promotion List</td>
                    <td className='common-fonts'>Oct 11 , 2023 at 6:00 PM</td>
                </tr>
            </tbody>
        </table>
     </div>
    </div>
  )
}

export default CampaignListTable
