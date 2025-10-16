import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Form, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedKeyMetric, selectSingleGoalInfo, updateKeyMetric } from "../../../redux/slices/projectSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

function UpdateMetricDialog({ open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedKeyMetric = useSelector(selectSelectedKeyMetric);
  const singleGoalInfo = useSelector(selectSingleGoalInfo);
  const dispatch = useDispatch();
  
  const closeDialog = () => {
    setIsOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
    formik.resetForm();
  };

  const NewProjectSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    value: Yup.number().required("Value is required"),
  });

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().substring(0, 10),
      value: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log("updateKeyMetric values", values);
      setSubmitting(false);
      dispatch(updateKeyMetric({ ...values, closeDialog, keymetricId: selectedKeyMetric?._id, goalId: singleGoalInfo?._id }));
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  // Don't auto-open - only open when explicitly triggered

  return (
    <Dialog open={open || isOpen} onOpenChange={onOpenChange || setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold">Update Metric</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{selectedKeyMetric?.name || 'Daily active users'}</p>
          </DialogHeader>

          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input 
                    type="date" 
                    {...getFieldProps("date")} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    placeholder="Enter Date" 
                  />
                  {touched.date && errors.date && (
                    <span className="text-sm text-red-600">
                      {errors.date}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <input 
                    type="number" 
                    {...getFieldProps("value")} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                    placeholder="Enter Value" 
                  />
                  {touched.value && errors.value && (
                    <span className="text-sm text-red-600">
                      {errors.value}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={closeDialog}
                >
                  Close
                </Button>
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Value"}
                </Button>
              </div>
            </Form>
          </FormikProvider>
        </DialogContent>
    </Dialog>
  );
}

export default UpdateMetricDialog;
