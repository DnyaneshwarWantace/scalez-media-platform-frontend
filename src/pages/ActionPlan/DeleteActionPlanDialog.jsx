import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteActionPlan } from "../../redux/slices/actionPlanSlice";
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

function DeleteActionPlanDialog() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  // Listen for custom event to open dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener('openDeleteActionPlanDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openDeleteActionPlanDialog', handleOpenDialog);
    };
  }, []);

  return (
    <>
      {/* Hidden Bootstrap modal for compatibility */}
      <div className="modal fade" id="DeleteActionPlanDialog" tabIndex={-1} style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <button style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* shadcn/ui Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Delete Action Plan
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this action plan?{" "}
              <span className="font-semibold text-gray-900">
                All the data will be permanently erased.
              </span>
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                dispatch(deleteActionPlan({ closeModal }));
              }}
            >
              Delete Action Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteActionPlanDialog;
