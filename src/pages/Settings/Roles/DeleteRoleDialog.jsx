import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserRole, deleteRole, findARole, findRole, selectallRoles, selectselectedRole, selectDeleteRoleDialogOpen, updateDeleteRoleDialogOpen } from "../../../redux/slices/settingSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { AlertTriangle, Trash2 } from "lucide-react";

function DeleteRoleDialog() {
  const dispatch = useDispatch();
  const open = useSelector(selectDeleteRoleDialogOpen);
  const selectedRole = useSelector(selectselectedRole);
  const singleRole = useSelector(findARole);
  const allRoles = useSelector(selectallRoles);

  const closeDialog = () => {
    dispatch(updateDeleteRoleDialogOpen(false));
  };

  useEffect(() => {
    if (open) {
      dispatch(findRole());
    }
  }, [open, selectedRole]);

  let filterData = allRoles.filter((el) => {
    return selectedRole?.name !== el.name;
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => dispatch(updateDeleteRoleDialogOpen(isOpen))}>
      <DialogContent className="sm:max-w-[600px]">
        {singleRole.length > 0 ? (
          // Has Users - Show Warning
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <DialogTitle>Cannot Delete Role</DialogTitle>
                  <DialogDescription>
                    {singleRole.length} user{singleRole.length > 1 ? 's are' : ' is'} assigned to this role
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  You must reassign all users before deleting this role.
                </p>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>New Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {singleRole.map((el) => (
                      <TableRow key={el._id}>
                        <TableCell className="font-medium">
                          {el.firstName} {el.lastName}
                        </TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value) => {
                              dispatch(
                                changeUserRole({
                                  role: value,
                                  userId: el._id,
                                })
                              );
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select new role" />
                            </SelectTrigger>
                            <SelectContent>
                              {filterData.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={singleRole.length > 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Role
              </Button>
            </DialogFooter>
          </>
        ) : (
          // No Users - Simple Confirmation
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <DialogTitle>Delete Role</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  This will permanently delete the role <span className="font-semibold">"{selectedRole?.name}"</span>
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch(deleteRole({ closeDialog }));
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Role
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DeleteRoleDialog;
