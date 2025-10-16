import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createpointer,
  editpointer,
  selectselectedPointer,
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

function CreateNewPointerDialog() {
  const dispatch = useDispatch();
  const selectedPointer = useSelector(selectselectedPointer);
  const [isOpen, setIsOpen] = useState(false);

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  // Listen for custom event to open dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener('openPointerDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openPointerDialog', handleOpenDialog);
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
      if (selectedPointer) {
        dispatch(
          editpointer({ ...values, closeModal, pointerId: selectedPointer._id })
        );
      } else {
        dispatch(createpointer({ ...values, closeModal }));
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
    if (selectedPointer) {
      formik.setValues({
        name: selectedPointer.name,
      });
    } else {
      formik.setValues({
        name: "",
      });
    }
  }, [selectedPointer]);

  return (
    <>
      {/* Hidden Bootstrap modal for compatibility */}
      <div className="modal fade" id="CreateNewPointerDialog" tabIndex={-1} style={{ display: 'none' }}>
        <div className="modal-dialog modal-dialog-centered" style={{ minWidth: "45rem" }}>
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
            <DialogTitle className="text-xl font-semibold">
              {selectedPointer ? "Edit Pointer" : "Add a Pointer"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Create a new pointer to track specific action items.
            </DialogDescription>
          </DialogHeader>
          
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Pointer Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  {...getFieldProps("name")}
                  placeholder="Enter pointer name"
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
                    : selectedPointer 
                      ? "Update Pointer" 
                      : "Create Pointer"
                  }
                </Button>
              </DialogFooter>
            </Form>
          </FormikProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateNewPointerDialog;
