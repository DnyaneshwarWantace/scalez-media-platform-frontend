import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnayticsData, selectanayticsData, updatespan, ideaTestData } from "../../redux/slices/anayticsSlice";
import { formatDate2, formatTime } from "../../utils/formatTime";
import { CSVLink } from "react-csv";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import Spinner from "../../components/common/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Download, Target, Award, Info, Activity } from "lucide-react";
import ReactECharts from "echarts-for-react";
function Analytics() {
  const [selectedMenu, setselectedMenu] = useState("All");
  const dispatch = useDispatch();
  const analyticsData = useSelector(selectanayticsData);
  const ideaTest = useSelector(ideaTestData);
  const [csvData, setcsvData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const countAllGoals = () => {
    let totalGoals = 0;
    analyticsData.forEach((project) => {
      totalGoals += project.goals;
    });
    return totalGoals;
  };

  const countAllWorkedLearnings = () => {
    let totalWorkedLearnings = 0;
    analyticsData.forEach((project) => {
      totalWorkedLearnings += project.workedLearnings;
    });
    return totalWorkedLearnings;
  };

  const countAllDidntWorkedLearnings = () => {
    let totalDidntWorkedLearnings = 0;
    analyticsData.forEach((project) => {
      totalDidntWorkedLearnings += project.didntWorkedLearnings;
    });
    return totalDidntWorkedLearnings;
  };

  const inconclusiveLearningsCount = () => {
    const total = analyticsData.reduce((acc, project) => {
      return acc + project.inconclusiveLearnings;
    }, 0);
    return total;
  };

  const learingAcquired = () => {
    let total = countAllDidntWorkedLearnings() + countAllWorkedLearnings() + inconclusiveLearningsCount();
    return total;
  };

  // ECharts configurations - Clean and consistent with other pages
  const ideasAndTestsChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      bottom: 10,
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ideaTest?.idea?.map((el) => formatDate2(el._id)) || [],
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      }
    },
    series: [
      {
        name: 'Ideas Created',
        type: 'line',
        data: ideaTest?.idea?.map((el) => el.amount) || [],
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'Tests Started',
        type: 'line',
        data: ideaTest?.test?.map((el) => el.amount) || [],
        smooth: true,
        lineStyle: {
          color: '#8b5cf6',
          width: 2
        },
        itemStyle: {
          color: '#8b5cf6'
        }
      }
    ]
  };

  const learningsChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ideaTest?.learning?.map((el) => formatDate2(el._id)) || [],
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      }
    },
    series: [
      {
        name: 'Cards Analyzed',
        type: 'bar',
        data: ideaTest?.learning?.map((el) => el.amount) || [],
        itemStyle: {
          color: '#10b981'
        }
      }
    ]
  };

  const growthLeverChartOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      bottom: 10,
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Growth Lever',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: [
          { value: ideaTest?.acquisition || 0, name: 'Acquisition', itemStyle: { color: '#3b82f6' } },
          { value: ideaTest?.activation || 0, name: 'Activation', itemStyle: { color: '#8b5cf6' } },
          { value: ideaTest?.referral || 0, name: 'Referral', itemStyle: { color: '#f59e0b' } },
          { value: ideaTest?.retention || 0, name: 'Retention', itemStyle: { color: '#ef4444' } },
          { value: ideaTest?.revenue || 0, name: 'Revenue', itemStyle: { color: '#10b981' } }
        ]
      }
    ]
  };

  const teamParticipationChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ideaTest?.labels || [],
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      },
      axisLabel: {
        color: '#97a4af',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#e7eaf3'
        }
      }
    },
    series: [
      {
        name: 'Members',
        type: 'line',
        data: ideaTest?.data || [],
        smooth: true,
        lineStyle: {
          color: '#6366f1',
          width: 2
        },
        itemStyle: {
          color: '#6366f1'
        }
      }
    ]
  };

  useEffect(() => {
    dispatch(getAnayticsData());
    setTimeout(() => {
      setShowLoader(false); 
    }, 2000);
  }, [selectedMenu]);

  useEffect(() => {
    let tempCSVData = [
      [
        "Project",
        "Status",
        "Created",
        "Updated",
        "Goals",
        "Ideas",
        "Tests",
        "Successful",
        "Unsuccessful",
        "Inconclusive",
        "Total",
        "Users",
        "W.A.U",
        "Active %",
      ],
    ];
    analyticsData.map((singleProject) => {
      tempCSVData.push([
        singleProject?.name,
        singleProject?.status,
        formatTime(singleProject.createdAt),
        formatTime(singleProject.updatedAt),
        singleProject?.goals,
        singleProject?.ideas,
        singleProject?.tests,
        singleProject?.tests,
        singleProject?.tests,
        singleProject?.tests,
        singleProject?.learnings,
        singleProject?.tests,
        singleProject?.tests,
        singleProject?.tests,
      ]);
    });

    setcsvData(tempCSVData);
  }, [analyticsData]);

  return (
    <div className="min-h-screen bg-background">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Spinner />
        </div>
      )}

      <div className="container mx-auto py-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Analytics</h1>
            <p className="text-sm text-gray-500">Track your team's performance and insights</p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              onValueChange={(value) => {
                dispatch(updatespan(value));
                dispatch(getAnayticsData());
              }}
              defaultValue="1week"
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="2weeks">2 Weeks</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>

            <CSVLink data={csvData} filename={"Analytics.csv"}>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CSVLink>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Projects Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
                  <h3 className="text-4xl font-bold">{analyticsData?.length || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Goals Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Goals</p>
                  <h3 className="text-4xl font-bold">{countAllGoals()}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learnings Acquired Card */}
          <Card className="relative group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-muted-foreground">Learnings Acquired</p>
                    <div
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      {showDropdown && (
                        <div className="absolute left-0 top-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px]">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Worked:</span>
                              <span className="font-semibold text-green-600">{countAllWorkedLearnings()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Didn't Work:</span>
                              <span className="font-semibold text-red-600">{countAllDidntWorkedLearnings()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Inconclusive:</span>
                              <span className="font-semibold text-yellow-600">{inconclusiveLearningsCount()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold">{learingAcquired()}</h3>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ideas Created and Tests Started */}
          <Card>
            <CardHeader>
              <CardTitle>Ideas Created & Tests Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ReactECharts option={ideasAndTestsChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </CardContent>
          </Card>

          {/* Learnings Acquired */}
          <Card>
            <CardHeader>
              <CardTitle>Learnings Acquired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ReactECharts option={learningsChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </CardContent>
          </Card>

          {/* Learnings by Growth Lever */}
          <Card>
            <CardHeader>
              <CardTitle>Learnings by Growth Lever</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ReactECharts option={growthLeverChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Team Participation */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Team Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ReactECharts option={teamParticipationChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Ideas Added</TableHead>
                    <TableHead>Nominations Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ideaTest?.userData?.map((el, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        <img
                          src={`${backendServerBaseURL}/${el.user.avatar}`}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        {el.user.firstName} {el.user.lastName}
                      </TableCell>
                      <TableCell>{el.user.ideaCount}</TableCell>
                      <TableCell>{el.user.ideaNominate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Project Based Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Based Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={7} className="text-center bg-gray-50">Workspace</TableHead>
                    <TableHead colSpan={4} className="text-center bg-gray-50">Learnings</TableHead>
                    <TableHead colSpan={1} className="text-center bg-gray-50">Activity</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead>Ideas</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Worked</TableHead>
                    <TableHead>Didn't Work</TableHead>
                    <TableHead>Inconclusive</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.map((singleProject, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{singleProject?.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            singleProject.status === "Active" ? "default" :
                            singleProject.status === "Completed" ? "secondary" :
                            singleProject.status === "On Hold" ? "outline" : "secondary"
                          }
                        >
                          {singleProject.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTime(singleProject.createdAt)}</TableCell>
                      <TableCell>{formatTime(singleProject.updatedAt)}</TableCell>
                      <TableCell>{singleProject.goals}</TableCell>
                      <TableCell>{singleProject.ideaCount}</TableCell>
                      <TableCell>{singleProject.ideaTest}</TableCell>
                      <TableCell>{singleProject.ideaSuccessful}</TableCell>
                      <TableCell>{singleProject.ideaUnsuccessful}</TableCell>
                      <TableCell>{singleProject.ideaInconclusive}</TableCell>
                      <TableCell>{singleProject.learnings}</TableCell>
                      <TableCell>{singleProject.team?.length + 1}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
