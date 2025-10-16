import React from "react";
import { deleteModel, selectShowDeleteModelDialog, updateShowDeleteModelDialog } from "../../redux/slices/modelSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { AlertTriangle } from "lucide-react";

function DeleteModelDialog() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectShowDeleteModelDialog);

  const closeModal = () => {
    dispatch(updateShowDeleteModelDialog(false));
  };

  const handleDelete = () => {
    dispatch(deleteModel({ closeModal }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(updateShowDeleteModelDialog(open))}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">Delete Model</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            Are you sure you want to delete this model? This action cannot be undone and all data will be permanently lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModelDialog;
