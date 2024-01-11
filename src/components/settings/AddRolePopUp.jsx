import React, { useState } from "react";
import axios from "axios"; // Import Axios library
import { UPDATE_TEAM_MEM,getDecryptedToken } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRolePopUp = ({ onClose, roles, user_id, email, assignRoles, setData }) => {
  const decryptedToken = getDecryptedToken();
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleName, setRoleName] = useState([]);

  const assignArray = assignRoles.map(item => item.toLowerCase());
  const roleNames = roles.map(role => role.name.toLowerCase());

  const filterRoles = roleNames.filter((roleName) => !assignArray.includes(roleName));

  const closePopUp =() => {
    toast.error("Changes are not Saved", {
      position:"top-center",
      autoClose:2000
    });
    onClose();
  }

  const handleAssignRole = () => {
    if (selectedRoleId) {
      // Find the selected role using the role_id
      const selectedRole = roles.find((role) => role.id == selectedRoleId);
      if (selectedRole) {
        // Convert selectedRoleId to integer
        const roleId = parseInt(selectedRoleId);

        // Convert user_id to integer
        const userId = parseInt(user_id);

        // Create a new object with role_id and user_id and add it to selectedRoles
        setSelectedRoles((prevSelectedRoles) => [
          ...prevSelectedRoles,
          { role_id: roleId, user_id: userId },
        ]);

        // Add the selected role name to the roleName state
        setRoleName((prevRoleNames) => [...prevRoleNames, selectedRole.name]);

        // Clear the selected role after adding it
        setSelectedRoleId("");
      }
    }
  };


  const handleSave = () => {
        axios
          .put(UPDATE_TEAM_MEM +user_id , { email:email, roles: selectedRoles }, {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          })
          .then((response) => {
             
            toast.success('Roles saved successfully', {
              position:"top-center",
              autoClose:2000
            });
            setData();
            onClose();
          })
          .catch((error) => {
            console.log(error)
            toast.error('Error saving roles', {
              position:"top-center",
              autoClose:2000
            })
          });
  };
  return (
    <div className="recycle-popup-wrapper">
      <div className="assign-role-popup-container">
        <div className="recycle-popup-box">
          <div className="assign-role-clear">
          <p className="common-fonts assign-role-heading">assign role</p>
          <div className="role-cross-btn" onClick={closePopUp}>&times;</div>
          </div>
          
          <div className="assign-role-dropdown">
            <label htmlFor="" className="common-fonts">
              Search role
            </label>
            <select
  name=""
  id=""
  className="common-input assign-role-select"
  value={selectedRoleId}
  onChange={(e) => setSelectedRoleId(e.target.value)}
>
  <option value="">Select a role</option>

  {  roles
    .filter((role) => filterRoles.includes(role.name.toLowerCase())).map((role) => (
    // Check if the role is not already selected
    !selectedRoles.some((selectedRole) => selectedRole.role_id === role.id) && (
      <option key={role.id} value={role.id}>
        {role.name}
      </option>
    )
  ))}
</select>
          </div>
        </div>
        <div>
          <p className="common-fonts assign-role-result">
            Search result : {roleName.length}
          </p>
            <div className="assign-search-details">
            {roleName.map((item) => (  
              <div className="assign-deal-code">
                <p className="common-fonts assign-name assign-bottom">Name:</p>
                <p className="common-fonts assign-deal-edit">{item}</p>
              </div>
              ))}
               {/* <div className='assign-deal-code'>
                <p className='common-fonts assign-name'>Code</p>
                <p className='common-fonts'>dealedit_admin_job</p>
             </div> */}
             
          </div>          
        </div>

        <div className="recycle-popup-btn add-role-popup-btn">
          {/* <button className="restore-no common-fonts" onClick={onClose}>
            Cancel
          </button> */}
          <button
            onClick={handleAssignRole} // Call the new function on button click
            disabled={selectedRoleId==="" ? true : false}
            className={selectedRoleId==="" ? "common-inactive-button role-save-btn common-fonts": "common-white-button common-fonts"}
          >
            Assign Role
          </button>
          <button disabled={roleName.length===0 ? true : false} className={roleName.length===0 ? "common-inactive-button role-save-btn common-fonts": "common-save-button role-save-btn common-fonts"} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddRolePopUp;
