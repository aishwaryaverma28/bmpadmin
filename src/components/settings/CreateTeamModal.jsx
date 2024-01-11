
import "../styles/LPUserAndTeam.css";

const CreateTeamModal = ({ onCloseTeamModal }) => {
   
  return (
    <div className="teamContainer">
      <div className="teamModal">
        <div className="modalHeading">
          <p>Create Team</p>
          <span className="modal-close" onClick={onCloseTeamModal}>
            X
          </span>
        </div>
        <form  className="createUserForm">
          <div className="inputDiv teamInput">
            <label htmlFor="">team name (required)</label>
            <br />
            <input
              type="text"
              name=""
            
              id=""
            />
          </div>
          <div className="inputDiv teamInput">
            <label htmlFor="">team manager (required)</label>
            <br />
           <select name="" id="" className="team-select-box teamInput">
            <option value=""></option>
           </select>
          </div>
          <div className="inputDiv teamInput">
            <label htmlFor="contact">team description</label>
            <br />
            <input
              type="text"
              name="contact"
            className="team-input-descrition"
              id="contact"
            />
          </div>

          <div>
            <p className="team-member-available">Team Members</p>
            <div className="team-memer-list">
              <ul>
                <li>
                  <div className="team-list-checkbox">
                  <label class="custom-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span class="checkmark"></span>
                      </label>
                      <p className="team-member-name">Anant Singh Chauhan</p>
                  </div>
                </li>
                <li>
                  <div className="team-list-checkbox">
                  <label class="custom-checkbox">
                        <input type="checkbox" className="cb1" />
                        <span class="checkmark"></span>
                      </label>
                      <p className="team-member-name">ameesha kapoor</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
    
  
          <div className="submitBtnBox">
            <button className="userCancelBtn">Cancel</button>
            <input type="submit" className="userSubBtn" value="Create Team"/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
