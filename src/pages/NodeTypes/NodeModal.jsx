import { Field, FieldArray, Form, FormikProvider, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactFlow } from "reactflow";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Trash2 } from "lucide-react";
import {
  getSingleProject,
  selectScenarioId,
  selectsingleProject,
} from "../../redux/slices/funnelProjectSlice";
import { useEffect } from "react";

function NodeModal({ open, onOpenChange, data, nodeId, type }) {
  const { setNodes } = useReactFlow();
  const singleProject = useSelector(selectsingleProject);
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const scenarioId = useSelector(selectScenarioId);

  const formik = useFormik({
    initialValues: {
      name: data.name,
      conversionRate: data.conversionRate,
      traffic: data.traffic,
      cpc: data.cpc || 0,
      product: data?.product?._id || "",
      trafficSources: data.trafficSources || [],
      waitType: data.waitType || "days",
      waitDuration: data.waitDuration || 1,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      conversionRate: Yup.number()
        .required("Conversion rate is required")
        .max(100),
      traffic: Yup.number().required("Traffic is required"),
      cpc: Yup.number().required("CPC is required"),
      product: Yup.string().nullable(true),
      trafficSources: Yup.array().of(
        Yup.object().shape({
          trafficSource: Yup.string().required(),
          value: Yup.number().required(),
        })
      ),
      waitType: Yup.string().required(),
      waitDuration: Yup.number().required(),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        console.log(values);
        setSubmitting(true);
        // await dispatch(
        //   createProject({ ...values, setErrors, createNewProjectCloseRef })
        // );
        setSubmitting(false);

        setNodes((nodes) => {
          let updatedNodes = nodes.map((singleNode) => {
            if (singleNode.id === nodeId) {
              return {
                ...singleNode,
                data: {
                  ...singleNode.data,
                  name: values.name,
                  conversionRate: values.conversionRate,
                  traffic: values.trafficSources.reduce(
                    (acc, curr) => acc + (curr.value == "" ? 0 : curr.value),
                    0
                  ),
                  cpc: values.cpc,
                  product: singleProject?.scenario
                    ?.find((s) => s._id === scenarioId)
                    ?.products?.find((product) => product._id === values.product),
                  trafficSources: values.trafficSources,
                  waitType: values.waitType,
                  waitDuration: values.waitDuration,
                },
              };
            } else {
              return singleNode;
            }
          });

          return updatedNodes;
        });

        onOpenChange(false);

        setTimeout(() => {
          dispatch(getSingleProject({ projectId }));
        }, 1000);
      } catch (error) {
        console.error("Error updating node:", error);
        setErrors({ afterSubmit: error.message || "Failed to update node" });
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } =
    formik;

  // useEffect(() => {
  //   console.log(values);
  //   formik.setFieldValue(
  //     "traffic",
  //     data.trafficSources.reduce(
  //       (acc, curr) => acc + (curr.value == "" ? 0 : curr.value),
  //       0
  //     )
  //   );
  // }, [values]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{data.name}</DialogTitle>
        </DialogHeader>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...getFieldProps("name")}
                placeholder="Name"
                className="mt-1"
              />
              {touched.name && errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {data.label !== "WaitNode node" && (
              <>
                {/* Conversion Rate */}
                <div className="mb-4">
                  <Label htmlFor="conversionRate">Conversion Rate</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    {...getFieldProps("conversionRate")}
                    placeholder="Enter conversion rate"
                    className="mt-1"
                  />
                  {touched.conversionRate && errors.conversionRate && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.conversionRate}
                    </p>
                  )}
                </div>

                {/* Traffic */}
                <div className="mb-4">
                  <Label htmlFor="traffic">Traffic</Label>
                  <Input
                    id="traffic"
                    disabled={true}
                    type="number"
                    {...getFieldProps("traffic")}
                    placeholder="Enter conversion rate"
                    className="mt-1"
                  />
                  {touched.traffic && errors.traffic && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.traffic}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Wait Type and Wait duration */}
            {data.label === "WaitNode node" && (
              <>
                {/* Wait Type */}
                <div className="mb-4">
                  <Label htmlFor="waitType">Wait Type</Label>
                  <select
                    id="waitType"
                    {...getFieldProps("waitType")}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                  >
                    <option value="days">Days</option>
                    <option value="hours">Hours</option>
                    <option value="minutes">Minutes</option>
                  </select>
                  {touched.waitType && errors.waitType && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.waitType}
                    </p>
                  )}
                </div>

                {/* Wait Duration */}
                <div className="mb-4">
                  <Label htmlFor="waitDuration">Wait Duration</Label>
                  <Input
                    id="waitDuration"
                    type="text"
                    {...getFieldProps("waitDuration")}
                    placeholder="Enter wait duration"
                    className="mt-1"
                  />
                  {touched.waitDuration && errors.waitDuration && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.waitDuration}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* CPC & Traffic Sources */}
            {data.label === "TrafficEntry node" && (
              <>
                <div className="mb-4">
                  <Label htmlFor="cpc">CPC</Label>
                  <Input
                    id="cpc"
                    type="number"
                    {...getFieldProps("cpc")}
                    placeholder="Enter conversion rate"
                    className="mt-1"
                  />
                  {touched.cpc && errors.cpc && (
                    <p className="text-sm text-destructive mt-1">{errors.cpc}</p>
                  )}
                </div>

                <div className="mb-4">
                  <Label>Traffic Sources</Label>

                  <FieldArray
                    name="trafficSources"
                    {...getFieldProps("trafficSources")}
                    render={(arrayHelpers) => (
                      <div className="space-y-3 mt-2">
                        {typeof values.trafficSources !== "string" &&
                          values.trafficSources.map((option, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <select
                                name={`trafficSources.${index}.trafficSource`}
                                {...getFieldProps(
                                  `trafficSources.${index}.trafficSource`
                                )}
                                className="flex h-10 flex-1 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              >
                                <option value="">Select Traffic Sources</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Google">Google</option>
                                <option value="Bing">Bing</option>
                              </select>

                              <Field
                                placeholder="Visitors"
                                name={`trafficSources.${index}.value`}
                                type="number"
                                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              />

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                        {errors?.trafficSources && (
                          <p className="text-sm text-destructive">
                            Something goes wrong
                          </p>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            arrayHelpers.push({
                              trafficSource: "",
                              value: "",
                            })
                          }
                          className="w-full border-[#345DED] text-[#345DED] hover:bg-[#345DED]/10"
                        >
                          Add New
                        </Button>
                      </div>
                    )}
                  />
                </div>
              </>
            )}

            {/* Product */}
            {type === "OrderFormPage" && (
              <div className="mb-4">
                <Label htmlFor="product">Product</Label>
                <select
                  id="product"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                  {...getFieldProps("product")}
                >
                  <option value="">Select Product</option>

                  {singleProject?.scenario
                    ?.find((s) => s._id === scenarioId)
                    ?.products?.map((product) => (
                      <option
                        key={product._id}
                        value={product._id}
                      >
                        {product.name}
                      </option>
                    ))}
                </select>
                {touched.product && errors.product && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.product}
                  </p>
                )}
              </div>
            )}

            {/* Errors from server */}
            {errors.afterSubmit && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errors.afterSubmit}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-black/90 text-white"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default NodeModal;
