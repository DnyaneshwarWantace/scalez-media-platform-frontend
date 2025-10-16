import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllTests, selecttests, updateselectedTest } from "../../../redux/slices/projectSlice";
import { formatTime } from "../../../utils/formatTime";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import AvatarGroup from "../../../components/common/AvatarGroup";
import MoveToLearningDialog from "./MoveToLearningDialog";
import TourModal from "../Tour/TourModal";
import KanbanBoard from "./KanbanBoard";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MessageSquare, CheckSquare, LayoutGrid, LayoutList } from "lucide-react";

function Tests() {
  const [viewMode, setViewMode] = useState("kanban"); // "table" or "kanban"
  const allTests = useSelector(selecttests);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));

  // Helper function to strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    dispatch(getAllTests({ projectId }));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{openedProject?.name}</h1>
          <p className="text-sm text-gray-500">
            {allTests?.length === 1
              ? `${allTests?.length} Test`
              : `${allTests?.length} Tests`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "kanban"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Table
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="mt-3">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium w-[250px]">Test Name</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Tasks</TableHead>
                <TableHead className="font-medium">Due Date</TableHead>
                <TableHead className="font-medium">ICE Score</TableHead>
                <TableHead className="font-medium">Team</TableHead>
                <TableHead className="font-medium text-center">Comments</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTests?.map((test) => (
                <TableRow
                  key={test._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    navigate(`/projects/${projectId}/tests/${test._id}`);
                  }}
                >
                  <TableCell className="font-medium py-3 align-middle" style={{ width: '250px', maxWidth: '250px' }}>
                    <div className="w-full">
                      <div className="font-semibold text-sm text-black truncate">{test.name}</div>
                      {test.description && (
                        <div className="text-xs text-gray-500 truncate">{stripHtml(test.description)}</div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    <Badge className="bg-black text-white hover:bg-black text-xs">
                      {test.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        {test.tasks.filter((task) => task.status === true).length}/{test.tasks.length}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    {formatTime(test.dueDate)}
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    <Badge className="bg-black text-white hover:bg-black text-xs">
                      {test.score}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    <AvatarGroup
                      listOfUrls={test.assignedTo?.map(
                        (member) => `${backendServerBaseURL}/${member.avatar}`
                      )}
                      show={3}
                      total={test.assignedTo.length}
                      userName={test.assignedTo?.map((t) => [
                        t?.firstName,
                        `${backendServerBaseURL}/${t?.avatar}`,
                        t?.lastName,
                      ])}
                    />
                  </TableCell>

                  <TableCell className="text-center py-3 align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{test.comments.length}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 align-middle">
                    {test.status === "Ready to analyze" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-black text-white hover:bg-gray-800 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          dispatch(updateselectedTest(test));
                        }}
                      >
                        Move to learning
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="mt-3">
          <KanbanBoard
            tests={allTests}
            projectId={projectId}
            onTestClick={(test) => {
              navigate(`/projects/${projectId}/tests/${test._id}`);
            }}
          />
        </div>
      )}

      <MoveToLearningDialog />
      <TourModal />
    </div>
  );
}

export default Tests;
