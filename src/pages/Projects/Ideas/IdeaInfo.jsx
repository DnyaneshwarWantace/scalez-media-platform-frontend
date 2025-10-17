import React, { useState } from "react";
import TestIdeaDialog from "./TestIdeaDialog";
import { MentionsInput, Mention } from "react-mentions";
import FilePreview from "../../../components/common/FilePreview";
import Members from "../../../components/common/Members";
// import Collaborators from "../../../components/common/Collaborators";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  getProjectUsers,
  nominateIdea,
  readSingleIdea,
  selectProjectUsers,
  selectSelectedIdea,
  selectSingleIdeaInfo,
  unnominateIdea,
  updateComment,
  updateSelectedIdea,
  updateselectedTest,
} from "../../../redux/slices/projectSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { formatTime } from "../../../utils/formatTime";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import CreateNewIdeaDialog from "./CreateNewIdeaDialog";
import { swapTags } from "../../../utils/tag.js";
import moment from "moment";
import { hasPermission_create_comments, hasPermission_create_ideas, hasPermission_nominate_ideas, isRoleAdmin, isRoleMember, isTypeOwner } from "../../../utils/permissions";
import Spinner from "../../../components/common/Spinner";
import LoadingButton from "../../../components/common/LoadingButton";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import { 
  Star, 
  CheckCircle, 
  Edit3, 
  MoreVertical, 
  Calendar, 
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Plus,
  BarChart3,
  Bell,
  Edit,
  Trash2,
  Play,
  UserPlus,
  Settings,
  Activity
} from "lucide-react";

