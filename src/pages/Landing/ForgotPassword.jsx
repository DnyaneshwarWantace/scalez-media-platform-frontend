import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { KeyRound, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Enter valid email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    if (localStorage.getItem("accessToken", null) !== null && localStorage.getItem("accessToken", null) !== undefined) {
      window.open("/dashboard", "_self");
    }
  }, []);

  const onForgotPassword = () => {
    let emailVal = {...getFieldProps("email")};

    const payload = {
      email: emailVal.value,
    };
    const value = forgotPassword(payload);
    console.log(value);
  };

  const forgotPassword = (data) => {
    fetch(`${backendServerBaseURL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('data :>> ', data);
      navigate("/forgot-password-link-sent-successfully");
    })
    .catch((error) => {
      console.log("errorerror", error);
      throw error
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={onForgotPassword}>
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                    <KeyRound className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-center text-foreground">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    {...getFieldProps("email")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the email linked to your account
                  </p>
                  {touched.email && errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Back to Log In
                  </button>
                </div>
              </CardContent>
            </Card>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
}
