import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AvatarGroup from "../../components/common/AvatarGroup";
import {
  archiveProject,
  getAllArchievedProjects,
  getAllProjects,
  getAllUsers,
  selectProjects,
  unarchiveProject,
  updateProjectSearch,
  updateProjectSelectedTab,
  updateProjectStatus,
  updateSelectedProject,
} from "../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { formatTime } from "../../utils/formatTime";
import { hasPermission_create_project, isTypeOwner, isRoleAdmin, hasPermission_delete_project } from "../../utils/permissions";
import CreateNewProjectDialog from "./CreateNewProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal } from "lucide-react";

function Projects() {
  const [selectedMenu, setselectedMenu] = useState("All");
  const projects = useSelector(selectProjects);
  console.log("projects --",projects)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectToDelete, setprojectToDelete] = useState(null);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const ProjectsMenus = [
    {
      name: "All",
    },
    {
      name: "Active",
    },
    {
      name: "Completed",
    },
    {
      name: "On Hold",
    },
  ];

  const RightProjectsMenus = hasPermission_create_project() || isTypeOwner() || isRoleAdmin() 
    ? [
        {
          name: "Archived",
        },
      ]
    : [];

    const [isLoading, setIsLoading] = useState(true); // Loading state flag


  useEffect(() => {
    if (selectedMenu !== "Archived") {
      dispatch(updateProjectSelectedTab(selectedMenu));
      dispatch(getAllProjects());
    } else {
      dispatch(getAllArchievedProjects());
    }

    dispatch(getAllUsers());
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
  }, [selectedMenu]);

  useEffect(() => {
    if (localStorage.getItem("openNewProjectDialog", null) === "1") {
      setIsCreateProjectDialogOpen(true);
      localStorage.setItem("openNewProjectDialog", "0");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6 sm:gap-6 mb-8 sm:mb-8">
        {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-lg sm:text-3xl font-medium sm:font-semibold text-foreground">Projects</h1>
              <p className="text-sm sm:text-base text-muted-foreground hidden sm:block mt-1">
              {
                projects?.filter((p) => {
                  if (selectedMenu === "All") return !p?.isArchived;
                  if (selectedMenu === "Active") return !p?.isArchived && p?.status === "Active";
                  if (selectedMenu === "On Hold") return !p?.isArchived && p?.status === "On Hold";
                  if (selectedMenu === "Completed") return !p?.isArchived && p?.status === "Completed";
                  if (selectedMenu === "Archived") return p?.isArchived;
                  return true;
                }).length
              }{" "}
              Projects
            </p>
          </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* New Project Button */}
            {hasPermission_create_project() && (
              <Button
                className="font-medium bg-black hover:bg-black/90 text-white"
                onClick={() => {
                  dispatch(updateSelectedProject(null));
                  setIsCreateProjectDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              onChange={(e) => {
                dispatch(updateProjectSearch(e.target.value));
                dispatch(getAllProjects());
              }}
              className="pl-9 w-full sm:w-64 h-10 sm:h-10 text-sm sm:text-base bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            {ProjectsMenus?.map((menu) => (
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
            ))}
            </div>

            <div className="flex items-center">
            {RightProjectsMenus?.map((menu) => (
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
            ))}
            </div>
          </div>
        </div>

          {/* Empty State */}
          {projects?.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <img src="/static/illustrations/no-projects-found.svg" alt="" className="h-48" />
                <h2 className="text-xl font-semibold text-gray-900">No Projects Found</h2>
                {selectedMenu === "All Projects" && (
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    data-bs-toggle="modal"
                    data-bs-target="#createProjectModal"
                    onClick={() => {
                      dispatch(updateSelectedProject(null));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create My First Project
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          )}

        {/* Projects Table */}
          {projects?.length !== 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium py-2">Name</TableHead>
                    <TableHead className="font-medium py-2">Description</TableHead>
                    <TableHead className="font-medium py-2">Created</TableHead>
                    <TableHead className="font-medium py-2">Owner</TableHead>
                    <TableHead className="font-medium py-2">Members</TableHead>
                    <TableHead className="font-medium py-2">Goals</TableHead>
                    <TableHead className="font-medium py-2">Status</TableHead>
                    <TableHead className="w-12 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
              {projects
                ?.filter((p) => {
                  if (selectedMenu === "All") return !p?.isArchived;
                  if (selectedMenu === "Active") return !p?.isArchived && p?.status === "Active";
                  if (selectedMenu === "On Hold") return !p?.isArchived && p?.status === "On Hold";
                  if (selectedMenu === "Completed") return !p?.isArchived && p?.status === "Completed";
                  if (selectedMenu === "Archived") return p?.isArchived;
                  return true;
                })
                    ?.map((project) => (
                      <TableRow
                      key={project._id}
                        className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                          localStorage.setItem("openedProject", JSON.stringify(project));
                        navigate(`/projects/${project._id}/goals`);
                      }}
                    >
                        {/* Name */}
                        <TableCell className="font-semibold text-black py-2">
                              {project.name}
                        </TableCell>

                        {/* Description */}
                        <TableCell className="max-w-xs truncate py-3">
                          {project.description || "No description"}
                        </TableCell>

                        {/* Created */}
                        <TableCell className="text-muted-foreground py-3">
                          {formatTime(project.createdAt)}
                        </TableCell>

                        {/* Owner */}
                        <TableCell className="py-3">
                              {project.createdBy
                                ? `${project.createdBy.firstName} ${project.createdBy.lastName}`
                                : "Removed User"}
                        </TableCell>

                        {/* Members */}
                        <TableCell className="py-3">
                          <AvatarGroup
                            listOfUrls={project.team?.map((t) => `${backendServerBaseURL}/${t?.avatar}`)}
                            userName={project.team?.map((t) => [
                              t?.firstName,
                              `${backendServerBaseURL}/${t?.avatar}`,
                              t?.lastName,
                            ])}
                            show={3}
                            total={project.team?.length}
                            owner={project?.createdBy}
                          />
                        </TableCell>

                        {/* Goals */}
                        <TableCell className="py-3">
                          {project?.goals}
                        </TableCell>

                        {/* Status */}
                        <TableCell
                          className="py-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {hasPermission_create_project() ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Badge
                                  className={`cursor-pointer ${
                                    project.status === "Active" || project.status === "Completed"
                                      ? "bg-black text-white"
                                      : project.status === "On Hold"
                                      ? "bg-gray-100 text-black"
                                      : ""
                                  } text-xs`}
                                  variant={project.status === "Active" || project.status === "Completed" || project.status === "On Hold" ? undefined : "secondary"}
                                >
                                  {project.status}
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(updateProjectStatus({ status: "Not Defined", projectId: project._id }));
                                  }}
                                >
                                  Not Defined
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(updateProjectStatus({ status: "Active", projectId: project._id }));
                                  }}
                                >
                                  Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(updateProjectStatus({ status: "Completed", projectId: project._id }));
                                  }}
                                >
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(updateProjectStatus({ status: "On Hold", projectId: project._id }));
                                  }}
                                >
                                  On Hold
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Badge 
                              className={`${
                                project.status === "Active" || project.status === "Completed"
                                  ? "bg-black text-white"
                                  : project.status === "On Hold"
                                  ? "bg-gray-100 text-black"
                                  : ""
                              } text-xs`}
                              variant={project.status === "Active" || project.status === "Completed" || project.status === "On Hold" ? undefined : "secondary"}
                            >
                              {project.status}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell
                            className="py-3"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                        >
                          {hasPermission_create_project() && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                onClick={() => {
                                    localStorage.setItem("openedProject", JSON.stringify(project));
                                  navigate(`/projects/${project._id}`);
                                }}
                              >
                                Open Project
                                </DropdownMenuItem>
                              {!project.isArchived && (
                                  <DropdownMenuItem
                                      data-bs-toggle="modal"
                                      data-bs-target="#createProjectModal"
                                      onClick={() => {
                                      dispatch(updateSelectedProject(project));
                                      }}
                                    >
                                      Edit Project
                                  </DropdownMenuItem>
                              )}
                              {!project.isArchived && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      dispatch(archiveProject({ projectId: project._id }));
                                    }}
                                  >
                                    Archive Project
                                  </DropdownMenuItem>
                              )}
                              {project.isArchived && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      dispatch(unarchiveProject({ projectId: project._id }));
                                    }}
                                  >
                                    Unarchive Project
                                  </DropdownMenuItem>
                                )}
                                {hasPermission_delete_project() && (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteProjectDialog"
                                  onClick={() => {
                                    setprojectToDelete(project);
                                  }}
                                >
                                  Delete Project
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          ) : (
            isLoading && (
            <Card>
              <CardContent className="p-6">
                {/* Loading Skeleton */}
                <div className="space-y-4">{[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="grid grid-cols-7 gap-4 p-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
                ))}</div>
              </CardContent>
            </Card>
          )
        )}

      {/* Modals */}
      <CreateNewProjectDialog 
        isOpen={isCreateProjectDialogOpen} 
        onClose={() => setIsCreateProjectDialogOpen(false)} 
      />
      <DeleteProjectDialog projectToDelete={projectToDelete} />
      </div>
    </div>
  );
}

export default Projects;
