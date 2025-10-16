import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/generalSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function Login() {
  const [passwordHide, setpasswordHide] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Enter valid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      await dispatch(loginUser({ ...values, setErrors, navigate }));
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    if (localStorage.getItem("accessToken", null) !== null && localStorage.getItem("accessToken", null) !== undefined) {
      window.open("/dashboard", "_self");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Sign in to your Ignite account to continue
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    {...getFieldProps("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordHide ? "password" : "text"}
                      placeholder="Enter your password"
                      className="pr-10 h-11"
                      {...getFieldProps("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setpasswordHide(!passwordHide)}
                    >
                      {passwordHide ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Server Errors */}
                {errors.afterSubmit && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errors.afterSubmit}</AlertDescription>
                  </Alert>
                )}

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      New to Ignite?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium"
                  onClick={() => navigate("/signup")}
                >
                  Create an account
                </Button>
              </CardFooter>
            </Card>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
}
