import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormikProvider } from "formik";
import {
  createModel,
  editModel,
  selectselectedModel,
  getSingleModel,
  selectsingleModelInfo,
  selectShowCreateModelDialog,
  updateShowCreateModelDialog
} from "../../redux/slices/modelSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

function CreateNewModelDialog() {
  const selectedModel = useSelector(selectselectedModel);
  const dispatch = useDispatch();
  const params = useParams();
  const modelId = params.modelId;
  const singleModelInfo = useSelector(selectsingleModelInfo);
  const navigate = useNavigate();
  const isOpen = useSelector(selectShowCreateModelDialog);

  const closeModal = () => {
    dispatch(updateShowCreateModelDialog(false));
    formik.resetForm();
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Model name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validationSchema: NewModelSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      if (selectedModel) {
        dispatch(
          editModel({
            modelId,
            name: values.name,
            closeModal,
          })
        );
        dispatch(getSingleModel({ modelId }));
      } else {
        dispatch(
          createModel({
            name: values.name,
            values: {},
            navigate,
            closeModal,
          })
        );
      }

      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedModel && singleModelInfo) {
        formik.setValues({ name: singleModelInfo.name });
      } else {
        formik.setValues({ name: "" });
      }
    }
  }, [isOpen, selectedModel, singleModelInfo]);

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        dispatch(updateShowCreateModelDialog(open));
        if (!open) {
          formik.resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {selectedModel ? "Edit Model" : "New Model"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {selectedModel
              ? "Update the model name below."
              : "Create a new model by entering a name below."}
          </DialogDescription>
        </DialogHeader>

        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Model Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter model name"
                {...getFieldProps("name")}
                className={touched.name && errors.name ? "border-red-500" : ""}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800"
              >
                {isSubmitting
                  ? "Saving..."
                  : selectedModel && singleModelInfo
                    ? "Save Changes"
                    : "Create Model"}
              </Button>
            </DialogFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewModelDialog;
