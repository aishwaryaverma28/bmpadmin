import React, { useState } from 'react';
import '../styles/CPGenral.css';
import Clock from '../../assets/image/clock.svg';
import ArrowSign from '../../assets/image/greater-arrow.svg';

const BillsTab = () => {
  const [openDate, setOpenDate] = useState(false);
  const [openAll, setOpenAll] = useState(false);

  const actionOpenDate = () => {
    setOpenDate(!openDate);
  };
  const actionOpenAll = () => {
    setOpenAll(!openAll);
  };


  return (
    <section>
     <div className='bills-top-dropdown'>
      <div className='bills-date' onClick={actionOpenDate}><span className='common-fonts'>July 2023</span> <i
                                      className={`fa-sharp fa-solid ${openDate ? "fa-angle-up" : "fa-angle-down"
                                        }`}
                                    ></i></div>
      <div className='bills-all' onClick={actionOpenAll}><span className='common-fonts'>All</span> <i
                                      className={`fa-sharp fa-solid ${openAll ? "fa-angle-up" : "fa-angle-down"
                                        }`}
                                    ></i></div>
     </div>


     <div className='bills-table'>
      <table>
  <caption className='common-fonts bills-summary-heading'>Bill summary</caption>

  <thead>
    <tr>
      <th >
        <p className='common-fonts bills-top'>Account Id</p>
        <p className='common-fonts bills-down'>7856932159</p>
      </th>
      <th>
        <p className='common-fonts bills-top'>Billing period</p>
        <p className='common-fonts bills-down'>july 1 - july 31, 2023</p>
      </th>
      <th>
        <p className='common-fonts bills-top'>Billing status</p>
        <p className='common-fonts bills-down'><img src={Clock} alt="" /> <span>Unpaid</span></p>
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td className='common-fonts'>invoice - 31072023</td>
      <td></td>
      <td>
        <div>
          <p className='common-fonts bills-usd'>Total in USD</p>
          <p className='common-fonts bills-dollar'>$50.01</p>
        </div>
      </td>
    </tr>
    <tr>
      <td className='common-fonts'>invoice - 31072023</td>
      <td></td>
      <td>
        <div>
          <p className='common-fonts bills-usd'>Total in USD</p>
          <p className='common-fonts bills-dollar'>$50.01</p>
        </div>
      </td>
    </tr>
    <tr>
      <td className='common-fonts'>invoice - 31072023</td>
      <td></td>
      <td>
        <div>
          <p className='common-fonts bills-usd'>Total in USD</p>
          <p className='common-fonts bills-dollar'>$50.01</p>
        </div>
      </td>
    </tr>
    <tr className='bills-tr'>
      <td className='bills-tr bills-estimate'></td>
      <td className='bills-tr bills-estimate'></td>
      <td className='bills-tr bills-estimate common-fonts'>estimated grand total : <span>$193.06</span> </td>
    </tr>
    <tr>
      <td className='bills-tr'><span className='common-fonts  bills-pay'>payment info <img src={ArrowSign} alt="" /></span></td>
      <td className='bills-tr'></td>
      <td className='bills-tr'></td>
    </tr>
  </tbody>
      </table>
     </div>
    </section>
  )
}

export default BillsTab