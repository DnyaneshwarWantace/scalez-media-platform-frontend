import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Form, FormikProvider } from "formik";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../redux/slices/settingSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Key, Eye, EyeOff } from "lucide-react";

function UpdatePasswordDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const closeDialog = () => {
    onOpenChange(false);
  };
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required("Old Password is required"),
      newPassword: Yup.string().required("New Password is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log(values);
      setSubmitting(true);
      await dispatch(updatePassword({ ...values, setErrors, closeDialog }));
      setSubmitting(false);
      resetForm();
      onOpenChange(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Update Password
          </DialogTitle>
        </DialogHeader>
        
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter your old password"
                    {...getFieldProps("oldPassword")}
                    className={touched.oldPassword && errors.oldPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {touched.oldPassword && errors.oldPassword && (
                  <p className="text-sm text-red-500">{errors.oldPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...getFieldProps("newPassword")}
                    className={touched.newPassword && errors.newPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {touched.newPassword && errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>
            </div>

            {/* Server Errors */}
            {errors.afterSubmit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.afterSubmit}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[10rem]"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePasswordDialog;
