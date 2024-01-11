import React from "react";
import EditWorkflow from "./EditWorkflow";
import { useState } from "react";

const Automate = () => {
  return (
    <div>
      <div className="edit-workflow-btn">
        <button className="common-save-button">Edit Workflow</button>
      </div>

      <div className="view-workflow">
        <div className="edit-workflow-container">
          <EditWorkflow/>
        </div>
      </div>

    </div>
  );
};

export default Automate;
