import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  getGrowthData,
  getIdeasAndTestChartData,
  getlearningsAcquiredGraphData,
  getlearningsByGrowthLeverGraphData,
  getTeamPartitionGraphData,
  selectgrowthData,
  selectgrowthSpan,
  selectideasCreatedAndTestStartedGraphData,
  selectinsightsSpan,
  selectlearningsAcquiredGraphData,
  selectlearningsByGrowthLeverGraphData,
  selectWeeklyTeamPartcipationGraphData,
  updategrowthSpan,
  updateinsightsSpan,
} from "../../../redux/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatDate2, formatDate4 } from "../../../utils/formatTime";
import moment from "moment";
import TourModal from "../Tour/TourModal";
import { saveAs } from "file-saver";
import Spinner from "../../../components/common/Spinner";

function Insights() {
  const insights = [1, 2];
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const projectId = params.projectId;
  const insightsSpan = useSelector(selectinsightsSpan);
  const teamContributions = [1, 2, 3, 4, 5, 6, 7];
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const ideasCreatedAndTestStartedGraphData = useSelector(selectideasCreatedAndTestStartedGraphData);
  const learningsAcquiredGraphData = useSelector(selectlearningsAcquiredGraphData);
  console.log('learningsAcquiredGraphData :>> ', learningsAcquiredGraphData);
  const learningsByGrowthLeverGraphData = useSelector(selectlearningsByGrowthLeverGraphData);
  const WeeklyTeamPartcipationGraphData = useSelector(selectWeeklyTeamPartcipationGraphData);
  console.log('WeeklyTeamPartcipationGraphData :>> ', WeeklyTeamPartcipationGraphData);
  const growthData = useSelector(selectgrowthData);
  const growthSpan = useSelector(selectgrowthSpan);
  const [showLoader, setShowLoader] = useState(true);

console.log("growthdata",growthData)
  useEffect(() => {
    dispatch(getIdeasAndTestChartData({ projectId }));
    dispatch(getlearningsAcquiredGraphData({ projectId }));
    dispatch(getlearningsByGrowthLeverGraphData({ projectId }));
    dispatch(getTeamPartitionGraphData({ projectId }));
    dispatch(getGrowthData({ projectId }));
    setTimeout(() => {
      setShowLoader(false); 
    }, 2000);
  }, [insightsSpan, growthSpan]);

  // ECharts refs for downloads
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);

  const downloadChart = (chartRef, filename) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      const url = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    }
  };


   const countAllIdeas = () => {
     let totalIdeas = 0;
     growthData?.projectCount?.forEach((project) => {
       totalIdeas += project.countIdea;
     });
     return totalIdeas;
   };
   const countAllTest = () => {
     let totalTest = 0;
     growthData?.projectCount?.forEach((project) => {
       totalTest += project.countTest;
     });
     return totalTest;
   };

  // ECharts Options
  const ideasTestsChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' },
      axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
    },
    legend: {
      data: ['Ideas Created', 'Tests Started'],
      bottom: 10,
      textStyle: { color: '#6b7280' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ideasCreatedAndTestStartedGraphData?.ideasData?.labels || [],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: 'Ideas Created',
        type: 'line',
        smooth: true,
        data: ideasCreatedAndTestStartedGraphData?.ideasData?.data || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(215, 118, 49, 0.3)' },
              { offset: 1, color: 'rgba(215, 118, 49, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#D77631', width: 3 },
        itemStyle: { color: '#D77631' },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: 'Tests Started',
        type: 'line',
        smooth: true,
        data: ideasCreatedAndTestStartedGraphData?.testsData?.data || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(221, 194, 56, 0.3)' },
              { offset: 1, color: 'rgba(221, 194, 56, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#DDC238', width: 3 },
        itemStyle: { color: '#DDC238' },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  };

  const learningsAcquiredChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' },
      axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
    },
    legend: {
      data: ['Learnings'],
      bottom: 10,
      textStyle: { color: '#6b7280' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: learningsAcquiredGraphData?.labels || [],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: 'Learnings',
        type: 'line',
        smooth: true,
        data: learningsAcquiredGraphData?.data || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56, 100, 221, 0.3)' },
              { offset: 1, color: 'rgba(56, 100, 221, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#3864DD', width: 3 },
        itemStyle: { color: '#3864DD' },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  };

  const learningsByLeverChartOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 10,
      textStyle: { color: '#6b7280' }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: '#374151'
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        },
        data: [
          { value: learningsByGrowthLeverGraphData?.Acquisition || 0, name: 'Acquisition', itemStyle: { color: '#7093F2' } },
          { value: learningsByGrowthLeverGraphData?.Activation || 0, name: 'Activation', itemStyle: { color: '#F2DD70' } },
          { value: learningsByGrowthLeverGraphData?.Referral || 0, name: 'Referral', itemStyle: { color: '#D77631' } },
          { value: learningsByGrowthLeverGraphData?.Retention || 0, name: 'Retention', itemStyle: { color: '#E95050' } },
          { value: learningsByGrowthLeverGraphData?.Revenue || 0, name: 'Revenue', itemStyle: { color: '#31D76E' } }
        ]
      }
    ]
  };

  const teamParticipationChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' },
      axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
    },
    legend: {
      data: ['Members'],
      bottom: 10,
      textStyle: { color: '#6b7280' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: WeeklyTeamPartcipationGraphData?.labels || [],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: 'Members',
        type: 'line',
        smooth: true,
        data: WeeklyTeamPartcipationGraphData?.data || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56, 100, 221, 0.3)' },
              { offset: 1, color: 'rgba(56, 100, 221, 0.05)' }
            ]
          }
        },
        lineStyle: { color: '#3864DD', width: 3 },
        itemStyle: { color: '#3864DD' },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  };

  return (
    <div className="space-y-6">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FBFBFB]">
          <Spinner />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{openedProject?.name}</p>
          <h1 className="text-2xl font-semibold mb-1">Insights</h1>
          <p className="text-sm text-muted-foreground">
            {insightsSpan !== "all" ? formatDate4(moment.duration(new Date()).subtract(insightsSpan, "week")) : "Created On"} -{" "}
            {formatDate4(new Date())}
          </p>
        </div>

        <Select
          defaultValue="4"
          onValueChange={(value) => {
            dispatch(updateinsightsSpan(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">Past 4 Weeks</SelectItem>
            <SelectItem value="8">Past 8 Weeks</SelectItem>
            <SelectItem value="12">Past 12 Weeks</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {insights.length === 0 && (
        <div className="flex items-center justify-center mt-5">
          <div className="text-center space-y-4">
            <img src="/static/illustrations/no-projects-found.svg" alt="" className="h-48 mx-auto" />
            <h2 className="text-lg font-medium">Insights not available</h2>
          </div>
        </div>
      )}

      {insights.length !== 0 && (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Ideas Created & Tests Started */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-center flex-1">
                    Ideas Created & Tests Started
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadChart(chart1Ref, 'Ideas Created & Tests Started.png')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts
                  ref={chart1Ref}
                  option={ideasTestsChartOption}
                  style={{ height: '350px' }}
                />
              </CardContent>
            </Card>

            {/* Learnings Acquired */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-center flex-1">
                    Learnings Acquired
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadChart(chart2Ref, 'Learnings Acquired.png')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts
                  ref={chart2Ref}
                  option={learningsAcquiredChartOption}
                  style={{ height: '350px' }}
                />
              </CardContent>
            </Card>

            {/* Learnings by Growth Lever */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-center flex-1">
                    Learnings by Growth Lever
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadChart(chart3Ref, 'Learnings by Growth Lever.png')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts
                  ref={chart3Ref}
                  option={learningsByLeverChartOption}
                  style={{ height: '350px' }}
                />
              </CardContent>
            </Card>

            {/* Weekly Team Participation */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-center flex-1">
                    Weekly Team Participation
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadChart(chart4Ref, 'Weekly Team Participation.png')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts
                  ref={chart4Ref}
                  option={teamParticipationChartOption}
                  style={{ height: '350px' }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {/* Growth Health Section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{openedProject?.name}</p>
              <h1 className="text-2xl font-semibold mb-1">Growth Health</h1>
              <p className="text-sm text-muted-foreground">
                {formatDate4(moment.duration(new Date()).subtract(growthSpan, "week"))} - {formatDate4(new Date())}
              </p>
            </div>

            <Select
              defaultValue="1"
              onValueChange={(value) => {
                dispatch(updategrowthSpan(value));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Past Week</SelectItem>
                <SelectItem value="2">Past 2 Weeks</SelectItem>
                <SelectItem value="4">Past 4 Weeks</SelectItem>
                <SelectItem value="6">Past 6 Weeks</SelectItem>
                <SelectItem value="8">Past 8 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Ideas Created</p>
                <h2 className="text-3xl font-bold">{countAllIdeas()}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Tests Started</p>
                <h2 className="text-3xl font-bold">{countAllTest()}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  <p className="text-sm text-muted-foreground">Learnings Acquired</p>
                  <span title={`Successful: ${growthData?.userData[0]?.workedLearnings}\nUnsuccessful: ${growthData?.userData[0]?.didntWorkedLearnings}\nInconclusive: ${growthData?.userData[0]?.inconclusiveLearnings}`}>
                    <img src="/static/icons/info.svg" alt="" className="w-3 h-3 ml-1" />
                  </span>
                </div>
                <h2 className="text-3xl font-bold">{growthData?.learningsCreated}</h2>
              </CardContent>
            </Card>
          </div>

          {/* Team Contribution */}
          <div className="mb-4">
            <h3 className="text-base font-medium mb-3">Team Contribution</h3>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white border-b">
                    <tr>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                        Name
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                        Ideas Created
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                        Nominations Received
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                        Ideas Tested
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthData?.projectCount?.map((user, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={`${backendServerBaseURL}/${user.user.avatar}`}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm">
                              {user.user.firstName} {user.user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">{user.countIdea}</td>
                        <td className="px-6 py-3 text-sm">{user.countNominate}</td>
                        <td className="px-6 py-3 text-sm">{user.countTest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <TourModal />
    </div>
  );
}

export default Insights;
