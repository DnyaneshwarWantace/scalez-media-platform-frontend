import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ReactSortable } from "react-sortablejs";
import { Form, FormikProvider } from "formik";
import {
  getProjectUsers,
  selectProjectUsers,
  selectSelectedIdea,
  selectselectedTest,
  testIdea,
  updateTest,
  selectselectedLearning,
  updateselectedTest,
} from "../../../redux/slices/projectSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { GripVertical, Trash2, X, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

function TestIdeaDialog() {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect] = useState(3);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tasksList, settasksList] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const params = useParams();
  const selectedIdea = useSelector(selectSelectedIdea);
  const projectId = params.projectId;
  const ideaId = selectedIdea ? selectedIdea._id : params.ideaId;
  const testId = params.testId;
  const NewProjectSchema = Yup.object().shape({
    dueDate: Yup.string().required("Due date is required"),
  });
  const projectUsers = useSelector(selectProjectUsers);
  const navigate = useNavigate();
  const selectedTest = useSelector(selectselectedTest);
  const selectedLearning = useSelector(selectselectedLearning);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!selectedTest);
  }, [selectedTest]);

  const closeDialog = () => {
    setIsOpen(false);
    dispatch(updateselectedTest(null));
    formik.resetForm();
    setselectedTeamMembers([]);
    settasksList([]);
  };

  const addTeamMember = (teamMember) => {
    if (selectedTeamMembers.includes(teamMember)) {
      removeSelectedTeamMember(teamMember);
    } else {
      setselectedTeamMembers([...selectedTeamMembers, teamMember]);
    }
  };

  const removeSelectedTeamMember = (teamMember) => {
    const index = selectedTeamMembers.indexOf(teamMember);
    let tempSelectedTeamMembers = [...selectedTeamMembers];
    tempSelectedTeamMembers.splice(index, 1);
    setselectedTeamMembers(tempSelectedTeamMembers);
  };

  const formik = useFormik({
    initialValues: {
      dueDate: "",
    },
    validationSchema: NewProjectSchema,
    onSubmit: (values) => {
      if (selectedTest) {
        dispatch(
          updateTest({
            values,
            selectedTeamMembers,
            tasksList,
            testId,
            projectId,
            navigate,
            closeDialog,
          })
        );
      } else {
        dispatch(
          testIdea({
            ...values,
            selectedTeamMembers,
            tasksList,
            ideaId,
            projectId,
            navigate,
            closeDialog,
          })
        );
      }
    },
  });

  const { errors, touched, values, getFieldProps, handleSubmit } = formik;

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectUsers({ projectId }));
    }
  }, []);

  useEffect(() => {
    if (selectedTest) {
      formik.setValues({
        dueDate: selectedTest.dueDate
          ? new Date(selectedTest.dueDate).toISOString().substr(0, 10)
          : "",
      });
      setselectedTeamMembers(selectedTest.assignedTo || []);
      settasksList(selectedTest.tasks ? selectedTest.tasks.map((task) => task.name) : []);
    }
  }, [selectedTest]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) closeDialog();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {selectedTest ? "Edit Test" : "Test Idea"}
          </DialogTitle>
          <DialogDescription>
            Looks like you liked the idea, now it's time to test it. Assign Idea
            to your teammates
          </DialogDescription>
        </DialogHeader>

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Assign to */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2">
                  Assign to
                </Label>
                <div className="relative">
                  <div
                    className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between min-h-[42px]"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {selectedTeamMembers.length === 0 && (
                      <p className="m-0 text-sm text-gray-500">
                        Select team members
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-2 flex-1">
                      {selectedTeamMembers
                        .slice(0, numberOfTeamMembersToShowInSelect)
                        .map((teamMember) => {
                          return (
                            <span
                              key={teamMember._id}
                              className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md text-sm"
                            >
                              <img
                                src={`${backendServerBaseURL}/${teamMember.avatar}`}
                                className="w-6 h-6 rounded-full"
                                alt=""
                              />
                              <span className="text-sm">
                                {teamMember.firstName} {teamMember.lastName}
                              </span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedTeamMember(teamMember);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}

                      {selectedTeamMembers.length >
                        numberOfTeamMembersToShowInSelect && (
                        <span className="text-sm text-gray-600">
                          {`+${
                            selectedTeamMembers.length -
                            numberOfTeamMembersToShowInSelect
                          } Others`}
                        </span>
                      )}
                    </div>

                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>

                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 border border-gray-200 rounded-md shadow-lg bg-white max-h-60 overflow-y-auto">
                      <div
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b"
                        onClick={() => {
                          setselectedTeamMembers(projectUsers);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                          {projectUsers?.length}
                        </div>
                        <span className="text-sm">Everyone in your team</span>
                      </div>

                      {projectUsers.map((teamMember) => {
                        return (
                          <div
                            key={teamMember._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              addTeamMember(teamMember);
                            }}
                            className={`px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-50 ${
                              selectedTeamMembers.includes(teamMember)
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            <img
                              src={`${backendServerBaseURL}/${teamMember.avatar}`}
                              className="w-6 h-6 rounded-full"
                              alt=""
                            />
                            <span className="text-sm flex-1">
                              {teamMember.firstName} {teamMember.lastName}
                            </span>

                            {selectedTeamMembers.includes(teamMember) && (
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedTeamMember(teamMember);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2">
                  Tasks
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter Task Here"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    className="bg-gray-900 text-white hover:bg-gray-800"
                    onClick={() => {
                      if (taskInput.trim() !== "") {
                        settasksList([...tasksList, taskInput]);
                        setTaskInput("");
                      }
                    }}
                  >
                    Add Task
                  </Button>
                </div>

                <ReactSortable
                  list={tasksList.map((task, index) => ({ id: index, name: task }))}
                  setList={(newList) => settasksList(newList.map((item) => item.name))}
                  animation={150}
                  handle=".drag-handle"
                >
                  {tasksList.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border border-gray-200 rounded-md p-3 mb-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move drag-handle" />
                      <div className="flex-1">
                        <p className="m-0 text-sm">{task}</p>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => {
                          let tempTaskList = [...tasksList];
                          tempTaskList.splice(index, 1);
                          settasksList(tempTaskList);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </ReactSortable>
              </div>

              {/* Due Date */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2">
                  Due Date
                </Label>
                <Input
                  type="date"
                  {...getFieldProps("dueDate")}
                  placeholder="Set a due date"
                  required={true}
                />
                {Boolean(touched.dueDate && errors.dueDate) && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                  disabled={!formik.isValid || !formik.dirty}
                >
                  {selectedTest ? "Update Test" : "Assign Test"}
                </Button>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default TestIdeaDialog;
