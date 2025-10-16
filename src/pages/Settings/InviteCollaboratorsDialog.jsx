import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { useState } from "react";
import { inviteProjectCollaborators } from "../../redux/slices/projectSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import Alert from "../../components/common/Alert";

function InviteCollaboratorsDialog() {
  const [inviteEmails, setinviteEmails] = useState([]);
  const params = useParams();
  const projectId = params.projectId;
  console.log('projectId :>> ', projectId);
  const dispatch = useDispatch();
  const closeDialogRef = useRef();
  const [error, seterror] = useState(null);
  const closeDialog = () => {
    closeDialogRef.current.click();
  };

  const isEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <>
      <div className="modal fade" id="inviteCollaborators" tabIndex={-1} aria-labelledby="moveToLearningModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {/* Head */}
              <div style={{ marginBottom: "24px" }}>
                <h2>Invite Collaborators</h2>
                <p>Collaborators will have view & comment only access</p>
              </div>

              {/* invite emails */}
              <div className="form-field">
                <label className="form-label">Enter emails</label>

                <ReactMultiEmail
                  style={{ minHeight: "10rem" }}
                  placeholder=""
                  emails={inviteEmails}
                  onChange={(_emails) => {
                    console.log(_emails);
                    setinviteEmails(_emails);
                  }}
                  validateEmail={(email) => {
                    return isEmail(email); // return boolean
                  }}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        <span data-tag-handle onClick={() => removeEmail(index)}>
                          ×
                        </span>
                      </div>
                    );
                  }}
                />

                <span>user “,” to seperate</span>
              </div>

              {/* Errors from server */}
              {error && <Alert value={error} variant="danger" />}

              {/* Action buttons */}
              <div className="d-flex align-items-center">
                <div className="flex-fill"></div>

                <div className="hstack gap-2">
                  <button
                    type="button"
                    class="btn btn-lg btn-outline-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setinviteEmails([]);
                    }}
                    ref={closeDialogRef}
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      console.log(inviteEmails);
                      dispatch(
                        inviteProjectCollaborators({
                          emails: inviteEmails,
                          projectId,
                          closeDialog,
                          seterror,
                        })
                      );
                    }}
                    type="submit"
                    class={"btn btn-lg btn-primary"}
                  >
                    Invite Collaborator
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

export default InviteCollaboratorsDialog;
