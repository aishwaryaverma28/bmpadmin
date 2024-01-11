import React, { useState, useEffect } from 'react';
import '../styles/CPGenral.css';
import GreaterArrowDown from '../../assets/image/greater-arrow-down.svg';
import LabelModal from './LabelModal';
import { getDecryptedToken, GET_LABEL, handleLogout, UPDATE_LABEL } from "../utils/Constants";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';

const LabelsTab = () => {
    const orgId = localStorage.getItem('org_id');
    const [openLeadModal, setOpenLeadModal] = useState(false);
    const [labelData, setLabelData] = useState([]);
    const decryptedToken = getDecryptedToken();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [selectedDeals, setSelectedDeals] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [initialData, setInitialData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const body = {
            org_id:orgId
          }
        try {
            const response = await axios.post(GET_LABEL, body,{
                headers: {
                    Authorization: `Bearer ${decryptedToken}`,
                },
            });
            if (response.data.status === 1) {
                setLabelData(response.data.data);
                setInitialData(response.data.data);
    
                // Update selected checkboxes based on fetched entity values
                const updatedNotes = [];
                const updatedLeads = [];
                const updatedDeals = [];
                const updatedContacts = [];
    
                response.data.data.forEach(data => {
                    if (data?.entity?.includes('notes')) {
                        updatedNotes.push(data.id);

                    }
                    if (data?.entity?.includes('leads')) {
                        updatedLeads.push(data.id);
                    }
                    if (data?.entity?.includes('deals')) {
                        updatedDeals.push(data.id);
                    }
                    if (data?.entity?.includes('contacts')) {
                        updatedContacts.push(data.id);
                    }
                });
    
                setSelectedNotes(updatedNotes);
                setSelectedLeads(updatedLeads);
                setSelectedDeals(updatedDeals);
                setSelectedContacts(updatedContacts);
            } else {
                if (response.data.message === 'Token has expired') {
                    alert(response.data.message);
                    handleLogout();
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    const labelRefresh = () => {
        fetchData();
    }
    
    const handleOpenLabel = () => {
        setOpenLeadModal(true);
    }

    const handleCloseLabel = () => {
        setOpenLeadModal(false);
    }

    const handleUpdateLabel = () => {
        const updatedLabelData = labelData.map(data => {
            const entityParts = [
                selectedNotes.includes(data?.id) ? 'notes' : null,
                selectedLeads.includes(data?.id) ? 'leads' : null,
                selectedDeals.includes(data?.id) ? 'deals' : null,
                selectedContacts.includes(data?.id) ? 'contacts' : null,
            ].filter(entity => entity !== null);
        
            const entityValue = entityParts.length > 0 ? entityParts.join(',') : null;
        
            return {
                id: data?.id,
                name: data?.name,
                colour_code: data?.colour_code,
                entity: entityValue,
            };
        });

        const changedEntities = updatedLabelData.filter((updatedObj, index) => {
            const initialObj = initialData[index]; // Corresponding object in initialData array
          
            return updatedObj.entity !== initialObj.entity;
          });

        axios.put(UPDATE_LABEL,{data:changedEntities},{
            headers: {
              Authorization: `Bearer ${decryptedToken}` // Include the JWT token in the Authorization header
            }
          }).then((response) => {
            console.log(response);
            toast.success("label updated successfully", {
                position: "top-center",
                autoClose: 2000,
              })
          })
          .catch((error) => {
            console.log(error)
          });
    }

    const handleNoteCheckboxChange = (noteId) => {
        if (selectedNotes.includes(noteId)) {
            setSelectedNotes(prevNotes => prevNotes.filter(id => id !== noteId));
        } else {
            setSelectedNotes(prevNotes => [...prevNotes, noteId]);
        }
    };
    const handleLeadCheckboxChange = (leadId) => {
        if (selectedLeads.includes(leadId)) {
            setSelectedLeads(prevLeads => prevLeads.filter(id => id !== leadId));
        } else {
            setSelectedLeads(prevLeads => [...prevLeads, leadId]);
        }
    };
    const handleDealCheckboxChange = (dealId) => {
        if (selectedDeals.includes(dealId)) {
            setSelectedDeals(prevDeals => prevDeals.filter(id => id !== dealId));
        } else {
            setSelectedDeals(prevDeals => [...prevDeals, dealId]);
        }
    };
    const handleContactCheckboxChange = (contactId) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(prevContact => prevContact.filter(id => id !== contactId));
        } else {
            setSelectedContacts(prevContact => [...prevContact, contactId]);
        }
    };
    return (
        <section>
            <ToastContainer/>
            <div className='label-tab-top'>
                <div className='label-tab-leads'>
                    <img src={GreaterArrowDown} alt="" />

                    <p className='common-fonts'>leads</p>

                </div>

                <div>
                    <button className='common-white-button label-update-btn' onClick={handleUpdateLabel}>Update</button>
                    <button className='common-save-button' onClick={handleOpenLabel}>Add new button</button>
                    <button type="button" className="helpBtn genral-refresh-icon label-refresh-icon" title="Refresh" onClick={labelRefresh}>
              <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
                </div>

            </div>

            {
                labelData.length === 0 ? (
                    <div className='no-label-found common-fonts'>
                        <p >No Labels Found</p>
                    </div>
                ) :
                    (
                        <div className='leads-tab-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <label className="cp-checkbox lead-checkbox">
                                                <input type="checkbox" className="cb1" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </th>
                                        <th className='common-fonts'>LABEL NAME</th>
                                        <th className='common-fonts'>COLOR</th>
                                        <th className='common-fonts'>NOTES</th>
                                        <th className='common-fonts'>LEADS</th>
                                        <th className='common-fonts'>DEALS</th>
                                        <th className='common-fonts'>CONTACTS</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        labelData.map(data=>{
                                            return(
                                                <tr key={data.id}>
                                                <td className='common-fonts'><label className="cp-checkbox lead-checkbox">
                                                    <input type="checkbox" className="cb1" />
                                                    <span className="checkmark"></span>
                                                </label></td>
                                                <td className='common-fonts'>{data.name}</td>
                                                <td className='common-fonts'><div className={'leads-tab-color'} style={{ backgroundColor: data.colour_code }} ></div></td>
                                                <td className='common-fonts'>
                                                    <div className='leads-table-td'>
                                                        <label className="cp-checkbox lead-checkbox">
                                                            <input type="checkbox" className="cb1" onChange={() => handleNoteCheckboxChange(data.id)} checked={selectedNotes.includes(data.id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className='common-fonts'>
                                                    <div className='leads-table-td'>
                                                        <label className="cp-checkbox lead-checkbox">
                                                            <input type="checkbox" className="cb1" onChange={() => handleLeadCheckboxChange(data.id)} checked={selectedLeads.includes(data.id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className='common-fonts'>
                                                    <div className='leads-table-td'>
                                                        <label className="cp-checkbox lead-checkbox">
                                                            <input type="checkbox" className="cb1" onChange={() => handleDealCheckboxChange(data.id)} checked={selectedDeals.includes(data.id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className='common-fonts'>
                                                    <div className='leads-table-td'>
                                                        <label className="cp-checkbox lead-checkbox">
                                                            <input type="checkbox" className="cb1" onChange={() => handleContactCheckboxChange(data.id)} checked={selectedContacts.includes(data.id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </td>
        
                                            </tr>

                                            )
                                        })
                                    }


                                </tbody>
                            </table>

                        </div>
                    )
            }


            {
                openLeadModal && (
                    <LabelModal onClose={handleCloseLabel} fetchColor = {fetchData} />
                )
            }

        </section>

    )
}

export default LabelsTab