function IdeaInfo() {
  const [comment, setcomment] = useState("");
  const [comment2, setcomment2] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const ideaId = params.ideaId;
  const projectId = params.projectId;
  const selectedIdea = useSelector(selectSingleIdeaInfo);
  const me = JSON.parse(localStorage.getItem("user", ""));
  const projectUsers = useSelector(selectProjectUsers);
  const [editingComment, seteditingComment] = useState(0);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));

  const [showLoader, setShowLoader] = useState(true);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isEditIdeaDialogOpen, setIsEditIdeaDialogOpen] = useState(false);

  // useEffect(() => {
  //   if (selectedIdea) {
  //     setShowLoader(false); 
  //   } else {
  //     setShowLoader(true); 
  //   }
  // }, [selectedIdea]);

  useEffect(() => {
    dispatch(readSingleIdea({ ideaId }));
    dispatch(getProjectUsers({ projectId }));
    setTimeout(() => {
      setShowLoader(false); 
    }, 2000);
  }, []);

  const ProjectsMenus = [
    {
      name: "Weekly Sales",
    },
    {
      name: "Monthly Revenue",
    },
  ];

  // Function to generate comprehensive activity data for ideas
  const generateIdeaActivities = () => {
    const activities = [];

    // Add comments as activities
    if (selectedIdea?.comments) {
      selectedIdea.comments.forEach(comment => {
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

    // Add idea creation activity
    if (selectedIdea?.createdAt) {
      activities.push({
        id: `idea-created-${selectedIdea._id}`,
        type: 'idea_created',
        user: selectedIdea.createdBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
        action: 'created idea',
        description: selectedIdea.name,
        timestamp: selectedIdea.createdAt,
        icon: Plus,
        color: 'text-indigo-600'
      });
    }

    // Add idea updates activity
    if (selectedIdea?.updatedAt && selectedIdea.updatedAt !== selectedIdea.createdAt) {
      activities.push({
        id: `idea-updated-${selectedIdea._id}`,
        type: 'idea_updated',
        user: selectedIdea.updatedBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
        action: 'updated idea',
        description: 'Idea details were modified',
        timestamp: selectedIdea.updatedAt,
        icon: Edit3,
        color: 'text-orange-600'
      });
    }

    // Add nominations as activities
    if (selectedIdea?.nominations && selectedIdea.nominations.length > 0) {
      selectedIdea.nominations.forEach((nominationId, index) => {
        const nominator = projectUsers?.find(user => user._id === nominationId);
        if (nominator) {
          activities.push({
            id: `nomination-${selectedIdea._id}-${index}`,
            type: 'nomination',
            user: nominator,
            action: 'nominated idea',
            description: 'Starred this idea',
            timestamp: selectedIdea.updatedAt, // Using updatedAt as proxy for nomination time
            icon: Star,
            color: 'text-yellow-600'
          });
        }
      });
    }

    // Add ICE score updates as activities
    if (selectedIdea?.impact || selectedIdea?.confidence || selectedIdea?.ease) {
      activities.push({
        id: `ice-update-${selectedIdea._id}`,
        type: 'ice_update',
        user: selectedIdea.updatedBy || selectedIdea.createdBy || { firstName: 'System', lastName: '', avatar: 'uploads/default.png' },
        action: 'updated ICE score',
        description: `Impact: ${selectedIdea.impact || 0}, Confidence: ${selectedIdea.confidence || 0}, Ease: ${selectedIdea.ease || 0}`,
        timestamp: selectedIdea.updatedAt || selectedIdea.createdAt,
        icon: BarChart3,
        color: 'text-green-600'
      });
    }

    // Add tests created for this idea
    if (selectedIdea?.tests) {
      selectedIdea.tests.forEach(test => {
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
                  <div className="space-y-1">
                    <div className="skeleton-placeholder h-7 w-64"></div>
                    <div className="skeleton-placeholder h-3 w-40"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="skeleton-placeholder h-8 w-24 rounded-md"></div>
                    <div className="skeleton-placeholder h-8 w-24 rounded-md"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="skeleton-placeholder h-3 w-20 mb-1"></div>
                    <div className="skeleton-placeholder h-4 w-full mb-1"></div>
                    <div className="skeleton-placeholder h-4 w-4/5 mb-1"></div>
                    <div className="skeleton-placeholder h-4 w-3/4"></div>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <div className="skeleton-placeholder h-3 w-20 mb-1"></div>
                      <div className="skeleton-placeholder h-4 w-28"></div>
                    </div>
                    <div>
                      <div className="skeleton-placeholder h-3 w-20 mb-1"></div>
                      <div className="skeleton-placeholder h-5 w-12"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ICE Analysis Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton-placeholder h-7 w-32"></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6 pb-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="skeleton-placeholder h-9 w-12 mb-2"></div>
                        <div className="skeleton-placeholder h-4 w-20 mb-4"></div>
                        <div className="skeleton-placeholder h-2 w-32 rounded-full mb-2"></div>
                        <div className="skeleton-placeholder h-3 w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Idea Details Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton-placeholder h-7 w-32"></div>
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="skeleton-placeholder h-4 w-16"></div>
                      <div className="skeleton-placeholder h-4 w-20"></div>
                      <div className="skeleton-placeholder h-4 w-24"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="skeleton-placeholder h-4 w-24"></div>
                      <div className="skeleton-placeholder h-4 w-28"></div>
                      <div className="skeleton-placeholder h-5 w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comments Skeleton */}
            <div>
              <div className="skeleton-placeholder h-6 w-24 mb-4"></div>
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
              {[1, 2].map((i) => (
                <Card key={i} className="mb-3">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="skeleton-placeholder h-10 w-10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="skeleton-placeholder h-4 w-24 mb-2"></div>
                        <div className="skeleton-placeholder h-4 w-full mb-1"></div>
                        <div className="skeleton-placeholder h-4 w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Nominations Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="skeleton-placeholder h-5 w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="skeleton-placeholder h-10 w-10 rounded-full"></div>
                      <div className="skeleton-placeholder h-4 w-24"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Details Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="skeleton-placeholder h-4 w-20 mb-2"></div>
                    <div className="skeleton-placeholder h-4 w-32"></div>
                  </div>
                  <div>
                    <div className="skeleton-placeholder h-4 w-24 mb-2"></div>
                    <div className="skeleton-placeholder h-6 w-16"></div>
                  </div>
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
                    <h1 className="text-xl font-medium">{selectedIdea?.name}</h1>
                    <p className="text-xs text-muted-foreground">
                      {openedProject?.name} / Ideas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 ${
                        selectedIdea?.nominations.includes(JSON.parse(localStorage.getItem("user")).id)
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          : ""
                      }`}
                      onClick={() => {
                        selectedIdea?.nominations.includes(JSON.parse(localStorage.getItem("user")).id)
                          ? dispatch(unnominateIdea({ ideaId: ideaId }))
                          : dispatch(nominateIdea({ ideaId: ideaId }));
                      }}
                      disabled={!hasPermission_nominate_ideas()}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Nominate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        dispatch(updateselectedTest(selectedIdea));
                      }}
                      disabled={!hasPermission_create_ideas()}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Test Idea
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs text-muted-foreground mb-1">Description</h3>
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none
                        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
                        [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4
                        [&_li]:my-1 [&_a]:text-blue-600 [&_a]:underline
                        [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                        [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold
                        [&_h3]:text-base [&_h3]:font-bold [&_p]:my-2"
                      dangerouslySetInnerHTML={{
                        __html: selectedIdea?.description || '<p className="text-gray-500">No description provided</p>'
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <h3 className="text-xs text-muted-foreground mb-1">Created On</h3>
                      <p className="text-sm">{formatTime(selectedIdea?.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-xs text-muted-foreground mb-1">ICE Score</h3>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
                        {selectedIdea?.score || 'Not Set'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ICE Analysis Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">ICE Analysis</h2>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Impact Card */}
                <Card>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{selectedIdea?.impact || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Impact</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((selectedIdea?.impact || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence Card */}
                <Card>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{selectedIdea?.confidence || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Confidence</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((selectedIdea?.confidence || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ease Card */}
                <Card>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{selectedIdea?.ease || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Ease</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((selectedIdea?.ease || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Idea Details Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Idea Details</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Goal</TableHead>
                        <TableHead className="font-medium">Key Metric</TableHead>
                        <TableHead className="font-medium">Growth Lever</TableHead>
                        <TableHead className="font-medium">Created By</TableHead>
                        <TableHead className="font-medium">Nominations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">{selectedIdea?.goal?.name || 'No goal assigned'}</TableCell>
                        <TableCell className="text-sm">{selectedIdea?.keymetric?.name || 'No metric assigned'}</TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
                            {selectedIdea?.lever || "Not Defined"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {selectedIdea?.createdBy?.firstName} {selectedIdea?.createdBy?.lastName}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
                            {selectedIdea?.nominations?.length || 0} nominations
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Media Section */}
            {selectedIdea?.media && selectedIdea.media.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Media & Documents</h2>
                  </div>
                <Card>
                  <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea?.media?.map((mediaUrl) => {
                      return (
                        <FilePreview
                          url={`${backendServerBaseURL}/${mediaUrl}`}
                          key={mediaUrl}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

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
                      {projectUsers?.length != 0 && (
                        <MentionsInput
                          className="mentions w-100"
                          value={comment}
                          placeholder="Comment Here"
                          onChange={(e) => {
                            console.log(e.target.value);
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
                            data={projectUsers.map((pu) => {
                              return {
                                id: pu._id,
                                display: `@${pu.firstName} ${pu.lastName}`,
                              };
                            })}
                          />
                        </MentionsInput>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <LoadingButton
                        loading={isSubmitting}
                        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        onClick={async () => {
                          setisSubmitting(true);
                          await dispatch(addComment({ ideaId, comment }));
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
                  {selectedIdea?.comments?.map((c) => {
                    return (
                      <Card key={c._id}>
                        <CardContent className="pt-4">
                          <div className="flex gap-3">
                            <img
                              src={`${backendServerBaseURL}/${c.createdBy?.avatar || projectUsers[0]?.avatar}`}
                              className="w-10 h-10 rounded-full"
                              alt=""
                            />

                            {editingComment !== c._id && (
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium text-sm">{`${c.createdBy?.firstName} ${c.createdBy?.lastName}`}</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                      {moment(new Date(c.createdAt)).fromNow()}
                                    </p>
                                    {hasPermission_create_comments() && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                            <Edit3 className="h-4 w-4 text-gray-600" />
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
                                                deleteComment({
                                                  ideaId,
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
                                  placeholder="Edit comment..."
                                  onChange={(e) => {
                                    console.log(e.target.value);
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
                                    data={projectUsers.map((pu) => {
                                      return {
                                        id: pu._id,
                                        display: `@${pu.firstName} ${pu.lastName}`,
                                      };
                                    })}
                                  />
                                </MentionsInput>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      seteditingComment(0);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                      const commentData = c;
                                      dispatch(
                                        updateComment({
                                          commentId: commentData._id,
                                          comment: comment2,
                                          ideaId,
                                        })
                                      );
                                      seteditingComment(0);
                                    }}
                                  >
                                    Save
                                  </Button>
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

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Recent Activity</h3>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {generateIdeaActivities().length}
                  </Badge>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generateIdeaActivities().slice(0, 10).map((activity) => {
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
                  {generateIdeaActivities().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Edit Idea Card */}
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    dispatch(updateSelectedIdea(selectedIdea));
                    setIsEditIdeaDialogOpen(true);
                  }}
                  disabled={!hasPermission_create_ideas()}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Idea
                </Button>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Team Members</h3>
                </div>
                <Members />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <TestIdeaDialog />
      <CreateNewIdeaDialog 
        isOpen={isEditIdeaDialogOpen} 
        onClose={() => setIsEditIdeaDialogOpen(false)}
        selectedIdea={selectedIdea}
      />
    </div>
  );
}

export default IdeaInfo;
