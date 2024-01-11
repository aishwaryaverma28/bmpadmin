import React, { useEffect, useState, useRef } from "react";
import "../styles/LPleads.css";
import user from "../../assets/image/user.svg";
import pound from "../../assets/image/british-pound-symbol.svg";
import { Link } from "react-router-dom";
import DealDeletePopUp from "../DeleteComponent";
import axios from "axios";
import { UPDATE_DEAL, MOVEDEAL_TO_TRASH, getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignModal from "../lead/AssignModal.jsx";

const DealsColn = ({
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState(null);
  const [assign, setAssign] = useState(false);
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
        dealId: [assignLeadId], // Use the stored ID
        owner: data,
      };
      axios
      .put(UPDATE_DEAL, body, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          toast.success("Deal reassign successfully", {
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


  const handleDeleteOpen = (id) => {
    setIsDeleteOpen(true);
    setDeleteLeadId(id);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        isMenuOpen &&
        !menuButtonRef?.current?.contains(event?.target) &&
        !menuRef?.current?.contains(event?.target)
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
    if (selectedIds?.includes(id)) {
      setSelectedIds(selectedIds?.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add a useEffect to update selectedIds when the status changes
  useEffect(() => {
    if (selectedIds?.includes(object?.id) && object?.status !== status) {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds?.filter((selectedId) => selectedId !== object?.id)
      );
    }
    if (!selectedIds?.includes(object?.id) && object?.status === status) {
      setSelectedIds([...selectedIds, object?.id]);
    }
  }, [object?.status, status]);

  const handleDeleteLead = () => {
    if (deleteLeadId) {
      const body = {
        dealIds: [deleteLeadId], // Use the stored ID
      };
      axios
        .delete(MOVEDEAL_TO_TRASH, {
          data: body,
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          toast.success("Deal moved to trash successfully", {
            position: "top-center",
            autoClose: 2000,
          });
          onLeadAdded();
          setDeleteLeadId(null); // Reset the stored ID
          handleDeleteClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div key={object.id} className="user-card2">
        <div className="card-container">
          <div className="card-leftBox">
            <div className="user-details">
              <p className="heading">
                <Link to={"/lp/deals/" + object?.id}>{object?.deal_name}</Link>
              </p>
            </div>
            <div className="lead-value">
            <img className="pound" src={pound} alt="pound"/>{object?.value?.toLocaleString("en-IN")}
            </div>
            <div className="contact-details">
              <div className="mail">
                <img src={user} alt="" />
                <p>{object?.ownerf_name + " " + object?.ownerl_name}</p>
              </div>
            </div>
            <div>
              <p className="clouserDate">
                {object?.closure_date?.split("T")[0]}
              </p>
            </div>
            <div className="priorityBox">
              <p
                key={object?.label_id}
                className="leads-priority"
                style={{ backgroundColor: object?.label_coloure }}
              >
                {object?.label_name}
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
                  <li>Convert to Lead</li>
                  <li onClick={() => handleAssignModal(object?.id)}>Assign</li>
                  <li onClick={() => handleDeleteOpen(object?.id)}>Delete</li>
                  {/* <li>object 3</li> */}
                </ul>
              )}
            </button>
            <label class="custom-checkbox">
              <input
                type="checkbox"
                className={`cb1 ${object?.status}-card-checkbox`}
                name={object?.id}
                checked={selectedIds?.includes(object?.id)}
                onChange={() => handleChildCheckboxChange(object?.id)}
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      {isDeleteOpen && (
        <DealDeletePopUp
          onClose={handleDeleteClose}
          onDeleteConfirmed={handleDeleteLead}
        />
      )}

      {assign && (
        <AssignModal
          onClose={handleAssignModalClose}
          userData={userData}
          text="Deal"
          handleConfirmed={handleAssignLead}
          handleDataReceived={handleDataReceived}
          dataAdded={onLeadAdded}   
        />
      )}
    </>
  );
};

export default DealsColn;
