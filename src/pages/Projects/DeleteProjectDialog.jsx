import React from "react";
import { useDispatch } from "react-redux";
import { deleteProject } from "../../redux/slices/projectSlice";

function DeleteProjectDialog({ projectToDelete }) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="modal fade" id="deleteProjectDialog" tabIndex={-1} aria-labelledby="deleteProjectDialogLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h2 style={{ marginBottom: "16px" }}>Delete Project</h2>

              <div className="form-field">
                <span>
                  Are you sure you want to delete project? <span className="bold-weight">All the data will be erased.</span>
                </span>
              </div>

              <div className="hstack gap-2 d-flex justify-content-end">
                <button type="button" class="btn btn-lg btn-outline-primary" data-bs-dismiss="modal">
                  Close
                </button>
                <button
                  type="submit"
                  class="btn btn-lg btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteProjectDialog"
                  onClick={() => {
                    dispatch(deleteProject({ projectId: projectToDelete?._id }));
                  }}
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteProjectDialog;
