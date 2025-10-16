import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import { Form, FormikProvider } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createcategory, editcategory, selectselectedCategory } from "../../redux/slices/actionPlanSlice";
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

function CreateNewCategoryDialog() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(selectselectedCategory);
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

    window.addEventListener('openCategoryDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openCategoryDialog', handleOpenDialog);
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
      if (selectedCategory) {
        dispatch(editcategory({ ...values, closeModal }));
      } else {
        dispatch(createcategory({ ...values, closeModal }));
      }
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;

  useEffect(() => {
    if (selectedCategory) {
      formik.setValues({
        name: selectedCategory.name,
      });
    } else {
      formik.setValues({
        name: "",
      });
    }
  }, [selectedCategory]);

  return (
    <>
      {/* Hidden Bootstrap modal for compatibility */}
      <div className="modal fade" id="CreateNewCategoryDialog" tabIndex={-1} style={{ display: 'none' }}>
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
              {selectedCategory ? "Edit Category" : "Add a Category"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Create a new category to organize your action plan items.
            </DialogDescription>
          </DialogHeader>
          
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  {...getFieldProps("name")}
                  placeholder="Enter category name"
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
                    : selectedCategory 
                      ? "Update Category" 
                      : "Create Category"
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

export default CreateNewCategoryDialog;
