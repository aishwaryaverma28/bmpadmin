import React, { useState, useRef, useEffect } from 'react';
import '../../styles/workflow.css';
import ManageAccessPopUp from './ManageAccessPopUp.jsx.jsx';

import Stage from './Stage';
import Automate from './Automate';

const Pipeline = ({type}) => {
  const [actionopen, setActionOpen] = useState(false);
  const [actionopen2, setActionOpen2] = useState(false);
  const actionDropDownRef = useRef(null);
  const actionDropDownRef2 = useRef(null);
  const [activeTab, setActiveTab] = useState('stage');
  const [isManageOpen, setIsManageOpen] = useState(false);

    function handleTabChange(tabName){
      setActiveTab(tabName)
    }

    const toggleActionDropdownStatic = () => {
      setActionOpen(!actionopen);
    };
    const toggleActionDropdownStatic2 = () => {
      setActionOpen2(!actionopen);
    };

    const handleManage = () => {
      setIsManageOpen(true);
    }

    const handleManageClose = () => {
      setIsManageOpen(false);
    }



    useEffect(()=>{
      const handleOutsideClick = (event) => {
        if (
          actionDropDownRef.current &&
          !actionDropDownRef.current.contains(event.target)
        ) {
          setActionOpen(false);
        }
      };
      const handleOutsideClick2 = (event) => {
        if (
          actionDropDownRef2.current &&
          !actionDropDownRef2.current.contains(event.target)
        ) {
          setActionOpen2(false);
        }
      };
  
      // Add the event listener when the component mounts
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("click", handleOutsideClick2);

      return () => {
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("click", handleOutsideClick2);
      };

    },[])

  return (
    <div className='pipeline_container'>
       <div className='pipeline_top'>
       <div className='pipeline_left_select'>
       <p className='common-fonts pipeline_select_heading'>Select Pipeline</p>
       <div className="select action-select">
                                <div
                                  className="dropdown-container"
                                  ref={actionDropDownRef}
                                >
                                  <div
                                    className="dropdown-header2 pipeline-dropdown"
                                    onClick={toggleActionDropdownStatic}
                                  >
                                    Select Pipeline
                                    <i
                                      className={`fa-sharp fa-solid ${
                                        actionopen
                                          ? "fa-angle-up"
                                          : "fa-angle-down"
                                      }`}
                                    ></i>
                                  </div>
                                  {actionopen && (
                                    <ul className="dropdown-menu user-team-dropdown-position">
                                      <li>Sales Pipeline</li>
                                      <li>Create New Pipeline</li>

                                    </ul>
                                  )}
                                </div>
                              </div>
       </div>

       <div>
       <div className="select action-select">
                                <div
                                  className="dropdown-container"
                                  ref={actionDropDownRef2}
                                >
                                  <div
                                    className="dropdown-header2"
                                    onClick={toggleActionDropdownStatic2}
                                  >
                                    Action
                                    <i
                                      className={`fa-sharp fa-solid ${
                                        actionopen
                                          ? "fa-angle-up"
                                          : "fa-angle-down"
                                      }`}
                                    ></i>
                                  </div>
                                  {actionopen2 && (
                                    <ul className="dropdown-menu">
                                      <li>Rename this Pipeline</li>
                                      <li>Reorder Pipelines</li>
                                      <li onClick={handleManage}>Manage Access</li>
                                      <li>Delete this pipeline</li>

                                    </ul>
                                  )}
                                </div>
                              </div>
       </div>
       </div>

       <section>
        <div className="cp-billings-tabs">
        <button className={`common-fonts ${activeTab === "stage" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('stage')}
    >Stage</button>

    <button  
    className={`common-fonts ${activeTab === "automate" ? "cp-active" : ""
  }` }  onClick={() => handleTabChange('automate')}
    >Automate</button>
    </div>

    
  {activeTab === "stage" && 
    (
       <Stage type={type}/>
    )
  
         }
  {activeTab === "automate" && 
      (
        <Automate/>
      )
  
         }

    </section>
    {
      isManageOpen && (
        <ManageAccessPopUp onClose={handleManageClose}/>
      )
    }
    </div>
  )
}

export default Pipeline
