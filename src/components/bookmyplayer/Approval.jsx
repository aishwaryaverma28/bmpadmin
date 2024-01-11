import React, { useState, useEffect } from 'react';
import Calender from "../../assets/image/calendar.svg";
import axios from 'axios';
import { GET_APPROVAL, UPDATE_ACADMEY_STATUS, getDecryptedToken } from '../utils/Constants.js';
import ApprovalModal from './ApprovalModal.jsx';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Approval = () => {
  const decryptedToken = getDecryptedToken();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const academyId = localStorage.getItem("academy_id");
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState([]);
  const [revokeId, setRevokeId] = useState(null);

  const openModal = (data) => {
    setIsOpen(true);
    setItem(data);
  }

  const closeModal = () => {
    setIsOpen(false);

  }

  const approvalData = () => {
    axios.post(GET_APPROVAL, {
      academy_id: academyId
    }, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`
      }
    }).then((response) => {
      const newData = response?.data?.data.map((item) => {
        const hasOverview = [
          'spoken_languages',
          'name',
          'about',
          'phone',
          'whatsapp',
          'experience',
          'address1',
          'map',
          'coordinate',
          'facebook',
          'instagram',
          'website',
          'sport',
          'email',
          'timing',
          'logo',
        ].some((key) => item[key] !== null);
  
        const hasGallery = [
          'photos',
          'videos',
          'training_ground_photos',
          'tournament_photos',
        ].some((key) => item[key] !== null);
  
        let approvedFields = '';
        let rejectedFields = '';
  
        if (item.status === 1) {
          if (hasOverview && !hasGallery) {
            approvedFields = 'overview';
          } else if (!hasOverview && hasGallery) {
            approvedFields = 'gallery';
          } else if (hasOverview && hasGallery) {
            approvedFields = 'overview, gallery';
          }
        }
  
        if (item.status === 2) {
          if (hasOverview && !hasGallery) {
            rejectedFields = 'overview';
          } else if (!hasOverview && hasGallery) {
            rejectedFields = 'gallery';
          } else if (hasOverview && hasGallery) {
            rejectedFields = 'overview, gallery';
          }
        }
  
        if (item.status === 0) {
          setRevokeId(item.id);
        }
  
        return {
          ...item,
          approvedFields,
          rejectedFields,
        };
      });
  
      const filteredData = newData.filter((item) => item.status !== 3);
      setData(filteredData);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    approvalData();
  }, []);

  const handleRevoke = () => {
    axios.put(UPDATE_ACADMEY_STATUS + revokeId, { status: 3 },
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`
        }
      }).then((response) => {
        if (response?.data?.status === 1) {
          console.log(response?.data?.data)
          toast.success("Reply send successfully!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
        setRevokeId(null);
        approvalData();
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <>

      <div>
        <p className='common-fonts bmp_approval'>Approval Status</p>
      </div>

      <div className='bmp_approval_btn'>
        <div>
          <button className='common-fonts bmp_date_button'><img src={Calender} alt="" />Any Date</button>
        </div>

        <div>
          {revokeId === null ? (
            <button className='common-fonts common-delete-button bmp_disable_revoke' disabled>Revoke</button>
          ) : (
            <button className='common-fonts common-delete-button bmp_revoke' onClick={handleRevoke} >Revoke</button>
          )}
          {/* <button className='common-fonts common-save-button'>Proceed</button> */}
        </div>
      </div>

      <div className='bmp_approval_table'>
        <table>
          <thead>
            <tr>
              <th className='common-fonts'>Sno.</th>
              <th className='common-fonts'>Date</th>
              <th className='common-fonts'>Rejected Fields</th>
              <th className='common-fonts'>Approved Fields</th>
              <th className='common-fonts'>Remarks</th>
            </tr>
          </thead>
          <tbody>

            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "1.5rem", textAlign: "center" }}
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              data?.map((item, index) => (
                <tr key={item.id} onClick={() => openModal(item)}>
                  <td className='common-fonts'>{index + 1}</td>
                  <td className='common-fonts'>{item?.update_date?.split("T")[0]}</td>
                  <td className='common-fonts' style={{ color: item.status === 0 ? 'red' : 'inherit' }}>{item.status === 0 ? 'Pending' : item.rejectedFields}</td>
                  <td className='common-fonts' style={{ color: item.status === 0 ? 'red' : 'inherit' }}>{item.status === 0 ? 'Pending' : item.approvedFields}</td>
                  <td className='common-fonts'>{item.rejection_reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
      {
        isOpen && (
          <ApprovalModal onClose={closeModal} item={item} />
        )
      }
      <ToastContainer />
    </>

  )
}

export default Approval
