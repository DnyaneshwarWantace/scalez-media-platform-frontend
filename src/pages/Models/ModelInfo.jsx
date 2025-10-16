import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  editModel,
  getSingleModel,
  selectsingleModelInfo,
  updateselectedModel,
  updateShowCreateModelDialog,
} from "../../redux/slices/modelSlice";
import DCF from "../../utils/DCF";
import CreateNewModelDialog from "./CreateNewModelDialog";
import {
  isTypeOwner,
  isRoleAdmin,
  isRoleMember,
} from "../../utils/permissions";
import Spinner from "../../components/common/Spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { ChevronDown, Edit2, Sparkles } from "lucide-react";

function ModelInfo() {
  const params = useParams();
  const modelId = params.modelId;
  const dispatch = useDispatch();
  const singleModelInfo = useSelector(selectsingleModelInfo);
  const [startingDate, setstartingDate] = useState(new Date());
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);
  const [isBlueChecked, setIsBlueChecked] = useState(true);
  const [isInboundBlueChecked, setIsInboundBlueChecked] = useState(true);
  const [isOrganicBlueChecked, setIsOrganicBlueChecked] = useState(true);
  const SampleData = [
    {
      // Set your first set of values here
      startDate: null,
      cashInBank: 1000000,
      numberOfCustomers: 0,

      // Financial Data
      avgOrderValue: 800,
      realisationRate: 90,
      unitsOrder: 1,
      blendedCogs: 30,

      // Marketing Metrics
      outboundSalary: 0,
      numberOfContactsPerSdr: 7500,
      numberOfSDR: 0,
      contactToLeadConversionRate: 2,
      leadToCustomerConversionRate: 8,
      organicleadToCustomerConversionRate: 20,

      monthlyAdSpend: 1000000,
      cpm: 150,
      clickThroughRate: 1,
      landingPageView: 70,
      leadGenerationRate: 100,
      conversionRate: 2,

      organicViewsPerMonth: 0,
      organicViewsLeadToConversionRate: 0,
      organicleadToCustomerConversionRate: 20,

      // Retention Metrics
      returningCustomerRate: 20,
      timeToReturn: 1,
      costToMarketReturn: 7.5,

      // Virality Metrics
      referresOutOfCustomers: 0,
      inviteesPerReferral: 5,
      inviteesConversionRate: 5.0,

      // Admin
      refundRate: 1.5,
      fixedLossPerRefund: 15,
      paymentProcessorFees: 2,
      merchantAccountFees: 0.5,
      fixedCostPerMonth: 10000,
      fixedCostIncreasePerHundredCustomers: 1000,
      upFrontInvestmentCost: 0,
      debt: 0,
      debtInterestRate: 6,

      // Valuations
      taxRate: 20,
      numberOfShares: 20000,
      projectionPeriod: 60,
      discountRate: 12,
      perpetualGrowthRate: 3,
      // ...other values...
    },
    {
      // Set your second set of values here
      startDate: null,
      cashInBank: 2000000,
      numberOfCustomers: 0,

      // Financial Data
      avgOrderValue: 900,
      realisationRate: 90,
      unitsOrder: 1,
      blendedCogs: 30,

      // Marketing Metrics
      outboundSalary: 0,
      numberOfContactsPerSdr: 9500,
      numberOfSDR: 0,
      contactToLeadConversionRate: 2,
      leadToCustomerConversionRate: 8,
      organicleadToCustomerConversionRate: 20,

      monthlyAdSpend: 1000000,
      cpm: 150,
      clickThroughRate: 1,
      landingPageView: 70,
      leadGenerationRate: 100,
      conversionRate: 2,

      organicViewsPerMonth: 0,
      organicViewsLeadToConversionRate: 0,
      organicleadToCustomerConversionRate: 20,

      // Retention Metrics
      returningCustomerRate: 20,
      timeToReturn: 1,
      costToMarketReturn: 7.5,

      // Virality Metrics
      referresOutOfCustomers: 0,
      inviteesPerReferral: 5,
      inviteesConversionRate: 5.0,

      // Admin
      refundRate: 1.5,
      fixedLossPerRefund: 15,
      paymentProcessorFees: 2,
      merchantAccountFees: 0.5,
      fixedCostPerMonth: 10000,
      fixedCostIncreasePerHundredCustomers: 1000,
      upFrontInvestmentCost: 0,
      debt: 0,
      debtInterestRate: 6,

      // Valuations
      taxRate: 20,
      numberOfShares: 20000,
      projectionPeriod: 60,
      discountRate: 12,
      perpetualGrowthRate: 3,
      // ...other values...
    },
    {
      // Set your third set of values here
      startDate: null,
      cashInBank: 3000000,
      numberOfCustomers: 0,

      // Financial Data
      avgOrderValue: 800,
      realisationRate: 90,
      unitsOrder: 1,
      blendedCogs: 30,

      // Marketing Metrics
      outboundSalary: 0,
      numberOfContactsPerSdr: 7500,
      numberOfSDR: 0,
      contactToLeadConversionRate: 2,
      leadToCustomerConversionRate: 8,
      organicleadToCustomerConversionRate: 20,

      monthlyAdSpend: 1000000,
      cpm: 150,
      clickThroughRate: 1,
      landingPageView: 70,
      leadGenerationRate: 100,
      conversionRate: 2,

      organicViewsPerMonth: 0,
      organicViewsLeadToConversionRate: 0,
      organicleadToCustomerConversionRate: 20,

      // Retention Metrics
      returningCustomerRate: 20,
      timeToReturn: 1,
      costToMarketReturn: 7.5,

      // Virality Metrics
      referresOutOfCustomers: 0,
      inviteesPerReferral: 5,
      inviteesConversionRate: 5.0,

      // Admin
      refundRate: 1.5,
      fixedLossPerRefund: 15,
      paymentProcessorFees: 2,
      merchantAccountFees: 0.5,
      fixedCostPerMonth: 10000,
      fixedCostIncreasePerHundredCustomers: 1000,
      upFrontInvestmentCost: 0,
      debt: 0,
      debtInterestRate: 6,

      // Valuations
      taxRate: 20,
      numberOfShares: 20000,
      projectionPeriod: 60,
      discountRate: 12,
      perpetualGrowthRate: 3,
      // ...other values...
    },
  ];
  const [sampleIndex, setSampleIndex] = useState(0);

  // const ProjectsMenus = [
  //   {
  //     name: "Input",
  //   },
  //   {
  //     name: "Output",
  //   },
  // ];
  const handleImageClick = () => {
    setIsBlueChecked((prev) => !prev);
    formik.setFieldValue("outboundSalary", "");
    formik.setFieldValue("numberOfContactsPerSdr", "");
    formik.setFieldValue("numberOfSDR", "");
    formik.setFieldValue("contactToLeadConversionRate", "");
    formik.setFieldValue("leadToCustomerConversionRate", "");
    formik.setFieldValue("organicleadToCustomerConversionRate", "");
  };

  const handleInboundImageClick = () => {
    setIsInboundBlueChecked((prev) => !prev);
    formik.setFieldValue("monthlyAdSpend", "");
    formik.setFieldValue("cpm", "");
    formik.setFieldValue("clickThroughRate", "");
    formik.setFieldValue("landingPageView", "");
    formik.setFieldValue("conversionRate", "");
    formik.setFieldValue("leadGenerationRate", "");
  };

  const handleOrganicImageClick = () => {
    setIsOrganicBlueChecked((prev) => !prev);
    formik.setFieldValue("organicViewsPerMonth", "");
    formik.setFieldValue("organicViewsLeadToConversionRate", "");
    formik.setFieldValue("organicleadToCustomerConversionRate", "");
  };
  const NewProjectSchema = Yup.object().shape({
    // Starting State
    cashInBank: Yup.number().required("Cash in bank is required"),
    numberOfCustomers: Yup.number().required("Number of customers is required"),

    // Financial Data
    avgOrderValue: Yup.number().required("Average order value is required"),
    realisationRate: Yup.number().required("Realisation Rate is required"),
    unitsOrder: Yup.number().required("Unit order is required"),
    blendedCogs: Yup.number().required("Blended COGS is required"),

    // Marketing Metrics
    // outboundSalary: Yup.number().required("Outbound salary is required"),
    // numberOfContactsPerSdr: Yup.number().required("Number Of Contacts PerMonth Per SDR is required"),
    // numberOfSDR: Yup.number().required("Number Of SDRs is required"),
    // contactToLeadConversionRate: Yup.number().required("Contact To Lead Conversion Rate is required"),
    // leadToCustomerConversionRate: Yup.number().required("Lead To Customer Conversion Rate Outbound is required"),
    // organicleadToCustomerConversionRate: Yup.number().required("Lead To Customer Conversion Rate Organic is required"),

    // monthlyAdSpend: Yup.number().required("Monthly Ad Spend is required"),
    // cpm: Yup.number().required("cpm is required"),
    // clickThroughRate: Yup.number().required("CTR is required"),
    // landingPageView: Yup.number().required("Landing Page View Rate is required"),
    // leadGenerationRate: Yup.number().required("Lead Generation Rate is required"),
    // conversionRate: Yup.number().required("Conversion Rate is required"),

    // organicViewsPerMonth: Yup.number().required("Organic Views Per Month is required"),
    // organicViewsLeadToConversionRate: Yup.number().required("Organic View To Lead Conversion Rate is required"),
    // organicleadToCustomerConversionRate: Yup.number().required("Lead To Customer Conversion Rate Organic is required"),

    outboundSalary: Yup.number().optional(),
    numberOfContactsPerSdr: Yup.number().optional(),
    numberOfSDR: Yup.number().optional(),
    contactToLeadConversionRate: Yup.number().optional(),
    leadToCustomerConversionRate: Yup.number().optional(),
    organicleadToCustomerConversionRate: Yup.number().optional(),

    monthlyAdSpend: Yup.number().optional(),
    cpm: Yup.number().optional(),
    clickThroughRate: Yup.number().optional(),
    landingPageView: Yup.number().optional(),
    leadGenerationRate: Yup.number().optional(),
    conversionRate: Yup.number().optional(),

    organicViewsPerMonth: Yup.number().optional(),
    organicViewsLeadToConversionRate: Yup.number().optional(),
    organicleadToCustomerConversionRate: Yup.number().optional(),

    // Retention Metrics
    returningCustomerRate: Yup.number().required(
      "Returning CustomerRate is required"
    ),
    timeToReturn: Yup.number().required("Time To Return Months is required"),
    costToMarketReturn: Yup.number().required(
      "Cost To Market Return Percent is required"
    ),

    // Virality Metrics
    referresOutOfCustomers: Yup.number().required(
      "Referrers Out Of Customers Percent is required"
    ),
    inviteesPerReferral: Yup.number().required(
      "Invitees Per Referral is required"
    ),
    inviteesConversionRate: Yup.number().required(
      "Invitees Conversion Rate is required"
    ),

    // Admin
    refundRate: Yup.number().required("Refund Rate Percent is required"),
    fixedLossPerRefund: Yup.number().required(
      "Fixed Loss Per Refund Exc ProductCost is required"
    ),
    paymentProcessorFees: Yup.number().required(
      "Payment Processor Fees is required"
    ),
    merchantAccountFees: Yup.number().required(
      "Merchant Account Fees is required"
    ),
    fixedCostPerMonth: Yup.number().required(
      "Fixed Costs Per Month is required"
    ),
    fixedCostIncreasePerHundredCustomers: Yup.number().required(
      "Fixed Costs Increase Per100 Customers Per Month is required"
    ),
    upFrontInvestmentCost: Yup.number().required(
      "Upfront Investment Costs is required"
    ),
    debt: Yup.number().required("Debt is required"),
    debtInterestRate: Yup.number().required(
      "Debt Interest Rate Percent Annual is required"
    ),

    // Valuations
    taxRate: Yup.number().required("Tax Rate Percent is required"),
    numberOfShares: Yup.number().required("Number Of Shares is required"),
    projectionPeriod: Yup.number().required(
      "Projection Period Months is required"
    ),
    discountRate: Yup.number().required("Discount Rate Percent is required"),
    perpetualGrowthRate: Yup.number().required(
      "Perpetual Growth Rate Percent is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      // Starting State
      cashInBank: "",
      numberOfCustomers: "",

      // Financial Data
      avgOrderValue: "",
      realisationRate: "",
      unitsOrder: "",
      blendedCogs: "",

      // Marketing Metrics
      outboundSalary: "",
      numberOfContactsPerSdr: "",
      numberOfSDR: "",
      contactToLeadConversionRate: "",
      leadToCustomerConversionRate: "",
      organicleadToCustomerConversionRate: "",

      monthlyAdSpend: "",
      cpm: "",
      clickThroughRate: "",
      landingPageView: "",
      leadGenerationRate: "",
      conversionRate: "",

      organicViewsPerMonth: "",
      organicViewsLeadToConversionRate: "",
      organicleadToCustomerConversionRate: "",

      // Retention Metrics
      returningCustomerRate: "",
      timeToReturn: "",
      costToMarketReturn: "",

      // Virality Metrics
      referresOutOfCustomers: "",
      inviteesPerReferral: "",
      inviteesConversionRate: "",

      // Admin
      refundRate: "",
      fixedLossPerRefund: "",
      paymentProcessorFees: "",
      merchantAccountFees: "",
      fixedCostPerMonth: "",
      fixedCostIncreasePerHundredCustomers: "",
      upFrontInvestmentCost: "",
      debt: "",
      debtInterestRate: "",

      // Valuations
      taxRate: "",
      numberOfShares: "",
      projectionPeriod: "",
      discountRate: "",
      perpetualGrowthRate: "",
    },
    validateOnBlur: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(true);

      // alert(values.organicleadToCustomerConversionRate);
      // alert(values.leadToCustomerConversionRate);

      const GeneratedDCFResponse = DCF({
        // Starting State
        startDate: startingDate,
        cashInBank: values?.cashInBank,
        numberOfCustomers: values?.numberOfCustomers,

        // Financial Data
        avgOrderValue: values?.avgOrderValue,
        realisationRate: values?.realisationRate,
        unitsOrder: values?.unitsOrder,
        blendedCogs: values?.blendedCogs,

        // Marketing Metrics
        outboundSalary: values?.outboundSalary,
        numberOfContactsPerSdr: values?.numberOfContactsPerSdr,
        numberOfSDR: values?.numberOfSDR,
        contactToLeadConversionRate: values?.contactToLeadConversionRate,
        leadToCustomerConversionRate: values?.leadToCustomerConversionRate,
        organicleadToCustomerConversionRate:
          values?.organicleadToCustomerConversionRate,

        monthlyAdSpend: values?.monthlyAdSpend,
        cpm: values?.cpm,
        clickThroughRate: values?.clickThroughRate,
        landingPageView: values?.landingPageView,
        leadGenerationRate: values?.leadGenerationRate,
        conversionRate: values?.conversionRate,

        organicViewsPerMonth: values?.organicViewsPerMonth,
        organicViewsLeadToConversionRate:
          values?.organicViewsLeadToConversionRate,

        // Retention Metrics
        returningCustomerRate: values?.returningCustomerRate,
        timeToReturn: values?.timeToReturn,
        costToMarketReturn: values?.costToMarketReturn,

        // Virality Metrics
        referresOutOfCustomers: values?.referresOutOfCustomers,
        inviteesPerReferral: values?.inviteesPerReferral,
        inviteesConversionRate: values?.inviteesConversionRate,

        // Admin
        refundRate: values?.refundRate,
        fixedLossPerRefund: values?.fixedLossPerRefund,
        paymentProcessorFees: values?.paymentProcessorFees,
        merchantAccountFees: values?.merchantAccountFees,
        fixedCostPerMonth: values?.fixedCostPerMonth,
        fixedCostIncreasePerHundredCustomers:
          values?.fixedCostIncreasePerHundredCustomers,
        upFrontInvestmentCost: values?.upFrontInvestmentCost,
        debt: values?.debt,
        debtInterestRate: values?.debtInterestRate,

        // Valuations
        taxRate: values?.taxRate,
        numberOfShares: values?.numberOfShares,
        projectionPeriod: values?.projectionPeriod,
        discountRate: values?.discountRate,
        perpetualGrowthRate: values?.perpetualGrowthRate,
      });

      await dispatch(
        editModel({
          modelId,
          name: singleModelInfo.name,
          values: values,
          startingDate,
        })
      );
      console.log(GeneratedDCFResponse);
      setSubmitting(false);

      // Navigate to simulation page with data
      navigate(`/models/${modelId}/simulation`, {
        state: { DCFResponse: GeneratedDCFResponse, values }
      });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } =
    formik;
  const setRandomValues = () => {
    setstartingDate(new Date().toISOString().slice(0, 10));

    const sampleValues = SampleData[sampleIndex];

    // Update the form values
    formik.setValues(sampleValues);

    // Cycle to the next set of sample values
    setSampleIndex((sampleIndex + 1) % SampleData.length);
  };

  useEffect(() => {
    dispatch(
      getSingleModel({
        modelId,
      })
    );
    setTimeout(() => {
      setShowLoader(false);
    }, 2000);
  }, []);

  useEffect(() => {
    async function fetchModel() {
      await dispatch(
        getSingleModel({
          modelId,
        })
      );
      setTimeout(() => {
        setShowLoader(false);
      }, 2000);
    }
    fetchModel();
  }, []);

  useEffect(() => {
    if (singleModelInfo && singleModelInfo?.data) {
      setstartingDate(singleModelInfo?.data?.startingDate);
      formik.setValues(singleModelInfo?.data);
    }
  }, [singleModelInfo]);

  return (
    <>
      {showLoader && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            border: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
          <Spinner />
        </div>,
        document.body
      )}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{singleModelInfo?.name}</h1>
          <p className="text-sm text-gray-500">Model Simulation</p>
        </div>

        <div className="flex-1 flex flex-row-reverse">
          <div className="flex items-center gap-2 sm:gap-3">
            {isTypeOwner() || isRoleAdmin() || isRoleMember() ? (
              <Button
                variant="outline"
                onClick={() => {
                  setRandomValues();
                }}
              >
                Generate Sample Values
              </Button>
            ) : null}
            {isTypeOwner() || isRoleAdmin() || isRoleMember() ? (
              <Button
                onClick={handleSubmit}
                className="bg-black hover:bg-gray-800 text-white min-w-[10rem]"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Calculate Model
              </Button>
            ) : null}
            {isTypeOwner() || isRoleAdmin() || isRoleMember() ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  dispatch(updateselectedModel(singleModelInfo));
                  dispatch(updateShowCreateModelDialog(true));
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Form Content */}

        {/* ---------- Input ---------- */}
        {/* {selectedMenu === "Input" && ( */}
        <div
          style={{
            overflowY: "auto",
            zIndex: "1",
            overflowX: "hidden",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <div style={{ marginTop: "40px" }}>
                  {/* Starting State */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Starting State</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Cash in Bank */}
                            <div className="space-y-2">
                              <Label htmlFor="cashInBank">Cash in Bank</Label>
                              <Input
                                id="cashInBank"
                                type="number"
                                {...getFieldProps("cashInBank")}
                                placeholder="Cash in Bank"
                                className={touched.cashInBank && errors.cashInBank ? "border-red-500" : ""}
                              />
                              {touched.cashInBank && errors.cashInBank && (
                                <p className="text-sm text-red-500">{errors.cashInBank}</p>
                              )}
                            </div>

                            {/* Initial Number of Customers */}
                            <div className="space-y-2">
                              <Label htmlFor="numberOfCustomers">Initial Number of Customers</Label>
                              <Input
                                id="numberOfCustomers"
                                type="number"
                                {...getFieldProps("numberOfCustomers")}
                                placeholder="Number of Customers"
                                className={touched.numberOfCustomers && errors.numberOfCustomers ? "border-red-500" : ""}
                              />
                              {touched.numberOfCustomers && errors.numberOfCustomers && (
                                <p className="text-sm text-red-500">{errors.numberOfCustomers}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Financial Data */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Financial Data</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Average Order Value */}
                            <div className="space-y-2">
                              <Label htmlFor="avgOrderValue">Average Order Value</Label>
                              <Input
                                id="avgOrderValue"
                                type="number"
                                {...getFieldProps("avgOrderValue")}
                                placeholder="Average Order Value"
                                className={touched.avgOrderValue && errors.avgOrderValue ? "border-red-500" : ""}
                              />
                              {touched.avgOrderValue && errors.avgOrderValue && (
                                <p className="text-sm text-red-500">{errors.avgOrderValue}</p>
                              )}
                            </div>

                            {/* Realisation Rate */}
                            <div className="space-y-2">
                              <Label htmlFor="realisationRate">Realisation Rate</Label>
                              <Input
                                id="realisationRate"
                                type="number"
                                {...getFieldProps("realisationRate")}
                                placeholder="Realisation Rate"
                                className={touched.realisationRate && errors.realisationRate ? "border-red-500" : ""}
                              />
                              {touched.realisationRate && errors.realisationRate && (
                                <p className="text-sm text-red-500">{errors.realisationRate}</p>
                              )}
                            </div>

                            {/* Units/order */}
                            <div className="space-y-2">
                              <Label htmlFor="unitsOrder">Units/order</Label>
                              <Input
                                id="unitsOrder"
                                type="number"
                                {...getFieldProps("unitsOrder")}
                                placeholder="Units/order"
                                className={touched.unitsOrder && errors.unitsOrder ? "border-red-500" : ""}
                              />
                              {touched.unitsOrder && errors.unitsOrder && (
                                <p className="text-sm text-red-500">{errors.unitsOrder}</p>
                              )}
                            </div>

                            {/* Blended COGS % */}
                            <div className="space-y-2">
                              <Label htmlFor="blendedCogs">Blended COGS %</Label>
                              <Input
                                id="blendedCogs"
                                type="number"
                                {...getFieldProps("blendedCogs")}
                                placeholder="Blended COGS %"
                                className={touched.blendedCogs && errors.blendedCogs ? "border-red-500" : ""}
                              />
                              {touched.blendedCogs && errors.blendedCogs && (
                                <p className="text-sm text-red-500">{errors.blendedCogs}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Marketing Metrics */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Marketing Metrics</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Outbound Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <img
                                  alt=""
                                  className="h-4 w-4 cursor-pointer"
                                  src={
                                    values?.outboundSalary ||
                                    values?.numberOfContactsPerSdr ||
                                    values?.numberOfSDR ||
                                    values?.contactToLeadConversionRate ||
                                    values?.leadToCustomerConversionRate ||
                                    values?.organicleadToCustomerConversionRate ||
                                    isBlueChecked
                                      ? "/static/icons/blue_u_check-square.svg"
                                      : "/static/icons/grey-u-check-square.svg"
                                  }
                                  onClick={handleImageClick}
                                />
                                <Label className="text-base font-medium">Outbound</Label>
                              </div>

                              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {/* Outbound Salary */}
                                <div className="space-y-2">
                                  <Label htmlFor="outboundSalary">Outbound Salary</Label>
                                  <Input
                                    id="outboundSalary"
                                    type="number"
                                    {...getFieldProps("outboundSalary")}
                                    placeholder="Outbound Salary"
                                    className={touched.outboundSalary && errors.outboundSalary ? "border-red-500" : ""}
                                  />
                                  {touched.outboundSalary && errors.outboundSalary && (
                                    <p className="text-sm text-red-500">{errors.outboundSalary}</p>
                                  )}
                                </div>

                                {/* Number of Contacts per Month per SDR */}
                                <div className="space-y-2">
                                  <Label htmlFor="numberOfContactsPerSdr">Number of Contacts per Month per SDR</Label>
                                  <Input
                                    id="numberOfContactsPerSdr"
                                    type="number"
                                    {...getFieldProps("numberOfContactsPerSdr")}
                                    placeholder="Number of Contacts per Month per SDR"
                                    className={touched.numberOfContactsPerSdr && errors.numberOfContactsPerSdr ? "border-red-500" : ""}
                                  />
                                  {touched.numberOfContactsPerSdr && errors.numberOfContactsPerSdr && (
                                    <p className="text-sm text-red-500">{errors.numberOfContactsPerSdr}</p>
                                  )}
                                </div>

                                {/* Number of SDRs */}
                                <div className="space-y-2">
                                  <Label htmlFor="numberOfSDR">Number of SDRs</Label>
                                  <Input
                                    id="numberOfSDR"
                                    type="number"
                                    {...getFieldProps("numberOfSDR")}
                                    placeholder="Number of SDRs"
                                    className={touched.numberOfSDR && errors.numberOfSDR ? "border-red-500" : ""}
                                  />
                                  {touched.numberOfSDR && errors.numberOfSDR && (
                                    <p className="text-sm text-red-500">{errors.numberOfSDR}</p>
                                  )}
                                </div>

                                {/* Contact to Lead Conversion Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="contactToLeadConversionRate">Contact to Lead Conversion Rate</Label>
                                  <Input
                                    id="contactToLeadConversionRate"
                                    type="number"
                                    {...getFieldProps("contactToLeadConversionRate")}
                                    placeholder="Contact to Lead Conversion Rate"
                                    className={touched.contactToLeadConversionRate && errors.contactToLeadConversionRate ? "border-red-500" : ""}
                                  />
                                  {touched.contactToLeadConversionRate && errors.contactToLeadConversionRate && (
                                    <p className="text-sm text-red-500">{errors.contactToLeadConversionRate}</p>
                                  )}
                                </div>

                                {/* Lead to Customer Conversion Rate (Outbound) */}
                                <div className="space-y-2">
                                  <Label htmlFor="leadToCustomerConversionRate">Lead to Customer Conversion Rate (Outbound)</Label>
                                  <Input
                                    id="leadToCustomerConversionRate"
                                    type="number"
                                    {...getFieldProps("leadToCustomerConversionRate")}
                                    placeholder="Lead to Customer Conversion Rate (Outbound)"
                                    className={touched.leadToCustomerConversionRate && errors.leadToCustomerConversionRate ? "border-red-500" : ""}
                                  />
                                  {touched.leadToCustomerConversionRate && errors.leadToCustomerConversionRate && (
                                    <p className="text-sm text-red-500">{errors.leadToCustomerConversionRate}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Inbound Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    values?.monthlyAdSpend ||
                                    values?.cpm ||
                                    values?.clickThroughRate ||
                                    values?.landingPageView ||
                                    values?.conversionRate ||
                                    values?.leadGenerationRate ||
                                    isInboundBlueChecked
                                      ? "/static/icons/blue_u_check-square.svg"
                                      : "/static/icons/grey-u-check-square.svg"
                                  }
                                  alt=""
                                  className="h-4 w-4 cursor-pointer"
                                  onClick={handleInboundImageClick}
                                />
                                <Label className="text-base font-medium">Inbound</Label>
                              </div>

                              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {/* Monthly Ad Spend */}
                                <div className="space-y-2">
                                  <Label htmlFor="monthlyAdSpend">Monthly Ad Spend</Label>
                                  <Input
                                    id="monthlyAdSpend"
                                    type="number"
                                    {...getFieldProps("monthlyAdSpend")}
                                    placeholder="Monthly Ad Spend"
                                    className={touched.monthlyAdSpend && errors.monthlyAdSpend ? "border-red-500" : ""}
                                  />
                                  {touched.monthlyAdSpend && errors.monthlyAdSpend && (
                                    <p className="text-sm text-red-500">{errors.monthlyAdSpend}</p>
                                  )}
                                </div>

                                {/* CPM */}
                                <div className="space-y-2">
                                  <Label htmlFor="cpm">CPM</Label>
                                  <Input
                                    id="cpm"
                                    type="number"
                                    {...getFieldProps("cpm")}
                                    placeholder="CPM"
                                    className={touched.cpm && errors.cpm ? "border-red-500" : ""}
                                  />
                                  {touched.cpm && errors.cpm && (
                                    <p className="text-sm text-red-500">{errors.cpm}</p>
                                  )}
                                </div>

                                {/* Click Through Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="clickThroughRate">Click Through Rate</Label>
                                  <Input
                                    id="clickThroughRate"
                                    type="number"
                                    {...getFieldProps("clickThroughRate")}
                                    placeholder="Click Through Rate"
                                    className={touched.clickThroughRate && errors.clickThroughRate ? "border-red-500" : ""}
                                  />
                                  {touched.clickThroughRate && errors.clickThroughRate && (
                                    <p className="text-sm text-red-500">{errors.clickThroughRate}</p>
                                  )}
                                </div>

                                {/* Landing Page View Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="landingPageView">Landing Page View Rate</Label>
                                  <Input
                                    id="landingPageView"
                                    type="number"
                                    {...getFieldProps("landingPageView")}
                                    placeholder="Landing Page View Rate"
                                    className={touched.landingPageView && errors.landingPageView ? "border-red-500" : ""}
                                  />
                                  {touched.landingPageView && errors.landingPageView && (
                                    <p className="text-sm text-red-500">{errors.landingPageView}</p>
                                  )}
                                </div>

                                {/* Lead Generation Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="leadGenerationRate">Lead Generation Rate</Label>
                                  <Input
                                    id="leadGenerationRate"
                                    type="number"
                                    {...getFieldProps("leadGenerationRate")}
                                    placeholder="Lead Generation Rate"
                                    className={touched.leadGenerationRate && errors.leadGenerationRate ? "border-red-500" : ""}
                                  />
                                  {touched.leadGenerationRate && errors.leadGenerationRate && (
                                    <p className="text-sm text-red-500">{errors.leadGenerationRate}</p>
                                  )}
                                </div>

                                {/* Conversion Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="conversionRate">Conversion Rate</Label>
                                  <Input
                                    id="conversionRate"
                                    type="number"
                                    {...getFieldProps("conversionRate")}
                                    placeholder="Conversion Rate"
                                    className={touched.conversionRate && errors.conversionRate ? "border-red-500" : ""}
                                  />
                                  {touched.conversionRate && errors.conversionRate && (
                                    <p className="text-sm text-red-500">{errors.conversionRate}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Organic Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    values?.organicViewsPerMonth ||
                                    values?.organicViewsLeadToConversionRate ||
                                    values?.organicleadToCustomerConversionRate ||
                                    isOrganicBlueChecked
                                      ? "/static/icons/blue_u_check-square.svg"
                                      : "/static/icons/grey-u-check-square.svg"
                                  }
                                  onClick={handleOrganicImageClick}
                                  alt=""
                                  className="h-4 w-4 cursor-pointer"
                                />
                                <Label className="text-base font-medium">Organic</Label>
                              </div>

                              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {/* Organic Views per Month */}
                                <div className="space-y-2">
                                  <Label htmlFor="organicViewsPerMonth">Organic Views per Month</Label>
                                  <Input
                                    id="organicViewsPerMonth"
                                    type="number"
                                    {...getFieldProps("organicViewsPerMonth")}
                                    placeholder="Organic Views per Month"
                                    className={touched.organicViewsPerMonth && errors.organicViewsPerMonth ? "border-red-500" : ""}
                                  />
                                  {touched.organicViewsPerMonth && errors.organicViewsPerMonth && (
                                    <p className="text-sm text-red-500">{errors.organicViewsPerMonth}</p>
                                  )}
                                </div>

                                {/* Organic View to Lead Conversion Rate */}
                                <div className="space-y-2">
                                  <Label htmlFor="organicViewsLeadToConversionRate">Organic View to Lead Conversion Rate</Label>
                                  <Input
                                    id="organicViewsLeadToConversionRate"
                                    type="number"
                                    {...getFieldProps("organicViewsLeadToConversionRate")}
                                    placeholder="Organic View to Lead Conversion Rate"
                                    className={touched.organicViewsLeadToConversionRate && errors.organicViewsLeadToConversionRate ? "border-red-500" : ""}
                                  />
                                  {touched.organicViewsLeadToConversionRate && errors.organicViewsLeadToConversionRate && (
                                    <p className="text-sm text-red-500">{errors.organicViewsLeadToConversionRate}</p>
                                  )}
                                </div>

                                {/* Lead to Customer Conversion Rate (Organic) */}
                                <div className="space-y-2">
                                  <Label htmlFor="organicleadToCustomerConversionRate">Lead to Customer Conversion Rate (Organic)</Label>
                                  <Input
                                    id="organicleadToCustomerConversionRate"
                                    type="number"
                                    {...getFieldProps("organicleadToCustomerConversionRate")}
                                    placeholder="Lead to Customer Conversion Rate (Organic)"
                                    className={touched.organicleadToCustomerConversionRate && errors.organicleadToCustomerConversionRate ? "border-red-500" : ""}
                                  />
                                  {touched.organicleadToCustomerConversionRate && errors.organicleadToCustomerConversionRate && (
                                    <p className="text-sm text-red-500">{errors.organicleadToCustomerConversionRate}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Retention Metrics */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Retention Metrics</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Returning Customer Rate */}
                            <div className="space-y-2">
                              <Label htmlFor="returningCustomerRate">Returning Customer Rate</Label>
                              <Input
                                id="returningCustomerRate"
                                type="number"
                                {...getFieldProps("returningCustomerRate")}
                                placeholder="Returning Customer Rate"
                                className={touched.returningCustomerRate && errors.returningCustomerRate ? "border-red-500" : ""}
                              />
                              {touched.returningCustomerRate && errors.returningCustomerRate && (
                                <p className="text-sm text-red-500">{errors.returningCustomerRate}</p>
                              )}
                            </div>

                            {/* Time to Return (Months) */}
                            <div className="space-y-2">
                              <Label htmlFor="timeToReturn">Time to Return (Months)</Label>
                              <Input
                                id="timeToReturn"
                                type="number"
                                {...getFieldProps("timeToReturn")}
                                placeholder="Time to Return (Months)"
                                className={touched.timeToReturn && errors.timeToReturn ? "border-red-500" : ""}
                              />
                              {touched.timeToReturn && errors.timeToReturn && (
                                <p className="text-sm text-red-500">{errors.timeToReturn}</p>
                              )}
                            </div>

                            {/* Cost to Market Return % */}
                            <div className="space-y-2">
                              <Label htmlFor="costToMarketReturn">Cost to Market Return %</Label>
                              <Input
                                id="costToMarketReturn"
                                type="number"
                                {...getFieldProps("costToMarketReturn")}
                                placeholder="Cost to Market Return %"
                                className={touched.costToMarketReturn && errors.costToMarketReturn ? "border-red-500" : ""}
                              />
                              {touched.costToMarketReturn && errors.costToMarketReturn && (
                                <p className="text-sm text-red-500">{errors.costToMarketReturn}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Virality Metrics */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Virality Metrics</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Referrers out of Customers % */}
                            <div className="space-y-2">
                              <Label htmlFor="referresOutOfCustomers">Referrers out of Customers %</Label>
                              <Input
                                id="referresOutOfCustomers"
                                type="number"
                                {...getFieldProps("referresOutOfCustomers")}
                                placeholder="Referrers out of Customers %"
                                className={touched.referresOutOfCustomers && errors.referresOutOfCustomers ? "border-red-500" : ""}
                              />
                              {touched.referresOutOfCustomers && errors.referresOutOfCustomers && (
                                <p className="text-sm text-red-500">{errors.referresOutOfCustomers}</p>
                              )}
                            </div>

                            {/* Invitees per Referral */}
                            <div className="space-y-2">
                              <Label htmlFor="inviteesPerReferral">Invitees per Referral</Label>
                              <Input
                                id="inviteesPerReferral"
                                type="number"
                                {...getFieldProps("inviteesPerReferral")}
                                placeholder="Invitees per Referral"
                                className={touched.inviteesPerReferral && errors.inviteesPerReferral ? "border-red-500" : ""}
                              />
                              {touched.inviteesPerReferral && errors.inviteesPerReferral && (
                                <p className="text-sm text-red-500">{errors.inviteesPerReferral}</p>
                              )}
                            </div>

                            {/* Invitees Conversion Rate */}
                            <div className="space-y-2">
                              <Label htmlFor="inviteesConversionRate">Invitees Conversion Rate</Label>
                              <Input
                                id="inviteesConversionRate"
                                type="number"
                                {...getFieldProps("inviteesConversionRate")}
                                placeholder="Invitees Conversion Rate"
                                className={touched.inviteesConversionRate && errors.inviteesConversionRate ? "border-red-500" : ""}
                              />
                              {touched.inviteesConversionRate && errors.inviteesConversionRate && (
                                <p className="text-sm text-red-500">{errors.inviteesConversionRate}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Admin */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Admin</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Refund Rate % */}
                            <div className="space-y-2">
                              <Label htmlFor="refundRate">Refund Rate %</Label>
                              <Input
                                id="refundRate"
                                type="number"
                                {...getFieldProps("refundRate")}
                                placeholder="Refund Rate %"
                                className={touched.refundRate && errors.refundRate ? "border-red-500" : ""}
                              />
                              {touched.refundRate && errors.refundRate && (
                                <p className="text-sm text-red-500">{errors.refundRate}</p>
                              )}
                            </div>

                            {/* Fixed Loss per Refund (exc Product Cost) */}
                            <div className="space-y-2">
                              <Label htmlFor="fixedLossPerRefund">Fixed Loss per Refund (exc Product Cost)</Label>
                              <Input
                                id="fixedLossPerRefund"
                                type="number"
                                {...getFieldProps("fixedLossPerRefund")}
                                placeholder="Fixed Loss per Refund (exc Product Cost)"
                                className={touched.fixedLossPerRefund && errors.fixedLossPerRefund ? "border-red-500" : ""}
                              />
                              {touched.fixedLossPerRefund && errors.fixedLossPerRefund && (
                                <p className="text-sm text-red-500">{errors.fixedLossPerRefund}</p>
                              )}
                            </div>

                            {/* Payment Processor Fees */}
                            <div className="space-y-2">
                              <Label htmlFor="paymentProcessorFees">Payment Processor Fees</Label>
                              <Input
                                id="paymentProcessorFees"
                                type="number"
                                {...getFieldProps("paymentProcessorFees")}
                                placeholder="Payment Processor Fees"
                                className={touched.paymentProcessorFees && errors.paymentProcessorFees ? "border-red-500" : ""}
                              />
                              {touched.paymentProcessorFees && errors.paymentProcessorFees && (
                                <p className="text-sm text-red-500">{errors.paymentProcessorFees}</p>
                              )}
                            </div>

                            {/* Merchant Account Fees */}
                            <div className="space-y-2">
                              <Label htmlFor="merchantAccountFees">Merchant Account Fees</Label>
                              <Input
                                id="merchantAccountFees"
                                type="number"
                                {...getFieldProps("merchantAccountFees")}
                                placeholder="Merchant Account Fees"
                                className={touched.merchantAccountFees && errors.merchantAccountFees ? "border-red-500" : ""}
                              />
                              {touched.merchantAccountFees && errors.merchantAccountFees && (
                                <p className="text-sm text-red-500">{errors.merchantAccountFees}</p>
                              )}
                            </div>

                            {/* Fixed Costs per Month */}
                            <div className="space-y-2">
                              <Label htmlFor="fixedCostPerMonth">Fixed Costs per Month</Label>
                              <Input
                                id="fixedCostPerMonth"
                                type="number"
                                {...getFieldProps("fixedCostPerMonth")}
                                placeholder="Fixed Costs per Month"
                                className={touched.fixedCostPerMonth && errors.fixedCostPerMonth ? "border-red-500" : ""}
                              />
                              {touched.fixedCostPerMonth && errors.fixedCostPerMonth && (
                                <p className="text-sm text-red-500">{errors.fixedCostPerMonth}</p>
                              )}
                            </div>

                            {/* Fixed Costs Increase per 100 Customers per Month */}
                            <div className="space-y-2">
                              <Label htmlFor="fixedCostIncreasePerHundredCustomers">Fixed Costs Increase per 100 Customers per Month</Label>
                              <Input
                                id="fixedCostIncreasePerHundredCustomers"
                                type="number"
                                {...getFieldProps("fixedCostIncreasePerHundredCustomers")}
                                placeholder="Fixed Costs Increase per 100 Customers per Month"
                                className={touched.fixedCostIncreasePerHundredCustomers && errors.fixedCostIncreasePerHundredCustomers ? "border-red-500" : ""}
                              />
                              {touched.fixedCostIncreasePerHundredCustomers && errors.fixedCostIncreasePerHundredCustomers && (
                                <p className="text-sm text-red-500">{errors.fixedCostIncreasePerHundredCustomers}</p>
                              )}
                            </div>

                            {/* Upfront Investment Costs */}
                            <div className="space-y-2">
                              <Label htmlFor="upFrontInvestmentCost">Upfront Investment Costs</Label>
                              <Input
                                id="upFrontInvestmentCost"
                                type="number"
                                {...getFieldProps("upFrontInvestmentCost")}
                                placeholder="Upfront Investment Costs"
                                className={touched.upFrontInvestmentCost && errors.upFrontInvestmentCost ? "border-red-500" : ""}
                              />
                              {touched.upFrontInvestmentCost && errors.upFrontInvestmentCost && (
                                <p className="text-sm text-red-500">{errors.upFrontInvestmentCost}</p>
                              )}
                            </div>

                            {/* Debt */}
                            <div className="space-y-2">
                              <Label htmlFor="debt">Debt</Label>
                              <Input
                                id="debt"
                                type="number"
                                {...getFieldProps("debt")}
                                placeholder="Debt"
                                className={touched.debt && errors.debt ? "border-red-500" : ""}
                              />
                              {touched.debt && errors.debt && (
                                <p className="text-sm text-red-500">{errors.debt}</p>
                              )}
                            </div>

                            {/* Debt Interest Rate % (Annual) */}
                            <div className="space-y-2">
                              <Label htmlFor="debtInterestRate">Debt Interest Rate % (Annual)</Label>
                              <Input
                                id="debtInterestRate"
                                type="number"
                                {...getFieldProps("debtInterestRate")}
                                placeholder="Debt Interest Rate % (Annual)"
                                className={touched.debtInterestRate && errors.debtInterestRate ? "border-red-500" : ""}
                              />
                              {touched.debtInterestRate && errors.debtInterestRate && (
                                <p className="text-sm text-red-500">{errors.debtInterestRate}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Valuations */}
                  <Card className="mb-6">
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <CardTitle className="text-lg font-semibold">Valuations</CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Tax Rate % */}
                            <div className="space-y-2">
                              <Label htmlFor="taxRate">Tax Rate %</Label>
                              <Input
                                id="taxRate"
                                type="number"
                                {...getFieldProps("taxRate")}
                                placeholder="Tax Rate %"
                                className={touched.taxRate && errors.taxRate ? "border-red-500" : ""}
                              />
                              {touched.taxRate && errors.taxRate && (
                                <p className="text-sm text-red-500">{errors.taxRate}</p>
                              )}
                            </div>

                            {/* Number of Shares */}
                            <div className="space-y-2">
                              <Label htmlFor="numberOfShares">Number of Shares</Label>
                              <Input
                                id="numberOfShares"
                                type="number"
                                {...getFieldProps("numberOfShares")}
                                placeholder="Number of Shares"
                                className={touched.numberOfShares && errors.numberOfShares ? "border-red-500" : ""}
                              />
                              {touched.numberOfShares && errors.numberOfShares && (
                                <p className="text-sm text-red-500">{errors.numberOfShares}</p>
                              )}
                            </div>

                            {/* Projection Period (Months) */}
                            <div className="space-y-2">
                              <Label htmlFor="projectionPeriod">Projection Period (Months)</Label>
                              <Input
                                id="projectionPeriod"
                                type="number"
                                {...getFieldProps("projectionPeriod")}
                                placeholder="Projection Period (Months)"
                                className={touched.projectionPeriod && errors.projectionPeriod ? "border-red-500" : ""}
                              />
                              {touched.projectionPeriod && errors.projectionPeriod && (
                                <p className="text-sm text-red-500">{errors.projectionPeriod}</p>
                              )}
                            </div>

                            {/* Discount Rate % */}
                            <div className="space-y-2">
                              <Label htmlFor="discountRate">Discount Rate %</Label>
                              <Input
                                id="discountRate"
                                type="number"
                                {...getFieldProps("discountRate")}
                                placeholder="Discount Rate %"
                                className={touched.discountRate && errors.discountRate ? "border-red-500" : ""}
                              />
                              {touched.discountRate && errors.discountRate && (
                                <p className="text-sm text-red-500">{errors.discountRate}</p>
                              )}
                            </div>

                            {/* Perpetual Growth Rate % */}
                            <div className="space-y-2">
                              <Label htmlFor="perpetualGrowthRate">Perpetual Growth Rate %</Label>
                              <Input
                                id="perpetualGrowthRate"
                                type="number"
                                {...getFieldProps("perpetualGrowthRate")}
                                placeholder="Perpetual Growth Rate %"
                                className={touched.perpetualGrowthRate && errors.perpetualGrowthRate ? "border-red-500" : ""}
                              />
                              {touched.perpetualGrowthRate && errors.perpetualGrowthRate && (
                                <p className="text-sm text-red-500">{errors.perpetualGrowthRate}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </div>
              </Form>
            </FormikProvider>
          </div>
        </div>
        <CreateNewModelDialog />
        </div>
      </div>
    </>
  );
}

export default ModelInfo;
