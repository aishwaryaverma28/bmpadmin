import React, { useState } from 'react'
import ContactSupport from './ContactSupport';
import ServiceSupport from './ServiceSupport';

const SupportTab = () => {

    const [activeTab, setActiveTab] = useState('service');

    function handleTabChange(tabName){
      setActiveTab(tabName)
    }
  return (
    
    <section>
        <div className="cp-billings-tabs">
        <button className={`common-fonts ${activeTab === "service" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('service')}
    >Service Support</button>

    <button  
    className={`common-fonts ${activeTab === "contact" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('contact')}
    >Contact Support</button>
    </div>

    
  {activeTab === "contact" && 
    (
        <ContactSupport />
    )
  
         }
  {activeTab === "service" && 
      (
        <ServiceSupport/>
      )
  
         }

    </section>
  )
}
export default SupportTab