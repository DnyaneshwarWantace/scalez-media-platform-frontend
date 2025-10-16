import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../../redux/slices/projectSlice";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { UserX, AlertTriangle, Checkbox } from "lucide-react";

function RemoveUserDialog({ selectedUser, open, onOpenChange }) {
  const dispatch = useDispatch();
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const userIdLocal = localStorage.getItem("user");
  const objData = JSON.parse(userIdLocal);
  const storedUserId = objData?.id;
  
  const isCurrentUser = selectedUser && storedUserId === selectedUser._id;


  const handleRemoveUser = () => {
    if (selectedUser?._id) {
      dispatch(removeUser({ userId: selectedUser._id }));
      onOpenChange(false);
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
            <UserX className="h-5 w-5" />
            Remove User
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-red-800 font-medium">
                This action cannot be undone.
              </p>
              <p className="text-sm text-red-700">
                Removing this user will erase both the user account and all associated data (projects, goals, ideas, tests & learnings).
              </p>
            </div>
          </div>

          {/* Current User Warning */}
          {isCurrentUser && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800">
                You cannot remove yourself from the workspace.
              </p>
            </div>
          )}

          {/* Confirmation Checkbox */}
          {!isCurrentUser && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirmRemove"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="confirmRemove" className="text-sm font-medium">
                    I understand this action will permanently delete the user and all their data
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveUser}
              disabled={!isConfirmed || isCurrentUser}
              className="min-w-[10rem]"
            >
              Remove User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveUserDialog;
