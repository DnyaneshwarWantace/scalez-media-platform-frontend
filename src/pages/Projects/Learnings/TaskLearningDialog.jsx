import React, { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useRef } from "react";
import {
  getProjectUsers,
  selectProjectUsers,
  selectSelectedIdea,
  selectselectedTest,
  selectUsers,
  testIdea,
  updateTest,
  selectselectedLearning,
  updateLearning,
  updateLearningTasks
} from "../../../redux/slices/projectSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { isTypeOwner, isRoleAdmin, isRoleMember } from "../../../utils/permissions";

function TaskLearningDialog() {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(3);
  const teamMembersDropdown = useRef();
  const [tasksList, settasksList] = useState([]);
  const taskInputRef = useRef();
  const params = useParams();
  const selectedIdea = useSelector(selectSelectedIdea);
  const projectId = params.projectId;
  const ideaId = selectedIdea ? selectedIdea._id : params.ideaId;
  const testId = params.testId;
  const NewProjectSchema = Yup.object().shape({
    dueDate: Yup.string().required("Due date is required"),
  });
  const projectUsers = useSelector(selectProjectUsers);
  console.log('projectUsers :>> ', projectUsers);
  const navigate = useNavigate();
  const closeRef = useRef();
  const selectedTest = useSelector(selectselectedTest);
  const selectedLearning = useSelector(selectselectedLearning);

  const closeDialog = () => {
    closeRef.current.click();
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      dueDate: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(false);
      if (selectedTest) {
        dispatch(updateTest({ values, selectedTeamMembers, tasksList, testId, projectId, navigate, closeDialog }));
      } 
      else if(selectedLearning) {
        const id = !selectedLearning ? projectId : selectedLearning?._id;
         dispatch(
          updateLearningTasks({ ...values, selectedTeamMembers, tasksList, projectId , learningId: id, navigate, closeDialog })
        );
        closeDialog();
    }
    else {
      dispatch(testIdea({ ...values, selectedTeamMembers, tasksList, ideaId, projectId, navigate, closeDialog }));
    }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  const addTeamMember = (teamMember) => {
    console.log("selectedTeamMembers",selectedTeamMembers);
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

  useEffect(() => {
    console.log('selectedLearning2 :>> ', selectedLearning);
    if (selectedLearning) {
      formik.setValues({ dueDate: selectedLearning.dueDate ? new Date(selectedLearning.dueDate).toISOString().substr(0, 10) : "" });
      setselectedTeamMembers(selectedLearning.assignedTo);
      settasksList(selectedLearning.tasks.map((task) => task.name));
    } else {
      formik.setValues({ dueDate: "" });
      setselectedTeamMembers([]);
      settasksList([]);
    }
  }, [selectedLearning]);

  return (
    <>
      {/* Create new Project Dialog */}
      <div>
        {/* Modal */}
        <div
          className="modal fade"
          id="taskLearningModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "24px" }}>
                      <h2>{selectedTest ? "Edit Test" : "Test Idea"}</h2>
                      <p>
                        Looks like you liked the idea, now it’s time to test it.
                        Assign Idea to your teammates
                      </p>
                    </div>
                    {/* Assign to */}
                    <div className="form-field">
                      <label className="form-label">Assign to</label>
                      <div class="dropdown" id="teamMemberSelectDropdown">
                        <div
                          className="border d-flex justify-content-between align-items-center p-2 rounded"
                          // data-bs-toggle="dropdown"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            teamMembersDropdown.current?.classList.toggle(
                              "show"
                            );
                          }}
                        >
                          {selectedTeamMembers.length === 0 && (
                            <p className="m-0">Select team members</p>
                          )}

                          <span>
                            {selectedTeamMembers
                              .slice(0, numberOfTeamMembersToShowInSelect)
                              .map((teamMember) => {
                                return (
                                  <span>
                                    <span>
                                      <img
                                        src={`${backendServerBaseURL}/${teamMember.avatar}`}
                                        className="avatar3"
                                        alt=""
                                        style={{ marginRight: "0.5rem" }}
                                      />
                                    </span>
                                    <span style={{ marginRight: "0.5rem" }}>
                                      {teamMember.firstName}{" "}
                                      {teamMember.lastName}
                                    </span>
                                    <button
                                      type="button"
                                      class="btn-secondary btn-close"
                                      style={{
                                        fontSize: "8px",
                                        marginRight: "12px",
                                      }}
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

                            {selectedTeamMembers.length >
                              numberOfTeamMembersToShowInSelect &&
                              `${
                                selectedTeamMembers.length -
                                numberOfTeamMembersToShowInSelect
                              } Others`}
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

                        <ul
                          className="dropdown-menu w-100"
                          ref={teamMembersDropdown}
                        >
                          <li
                            className="list-group-item list-group-item-action border-bottom d-flex align-items-center p-2 cp"
                            onClick={() => {
                              setselectedTeamMembers(projectUsers);
                            }}
                          >
                            <span
                              className="avatar"
                              style={{ marginRight: "0.5rem" }}
                            >
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
                                <span className="body2 regular-weight">
                                  {projectUsers?.length}
                                </span>
                              </div>
                            </span>
                            <span className="body2 regular-weight">
                              Everyone in your team
                            </span>
                          </li>

                          {projectUsers.map((teamMember) => {
                            return (
                              <li
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addTeamMember(teamMember);
                                }}
                                className={
                                  selectedTeamMembers.includes(teamMember)
                                    ? "d-flex align-items-center list-group-item list-group-item-action cp border-bottom p-2 active"
                                    : "d-flex align-items-center list-group-item list-group-item-action cp border-bottom p-2"
                                }
                              >
                                <span
                                  className="avatar"
                                  style={{ marginRight: "0.5rem" }}
                                >
                                  <img
                                    src={`${backendServerBaseURL}/${teamMember.avatar}`}
                                    width={24}
                                    height={24}
                                  />
                                </span>
                                <span className="body2 regular-weight flex-fill">
                                  {teamMember.firstName} {teamMember.lastName}
                                </span>

                                {selectedTeamMembers.includes(teamMember) && (
                                  <div className="ml-auto">
                                    <button
                                      type="button"
                                      class="btn-secondary btn-close"
                                      style={{
                                        fontSize: "8px",
                                        marginRight: "12px",
                                      }}
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
                    {/* Tasks */}
                    <div className="form-field ">
                      <label className="form-label">Tasks</label>
                      <input
                        type={"text"}
                        ref={taskInputRef}
                        className="form-control form-control-lg"
                        placeholder="Enter Task Here"
                      />
                      <button
                        style={{ marginTop: "0.3rem", marginBottom: "0.5rem" }}
                        className="btn btn-primary"
                        onClick={() => {
                          if (taskInputRef.current.value != "") {
                            tasksList.push(taskInputRef.current.value);
                            taskInputRef.current.value = "";
                          }
                        }}
                      >
                        Add Task
                      </button>

                      <ReactSortable
                        list={tasksList}
                        setList={settasksList}
                        multiDrag
                        animation={150}
                        ghostClass="highlighted-sortable"
                      >
                        {tasksList.map((task) => (
                          <div
                            key={task}
                            className="d-flex border rounded p-2 mb-1"
                          >
                            <i class="bi bi-grip-vertical"></i>
                            <div
                              className="flex-fill"
                              style={{ paddingLeft: "0.5rem" }}
                            >
                              <p className="m-0">{task}</p>
                            </div>
                            <i
                              class="bi bi-trash3-fill"
                              onClick={() => {
                                let tempTaskList = [...tasksList];
                                tempTaskList.splice(tasksList.indexOf(task), 1);
                                settasksList(tempTaskList);
                              }}
                            ></i>
                          </div>
                        ))}
                      </ReactSortable>
                    </div>
                    {/* Due Date */}
                    <div className="form-field">
                      <label className="form-label">Due Date</label>
                      <input
                        type={"date"}
                        {...getFieldProps("dueDate")}
                        className="form-control form-control-lg"
                        placeholder="Set a due date"
                      />
                      <span
                        className="invalid-feedback"
                        style={{
                          display: Boolean(touched.dueDate && errors.dueDate)
                            ? "block"
                            : "none",
                        }}
                      >
                        {errors.dueDate}
                      </span>
                    </div>
                    {/* // TODO: Permission Doubt */}
                    {/* {isTypeOwner() || isRoleMember() || isRoleAdmin() ? ( */}
                      <div className="hstack gap-2 d-flex justify-content-end">
                        <button
                          type="button"
                          class="btn btn-lg btn-outline-danger"
                          data-bs-dismiss="modal"
                          ref={closeRef}
                        >
                          Close
                        </button>
                        <button type="submit" class="btn btn-lg btn-primary">
                          {selectedTest ? "Update Test" : "Assign Test"}
                        </button>
                      </div>
                    {/* ) : ( */}
                      {/* <div></div> */}
                    {/* )} */}
                  </Form>
                </FormikProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskLearningDialog;
