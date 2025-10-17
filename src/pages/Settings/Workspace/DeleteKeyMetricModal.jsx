import React from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { deletekeyMetric } from "../../../redux/slices/settingSlice";

function DeleteKeyMetricModal() {
  const closeRef = useRef();
  const dispatch = useDispatch();
  const closeDialog = () => {
    closeRef.current.click();
  };

  return (
    <>
      <div className="modal fade" id="deleteKeyMetricModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h2 style={{ marginBottom: "8px" }}>Delete Key Metric</h2>

              <div className="form-field">Are you sure you want to delete Key Metric?</div>

              <div className="hstack gap-2 d-flex justify-content-end">
                <button type="button" className="btn btn-lg btn-outline-primary" data-bs-dismiss="modal" ref={closeRef}>
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-lg btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteKeyMetricModal"
                  onClick={() => {
                    dispatch(deletekeyMetric({ closeDialog }));
                  }}
                >
                  Delete Key Metric
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteKeyMetricModal;
