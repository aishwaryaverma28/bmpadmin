import React from 'react';
import '../styles/CPGenral.css';
import { useState } from 'react';
import BillsTab from './BillsTab';
import PaymentsPrefrenceTab from './PaymentsPrefrenceTab';
import TransactionTab from './TransactionTab';

const CPBillings = () => {
  const [activeTab, setActiveTab] = useState('bills');

  function handleTabChange(tabName){
    setActiveTab(tabName)
  }
  return (

 <div>
  <div className="cp-billings-tabs">
    <button  
    className={`common-fonts ${activeTab === "bills" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('bills')}
    >Bills</button>


    <button className={`common-fonts ${activeTab === "payments" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('payments')}
    >Payments preferences</button>



    <button className={`common-fonts ${activeTab === "transactions" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('transactions')}
    >Transactions</button>
  </div>


  {activeTab === "bills" && 
  <BillsTab/>
  
         }
  {activeTab === "payments" && (
          <PaymentsPrefrenceTab/>
          )
         }
  {activeTab === "transactions" && (
           <TransactionTab/>
          )
         }
 </div>
  )
}

export default CPBillings