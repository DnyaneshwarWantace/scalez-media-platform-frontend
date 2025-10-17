import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllLearnings,
  selectlearnings,
  updateselectedLearning,
} from "../../../redux/slices/projectSlice";
import DeleteLearningDialog from "./DeleteLearningDialog";
import SendBackToTestsDialog from "./SendBackToTestsDialog";
import { formatTime } from "../../../utils/formatTime";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import TourModal from "../Tour/TourModal";
import { hasPermission_create_learnings } from "../../../utils/permissions";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, MessageSquare } from "lucide-react";

function Learnings() {
  const [selectedMenu, setselectedMenu] = useState("All Learnings");
  const learnings = useSelector(selectlearnings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));

  // Helper function to strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const ProjectsMenus = [
    { name: "All Learnings" },
    { name: "Successful" },
    { name: "Unsuccessful" },
    { name: "Inconclusive" },
  ];

  const [showSkeletonLoader, setShowSkeletonLoader] = useState(true);

  useEffect(() => {
    dispatch(getAllLearnings({ projectId }));
    setTimeout(() => {
      setShowSkeletonLoader(false);
    }, 2000);
  }, [selectedMenu]);

  const filteredLearnings = learnings?.filter((learning) => {
    if (selectedMenu === "Successful") return learning.result === "Successful";
    if (selectedMenu === "Unsuccessful") return learning.result === "Unsuccessful";
    if (selectedMenu === "Inconclusive") return learning.result === "Inconclusive";
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{openedProject?.name}</h1>
          <p className="text-sm text-gray-500">
            {learnings?.length === 1
              ? `${learnings?.length} Learning`
              : `${learnings?.length} Learnings`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {ProjectsMenus.map((menu) => (
              <button
                key={menu.name}
                onClick={() => setselectedMenu(menu.name)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  selectedMenu === menu.name
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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

      {/* Table */}
      {showSkeletonLoader ? (
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium" style={{ width: '250px' }}>Learning Name</TableHead>
                  <TableHead className="font-medium w-[100px]">Lever</TableHead>
                  <TableHead className="font-medium w-[120px]">Goal</TableHead>
                  <TableHead className="font-medium w-[100px]">Members</TableHead>
                  <TableHead className="font-medium w-[130px]">Date</TableHead>
                  <TableHead className="font-medium w-[100px]">Result</TableHead>
                  <TableHead className="font-medium w-[80px] text-right">ICE Score</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                    <TableCell>
                      <div className="flex -space-x-1">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-16"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded w-12"></div></TableCell>
                    <TableCell><div className="h-8 w-8 bg-gray-200 rounded"></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : filteredLearnings?.length === 0 ? (
        <div className="flex items-center justify-center mt-5">
          <div className="flex flex-col gap-3 text-center">
            <img
              src="/static/illustrations/no-projects-found.svg"
              alt=""
              height="200px"
            />
            <h2 className="text-xl font-semibold text-gray-900">No learnings added</h2>
          </div>
        </div>
      ) : (
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium" style={{ width: '250px' }}>Learning Name</TableHead>
                  <TableHead className="font-medium w-[100px]">Lever</TableHead>
                  <TableHead className="font-medium w-[120px]">Goal</TableHead>
                  <TableHead className="font-medium w-[100px]">Members</TableHead>
                  <TableHead className="font-medium w-[130px]">Date</TableHead>
                  <TableHead className="font-medium w-[100px]">Result</TableHead>
                  <TableHead className="font-medium w-[80px] text-right">ICE Score</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLearnings?.map((learning) => (
                  <TableRow
                    key={learning._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/projects/${projectId}/learnings/${learning._id}`)}
                  >
                    <TableCell className="font-medium p-0 py-3 px-4 align-middle" style={{ width: '250px', maxWidth: '250px' }}>
                      <div className="w-full">
                        <div className="font-semibold text-sm text-black truncate">{learning.name}</div>
                        {learning.description && (
                          <div className="text-xs text-gray-500 truncate">{stripHtml(learning.description)}</div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle">
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
                        {learning.lever || "Not Defined"}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle">
                      <div className="max-w-[200px] truncate" title={learning?.goal?.name}>
                        {learning?.goal?.name || "No goal assigned"}
                      </div>
                    </TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle">
                      <AvatarGroup
                        listOfUrls={learning.assignedTo?.map(
                          (t) => `${backendServerBaseURL}/${t.avatar}`
                        )}
                        userName={learning.assignedTo?.map((t) => [
                          t?.firstName,
                          `${backendServerBaseURL}/${t?.avatar}`,
                          t?.lastName,
                        ])}
                        show={3}
                        total={learning.assignedTo.length}
                      />
                    </TableCell>

                    <TableCell className="text-sm text-gray-600 p-0 py-3 px-4 align-middle whitespace-nowrap">{formatTime(learning.createdAt)}</TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle">
                      <Badge className="bg-black text-white hover:bg-black text-xs">
                        {learning.result}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle text-right whitespace-nowrap">
                      <Badge className="bg-black text-white hover:bg-black text-xs">
                        {learning.score}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-0 py-3 px-4 align-middle">
                      {hasPermission_create_learnings() && (
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
                                navigate(`/projects/${projectId}/learnings/${learning._id}`);
                              }}
                            >
                              View Learning
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(updateselectedLearning(learning));
                              }}
                            >
                              Send to test
                            </DropdownMenuItem>
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
      )}

      <SendBackToTestsDialog />
      <DeleteLearningDialog />
      <TourModal />
    </div>
  );
}

export default Learnings;
