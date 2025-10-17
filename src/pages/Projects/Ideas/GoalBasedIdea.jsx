import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateSelectedIdea } from "../../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatTime } from "../../../utils/formatTime";
import { selectallGrowthLevers } from "../../../redux/slices/settingSlice";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { ChevronDown, MoreVertical } from "lucide-react";

function GoalBasedIdea({ goal }) {
  const [collapse, setcollapse] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const allGrowthLevers = useSelector(selectallGrowthLevers);
  let leversData = allGrowthLevers.map((x) => {
    return ({
      name: x.name,
      color: x.color
    });
  });

  return (
    <Card>
      <CardContent className="p-0">
        {/* Goal Header */}
        <div 
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => {
            setcollapse(!collapse);
          }}
        >
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${collapse ? 'rotate-180' : ''}`}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{goal?.name}</h3>
            <p className="text-xs text-muted-foreground">
              {goal?.ideas?.length || 0} {goal?.ideas?.length === 1 ? 'idea' : 'ideas'}
            </p>
          </div>
        </div>

        {/* Ideas Table */}
        {!collapse && goal?.ideas && goal.ideas.length > 0 && (
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Lever</TableHead>
                  <TableHead className="font-medium">Creator</TableHead>
                  <TableHead className="font-medium">Created</TableHead>
                  <TableHead className="font-medium">Nominations</TableHead>
                  <TableHead className="font-medium">ICE Score</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goal.ideas.map((idea) => (
                  <TableRow
                    key={idea._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      dispatch(updateSelectedIdea(idea));
                      navigate(`/projects/${projectId}/ideas/${idea._id}`);
                    }}
                  >
                    <TableCell className="font-medium">
                      <div className="max-w-[150px] truncate" title={idea?.name}>
                        {idea?.name}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {leversData.map((lever) => {
                        if (idea.lever === lever.name) {
                          let badgeVariant;
                          switch (lever.color) {
                            case "Blue":
                              badgeVariant = "bg-blue-100 text-blue-800";
                              break;
                            case "Orange":
                              badgeVariant = "bg-orange-100 text-orange-800";
                              break;
                            case "Green":
                              badgeVariant = "bg-green-100 text-green-800";
                              break;
                            case "Red":
                              badgeVariant = "bg-red-100 text-red-800";
                              break;
                            case "Yellow":
                              badgeVariant = "bg-yellow-100 text-yellow-800";
                              break;
                            default:
                              badgeVariant = "bg-blue-100 text-blue-800";
                              break;
                          }
                          return (
                            <Badge key={lever.name} className={badgeVariant}>
                              {idea.lever}
                            </Badge>
                          );
                        }
                        return null;
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${backendServerBaseURL}/${idea.createdBy?.avatar}`}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="max-w-[150px] truncate" title={`${idea?.createdBy?.firstName} ${idea?.createdBy?.lastName}`}>
                          {idea.createdBy
                            ? `${idea.createdBy.firstName} ${idea.createdBy.lastName}`
                            : "Removed User"}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {formatTime(idea?.createdAt)}
                    </TableCell>
                    
                    <TableCell>
                      {idea.nominations?.length || 0}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">
                        {idea?.score}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}>
                          <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelectedIdea(idea));
                              navigate(`/projects/${projectId}/ideas/${idea._id}`);
                            }}
                          >
                            View Idea
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelectedIdea(idea));
                            }}
                          >
                            Test Idea
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelectedIdea(idea));
                            }}
                          >
                            Delete Idea
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Empty State for Goal with No Ideas */}
        {!collapse && (!goal?.ideas || goal.ideas.length === 0) && (
          <div className="p-8 text-center border-t">
            <p className="text-sm text-muted-foreground">No ideas for this goal yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GoalBasedIdea;
