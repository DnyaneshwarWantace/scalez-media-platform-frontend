import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Field, FieldArray } from "formik";
import { Form, FormikProvider } from "formik";
import { useParams } from "react-router-dom";
import { createGoal, selectProjectUsers, selectSelectedGoal, updateGoal, selectSingleGoalInfo,
} from "../../../redux/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectkeyMetrics } from "../../../redux/slices/settingSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatDate3 } from "../../../utils/formatTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { createPortal } from "react-dom";

function CreateNewGoalDialog({ openRequestIdeaDialog, selectedTab, open, onOpenChange }) {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(4);
  const teamMembersDropdown = useRef();
  const teamMembersTriggerRef = useRef();
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedMenu, setselectedMenu] = useState(selectedTab);
  const params = useParams();
  const projectId = params.projectId;
  const goalId = params.goalId;
  const dispatch = useDispatch();
  const projectUsers = useSelector(selectProjectUsers);
  const allKeyMetrics = useSelector(selectkeyMetrics);
  const selectedGoal = useSelector(selectSelectedGoal);
  const [isSubmitting, setisSubmitting] = useState(false);
// console.log('allKeyMetrics :>> ', allKeyMetrics);
  const closeModal = () => {
    onOpenChange(false);
  };
  const singleGoalInfo = useSelector(selectSingleGoalInfo);
