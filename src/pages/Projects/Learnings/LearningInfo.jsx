import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addLearningComment,
  deleteLearningComment,
  getProjectCollaborators,
  getProjectUsers,
  readSingleLearning,
  selectProjectUsers,
  selectsingleLearningInfo,
  updateLearningComment,
  updateselectedLearning,
  updateTestTaskStatus,
  updateShowSendBackToTestsDialog,
} from "../../../redux/slices/projectSlice";
import SendBackToTestsDialog from "./SendBackToTestsDialog";
import { formatTime, formatDate2 } from "../../../utils/formatTime";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { swapTags } from "../../../utils/tag.js";
import moment from "moment";
import { MentionsInput, Mention } from "react-mentions";
import FilePreview from "../../../components/common/FilePreview";
import InviteCollaboratorsDialog from "../../Settings/InviteCollaboratorsDialog";
import { hasPermission_create_learnings, hasPermission_create_comments } from "../../../utils/permissions";
import MoveToLearningDialog from "../Tests/MoveToLearningDialog";
import TaskLearningDialog from "../Learnings/TaskLearningDialog";
import LoadingButton from "../../../components/common/LoadingButton";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Edit3, Users, TestTube2 } from "lucide-react";

function LearningInfo() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const learningId = params.learningId;
  const navigate = useNavigate();
  const singleLearningInfo = useSelector(selectsingleLearningInfo);
  const openedProject = JSON.parse(localStorage.getItem("openedProject", ""));
  const projectUsers = useSelector(selectProjectUsers);
  const [comment, setcomment] = useState("");
  const [comment2, setcomment2] = useState("");
  const [editingComment, seteditingComment] = useState(0);
  const me = JSON.parse(localStorage.getItem("user", ""));
  const [showLoader, setShowLoader] = useState(true);
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    dispatch(readSingleLearning({ learningId }));
    dispatch(getProjectUsers({ projectId }));
    dispatch(getProjectCollaborators({ projectId }));
    setTimeout(() => {
      setShowLoader(false);
    }, 2000);
  }, []);

  return (
    <div className="space-y-6">
      {showLoader ? (
        /* Skeleton Loader */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <div className="skeleton-placeholder h-8 w-32 rounded-md"></div>
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
                      <div className="skeleton-placeholder h-3 w-16 mb-1"></div>
                      <div className="skeleton-placeholder h-5 w-24"></div>
                    </div>
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

            {/* Learning Details Skeleton */}
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

            {/* Conclusion Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton-placeholder h-7 w-32"></div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="skeleton-placeholder h-4 w-full"></div>
                    <div className="skeleton-placeholder h-4 w-full"></div>
                    <div className="skeleton-placeholder h-4 w-4/5"></div>
                    <div className="skeleton-placeholder h-4 w-3/4"></div>
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
            {/* Result Badge Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="skeleton-placeholder h-5 w-20 mb-2"></div>
                <div className="skeleton-placeholder h-8 w-32"></div>
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
                  <div>
                    <div className="skeleton-placeholder h-4 w-20 mb-2"></div>
                    <div className="skeleton-placeholder h-5 w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <h1 className="text-xl font-medium">{singleLearningInfo?.name}</h1>
                    <p className="text-xs text-muted-foreground">
                      {openedProject?.name} / Learnings
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        dispatch(updateselectedLearning(singleLearningInfo));
                        dispatch(updateShowSendBackToTestsDialog(true));
                      }}
                      disabled={!hasPermission_create_learnings()}
                    >
                      <TestTube2 className="h-3 w-3 mr-1" />
                      Send to Tests
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs text-muted-foreground mb-1">Conclusion</h3>
                    <Badge className="bg-black text-white hover:bg-black text-xs mb-2">
                      {singleLearningInfo?.result}
                    </Badge>
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none
                        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
                        [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4
                        [&_li]:my-1 [&_a]:text-blue-600 [&_a]:underline
                        [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                        [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold
                        [&_h3]:text-base [&_h3]:font-bold [&_p]:my-2"
                      dangerouslySetInnerHTML={{
                        __html: singleLearningInfo?.conclusion || '<p className="text-gray-500">No conclusion provided</p>'
                      }}
                    />
                  </div>

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
                        __html: singleLearningInfo?.description || '<p className="text-gray-500">No description provided</p>'
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <h3 className="text-xs text-muted-foreground mb-1">Created On</h3>
                      <p className="text-sm">{formatTime(singleLearningInfo?.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-xs text-muted-foreground mb-1">ICE Score</h3>
                      <Badge className="bg-black text-white hover:bg-black text-xs">
                        {singleLearningInfo?.score}
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
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{singleLearningInfo?.impact || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Impact</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-black h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((singleLearningInfo?.impact || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{singleLearningInfo?.confidence || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Confidence</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-black h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((singleLearningInfo?.confidence || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ease Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold mb-2">{singleLearningInfo?.ease || 0}</div>
                      <div className="text-sm text-muted-foreground mb-4">Ease</div>
                      <div className="relative w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="absolute top-0 left-0 bg-black h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(((singleLearningInfo?.ease || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">0 - 10</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Learning Details Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Learning Details</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Goal</TableHead>
                        <TableHead className="font-medium">Key Metric</TableHead>
                        <TableHead className="font-medium">Growth Lever</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">{singleLearningInfo?.goal?.name || 'No goal assigned'}</TableCell>
                        <TableCell className="text-sm">{singleLearningInfo?.keymetric?.name || 'No metric assigned'}</TableCell>
                        <TableCell>
                          <Badge className="bg-black text-white hover:bg-black text-xs">
                            {singleLearningInfo?.lever || "Not Defined"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tasks</h2>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {singleLearningInfo?.tasks?.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`task-${index}`}
                          checked={task.status}
                          disabled={true}
                        />
                        <label
                          htmlFor={`task-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {task.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Media Section */}
            {singleLearningInfo?.media && singleLearningInfo.media.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Media & Documents</h2>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {singleLearningInfo?.media?.map((mediaUrl) => {
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
                            setcomment(e.target.value);
                          }}
                        >
                          <Mention
                            className="mentions__mention"
                            markup="@{{__type__||__id__||__display__}}"
                            trigger="@"
                            renderSuggestion={(entry, search, highlightedDisplay, index, focused) => {
                              return (
                                <div className="p-2 border-b flex items-center gap-2">
                                  <img
                                    src={`${backendServerBaseURL}/${projectUsers[index].avatar}`}
                                    className="w-8 h-8 rounded-full"
                                    alt=""
                                  />
                                  <p className="mb-0 text-sm">
                                    {projectUsers[index].firstName} {projectUsers[index].lastName}
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
                          await dispatch(addLearningComment({ learningId, comment }));
                          setcomment("");
                          setTimeout(() => {
                            setisSubmitting(false);
                          }, 200);
                        }}
                        disabled={comment.length > 0 && hasPermission_create_comments() ? false : true}
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
                  {singleLearningInfo?.comments?.map((c) => {
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
                                                deleteLearningComment({
                                                  learningId,
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

                                <div className="text-sm">{c.comment && swapTags(c.comment)}</div>
                              </div>
                            )}

                            {editingComment === c._id && (
                              <div className="flex-1">
                                <MentionsInput
                                  className="mentions w-full mb-3"
                                  value={comment2}
                                  placeholder="Edit comment..."
                                  onChange={(e) => {
                                    setcomment2(e.target.value);
                                  }}
                                >
                                  <Mention
                                    className="mentions__mention"
                                    markup="@{{__type__||__id__||__display__}}"
                                    trigger="@"
                                    renderSuggestion={(entry, search, highlightedDisplay, index, focused) => {
                                      return (
                                        <div className="p-2 border-b flex items-center gap-2">
                                          <img
                                            src={`${backendServerBaseURL}/${projectUsers[index].avatar}`}
                                            className="w-8 h-8 rounded-full"
                                            alt=""
                                          />
                                          <p className="mb-0 text-sm">
                                            {projectUsers[index].firstName} {projectUsers[index].lastName}
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
                                        updateLearningComment({
                                          commentId: commentData._id,
                                          comment: comment2,
                                          learningId,
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
            {/* Edit Learning Card */}
            <Card>
              <CardContent className="p-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    dispatch(updateselectedLearning(singleLearningInfo));
                  }}
                  disabled={!hasPermission_create_learnings()}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Learning
                </button>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Assigned Members</h3>
                </div>
                <div className="space-y-2">
                  {singleLearningInfo?.assignedTo?.map((member) => (
                    <div key={member._id} className="flex items-center gap-2 p-2 border-b">
                      <img
                        src={`${backendServerBaseURL}/${member.avatar}`}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member?.role?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <SendBackToTestsDialog />
      <InviteCollaboratorsDialog />
      <MoveToLearningDialog />
      <TaskLearningDialog />
    </div>
  );
}

export default LearningInfo;
