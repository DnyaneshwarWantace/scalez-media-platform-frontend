import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useRef } from "react";
import { requestIdea, selectProjectUsers } from "../../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";

function RequestIdeaDialog() {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(3);
  const teamMembersDropdown = useRef();
  const closeDialogRef = useRef();
  const dispatch = useDispatch();
  const projectUsers = useSelector(selectProjectUsers);
  const closeDialog = () => {
    closeDialogRef.current.click();
  };

  const NewProjectSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
      dispatch(
        requestIdea({
          message: values.message,
          members: selectedTeamMembers,
          closeDialog,
        })
      );
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  const addTeamMember = (teamMember) => {
    console.log(selectedTeamMembers);
    let uniqueItems = [...new Set(selectedTeamMembers.concat([teamMember]))];
    setselectedTeamMembers(uniqueItems);
  };

  const removeSelectedTeamMember = (id) => {
    console.log(id);
    let tempTM = [];
    selectedTeamMembers.map((tm, index) => {
      if (tm != id) {
        tempTM.push(tm);
      }
    });
    console.log(tempTM);
    setselectedTeamMembers(tempTM);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        if (document.getElementById("teamMemberSelectDropdown")?.contains(e.target)) {
          // Clicked in box
        } else {
          teamMembersDropdown.current?.classList?.remove("show");
        }
      } catch (e) {}
    };

    window.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="modal fade" id="requestIdeaModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "24px" }}>
                    <h2>Request ideas from team</h2>
                    <p>
                      Setting a goal is just the first step! Consider requesting ideas from team members to ensure you’re collecting ideas from
                      perspectives across the organization.
                    </p>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Team Members</label>
                    <div className="dropdown" id="teamMemberSelectDropdown">
                      <div
                        className="border d-flex justify-content-between align-items-center p-2 rounded"
                        // data-bs-toggle="dropdown"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          teamMembersDropdown.current?.classList?.toggle("show");
                        }}
                      >
                        {selectedTeamMembers.length === 0 && <p className="m-0">Select team members</p>}

                        <span>
                          {selectedTeamMembers.slice(0, numberOfTeamMembersToShowInSelect).map((teamMember) => {
                            return (
                              <span key={teamMember.id || teamMember._id}>
                                <span>
                                  <img
                                    src={`${backendServerBaseURL}/${teamMember.avatar}`}
                                    className="avatar3"
                                    alt=""
                                    style={{ marginRight: "0.5rem" }}
                                  />
                                </span>
                                <span style={{ marginRight: "0.5rem" }}>
                                  {teamMember.firstName} {teamMember.lastName}
                                </span>
                                <button
                                  type="button"
                                  className="btn-secondary btn-close"
                                  style={{ fontSize: "8px", marginRight: "12px" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeSelectedTeamMember(teamMember);
                                    // teamMembersDropdown.current.classList.add("hide");
                                    // teamMembersDropdown.current.classList.remove("show");
                                  }}
                                ></button>
                              </span>
                            );
                          })}

                          {selectedTeamMembers.length > numberOfTeamMembersToShowInSelect &&
                            `${selectedTeamMembers.length - numberOfTeamMembersToShowInSelect} Others`}
                        </span>

                        <img
                          src="/static/icons/down-arrow.svg"
                          alt=""
                          className="ml-auto"
                          height={"12px"}
                          width={"12px"}
                          style={{ marginRight: "0.5rem" }}
                        />
                      </div>

                      <ul className="dropdown-menu w-100" ref={teamMembersDropdown}>
                        <li
                          onClick={() => {
                            setselectedTeamMembers(projectUsers);
                          }}
                          className="list-group-item list-group-item-action border-bottom d-flex align-items-center p-2 cp"
                        >
                          <span className="avatar" style={{ marginRight: "0.5rem" }}>
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                minWidth: "24px",
                                maxWidth: "24px",
                                minHeight: "24px",
                                maxHeight: "24px",
                                backgroundColor: "var(--bs-gray-300)",
                                borderRadius: "50%",
                                fontSize: "12px",
                              }}
                            >
                              <span className="body2 regular-weight">{projectUsers?.length}</span>
                            </div>
                          </span>
                          <span className="body2 regular-weight">Everyone in your team</span>
                        </li>
                        {projectUsers.map((teamMember) => {
                          return (
                            <li
                              key={teamMember.id || teamMember._id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addTeamMember(teamMember);
                              }}
                              className={
                                selectedTeamMembers.includes(teamMember)
                                  ? "d-flex align-items-center list-group-item list-group-item-action cp p-2 active"
                                  : "d-flex align-items-center list-group-item list-group-item-action cp border-bottom p-2"
                              }
                            >
                              <span className="avatar" style={{ marginRight: "0.5rem" }}>
                                <img src={`${backendServerBaseURL}/${teamMember.avatar}`} width={24} height={24} />
                              </span>
                              <span className="body2 regular-weight flex-fill">
                                {teamMember?.firstName} {teamMember?.lastName}
                              </span>

                              {selectedTeamMembers.includes(teamMember) && (
                                <div className="ml-auto">
                                  <button
                                    type="button"
                                    className="btn-secondary btn-close"
                                    style={{ fontSize: "8px", marginRight: "12px" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeSelectedTeamMember(teamMember);
                                    }}
                                  ></button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Message</label>
                    <textarea
                      rows="4"
                      type={"text"}
                      {...getFieldProps("message")}
                      className="form-control form-control-lg"
                      placeholder="Enter Message here"
                    />
                    <span className="invalid-feedback" style={{ display: Boolean(touched.message && errors.message) ? "block" : "none" }}>
                      {errors.message}
                    </span>
                  </div>

                  <div className="hstack gap-2 d-flex justify-content-end">
                    <button type="button" className="btn btn-lg btn-outline-danger" data-bs-dismiss="modal" ref={closeDialogRef}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-lg btn-primary">
                      Next
                    </button>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestIdeaDialog;
