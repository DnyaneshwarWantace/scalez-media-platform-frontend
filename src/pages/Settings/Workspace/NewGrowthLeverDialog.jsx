import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createGrowthLever, selectselectedGrowthLever, selectNewGrowthLeverDialogOpen, updateNewGrowthLeverDialogOpen, updateGrowthLever } from "../../../redux/slices/settingSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { AlertCircle } from "lucide-react";

function NewGrowthLeverDialog() {
  const dispatch = useDispatch();
  const open = useSelector(selectNewGrowthLeverDialogOpen);
  const selectedGrowthLever = useSelector(selectselectedGrowthLever);

  const closeDialog = () => {
    dispatch(updateNewGrowthLeverDialogOpen(false));
  };

  const newLeverFormik = useFormik({
    initialValues: {
      leverName: "",
      color: "",
    },
    validationSchema: Yup.object().shape({
      leverName: Yup.string().required("Lever Name is required"),
      color: Yup.string().required("Color is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      if (selectedGrowthLever) {
        await dispatch(updateGrowthLever({ ...values, workspaceId: "633a6872ee23a833592cf0f0", closeDialog }));
      } else {
        await dispatch(createGrowthLever({ ...values, workspaceId: "633a6872ee23a833592cf0f0", closeDialog }));
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (selectedGrowthLever) {
      newLeverFormik.setValues({
        leverName: selectedGrowthLever.name,
        color: selectedGrowthLever.color,
      });
    } else {
      newLeverFormik.setValues({
        leverName: "",
        color: "",
      });
    }
  }, [selectedGrowthLever]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => dispatch(updateNewGrowthLeverDialogOpen(isOpen))}>
      <DialogContent className="sm:max-w-[500px]">
        <FormikProvider value={newLeverFormik}>
          <Form autoComplete="off" noValidate onSubmit={newLeverFormik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>{selectedGrowthLever ? "Edit Growth Lever" : "New Growth Lever"}</DialogTitle>
              <DialogDescription>
                {selectedGrowthLever ? "Edit an existing growth lever" : "Create a new growth lever"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="leverName">
                  Lever Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="leverName"
                  {...newLeverFormik.getFieldProps("leverName")}
                  placeholder="Enter Lever Name"
                />
                {newLeverFormik.touched.leverName && newLeverFormik.errors.leverName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {newLeverFormik.errors.leverName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">
                  Color <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newLeverFormik.values.color}
                  onValueChange={(value) => newLeverFormik.setFieldValue("color", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                    <SelectItem value="Orange">Orange</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                  </SelectContent>
                </Select>
                {newLeverFormik.touched.color && newLeverFormik.errors.color && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {newLeverFormik.errors.color}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={newLeverFormik.errors && Object.keys(newLeverFormik.errors)?.length !== 0}
              >
                {selectedGrowthLever ? "Save Changes" : "Create Lever"}
              </Button>
            </DialogFooter>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default NewGrowthLeverDialog;
