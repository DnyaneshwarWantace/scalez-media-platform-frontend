import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Check, Loader2, UserCircle } from "lucide-react";

function Signup() {
  const [step1, setstep1] = useState(true);
  const [step2, setstep2] = useState(false);
  const [step3, setstep3] = useState(false);
  const [step1Touched, setstep1Touched] = useState(true);
  const [step2Touched, setstep2Touched] = useState(false);
  const [step3Touched, setstep3Touched] = useState(false);

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    workEmail: Yup.string().email("Enter valid email").required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),

    companyName: Yup.string().required("Company Name is required"),
    noOfEmployees: Yup.string().required("No of employees is required"),
    companyPhone: Yup.string().required("Company phone is required"),
    industry: Yup.string().required("Industry is required"),

    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Password doesn't match"),
  });

  const formik = useFormik({
    initialValues: {
      workEmail: "",
      firstName: "",
      lastName: "",

      companyName: "",
      noOfEmployees: "",
      companyPhone: "",
      industry: "",

      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    validateOnChange: true,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      //   await dispatch(loginUser({ ...values, setErrors }));
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const currentStep = step1 ? 1 : step2 ? 2 : 3;
  const progressValue = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-center text-foreground">
                  Get Started with Ignite
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Let's quickly get to know you!
                </CardDescription>

                {/* Progress Bar */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Step {currentStep} of 3</span>
                    <span>{Math.round(progressValue)}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </CardHeader>

              <CardContent>
                {/* Step 1: Basic Information */}
                {step1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-foreground mb-4">Basic Information</h3>

                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        className="h-11"
                        {...getFieldProps("firstName")}
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        className="h-11"
                        {...getFieldProps("lastName")}
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Work Email */}
                    <div className="space-y-2">
                      <Label htmlFor="workEmail">Work Email</Label>
                      <Input
                        id="workEmail"
                        type="email"
                        placeholder="name@company.com"
                        className="h-11"
                        {...getFieldProps("workEmail")}
                      />
                      {touched.workEmail && errors.workEmail && (
                        <p className="text-sm text-destructive">{errors.workEmail}</p>
                      )}
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        className="bg-black hover:bg-black/90 text-white h-11 px-8"
                        onClick={() => {
                          setstep1(false);
                          setstep2(true);
                          setstep2Touched(true);
                        }}
                        disabled={
                          !Boolean(touched.firstName) ||
                          !Boolean(touched.lastName) ||
                          !Boolean(touched.workEmail) ||
                          Boolean(errors.firstName) ||
                          Boolean(errors.lastName) ||
                          Boolean(errors.workEmail)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Company Details */}
                {step2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-foreground mb-4">Company Details</h3>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Your Company"
                        className="h-11"
                        {...getFieldProps("companyName")}
                      />
                      {touched.companyName && errors.companyName && (
                        <p className="text-sm text-destructive">{errors.companyName}</p>
                      )}
                    </div>

                    {/* No of employees */}
                    <div className="space-y-2">
                      <Label htmlFor="noOfEmployees">Number of Employees</Label>
                      <select
                        id="noOfEmployees"
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...getFieldProps("noOfEmployees")}
                        onChange={(e) => {
                          formik.setFieldValue("noOfEmployees", e.target.value);
                        }}
                      >
                        <option value="">Select number of employees</option>
                        <option value="Just Me">Just Me</option>
                        <option value="2-10">2-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-100">51-100</option>
                        <option value="101-500">101-500</option>
                        <option value="501-1000">501-1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                      {touched.noOfEmployees && errors.noOfEmployees && (
                        <p className="text-sm text-destructive">{errors.noOfEmployees}</p>
                      )}
                    </div>

                    {/* Company Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input
                        id="companyPhone"
                        placeholder="+1 (555) 000-0000"
                        className="h-11"
                        {...getFieldProps("companyPhone")}
                      />
                      {touched.companyPhone && errors.companyPhone && (
                        <p className="text-sm text-destructive">{errors.companyPhone}</p>
                      )}
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...getFieldProps("industry")}
                        onChange={(e) => {
                          formik.setFieldValue("industry", e.target.value);
                        }}
                      >
                        <option value="">Select Industry</option>
                        <option value="Agency">Agency</option>
                        <option value="Software">Software</option>
                        <option value="Ecommerce">Ecommerce</option>
                        <option value="Dropshipping">Dropshipping</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Other">Other</option>
                      </select>
                      {touched.industry && errors.industry && (
                        <p className="text-sm text-destructive">{errors.industry}</p>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-11"
                        onClick={() => {
                          setstep1(true);
                          setstep2(false);
                        }}
                      >
                        ← Back
                      </Button>
                      <Button
                        type="button"
                        className="bg-black hover:bg-black/90 text-white h-11 px-8"
                        onClick={() => {
                          setstep3Touched(true);
                          setstep2(false);
                          setstep3(true);
                        }}
                        disabled={
                          !Boolean(touched.companyName) ||
                          !Boolean(touched.noOfEmployees) ||
                          !Boolean(touched.companyPhone) ||
                          !Boolean(touched.industry) ||
                          Boolean(errors.companyName) ||
                          Boolean(errors.noOfEmployees) ||
                          Boolean(errors.companyPhone) ||
                          Boolean(errors.industry)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Set Password */}
                {step3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-foreground mb-4">Set Password</h3>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
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

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
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

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-11"
                        onClick={() => {
                          setstep2(true);
                          setstep3(false);
                        }}
                      >
                        ← Back
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black hover:bg-black/90 text-white h-11 px-8"
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
                            Creating...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Form>
        </FormikProvider>

        {/* Cancel Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
