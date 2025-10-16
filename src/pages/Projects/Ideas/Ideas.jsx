import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllIdeas, getAllIdeasByGoal, getProjectUsers, selectIdeas, updateSelectedIdea, updateselectedTest, updateShowDeleteIdeaDialog } from "../../../redux/slices/projectSlice";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { formatTime } from "../../../utils/formatTime";
import { hasPermission_create_ideas, hasPermission_share_ideas, isTypeOwner, isRoleAdmin, isRoleMember } from "../../../utils/permissions";
import TourModal from "../Tour/TourModal";
import CreateNewIdeaDialog from "./CreateNewIdeaDialog";
import DeleteIdeaDialog from "./DeleteIdeaDialog";
import GoalBasedIdea from "./GoalBasedIdea";
import ShareIdeaDialog from "./ShareIdeaDialog";
import TestIdeaDialog from "./TestIdeaDialog";
import { selectallGrowthLevers } from "../../../redux/slices/settingSlice";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";

function Ideas() {
  const [selectedMenu, setselectedMenu] = useState("All Ideas");
  const ideas = useSelector(selectIdeas);
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  console.log('projectId IDEAS :>> ', projectId);
  const dispatch = useDispatch();
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const allGrowthLevers = useSelector(selectallGrowthLevers);
  console.log('allGrowthLevers Ideas :>> ', allGrowthLevers);

  // Helper function to strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  let leversData = allGrowthLevers.map((x) => {
  return ({
      name: x.name,
      color: x.color
    });
});
console.log('leversData :>> ', leversData);

  const ProjectsMenus = [
    {
      name: "All Ideas",
    },
    {
      name: "Goal Based",
    },
  ];

  const RightProjectsMenus = [];
  const [isLoading, setIsLoading] = useState(true); // Loading state flag
  const [showSkeletonLoader, setShowSkeletonLoader] = useState(true);
  const [isCreateIdeaDialogOpen, setIsCreateIdeaDialogOpen] = useState(false);

  useEffect(() => {
    // Clear any open dialogs from other pages
    dispatch(updateselectedTest(null));

    if (selectedMenu == "All Ideas") {

      dispatch(getAllIdeas({ projectId : projectId }));
    }

    if (selectedMenu == "Goal Based") {
      dispatch(getAllIdeasByGoal({ projectId }));
    }

    dispatch(getProjectUsers({ projectId }));
    setTimeout(() => {
      setShowSkeletonLoader(false);
    }, 2000);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [selectedMenu]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{openedProject?.name}</h1>
          <p className="text-sm text-gray-500">
            {ideas?.length == 1 ? `${ideas?.length} Idea` : `${ideas?.length} Ideas`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission_create_ideas() && (
            <Button
              onClick={() => {
                dispatch(updateSelectedIdea(null));
                setIsCreateIdeaDialogOpen(true);
              }}
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Suggest Ideas
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border mt-3">
        <div className="flex items-center">
          {ProjectsMenus?.map((menu) => {
            return (
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
            );
          })}
        </div>
      </div>

      {ideas?.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center mt-5">
          <div className="text-center space-y-4">
            <img src="/static/illustrations/no-projects-found.svg" alt="" className="h-48 mx-auto" />
            <h2 className="text-lg font-medium">No ideas created yet</h2>
              {selectedMenu === "All Ideas" && hasPermission_create_ideas() && (
                <Button
                  onClick={() => {
                    dispatch(updateSelectedIdea(null));
                    setIsCreateIdeaDialogOpen(true);
                  }}
                  className="bg-black hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Suggest your first idea
                </Button>
              )}
          </div>
        </div>
      ) : (ideas?.length !== 0 ?
        (
         <>
         {selectedMenu === "All Ideas" && (
           <Card className="mt-4">
             <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="font-medium">Name</TableHead>
                     <TableHead className="font-medium">Lever</TableHead>
                     <TableHead className="font-medium">Goal</TableHead>
                     <TableHead className="font-medium">Creator</TableHead>
                     <TableHead className="font-medium">Created</TableHead>
                     <TableHead className="font-medium">Nominations</TableHead>
                     <TableHead className="font-medium">ICE Score</TableHead>
                     <TableHead className="w-12"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
            {ideas?.map((idea) => {
              return (
                       <TableRow
                         key={idea._id}
                         className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    hasPermission_create_ideas() &&
                      dispatch(updateSelectedIdea(idea));
                    navigate(`/projects/${projectId}/ideas/${idea?._id}`);
                  }}
                >
                         <TableCell className="font-medium py-3 align-middle" style={{ width: '250px', maxWidth: '250px' }}>
                           <div className="w-full">
                             <div className="font-semibold text-sm text-black truncate">{idea.name}</div>
                             {idea.description && (
                               <div className="text-xs text-gray-500 truncate">{stripHtml(idea.description)}</div>
                             )}
                           </div>
                         </TableCell>

                         <TableCell className="py-3 align-middle">
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

                         <TableCell className="py-3 align-middle">
                           <div className="max-w-[150px] truncate" title={idea?.goal?.name}>
                      {idea?.goal?.name}
                           </div>
                         </TableCell>
                         <TableCell className="py-3 align-middle">
                           <div className="flex items-center gap-2">
                    <img
                      src={`${backendServerBaseURL}/${idea?.createdBy?.avatar}`}
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
                         <TableCell className="py-3 align-middle">
                    {formatTime(idea?.createdAt)}
                         </TableCell>
                         <TableCell className="py-3 align-middle">
                    {idea.nominations?.length}
                         </TableCell>
                         <TableCell className="py-3 align-middle">
                           <Badge className="bg-black text-white hover:bg-black">
                             {idea?.score}
                           </Badge>
                         </TableCell>
                         <TableCell className="py-3 align-middle">
                    {hasPermission_create_ideas() ? (
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
                                navigate(
                                  `/projects/${projectId}/ideas/${idea?._id}`
                                );
                              }}
                            >
                              View Idea
                                 </DropdownMenuItem>

                                 <DropdownMenuItem
                              onClick={() => {
                                dispatch(updateSelectedIdea(idea));
                                setIsCreateIdeaDialogOpen(true);
                              }}
                            >
                              Edit Idea
                                 </DropdownMenuItem>

                          {hasPermission_share_ideas() && (
                                   <DropdownMenuItem
                              onClick={() => {
                                dispatch(updateSelectedIdea(idea));
                              }}
                              >
                                Share Idea
                                   </DropdownMenuItem>
                          )}

                                 <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelectedIdea(idea));
                              dispatch(updateselectedTest(idea));
                            }}
                            >
                              Test Idea
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelectedIdea(idea));
                              dispatch(updateShowDeleteIdeaDialog(true));
                            }}
                            >
                              Delete Idea
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                    ) : (
                      <div></div>
                    )}
                         </TableCell>
                       </TableRow>
              );
            })}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
         )}
       </>
       )
     : (
       // Goal Based Ideas Section
       selectedMenu === "Goal Based" && (
         <div className="space-y-4 mt-4">
           {ideas && ideas.length > 0 ? (
             ideas.map((goal) => (
               <GoalBasedIdea key={goal._id} goal={goal} />
             ))
           ) : (
             <div className="flex items-center justify-center mt-5">
               <div className="text-center space-y-4">
                 <img src="/static/illustrations/no-projects-found.svg" alt="" className="h-48 mx-auto" />
                 <h2 className="text-lg font-medium">No goals with ideas found</h2>
                 <p className="text-sm text-muted-foreground">
                   Create some goals first, then add ideas to them to see them organized by goal.
                 </p>
          </div>
                  </div>
           )}
                        </div>
       )
     ))}

      {/* Modals */}
      <CreateNewIdeaDialog isOpen={isCreateIdeaDialogOpen} onClose={() => setIsCreateIdeaDialogOpen(false)} />
      <TestIdeaDialog />
      <DeleteIdeaDialog />
      <TourModal />
      <ShareIdeaDialog />
    </div>
  );
}

export default Ideas;
