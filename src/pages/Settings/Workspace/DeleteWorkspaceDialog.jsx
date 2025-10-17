import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { deletekeyMetric } from "../../../redux/slices/settingSlice";

function DeleteWorkspaceDialog() {
  const closeRef = useRef();
  const dispatch = useDispatch();
  const [btnState, setbtnState] = useState(true);
  const closeDialog = () => {
    closeRef.current.click();
  };

  return (
    <>
      <div className="modal fade" id="deleteWorkspaceDialog" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h2 style={{ marginBottom: "8px" }}>Delete Workspace</h2>

              <div className="form-field">
                Are you sure you want to delete this workspace? All users & Data will be erased permanently. THIS ACTION CANNOT BE REVERTED!
              </div>

              <div className="form-check mb-3 mt-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue
                  id="flexCheckDefault"
                  onChange={(e) => {
                    setbtnState(!e.target.checked);
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I am sure I want to do this
                </label>
              </div>

              <div className="hstack gap-2 d-flex justify-content-end">
                <button type="button" className="btn btn-lg btn-outline-primary" data-bs-dismiss="modal" ref={closeRef}>
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-lg btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteKeyMetricModal"
                  disabled={btnState}
                  onClick={() => {
                    dispatch(deletekeyMetric({ closeDialog }));
                  }}
                >
                  Yes, Delete This Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteWorkspaceDialog;
