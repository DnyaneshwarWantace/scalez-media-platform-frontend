import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserRole, getAllRoles, selectallRoles } from "../../redux/slices/settingSlice";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Shield, AlertTriangle } from "lucide-react";

function ChangeRoleDialog({ selectedUser, open, onOpenChange }) {
  const [selectedRole, setSelectedRole] = useState("");
  const dispatch = useDispatch();
  const allRoles = useSelector(selectallRoles);

  const closeDialog = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

  useEffect(() => {
    if (selectedUser?.role?._id) {
      setSelectedRole(selectedUser.role._id);
    }
  }, [selectedUser]);

  const handleUpdateRole = () => {
    if (selectedUser?._id && selectedRole) {
      dispatch(
        changeUserRole({
          role: selectedRole,
          userId: selectedUser._id,
          closeDialog,
          reload: true
        })
      );
    }
  };

  // Don't render if no user is selected
  if (!selectedUser) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Role
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Changing role can disable some features for the user.
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Select a role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role, index) => (
                  <SelectItem 
                    key={role._id} 
                    value={role._id}
                    disabled={index === 0}
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              className="min-w-[10rem]"
            >
              Update Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeRoleDialog;
