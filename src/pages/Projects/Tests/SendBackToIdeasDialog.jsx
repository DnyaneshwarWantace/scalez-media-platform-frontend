import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendTestBackToIdeas,
  selectShowSendBackToIdeasDialog,
  updateShowSendBackToIdeasDialog
} from "../../../redux/slices/projectSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

function SendBackToIdeasDialog() {
  const dispatch = useDispatch();
  const params = useParams();
  const testId = params.testId;
  const projectId = params.projectId;
  const navigate = useNavigate();
  const isOpen = useSelector(selectShowSendBackToIdeasDialog);

  const closeDialog = () => {
    dispatch(updateShowSendBackToIdeasDialog(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(updateShowSendBackToIdeasDialog(open))}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Test Back To Idea</DialogTitle>
          <DialogDescription>
            This will remove tasks and members assigned
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeDialog}
          >
            Close
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => {
              dispatch(sendTestBackToIdeas({ testId, navigate, projectId }));
              closeDialog();
            }}
          >
            Send Back To Ideas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SendBackToIdeasDialog;
