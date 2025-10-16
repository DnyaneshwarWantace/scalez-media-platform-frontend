import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createActionPlan,
  editActionPlan,
  selectSelectedActionPlan,
} from "../../redux/slices/actionPlanSlice";
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

function CreateNewActionPlanDialog() {
  const dispatch = useDispatch();
  const selectedActionPlan = useSelector(selectSelectedActionPlan);
  const [isOpen, setIsOpen] = useState(false);

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required("Plan Name is required"),
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  // Listen for custom event to open dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener('openActionPlanDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openActionPlanDialog', handleOpenDialog);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);
      if (selectedActionPlan) {
        dispatch(editActionPlan({ ...values, closeModal }));
      } else {
        dispatch(createActionPlan({ ...values, closeModal }));
      }
      setSubmitting(false);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    values,
    resetForm,
  } = formik;

  useEffect(() => {
    if (selectedActionPlan) {
      formik.setValues({
        name: selectedActionPlan.name,
      });
    } else {
      formik.setValues({
        name: "",
      });
    }
  }, [selectedActionPlan]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {selectedActionPlan ? "Edit" : "New"} Action Plan
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {selectedActionPlan 
              ? "Update your action plan details and structure."
              : "Create a structured workflow to organize your projects, track progress, and collaborate with your team."
            }
          </DialogDescription>
        </DialogHeader>
        
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Action Plan Name
              </Label>
              <Input
                id="name"
                type="text"
                {...getFieldProps("name")}
                placeholder="e.g., Product Launch Plan, Marketing Campaign, Client Onboarding"
                className={touched.name && errors.name ? "border-red-500" : ""}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <DialogFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black hover:bg-black/90 text-white"
              >
                {isSubmitting 
                  ? "Processing..." 
                  : selectedActionPlan 
                    ? "Update Action Plan" 
                    : "Create Action Plan"
                }
              </Button>
            </DialogFooter>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewActionPlanDialog;
