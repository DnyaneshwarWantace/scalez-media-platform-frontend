import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  completeProfile,
  loginUser,
  readIncomplete,
  incomplete,
  readIncompleteProfile,
} from "../../redux/slices/generalSlice";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, Loader2, UserCircle } from "lucide-react";

export default function CompleteProfile() {
  const params = useParams();
  const [passwordHide, setpasswordHide] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inCompleteProfile = useSelector(incomplete);
  console.log("INCOMPLETE firstname", inCompleteProfile?.user?.firstName);
  console.log("INCOMPLETE lastname", inCompleteProfile?.user?.lastName);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    password: Yup.string().required("Password is required"),
    employees: Yup.string().required("No of employees is required"),
    industry: Yup.string().required("Industry is required"),
    company: Yup.string().required("Company is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      employees: "",
      phone: "",
      industry: "",
      company: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      await dispatch(
        completeProfile({ ...values, setErrors, token: params.token })
      );
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    if (
      localStorage.getItem("accessToken", null) !== null &&
      localStorage.getItem("accessToken", null) !== undefined
    ) {
      //  window.open("/quick-start", "_self");
    }
  }, []);

  useEffect(() => {
    dispatch(readIncompleteProfile({token:params.token,formik}));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-center text-foreground">
                  Complete Your Profile
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Fill in your information to get started with Ignite
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Name Fields - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordHide ? "password" : "text"}
                      placeholder="Enter password"
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

                {/* Number of Employees */}
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <select
                    id="employees"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...getFieldProps("employees")}
                    onChange={(e) => {
                      formik.setFieldValue("employees", e.target.value);
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
                  {touched.employees && errors.employees && (
                    <p className="text-sm text-destructive">{errors.employees}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    className="h-11"
                    {...getFieldProps("phone")}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
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

                {/* Company/Designation */}
                <div className="space-y-2">
                  <Label htmlFor="company">Designation</Label>
                  <Input
                    id="company"
                    placeholder="Your designation"
                    className="h-11"
                    {...getFieldProps("company")}
                  />
                  {touched.company && errors.company && (
                    <p className="text-sm text-destructive">{errors.company}</p>
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
                  className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </Button>
              </CardContent>
            </Card>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
}
