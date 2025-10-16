import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGrowthLevers,
  getAllkeyMetrics,
  readTimezone,
  selectallGrowthLevers,
  selectkeyMetrics,
  selectTimezone,
  updateselectedGrowthLever,
  updateselectedKeymetric,
  updateTimezone,
  updateNewKeyMetricDialogOpen,
  updateNewGrowthLeverDialogOpen,
} from "../../../redux/slices/settingSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatTime } from "../../../utils/formatTime";
import DeleteKeyMetricModal from "./DeleteKeyMetricModal";
import DeleteLeverDialog from "./DeleteLeverDialog";
import DeleteWorkspaceDialog from "./DeleteWorkspaceDialog";
import NewGrowthLeverDialog from "./NewGrowthLeverDialog";
import NewKeyMetricDialog from "./NewKeyMetricDialog";
import ViewKeyMetricDialog from "./ViewKeyMetricDialog";
import { isTypeOwner, isRoleAdmin, hasPermission_create_workspace } from "../../../utils/permissions";
import AddSampleDataDialog from "./AddSampleDataDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { 
  Building, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  BarChart3,
  TrendingUp,
  Database
} from "lucide-react";

var tzStrings = [
  { label: "(GMT-12:00) International Date Line West", value: "Etc/GMT+12" },
  { label: "(GMT-11:00) Midway Island, Samoa", value: "Pacific/Midway" },
  { label: "(GMT-10:00) Hawaii", value: "Pacific/Honolulu" },
  { label: "(GMT-09:00) Alaska", value: "US/Alaska" },
  { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "America/Los_Angeles" },
  { label: "(GMT-08:00) Tijuana, Baja California", value: "America/Tijuana" },
  { label: "(GMT-07:00) Arizona", value: "US/Arizona" },
  { label: "(GMT-07:00) Chihuahua, La Paz, Mazatlan", value: "America/Chihuahua" },
  { label: "(GMT-07:00) Mountain Time (US & Canada)", value: "US/Mountain" },
  { label: "(GMT-06:00) Central America", value: "America/Managua" },
  { label: "(GMT-06:00) Central Time (US & Canada)", value: "US/Central" },
  { label: "(GMT-06:00) Guadalajara, Mexico City, Monterrey", value: "America/Mexico_City" },
  { label: "(GMT-06:00) Saskatchewan", value: "Canada/Saskatchewan" },
  { label: "(GMT-05:00) Bogota, Lima, Quito, Rio Branco", value: "America/Bogota" },
  { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "US/Eastern" },
  { label: "(GMT-05:00) Indiana (East)", value: "US/East-Indiana" },
  { label: "(GMT-04:00) Atlantic Time (Canada)", value: "Canada/Atlantic" },
  { label: "(GMT-04:00) Caracas, La Paz", value: "America/Caracas" },
  { label: "(GMT-04:00) Manaus", value: "America/Manaus" },
  { label: "(GMT-04:00) Santiago", value: "America/Santiago" },
  { label: "(GMT-03:30) Newfoundland", value: "Canada/Newfoundland" },
  { label: "(GMT-03:00) Brasilia", value: "America/Sao_Paulo" },
  { label: "(GMT-03:00) Buenos Aires, Georgetown", value: "America/Argentina/Buenos_Aires" },
  { label: "(GMT-03:00) Greenland", value: "America/Godthab" },
  { label: "(GMT-03:00) Montevideo", value: "America/Montevideo" },
  { label: "(GMT-02:00) Mid-Atlantic", value: "America/Noronha" },
  { label: "(GMT-01:00) Cape Verde Is.", value: "Atlantic/Cape_Verde" },
  { label: "(GMT-01:00) Azores", value: "Atlantic/Azores" },
  { label: "(GMT+00:00) Casablanca, Monrovia, Reykjavik", value: "Africa/Casablanca" },
  { label: "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", value: "Etc/Greenwich" },
  { label: "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", value: "Europe/Amsterdam" },
  { label: "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", value: "Europe/Belgrade" },
  { label: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", value: "Europe/Brussels" },
  { label: "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", value: "Europe/Sarajevo" },
  { label: "(GMT+01:00) West Central Africa", value: "Africa/Lagos" },
  { label: "(GMT+02:00) Amman", value: "Asia/Amman" },
  { label: "(GMT+02:00) Athens, Bucharest, Istanbul", value: "Europe/Athens" },
  { label: "(GMT+02:00) Beirut", value: "Asia/Beirut" },
  { label: "(GMT+02:00) Cairo", value: "Africa/Cairo" },
  { label: "(GMT+02:00) Harare, Pretoria", value: "Africa/Harare" },
  { label: "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", value: "Europe/Helsinki" },
  { label: "(GMT+02:00) Jerusalem", value: "Asia/Jerusalem" },
  { label: "(GMT+02:00) Minsk", value: "Europe/Minsk" },
  { label: "(GMT+02:00) Windhoek", value: "Africa/Windhoek" },
  { label: "(GMT+03:00) Kuwait, Riyadh, Baghdad", value: "Asia/Kuwait" },
  { label: "(GMT+03:00) Moscow, St. Petersburg, Volgograd", value: "Europe/Moscow" },
  { label: "(GMT+03:00) Nairobi", value: "Africa/Nairobi" },
  { label: "(GMT+03:00) Tbilisi", value: "Asia/Tbilisi" },
  { label: "(GMT+03:30) Tehran", value: "Asia/Tehran" },
  { label: "(GMT+04:00) Abu Dhabi, Muscat", value: "Asia/Muscat" },
  { label: "(GMT+04:00) Baku", value: "Asia/Baku" },
  { label: "(GMT+04:00) Yerevan", value: "Asia/Yerevan" },
  { label: "(GMT+04:30) Kabul", value: "Asia/Kabul" },
  { label: "(GMT+05:00) Yekaterinburg", value: "Asia/Yekaterinburg" },
  { label: "(GMT+05:00) Islamabad, Karachi, Tashkent", value: "Asia/Karachi" },
  { label: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: "Asia/Calcutta" },
  { label: "(GMT+05:30) Sri Jayawardenapura", value: "Asia/Calcutta" },
  { label: "(GMT+05:45) Kathmandu", value: "Asia/Katmandu" },
  { label: "(GMT+06:00) Almaty, Novosibirsk", value: "Asia/Almaty" },
  { label: "(GMT+06:00) Astana, Dhaka", value: "Asia/Dhaka" },
  { label: "(GMT+06:30) Yangon (Rangoon)", value: "Asia/Rangoon" },
  { label: "(GMT+07:00) Bangkok, Hanoi, Jakarta", value: "Asia/Bangkok" },
  { label: "(GMT+07:00) Krasnoyarsk", value: "Asia/Krasnoyarsk" },
  { label: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", value: "Asia/Hong_Kong" },
  { label: "(GMT+08:00) Kuala Lumpur, Singapore", value: "Asia/Kuala_Lumpur" },
  { label: "(GMT+08:00) Irkutsk, Ulaan Bataar", value: "Asia/Irkutsk" },
  { label: "(GMT+08:00) Perth", value: "Australia/Perth" },
  { label: "(GMT+08:00) Taipei", value: "Asia/Taipei" },
  { label: "(GMT+09:00) Osaka, Sapporo, Tokyo", value: "Asia/Tokyo" },
  { label: "(GMT+09:00) Seoul", value: "Asia/Seoul" },
  { label: "(GMT+09:00) Yakutsk", value: "Asia/Yakutsk" },
  { label: "(GMT+09:30) Adelaide", value: "Australia/Adelaide" },
  { label: "(GMT+09:30) Darwin", value: "Australia/Darwin" },
  { label: "(GMT+10:00) Brisbane", value: "Australia/Brisbane" },
  { label: "(GMT+10:00) Canberra, Melbourne, Sydney", value: "Australia/Canberra" },
  { label: "(GMT+10:00) Hobart", value: "Australia/Hobart" },
  { label: "(GMT+10:00) Guam, Port Moresby", value: "Pacific/Guam" },
  { label: "(GMT+10:00) Vladivostok", value: "Asia/Vladivostok" },
  { label: "(GMT+11:00) Magadan, Solomon Is., New Caledonia", value: "Asia/Magadan" },
  { label: "(GMT+12:00) Auckland, Wellington", value: "Pacific/Auckland" },
  { label: "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", value: "Pacific/Fiji" },
  { label: "(GMT+13:00) Nuku'alofa", value: "Pacific/Tongatapu" },
];



function Workspace() {
  const dispatch = useDispatch();
  const allKeyMetrics = useSelector(selectkeyMetrics);
  console.log('allKeyMetrics ^^^:>> ', allKeyMetrics);
  const allGrowthLevers = useSelector(selectallGrowthLevers);
  const timezone = useSelector(selectTimezone);
  // const allDefaultLevers = useSelector(selectlearningsByGrowthLeverGraphData);
  // console.log('allDefaultLevers :>> ', allDefaultLevers);

  const sampleText = localStorage.getItem("sampleDataBtn", "");
  // let userParseData = JSON.parse(userData);
  // let userCreatedDate = userParseData.createdAt;
  console.log('sampleText :>> ', sampleText);

  // let userFname = userParseData.firstName;
  // let userLname = userParseData.lastName;
  // let userAvatar = userParseData.avatar;
  
  useEffect(() => {
    dispatch(getAllkeyMetrics());
    dispatch(readTimezone());
    dispatch(getAllGrowthLevers());
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workspace</h1>
          <p className="text-sm text-gray-500">Manage workspace settings and configurations</p>
        </div>
      </div>

      {/* <div style={{ maxWidth: "60%" }}>
        <div className="row">
          <div class="mt-3 col-8">
            <div>
              <label className="form-label">Timezone</label>

              <select
                className="form-select"
                value={timezone}
                onChange={(e) => {
                  dispatch(updateTimezone({ timeZone: e.target.value }));
                }}
              >
                {tzStrings.map((tz) => {
                  return <option value={tz.value}>{tz.label}</option>;
                })}
              </select>

              <label htmlFor="">We recommend your select a timezone where most of your team resides.</label>
            </div>

            <hr />
          </div>
        </div>
      </div> */}

      {/* Key Metrics Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allKeyMetrics?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No key metrics defined</h3>
              <p className="text-gray-500 text-center mb-4">
                Create custom key metrics to track important business indicators.
              </p>
              {hasPermission_create_workspace() && (
                <Button
                  onClick={() => {
                    dispatch(updateNewKeyMetricDialogOpen(true));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Key Metric
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Metric Type</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allKeyMetrics?.map((singleKeyMetric, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {singleKeyMetric.shortName}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {singleKeyMetric.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {singleKeyMetric.metricType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={`${backendServerBaseURL}/${singleKeyMetric?.createdBy?.avatar}`}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <span>
                            {singleKeyMetric.createdBy
                              ? [
                                  singleKeyMetric.createdBy?.firstName,
                                  singleKeyMetric?.createdBy?.lastName,
                                ].join(" ")
                              : "Default"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTime(singleKeyMetric?.createdAt) || "-"}
                      </TableCell>
                      <TableCell>
                        {(hasPermission_create_workspace() && !singleKeyMetric.mode) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(updateselectedKeymetric(singleKeyMetric));
                                  const modal = document.getElementById('viewKeyMetricModal');
                    if (modal) {
                      const bootstrapModal = new window.bootstrap.Modal(modal);
                      bootstrapModal.show();
                    }
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Key Metric
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(updateselectedKeymetric(singleKeyMetric));
                                  const modal = document.getElementById('deleteKeyMetricModal');
                    if (modal) {
                      const bootstrapModal = new window.bootstrap.Modal(modal);
                      bootstrapModal.show();
                    }
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Key Metric
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {hasPermission_create_workspace() && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch(updateNewKeyMetricDialogOpen(true));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create a key metric
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Growth Levers Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Levers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allGrowthLevers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No growth levers defined</h3>
              <p className="text-gray-500 text-center mb-4">
                Create growth levers to categorize and track different growth strategies.
              </p>
              {hasPermission_create_workspace() && (
                <Button
                  onClick={() => {
                    dispatch(updateselectedGrowthLever(null));
                    dispatch(updateNewGrowthLeverDialogOpen(true));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Growth Lever
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allGrowthLevers?.map((singleGrowthLever, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {singleGrowthLever?.name}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            singleGrowthLever?.color === "Blue" ? "bg-blue-100 text-blue-800" :
                            singleGrowthLever?.color === "Yellow" ? "bg-yellow-100 text-yellow-800" :
                            singleGrowthLever?.color === "Orange" ? "bg-orange-100 text-orange-800" :
                            singleGrowthLever?.color === "Red" ? "bg-red-100 text-red-800" :
                            singleGrowthLever?.color === "Green" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {singleGrowthLever?.color}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={`${backendServerBaseURL}/${singleGrowthLever?.createdBy?.avatar}`}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <span>
                            {singleGrowthLever?.createdBy?.firstName}{" "}
                            {singleGrowthLever?.createdBy?.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {singleGrowthLever?.createdAt
                          ? formatTime(singleGrowthLever?.createdAt)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {(hasPermission_create_workspace() && !singleGrowthLever.type) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(updateselectedGrowthLever(singleGrowthLever));
                                  dispatch(updateNewGrowthLeverDialogOpen(true));
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lever
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(updateselectedGrowthLever(singleGrowthLever));
                                  const modal = document.getElementById('deleteLeverDialog');
                    if (modal) {
                      const bootstrapModal = new window.bootstrap.Modal(modal);
                      bootstrapModal.show();
                    }
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Lever
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex gap-3">
                {hasPermission_create_workspace() && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch(updateselectedGrowthLever(null));
                      dispatch(updateNewGrowthLeverDialogOpen(true));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create a Lever
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const modal = document.getElementById('AddSampleDataDialog');
                    if (modal) {
                      const bootstrapModal = new window.bootstrap.Modal(modal);
                      bootstrapModal.show();
                    }
                  }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {sampleText ? 'Remove Sample Data' : 'Add Sample Data'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* <div className="pt-3">
        <p className="form-label">Delete Workspace</p>
        <p>
          All the users & data will get erased. <span style={{ fontWeight: "bold" }}>THIS ACTION CANNOT BE REVERTED!</span>
        </p>

        <button className="btn btn-lg btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteWorkspaceDialog">
          Delete Workspace
        </button>
      </div> */}

      <NewKeyMetricDialog />
      <ViewKeyMetricDialog />
      <DeleteKeyMetricModal />
      <DeleteWorkspaceDialog />
      <DeleteLeverDialog />
      <NewGrowthLeverDialog />
      <AddSampleDataDialog />
    </div>
    
  );
}

export default Workspace;
