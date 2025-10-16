import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Field, FieldArray } from "formik";
import { Form, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createIdea, getAllGoals, selectGoals, selectSelectedIdea, updateIdea, updateIdeaInTest, readSingleIdea } from "../../../redux/slices/projectSlice";
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAllGrowthLevers, getAllkeyMetrics, selectallGrowthLevers, selectkeyMetrics } from "../../../redux/slices/settingSlice";
import LoadingButton from "../../../components/common/LoadingButton";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";

function CreateNewIdea({ selectedGoal }) {
  const [selectedTeamMembers, setselectedTeamMembers] = useState([]);
  const [numberOfTeamMembersToShowInSelect, setnumberOfTeamMembersToShowInSelect] = useState(4);
  const teamMembersDropdown = useRef();
  const [selectedMenu, setselectedMenu] = useState("About Your Idea");
  const [mediaDocuments, setmediaDocuments] = useState([]);
  const dispatch = useDispatch();
  const mediaAndDocRef = useRef();
  const params = useParams();
  const projectId = params.projectId;
  const testId = params.testId;
  const ideaId = params.ideaId;
  const goals = useSelector(selectGoals);
  console.log('goals# :>> ', goals);
  const allGrowthLevers = useSelector(selectallGrowthLevers);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };
  const closeRef = useRef();
  const closeRef2 = useRef();
  const allKeyMetrics = useSelector(selectkeyMetrics);
  const selectedIdea = useSelector(selectSelectedIdea);
  console.log('selectedIdea :>> ', selectedIdea);
  const [mediaActionsOverlay, setmediaActionsOverlay] = useState(null);
  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];
  const [isSubmitting, setisSubmitting] = useState(false);

  const ProjectsMenus = [
    {
      name: "About Your Idea",
    },
    {
      name: "I.C.E Score",
    },
  ];

  const RightProjectsMenus = [];
  const location = useLocation();

  const closeDialog = () => {
    closeRef.current.click();
    closeRef2.current.click();
  };

  const aboutGoalFormik = useFormik({
    initialValues: {
      name: "",
      goal: "",
      keyMetric: "",
      lever: "",
      description: "",
      files: []
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      goal: Yup.string().required("Goal is required"),
      keyMetric: Yup.string().required("Key Metric is required"),
      lever: Yup.string().required("Growth lever is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {

      console.log("aboutGoalFormik.values",aboutGoalFormik.values);
      setSubmitting(false);
    },
  });

  // 
  const confidenceFormik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      confidence: Yup.number().required("Confidence is required"),
      ease: Yup.number().min(1).max(10).required("Ease is required"),
      impact: Yup.number().min(1).max(10).required("Impact is required"),
      score: Yup.number().required("Score is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(aboutGoalFormik.values);
      setSubmitting(false);
    },
  });

  const submitNewGoalForm = async () => {
    console.log("aboutGoalFormik.values", aboutGoalFormik.values);
    console.log(confidenceFormik.values);
    if (selectedIdea) {
      if (testId) {
        await dispatch(
          updateIdeaInTest({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, projectId, closeDialog, testId })
        );
      } else {
        const id = !selectedIdea ? ideaId : selectedIdea?._id;

        await dispatch(
          updateIdea({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, deletedMedia , projectId, closeDialog, ideaId: id, setmediaDocuments })
        );
        console.log('goals.filter1',  goals.filter((g) => g._id === selectedIdea.goal._id).map((goal) => {goal.keymetric.filter((keymetric) => keymetric._id === selectedIdea.keymetric)}));
     
        // console.log('g.filter :>> ', goals.filter((g) => g._id === aboutGoalFormik.values.goal));

      }
    } else {
      await dispatch(createIdea({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, projectId, closeDialog }));
      console.log("aboutGoalFormik.values",aboutGoalFormik.values);

    }
  };

  const resetAllFields = () => {
    aboutGoalFormik.resetForm();
    setselectedTeamMembers([]);
    confidenceFormik.resetForm();
  };

  function isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];

    return file && acceptedImageTypes.includes(file["type"]);
  }

  useEffect(() => {
    dispatch(getAllGoals({ projectId }));
    dispatch(getAllkeyMetrics());
    dispatch(getAllGrowthLevers());
    dispatch(readSingleIdea());
  }, []);

  useEffect(() => {
    if (selectedIdea) {
      aboutGoalFormik.setValues({
        name: selectedIdea.name,
        goal: selectedIdea.goal?._id,
        keyMetric: selectedIdea?.keymetric,
        lever: selectedIdea.lever,
        description: selectedIdea.description,
        files: selectedIdea.media
      });
      console.log('aboutGoalFormik.keyMetric :>> ', aboutGoalFormik.values.keyMetric);
      confidenceFormik.setValues({
        confidence: selectedIdea.confidence,
        ease: selectedIdea.ease,
        impact: selectedIdea.impact,
        score: selectedIdea.score,
      });
    } else {
      aboutGoalFormik.setValues({
        name: "",
        goal: selectedGoal ? selectedGoal?._id : "",
        keyMetric: "",
        lever: "",
        description: "",
        files: [],
      });
      confidenceFormik.setValues({
        confidence: "",
        ease: "",
        impact: "",
        score: "",
      });
    }
    console.log('src={{...aboutGoalFormik.getFieldProps("files")}} :>> ', {...aboutGoalFormik.getFieldProps("files").value});
  }, [selectedIdea, selectedGoal]);
  const [deletedMedia, setdeletedMedia] = useState([]);


  return (
    <>
      <div>
        <div className="modal fade" id="createNewIdea" tabIndex={-1} aria-labelledby="createNewIdeaDialogLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="border-bottom mt-3 mb-3">
                  {/* <span className="text-success">{JSON.stringify(aboutGoalFormik.errors)}</span>
                  <span className="text-warning">{JSON.stringify(confidenceFormik.errors)}</span> */}

                  <h2 style={{ marginBottom: "24px" }}>{selectedIdea ? "Edit 123" : "New"} Idea</h2>

                  {/* Tabs */}
                  <div className="flex-fill d-flex align-items-center">
                    {ProjectsMenus.map((menu) => {
                      return (
                        <div
                          style={{ textDecoration: "none" }}
                          className="text-dark body3 regular-weight cp"
                          onClick={() => {
                            setselectedMenu(menu.name);
                          }}
                        >
                          <div
                            className={selectedMenu === menu.name ? "text-center border-bottom border-primary border-3" : "text-center pb-1"}
                            style={{ minWidth: "7rem" }}
                          >
                            <p className="mb-1">{menu.name}</p>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex-fill ml-auto"></div>

                    {RightProjectsMenus.map((menu) => {
                      return (
                        <div
                          style={{ textDecoration: "none" }}
                          className="text-dark body3 regular-weight cp"
                          onClick={() => {
                            setselectedMenu(menu.name);
                          }}
                        >
                          <div
                            className={selectedMenu === menu.name ? "text-center border-bottom border-primary border-3" : "text-center pb-1"}
                            style={{ minWidth: "7rem" }}
                          >
                            <p className="mb-1">{menu.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* About your Idea STEP */}
                <FormikProvider value={aboutGoalFormik}>
                  <Form autoComplete="off" noValidate onSubmit={aboutGoalFormik.handleSubmit}>
                    {selectedMenu === "About Your Idea" && (
                      <>
                        {/* Name */}
                        <div className="form-field">
                          <label className="form-label">Name</label>
                          <input
                            type={"text"}
                            {...aboutGoalFormik.getFieldProps("name")}
                            className="form-control form-control-lg"
                            placeholder="A short name for your idea"
                          />
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.name && aboutGoalFormik.errors.name) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.name}
                          </span>
                        </div>

                        {/* Select a goal AND Key Metric */}
                        <div className="row mb-3">
                          {/* Select a goal */}
                          <div className="col-6" style={{whiteSpace: "nowrap" , overflow: "hidden", textOverflow: "ellipsis", display: "inline-block"}}>
                            <label className="form-label">Select a Goal</label>
                            <select {...aboutGoalFormik.getFieldProps("goal")} class="form-select">
                              <option value="" className="text-secondary">
                                Select a Goal
                              </option>
                              {goals.map((goal) => {
                                return <option value={goal._id} style={{whiteSpace: "nowrap" , overflow: "hidden", textOverflow: "ellipsis", display: "inline-block"}}>{goal.name}</option>;
                              })}
                            </select>
                            <span
                              className="invalid-feedback"
                              style={{ display: Boolean(aboutGoalFormik.touched.goal && aboutGoalFormik.errors.goal) ? "block" : "none" }}
                            >
                              {aboutGoalFormik.errors.goal}
                            </span>
                          </div>

                          {/* Key Metric */}
                          <div className="col-6">
                            <label className="form-label">Key Metric</label>
                            <select
                              {...aboutGoalFormik.getFieldProps("keyMetric")}
                              class="form-select"
                              disabled={aboutGoalFormik.values.goal === "" || aboutGoalFormik.values.goal === null}
                            >
                            <option value="" className="text-secondary">
                                What will it impact
                              </option>
                              {
                               aboutGoalFormik.values.goal !== "" &&
                                  aboutGoalFormik.values.goal !== null &&
                                  goals
                                    .filter((g) => g._id === selectedIdea?.goal._id)
                                    .map((goal) => (
                                      <React.Fragment key={goal._id}>
                                            {goal.keymetric
                                                .filter((keymetric) => keymetric._id === selectedIdea.keymetric)
                                                .map((keymetric) => (
                                                    <option
                                                        key={keymetric._id}
                                                        value={keymetric._id}
                                                        selected={selectedIdea.keymetric === keymetric._id}
                                                    >
                                                        {keymetric.name}
                                                    </option>
                                                ))}
                                      </React.Fragment>
                                    ))}
                          </select>
                            <span
                              className="invalid-feedback"
                              style={{ display: Boolean(aboutGoalFormik.touched.keyMetric && aboutGoalFormik.errors.keyMetric) ? "block" : "none" }}
                            >
                              {aboutGoalFormik.errors.keyMetric}
                            </span>
                          </div>
                        </div>

                        {/* Growth Lever */}
                        <label className="form-label">Growth Lever</label>
                        <select {...aboutGoalFormik.getFieldProps("lever")} class="form-select">
                          <option value="" className="text-secondary">
                            Select a growth lever
                          </option>
                          {allGrowthLevers?.map((singleGrowthLever) => {
                            return <option value={singleGrowthLever?.name}>{singleGrowthLever?.name}</option>;
                          })}
                        </select>
                        <span
                          className="invalid-feedback"
                          style={{ display: Boolean(aboutGoalFormik.touched.lever && aboutGoalFormik.errors.lever) ? "block" : "none" }}
                        >
                          {aboutGoalFormik.errors.lever}
                        </span>

                        {/* Description */}
                        <div className="form-field mb-3 mt-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows="5"
                            {...aboutGoalFormik.getFieldProps("description")}
                            placeholder="Add an idea description..."
                          />
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.description && aboutGoalFormik.errors.description) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.description}
                          </span>
                        </div>

                        {/* Media & Documents */}
                        <div className="mb-3">
                          <label className="form-label">Media & Documents</label>
                         
                          <input
                            className="d-none"
                            ref={mediaAndDocRef}
                            type="file"
                            multiple={true}
                            onChange={(e) => {
                              console.log(e.target.files);         
                              setmediaDocuments([...mediaDocuments, ...e.target.files]);
                              console.log("mediaDocuments", mediaDocuments );
                              // aboutGoalFormik.setFieldValue("files", selectedIdea.media)

                            }}
                          />                       
                         <div className="row border rounded m-0">                        
                         {selectedIdea?.media.filter(mediaUrl => deletedMedia.includes(mediaUrl) === false).map((mediaUrl) => {
                             return   <div
                                  onMouseEnter={() => {
                                    setmediaActionsOverlay(mediaUrl);
                                  }}
                                  onMouseLeave={() => {
                                    setmediaActionsOverlay(null);
                                  }}
                                  className="card p-0 cp col"
                                  style={{ minWidth: "25%", maxWidth: "25%" }}
                                >
                                  <div className="border rounded">
                                   <img 
                                  src={`${backendServerBaseURL}/${mediaUrl}`} alt="" style={{ maxWidth: "100%" }} />             
 
                                    {mediaActionsOverlay === mediaUrl && (
                                      <div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        style={{
                                          position: "absolute",
                                          left: "0rem",
                                          bottom: "0px",
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0,0,0,0.6)",
                                        }}
                                      >
                                        <i
                                          class="bi bi-trash3-fill cp text-danger"
                                          style={{ fontSize: "1rem" }}
                                          onClick={() => {
                                            setdeletedMedia([...deletedMedia, mediaUrl]);                                        
                                          }}
                                        ></i>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                   })}

                            {mediaDocuments.map((file, index) => {
                              return isFileImage(file) ? (
                                <div
                                  onMouseEnter={() => {
                                    setmediaActionsOverlay(file.name);
                                  }}
                                  onMouseLeave={() => {
                                    setmediaActionsOverlay(null);
                                  }}
                                  className="card p-0 cp col"
                                  style={{ minWidth: "25%", maxWidth: "25%" }}
                                >
                                  <div className="border rounded">
                                    <img 
                                      src={URL.createObjectURL(file)} alt="" style={{ maxWidth: "100%" }} />

                                    {mediaActionsOverlay === file.name && (
                                      <div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        style={{
                                          position: "absolute",
                                          left: "0rem",
                                          bottom: "0px",
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0,0,0,0.6)",
                                        }}
                                      >
                                        <i
                                          class="bi bi-trash3-fill cp text-danger"
                                          style={{ fontSize: "1rem" }}
                                          onClick={() => {
                                            setmediaDocuments([
                                              ...mediaDocuments.slice(0, index),
                                              ...mediaDocuments.slice(index + 1, mediaDocuments.length),
                                            ]);
                                          }}
                                        ></i>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onMouseEnter={() => {
                                    setmediaActionsOverlay(file.name);
                                  }}
                                  onMouseLeave={() => {
                                    setmediaActionsOverlay(null);
                                  }}
                                  className="card p-0 cp col"
                                  style={{ minWidth: "25%", maxWidth: "25%" }}
                                >
                                  <div className="border rounded d-flex flex-column align-items-center justify-content-center h-100">
                                    <p className="body3 mb-1">File</p>

                                    <div className="d-flex align-items-center">
                                      <p className="body4">{file.name.length < 7 ? file.name : file.name.slice(0, 6) + "..."}</p>
                                      <p className="text-secondary body4 mb-0">
                                        {file.name.split(".")[file.name.split(".").length - 1].toUpperCase()}
                                      </p>
                                    </div>

                                    {mediaActionsOverlay === file.name && (
                                      <div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        style={{
                                          position: "absolute",
                                          left: "0rem",
                                          bottom: "0px",
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0,0,0,0.6)",
                                        }}
                                      >
                                        <i
                                          class="bi bi-trash3-fill cp text-danger"
                                          style={{ fontSize: "1rem" }}
                                          onClick={() => {
                                            setmediaDocuments([
                                              ...mediaDocuments.slice(0, index),
                                              ...mediaDocuments.slice(index + 1, mediaDocuments.length),
                                            ]);
                                          }}
                                        ></i>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            <div style={{ maxWidth: "25%" }} className="p-2">
                              <div
                                className="cp d-flex align-items-center justify-content-center border rounded h-100"
                                onClick={() => {
                                  mediaAndDocRef.current.click();
                                }}
                              >
                                <p className="m-0 text-primary" style={{ fontSize: "2rem" }}>
                                  +
                                </p>
                              </div>
                            </div>
                          </div>
                        

                        {/* Action buttons */}
                        <div className="d-flex align-items-center">
                          <div className="flex-fill"></div>

                          <div className="hstack gap-2 mt-3">
                            <button
                              type="button"
                              class="btn btn-lg btn-outline-danger"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                resetAllFields();
                              }}
                              ref={closeRef}
                            >
                              Close
                            </button>

                            {selectedIdea ? (
                                <LoadingButton
                                loading={isSubmitting}
                                class={"btn btn-lg btn-primary"}
                                type="button"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}>
                                Update Idea
                                </LoadingButton> 
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setselectedMenu("I.C.E Score");
                                }}
                                class={"btn btn-lg " + (!aboutGoalFormik.isValid || !aboutGoalFormik.dirty ? "btn-secondary" : "btn-primary")}
                                disabled={!aboutGoalFormik.isValid || !aboutGoalFormik.dirty}
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                        </div>
                      </>
                    )}
                  </Form>
                </FormikProvider>

                {/* ICE Score STEP */}
                <FormikProvider value={confidenceFormik}>
                  <Form autoComplete="off" noValidate onSubmit={confidenceFormik.handleSubmit}>
                    {selectedMenu === "I.C.E Score" && (
                      <>
                        {/* Total Score */}
                        <div className="mb-3">
                          <label className="form-label">Total Score</label>
                          <input
                            {...confidenceFormik.getFieldProps("score")}
                            type="number"
                            className="form-control"
                            placeholder="Score"
                            disabled={true}
                          />
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.score && aboutGoalFormik.errors.score) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.score}
                          </span>
                        </div>

                        {/* Impact */}
                        <div className="mb-3">
                          <label className="form-label">Impact</label>
                          <select
                            {...confidenceFormik.getFieldProps("impact")}
                            class="form-select"
                            onChange={(e) => {
                              if (e.target.value !== "" && confidenceFormik.values.confidence !== "" && confidenceFormik.values.ease !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(e.target.value) +
                                      parseInt(confidenceFormik.values.confidence) +
                                      parseInt(confidenceFormik.values.ease)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("impact", e.target.value);
                            }}
                          >
                            <option value="" className="text-secondary">
                              Score 1-10
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.impact && aboutGoalFormik.errors.impact) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.impact}
                          </span>
                        </div>

                        {/* Confidence */}
                        <div className="mb-3">
                          <label className="form-label">Confidence</label>
                          <select
                            {...confidenceFormik.getFieldProps("confidence")}
                            class="form-select"
                            onChange={(e) => {
                              if (e.target.value !== "" && confidenceFormik.values.impact !== "" && confidenceFormik.values.ease !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(e.target.value) + parseInt(confidenceFormik.values.impact) + parseInt(confidenceFormik.values.ease)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("confidence", e.target.value);
                            }}
                          >
                            <option value="" className="text-secondary">
                              Score 1-10
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.confidence && aboutGoalFormik.errors.confidence) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.confidence}
                          </span>
                        </div>

                        {/* Ease */}
                        <div className="mb-3">
                          <label className="form-label">Ease</label>
                          <select
                            {...confidenceFormik.getFieldProps("ease")}
                            class="form-select"
                            onChange={(e) => {
                              if (e.target.value !== "" && confidenceFormik.values.impact !== "" && confidenceFormik.values.confidence !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(e.target.value) +
                                      parseInt(confidenceFormik.values.impact) +
                                      parseInt(confidenceFormik.values.confidence)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("ease", e.target.value);
                            }}
                          >
                            <option value="" className="text-secondary">
                              Score 1-10
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                          <span
                            className="invalid-feedback"
                            style={{ display: Boolean(aboutGoalFormik.touched.ease && aboutGoalFormik.errors.ease) ? "block" : "none" }}
                          >
                            {aboutGoalFormik.errors.ease}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex align-items-center">
                          <div className="flex-fill"></div>

                          <div className="hstack gap-2">
                            <button
                              type="button"
                              class="btn btn-lg btn-outline-danger"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                resetAllFields();
                              }}
                              ref={closeRef}
                            >
                              Close
                            </button>

                            {selectedIdea ? (
                              <LoadingButton
                                loading={isSubmitting}
                                class={"btn btn-lg btn-primary"}
                                type="button"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                              >
                                Update Idea
                              </LoadingButton>
                            ) : (
                              <LoadingButton
                                loading={isSubmitting}
                                type="button"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                                class={"btn btn-lg " + (!confidenceFormik.isValid || !confidenceFormik.dirty ? "btn-secondary" : "btn-primary")}
                                disabled={!confidenceFormik.isValid || !confidenceFormik.dirty}
                              >
                                Create Idea
                              </LoadingButton>
                            )}
                          </div>
                        </div>
                      </>
                    )}
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

export default CreateNewIdea;
