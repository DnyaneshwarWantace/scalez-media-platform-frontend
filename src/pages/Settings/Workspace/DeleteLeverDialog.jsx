import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteGrowthLever, deletekeyMetric } from "../../../redux/slices/settingSlice";

function DeleteLeverDialog() {
  const closeRef = useRef();
  const dispatch = useDispatch();
  const [btnState, setbtnState] = useState(true);
  const closeDialog = () => {
    closeRef.current.click();
  };

  return (
    <>
      <div className="modal fade" id="deleteLeverDialog" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h2 style={{ marginBottom: "8px" }}>Delete Lever</h2>

              <div className="form-field">Are you sure you want to delete this Growth lever? This lever will be removed from all the projects.</div>

              <div className="hstack gap-2 d-flex justify-content-end">
                <button type="button" class="btn btn-lg btn-outline-primary" data-bs-dismiss="modal" ref={closeRef}>
                  Close
                </button>
                <button
                  type="submit"
                  class="btn btn-lg btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteLeverDialog"
                  onClick={() => {
                    dispatch(deleteGrowthLever({ closeDialog }));
                  }}
                >
                  Delete Lever
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteLeverDialog;
