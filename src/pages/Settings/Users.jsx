import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCollaborators,
  getAllUsers,
  selectAllCollaborators,
  selectAllUsers,
  selectUserLimit,
} from "../../redux/slices/settingSlice";
import { getAllProjects, selectUsers } from "../../redux/slices/projectSlice";
import { formatTime } from "../../utils/formatTime";
import { frontURL } from "../../utils/backendServerBaseURL";
import {
  isTypeOwner,
  isRoleAdmin,
  hasPermission_add_teammates,
  hasPermission_add_roles,
  hasPermission_remove_teammates,
} from "../../utils/permissions";
import InviteCollaboratorsDialog2 from "./InviteCollaboratorsDialog2";
import InviteTeamMemberDialog from "./InviteTeamMemberDialog";
import ChangeRoleDialog from "./ChangeRoleDialog";
import RemoveUserDialog from "./RemoveUserDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { 
  UserPlus, 
  MoreVertical, 
  Copy, 
  Users as UsersIcon, 
  UserCheck,
  AlertCircle 
} from "lucide-react";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

function Users() {
  const [selectedMenu, setselectedMenu] = useState("Team");
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
  const ideas = [1, 2, 3];
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const collaborators = useSelector(selectAllCollaborators);
  const dispatch = useDispatch();
  const addMemberDialogRef = useRef();
  const removeMemberDialogRef = useRef();
  let team = useSelector(selectAllUsers);
  let limit = useSelector(selectUserLimit); //newChange TBD

  if (addMemberDialogRef) {
    // console.log('team :>> ', team);
    // getAllUsers();
  }
  const [selectedUser, setselectedUser] = useState(null);
  // console.log('selectedUser :>> ', selectedUser);

  let team2 = useSelector(selectUsers);
  let arrCopy = [];
  if (selectedUser) {
    team = Object.assign(team2);
    const index = team.findIndex((x) => x._id === selectedUser._id);

    // 👇️ create a shallow copy of the array
    if (removeMemberDialogRef) {
      arrCopy = [...team];
      arrCopy.splice(index, 1);
      getAllUsers();
    }
  }

  const ProjectsMenus = [
    {
      name: "Team",
    },
    // {
    //   name: "Collaborators",
    // },
  ];

  const RightProjectsMenus = [];

  let userIdLocal = localStorage.getItem("user");
  let objData = JSON.parse(userIdLocal);
  let storedUserId = objData.id;
  // console.log('objData :>> ', objData);

  // }
  // if(removeMemberDialogRef && selectedUser) {
  //     // console.log('team.findIndex(a => a._id === selectedUser._id) :>> ', team.findIndex(a => a._id === selectedUser._id));
  //   // console.log('team remove:>> ', result);
  // }
  // console.log(' {team?.map((teamMember) => {team :>> ',  team?.filter((teamMember) => teamMember.invitedBy.firstName === objData.firstName));

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllCollaborators());
    dispatch(getAllProjects());
  }, [selectedMenu]);

  useEffect(() => {
    if (localStorage.getItem("openAddMemberDialog", null) === "1") {
      addMemberDialogRef.current.click();
      localStorage.setItem("openAddMemberDialog", "0");
    }
  }, []);

  const handleCopyLink = (index) => {
    const tempInput = document.createElement("input");
    tempInput.value = `${frontURL}/complete-profile/${index}`;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Display an alert indicating that the link has been copied
    const alertElement = document.createElement("div");
    alertElement.className = "alert alert-success mt-3";
    alertElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
        <path d="M7.5 1C3.91 1 1 3.91 1 7.5S3.91 14 7.5 14 14 11.09 14 7.5 11.09 1 7.5 1zm2.516 5.97a.53.53 0 0 1-.77 0L6.47 9.47l-1.47-1.47a.53.53 0 1 1 .76-.76L7 8.24l2.24-2.23a.53.53 0 1 1 .76.76l-2.23 2.23 2.23 2.23a.53.53 0 0 1 0 .77z"/>
      </svg>
      Link Copied!
    `;
    // alertElement.style.cssText = `width:fit-content;margin:auto;z-index:1000; `;
    document.getElementById("alert-container").appendChild(alertElement); // Append the alert element to a container div
    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Users</h1>
          <p className="text-sm text-gray-500">Manage teammates and collaborators</p>
        </div>

        <div className="flex gap-3">
          <Button
            ref={addMemberDialogRef}
            onClick={() => {
              const modal = document.getElementById('inviteUsers');
              if (modal) {
                const bootstrapModal = new window.bootstrap.Modal(modal);
                bootstrapModal.show();
              }
            }}
            disabled={!hasPermission_add_teammates()}
            className="min-w-[10rem]"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member ({team?.length}/{limit})
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {ProjectsMenus.map((menu) => (
            <button
              key={menu.name}
              onClick={() => setselectedMenu(menu.name)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedMenu === menu.name
                  ? "border-black text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              {menu.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Empty States */}
      {selectedMenu === "Team" && team?.length === 0 && (
        <Card className="bg-black text-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No team members yet</h3>
            <p className="text-gray-300 text-center mb-4">
              Start building your team by inviting members to collaborate on projects.
            </p>
            <Button
              onClick={() => {
              const modal = document.getElementById('inviteUsers');
              if (modal) {
                const bootstrapModal = new window.bootstrap.Modal(modal);
                bootstrapModal.show();
              }
            }}
              disabled={!hasPermission_add_teammates()}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedMenu === "Collaborators" && collaborators?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collaborators yet</h3>
            <p className="text-gray-500 text-center">
              Collaborators are added directly from the projects section.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Team Members Table */}
      {team?.length !== 0 && selectedMenu === "Team" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team?.map((teamMember, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`${backendServerBaseURL}/${teamMember.avatar}`} 
                            alt={`${teamMember.firstName} ${teamMember.lastName}`}
                          />
                          <AvatarFallback>
                            {teamMember.firstName?.[0]}{teamMember.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {teamMember.firstName} {teamMember.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Invited by {teamMember?.invitedBy?.firstName} {teamMember?.invitedBy?.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                      <TableCell>
                        <Badge className="bg-black text-white hover:bg-gray-800">
                          {teamMember?.role?.name}
                        </Badge>
                      </TableCell>
                    <TableCell>{teamMember?.email}</TableCell>
                    <TableCell>{formatTime(teamMember.createdAt)}</TableCell>
                    <TableCell>
                      {teamMember.lastLogin ? formatTime(teamMember.lastLogin) : "-"}
                    </TableCell>
                    <TableCell>
                      {teamMember.token ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-orange-600">
                            Pending
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(teamMember.token)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {(teamMember.role?.name?.toLowerCase() === "owner" || hasPermission_add_teammates()) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {hasPermission_add_roles() && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setselectedUser(teamMember);
                                  setShowChangeRoleDialog(true);
                                }}
                              >
                                Change Role
                              </DropdownMenuItem>
                            )}
                            {hasPermission_remove_teammates() && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setselectedUser(teamMember);
                                  setShowRemoveUserDialog(true);
                                }}
                                className="text-red-600"
                              >
                                Remove User
                              </DropdownMenuItem>
                            )}
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
      {/* Collaborators Table */}
      {collaborators?.length !== 0 && selectedMenu === "Collaborators" && (
        <Card>
          <CardHeader>
            <CardTitle>Collaborators</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators?.map((collaborator, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`${backendServerBaseURL}/${collaborator.avatar}`} 
                            alt={`${collaborator.firstName} ${collaborator.lastName}`}
                          />
                          <AvatarFallback>
                            {collaborator.firstName?.[0]}{collaborator.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                          {collaborator.firstName} {collaborator.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{collaborator.owner?.organization}</TableCell>
                    <TableCell>{collaborator.email}</TableCell>
                    <TableCell>{collaborator.project?.name}</TableCell>
                    <TableCell>{formatTime(collaborator.createdAt)}</TableCell>
                    <TableCell>
                      {collaborator.token ? (
                        <Badge variant="outline" className="text-orange-600">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600">
                            Disable Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Alert Container */}
      <div id="alert-container" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"></div>

      {/* Dialogs */}
      <InviteTeamMemberDialog />
      <InviteCollaboratorsDialog2 />
      <ChangeRoleDialog 
        selectedUser={selectedUser} 
        open={showChangeRoleDialog}
        onOpenChange={setShowChangeRoleDialog}
      />
      <RemoveUserDialog 
        selectedUser={selectedUser} 
        open={showRemoveUserDialog}
        onOpenChange={setShowRemoveUserDialog}
      />
    </div>
  );
}

export default Users;
