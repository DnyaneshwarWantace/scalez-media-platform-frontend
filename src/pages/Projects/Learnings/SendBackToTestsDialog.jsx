import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendLearningBackToTests,
  selectselectedLearning,
  updateselectedLearning,
  selectShowSendBackToTestsDialog,
  updateShowSendBackToTestsDialog
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

function SendBackToTestsDialog() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const navigate = useNavigate();
  const selectedLearning = useSelector(selectselectedLearning);
  const showDialog = useSelector(selectShowSendBackToTestsDialog);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(showDialog && !!selectedLearning);
  }, [selectedLearning, showDialog]);

  const closeDialog = () => {
    setIsOpen(false);
    dispatch(updateselectedLearning(null));
    dispatch(updateShowSendBackToTestsDialog(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        dispatch(updateselectedLearning(null));
        dispatch(updateShowSendBackToTestsDialog(false));
      }
      setIsOpen(open);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Learning Back To Test</DialogTitle>
          <DialogDescription>
            Sending back a learning to test will erase the conclusion and result data permanently, are you sure?
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
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => {
              dispatch(sendLearningBackToTests({ projectId, closeDialog, navigate }));
              closeDialog();
            }}
          >
            Send Back To Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SendBackToTestsDialog;
