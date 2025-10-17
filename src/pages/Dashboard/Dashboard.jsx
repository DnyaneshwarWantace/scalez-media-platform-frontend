import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  readCheckins,
  readGoals,
  readIdeas,
  readLearnings,
  readTasks,
  readTests,
  selectcheckins,
  selectgoalsData,
  selectideasData,
  selectlearningsData,
  selecttasksAssigned,
  selecttasksCompleted,
  selecttestsData,
} from "../../redux/slices/dashboardSlice";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getAllProjects,
  selectProjects,
  updateTestTaskStatus,
  selectGoals,
} from "../../redux/slices/projectSlice";
import AddWidgetDialog from "./AddWidgetDialog";
import { formatDate2, formatTime } from "../../utils/formatTime";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import AvatarGroup from "../../components/common/AvatarGroup";
import { getAllUsers, selectAllUsers } from "../../redux/slices/settingSlice";
import { getMe, selectMe } from "../../redux/slices/generalSlice";

import { Bar } from "react-chartjs-2";
import Spinner from "../../components/common/Spinner";

// Import modern UI components
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Filter, MoreHorizontal, ChevronDown, User } from "lucide-react";
import NorthStarWidget from "../../components/NorthStarWidget";
let options = {
  elements: {
    line: {
      tension: 0, // disables bezier curves
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "bottom",
      labels: {
        color: "#97a4af",
        usePointStyle: true,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  scales: {
    yAxes: {
      gridLines: {
        color: "#e7eaf3",
        drawBorder: false,
        zeroLineColor: "#e7eaf3",
      },
      ticks: {
        beginAtZero: true,
        stepSize: 10,
        fontSize: 12,
        color: "#97a4af",
        fontFamily: "Open Sans, sans-serif",
        padding: 10,
        postfix: "k",
      },
    },
    xAxes: {
      grid: {
        display: false,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        fontSize: 12,
        color: "#97a4af",
        fontFamily: "Open Sans, sans-serif",
        padding: 5,
      },
    },
  },
  tooltips: {
    mode: "index",
    intersect: false,
  },
  hover: {
    mode: "index",
    intersect: false,
  },
};

function Dashboard() {
  const [yourTasks, setyourTasks] = useState([1, 2, 3]);
  
  
  const dispatch = useDispatch();
  const tasksAssigned = useSelector(selecttasksAssigned);
  const tasksCompleted = useSelector(selecttasksCompleted);
  const checkins = useSelector(selectcheckins);
  const meFromRedux = useSelector(selectMe);
  const meFromStorage = JSON.parse(localStorage.getItem("userData") || "{}");
  const me = meFromRedux || meFromStorage;
  console.log('me Dashboard:>> ', me);
  console.log('me firstName:>> ', me?.firstName);

  console.log('me name:>> ', me?.name);
  console.log('me email:>> ', me?.email);
  const projects = useSelector(selectProjects);

  // Helper function to filter data by selected project
  const filterDataByProject = (data, projectField = 'project') => {
    if (!selectedProject) return data; // Show all if no project selected
    
    return data?.filter(item => {
      const project = item[projectField];
      return project?._id === selectedProject || 
             project === selectedProject || 
             item.projectId === selectedProject ||
             item.projectId?._id === selectedProject;
    }) || [];
  };
  // console.log('projects DB:>> ', projects);
  const goalsData = useSelector(selectgoalsData);
  let goalInfo = goalsData.filter((idea) => idea.owner === me?.id);
// console.log('goalInfo :>> ', goalInfo);
  const isUserInGoalsProjectTeam = goalsData.filter(
    (goal) => goal?.project?.team.includes(me?.id || me?._id) 

  );
  console.log('isUserInGoalsProjectTeam:>> ',isUserInGoalsProjectTeam)
  const testsData = useSelector(selecttestsData);
  // console.log('testsData :>> ', testsData);
  const isUserInTestsProjectTeam = testsData.filter(
    (test) => test?.project?.team.includes(me?.id || me?._id)  

  );
  const learningsData = useSelector(selectlearningsData);
  // console.log('learningsData :>> ', learningsData);
  const isUserInLearningsProjectTeam = learningsData.filter(
    (learning) => learning?.project?.team.includes(me?.id || me?._id) 

  );
  const ideasData = useSelector(selectideasData);
  // console.log('ideasData :>> ', ideasData);
  let ideaInfo = ideasData.some((idea) => idea.owner === me?.id);

  const isUserInTeamIdea = ideasData.filter(
    (idea) => idea?.project?.team.includes(me?.id || me?._id) 

  );
  // console.log('isUserInTeamIdea:>> ', isUserInTeamIdea)

  const allUsers = useSelector(selectAllUsers);
  const navigate = useNavigate();

  // Debug logs
  console.log("goalsData :>> ", goalsData);
  console.log("ideasData :>> ", ideasData);
  console.log("testsData :>> ", testsData);
  console.log("learningsData :>> ", learningsData);
  console.log("projects :>> ", projects);
  console.log("allUsers :>> ", allUsers);

  const [activeGoalsSelectedProject, setactiveGoalsSelectedProject] =
    useState("");
  const [recentideasSelectedProject, setrecentideasSelectedProject] =
    useState("");
  const [activeTestsSelectedProject, setactiveTestsSelectedProject] =
    useState("");
  const [recentLearningSelectedProject, setrecentLearningSelectedProject] =
    useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state flag

  // Dynamic welcome message based on time
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    console.log('Current hour:', hour);
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    dispatch(getMe()); 
    dispatch(getAllProjects());
    dispatch(readTasks());
    dispatch(readCheckins());
    dispatch(readLearnings());
    dispatch(readIdeas());
    dispatch(readGoals());
    dispatch(readTests());
    dispatch(getAllUsers()); 
    setTimeout(() => {
      setShowLoader(false);
    }, 2000);  
  }, []);

  useEffect(() => {
    if (goalsData.length || testsData.length || learningsData.length || ideasData.length || !projects.length) {
      setTimeout(() => {
        setShowLoader(false);
      }, 2000); 

    } else {
      setShowLoader(true); 
    }
  }, [goalsData, testsData, learningsData, ideasData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
      {showLoader && <div 
      style={{
        width: "100%",
        height: "100%",
        zIndex: "999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        paddingRight: "111px",
        paddingBottom: "150px",
        background: "#f6f7f970"
      }}>
        <Spinner/>
        </div>}
      
      <div className="space-y-6">
        {/* Header - Dynamic Welcome Message */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {getWelcomeMessage()}, {me?.firstName || me?.name || me?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your experiments today.
          </p>
        </div>

        {/* Project Selection - Compact Design */}
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-foreground font-semibold text-sm">📁</span>
        </div>
        <div>
                <h3 className="font-semibold text-base text-foreground">Current Project</h3>
                <p className="text-muted-foreground text-sm">Select a project to view details</p>
                </div>
              </div>
            
            <div className="flex items-center gap-3 -ml-4">
              {/* Custom Dropdown */}
              <div className="relative">
          <button
                  type="button"
                  className="w-full min-w-[200px] px-3 py-2 pr-8 bg-white border border-gray-300 rounded-lg text-left text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400 cursor-pointer flex items-center justify-between text-sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className={selectedProject ? "text-gray-900" : "text-gray-500"}>
                    {selectedProject 
                      ? projects?.find(p => p._id === selectedProject)?.name || "All Projects"
                      : "All Projects"
                    }
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
          </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <button
                      className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg text-sm"
                      onClick={() => {
                        setSelectedProject("");
                        setShowDropdown(false);
                      }}
                    >
                      All Projects
                    </button>
                    {projects?.map((project) => (
                    <button
                        key={project._id}
                        className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg text-sm"
                        onClick={() => {
                          setSelectedProject(project._id);
                          setShowDropdown(false);
                        }}
                      >
                        {project.name}
                    </button>
                    ))}
                    {projects?.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        No projects available
                  </div>
                  )}
                    </div>
                  )}
                </div>

              <button 
                onClick={() => navigate('/projects')}
                className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
              >
                View All Projects
              </button>

              <AddWidgetDialog />
                        </div>
                        </div>
                      </div>

        {/* Top Metrics - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{filterDataByProject(goalsData)?.length || 0}</span>
                  <span className="text-sm font-medium text-green-600">
                    {filterDataByProject(goalsData)?.filter(g => g.status === 'Active')?.length || 0} active
                  </span>
                                </div>
                <p className="text-xs text-muted-foreground">Currently tracking</p>
                                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ideas Generated</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{filterDataByProject(ideasData)?.length || 0}</span>
                  <span className="text-sm font-medium text-green-600">
                    {filterDataByProject(ideasData)?.filter(i => new Date(i.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))?.length || 0} new
                  </span>
                                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                                  </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Tests</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{filterDataByProject(testsData)?.filter(t => t.status === 'Running')?.length || 0}</span>
                  <span className="text-sm font-medium text-green-600">
                    {filterDataByProject(testsData)?.filter(t => t.status === 'Completed')?.length || 0} completed
                                  </span>
                  </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Learnings Captured</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{filterDataByProject(learningsData)?.length || 0}</span>
                  <span className="text-sm font-medium text-green-600">
                    {filterDataByProject(learningsData)?.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))?.length || 0} this week
                                  </span>
                      </div>
                <p className="text-xs text-muted-foreground">From completed tests</p>
                      </div>
            </CardContent>
          </Card>
                    </div>

         {/* Active Goals - Table Format */}
         {me?.widgets?.activeGoals !== false && (
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">Active Goals</h2>
               <div className="flex items-center gap-2">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => navigate('/projects')}
                 >
                   View All Goals
                 </Button>
                                      </div>
                                      </div>

           <Card>
             <CardContent className="p-6">
               {/* Header Row */}
               <div className="grid grid-cols-6 gap-4 p-3 border-b text-sm font-medium text-muted-foreground mb-4">
                 <div>Name</div>
                 <div>Project</div>
                 <div>Status</div>
                 <div>Progress</div>
                 <div>Due Date</div>
                 <div>Members</div>
                                      </div>
               
               <div className="grid gap-4">
               {filterDataByProject(goalsData)?.length > 0 ? (
                 filterDataByProject(goalsData).slice(0, 3).map((goal, index) => {
                   // Debug goal data - show all goal properties
                   console.log('Goal data:', goal);
                   console.log('Goal name:', goal.name);
                   console.log('Goal project:', goal.project);
                   console.log('Goal status:', goal.status);
                   console.log('Goal members:', goal.members);
                   
                   // Calculate progress safely
                   const progress = goal.keymetric && goal.keymetric.length > 0 && goal.keymetric[0].currentValue && goal.keymetric[0].targetValue
                     ? Math.round((goal.keymetric[0].currentValue / goal.keymetric[0].targetValue) * 100)
                     : 0;
                   
                   // Get status with proper mapping - matching Projects page colors
                   const getStatusBadge = (status) => {
                     const statusText = status || 'Active'; // Default to Active if no status
                     let badgeClass = 'bg-black text-white'; // Default black for Active
                     
                     switch (statusText.toLowerCase()) {
                       case 'active':
                         badgeClass = 'bg-black text-white';
                         break;
                       case 'completed':
                         badgeClass = 'bg-black text-white';
                         break;
                       case 'on hold':
                         badgeClass = 'bg-gray-100 text-black';
                         break;
                       default:
                         badgeClass = 'bg-gray-100 text-gray-800'; // Default to light gray for Not Defined
                     }
                     
                      return (
                       <Badge className={`${badgeClass} text-xs`}>
                         {statusText}
                       </Badge>
                     );
                   };
                   
                   return (
                     <div 
                       key={index} 
                       className="grid grid-cols-6 gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                       onClick={() => navigate(`/projects/${goal.project?._id}/goals/${goal._id}`)}
                     >
                       {/* Goal Name */}
                       <div className="flex-1 min-w-0">
                         <h4 className="font-medium text-sm truncate">{goal.name || goal.title || 'Untitled Goal'}</h4>
                      </div>

                       {/* Project Name */}
                       <div className="flex items-center">
                         <span className="text-sm text-muted-foreground">
                           {(() => {
                             const projectName = goal.project?.name || 
                               goal.projectId?.name || 
                               (projects?.find(p => p._id === goal.project?._id || p._id === goal.project)?.name);
                             return projectName || 'No Project';
                           })()}
                         </span>
                      </div>

                       {/* Status */}
                       <div className="flex items-center">
                         {getStatusBadge(goal.status)}
                      </div>

                       {/* Progress */}
                       <div className="flex items-center">
                         <span className="font-semibold">{progress || 0}%</span>
                    </div>

                       {/* Due Date */}
                       <div className="flex items-center">
                         <span className="text-sm text-muted-foreground">
                           {goal.endDate ? formatDate2(goal.endDate) : 'No due date'}
                         </span>
                       </div>

                       {/* Members */}
                       <div className="flex items-center">
                         <div className="flex -space-x-1">
                           {goal.members?.slice(0, 2).map((member, idx) => {
                             // Handle both string IDs and object members
                             const memberId = typeof member === 'string' ? member : member._id;
                             const memberData = typeof member === 'object' ? member : allUsers?.find(u => u._id === memberId);
                             const memberName = memberData ? `${memberData.firstName} ${memberData.lastName}` : `User ID: ${memberId}`;
                             
                      return (
                               <div 
                                 key={idx} 
                                 className="w-6 h-6 rounded-full border-2 border-background overflow-hidden hover:scale-110 transition-transform relative group"
                                 title={memberName}
                               >
                                 {memberData?.avatar ? (
                                   <img 
                                     src={`${backendServerBaseURL}/${memberData.avatar}`}
                                     alt={memberName}
                                     className="w-full h-full object-cover"
                                   />
                                 ) : (
                                   <div className="w-full h-full bg-muted flex items-center justify-center">
                                     <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                                 )}
                              </div>
                             );
                           })}
                           {goal.members?.length > 2 && (
                             <div 
                               className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium border-2 border-background hover:scale-110 transition-transform"
                               title={goal.members.slice(2).map(member => {
                                 // Handle both string IDs and object members
                                 const memberId = typeof member === 'string' ? member : member._id;
                                 const memberData = typeof member === 'object' ? member : allUsers?.find(u => u._id === memberId);
                                 return memberData ? `${memberData.firstName} ${memberData.lastName}` : `User ID: ${memberId}`;
                               }).join(', ')}
                             >
                               +{goal.members.length - 2}
                                </div>
                           )}
                              </div>
                            </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="p-8 text-center">
                   <p className="text-muted-foreground">No goals available yet</p>
                 </div>
                )}
              </div>
             </CardContent>
           </Card>
            </div>
         )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Learnings - Real Data with Navigation */}
          {me?.widgets?.recentLearnings !== false && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Learnings</h2>
              </div>

            <Card>
              <CardContent className="p-6">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 p-3 border-b text-sm font-medium text-muted-foreground mb-4">
                  <div>Name</div>
                  <div>Project</div>
                  <div>Result</div>
                  <div>Created On</div>
              </div>

                <div className="grid gap-4">
                  {filterDataByProject(learningsData)?.length > 0 ? (
                    filterDataByProject(learningsData).slice(0, 3).map((learning, index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-4 gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/projects/${learning.project?._id}/learnings/${learning._id}`)}
                      >
                        {/* Learning Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{learning.name || 'Untitled Learning'}</h4>
                          <div 
                            className="text-xs text-muted-foreground truncate prose prose-xs max-w-none
                              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-1
                              [&_ul]:list-disc [&_ul]:ml-2 [&_ol]:list-decimal [&_ol]:ml-2
                              [&_li]:my-0.5 [&_a]:text-blue-600 [&_a]:underline
                              [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                              [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold
                              [&_h3]:text-xs [&_h3]:font-bold [&_p]:my-1"
                            dangerouslySetInnerHTML={{
                              __html: learning.description || '<span className="text-gray-500">No description</span>'
                            }}
                          />
                      </div>

                        {/* Project Name */}
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">
                            {learning.project?.name || 'No Project'}
                          </span>
                      </div>

                        {/* Result */}
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            learning.result === 'Successful' ? 'bg-green-100 text-green-700' :
                            learning.result === 'Unsuccessful' ? 'bg-red-100 text-red-700' :
                            learning.result === 'Inconclusive' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {learning.result || 'Unknown'}
                          </span>
                    </div>

                        {/* Created On */}
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground">
                            {learning.createdAt ? formatDate2(learning.createdAt) : 'Unknown'}
                          </span>
                                      </div>
                                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No learnings available yet</p>
                                      </div>
                                    )}
                                      </div>
              </CardContent>
            </Card>
                                      </div>
                                    )}

          {/* Team Performance - Real Data */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Team Performance</h2>

            <div className="space-y-3">
              {/* Current User Performance */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                      {me?.firstName?.substring(0, 1) + me?.lastName?.substring(0, 1) || 'UN'}
                                </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{me?.firstName} {me?.lastName}</h4>
                          <p className="text-xs text-muted-foreground">{me?.role?.name || 'Team Member'}</p>
                                </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold">
                            {tasksAssigned?.length > 0 ? Math.round((tasksCompleted?.length / tasksAssigned?.length) * 100) : 0}%
                                  </span>
                          <p className="text-xs text-muted-foreground">completion rate</p>
                                </div>
                                    </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{tasksAssigned?.length || 0} tasks assigned</span>
                          <span>{tasksCompleted?.length || 0} completed</span>
                                    </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-500 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${tasksAssigned?.length > 0 ? (tasksCompleted?.length / tasksAssigned?.length) * 100 : 0}%`}}
                          ></div>
                                    </div>
                                    </div>
                                    </div>
                                </div>
                </CardContent>
              </Card>

              {/* Team Members Performance */}
              {projects?.map((project) => 
                project.team?.map((memberId) => {
                  const member = allUsers?.find(u => u._id === memberId);
                  if (!member || member._id === me?.id) return null;
                  
                  const memberTasks = tasksAssigned?.filter(t => t.assignedTo?._id === member._id) || [];
                  const memberCompleted = tasksCompleted?.filter(t => t.assignedTo?._id === member._id) || [];
                  
                        return (
                    <Card key={member._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                            {member.firstName?.substring(0, 1) + member.lastName?.substring(0, 1) || 'UN'}
              </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-sm">{member.firstName} {member.lastName}</h4>
                                <p className="text-xs text-muted-foreground">{member.role?.name || 'Team Member'}</p>
                        </div>
                              <div className="text-right">
                                <span className="text-lg font-semibold">
                                  {memberTasks.length > 0 ? Math.round((memberCompleted.length / memberTasks.length) * 100) : 0}%
                                  </span>
                                <p className="text-xs text-muted-foreground">completion rate</p>
                        </div>
                        </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{memberTasks.length} tasks assigned</span>
                                <span>{memberCompleted.length} completed</span>
                        </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gray-500 h-2 rounded-full transition-all duration-300" 
                                  style={{width: `${memberTasks.length > 0 ? (memberCompleted.length / memberTasks.length) * 100 : 0}%`}}
                                ></div>
                                  </div>
                                  </div>
                                        </div>
                                      </div>
                      </CardContent>
                    </Card>
                  );
                })
                )}
                                    </div>
                                  </div>
                                  </div>

        {/* All Tests Table - Real Data with Navigation */}
        {me?.widgets?.activeTests !== false && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Tests</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/projects')}
                >
                  View All Tests
                </Button>
              </div>
                                </div>

            <Card>
              <CardContent className="p-6">
                {/* Header Row */}
                <div className="grid grid-cols-5 gap-4 p-3 border-b text-sm font-medium text-muted-foreground mb-4">
                  <div>Name</div>
                  <div>Project</div>
                  <div>Status</div>
                  <div>Due Date</div>
                  <div>Ice Score</div>
                                </div>

                <div className="grid gap-4">
                  {filterDataByProject(testsData)?.map((test, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-5 gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${test.project?._id}/tests/${test._id}`)}
                    >
                      {/* Test Name */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{test.name || 'Untitled Test'}</h4>
                        <div 
                          className="text-xs text-muted-foreground truncate prose prose-xs max-w-none
                            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-1
                            [&_ul]:list-disc [&_ul]:ml-2 [&_ol]:list-decimal [&_ol]:ml-2
                            [&_li]:my-0.5 [&_a]:text-blue-600 [&_a]:underline
                            [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                            [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold
                            [&_h3]:text-xs [&_h3]:font-bold [&_p]:my-1"
                          dangerouslySetInnerHTML={{
                            __html: test.description || '<span className="text-gray-500">No description</span>'
                          }}
                        />
                                </div>

                      {/* Project Name */}
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">
                          {test.project?.name || 'No Project'}
                        </span>
                                </div>

                      {/* Status */}
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'Up Next' ? 'bg-gray-100 text-gray-700' :
                          test.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          test.status === 'Ready to analyze' ? 'bg-green-100 text-green-700' :
                          test.status === 'Running' ? 'bg-green-100 text-green-700' :
                          test.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {test.status || 'Unknown'}
                        </span>
                                </div>

                      {/* Due Date */}
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">
                          {test.dueDate ? formatDate2(test.dueDate) : 'No due date'}
                        </span>
                </div>

                      {/* Ice Score */}
                      <div className="flex items-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {test.score || test.keymetric?.currentValue || 'N/A'}
                        </span>
              </div>
                        </div>
                  ))}
                        </div>
              </CardContent>
            </Card>
                        </div>
        )}

        {/* Recent Ideas Section */}
        {me?.widgets?.recentIdeas !== false && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Ideas</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/projects')}
                >
                  View All Ideas
                </Button>
                                    </div>
                                  </div>

          <Card>
            <CardContent className="p-6">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 p-3 border-b text-sm font-medium text-muted-foreground mb-4">
                <div>Name</div>
                <div>Project</div>
                <div>Impact</div>
                <div>Created On</div>
                                  </div>

              <div className="grid gap-4">
                {filterDataByProject(ideasData)?.length > 0 ? (
                  filterDataByProject(ideasData).slice(0, 6).map((idea, index) => (
                    <div 
                      key={index} 
                      className="grid grid-cols-4 gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${idea.project?._id}/ideas`)}
                    >
                      {/* Idea Name */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{idea.name || 'Untitled Idea'}</h4>
                        <div 
                          className="text-xs text-muted-foreground truncate prose prose-xs max-w-none
                            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-1
                            [&_ul]:list-disc [&_ul]:ml-2 [&_ol]:list-decimal [&_ol]:ml-2
                            [&_li]:my-0.5 [&_a]:text-blue-600 [&_a]:underline
                            [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                            [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold
                            [&_h3]:text-xs [&_h3]:font-bold [&_p]:my-1"
                          dangerouslySetInnerHTML={{
                            __html: idea.description || '<span className="text-gray-500">No description</span>'
                          }}
                        />
                                </div>

                      {/* Project Name */}
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">
                          {idea.project?.name || 'No Project'}
                        </span>
                                </div>

                      {/* Impact */}
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          idea.impact >= 8 ? 'bg-green-100 text-green-700' :
                          idea.impact >= 6 ? 'bg-yellow-100 text-yellow-700' :
                          idea.impact >= 4 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {idea.impact || 'N/A'}/10
                        </span>
                                </div>

                      {/* Created On */}
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">
                          {idea.createdAt ? formatDate2(idea.createdAt) : 'Unknown'}
                        </span>
                                </div>
                                  </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No ideas available yet</p>
                                </div>
                  )}
                </div>
            </CardContent>
          </Card>
                    </div>
                  )}


        {/* Your Tasks Widget - Modern Style */}
        {me?.widgets?.yourTasks == true && (
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Your Tasks
                {tasksAssigned?.length !== 0 && (
                  <Badge className="bg-gray-100 text-gray-800">{tasksAssigned?.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {tasksAssigned?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-12 gap-4 p-3 border-b text-sm font-medium text-muted-foreground">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-4">Project</div>
                      <div className="col-span-2">Due</div>
                      <div className="col-span-2">Status</div>
                      </div>

                    {tasksAssigned.map((task, index) => {
                          return (
                            <NavLink
                          key={`task_${index}`}
                          to={`/projects/${task?.project?._id}/tests/${task?.test?._id}`}
                          className="block hover:bg-muted/50 transition-colors"
                        >
                          <div className="grid grid-cols-12 gap-4 p-3 border-b items-center">
                            <div className="col-span-4 text-sm font-medium">
                                    {task.name}
                                  </div>
                            <div className="col-span-4 text-sm text-muted-foreground">
                              {task.project?.name || 'No Project'}
                                  </div>
                            <div className="col-span-2 text-sm text-muted-foreground">
                              {task.dueDate ? formatDate2(task.dueDate) : 'No due date'}
                                  </div>
                                <div
                              className="col-span-2 flex justify-end"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                                    defaultChecked={task.status}
                                    onClick={(e) => {
                                      dispatch(
                                        updateTestTaskStatus({
                                          status: e.target.checked,
                                          taskId: task._id,
                                        })
                                      );
                                    }}
                                  />
                                </div>
                                </div>
                          </NavLink>
                        );
                      })}
                    </>
                  )}
                </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Check-ins Widget - Modern Style */}
        {me?.widgets?.pendingCheckins == true && (
          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Pending Check-ins
                {checkins?.filter((c) => c.status !== "On-Track").length !== 0 && (
                  <Badge className="bg-gray-100 text-gray-800">{checkins?.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {checkins?.filter((c) => c.status !== "On-Track").length !== 0 && (
                  <>
                    <div className="grid grid-cols-12 gap-4 p-3 border-b text-sm font-medium text-muted-foreground">
                      <div className="col-span-1">Progress</div>
                      <div className="col-span-5">Name</div>
                      <div className="col-span-4">Project</div>
                      <div className="col-span-2">Status</div>
                      </div>

                    {checkins
                      .filter((c) => c.status !== "On-Track")
                      .map((checkin, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-3 border-b items-center">
                          <div className="col-span-1">
                            <Badge variant="outline">
                              {checkin.metrics.length === 0 ? 0 : Math.round((checkin.metrics[checkin.metrics.length - 1].value / checkin.targetValue) * 100)}%
                            </Badge>
                                  </div>
                          <div className="col-span-5 text-sm font-medium">
                                  {checkin.name}
                                  </div>
                          <div className="col-span-4 text-sm text-muted-foreground">
                            {checkin.project?.name || 'No Project'}
                                  </div>
                          <div className="col-span-2">
                            <Badge className={checkin.status === 'Off-Track' ? 'bg-red-100 text-red-800' : checkin.status === 'At-Risk' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                                      {checkin.status}
                            </Badge>
                                  </div>
                                </div>
                      ))}
                    </>
                  )}
                </div>
            </CardContent>
          </Card>
        )}

        {/* Add all other widgets here with modern styling */}

        {/* Key Metrics Widget */}
        {me?.widgets?.keyMetrics == true && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {goalsData?.map((goal, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">Target: {goal.targetValue}</p>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Widget */}
        {me?.widgets?.activity == true && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New goal created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
                      </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Test completed</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                        </div>
                        </div>
            </CardContent>
          </Card>
        )}

        {/* North Star Metrics Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <NorthStarWidget />
          </div>
        </div>

                      </div>
                    </div>
    </div>
  );
}

export default Dashboard;
