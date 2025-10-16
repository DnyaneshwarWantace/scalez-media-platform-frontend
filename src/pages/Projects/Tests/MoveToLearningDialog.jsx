import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Field, FieldArray } from "formik";
import { Form, FormikProvider } from "formik";
import { useParams } from "react-router-dom";
import { moveToLearning, selectsingleLearningInfo, selectselectedLearning, updateLearning, updateselectedLearning } from "../../../redux/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";
import { useEffect } from "react";
import LoadingButton from "../../../components/common/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Trash2, Plus } from "lucide-react";

function MoveToLearningDialog() {
  const [mediaDocuments, setmediaDocuments] = useState([]);
  const mediaAndDocRef = useRef();
  const params = useParams();
  const projectId = params.projectId;
  const dispatch = useDispatch();
  const closeRef = useRef();
  const [isSubmitting, setisSubmitting] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
    dispatch(updateselectedLearning(null));
    aboutGoalFormik.resetForm();
    setmediaDocuments([]);
    setdeletedMedia([]);
  };

  const aboutGoalFormik = useFormik({
    initialValues: {
      result: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      result: Yup.string().required("result is required"),
      description: Yup.string().required("description is required"),
    }),
      onSubmit: async (values, { setErrors, setSubmitting }) => {
        console.log(aboutGoalFormik.values);
        setSubmitting(false);
      },
    });

    const onSubmitAboutGoalsForm = async () => {
      console.log(aboutGoalFormik.values);
      // setSubmitting(false);
    await dispatch(moveToLearning({ projectId, ...aboutGoalFormik.values, files: mediaDocuments, closeDialog }));

      if(selectedLearning) {
        const id = !selectedLearning ? projectId : selectedLearning?._id;
        await dispatch(
          updateLearning({ ...aboutGoalFormik.values, files: mediaDocuments, deletedMedia , projectId , learningId: id, setmediaDocuments })
        );
        closeDialog();
    }
  };

  const resetAllFields = () => {
    aboutGoalFormik.resetForm();
  };

  function isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];

    return file && acceptedImageTypes.includes(file["type"]);
  }

  const selectedLearning = useSelector(selectselectedLearning);
  const [isOpen, setIsOpen] = useState(false);
  console.log('selectedLearning :>> ', selectedLearning);

  useEffect(() => {
    if (selectedLearning) {
      setIsOpen(true);
      aboutGoalFormik.setValues({
        result: selectedLearning.result,
        description: selectedLearning.conclusion,
        files: selectedLearning.media
      });
    } else {
      aboutGoalFormik.setValues({
        result: "",
        description: "",
        files: [],
      });
    }
    console.log('src={{...aboutGoalFormik.getFieldProps("files")}} :>> ', {...aboutGoalFormik.getFieldProps("files").value});
  }, [selectedLearning]);
  const singleLearningInfo = useSelector(selectsingleLearningInfo);
  console.log('singleLearningInfo :>> ', singleLearningInfo);

  const [mediaActionsOverlay, setmediaActionsOverlay] = useState(null);

  const [deletedMedia, setdeletedMedia] = useState([]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) closeDialog();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedLearning ? "Edit Learning" : "Move to Learning"}</DialogTitle>
          <DialogDescription>
            Successful or not? Share your experience with this test!
          </DialogDescription>
        </DialogHeader>
        <FormikProvider value={aboutGoalFormik}>
          <Form autoComplete="off" noValidate onSubmit={aboutGoalFormik.handleSubmit}>
            <div className="space-y-4">
              {/* Result */}
              <div className="space-y-2">
                <Label htmlFor="result">Result *</Label>

                <Select
                  value={aboutGoalFormik.values.result}
                  onValueChange={(value) => aboutGoalFormik.setFieldValue("result", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Successful">Successful</SelectItem>
                    <SelectItem value="Unsuccessful">Unsuccessful</SelectItem>
                    <SelectItem value="Inconclusive">Inconclusive</SelectItem>
                  </SelectContent>
                </Select>
                {aboutGoalFormik.touched.result && aboutGoalFormik.errors.result && (
                  <p className="text-sm text-red-600">{aboutGoalFormik.errors.result}</p>
                )}
              </div>

              {/* Learning/Conclusion */}
              <div className="space-y-2">
                <Label htmlFor="description">Learning *</Label>
                <Textarea
                  rows={4}
                  {...aboutGoalFormik.getFieldProps("description")}
                  placeholder="Enter your learning or conclusion"
                  className="resize-none"
                />
                {aboutGoalFormik.touched.description && aboutGoalFormik.errors.description && (
                  <p className="text-sm text-red-600">{aboutGoalFormik.errors.description}</p>
                )}
              </div>

              {/* Media & Documents */}
              <div className="space-y-2">
                <Label>Media & Documents</Label>
                <input
                  className="hidden"
                  ref={mediaAndDocRef}
                  type="file"
                  multiple={true}
                  onChange={(e) => {
                    setmediaDocuments([...mediaDocuments, ...e.target.files]);
                  }}
                />
                <div className="grid grid-cols-4 gap-2 border rounded p-2">
                  {selectedLearning?.media?.filter(mediaUrl => !deletedMedia.includes(mediaUrl)).map((mediaUrl) => (
                    <div
                      key={mediaUrl}
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setmediaActionsOverlay(mediaUrl)}
                      onMouseLeave={() => setmediaActionsOverlay(null)}
                    >
                      <div className="border rounded overflow-hidden">
                        <img
                          src={`${backendServerBaseURL}/${mediaUrl}`}
                          alt=""
                          className="w-full h-24 object-cover"
                        />
                        {mediaActionsOverlay === mediaUrl && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <Trash2
                              className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                              onClick={() => setdeletedMedia([...deletedMedia, mediaUrl])}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {mediaDocuments.map((file, index) => (
                    isFileImage(file) ? (
                      <div
                        key={file.name}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setmediaActionsOverlay(file.name)}
                        onMouseLeave={() => setmediaActionsOverlay(null)}
                      >
                        <div className="border rounded overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-24 object-cover"
                          />
                          {mediaActionsOverlay === file.name && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <Trash2
                                className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  setmediaDocuments([
                                    ...mediaDocuments.slice(0, index),
                                    ...mediaDocuments.slice(index + 1),
                                  ]);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={file.name}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setmediaActionsOverlay(file.name)}
                        onMouseLeave={() => setmediaActionsOverlay(null)}
                      >
                        <div className="border rounded h-24 flex flex-col items-center justify-center p-2">
                          <p className="text-sm font-medium mb-1">File</p>
                          <p className="text-xs truncate max-w-full">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.name.split(".").pop().toUpperCase()}
                          </p>
                          {mediaActionsOverlay === file.name && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <Trash2
                                className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  setmediaDocuments([
                                    ...mediaDocuments.slice(0, index),
                                    ...mediaDocuments.slice(index + 1),
                                  ]);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ))}


                  {/* Add button */}
                  <div
                    className="border-2 border-dashed rounded flex items-center justify-center h-24 cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => mediaAndDocRef.current.click()}
                  >
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </FormikProvider>

        {/* Action buttons */}
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
          >
            Close
          </Button>
          <Button
            type="button"
            className="bg-black hover:bg-gray-800 text-white"
            onClick={async () => {
              setisSubmitting(true);
              await onSubmitAboutGoalsForm();
              setisSubmitting(false);
            }}
            disabled={isSubmitting || (!aboutGoalFormik.isValid && !selectedLearning)}
          >
            {isSubmitting ? "Saving..." : (selectedLearning ? "Update Learning" : "Create Learning")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MoveToLearningDialog;
