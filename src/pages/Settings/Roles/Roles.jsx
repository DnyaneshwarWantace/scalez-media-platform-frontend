import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllRoles, selectAllCollaborators, selectallRoles, updateselectedRole, updateviewRole, updateNewRoleDialogOpen, updateDeleteRoleDialogOpen } from "../../../redux/slices/settingSlice";
import DeleteRoleDialog from "./DeleteRoleDialog";
import NewRoleDialog from "./NewRoleDialog";
import { isTypeOwner, isRoleAdmin, isRoleMember, hasPermission_add_teammates, hasPermission_remove_teammates, hasPermission_add_roles } from "../../../utils/permissions";
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
  Shield, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Users
} from "lucide-react";
function Roles() {
  const [selectedMenu, setselectedMenu] = useState("Team");
  const ideas = [1, 2, 3];
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const collaborators = useSelector(selectAllCollaborators);
  const allRoles = useSelector(selectallRoles);
  console.log(allRoles)
  const dispatch = useDispatch();

  const ProjectsMenus = [];

  const RightProjectsMenus = [];

  useEffect(() => {
    dispatch(getAllRoles());
  }, [selectedMenu]);



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Roles</h1>
          <p className="text-sm text-gray-500">Set roles based on permissions</p>
        </div>

        {hasPermission_add_roles() && (
          <Button
            onClick={() => {
              dispatch(updateviewRole(false));
              dispatch(updateselectedRole(null));
              dispatch(updateNewRoleDialogOpen(true));
            }}
            className="min-w-[10rem]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        )}
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No roles defined</h3>
              <p className="text-gray-500 text-center mb-4">
                Create roles to manage permissions for your team members.
              </p>
              {hasPermission_add_roles() && (
                <Button
                  onClick={() => {
                    dispatch(updateviewRole(false));
                    dispatch(updateselectedRole(null));
                    dispatch(updateNewRoleDialogOpen(true));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Role
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRoles.map((role, index) => (
                  <TableRow key={index} className={index === 0 ? "bg-muted/50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {index === 0 && (
                            <div className="text-xs text-gray-500">Default role</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={role?.permissions && 
                          Object.keys(role?.permissions)?.filter(
                            (p) => role?.permissions[p] === false
                          ).length === 0 && role.name === "Owner"
                          ? "default" 
                          : "secondary"
                        }
                        className={
                          role?.permissions && 
                          Object.keys(role?.permissions)?.filter(
                            (p) => role?.permissions[p] === false
                          ).length === 0 && role.name === "Owner"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }
                      >
                        {role?.permissions &&
                        Object.keys(role?.permissions)?.filter(
                          (p) => role?.permissions[p] === false
                        ).length === 0 &&
                        role.name === "Owner"
                          ? "All Permissions"
                          : "Limited Access"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {index !== 0 && hasPermission_add_roles() && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                dispatch(updateviewRole(true));
                                dispatch(updateselectedRole(role));
                                dispatch(updateNewRoleDialogOpen(true));
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                dispatch(updateviewRole(false));
                                dispatch(updateselectedRole(role));
                                dispatch(updateNewRoleDialogOpen(true));
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                dispatch(updateviewRole(false));
                                dispatch(updateselectedRole(role));
                                dispatch(updateDeleteRoleDialogOpen(true));
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewRoleDialog />
      <DeleteRoleDialog />
    </div>
  );
}

export default Roles;
