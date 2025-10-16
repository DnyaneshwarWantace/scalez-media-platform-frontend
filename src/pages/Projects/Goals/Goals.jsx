import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { getAllGoals, getProjectUsers, selectGoals, updateSelectedGoal, updateShowDeleteGoalDialog } from "../../../redux/slices/projectSlice";
import { getAllkeyMetrics } from "../../../redux/slices/settingSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatDate } from "../../../utils/formatTime";
import { hasPermission_create_goals, isRoleAdmin, isTypeOwner, isRoleMember } from "../../../utils/permissions";
import TourModal from "../Tour/TourModal";
import CreateNewGoalDialog from "./CreateNewGoalDialog";
import DeleteGoalDialog from "./DeleteGoalDialog";
import RequestIdeaDialog from "./RequestIdeaDialog";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Plus, ChevronRight, ChevronDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

function Goals() {
  const [selectedMenu, setselectedMenu] = useState("All Goals");
  const [arrowStateUpdater, setArrowStateUpdater] = useState("AS@#SADX");
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const dispatch = useDispatch();
  const requestIdeaDialogRef = useRef();
  const goals = useSelector(selectGoals);

  console.log("goals", goals)
  const [filteredGoals, setfilteredGoals] = useState([]);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const [selectedTab, setselectedTab] = useState("About Goal");
  const [isCreateGoalDialogOpen, setIsCreateGoalDialogOpen] = useState(false);
  const ProjectsMenus = [
    {
      name: "All Goals",
    },
    {
      name: "Active",
    },
    {
      name: "Completed",
    },
  ];

  const RightProjectsMenus = [];

  const openRequestIdeaDialog = () => {
    requestIdeaDialogRef.current.click();
  };

  const [isLoading, setIsLoading] = useState(true); // Loading state flag
  const [showSkeletonLoader, setShowSkeletonLoader] = useState(true);
  const [isLoadingActive, setIsLoadingActive] = useState(true);



  const tabSwitch = async () => {
    if (selectedMenu === "Completed") {
      setfilteredGoals(
        goals?.filter((goal) => {
          if (
            Math.round(
              goal.keymetric.reduce(
                (partialSum, a) => (partialSum + a?.metrics?.length === 0 ? 0 : (a?.metrics[a?.metrics?.length - 1]?.value / a?.targetValue) * 100),
                0
              )
            ) >= 100
          ) {
            return goal;
          }
        })
      );
    }

    if (selectedMenu === "Active") {   
      setIsLoadingActive(true); // Set isLoadingActive to true
      setfilteredGoals(goals);
    }

    if (selectedMenu === "All Goals") {
      setfilteredGoals(goals);
    }
  };

  useEffect(() => {
    tabSwitch();
  }, [selectedMenu, goals]);

  useEffect(() => {
    // Show the skeleton loader on tab switch
    setShowSkeletonLoader(true);

    // Handle the "Active" tab separately
    if (selectedMenu === "Active") {
      console.log('isLoadingActive :>> ', isLoadingActive);
      setIsLoadingActive(true);
      setIsLoading(false); // Set isLoadingActive to false after the API call is completed
      // Set isLoadingActive to true for "Active" tab
      dispatch(getAllGoals({ projectId }));
      dispatch(getProjectUsers({ projectId }));
      dispatch(getAllkeyMetrics());

      // Simulate API call time - Replace this with actual API calls in your code
      setTimeout(() => {
        setShowSkeletonLoader(false); // Hide the skeleton loader when data is available
        setIsLoadingActive(false); // Set isLoadingActive to false after the API call is completed
      }, 2000);
    } else if (selectedMenu === "All Goals") {
      setIsLoading(true); // Set isLoading to true for other tabs
      dispatch(getAllGoals({ projectId }));
      dispatch(getProjectUsers({ projectId }));
      dispatch(getAllkeyMetrics());

      // Simulate API call time - Replace this with actual API calls in your code
      setTimeout(() => {
        setShowSkeletonLoader(false); // Hide the skeleton loader when data is available
        setIsLoading(false); // Set isLoading to false after the API call is completed
      }, 2000);
    }
  }, [selectedMenu]);



  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{openedProject?.name}</h1>
          <p className="text-sm text-gray-500">
            {goals?.length == 1
              ? `${goals?.length} Goal`
              : `${goals?.length} Goals`}
          </p>
        </div>

        <div className="flex-1 flex flex-row-reverse">
          <div className="flex items-center gap-2 sm:gap-3">
            {hasPermission_create_goals() && (
              <Button
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => {
                  setselectedTab("About Goal");
                  dispatch(updateSelectedGoal(null));
                  setIsCreateGoalDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {ProjectsMenus.map((menu) => (
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
            {RightProjectsMenus.map((menu) => (
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

      {filteredGoals?.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center mt-5">
            <div className="flex flex-col gap-3 text-center">
              <img
                src="/static/illustrations/no-projects-found.svg"
                alt=""
                height="200px"
              />
              <h2 className="text-xl font-semibold text-gray-900">No goals created yet</h2>
              {selectedMenu === "All Goals" && (
                <Button
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => {
                    setselectedTab("About Goal");
                    dispatch(updateSelectedGoal(null));
                    setIsCreateGoalDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                    Create My First Goal
                </Button>
              )}
            </div>
          </div>    
    )
   : (filteredGoals?.length > 0  ? 
     (
      <>
      <Card className="mt-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-medium" style={{ width: '359px', maxWidth: '359px' }}>Name</TableHead>
                <TableHead className="font-medium">Duration</TableHead>
                <TableHead className="font-medium">Members</TableHead>
                <TableHead className="font-medium text-center">Ideas</TableHead>
                <TableHead className="font-medium">Progress</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
      {filteredGoals.map((goal, index) => {
        const progress = Math.round(
          goal.keymetric.reduce((partialSum, metric) => {
            const lastMetric = metric.metrics[metric.metrics.length - 1];
            const percentage = lastMetric
              ? (lastMetric.value / metric.targetValue) * 100
              : 0;
            return partialSum + percentage;
          }, 0)
        );

        return (
          filteredGoals.length !== 0 ? (
            <React.Fragment key={`goal_body_${index}`}>
              <TableRow
                className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                navigate(`/projects/${projectId}/goals/${goal._id}`);
              }}
              >
                <TableCell className="py-3 align-middle">
                  <div
                    className="expand-icon cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (arrowStateUpdater.indexOf(goal._id) === -1) {
                        setArrowStateUpdater([...arrowStateUpdater, goal._id]);
                    } else {
                      let tempArr = [...arrowStateUpdater];
                        tempArr.splice(arrowStateUpdater.indexOf(goal._id), 1);
                      setArrowStateUpdater(tempArr);
                    }
                  }}
                  >
                    {arrowStateUpdater.indexOf(goal._id) === -1 ? (
                      <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    )}
              </div>
                </TableCell>

                <TableCell className="font-medium py-3 align-middle" style={{ width: '359px', maxWidth: '359px' }}>
                  <div className="w-full">
                    <div className="font-semibold text-sm text-black truncate">{goal.name}</div>
                    {goal.description && (
                      <div className="text-xs text-gray-500 truncate">{goal.description}</div>
                    )}
              </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600 py-3 align-middle">
                  {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                </TableCell>

                <TableCell className="py-3 align-middle">
                <AvatarGroup
                  listOfUrls={goal.members.map(
                    (member) => `${backendServerBaseURL}/${member.avatar}`
                  )}
                  show={3}
                  total={goal.members.length}
                  owner={goal?.createdBy}
                  userName={goal.members?.map((t) => [
                    t?.firstName,
                    `${backendServerBaseURL}/${t?.avatar}`,
                    t?.lastName,
                  ])}
                />
                </TableCell>

                <TableCell className="text-center py-3 align-middle">
                  <span className="text-sm text-gray-600">{goal.ideas}</span>
                </TableCell>

                <TableCell className="py-3 align-middle">
                  <div className="flex items-center gap-2 w-32">
                    <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-black rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                  </div>
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{progress}%</span>
                </div>
                </TableCell>

                <TableCell className="py-3 align-middle">
                  {hasPermission_create_goals() && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                            navigate(`/projects/${projectId}/goals/${goal._id}`);
                          }}
                        >
                          View Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                          setselectedTab("About Goal");
                          dispatch(updateSelectedGoal(goal));
                            setIsCreateGoalDialogOpen(true);
                        }}
                        >
                          Edit Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(updateSelectedGoal(goal));
                            dispatch(updateShowDeleteGoalDialog(true));
                          }}
                        >
                          Delete Goal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>

              {/* Collapsible Key Metrics Row */}
              {arrowStateUpdater.indexOf(goal._id) !== -1 && (
              <TableRow>
                <TableCell colSpan={7} className="p-0 border-t-0">
                  <div className="bg-gray-50">
                    {/* Nested Table for Key Metrics */}
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 hover:bg-gray-100">
                          <TableHead className="font-semibold text-xs">Key Metric Name</TableHead>
                          <TableHead className="font-semibold text-xs">Current Value</TableHead>
                          <TableHead className="font-semibold text-xs">Target Value</TableHead>
                          <TableHead className="font-semibold text-xs">Progress</TableHead>
                          <TableHead className="font-semibold text-xs">Status</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                {goal.keymetric.map((keyMetric, metricIndex) => {
                  const currentValue = keyMetric.metrics.length === 0 ? 0 : keyMetric.metrics[keyMetric.metrics.length - 1]?.value;
                  const metricProgress = keyMetric.metrics.length === 0
                    ? 0
                    : Math.round((currentValue / keyMetric.targetValue) * 100);

                return (
                    <TableRow
                      key={`metric_${metricIndex}`}
                      className="cursor-pointer hover:bg-gray-100/50"
                      onClick={(e) => {
                        e.stopPropagation();
                      navigate(`/projects/${projectId}/goals/${goal._id}`);
                    }}
                  >
                      {/* Key Metric Name */}
                      <TableCell className="font-medium text-sm">
                        {keyMetric.name}
                      </TableCell>

                      {/* Current Value */}
                      <TableCell className="text-sm">
                        {currentValue || 0}
                      </TableCell>

                      {/* Target Value */}
                      <TableCell className="text-sm">
                        {keyMetric.targetValue}
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                keyMetric.status === "On-Track" || keyMetric.status === "Achieved"
                                  ? "bg-black"
                                  : keyMetric.status === "Off-Track"
                                  ? "bg-yellow-500"
                                  : keyMetric.status === "At-Risk"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                              }`}
                              style={{ width: `${Math.min(metricProgress, 100)}%` }}
                      />
                    </div>
                          <span className="text-xs font-medium text-gray-600">{metricProgress}%</span>
                    </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className={`
                          ${keyMetric.status === "Not-Defined" ? "bg-gray-200 text-gray-900" : ""}
                          ${keyMetric.status === "On-Track" ? "bg-black text-white" : ""}
                          ${keyMetric.status === "Off-Track" ? "bg-yellow-200 text-yellow-700" : ""}
                          ${keyMetric.status === "At-Risk" ? "bg-red-200 text-red-700" : ""}
                          ${keyMetric.status === "Achieved" ? "bg-green-200 text-green-700" : ""}
                        `}>
                          {keyMetric.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                                navigate(`/projects/${projectId}/goals/${goal._id}`);
                              }}
                            >
                              View Key Metric
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                );
              })}

                      </TableBody>
                    </Table>

                    {/* Add Key Metric Button */}
                    {(hasPermission_create_goals() || isTypeOwner() || isRoleAdmin() || isRoleMember()) && (
                      <div className="px-6 py-3 border-t bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-black hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                      setselectedTab("Key Metrics");
                      dispatch(updateSelectedGoal(goal));
                            setIsCreateGoalDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Key Metric
                        </Button>
                      </div>
                )}
              </div>
                </TableCell>
              </TableRow>
              )}
            </React.Fragment>
          ) : null
        );
      })}
        </TableBody>
        </Table>
        </CardContent>
      </Card>
    </>
    )
   : (isLoading ? (
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead className="text-center">Ideas</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={`skeleton_${index}`} className="animate-pulse">
                    <TableCell><div className="h-4 w-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                    <TableCell>
                      <div className="flex -space-x-1">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
                    </TableCell>
                    <TableCell className="text-center"><div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div></TableCell>
                    <TableCell><div className="h-2 bg-gray-200 rounded-full w-full"></div></TableCell>
                    <TableCell><div className="h-8 w-8 bg-gray-200 rounded"></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null)
  )}

      <CreateNewGoalDialog
        openRequestIdeaDialog={openRequestIdeaDialog}
        selectedTab={selectedTab}
        open={isCreateGoalDialogOpen}
        onOpenChange={setIsCreateGoalDialogOpen}
      />
      <DeleteGoalDialog />

      <div
        ref={requestIdeaDialogRef}
      ></div>
      <RequestIdeaDialog />

      <TourModal />
    </div>
  );
}

export default Goals;
