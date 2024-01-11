import React from 'react';
import '../styles/CPGenral.css';
import MasterCard from '../../assets/image/master-card.png';
import Visa from '../../assets/image/visa.png';

const PaymentsPrefrenceTab = () => {
  return (
    
<>
    <div className='pp-button'>
        <button className='common-white-green-button'>set as default</button>
        <button className='common-delete-button'>Delete</button>
        <button className='common-white-green-button'>Edit</button>
        <button className='common-save-button'>Add payment method</button>
    </div>


<div className='pp-cards'>
<div className='pp-master-card'>
    <div className='master-card-img'>
        <img src={MasterCard} alt="" />
        <div className='white-circle'><div className='green-circle'></div></div>
    </div>

    <div className='pp-atm-no'>
        <p className='pp-card-no common-fonts'><span>****</span><span>****</span><span>****</span><span>3396</span></p>
    </div>

    <div className='pp-card-bottom'>
        <div>
            <p className='commo-fonts pp-card-up'>name</p>
            <p className='commo-fonts pp-card-down'>Anant Singh Chauhan</p>
        </div>
        <div>
            <p className='commo-fonts pp-card-up'>Expiry date</p>
            <p className='commo-fonts pp-card-down'>09/25</p>
        </div>
    </div>


</div>
<div className='pp-master-card'>
    <div className='master-card-img'>
        <img src={Visa} alt="" />
        <div className='white-circle'></div>
    </div>

    <div className='pp-atm-no'>
        <p className='pp-card-no common-fonts'><span>****</span><span>****</span><span>****</span><span>3396</span></p>
    </div>

    <div className='pp-card-bottom'>
        <div>
            <p className='commo-fonts pp-card-up'>name</p>
            <p className='commo-fonts pp-card-down'>Ameesha Patel</p>
        </div>
        <div>
            <p className='commo-fonts pp-card-up'>Expiry date</p>
            <p className='commo-fonts pp-card-down'>01/25</p>
        </div>
    </div>


</div>

</div>

</>
  )
}

export default PaymentsPrefrenceTab