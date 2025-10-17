import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoles, inviteUser, selectallRoles } from "../../redux/slices/settingSlice";
import { useRef } from "react";
import { useEffect } from "react";
import { isTypeOwner , isRoleAdmin, hasPermission_add_teammates, hasPermission_add_roles } from "../../utils/permissions";

function InviteTeamMemberDialog() {
  const [inviteEmails, setinviteEmails] = useState([]);
  const dispatch = useDispatch();
  const closeDialogRef = useRef();
  const roleRef = useRef();
  const allRoles = useSelector(selectallRoles);
  console.log("allroles",allRoles)

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

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

const filterRoles = allRoles.filter((el)=>{
  return el.name !== "Owner"
})

console.log("filter",filterRoles)


  return (
    <>
      <div
        className="modal fade"
        id="inviteUsers"
        tabIndex={-1}
        aria-labelledby="moveToLearningModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {/* Head */}
              <div style={{ marginBottom: "24px" }}>
                <h2>Invite team members</h2>
                <p>Build your team!</p>
              </div>

              {/* invite emails */}
              <div className="form-field">
                <label className="form-label">Enter emails</label>

                <ReactMultiEmail
                  style={{ minHeight: "10rem" }}
                  placeholder="placeholder"
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
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
                />

                <span>user “,” to seperate</span>
              </div>

              <div className="mb-3">

                {hasPermission_add_roles() ?
                <select className="form-select" ref={roleRef}>
                  {/* {allRoles.map((role) => { */}
                  {/* alue={role._id}>{role.name} */}

                  {/* {isTypeOwner() ? <option value="admin">admin</option> : ""}
                    {isTypeOwner() || isRoleAdmin() ? <option value="member">member</option> : ""}
                    {isTypeOwner() || isRoleAdmin() ?  <option value="viewer">viewer</option> : ""} */}
                  {/* })} */}
                    {/* <option value=""></option> */}
                  { filterRoles.map((el)=><option value={el._id}>{el.name}</option>)
                  }
                </select> : <div></div>
                
              }
              </div>

              {/* {error && <Alert value={error} variant="danger" />} */}

              {/* Action buttons */}
              <div className="d-flex align-items-center">
                <div className="flex-fill"></div>

                <div className="hstack gap-2">
                  <button
                    type="button"
                    className="btn btn-lg btn-outline-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setinviteEmails([]);
                    }}
                    ref={closeDialogRef}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className={"btn btn-lg btn-primary"}
                    onClick={() => {
                      dispatch(
                        inviteUser({
                          emails: inviteEmails,
                          role: roleRef.current.value,
                          closeDialog,
                        })
                      );
                    }}
                  >
                    Send Invites
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

export default InviteTeamMemberDialog;
