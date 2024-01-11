import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Password.css";
import LockImage from "../../assets/image/lock.svg";
import { getDecryptedToken, GET_PASSWORD, EDIT_PASSWORD, GET_ORG_DATA } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CPPasswordPolicy = () => {
  const decryptedToken = getDecryptedToken();
  const [toggleChecked, setToggleChecked] = useState(false);
  const [passDes, setPassDes] = useState([]);
  const [initial,setInitial]= useState([]);
  const [stateBtn, setStateBtn] = useState(0);
  const [checkboxStates, setCheckboxStates] = useState([]);
  const orgId = localStorage.getItem("org_id");
  const email = localStorage.getItem("email");
  const passGet = () => {

      axios
      .get(GET_PASSWORD + (orgId ? `/${orgId}` : `/${email}`) + (orgId ? "/true" : "/false"), {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setPassDes(response?.data?.data);
        setInitial(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
      


  };
  useEffect(() => {
    passGet();
  }, []);

  useEffect(() => {
    setCheckboxStates(
      passDes?.map((condition) => ({
        id: condition?.id,
        active: condition?.active, // Default value
        value: condition?.value, // Default value
        term: condition.term,
      }))
    );
  }, [passDes]);
console.log(checkboxStates);
  const toggleActive =
    passDes?.find((condition) => condition?.term === "is_enabled")?.active === 1;

  // Update the toggleChecked state based on the toggleActive value
  useEffect(() => {
    setToggleChecked(toggleActive);
  }, [toggleActive]);

  const handleToggleChange = () => {
    setToggleChecked((prevToggleChecked) => {
      // Update the active value for id=5 when turning the switch on
      if (!prevToggleChecked) {
        const index = checkboxStates?.findIndex((state) => state?.term === "is_enabled");
        console.log(index)
        if (index !== -1) {
          const newState = [...checkboxStates];
          newState[index] = {
            ...newState[index],
            active: 1,
          };
          setCheckboxStates(newState);
        }
        setStateBtn(1);
      }
       else {
      const newState = checkboxStates?.map(state => ({
        ...state,
        active: 0,
        value: 0 // Set value to 0, adjust as needed
      }));
      setCheckboxStates(newState);
      setStateBtn(1);
    }
    return !prevToggleChecked;
  });
};

  const handleCheckboxChange = (id, value) => {
    // Find the index of the checkboxStates array where id matches
    const index = checkboxStates?.findIndex((state) => state?.id === id);

    // Only update if the toggle button is enabled
    if (toggleChecked) {
      // Update the checkboxStates array based on the checkbox that was changed
      setCheckboxStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = {
          ...newState[index],
          active: newState[index]?.active === 1 ? 0 : 1, // Toggle active value
          value: value,
        };
        setStateBtn(1);
        console.log(newState);
        return newState;
      });
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
  
    // Compare checkboxStates with initial to find changed objects
    const changedStates = checkboxStates?.filter(state => {
      const initialState = initial?.find(initialState => initialState?.id === state?.id);
      return (
        initialState &&
        (initialState?.active !== state?.active || initialState?.value !== state?.value)
      );
    });
      console.log("Changed states:", changedStates);
    axios
      .put(
        EDIT_PASSWORD+"/"+orgId,
        { data: changedStates },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        // Handle success if needed
        console.log("Update success:", response.data);
        toast.success("Password policy changed", {
          position: "top-center",
          autoClose:2000
        });
      })
      .catch((error) => {
        console.log("Update error:", error);
      });
  }

  const passwordRefresh = () => {
    passGet();
  }
  
  return (
    <section>
      <div className="password-toggle">
        <div className="password-lock">
          <img src={LockImage} alt="" />
          <div>
            <p className="common-fonts password-policy">Password Policy</p>
            <p className="common-fonts password-guideline">
              Password Policy guidelines will be applied to enhance the
              security.{" "}
            </p>
          </div>
        </div>
        <div>
          <label className="password-switch">
            <input
              type="checkbox"
              checked={toggleChecked}
              onChange={handleToggleChange}
            />
            <span className="password-slider password-round"></span>
          </label>
        </div>
      </div>
      <div className="password-refresh">
      <p className="common-fonts password-heading">password policy</p>
      <button type="button" className="helpBtn genral-refresh-icon label-refresh-icon" title="Refresh" onClick={passwordRefresh}>
              <i class="fa-sharp fa-solid fa-rotate "></i>
              </button>
      </div>
      {/* Mapping over the passDes array to render the checkboxes and input fields */}
      {passDes?.map(
        (condition, index) =>
          condition.term !== "is_enabled" && (
            <div className="password-rules" key={condition.id}>
              <div>
                <label className="custom-checkbox password-checkbox">
                  <input
                    type="checkbox"
                    className="cb1"
                    checked={checkboxStates[index]?.active === 1}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleCheckboxChange(
                        condition.id,
                        checked
                          ? parseInt(checkboxStates[index]?.value) || 0
                          : 0
                      );
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div>
                <p className="common-fonts password-text">
                  {condition.description}
                </p>
                <input
                  type="number" max='10'
                  className="common-input password-input"
                  name=""
                  value={checkboxStates[index]?.value || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCheckboxStates((prevStates) =>
                      prevStates?.map((state, i) =>
                        i === index ? { ...state, value: newValue } : state
                      )
                    );
                    setStateBtn(1);
                  }}
                  disabled={checkboxStates[index]?.active !== 1}
                />
              </div>
            </div>
          )
      )}

      <div className="password-authentication">
        <p className="password-two-factor password-fonts">
          Two-factor authentication
        </p>
        <div>
          <label className="password-switch">
            <input type="checkbox" />
            <span className="password-slider password-round"></span>
          </label>
        </div>
      </div>

      <div>
        <p className="password-bottom password-fonts">
          Protect your account ankitaschauhan96@gmail.com with two-factor
          authentication via email. Once enabled, then the next time you log in,
          you are asked to click the verification link in an email to access
          your account. You only need to verify yourself every 30 days on each
          device.
        </p>
      </div>

      <div className="password-bottom-btn">
        <button className="common-white-button">cancel</button>
        {stateBtn === 0 ? (
          <button className="disabledBtn" disabled>
            Save
          </button>
        ) : (
          <button
            className="common-save-button permission-save-btn"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default CPPasswordPolicy;
