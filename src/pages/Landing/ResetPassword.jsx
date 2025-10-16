import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Check, KeyRound, Loader2, CheckCircle } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [passwordResetSuccessfully, setpasswordResetSuccessfully] = useState(false);

  const RegisterSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Password doesn't match"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    validateOnChange: true,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      setSubmitting(false);
    },
  });

  const onResetPassword = (e) => {
    let resettoken = window.location.pathname.split('/').reverse()[0];
    console.log("resettoken", resettoken)

    let newPasswd = {...getFieldProps("password")};
    let conFirmPasswd = {...getFieldProps("confirmPassword")};

    console.log('newPasswd :>> ', newPasswd);
    console.log('conFirmPasswd :>> ', conFirmPasswd);
    const payload = {
      newPassword: newPasswd.value,
      resetPasswordToken: resettoken
    };
    console.log("payload", payload);
    const value = resetPassword(payload);
    console.log(value);
  };

  const resetPassword = (data) => {
    fetch(`${backendServerBaseURL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('data :>> ', data);
      navigate("/login");
    })
    .catch((error) => {
      throw error
    })
  }

  const { errors, touched, isSubmitting, getFieldProps } = formik;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!passwordResetSuccessfully && (
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={onResetPassword}>
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                      <KeyRound className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-semibold text-center text-foreground">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Create a new password for your account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      className="h-11"
                      {...getFieldProps("password")}
                    />
                    {touched.password && errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}

                    {/* Password Requirements */}
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-medium text-muted-foreground">Password requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          {formik.values.password?.length >= 8 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                          )}
                          <span className={formik.values.password?.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                            Use 8 or more characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {/^(?=.*[a-z])/.test(formik.values.password) ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                          )}
                          <span className={/^(?=.*[a-z])/.test(formik.values.password) ? "text-green-600" : "text-muted-foreground"}>
                            Use a minimum of one letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {/^(?=.*[0-9])/.test(formik.values.password) ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                          )}
                          <span className={/^(?=.*[0-9])/.test(formik.values.password) ? "text-green-600" : "text-muted-foreground"}>
                            Use a minimum of one number
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="h-11"
                      {...getFieldProps("confirmPassword")}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Server Errors */}
                  {errors.afterSubmit && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.afterSubmit}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium"
                    disabled={
                      isSubmitting ||
                      !Boolean(touched.password) ||
                      !Boolean(touched.confirmPassword) ||
                      Boolean(errors.password) ||
                      Boolean(errors.confirmPassword)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </Form>
          </FormikProvider>
        )}

        {passwordResetSuccessfully && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Password Successfully Reset</h3>
                <p className="text-muted-foreground">Please continue to log in with your new password</p>
                <Button
                  className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium mt-4"
                  onClick={() => navigate("/login")}
                >
                  Back to Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
