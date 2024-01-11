import React, { useState } from 'react';
import '../styles/CPGenral.css';
import CalendarIcon from "../../assets/image/calendar.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Download from '../../assets/image/download.svg';

const TransactionTab = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  return (
    
    <section>
      <div className="transaction-top-date">

      <div >
        <p className='common-fonts transaction-start-date'>start Date</p>

        {/* below is date picker from which we can select start date  */}
        <div className="custom-date-input transaction-date">
                      <div className="date-input-wrapper">
                        <img
                          src={CalendarIcon}
                          alt="Delete"
                          className="delete-icon"
                        />
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className="recycle-date-input"
                          dateFormat="dd/MM/yyyy"
                          value={startDate}
                          placeholderText="dd/mm/yyyy"
                        />
                      </div>
                    </div>
      </div>
      <div>
        <p className='common-fonts transaction-end-date'>end date</p>

        {/* below is date picker from which we can select end date  */}

        <div className="custom-date-input ">
                      <div className="date-input-wrapper">
                        <img
                          src={CalendarIcon}
                          alt="Delete"
                          className="delete-icon"
                        />
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          className="recycle-date-input"
                          dateFormat="dd/MM/yyyy"
                          value={endDate}
                          placeholderText="dd/mm/yyyy"
                        />
                      </div>
                    </div>
      </div>

      </div>

      <div className='transaction-tab-table'>

        <table>
          <thead>
            <tr>
              <th className='common-fonts'>transactions</th>
              <th className='common-fonts'>invoice id</th>
              <th className='common-fonts'>status</th>
              <th className='common-fonts'>payment method</th>
              <th className='common-fonts'>currency</th>
              <th className='common-fonts'>amount</th>
              <th className='common-fonts'>amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='common-fonts'>july 2, 2023</td>
              <td className='common-fonts tr-invoice-id'><span>31072023</span><img src={Download} alt="" /></td>
              <td className='common-fonts'>paid</td>
              <td className='common-fonts'>Credit card ending in 3369</td>
              <td className='common-fonts'>USD</td>
              <td className='common-fonts'>105.23</td>
              <td className='common-fonts'>june 2023</td>
            </tr>
            <tr>
              <td className='common-fonts'>july 2, 2023</td>
              <td className='common-fonts tr-invoice-id'><span>31072023</span><img src={Download} alt="" /></td>
              <td className='common-fonts'>paid</td>
              <td className='common-fonts'>Credit card ending in 3369</td>
              <td className='common-fonts'>USD</td>
              <td className='common-fonts'>105.23</td>
              <td className='common-fonts'>june 2023</td>
            </tr>
            <tr>
              <td className='common-fonts'>july 2, 2023</td>
              <td className='common-fonts tr-invoice-id'><span>31072023</span><img src={Download} alt="" /></td>
              <td className='common-fonts'>paid</td>
              <td className='common-fonts'>Credit card ending in 3369</td>
              <td className='common-fonts'>USD</td>
              <td className='common-fonts'>105.23</td>
              <td className='common-fonts'>june 2023</td>
            </tr>
          </tbody>
        </table>

      </div>
 
    </section>
  )
}

export default TransactionTab