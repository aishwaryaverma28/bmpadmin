import React, { useEffect, useState } from "react";
import axios from "axios";
import { UPDATE_AUDIT, GET_AUDIT, getDecryptedToken } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuditTab = () => {
  const decryptedToken = getDecryptedToken();
  const [auditData, setAuditData] = useState([]);

  const getAudit = () => {
    axios
      .get(GET_AUDIT, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setAuditData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAudit();
  }, []);

  const handleSwitchChange = (id, isChecked) => {
    // Update the state of the switch with the given id
    setAuditData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          return { ...item, is_enabled: isChecked ? 1 : 0 };
        }
        return item;
      })
    );
    axios
      .put(
        UPDATE_AUDIT + id,
        {
          is_enabled: isChecked ? 1 : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Update success:", response.data);
        toast.success("Switch state updated", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log("Update error:", error);
        toast.error("Failed to update switch state", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  
  return (
    <div className="audit-table">
      <table>
        <thead>
          <tr>
            <th className="common-fonts">NAME</th>
            <th className="common-fonts">FEATURE</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map((item) =>
            item.display_name !== "password_policy" ? (
              <tr key={item.id}>
                <td className="common-fonts">{item.display_name}</td>
                <td>
                  <div>
                    <label className="password-switch">
                      <input
                        type="checkbox"
                        checked={item.is_enabled === 1}
                        onChange={(e) =>
                          handleSwitchChange(item.id, e.target.checked)
                        }
                      />
                      <span className="password-slider password-round"></span>
                    </label>
                  </div>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AuditTab;
