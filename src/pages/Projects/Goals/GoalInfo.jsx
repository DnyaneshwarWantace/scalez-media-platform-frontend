import moment from "moment";
import React, { useEffect, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Plus, Edit3, Share2, Archive, BarChart3, Bell, Edit, Trash2, TrendingUp, Target, Play, MessageSquare, UserPlus, Settings, Activity } from "lucide-react";
import ReactECharts from 'echarts-for-react';
import {
  addGoalComment,
  deleteGoalComment,
  deleteKeyMetricValue,
  getProjectCollaborators,
  getProjectUsers,
  readSingleGoal,
  selectProjectCollaboratos,
  selectProjectUsers,
  selectSingleGoalInfo,
  updateGoalComment,
  updateKeyMetricStatus,
  updateSelectedGoal,
  updateSelectedIdea,
  updateSelectedKeyMetric,
  getAllIdeas,
} from "../../../redux/slices/projectSlice";
import { getAllkeyMetrics } from "../../../redux/slices/settingSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatDate2, formatTime } from "../../../utils/formatTime";
import {
  hasPermission_create_goals,
  isTypeOwner,
  isRoleAdmin,
  isRoleMember,
  hasPermission_create_ideas,
  hasPermission_create_comments,
  hasPermission_mention_everyone,
} from "../../../utils/permissions";
import { getUsersFromTags, swapTags } from "../../../utils/tag.js";
import InviteCollaboratorsDialog from "../../Settings/InviteCollaboratorsDialog";
import CreateNewIdeaDialog from "../Ideas/CreateNewIdeaDialog";
import CreateNewGoalDialog from "./CreateNewGoalDialog";
import EditMetricValueDialog from "./EditMetricValueDialog";
import UpdateMetricDialog from "./UpdateMetricDialog";
import Spinner from "../../../components/common/Spinner";
import LoadingButton from "../../../components/common/LoadingButton";

