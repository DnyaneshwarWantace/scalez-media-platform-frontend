import React from "react";
import { useDispatch } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatTime } from "../../../utils/formatTime";
import { updateselectedTest } from "../../../redux/slices/projectSlice";
import { Calendar, CheckSquare, Users } from "lucide-react";

function TestKanbanCard({ test, onClick, isDragging }) {
  const dispatch = useDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: test._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const completedTasks = test.tasks?.filter((task) => task.status === true).length || 0;
  const totalTasks = test.tasks?.length || 0;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 hover:border-gray-300"
        onClick={onClick}
      >
        <CardContent className="p-4">
          {/* Title */}
          <div className="flex items-start gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                {test.name}
              </h4>
              {test.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {stripHtml(test.description)}
                </p>
              )}
            </div>
          </div>

          {/* Growth Lever */}
          {test.lever && (
            <div className="mb-3">
              <Badge className="bg-black text-white hover:bg-black text-xs">
                {test.lever}
              </Badge>
            </div>
          )}

          {/* Tasks Progress */}
          {totalTasks > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <CheckSquare className="h-3 w-3" />
                  <span>Tasks</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Footer: Assigned Members and Due Date */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Assigned Members */}
            <div className="flex items-center gap-1">
              {test.assignedTo && test.assignedTo.length > 0 ? (
                <AvatarGroup
                  listOfUrls={test.assignedTo.map(
                    (member) => `${backendServerBaseURL}/${member.avatar}`
                  )}
                  show={3}
                  total={test.assignedTo.length}
                  userName={test.assignedTo.map((t) => [
                    t?.firstName,
                    `${backendServerBaseURL}/${t?.avatar}`,
                    t?.lastName,
                  ])}
                />
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="h-3 w-3" />
                  <span>Unassigned</span>
                </div>
              )}
            </div>

            {/* Due Date */}
            {test.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{formatTime(test.dueDate)}</span>
              </div>
            )}
          </div>

          {/* ICE Score Badge */}
          {test.score && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">ICE Score</span>
                <Badge className="bg-black text-white hover:bg-black text-xs">
                  {test.score}
                </Badge>
              </div>
            </div>
          )}

          {/* Move to Learning Button */}
          {test.status === "Ready to analyze" && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(updateselectedTest(test));
                }}
              >
                Move to learning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TestKanbanCard;
