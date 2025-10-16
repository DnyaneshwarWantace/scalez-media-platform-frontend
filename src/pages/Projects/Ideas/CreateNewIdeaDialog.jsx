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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

function CreateNewIdeaDialog({ selectedGoal, isOpen = false, onClose }) {
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
      console.log('aboutGoalFormik.values.goal :>> ', aboutGoalFormik.values.keyMetric);
      if (testId) {
        await dispatch(
          updateIdeaInTest({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, projectId, closeDialog, testId })
        );
      } else {
        const id = !selectedIdea ? ideaId : selectedIdea?._id;

        await dispatch(
          updateIdea({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, deletedMedia , projectId, closeDialog, ideaId: id, setmediaDocuments })
        );
        console.log('goals.filter',  goals.filter((g) => g._id === selectedIdea?.goal?._id).map((x) => x.keymetric.filter((keymetric) => keymetric._id === selectedIdea?.keymetric?._id)));
        console.log('g.filter :>> ', goals.filter((g) => g._id === aboutGoalFormik.values.goal));

        localStorage.setItem("keymetric", JSON.stringify(selectedIdea.keymetric))

      }
    } else {
      await dispatch(createIdea({ ...aboutGoalFormik.values, ...confidenceFormik.values, files: mediaDocuments, projectId, closeDialog }));
      console.log("aboutGoalFormik.values",aboutGoalFormik.values);

    }
  };

  const keymetricData = JSON.parse(localStorage.getItem("keymetric", ""));

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

  let data = goals.filter((g) => g._id === selectedIdea?.goal?._id).map((x) => x.keymetric.filter((keymetric) => keymetric._id === selectedIdea?.keymetric?._id))
  console.log('data Idea:>> ', data[0]?.map((x) => x.name.toString()));
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {selectedIdea ? "Edit Idea" : "Create New Idea"}
          </DialogTitle>
        </DialogHeader>
                <div className="border-b border-border py-4">
                  <h2 className="text-2xl font-semibold mb-6">{selectedIdea ? "Edit" : "New"} Idea</h2>

                  {/* Tabs */}
                  <div className="flex items-center border-b border-border">
                    {ProjectsMenus.map((menu) => {
                      return (
                        <button
                          key={menu.name}
                          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                            selectedMenu === menu.name
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
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
                      );
                    })}

                    <div className="flex-1"></div>

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
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            type="text"
                            {...aboutGoalFormik.getFieldProps("name")}
                            placeholder="A short name for your idea"
                          />
                          {aboutGoalFormik.touched.name && aboutGoalFormik.errors.name && (
                            <span className="text-sm text-red-600">
                              {aboutGoalFormik.errors.name}
                            </span>
                          )}
                        </div>

                        {/* Select a goal AND Key Metric */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Select a goal */}
                          <div className="space-y-2">
                            <Label htmlFor="goal">Select a Goal</Label>
                            <Select value={aboutGoalFormik.values.goal} onValueChange={(value) => aboutGoalFormik.setFieldValue("goal", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Goal" />
                              </SelectTrigger>
                              <SelectContent>
                                {goals.map((goal) => {
                                  return (
                                    <SelectItem key={goal._id} value={goal._id}>
                                      {goal.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            {aboutGoalFormik.touched.goal && aboutGoalFormik.errors.goal && (
                              <span className="text-sm text-red-600">
                                {aboutGoalFormik.errors.goal}
                              </span>
                            )}
                          </div>

                          {/* Key Metric */}
                          <div className="space-y-2">
                            <Label htmlFor="keyMetric">Key Metric</Label>
                            <Select 
                              value={aboutGoalFormik.values.keyMetric} 
                              onValueChange={(value) => aboutGoalFormik.setFieldValue("keyMetric", value)}
                              disabled={aboutGoalFormik.values.goal === "" || aboutGoalFormik.values.goal === null}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="What will it impact" />
                              </SelectTrigger>
                              <SelectContent>
                                {aboutGoalFormik.values.goal !== "" &&
                                    aboutGoalFormik.values.goal !== null &&
                                    goals
                                      .filter((g) => g._id === aboutGoalFormik.values.goal)
                                      .map((goal) => (
                                        <React.Fragment key={goal._id}>
                                          {goal.keymetric.map((keymetric) => (
                                            <SelectItem
                                              key={keymetric._id}
                                              value={keymetric._id}
                                            >
                                              {keymetric.name}
                                            </SelectItem>
                                          ))}
                                        </React.Fragment>
                                      ))}
                              </SelectContent>
                            </Select>
                            {aboutGoalFormik.touched.keyMetric && aboutGoalFormik.errors.keyMetric && (
                              <span className="text-sm text-red-600">
                                {aboutGoalFormik.errors.keyMetric}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Growth Lever */}
                        <div className="space-y-2">
                          <Label htmlFor="lever">Growth Lever</Label>
                          <Select value={aboutGoalFormik.values.lever} onValueChange={(value) => aboutGoalFormik.setFieldValue("lever", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a growth lever" />
                            </SelectTrigger>
                            <SelectContent>
                              {allGrowthLevers?.map((singleGrowthLever) => {
                                return (
                                  <SelectItem key={singleGrowthLever?.name} value={singleGrowthLever?.name}>
                                    {singleGrowthLever?.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {aboutGoalFormik.touched.lever && aboutGoalFormik.errors.lever && (
                            <span className="text-sm text-red-600">
                              {aboutGoalFormik.errors.lever}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="description">Description</Label>
                          <SunEditor
                            height="200px"
                            setDefaultStyle="font-family: 'Inter', sans-serif; font-size: 14px;"
                            defaultValue={aboutGoalFormik.values.description}
                            onChange={(content) => {
                              aboutGoalFormik.setFieldValue("description", content);
                            }}
                            setOptions={{
                              buttonList: [
                                ["undo", "redo"],
                                ["bold", "underline", "italic", "strike"],
                                ["fontColor", "hiliteColor"],
                                ["align", "list", "lineHeight"],
                                ["link", "image"],
                                ["fullScreen", "showBlocks", "codeView"],
                                ["removeFormat"]
                              ],
                              formats: ["p", "div", "h1", "h2", "h3"],
                            }}
                          />
                          {aboutGoalFormik.touched.description && aboutGoalFormik.errors.description && (
                            <span className="text-sm text-red-600">
                              {aboutGoalFormik.errors.description}
                            </span>
                          )}
                        </div>

                        {/* Media & Documents */}
                        <div className="space-y-2">
                          <Label htmlFor="media">Media & Documents</Label>
                         
                          <input
                            className="hidden"
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
                         <div className="grid grid-cols-4 gap-4 border rounded p-4">                        
                         {selectedIdea?.media.filter(mediaUrl => deletedMedia.includes(mediaUrl) === false).map((mediaUrl) => {
                             return   <div
                                  onMouseEnter={() => {
                                    setmediaActionsOverlay(mediaUrl);
                                  }}
                                  onMouseLeave={() => {
                                    setmediaActionsOverlay(null);
                                  }}
                                  className="relative cursor-pointer"
                                >
                                  <div className="border rounded overflow-hidden">
                                   <img 
                                  src={`${backendServerBaseURL}/${mediaUrl}`} alt="" className="w-full h-auto" />             
 
                                    {mediaActionsOverlay === mediaUrl && (
                                      <div
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60"
                                      >
                                        <button
                                          className="text-red-500 hover:text-red-600"
                                          onClick={() => {
                                            setdeletedMedia([...deletedMedia, mediaUrl]);                                        
                                          }}
                                        >
                                          <X className="h-5 w-5" />
                                        </button>
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
                                          className="bi bi-trash3-fill cp text-danger"
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
                                          className="bi bi-trash3-fill cp text-danger"
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

                            <div className="p-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full h-24 flex items-center justify-center border-dashed"
                                onClick={() => {
                                  mediaAndDocRef.current.click();
                                }}
                              >
                                <Upload className="h-6 w-6 mr-2" />
                                Add Media
                              </Button>
                            </div>
                          </div>
                        

                        {/* Action buttons */}
                        <div className="flex items-center justify-end mt-6">
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                resetAllFields();
                                onClose && onClose();
                              }}
                              ref={closeRef}
                            >
                              Close
                            </Button>

                            {selectedIdea ? (
                                <Button
                                type="button"
                                className="bg-black hover:bg-gray-800"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Updating..." : "Update Idea"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => {
                                  setselectedMenu("I.C.E Score");
                                }}
                                className={!aboutGoalFormik.isValid || !aboutGoalFormik.dirty ? "bg-gray-400" : "bg-black hover:bg-gray-800"}
                                disabled={!aboutGoalFormik.isValid || !aboutGoalFormik.dirty}
                              >
                                Next
                              </Button>
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
                        <div className="space-y-2">
                          <Label htmlFor="score">Total Score</Label>
                          <Input
                            id="score"
                            {...confidenceFormik.getFieldProps("score")}
                            type="number"
                            placeholder="Score"
                            disabled={true}
                          />
                          {confidenceFormik.touched.score && confidenceFormik.errors.score && (
                            <span className="text-sm text-red-600">
                              {confidenceFormik.errors.score}
                            </span>
                          )}
                        </div>

                        {/* Impact */}
                        <div className="space-y-2">
                          <Label htmlFor="impact">Impact</Label>
                          <Select
                            value={confidenceFormik.values.impact}
                            onValueChange={(value) => {
                              if (value !== "" && confidenceFormik.values.confidence !== "" && confidenceFormik.values.ease !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(value) +
                                      parseInt(confidenceFormik.values.confidence) +
                                      parseInt(confidenceFormik.values.ease)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("impact", value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Score 1-10" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          {confidenceFormik.touched.impact && confidenceFormik.errors.impact && (
                            <span className="text-sm text-red-600">
                              {confidenceFormik.errors.impact}
                            </span>
                          )}
                        </div>

                        {/* Confidence */}
                        <div className="space-y-2">
                          <Label htmlFor="confidence">Confidence</Label>
                          <Select
                            value={confidenceFormik.values.confidence}
                            onValueChange={(value) => {
                              if (value !== "" && confidenceFormik.values.impact !== "" && confidenceFormik.values.ease !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(value) + parseInt(confidenceFormik.values.impact) + parseInt(confidenceFormik.values.ease)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("confidence", value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Score 1-10" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          {confidenceFormik.touched.confidence && confidenceFormik.errors.confidence && (
                            <span className="text-sm text-red-600">
                              {confidenceFormik.errors.confidence}
                            </span>
                          )}
                        </div>

                        {/* Ease */}
                        <div className="space-y-2">
                          <Label htmlFor="ease">Ease</Label>
                          <Select
                            value={confidenceFormik.values.ease}
                            onValueChange={(value) => {
                              if (value !== "" && confidenceFormik.values.impact !== "" && confidenceFormik.values.confidence !== "") {
                                confidenceFormik.setFieldValue(
                                  "score",
                                  Math.round(
                                    ((parseInt(value) +
                                      parseInt(confidenceFormik.values.impact) +
                                      parseInt(confidenceFormik.values.confidence)) /
                                      3) *
                                      100
                                  ) / 100
                                );
                              } else {
                                confidenceFormik.setFieldValue("score", 0);
                              }

                              confidenceFormik.setFieldValue("ease", value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Score 1-10" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          {confidenceFormik.touched.ease && confidenceFormik.errors.ease && (
                            <span className="text-sm text-red-600">
                              {confidenceFormik.errors.ease}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end mt-6">
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                resetAllFields();
                                onClose && onClose();
                              }}
                              ref={closeRef}
                            >
                              Close
                            </Button>

                            {selectedIdea ? (
                              <Button
                                type="button"
                                className="bg-black hover:bg-gray-800"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Updating..." : "Update Idea"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={async () => {
                                  setisSubmitting(true);
                                  await submitNewGoalForm();
                                  setisSubmitting(false);
                                }}
                                className={!confidenceFormik.isValid || !confidenceFormik.dirty ? "bg-gray-400" : "bg-black hover:bg-gray-800"}
                                disabled={!confidenceFormik.isValid || !confidenceFormik.dirty || isSubmitting}
                              >
                                {isSubmitting ? "Creating..." : "Create Idea"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </Form>
                </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewIdeaDialog;
