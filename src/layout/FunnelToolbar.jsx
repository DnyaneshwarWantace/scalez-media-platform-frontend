import { Form, FormikProvider, useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import LoadingButton from "../components/common/LoadingButton";
import { getMe, selectMe } from "../redux/slices/generalSlice";
import {
  createProject,
  deleteProject,
  getAllProjects,
  selectAllProjects,
  selectScenarioId,
  selectsingleProject,
} from "../redux/slices/funnelProjectSlice";
import axiosInstance from "../utils/axios";
import { backendServerBaseURL } from "../utils/backendServerBaseURL";
import { blueprints } from "../utils/blueprints";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Plus, FolderOpen, History, List, Trash2, Download, FileText } from "lucide-react";
import "./FunnelToolbar.css";

function FunnelToolbar() {
  const [selectedMenu, setselectedMenu] = useState("User Management");
  const navigate = useNavigate();
  const menus = [];
  const dispatch = useDispatch();
  const createNewProjectCloseRef = useRef();
  const allPrjects = useSelector(selectAllProjects);
  const params = useParams();
  const projectId = params.projectId;
  const me = useSelector(selectMe);
  const closeDeleteprojectModalRef = useRef();
  const [selectedProject, setselectedProject] = useState(null);
  const scenarioId = useSelector(selectScenarioId);
  const singleProject = useSelector(selectsingleProject);

  const updateNodesAndEdges = (nodes, edges) => {
    // Update nodes on server
    axiosInstance
      .patch(
        `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/nodes`,
        {
          nodes,
        }
      )
      .then((res) => {
        axiosInstance
          .patch(
            `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/edges`,
            {
              edges,
            }
          )
          .then((res) => {
            window.location.reload();
          });
      });
  };

  const createBlueprintProject = (blueprintName, nodes, edges) => {
    axiosInstance
      .post(`${backendServerBaseURL}/api/v1/funnel-project/blueprint`, {
        title: blueprintName,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges),
      })
      .then((res) => {
        let targetProject = res.data.payload.project;

        window.open(`/funnel/${targetProject._id}`, "_self");
      });
  };

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getMe());
  }, []);

  const CreateNewProjectSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    processingRatePercent: Yup.number(),
    perTransactionFee: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      processingRatePercent: 2.9,
      perTransactionFee: 0.3,
    },
    validationSchema: CreateNewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      await dispatch(
        createProject({ ...values, setErrors, createNewProjectCloseRef })
      );
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isBlueprintsOpen, setIsBlueprintsOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="w-full bg-background border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg shadow-sm">
                <img src="/static/icons/logo.svg" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Funnel Visualizer</h1>
            </div>

            {/* Center Menu (if needed) */}
            <div className="flex items-center justify-center gap-1">
              {menus.map((menu) => (
                <Link
                  key={menu.name}
                  to={menu.link}
                  className={`px-4 py-2 text-sm font-medium transition-all rounded-md ${
                    selectedMenu === menu.name
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setselectedMenu(menu.name)}
                >
                  {menu.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* New Project Button */}
              <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create New Project</p>
                  </TooltipContent>
                </Tooltip>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Funnel Project</DialogTitle>
                  <p className="text-sm text-muted-foreground">Set up a new funnel visualization project</p>
                </DialogHeader>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...getFieldProps("title")}
                          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-black transition-all"
                          placeholder="e.g., E-commerce Checkout Funnel"
                        />
                        {touched.title && errors.title && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                            {errors.title}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...getFieldProps("description")}
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                          placeholder="Describe the purpose of this funnel project..."
                        />
                        {touched.description && errors.description && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                            {errors.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Processing Rate Percent */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Processing Rate %</label>
                          <input
                            {...getFieldProps("processingRatePercent")}
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            placeholder="2.9"
                          />
                          {touched.processingRatePercent && errors.processingRatePercent && (
                            <p className="text-sm text-red-600">{errors.processingRatePercent}</p>
                          )}
                        </div>

                        {/* Per Transaction Fee */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Transaction Fee ($)</label>
                          <input
                            {...getFieldProps("perTransactionFee")}
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            placeholder="0.3"
                          />
                          {touched.perTransactionFee && errors.perTransactionFee && (
                            <p className="text-sm text-red-600">{errors.perTransactionFee}</p>
                          )}
                        </div>
                      </div>

                      {/* Server Errors */}
                      {errors.afterSubmit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
                          <span>{errors.afterSubmit}</span>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateProjectOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-black/90 text-white min-w-[100px]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Creating...
                          </span>
                        ) : (
                          "Create Project"
                        )}
                      </Button>
                    </DialogFooter>
                  </Form>
                </FormikProvider>
              </DialogContent>
            </Dialog>

            {/* Versions Button */}
            <Sheet open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted transition-colors">
                      <History className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Versions</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <History className="h-4 w-4" />
                    </div>
                    <div>
                      <SheetTitle>Version History</SheetTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Restore previous versions of your project
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {singleProject?.scenario
                    ?.find((s) => s._id == scenarioId)
                    ?.versions?.length > 0 ? (
                    singleProject.scenario
                      .find((s) => s._id == scenarioId)
                      .versions.map((singleVersion, index) => (
                        <Card
                          key={singleVersion._id}
                          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-black group"
                          onClick={() => {
                            axiosInstance
                              .get(
                                `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/version/${singleVersion._id}/use`,
                                {}
                              )
                              .then((res) => {
                                window.location.reload();
                              });
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold">{singleVersion.versionName}</h3>
                                <p className="text-xs text-muted-foreground">Version {index + 1}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <History className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No versions yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Versions will appear here as you save changes</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Projects Button */}
            <Sheet open={isProjectsOpen} onOpenChange={setIsProjectsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted transition-colors">
                      <FolderOpen className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse Projects</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <SheetTitle>My Projects</SheetTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Browse and manage your funnel projects
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {allPrjects.length > 0 ? (
                    allPrjects.map((singleProject) => (
                      <Card
                        key={singleProject._id}
                        className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-black group"
                        onClick={() => {
                          window.open(`/funnel/${singleProject._id}`, "_self");
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                              <FolderOpen className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold truncate">{singleProject.title}</h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {singleProject.description || "No description"}
                              </p>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                                  onClick={(e) => {
                                    setselectedProject(singleProject);
                                    setIsDeleteModalOpen(true);
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Project</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Create your first project to get started</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Blueprints Button */}
            <Sheet open={isBlueprintsOpen} onOpenChange={setIsBlueprintsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted transition-colors">
                      <List className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Use Blueprints</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <List className="h-4 w-4" />
                    </div>
                    <div>
                      <SheetTitle>Blueprint Library</SheetTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quick start templates for common funnels
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {blueprints.length > 0 ? (
                    blueprints.map((singleBluePrintData) => (
                      <Card
                        key={singleBluePrintData.bluePrintName}
                        className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-black group"
                        onClick={() => {
                          createBlueprintProject(
                            singleBluePrintData.bluePrintName,
                            singleBluePrintData.nodes,
                            singleBluePrintData.edges
                          );
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold">{singleBluePrintData.bluePrintName}</h3>
                              <p className="text-xs text-muted-foreground">Pre-built template</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <List className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No blueprints available</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Project
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to delete <strong>{selectedProject?.title}</strong>? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                dispatch(
                  deleteProject({
                    projectId: selectedProject?._id,
                    closeDeleteprojectModalRef,
                    openedProjectId: projectId,
                  })
                );
                setIsDeleteModalOpen(false);
              }}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}

export default FunnelToolbar;
