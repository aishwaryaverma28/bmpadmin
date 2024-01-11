import React, { useEffect, useState, useRef } from "react";
import "../styles/LPleads.css";
import user from "../../assets/image/user.svg";
import pound from "../../assets/image/british-pound-symbol.svg";
import { Link } from "react-router-dom";
import LeadModal from "../lead/LeadModal.jsx";
import LeadDeletePopUp from "../DeleteComponent.jsx";
import axios from "axios";
import {UPDATE_LEAD, MOVELEAD_TO_TRASH, getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDeal from "../deal/CreateDeal";
import AssignModal from "./AssignModal.jsx";

const LeadCards = ({
  object,
  selectedIds,
  setSelectedIds,
  status,
  onLeadAdded,
  userData,
}) => {
  const decryptedToken = getDecryptedToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState(null);
  const [selectedConvertItem, setSelectedConvertItem] = useState(null);
  const [assign, setAssign] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [assignLeadId, setAssignLeadId] = useState(null);
  const [data, setData] = useState("");
  const handleDataReceived = (newData) => {
    setData(newData);
    console.log(newData);
  };

  const handleAssignModal = (id) => {
    setAssign(true);
    setAssignLeadId(id);
  };
  const handleAssignModalClose = () => {
    setAssign(false);
  };
  const handleAssignLead = () => {
    if (assignLeadId) {
      const body = {
        leadIds: [assignLeadId], // Use the stored ID
        owner: data,
      };
      axios
      .put(UPDATE_LEAD, body, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          toast.success("Lead reassign successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          onLeadAdded();
        })
        .catch((error) => {
          console.log(error);
        });
      setAssignLeadId(null); // Reset the stored ID
      setAssign(false);
    }
  };


  const openConvertModal = (item) => {
    setSelectedConvertItem(item); // Set the selected item
    setConvertModalVisible(true); // Open the modal
  };
  const closeConvertModal = () => {
    setSelectedConvertItem(null); // Clear the selected item
    setConvertModalVisible(false); // Close the modal
  };

  const handleLeadDelete = (id) => {
    setIsDelete(true);
    setDeleteLeadId(id);
  };
  const handleLeadDeleteClose = () => {
    setIsDelete(false);
  };

  const openModal = (object) => {
    setModalVisible(true);
    setSelectedObj(object);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        isMenuOpen &&
        !menuButtonRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isMenuOpen]);

  const handleChildCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add a useEffect to update selectedIds when the status changes
  useEffect(() => {
    if (selectedIds.includes(object.id) && object.status !== status) {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((selectedId) => selectedId !== object.id)
      );
    }
    if (!selectedIds.includes(object.id) && object.status === status) {
      setSelectedIds([...selectedIds, object.id]);
    }
  }, [object.status, status]);

  const handleDeleteLead = () => {
    if (deleteLeadId) {
      const body = {
        leadIds: [deleteLeadId], // Use the stored ID
      };
      axios
        .delete(MOVELEAD_TO_TRASH, {
          data: body,
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          toast.success("Lead moved to trash successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      onLeadAdded();
      setDeleteLeadId(null); // Reset the stored ID
    }
  };

  return (
    <>
      <div key={object.id} className="user-card2">
        <div className="card-container">
          <div className="card-leftBox">
            <div className="user-details">
              <p className="heading" onClick={() => openModal(object)}>
                {/* <Link to={"/lp/deals/" + object.id}>{object.lead_name}</Link> */}
                {object.lead_name}
              </p>
            </div>
            <div className="lead-value">
            <img className="pound" src={pound} alt="pound"/>{object?.value?.toLocaleString("en-IN")}
            </div>
            <div className="contact-details">
              <div className="mail">
                <img src={user} alt="" />
                <p>{object.ownerf_name + " " + object.ownerl_name}</p>
              </div>
            </div>

            <div className="priorityBox">
              <p
                key={object.label_id}
                className="leads-priority"
                style={{ backgroundColor: object.label_coloure }}
              >
                {object.label_name}
              </p>
            </div>
          </div>
          <div className="DealCard-rightBox">
            <button
              className="user-setting--btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              ref={menuButtonRef}
            >
              <i className="fas fa-ellipsis-h"></i>
              {isMenuOpen && (
                <ul className="cardMenu" ref={menuRef}>
                  <li onClick={() => openConvertModal(object)}>
                    Convert to deal
                  </li>
                  <li onClick={() => handleAssignModal(object.id)}>Assign</li>
                  <li onClick={() => handleLeadDelete(object.id)}>Delete</li>
                </ul>
              )}
            </button>
            <label class="custom-checkbox">
              <input
                type="checkbox"
                className={`cb1 ${object.status}-card-checkbox`}
                name={object.id}
                checked={selectedIds.includes(object.id)}
                onChange={() => handleChildCheckboxChange(object.id)}
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      {modalVisible && (
        <LeadModal
          selectedItem={selectedObj}
          closeModal={closeModal}
          onLeadAdded={onLeadAdded}
        />
      )}
      {isDelete && (
        <LeadDeletePopUp
          onClose={handleLeadDeleteClose}
          onDeleteConfirmed={handleDeleteLead}
        />
      )}
      {convertModalVisible && (
        <CreateDeal
          isOpen={true}
          onClose={closeConvertModal}
          onLeadAdded={onLeadAdded}
          text="deal"
          selectedItem={selectedConvertItem} // Pass the selected item to modal
        />
      )}

      {assign && (
        <AssignModal
          onClose={handleAssignModalClose}
          userData={userData}
          text="Lead"
          handleConfirmed={handleAssignLead}
          handleDataReceived={handleDataReceived}
          dataAdded={onLeadAdded}   
        />
      )}
    </>
  );
};

export default LeadCards;