console.log('singleGoalInfo 333 ====:>> ', singleGoalInfo);
  let singleGoalMetricsData = singleGoalInfo?.keymetric.map(x => x.metrics);


  const ProjectsMenus = [
    {
      name: "About Goal",
    },
    {
      name: "Assign Members",
    },
    {
      name: "Key Metrics",
    },
    {
      name: "Confidence",
    },
  ];

  const RightProjectsMenus = [];

  const aboutGoalFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Goal Name is required"),
      description: Yup.string().required("Goal description is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().required("End Date is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(aboutGoalFormik.values);
      setSubmitting(false);
    },
  });

  const keyMetricsFormik = useFormik({
    initialValues: {
      keyMetrics: [],
    },
    validationSchema: Yup.object().shape({
      keyMetrics: Yup.array().of(
        Yup.object().shape({
          keyMetric: Yup.string().required(),
          startValue: Yup.number().required(),
          targetValue: Yup.number().required(),
        })
      ),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(aboutGoalFormik.values);
      setSubmitting(false);
    },
  });


  console.log('keyMetricsFormik.values :>> ', keyMetricsFormik.values);


  const confidenceFormik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      confidence: Yup.string().required("Confidence is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(aboutGoalFormik.values);
      setSubmitting(false);
    },
  });

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
          setIsTeamDropdownOpen(false);
        }
      } catch (err) {}
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);


  const reset = () => {
    setselectedMenu("About Goal");
    aboutGoalFormik.resetForm();
    keyMetricsFormik.resetForm();
    confidenceFormik.resetForm();
    setselectedTeamMembers([]);
  };

  const onChangeKeymetric = (e) => {
console.log('e.target.value :>> ', e.target.value);
  }

  const submitNewGoalForm = async () => {
    // console.log(aboutGoalFormik.values);
    // console.log(selectedTeamMembers);
    // console.log("keyMetricsFormik.values", keyMetricsFormik.values);
    // console.log("Check",aboutGoalFormik.values,
    //   keyMetricsFormik.values,
    //   confidenceFormik.values,
    //   selectedTeamMembers,
    //   projectId,
    //   closeModal,
    //   reset,
    //   openRequestIdeaDialog,
    //   goalId,);

      // console.log('...keyMetricsFormik.values, :>> ', keyMetricsFormik.values,);
      // console.log('...singleGoalInfo.keyMetric :>> ', singleGoalInfo.keymetric);
    if (selectedGoal) {
      await dispatch(
        updateGoal({
          ...aboutGoalFormik.values,
          ...keyMetricsFormik.values,
           ...confidenceFormik.values,
          members: selectedTeamMembers,
          projectId,
          closeModal,
          reset,
          openRequestIdeaDialog,
          goalId,
        })
      );
    } else {
      await dispatch(
        createGoal({
          ...aboutGoalFormik.values,
          ...keyMetricsFormik.values,
          ...confidenceFormik.values,
          members: selectedTeamMembers,
          projectId,
          closeModal,
          reset,
          openRequestIdeaDialog,
        })
      );
    }
  };

  const resetAllFields = () => {
    aboutGoalFormik.resetForm();
    setselectedTeamMembers([]);
    keyMetricsFormik.resetForm();
    confidenceFormik.resetForm();
  };

  useEffect(() => {
    console.log(selectedGoal);
    if (selectedGoal) {
      aboutGoalFormik.setValues({
        name: selectedGoal.name,
        description: selectedGoal.description,
        startDate: selectedGoal.startDate,
        endDate: selectedGoal.endDate,
      });

      setselectedTeamMembers(selectedGoal.members);
      confidenceFormik.setValues({
        confidence: selectedGoal.confidence,
      });
      keyMetricsFormik.setValues({
        keyMetrics: selectedGoal.keymetric?.map((keymetric) => {
          return {
            keyMetric: keymetric.name,
            startValue: keymetric.startValue,
            targetValue: keymetric.targetValue,
            metrics: keymetric.metrics
          };
        }),
      });
    } else {
      aboutGoalFormik.setValues({
        name: "",
        description: "",
        startDate: new Date(),
        endDate: "",
      });

      setselectedTeamMembers([]);
      confidenceFormik.setValues({
        confidence: "",
      });
      keyMetricsFormik.setValues({
        keyMetrics: [],
      });
    }
  }, [selectedGoal]);

  useEffect(() => {
    setselectedMenu(selectedTab);
  }, [selectedTab]);
  

  useEffect(()=> {
    if(singleGoalInfo?.keymetric?.metrics){
      alert("hereeeee");
      keyMetricsFormik.setValues(singleGoalMetricsData);
      console.log('keyMetricsFormik.setValues', keyMetricsFormik.setValues(singleGoalInfo?.keymetric?.metrics)
      );
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-semibold">{singleGoalInfo ? "Edit" : "Create New"} Goal</DialogTitle>
        </DialogHeader>

        {/* Tabs Navigation */}
        <div className="border-b">
          <div className="flex items-center gap-1">
            {ProjectsMenus.map((menu) => (
              <button
                key={menu.name}
                className={`px-6 py-3 text-sm font-medium transition-all relative rounded-t-md ${
                  selectedMenu === menu.name
                    ? "text-black bg-gray-50"
                    : "text-gray-600 hover:text-black hover:bg-gray-50/50"
                }`}
                onClick={() => {
                  setselectedMenu(menu.name);
                }}
              >
                {menu.name}
                {selectedMenu === menu.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-1">

                {/* About Goal STEP */}
                <FormikProvider value={aboutGoalFormik}>
                  <Form autoComplete="off" noValidate onSubmit={aboutGoalFormik.handleSubmit}>
                    {selectedMenu === "About Goal" && (
                      <div className="space-y-6">
                        {/* Goal Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Goal Name</label>
                          <input
                            type={"text"}
                            {...aboutGoalFormik.getFieldProps("name")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter Goal Name"
                          />
                          {aboutGoalFormik.touched.name && aboutGoalFormik.errors.name && (
                            <span className="text-sm text-red-600">
                              {aboutGoalFormik.errors.name}
                            </span>
                          )}
                        </div>

                        {/* Goal Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            rows="4"
                            type={"text"}
                            {...aboutGoalFormik.getFieldProps("description")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter Description"
                          />
                          {aboutGoalFormik.touched.description && aboutGoalFormik.errors.description && (
                            <span className="text-sm text-red-600">
                              {aboutGoalFormik.errors.description}
                            </span>
                          )}
                        </div>

                        {/* Start and End Date */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Start Date */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <input
                              type={"date"}
                              {...aboutGoalFormik.getFieldProps("startDate")}
                              value={aboutGoalFormik.values.startDate && new Date(aboutGoalFormik.values.startDate).toISOString().substr(0, 10)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Enter Start Date"
                            />
                            {aboutGoalFormik.touched.startDate && aboutGoalFormik.errors.startDate && (
                              <span className="text-sm text-red-600">
                                {aboutGoalFormik.errors.startDate}
                              </span>
                            )}
                          </div>

                          {/* End Date */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <input
                              disabled={!aboutGoalFormik.values.startDate || aboutGoalFormik.values.startDate == ""}
                              min={aboutGoalFormik.values.startDate}
                              type={"date"}
                              {...aboutGoalFormik.getFieldProps("endDate")}
                              value={aboutGoalFormik.values.endDate && new Date(aboutGoalFormik.values.endDate).toISOString().substr(0, 10)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="Enter End Date"
                            />
                            {aboutGoalFormik.touched.endDate && aboutGoalFormik.errors.endDate && (
                              <span className="text-sm text-red-600">
                                {aboutGoalFormik.errors.endDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                              closeModal();
                            }}
                          >
                            Close
                          </Button>
                          {selectedGoal ? (
                            <Button
                              type="button"
                              size="lg"
                              onClick={() => {
                                submitNewGoalForm();
                              }}
                            >
                              Update Goal
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="lg"
                              disabled={!aboutGoalFormik.isValid || !aboutGoalFormik.dirty}
                              onClick={() => {
                                setselectedMenu("Assign Members");
                              }}
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Form>
                </FormikProvider>

                {/* Assign Members STEP */}
                {selectedMenu === "Assign Members" && (
                  <div className="space-y-6">
                    {/* Team Members */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assign To</label>
                      <div className="relative" id="teamMemberSelectDropdown">
                        <div
                          ref={teamMembersTriggerRef}
                          className="border flex justify-between items-center p-2 rounded cursor-pointer"
                          style={{ backgroundColor: isTeamDropdownOpen ? '#f0f0f0' : 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (teamMembersTriggerRef.current) {
                              const rect = teamMembersTriggerRef.current.getBoundingClientRect();
                              setDropdownPosition({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX,
                                width: rect.width
                              });
                            }
                            setIsTeamDropdownOpen(!isTeamDropdownOpen);
                          }}
                        >
                          {selectedTeamMembers.length === 0 && <p className="text-sm text-gray-500">Select team members</p>}

                          <span>
                            {selectedTeamMembers.slice(0, numberOfTeamMembersToShowInSelect).map((teamMember) => {
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
                                    {teamMember.firstName} {teamMember.lastName}
                                  </span>
                                  <button
                                    type="button"
                                    className="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      removeSelectedTeamMember(teamMember);
                                    }}
                                  >
                                    ×
                                  </button>
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

                        {isTeamDropdownOpen && createPortal(
                          <ul
                            ref={teamMembersDropdown}
                            style={{
                              maxHeight: '300px',
                              overflowY: 'auto',
                              position: 'fixed',
                              zIndex: 999999,
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                              marginTop: '4px',
                              padding: '0.5rem 0',
                              listStyle: 'none',
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              width: `${dropdownPosition.width}px`
                            }}
                          >
                          <li
                            onClick={() => {
                              setselectedTeamMembers(projectUsers);
                            }}
                            className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-50"
                          >
                            <span className="avatar" style={{ marginRight: "0.5rem" }}>
                              <div
                                className="flex items-center justify-center"
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addTeamMember(teamMember);
                                }}
                                className={
                                  selectedTeamMembers.includes(teamMember)
                                    ? "flex items-center p-2 cursor-pointer bg-gray-100"
                                    : "flex items-center p-2 border-b cursor-pointer hover:bg-gray-50"
                                }
                              >
                                <span className="avatar" style={{ marginRight: "0.5rem" }}>
                                  <img src={`${backendServerBaseURL}/${teamMember.avatar}`} width={24} height={24} />
                                </span>
                                <span className="text-sm font-normal flex-1">
                                  {teamMember?.firstName} {teamMember?.lastName}
                                </span>

                                {selectedTeamMembers.includes(teamMember) && (
                                  <div className="ml-auto">
                                    <button
                                      type="button"
                                      className="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeSelectedTeamMember(teamMember);
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>,
                        document.body
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center mt-6 pt-4 border-t">
                      <div className="flex-1">
                        <p
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => {
                            setselectedTeamMembers([]);
                            setselectedMenu("Key Metrics");
                          }}
                        >
                          Skip For Now
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            closeModal();
                          }}
                        >
                          Close
                        </Button>

                        {selectedGoal ? (
                          <Button
                            type="button"
                            size="lg"
                            onClick={() => {
                              submitNewGoalForm();
                            }}
                          >
                            Update Goal
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="lg"
                            disabled={selectedTeamMembers.length === 0}
                            onClick={() => {
                              setselectedMenu("Key Metrics");
                            }}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Metrics STEP */}
                <FormikProvider value={keyMetricsFormik}>
                  <Form autoComplete="off" noValidate onSubmit={keyMetricsFormik.handleSubmit}>
                    {selectedMenu === "Key Metrics" && (
                      <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          <div className="mb-4">
                            <FieldArray
                              name="keyMetrics"
                              {...keyMetricsFormik.getFieldProps("keyMetrics")}
                              render={(arrayHelpers) => (
                                <div>
                                  {keyMetricsFormik.values.keyMetrics?.map((option, index) => (
                                    <div key={index} className="mb-4">
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Key Metrics</label>

                                          <Select
                                            value={keyMetricsFormik.values.keyMetrics[index]?.keyMetric || ""}
                                            onValueChange={(value) => {
                                              keyMetricsFormik.setFieldValue(`keyMetrics.${index}.keyMetric`, value)
                                              if (value === ""){
                                                keyMetricsFormik.setFieldValue(`keyMetrics.${index}.startValue`, "")
                                                keyMetricsFormik.setFieldValue(`keyMetrics.${index}.targetValue`, "")
                                              }
                                            }}
                                            modal={false}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select a Key Metric" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[99999]">
                                              {allKeyMetrics.map((keyMetric, idx) => (
                                                <React.Fragment key={keyMetric.name}>
                                                  <SelectItem value={keyMetric.name}>
                                                    {keyMetric.name}
                                                  </SelectItem>
                                                  {idx < allKeyMetrics.length - 1 && (
                                                    <div className="border-b border-gray-200 mx-2" />
                                                  )}
                                                </React.Fragment>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          <span
                                            className="invalid-feedback"
                                            style={{
                                              display:
                                                Object.keys(keyMetricsFormik.errors).includes("keyMetrics") &&
                                                keyMetricsFormik.errors[`keyMetrics`]?.length != 0 &&
                                                keyMetricsFormik.errors[`keyMetrics`][index]?.keyMetric
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            Key Metric is required
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label className="text-sm font-medium">Start Value</label>
                                            <Field
                                              placeholder={`startValue`}
                                              name={`keyMetrics.${index}.startValue`}
                                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            />
                                            {Object.keys(keyMetricsFormik.errors).includes("keyMetrics") &&
                                              keyMetricsFormik.errors[`keyMetrics`]?.length != 0 &&
                                              keyMetricsFormik.errors[`keyMetrics`][index]?.startValue && (
                                              <span className="text-sm text-red-600">
                                                Start Value is required
                                              </span>
                                            )}
                                          </div>

                                          <div className="space-y-2">
                                            <label className="text-sm font-medium">Target Value</label>
                                            <Field
                                              placeholder={`targetValue`}
                                              name={`keyMetrics.${index}.targetValue`}
                                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            />
                                            {Object.keys(keyMetricsFormik.errors).includes("keyMetrics") &&
                                              keyMetricsFormik.errors[`keyMetrics`]?.length != 0 &&
                                              keyMetricsFormik.errors[`keyMetrics`][index]?.targetValue && (
                                              <span className="text-sm text-red-600">
                                                Target Value is required
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        {/* <div className="col-2">
                                        <button className="btn btn-primary" onClick={() => arrayHelpers.remove(index)}>
                                          Remove
                                        </button>
                                      </div> */}
                                      </div>

                                      <hr style={{ marginTop: "2rem" }} />
                                    </div>
                                  ))}

                                  {/* Add New Key Metric */}
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Add Key Metric</label>
                                    <Select
                                      onValueChange={(value) => {
                                        if (value !== "") {
                                          arrayHelpers.push({ keyMetric: allKeyMetrics.filter((k) => k._id == value)[0].name });
                                        }
                                      }}
                                      modal={false}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Key Metric" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {allKeyMetrics.map((keyMetric, idx) => (
                                          <React.Fragment key={keyMetric._id}>
                                            <SelectItem value={keyMetric._id}>
                                              {keyMetric.name}
                                            </SelectItem>
                                            {idx < allKeyMetrics.length - 1 && (
                                              <div className="border-b border-gray-200 mx-2" />
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center mt-6 pt-4 border-t">
                          <div className="flex-1">
                            <p
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => {
                                keyMetricsFormik.setFieldValue("keyMetrics", []);
                                setselectedMenu("Confidence");
                              }}
                            >
                              Skip For Now
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={() => {
                                closeModal();
                              }}
                            >
                              Close
                            </Button>

                            {selectedGoal ? (
                              <Button
                                type="button"
                                size="lg"
                                onClick={() => {
                                  submitNewGoalForm();
                                }}
                              >
                                Update Goal
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="lg"
                                disabled={!keyMetricsFormik.isValid || keyMetricsFormik.values.keyMetrics.length === 0}
                                onClick={() => {
                                  setselectedMenu("Confidence");
                                }}
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Form>
                </FormikProvider>

                {/* Confidence STEP */}
                <FormikProvider value={confidenceFormik}>
                  <Form autoComplete="off" noValidate onSubmit={confidenceFormik.handleSubmit}>
                    {selectedMenu === "Confidence" && (
                      <>
                        {/* Confidence */}
                        <label className="text-sm font-medium">Confidence</label>
                        <Select
                          value={confidenceFormik.values.confidence || ""}
                          onValueChange={(value) => {
                            confidenceFormik.setFieldValue("confidence", value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="How confident are you about this goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Very Confident">Very Confident</SelectItem>
                            <SelectItem value="Confident">Confident</SelectItem>
                            <SelectItem value="Realistic">Realistic</SelectItem>
                            <SelectItem value="Achievable">Achievable</SelectItem>
                            <SelectItem value="Ambitious">Ambitious</SelectItem>
                            <SelectItem value="Unsure">Unsure</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Action Buttons */}
                        <div className="flex items-center mt-6 pt-4 border-t">
                          <div className="flex-1">
                            <p
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => {
                                confidenceFormik.setFieldValue("confidence", "");
                                submitNewGoalForm();
                              }}
                            >
                              Skip For Now
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={() => {
                                closeModal();
                              }}
                            >
                              Close
                            </Button>

                            {selectedGoal ? (
                              <Button
                                type="button"
                                size="lg"
                                disabled={isSubmitting}
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                              >
                                {isSubmitting ? "Updating..." : "Update Goal"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="lg"
                                disabled={!confidenceFormik.isValid || !confidenceFormik.dirty || isSubmitting}
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                              >
                                {isSubmitting ? "Creating..." : "Create Goal"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </Form>
                </FormikProvider>
        </div>
        {/* Scrollable Content End */}
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewGoalDialog;
