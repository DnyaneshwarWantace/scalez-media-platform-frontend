import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteGoal, deleteIdea, selectSelectedIdea } from "../../../redux/slices/projectSlice";

function ShareIdeaDialog() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const closeDialogRef = useRef();
  const selectedIdea = useSelector(selectSelectedIdea);

  const closeDialgo = () => {
    closeDialogRef.current.click();
  };

  return (
    <>
      <div>
        <div className="modal fade" id="shareIdeaDialog" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h2 style={{ marginBottom: "16px" }}>Share Idea</h2>

                <div className="form-field">
                  <span>Delete this Idea</span>
                </div>

                <div>
                  <label htmlFor="" className="body2">
                    Private Link
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${window.location.origin}/projects/${projectId}/public/ideas/${selectedIdea?._id}`}
                  />
                  <p className="text-secondary" style={{ fontSize: "12px" }}>
                    Only users added in your workspace can use this link
                  </p>
                </div>

                <div>
                  <label htmlFor="" className="body2">
                    Public Link
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${window.location.origin}/projects/${projectId}/public/ideas/${selectedIdea?._id}`}
                  />
                  <p className="text-secondary" style={{ fontSize: "12px" }}>
                    Anyone with this link can view this card
                  </p>
                </div>

                <div className="hstack gap-2 d-flex justify-content-end">
                  <button type="button" className="btn btn-lg btn-outline-primary" data-bs-dismiss="modal" ref={closeDialogRef}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareIdeaDialog;
