import React, { useState } from "react";
import { useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createkeyMetric, selectNewKeyMetricDialogOpen, updateNewKeyMetricDialogOpen } from "../../../redux/slices/settingSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { AlertCircle } from "lucide-react";

function NewKeyMetricDialog() {
  const dispatch = useDispatch();
  const open = useSelector(selectNewKeyMetricDialogOpen);
  const [activeTab, setActiveTab] = useState("about");

  const closeDialog = () => {
    dispatch(updateNewKeyMetricDialogOpen(false));
    setActiveTab("about");
    aboutKeyMetricFormik.resetForm();
    metricTypeFormik.resetForm();
  };

  const aboutKeyMetricFormik = useFormik({
    initialValues: {
      shortName: "",
      name: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      shortName: Yup.string().required("Short name is required"),
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async () => {
      setActiveTab("type");
    },
  });

  const metricTypeFormik = useFormik({
    initialValues: {
      metricType: "",
      currencyType: "",
      metricTimePeriod: "",
    },
    validationSchema: Yup.object().shape({
      metricType: Yup.string().required("Metric type is required"),
      currencyType: Yup.string().when("metricType", {
        is: "Currency",
        then: (schema) => schema.required("Currency type is required"),
      }),
      metricTimePeriod: Yup.string().required("Metric time period is required"),
    }),
    onSubmit: async () => {
      dispatch(createkeyMetric({ ...aboutKeyMetricFormik.values, ...metricTypeFormik.values, closeDialog }));
    },
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => dispatch(updateNewKeyMetricDialogOpen(isOpen))}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Key Metric</DialogTitle>
          <DialogDescription>Create a custom key metric for your goals</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About Key Metric</TabsTrigger>
            <TabsTrigger value="type" disabled={!aboutKeyMetricFormik.isValid || !aboutKeyMetricFormik.dirty}>
              Metric Type
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4 mt-4">
            <FormikProvider value={aboutKeyMetricFormik}>
              <Form autoComplete="off" noValidate onSubmit={aboutKeyMetricFormik.handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shortName">
                      Short Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="shortName"
                      {...aboutKeyMetricFormik.getFieldProps("shortName")}
                      placeholder="MRR, CPC, etc"
                    />
                    {aboutKeyMetricFormik.touched.shortName && aboutKeyMetricFormik.errors.shortName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {aboutKeyMetricFormik.errors.shortName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...aboutKeyMetricFormik.getFieldProps("name")}
                      placeholder="Monthly Revenue Rate, Cost per Click, etc"
                    />
                    {aboutKeyMetricFormik.touched.name && aboutKeyMetricFormik.errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {aboutKeyMetricFormik.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      {...aboutKeyMetricFormik.getFieldProps("description")}
                      placeholder="A quick explanation"
                    />
                    {aboutKeyMetricFormik.touched.description && aboutKeyMetricFormik.errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {aboutKeyMetricFormik.errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!aboutKeyMetricFormik.isValid || !aboutKeyMetricFormik.dirty}>
                    Next
                  </Button>
                </DialogFooter>
              </Form>
            </FormikProvider>
          </TabsContent>

          <TabsContent value="type" className="space-y-4 mt-4">
            <FormikProvider value={metricTypeFormik}>
              <Form autoComplete="off" noValidate onSubmit={metricTypeFormik.handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metricType">
                      Metric Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={metricTypeFormik.values.metricType}
                      onValueChange={(value) => metricTypeFormik.setFieldValue("metricType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Count">Count: 10</SelectItem>
                        <SelectItem value="Decimal">Decimal: 1.0</SelectItem>
                        <SelectItem value="Currency">Currency: $10,100</SelectItem>
                        <SelectItem value="Rate">Rate: 10%</SelectItem>
                      </SelectContent>
                    </Select>
                    {metricTypeFormik.touched.metricType && metricTypeFormik.errors.metricType && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {metricTypeFormik.errors.metricType}
                      </p>
                    )}
                  </div>

                  {metricTypeFormik.values.metricType === "Currency" && (
                    <div className="space-y-2">
                      <Label htmlFor="currencyType">
                        Currency Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={metricTypeFormik.values.currencyType}
                        onValueChange={(value) => metricTypeFormik.setFieldValue("currencyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$-Dollars">$ - Dollars</SelectItem>
                          <SelectItem value="₹-Rupee">₹ - Rupee</SelectItem>
                        </SelectContent>
                      </Select>
                      {metricTypeFormik.touched.currencyType && metricTypeFormik.errors.currencyType && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {metricTypeFormik.errors.currencyType}
                        </p>
                      )}
                    </div>
                  )}

                  {metricTypeFormik.values.metricType && (
                    <div className="space-y-2">
                      <Label htmlFor="metricTimePeriod">
                        Metric Time Period <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={metricTypeFormik.values.metricTimePeriod}
                        onValueChange={(value) => metricTypeFormik.setFieldValue("metricTimePeriod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Time">All Time</SelectItem>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quaterly">Quarterly</SelectItem>
                          <SelectItem value="Annualy">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                      {metricTypeFormik.touched.metricTimePeriod && metricTypeFormik.errors.metricTimePeriod && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {metricTypeFormik.errors.metricTimePeriod}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!metricTypeFormik.isValid || !metricTypeFormik.dirty}>
                    Create Metric
                  </Button>
                </DialogFooter>
              </Form>
            </FormikProvider>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default NewKeyMetricDialog;