function GoalInfo() {
  const [ideasForWeeklySales, setideasForWeeklySales] = useState([1, 2, 3]);
  const [selectedMenu, setselectedMenu] = useState("");
  const params = useParams();
  const projectId = params.projectId;
  const goalId = params.goalId;
  const dispatch = useDispatch();
  const singleGoalInfo = useSelector(selectSingleGoalInfo);
  const [ProjectsMenus, setprojectsMenus] = useState([]);
  let [selectedKeyMetric, setselectedKeyMetric] = useState(null);
  // console.log('selectedKeyMetric :>> ', selectedKeyMetric);
  const me = JSON.parse(localStorage.getItem("user", ""));
  const [comment, setcomment] = useState("");
  const [comment2, setcomment2] = useState("");
  const projectUsers = useSelector(selectProjectUsers);
  const projectCollaborators = useSelector(selectProjectCollaboratos);
  const [editingComment, seteditingComment] = useState(0);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const [selectedTab, setselectedTab] = useState("About Goal");
  const navigate = useNavigate();
  let [selectedKeyMetricIndex, setselectedKeyMetricIndex] = useState(0);
  const [isCreateGoalDialogOpen, setIsCreateGoalDialogOpen] = useState(false);
  const [isUpdateMetricDialogOpen, setIsUpdateMetricDialogOpen] = useState(false);


  const [showLoader, setShowLoader] = useState(true);
  const [isSubmitting, setisSubmitting] = useState(false);

  // Function to generate comprehensive activity data
  const generateGoalActivities = () => {
    const activities = [];

    // Add comments as activities
    if (singleGoalInfo?.comments) {
      singleGoalInfo.comments.forEach(comment => {
        activities.push({
          id: `comment-${comment._id}`,
          type: 'comment',
          user: comment.createdBy,
          action: 'commented',
          description: comment.comment,
          timestamp: comment.createdAt,
          icon: MessageSquare,
          color: 'text-blue-600'
        });
      });
    }

    // Add metric updates as activities
    if (singleGoalInfo?.keymetric) {
      singleGoalInfo.keymetric.forEach(metric => {
        if (metric.metrics && metric.metrics.length > 0) {
          metric.metrics.forEach((metricValue, index) => {
            activities.push({
              id: `metric-${metric._id}-${index}`,
              type: 'metric_update',
              user: metricValue.updatedBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
              action: 'updated metric',
              description: `${metric.name}: ${metricValue.value}`,
              timestamp: metricValue.updatedAt || metricValue.createdAt,
              icon: BarChart3,
              color: 'text-green-600'
            });
          });
        }
      });
    }

    // Add goal creation activity
    if (singleGoalInfo?.createdAt) {
      activities.push({
        id: `goal-created-${singleGoalInfo._id}`,
        type: 'goal_created',
        user: singleGoalInfo.createdBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
        action: 'created goal',
        description: singleGoalInfo.name,
        timestamp: singleGoalInfo.createdAt,
        icon: Target,
        color: 'text-purple-600'
      });
    }

    // Add goal updates activity
    if (singleGoalInfo?.updatedAt && singleGoalInfo.updatedAt !== singleGoalInfo.createdAt) {
      activities.push({
        id: `goal-updated-${singleGoalInfo._id}`,
        type: 'goal_updated',
        user: singleGoalInfo.updatedBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
        action: 'updated goal',
        description: 'Goal details were modified',
        timestamp: singleGoalInfo.updatedAt,
        icon: Edit3,
        color: 'text-orange-600'
      });
    }

    // Add ideas created for this goal
    if (singleGoalInfo?.ideas) {
      singleGoalInfo.ideas.forEach(idea => {
        activities.push({
          id: `idea-${idea._id}`,
          type: 'idea_created',
          user: idea.createdBy,
          action: 'created idea',
          description: idea.name,
          timestamp: idea.createdAt,
          icon: Plus,
          color: 'text-indigo-600'
        });
      });
    }

    // Add tests created for this goal
    if (singleGoalInfo?.tests) {
      singleGoalInfo.tests.forEach(test => {
        activities.push({
          id: `test-${test._id}`,
          type: 'test_created',
          user: test.createdBy,
          action: 'created test',
          description: test.name,
          timestamp: test.createdAt,
          icon: Play,
          color: 'text-red-600'
        });
      });
    }

    // Sort activities by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // useEffect(() => {
  //   if (singleGoalInfo) {
  //     // setShowLoader(false); 
  //   } else {
  //     // setShowLoader(true); 
  //   }
  // }, [singleGoalInfo]);

  useEffect(() => {
    dispatch(readSingleGoal({ goalId: params.goalId }));
    console.log('params.goalId :>> ', params.goalId);
    dispatch(getProjectUsers({ projectId }));
    dispatch(getAllkeyMetrics());
    dispatch(getProjectCollaborators({ projectId }));
    setTimeout(() => {
      setShowLoader(false); 
    }, 3000); 
  }, []);

  useEffect(() => {
    if (singleGoalInfo) {
      setprojectsMenus(
        singleGoalInfo?.keymetric?.map((k) => {
          return { name: k.name, id: k._id };
        })
      );

      setselectedKeyMetric(singleGoalInfo.keymetric[selectedKeyMetricIndex]);
      let tempMenu = singleGoalInfo.keymetric[selectedKeyMetricIndex];
      setselectedMenu({ name: tempMenu?.name, id: tempMenu?._id });

      // console.log('selectedKeyMetricIndex :>> ', selectedKeyMetricIndex);
      //       console.log('setselectedKeyMetric(singleGoalInfo.keymetric[selectedKeyMetricIndex', setselectedKeyMetric(singleGoalInfo.keymetric[selectedKeyMetricIndex])
      // );
      // console.log('singleGoalInfo 11:>> ', singleGoalInfo);
      // console.log('selectedKeyMetric 11:>> ', selectedKeyMetric);
      // if(selectedKeyMetric){
      //   setselectedKeyMetric(singleGoalInfo.keymetric.filter((m) => m._id === selectedKeyMetric?._id)[0]);
      // }
      if (selectedMenu?.id === ProjectsMenus[selectedKeyMetricIndex]?.id) {
        setselectedKeyMetricIndex(0);
      }
    }
  }, [singleGoalInfo, selectedKeyMetric]);

  useEffect(() => {
    if (selectedMenu == "" && ProjectsMenus.length !== 0) {
      setselectedMenu(ProjectsMenus[0]);
    }
  }, [ProjectsMenus]);

  useEffect(() => {
    // console.log('selectedMenu ---:>> ', selectedMenu);
    if (singleGoalInfo && singleGoalInfo?.keymetric.length !== 0) {
      setselectedKeyMetric(singleGoalInfo.keymetric.filter((k) => k._id === selectedMenu.id)[0]);
    }
  }, [selectedMenu]);

  const keymetricProgressPercent = () => {
    const currentValue = selectedKeyMetric?.metrics?.length === 0 ? 0 : selectedKeyMetric?.metrics[selectedKeyMetric?.metrics?.length - 1].value;
    const targetValue = selectedKeyMetric?.targetValue;
    const startValue = selectedKeyMetric?.startValue || 0;
    
    if (!targetValue || targetValue === 0) return 0;
    
    // Calculate progress from start to target
    const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress))); // Clamp between 0-100%
  };

  const getActualProgressPercent = () => {
    const currentValue = selectedKeyMetric?.metrics?.length === 0 ? 0 : selectedKeyMetric?.metrics[selectedKeyMetric?.metrics?.length - 1].value;
    const targetValue = selectedKeyMetric?.targetValue;
    const startValue = selectedKeyMetric?.startValue || 0;
    
    if (!targetValue || targetValue === 0) return 0;
    
    // Calculate actual percentage (can exceed 100%)
    const actualProgress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
    return Math.round(actualProgress);
  };

  const getChartOption = () => {
    const currentValue = selectedKeyMetric?.metrics?.length === 0 ? 0 : selectedKeyMetric?.metrics[selectedKeyMetric?.metrics?.length - 1].value;
    const targetValue = selectedKeyMetric?.targetValue;
    const startValue = selectedKeyMetric?.startValue || 0;
    const metrics = selectedKeyMetric?.metrics || [];

    return {
      title: {
        text: selectedKeyMetric?.name || 'Key Metric Progress',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Current Value', 'Target Value', 'Start Value'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.map((m) => formatDate2(m.date)),
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Current Value',
          type: 'line',
          data: metrics.map((m) => m.value),
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 3
          },
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(59, 130, 246, 0.3)'
              }, {
                offset: 1, color: 'rgba(59, 130, 246, 0.05)'
              }]
            }
          }
        },
        {
          name: 'Target Value',
          type: 'line',
          data: new Array(metrics.length).fill(targetValue),
          lineStyle: {
            color: '#10b981',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#10b981'
          },
          symbol: 'none'
        },
        {
          name: 'Start Value',
          type: 'line',
          data: new Array(metrics.length).fill(startValue),
          lineStyle: {
            color: '#f59e0b',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#f59e0b'
          },
          symbol: 'none'
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {showLoader ? (
        /* Skeleton Loader */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-2">
                    <div className="skeleton-placeholder h-6 w-64"></div>
                    <div className="skeleton-placeholder h-4 w-32"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="skeleton-placeholder h-8 w-16"></div>
                    <div className="skeleton-placeholder h-8 w-16"></div>
                  </div>
                </div>
                <div className="space-y-4">
    <div>
                    <div className="skeleton-placeholder h-4 w-20 mb-2"></div>
                    <div className="skeleton-placeholder h-4 w-full"></div>
                    <div className="skeleton-placeholder h-4 w-3/4"></div>
          </div>
                  <div className="flex gap-8">
                    <div>
                      <div className="skeleton-placeholder h-4 w-16 mb-1"></div>
                      <div className="skeleton-placeholder h-4 w-24"></div>
                    </div>
                    <div>
                      <div className="skeleton-placeholder h-4 w-20 mb-1"></div>
                      <div className="skeleton-placeholder h-6 w-16"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Goals Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton-placeholder h-6 w-32"></div>
                <div className="skeleton-placeholder h-8 w-32"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="skeleton-placeholder h-48 w-full mb-4"></div>
                    <div className="skeleton-placeholder h-4 w-16 mb-2"></div>
                    <div className="skeleton-placeholder h-2 w-full"></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="skeleton-placeholder h-4 w-20 mb-2"></div>
                          <div className="skeleton-placeholder h-8 w-16"></div>
                        </div>
                        <div className="skeleton-placeholder h-8 w-full"></div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="skeleton-placeholder h-4 w-20 mb-2"></div>
                          <div className="skeleton-placeholder h-8 w-16"></div>
                        </div>
                        <div className="skeleton-placeholder h-8 w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
          </div>

            {/* Ideas Section Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="skeleton-placeholder h-6 w-16"></div>
                  <div className="skeleton-placeholder h-8 w-32"></div>
              </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="skeleton-placeholder h-10 w-10 rounded-full"></div>
                        <div className="flex-1">
                          <div className="skeleton-placeholder h-4 w-32 mb-1"></div>
                          <div className="skeleton-placeholder h-3 w-24"></div>
            </div>
                      </div>
                      <div className="skeleton-placeholder h-6 w-8"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tests Section Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="skeleton-placeholder h-6 w-16"></div>
                </div>
                <div className="space-y-0 border border-gray-200 rounded-lg">
                  {[1, 2].map((i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 py-4 px-4 border-b last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="skeleton-placeholder h-8 w-8 rounded-full"></div>
                        <div className="skeleton-placeholder h-4 w-24"></div>
              </div>
                      <div className="col-span-2">
                        <div className="skeleton-placeholder h-4 w-12"></div>
            </div>
                      <div className="col-span-2">
                        <div className="skeleton-placeholder h-4 w-16"></div>
          </div>
                      <div className="col-span-2">
                        <div className="skeleton-placeholder h-6 w-16"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="skeleton-placeholder h-3 w-12"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="skeleton-placeholder h-6 w-8"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section Skeleton */}
            <div className="mt-8">
              <div className="skeleton-placeholder h-6 w-20 mb-4"></div>
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex gap-3 mb-4">
                    <div className="skeleton-placeholder h-10 w-10 rounded-full"></div>
                    <div className="skeleton-placeholder h-12 flex-1"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="skeleton-placeholder h-8 w-20"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="skeleton-placeholder h-4 w-24 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="skeleton-placeholder h-6 w-6 rounded-full"></div>
                      <div className="flex-1">
                        <div className="skeleton-placeholder h-4 w-32 mb-1"></div>
                        <div className="skeleton-placeholder h-3 w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Ideas Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="skeleton-placeholder h-4 w-24 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="pb-3 border-b last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="skeleton-placeholder h-4 w-24"></div>
                        <div className="skeleton-placeholder h-5 w-6"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="skeleton-placeholder h-5 w-5 rounded-full"></div>
                        <div className="skeleton-placeholder h-3 w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Actual Content */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h1 className="text-xl font-medium">{singleGoalInfo?.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {openedProject?.name} / Goals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                      onClick={() => {
                      setselectedTab("About Goal");
                      dispatch(updateSelectedGoal(singleGoalInfo));
                      setIsCreateGoalDialogOpen(true);
                    }}
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                      </div>
                    </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm leading-relaxed">{singleGoalInfo?.description || 'No description provided'}</p>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <h3 className="text-xs text-muted-foreground mb-1">Created On</h3>
                    <p className="text-sm">{formatTime(singleGoalInfo?.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-muted-foreground mb-1">Confidence Meter</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      {singleGoalInfo?.confidence || 'Not Set'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Metric Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Metric Goals</h2>
            {hasPermission_create_goals() && (
              <button
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setselectedTab("Key Metrics");
                          dispatch(updateSelectedGoal(singleGoalInfo));
                  setIsCreateGoalDialogOpen(true);
                }}
              >
                <Plus className="inline h-4 w-4 mr-2" />
                Add Key Metric
              </button>
            )}
                    </div>

          {/* Tabs Navigation */}
          <div className="border-b border-border">
            <div className="flex items-center">
              {ProjectsMenus.map((menu, index) => (
                <button
                  key={menu.id}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    selectedMenu.id === menu.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    setselectedMenu(menu);
                    setselectedKeyMetricIndex(index);
                  }}
                >
                  {menu.name}
                  {selectedMenu.id === menu.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                  )}
                </button>
              ))}
              </div>
            </div>

            {ProjectsMenus.length !== 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Chart Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progress Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ReactECharts 
                      option={getChartOption()} 
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Progress & Metrics Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {getActualProgressPercent()}%
                        </span>
                        {getActualProgressPercent() > 100 && (
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            Exceeded Target
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                     <div className="space-y-2">
                       <div className="w-full bg-white border border-gray-300 rounded-full h-3 overflow-hidden">
                         <div
                           className="bg-black h-full rounded-full transition-all duration-300"
                           style={{ width: `${keymetricProgressPercent()}%` }}
                         />
                       </div>
                       <div className="flex justify-between text-xs text-muted-foreground">
                         <span>0%</span>
                         <span>100%</span>
                         {getActualProgressPercent() > 100 && (
                           <span className="text-primary font-medium">
                             {getActualProgressPercent()}%
                           </span>
                         )}
                       </div>
                     </div>
                  </div>

                  {/* Metrics Values */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Play className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Start Value</p>
                      <p className="font-semibold text-foreground">
                        {selectedKeyMetric?.startValue || 0}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Target Value</p>
                      <p className="font-semibold text-foreground">
                        {selectedKeyMetric?.targetValue || 0}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                      <p className="font-semibold text-primary">
                        {selectedKeyMetric?.metrics?.length === 0 ? 0 : selectedKeyMetric?.metrics[selectedKeyMetric?.metrics?.length - 1].value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              </div>
            )}

            {/* Metrics Info Card - Full Width */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Current Value</p>
                      <h2 className="text-4xl font-bold tracking-tight">
                      {selectedKeyMetric?.metrics?.length === 0
                        ? 0
                        : selectedKeyMetric?.metrics[
                            selectedKeyMetric?.metrics?.length - 1
                          ].value}
                    </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                      as of {formatTime(singleGoalInfo?.startDate)}
                    </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        dispatch(updateSelectedKeyMetric(selectedKeyMetric));
                        setIsUpdateMetricDialogOpen(true);
                      }}
                      disabled={!hasPermission_create_goals()}
                    >
                      Update Value
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                          Target Value
                        </p>
                      <h2 className="text-4xl font-bold tracking-tight">{selectedKeyMetric?.targetValue}</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                      as of {formatTime(singleGoalInfo?.endDate)}
                    </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
                      <Select
                        value={selectedKeyMetric?.status || "On-Track"}
                        onValueChange={(value) => {
                          if (hasPermission_create_goals()) {
                            dispatch(
                              updateKeyMetricStatus({
                                status: value,
                                keymetricId: selectedKeyMetric?._id,
                                goalId: params.goalId,
                              })
                            );
                          }
                        }}
                        disabled={!hasPermission_create_goals()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On-Track">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-black"></div>
                              <span>On-Track</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Off-Track">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span>Off-Track</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="At-Risk">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span>At-Risk</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Achieved">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Achieved</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                  </div>

                {/* Metrics Updates Table */}
                  {singleGoalInfo.keymetric[selectedKeyMetricIndex] &&
                    selectedKeyMetric?.metrics.length !== 0 && (
                    <div className="mt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b">
                            <tr>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                Value
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                Updated
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                Member
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {singleGoalInfo.keymetric[
                              selectedKeyMetricIndex
                            ]?.metrics?.map((metricUpdate) => {
                              return (
                                <tr className="border-b hover:bg-gray-50" key={metricUpdate?._id}>
                                  <td className="py-3 px-4 text-sm">
                                    {metricUpdate?.value}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    {formatTime(metricUpdate?.updatedAt)}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <img
                                        className="w-8 h-8 rounded-full"
                                      src={`${backendServerBaseURL}/${metricUpdate?.createdBy.avatar}`}
                                      alt=""
                                    />
                                    {metricUpdate
                                      ? [
                                          metricUpdate?.createdBy.firstName,
                                          metricUpdate?.createdBy.lastName,
                                        ].join(" ")
                                      : "-"}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      onClick={() => {
                                        dispatch(
                                          updateSelectedKeyMetric(
                                            metricUpdate
                                          )
                                        );
                                      }}
                                      >
                                        <Edit className="h-4 w-4 text-gray-600" />
                                      </button>
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      onClick={() => {
                                        dispatch(
                                          deleteKeyMetricValue({
                                            keymetricId: metricUpdate?._id,
                                            goalId: goalId,
                                          })
                                        );
                                      }}
                                      >
                                        <Trash2 className="h-4 w-4 text-gray-600" />
                                      </button>
                                    </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>

        {/* Ideas Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Ideas</h2>
              {hasPermission_create_ideas() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    dispatch(updateSelectedIdea(null));
                    dispatch(readSingleGoal({ goalId: params.goalId }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Suggest an Idea
                </Button>
              )}
            </div>

            {singleGoalInfo?.ideas && singleGoalInfo.ideas.length > 0 ? (
              <div>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg border border-gray-200 border-b-0">
                  <div className="col-span-5">
                    <p className="text-xs font-medium text-muted-foreground">Name</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">Lever</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">Created By</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">Date</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs font-medium text-muted-foreground">I.C.E Score</p>
                  </div>
                </div>

                {/* Data Rows */}
                <div className="space-y-0 border border-gray-200 border-t-0 rounded-b-lg">
                  {singleGoalInfo.ideas.map((idea, index) => (
                    <div
                      key={idea._id}
                      className={`grid grid-cols-12 gap-4 py-4 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index !== singleGoalInfo.ideas.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={() => {
                        dispatch(updateSelectedIdea(idea));
                        navigate(`/projects/${projectId}/ideas/${idea._id}`);
                      }}
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <img
                          src={`${backendServerBaseURL}/${idea.createdBy?.avatar}`}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          alt=""
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">{idea?.name}</h3>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <p className="text-sm text-muted-foreground truncate">{idea?.lever}</p>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <p className="text-sm truncate">
                          {idea.createdBy?.firstName} {idea.createdBy?.lastName}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <p className="text-xs text-muted-foreground">
                          {formatTime(idea?.createdAt)}
                        </p>
                      </div>

                      <div className="col-span-1 flex items-center">
                        <Badge className="bg-gray-100 text-gray-800 text-xs font-medium">
                          {idea?.score}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No ideas yet</p>
                {hasPermission_create_ideas() && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      dispatch(updateSelectedIdea(null));
                      dispatch(readSingleGoal({ goalId: params.goalId }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Idea
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tests Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Tests</h2>
            </div>

            {singleGoalInfo?.tests && singleGoalInfo.tests.length > 0 ? (
              <div>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-white rounded-t-lg border border-gray-200 border-b-0">
                  <div className="col-span-4">
                    <p className="text-xs font-medium text-black">Name</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-black">Tasks</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-black">Lever</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-black">Created & Assigned</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs font-medium text-black">Date</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs font-medium text-black">I.C.E Score</p>
                  </div>
                </div>

                {/* Data Rows */}
                <div className="space-y-0 border border-gray-200 border-t-0 rounded-b-lg">
                  {singleGoalInfo.tests.map((test, index) => (
                    <div
                      key={test._id}
                      className={`grid grid-cols-12 gap-4 py-4 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index !== singleGoalInfo.tests.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={() => {
                        navigate(`/projects/${projectId}/tests/${test._id}`);
                      }}
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <img
                          src={`${backendServerBaseURL}/${test.createdBy.avatar}`}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          alt=""
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate text-black">{test.name}</h3>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black">
                          {test.tasks.filter((t) => t.status === true).length}/{test.tasks.length}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black truncate">{test.lever}</p>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <AvatarGroup
                          listOfUrls={test.assignedTo.map(
                            (mem) => `${backendServerBaseURL}/${mem?.avatar}`
                          )}
                          userName={test.assignedTo.map((t) => [
                            t?.firstName,
                            `${backendServerBaseURL}/${t?.avatar}`,
                            t?.lastName,
                          ])}
                          show={3}
                          total={test.assignedTo.length}
                        />
                      </div>

                      <div className="col-span-1 flex items-center">
                        <p className="text-xs text-black">
                        {formatTime(test.createdAt)}
                        </p>
                      </div>

                      <div className="col-span-1 flex items-center">
                        <Badge className="bg-gray-100 text-gray-800 text-xs font-medium">
                          {test.score}
                        </Badge>
          </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No tests yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          {hasPermission_create_comments() && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-4">
                <img
                  src={`${backendServerBaseURL}/${me.avatar}`}
                    className="w-10 h-10 rounded-full"
                  alt=""
                />

                <MentionsInput
                  className="mentions w-100"
                  value={comment}
                  placeholder="Comment Here"
                  onChange={(e) => {
                    setcomment(e.target.value);
                  }}
                >
                  <Mention
                    className="mentions__mention"
                    markup="@{{__type__||__id__||__display__}}"
                    trigger="@"
                    renderSuggestion={(
                      entry,
                      search,
                      highlightedDisplay,
                      index,
                      focused
                    ) => {
                      return (
                          <div className="p-2 border-b flex items-center gap-2">
                          <img
                            src={`${backendServerBaseURL}/${projectUsers[index].avatar}`}
                              className="w-8 h-8 rounded-full"
                            alt=""
                          />
                            <p className="mb-0 text-sm">
                            {projectUsers[index].firstName}{" "}
                            {projectUsers[index].lastName}
                          </p>
                        </div>
                      );
                    }}
                    data={projectUsers?.map((pu) => {
                      return {
                        id: pu._id,
                        display: `@${pu.firstName} ${pu.lastName}`,
                      };
                    })}
                  />
                </MentionsInput>
              </div>

                <div className="flex justify-end">
                <LoadingButton
                  loading={isSubmitting}
                    className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"   
                  onClick={async () => {
                    setisSubmitting(true);
                   await dispatch(addGoalComment({ goalId, comment }));
                    setcomment("");
                    setTimeout(() => {
                      setisSubmitting(false);
                    }, 200); 
                  }}
                  disabled={
                    comment.length > 0 && hasPermission_create_comments()
                      ? false
                      : true
                  }
                >
                  Comment
                </LoadingButton>
              </div>
              </CardContent>
            </Card>
          )}

            {/* Saved Comments */}
          {hasPermission_create_comments() && (
            <div className="space-y-4">
              {singleGoalInfo?.comments?.map((c) => {
                return (
                  <Card key={c._id}>
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                      <img
                        src={`${backendServerBaseURL}/${c.createdBy.avatar}`}
                          className="w-10 h-10 rounded-full"
                        alt=""
                      />
                        
                    {editingComment !== c._id && (
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{`${c.createdBy.firstName} ${c.createdBy.lastName}`}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                            {moment(new Date(c.createdAt)).fromNow()}
                          </p>
                                {hasPermission_create_comments() && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                        <Edit className="h-4 w-4 text-gray-600" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                    onClick={() => {
                                      seteditingComment(c._id);
                                      setcomment2(c.comment);
                                    }}
                                  >
                                    Edit Comment
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                    onClick={() => {
                                      dispatch(
                                        deleteGoalComment({
                                          goalId,
                                          commentId: c._id,
                                        })
                                      );
                                    }}
                                  >
                                    Delete Comment
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                          )}
                              </div>
                        </div>

                            <div className="text-sm">
                          {c.comment && swapTags(c.comment)}
                        </div>
                      </div>
                    )}

                    {editingComment === c._id && (
                          <div className="flex-1">
                        <MentionsInput
                              className="mentions w-full mb-3"
                          value={comment2}
                          placeholder="Comment Here"
                          onChange={(e) => {
                            setcomment2(e.target.value);
                          }}
                        >
                          <Mention
                            className="mentions__mention"
                            markup="@{{__type__||__id__||__display__}}"
                            trigger="@"
                            renderSuggestion={(
                              entry,
                              search,
                              highlightedDisplay,
                              index,
                              focused
                            ) => {
                              return (
                                    <div className="p-2 border-b flex items-center gap-2">
                                  <img
                                    src={`${backendServerBaseURL}/${projectUsers[index].avatar}`}
                                        className="w-8 h-8 rounded-full"
                                    alt=""
                                  />
                                      <p className="mb-0 text-sm">
                                    {projectUsers[index].firstName}{" "}
                                    {projectUsers[index].lastName}
                                  </p>
                                </div>
                              );
                            }}
                            data={projectUsers?.map((pu) => {
                              return {
                                id: pu._id,
                                display: `@${pu.firstName} ${pu.lastName}`,
                              };
                            })}
                          />
                        </MentionsInput>

                            <div className="flex justify-end gap-2">
                          <button
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              seteditingComment(0);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            onClick={() => {
                              const commentData = c;
                              dispatch(
                                updateGoalComment({
                                  commentId: commentData._id,
                                  comment: comment2,
                                  goalId,
                                })
                              );
                              seteditingComment(0);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          )}
              </div>
            </div>
        {/* Left Column End */}

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Recent Activity</h3>
                <Badge className="bg-gray-100 text-gray-800 text-xs">
                  {generateGoalActivities().length}
                </Badge>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generateGoalActivities().slice(0, 10).map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="relative">
                        <img
                          src={`${backendServerBaseURL}/${activity.user?.avatar}`}
                          className="w-6 h-6 rounded-full flex-shrink-0"
                          alt=""
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-white border border-gray-200 flex items-center justify-center`}>
                          <IconComponent className={`w-2 h-2 ${activity.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-tight m-0">
                          <span className="font-medium">{activity.user?.firstName} {activity.user?.lastName}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground truncate leading-tight m-0 mt-1" title={activity.description}>
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight m-0 mt-1">{moment(activity.timestamp).fromNow()}</p>
                      </div>
                    </div>
                  );
                })}
                {generateGoalActivities().length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Ideas */}
          {singleGoalInfo?.ideas && singleGoalInfo.ideas.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium mb-4">Related Ideas ({singleGoalInfo.ideas.length})</h3>
                <div className="space-y-3">
                  {singleGoalInfo.ideas.slice(0, 5).map((idea) => (
                    <div
                      key={idea._id}
                      className="pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => {
                        dispatch(updateSelectedIdea(idea));
                        navigate(`/projects/${projectId}/ideas/${idea._id}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium truncate flex-1">{idea.name}</p>
                        <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs">
                          {idea.score}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${backendServerBaseURL}/${idea.createdBy?.avatar}`}
                          className="w-5 h-5 rounded-full"
                      alt=""
                        />
                        <span className="text-xs text-muted-foreground">
                          {idea.createdBy?.firstName} {idea.createdBy?.lastName}
                        </span>
                    </div>
                  </div>
                  ))}
          </div>
              </CardContent>
            </Card>
          )}

          {/* Related Tests */}
          {singleGoalInfo?.tests && singleGoalInfo.tests.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium mb-4">Related Tests ({singleGoalInfo.tests.length})</h3>
                <div className="space-y-3">
                  {singleGoalInfo.tests.slice(0, 5).map((test) => (
                    <div
                      key={test._id}
                      className="pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => {
                        navigate(`/projects/${projectId}/tests/${test._id}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium truncate flex-1">{test.name}</p>
                        <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs">
                          {test.score}
                        </Badge>
              </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={`${backendServerBaseURL}/${test.createdBy?.avatar}`}
                            className="w-5 h-5 rounded-full"
                            alt=""
                          />
                          <span className="text-xs text-muted-foreground">
                            {test.createdBy?.firstName} {test.createdBy?.lastName}
                          </span>
              </div>
                        <span className="text-xs text-muted-foreground">
                          {test.tasks.filter((t) => t.status === true).length}/{test.tasks.length}
                        </span>
            </div>
              </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Learnings */}
          {singleGoalInfo?.learnings && singleGoalInfo.learnings.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium mb-4">Related Learnings ({singleGoalInfo.learnings.length})</h3>
                <div className="space-y-3">
                  {singleGoalInfo.learnings.slice(0, 5).map((learning) => (
                    <div
                      key={learning._id}
                      className="pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => {
                        navigate(`/projects/${projectId}/learnings/${learning._id}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium truncate flex-1">{learning.name || learning.title}</p>
                        {learning.result && (
                          <Badge className={`ml-2 text-xs ${
                            learning.result === 'Positive' ? 'bg-green-100 text-green-700' :
                            learning.result === 'Negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {learning.result}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${backendServerBaseURL}/${learning.createdBy?.avatar}`}
                          className="w-5 h-5 rounded-full"
                          alt=""
                        />
                        <span className="text-xs text-muted-foreground">
                          {learning.createdBy?.firstName} {learning.createdBy?.lastName}
                        </span>
                    </div>
        </div>
                  ))}
      </div>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Left Column End */}

      {/* Modals */}
      <UpdateMetricDialog 
        open={isUpdateMetricDialogOpen} 
        onOpenChange={setIsUpdateMetricDialogOpen} 
      />
      <CreateNewGoalDialog
        openRequestIdeaDialog={() => {}}
        selectedTab={selectedTab}
        setselectedTab={setselectedTab}
        open={isCreateGoalDialogOpen}
        onOpenChange={setIsCreateGoalDialogOpen}
      />
      <InviteCollaboratorsDialog />
      <CreateNewIdeaDialog selectedGoal={singleGoalInfo} />
      <EditMetricValueDialog />
        </div>
      )}
    </div>
  );
}

export default GoalInfo;
