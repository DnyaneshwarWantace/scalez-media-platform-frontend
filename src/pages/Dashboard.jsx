import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import "./text-updater-node.css";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import ApplicationPageNode from "./NodeTypes/ApplicationPageNode";
import CalendarNode from "./NodeTypes/CalendarNode";
import ChatbotNode from "./NodeTypes/ChatbotNode";
import ChatbotOptInNode from "./NodeTypes/ChatbotOptInNode";
import ContentPageNode from "./NodeTypes/ContentPageNode";
import CustomPageNode from "./NodeTypes/CustomPageNode";
import DownsellPageNode from "./NodeTypes/DownsellPageNode";
import EmailNode from "./NodeTypes/EmailNode";
import OptInNode from "./NodeTypes/OptInNode";
import OrderFormPage from "./NodeTypes/OrderFormPage";
import PhoneNode from "./NodeTypes/PhoneNode";
import PhoneOrderNode from "./NodeTypes/PhoneOrderNode";
import PopUpNode from "./NodeTypes/PopUpNode";
import SalesPageNode from "./NodeTypes/SalesPageNode";
import SMSNode from "./NodeTypes/SMSNode";
import SurveyNode from "./NodeTypes/SurveyNode";
import ThankYouNode from "./NodeTypes/ThankYouNode";
import TrafficEntry from "./NodeTypes/TrafficEntry";
import UpsellPageNode from "./NodeTypes/UpsellPageNode";
import WebinarLiveNode from "./NodeTypes/WebinarLiveNode";
import WebinarRegisterNode from "./NodeTypes/WebinarRegisterNode";
import WebinarReplayNode from "./NodeTypes/WebinarReplayNode";
import WebinarSalesNode from "./NodeTypes/WebinarSalesNode";
import WaitNode from "./NodeTypes/WaitNode";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { backendServerBaseURL } from "../utils/backendServerBaseURL";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "../components/common/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Settings, X, FolderPlus } from "lucide-react";
import {
  createScenario,
  deleteScenario,
  selectScenarioId,
  selectreportsSelectedTab,
  selectselectedSidebarTab,
  selectsingleProject,
  updateEdgesInSelectedScenario,
  updateNodesInSelectedScenario,
  updateProject,
  updateScenarioId,
} from "../redux/slices/funnelProjectSlice";
import { getSingleProject } from "../redux/slices/funnelProjectSlice";
import AnimatedNumber from "animated-number-react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import Reports from "./Reports";
import calculator from "../utils/calculator";

const initialNodes = [
  // {
  //   id: "node-1",
  //   type: "textUpdater",
  //   position: { x: 0, y: 0 },
  //   data: { value: 123 },
  // },
  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "input node" },
  //   position: { x: 250, y: 5 },
  // },
  // {
  //   id: "2",
  //   type: "TextUpdaterNode",
  //   data: { label: "TextUpdaterNode" },
  //   position: { x: 50, y: 5 },
  // },
];

let id = 0;
const getId = () => uuidv4();

const nodeTypes = {
  ApplicationPageNode,
  CalendarNode,
  ChatbotNode,
  ChatbotOptInNode,
  ContentPageNode,
  CustomPageNode,
  DownsellPageNode,
  EmailNode,
  OptInNode,
  OrderFormPage,
  PhoneNode,
  PhoneOrderNode,
  PopUpNode,
  SalesPageNode,
  SMSNode,
  SurveyNode,
  ThankYouNode,
  TrafficEntry,
  UpsellPageNode,
  WebinarLiveNode,
  WebinarRegisterNode,
  WebinarReplayNode,
  WebinarSalesNode,
  WaitNode,
};

const formatValue = (value) => value.toFixed(2);

const convertBillingDaysToText = (billingFrequency) => {
  switch (billingFrequency) {
    case 0:
      return "One-Time";
    case 1:
      return "Daily";
    case 7:
      return "Weekly";
    case 30:
      return "Monthly";
    case 365:
      return "Yearly";
    default:
      return "Daily";
  }
};

function FunnelDashboard() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodesWithEdges, setnodesWithEdges] = useState([]);
  const params = useParams();
  const projectId = params.projectId;
  const closeExpensesModalRef = useRef();
  const singleProject = useSelector(selectsingleProject);
  const closeCreateExpenseModalRef = useRef();
  const expensesModalRef = useRef();
  const dispatch = useDispatch();
  const closeCreateProductsModalRef = useRef();
  const productsModalRef = useRef();
  const [trafficCost, settrafficCost] = useState(0);
  const [productCost, setproductCost] = useState(0);
  const [refunds, setrefunds] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [totalRevenue, settotalRevenue] = useState(0);
  const [merchantFees, setmerchantFees] = useState(0);
  const editProjectCloseRef = useRef();
  const [aov, setaov] = useState(0);
  const [simulateLoading, setsimulateLoading] = useState(false);
  const selectedSidebarTab = useSelector(selectselectedSidebarTab);
  const reportsSelectedTab = useSelector(selectreportsSelectedTab);
  const [totalTraffic, settotalTraffic] = useState(0);
  const [totalLeads, settotalLeads] = useState(0);
  const [averageCPC, setaverageCPC] = useState(0);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [selectedExpense, setselectedExpense] = useState(null);
  const scenarioId = useSelector(selectScenarioId);

  const simulate = (updatedNodes) => {
    // Total revenue
    let tempTotalRevenu = calculator.getTotalRevenue(
      singleProject,
      scenarioId,
      updatedNodes
    );
    settotalRevenue(tempTotalRevenu);

    // AOV
    setaov(calculator.getAov(updatedNodes, tempTotalRevenu));

    // Traffic cost
    let tempTrafficCost = calculator.getTrafficCost(updatedNodes);
    settrafficCost(tempTrafficCost);

    // Product cost
    let tempProductCost = calculator.getProductCost(updatedNodes);
    setproductCost(tempProductCost);

    // Refunds
    let tempRefunds = calculator.getRefund(updatedNodes);
    setrefunds(tempRefunds);

    // Merchant fees
    let tempMerchantFees = calculator.getMerchantFees(
      updatedNodes,
      tempTotalRevenu,
      singleProject
    );

    setmerchantFees(tempMerchantFees);

    // Total expense
    const otherExpenses = calculator.getOtherExpenses(
      singleProject,
      scenarioId
    );

    settotalExpense(
      tempTrafficCost +
        tempProductCost +
        tempRefunds +
        otherExpenses +
        tempMerchantFees || 0
    );
  };

  const traverseGraph = async (
    nodeId,
    nodes,
    parentId,
    setNodes,
    singleEdgeData
  ) => {
    let targetNode = nodes.filter((singleNode) => singleNode.id === nodeId)[0];

    if (!targetNode) {
      return;
    }

    let updatedNodes = await calculator.getUpdatedNodes(
      nodes,
      parentId,
      singleEdgeData,
      calculator.reverseTraverse,
      targetNode
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Promise.allSettled(
      targetNode?.outgoingEdges
        ?.filter((e) => e.sourceHandle == "yes_handle")
        ?.map(async (singleEdge, index) => {
          updatedNodes = await traverseGraph(
            singleEdge.target,
            updatedNodes,
            targetNode.id,
            setNodes,
            singleEdge
          );

          console.log(targetNode?.data?.name);
          console.log(updatedNodes);
        })
    );

    setNodes((nodes) => updatedNodes);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Promise.allSettled(
      targetNode?.outgoingEdges
        ?.filter((e) => e.sourceHandle == "no_handle")
        ?.map(async (singleEdge, index) => {
          updatedNodes = await traverseGraph(
            singleEdge.target,
            updatedNodes,
            targetNode.id,
            setNodes,
            singleEdge
          );

          console.log(targetNode?.data?.name);
          console.log(updatedNodes);
        })
    );

    settotalTraffic(await calculator.getTotalTraffic(updatedNodes));

    settotalLeads(await calculator.getTotalLeads(updatedNodes));

    setaverageCPC(await calculator.getAverageCPC(updatedNodes));

    setNodes((nodes) => updatedNodes);

    simulate(updatedNodes);

    return updatedNodes;
  };

  useEffect(() => {
    // Total revenue
    let tempTotalRevenu = singleProject?.scenario
      ?.find((s) => s._id === scenarioId)
      ?.products?.reduce((accumulator, singleProduct) => {
        return (
          accumulator +
          singleProduct.price *
            nodes
              .filter((singleNode) => {
                return (
                  singleNode.type == "OrderFormPage" &&
                  singleNode.data?.product?._id?.toString() ==
                    singleProduct._id?.toString()
                );
              })
              .reduce((accumulator, singleNode) => {
                if (singleNode.type == "OrderFormPage") {
                  return (
                    accumulator + (singleNode?.data?.convertedTraffic || 0)
                  );
                }

                return accumulator;
              }, 0)
        );
      }, 0);
    settotalRevenue(tempTotalRevenu);
  }, [nodes]);

  const formik = useFormik({
    initialValues: {
      expenseName: "",
      billingFrequency: "",
      amount: 0,
    },
    validationSchema: Yup.object().shape({
      expenseName: Yup.string().required("Expense name is required"),
      billingFrequency: Yup.number().required("Billing frequency is required"),
      amount: Yup.number(),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      const { expenseName, billingFrequency, amount } = values;
      setSubmitting(true);

      if (selectedExpense) {
        console.log(selectedExpense);
        const response = await axiosInstance.patch(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/expense/${selectedExpense._id}`,
          {
            expenseName,
            billingFrequency,
            amount,
          }
        );

        if (response.status == 200) {
          dispatch(getSingleProject({ setNodes, setEdges, projectId }));
          closeCreateExpenseModalRef.current.click();
          expensesModalRef.current.click();
        }
      } else {
        const response = await axiosInstance.post(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/expense`,
          {
            expenseName,
            billingFrequency,
            amount,
          }
        );

        if (response.status == 200) {
          dispatch(getSingleProject({ setNodes, setEdges, projectId }));
          closeCreateExpenseModalRef.current.click();
          expensesModalRef.current.click();
        }
      }

      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const formik2 = useFormik({
    initialValues: {
      name: "",
      type: "",
      price: 0,
      priceType: 0,
      refundRate: 0,
      cost: 0,
      stickRate: 1,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      type: Yup.string().required("Type is required"),
      price: Yup.number().required("Price is required"),
      priceType: Yup.number().required("Price type is required"),
      refundRate: Yup.number().required("Refund rate is required"),
      cost: Yup.number().required("Cost is required"),
      stickRate: Yup.number().required("Stick rate is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      const { name, type, price, priceType, refundRate, cost, stickRate } =
        values;
      setSubmitting(true);

      if (selectedProduct == null) {
        const response = await axiosInstance.post(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/products`,
          {
            name,
            type,
            price,
            priceType,
            refundRate,
            cost,
            stickRate,
          }
        );

        if (response.status == 200) {
          dispatch(getSingleProject({ setNodes, setEdges, projectId }));
          closeCreateProductsModalRef.current.click();
          productsModalRef.current.click();
        }
      } else {
        const response = await axiosInstance.patch(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/products/${selectedProduct._id}`,
          {
            name,
            type,
            price,
            priceType,
            refundRate,
            cost,
            stickRate,
          }
        );

        if (response.status == 200) {
          dispatch(getSingleProject({ setNodes, setEdges, projectId }));
          closeCreateProductsModalRef.current.click();
          productsModalRef.current.click();
        }
      }

      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (selectedProduct) {
      formik2.setValues({
        name: selectedProduct.name,
        type: selectedProduct.type,
        price: selectedProduct.price,
        priceType: selectedProduct.priceType,
        refundRate: selectedProduct.refundRate,
        cost: selectedProduct.cost,
        stickRate: selectedProduct.stickRate,
      });
    } else {
      formik2.resetForm();
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedExpense) {
      formik.setValues({
        expenseName: selectedExpense.expenseName,
        billingFrequency: selectedExpense.billingFrequency,
        amount: selectedExpense.amount,
      });
    } else {
      formik.resetForm();
    }
  }, [selectedExpense]);

  useEffect(() => {
    if (projectId && projectId?.toString() != "0") {
      dispatch(getSingleProject({ setNodes, setEdges, projectId }));
    }
  }, [projectId]);

  const updateNodesAndEdges = useDebouncedCallback(
    () => {
      if (projectId != "0" && scenarioId != 0) {
        // Update nodes on server
        axiosInstance.patch(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/nodes`,
          {
            nodes: nodes.map((singleNode) => {
              const tempNode = {
                ...{ ...singleNode, data: { ...singleNode.data } },
              };
              if (tempNode.data) {
                tempNode.data.product =
                  tempNode.data?.product?._id || tempNode.data?.product;
              }
              return tempNode;
            }),
          }
        );

        // Update edges on server
        axiosInstance.patch(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/edges`,
          {
            edges,
          }
        );
      }
    },
    // delay in ms
    300
  );

  useEffect(() => {
    // console.log(`Updated nodes and edges`);
    // console.log(`Nodes:`);
    // console.log(nodes);
    // console.log(`Edges:`);
    // console.log(edges);

    const nodesWithEdges = nodes.map((singleNode) => {
      const incomingEdges = edges.filter((singleEdge) => {
        return singleEdge.target === singleNode.id;
      });

      const outgoingEdges = edges.filter((singleEdge) => {
        return singleEdge.source === singleNode.id;
      });

      const allEdges = edges.filter((singleEdge) => {
        return (
          singleEdge.source === singleNode.id ||
          singleEdge.target === singleNode.id
        );
      });

      return {
        ...singleNode,
        incomingEdges,
        outgoingEdges,
        edges: allEdges,
      };
    });

    setnodesWithEdges(nodesWithEdges);
    updateNodesAndEdges();
  }, [nodes, edges, singleProject]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getNodeDefaultConversionRate = (type) => {
    switch (type) {
      case "OrderFormPage":
        return 100;
      case "TrafficEntry":
        return 100;
      case "WaitNode":
        return 100;
      default:
        return 0;
    }
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          name: `${type}`,
          label: `${type} node`,
          traffic: type == "TrafficEntry" ? 1000 : 0,
          conversionRate: getNodeDefaultConversionRate(type),
          waitType: "days",
          waitDuration: 1,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const editProjectFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      processingRatePercent: 2.9,
      perTransactionFee: 0.3,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      processingRatePercent: Yup.number(),
      perTransactionFee: Yup.number(),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      await dispatch(
        updateProject({
          ...values,
          setErrors,
          editProjectCloseRef,
          projectId: singleProject?._id,
        })
      );
      setSubmitting(false);

      dispatch(getSingleProject({ setNodes, setEdges, projectId }));
    },
  });

  useEffect(() => {
    if (singleProject) {
      editProjectFormik.setValues({
        title: singleProject.title,
        description: singleProject.description,
        processingRatePercent: singleProject.processingRatePercent,
        perTransactionFee: singleProject.perTransactionFee,
        stickRate: singleProject.stickRate,
      });
    }
  }, [singleProject]);

  const deleteproduct = async () => {
    const response = await axiosInstance.delete(
      `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/products/${selectedProduct._id}`,
      {}
    );

    if (response.status == 200) {
      dispatch(getSingleProject({ setNodes, setEdges, projectId }));
      closeCreateProductsModalRef.current.click();
      productsModalRef.current.click();
    }
  };

  const deleteExpense = async () => {
    const response = await axiosInstance.delete(
      `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/expense/${selectedExpense._id}`,
      {}
    );

    if (response.status == 200) {
      dispatch(getSingleProject({ setNodes, setEdges, projectId }));
      closeCreateProductsModalRef.current.click();
      productsModalRef.current.click();
    }
  };

  const saveVersionIfRequired = useDebouncedCallback(
    (projectId, scenarioId) => {
      axiosInstance
        .post(
          `${backendServerBaseURL}/api/v1/funnel-project/${projectId}/scenario/${scenarioId}/version`,
          {}
        )
        .then((res) => {
          console.log(res);
        });
    },
    10000
  );

  useEffect(() => {
    if (scenarioId != 0) {
      saveVersionIfRequired(projectId, scenarioId);
    }
  }, [nodes, edges]);

  return (
    <div className="p-0 bg-background">
      {projectId == "0" ? (
        <div className="flex items-center justify-center w-full min-h-[75vh]">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderPlus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Projects Yet</h2>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first funnel project
              </p>
              <Button
                className="bg-black hover:bg-black/90 text-white"
                data-bs-toggle="modal"
                data-bs-target="#createNewProjectModal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {selectedSidebarTab == "canvas" && (
            <div
              className="row p-0 m-0"
              style={{ minHeight: "calc(100vh - 4.25rem)" }}
            >
              <div className="col-10 p-0 m-0">
                <div
                  className="row p-0 m-0"
                  style={{ minHeight: "calc(100vh - 4.25rem)" }}
                >
                  {/* Sidebar */}
                  <div className="col-2 p-0 m-0">
                    <div className="dndflow style-4">
                      <Sidebar />
                    </div>
                  </div>

                  {/* React Flow */}

                  <div className="col-10">
                    <div className="px-4 py-3 border-b border-border bg-background">
                      <div className="flex items-center justify-between">
                        {/* Scenarios */}
                        <div className="flex items-center gap-2">
                          {singleProject?.scenario?.map(
                            (singleScenario, index) => {
                              return (
                                <div
                                  key={singleScenario._id}
                                  className="relative group"
                                >
                                  <Button
                                    variant={singleScenario._id == scenarioId ? "default" : "outline"}
                                    className={`${
                                      singleScenario._id == scenarioId
                                        ? "bg-black text-white hover:bg-black/90"
                                        : "hover:bg-muted"
                                    } transition-all`}
                                    onClick={() => {
                                      dispatch(
                                        updateNodesInSelectedScenario(nodes)
                                      );
                                      dispatch(
                                        updateEdgesInSelectedScenario(edges)
                                      );

                                      setNodes(singleScenario.nodes);
                                      setEdges(singleScenario.edges);
                                      dispatch(
                                        updateScenarioId(singleScenario._id)
                                      );
                                    }}
                                  >
                                    {singleScenario.name}
                                  </Button>

                                  {index !== 0 && (
                                    <button
                                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        dispatch(
                                          deleteScenario({
                                            projectId,
                                            scenarioId: singleScenario._id,
                                          })
                                        );
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          )}

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 hover:bg-black hover:text-white transition-all"
                            onClick={() => {
                              dispatch(createScenario({ projectId }));
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-lg font-semibold text-foreground">{singleProject?.title}</h3>

                        {/* Settings */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          data-bs-toggle="modal"
                          data-bs-target="#editProjectModal"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="dndflow style-4">
                      <ReactFlowProvider>
                        <div
                          className="reactflow-wrapper"
                          ref={reactFlowWrapper}
                        >
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                            defaultEdgeOptions={{
                              markerEnd: {
                                type: MarkerType.ArrowClosed,
                              },
                            }}
                          >
                            <Background />
                            <Controls />
                          </ReactFlow>
                        </div>
                      </ReactFlowProvider>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}

              <div
                className="col-2 style-4"
                style={{
                  maxHeight: "calc(100vh - 5.5rem)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div>
                  <div
                    className="p-2 mb-2"
                    style={{ backgroundColor: "#e0e0e0" }}
                  >
                    <div className="d-flex justify-content-between">
                      <h5 className="m-0">Products</h5>

                      <div
                        style={{ cursor: "pointer" }}
                        className="me-1"
                        ref={productsModalRef}
                        data-bs-toggle="modal"
                        data-bs-target={`#productsModal`}
                      >
                        <i class="fa-solid fa-gear"></i>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary">(Monthly Revenue)</p>

                  {singleProject?.scenario
                    ?.find((s) => s._id === scenarioId)
                    ?.products?.filter((singleProduct) => {
                      return (
                        nodes.filter((singleNode) => {
                          return (
                            singleNode.type == "OrderFormPage" &&
                            singleNode.data?.product?._id?.toString() ==
                              singleProduct._id?.toString()
                          );
                        }).length > 0
                      );
                    })
                    .map((singleProduct) => {
                      return (
                        <div className="d-flex justify-content-between w-100">
                          <p>{singleProduct.name}</p>
                          <p
                            style={{ minWidth: "3.5rem" }}
                            className="text-end pe-2"
                          >
                            $
                            {singleProduct.price *
                              nodes
                                .filter((singleNode) => {
                                  return (
                                    singleNode.type == "OrderFormPage" &&
                                    singleNode.data?.product?._id?.toString() ==
                                      singleProduct._id?.toString()
                                  );
                                })
                                .reduce((accumulator, singleNode) => {
                                  if (singleNode.type == "OrderFormPage") {
                                    return (
                                      accumulator +
                                      (singleNode?.data?.convertedTraffic || 0)
                                    );
                                  }

                                  return accumulator;
                                }, 0)}
                          </p>
                        </div>
                      );
                    })}

                  <div className="d-flex justify-content-between w-100">
                    <p className="fw-bold">Total</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="fw-bold text-end pe-2"
                    >
                      $
                      <AnimatedNumber
                        value={totalRevenue}
                        duration={1500}
                        formatValue={formatValue}
                      />
                    </p>
                  </div>
                </div>

                <div>
                  <div
                    className="p-2 mb-2"
                    style={{ backgroundColor: "#e0e0e0" }}
                  >
                    <h5 className="m-0">Traffic Sources</h5>
                  </div>

                  <p className="text-secondary">(Monthly Visitors)</p>

                  {nodes.map((singleNode) => {
                    if (singleNode.type == "TrafficEntry") {
                      return (
                        <div className="d-flex justify-content-between w-100">
                          <p>{singleNode.data.name}</p>
                          <p
                            style={{ minWidth: "3.5rem" }}
                            className="text-end pe-2"
                          >
                            {singleNode.data.traffic}
                          </p>
                        </div>
                      );
                    }

                    return null;
                  })}

                  <div className="d-flex justify-content-between w-100">
                    <p className="fw-bold">Total</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="fw-bold text-end pe-2"
                    >
                      <AnimatedNumber
                        value={nodes.reduce((accumulator, singleNode) => {
                          if (singleNode.type == "TrafficEntry") {
                            return accumulator + singleNode.data.traffic;
                          }

                          return accumulator;
                        }, 0)}
                        duration={1500}
                        formatValue={formatValue}
                      />
                    </p>
                  </div>
                </div>

                <div>
                  <div
                    className="p-2 mb-2"
                    style={{ backgroundColor: "#e0e0e0" }}
                  >
                    <div className="d-flex justify-content-between">
                      <h5 className="m-0">Expenses</h5>
                      <div
                        style={{ cursor: "pointer" }}
                        className="me-1"
                        ref={expensesModalRef}
                        data-bs-toggle="modal"
                        data-bs-target={`#expensesModal`}
                      >
                        <i class="fa-solid fa-gear"></i>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary">(Monthly Expenses)</p>

                  <div className="d-flex justify-content-between w-100">
                    <p>Traffic Cost</p>
                    <p style={{ minWidth: "3.5rem" }} className="text-end pe-2">
                      ${trafficCost}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between w-100">
                    <p>Merchant Fees</p>
                    <p style={{ minWidth: "3.5rem" }} className="text-end pe-2">
                      ${merchantFees}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between w-100">
                    <p>Product Cost</p>
                    <p style={{ minWidth: "3.5rem" }} className="text-end pe-2">
                      ${productCost}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between w-100">
                    <p>Refunds</p>
                    <p style={{ minWidth: "3.5rem" }} className="text-end pe-2">
                      ${refunds}
                    </p>
                  </div>

                  {singleProject?.scenario
                    ?.find((s) => s._id == scenarioId)
                    ?.expenses?.map((singleExpense) => {
                      return (
                        <div className="d-flex justify-content-between w-100">
                          <p>{singleExpense.expenseName}</p>
                          <p
                            style={{ minWidth: "3.5rem" }}
                            className="text-end pe-2"
                          >
                            ${singleExpense.amount}
                          </p>
                        </div>
                      );
                    })}

                  <div className="d-flex justify-content-between w-100">
                    <p className="fw-bold">Total</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="fw-bold text-end pe-2"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={totalExpense}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <div
                    className="p-2 mb-2"
                    style={{ backgroundColor: "#e0e0e0" }}
                  >
                    <h5 className="m-0">Summary</h5>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">CPA</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={
                            totalExpense /
                              calculator.getConvertedTraffic(
                                singleProject,
                                scenarioId,
                                nodes
                              ) || 0
                          }
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">CPL</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={totalExpense / totalLeads || 0}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">EPC</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={
                            (totalRevenue - totalExpense) /
                            calculator.getConvertedTraffic(
                              singleProject,
                              scenarioId,
                              nodes
                            )
                          }
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">AOV</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={aov || 0}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">ROAS</p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      {
                        <AnimatedNumber
                          value={totalRevenue / totalExpense || 0}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2 mb-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">
                      REVENUE <span className="text-secondary">(MONTHLY)</span>
                    </p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 mb-0 fw-bold"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={totalRevenue || 0}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>

                  <div
                    className="d-flex justify-content-between w-100 border p-2"
                    style={{ backgroundColor: "#e8e8e8" }}
                  >
                    <p className="fw-bold mb-0">
                      PROFIT <span className="text-secondary">(MONTHLY)</span>
                    </p>
                    <p
                      style={{ minWidth: "3.5rem" }}
                      className="text-end pe-2 fw-bold mb-0"
                    >
                      $
                      {
                        <AnimatedNumber
                          value={totalRevenue - totalExpense || 0}
                          duration={1500}
                          formatValue={formatValue}
                        />
                      }
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100 btn-lg mt-3"
                  disabled={simulateLoading}
                  onClick={async () => {
                    setsimulateLoading(true);
                    console.log(nodes);
                    console.log(edges);

                    // Get all traffic sources
                    const trafficSources = nodesWithEdges.filter(
                      (singleNode) => {
                        return singleNode.type === "TrafficEntry";
                      }
                    );
                    console.log(trafficSources);

                    // Traverse
                    await Promise.all(
                      trafficSources.map(async (singleTrafficSource) => {
                        await traverseGraph(
                          singleTrafficSource.id,
                          nodesWithEdges,
                          null,
                          setNodes
                        );
                      })
                    );

                    setsimulateLoading(false);
                  }}
                >
                  Simulate
                </button>
              </div>
            </div>
          )}

          {selectedSidebarTab == "reports" && (
            <Reports
              totalRevenue={totalRevenue}
              totalExpense={totalExpense}
              totalTraffic={totalTraffic}
              totalLeads={totalLeads}
              averageCPC={averageCPC}
              aov={aov}
              nodes={nodes}
              merchantFees={merchantFees}
              trafficCost={trafficCost}
              singleProject={singleProject}
              refunds={refunds}
              productCost={productCost}
              scenarioId={scenarioId}
            />
          )}
        </>
      )}

      {/* Expenses Modal */}
      <div
        className="modal fade"
        id="expensesModal"
        tabIndex={-1}
        aria-labelledby="createNewProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNewProjectModalLabel">
                Expenses
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeExpensesModalRef}
              />
            </div>
            <div className="modal-body p-0 m-0 p-3">
              {/* Write demo table */}
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Expense Name</th>
                    <th scope="col">Billing Frequency</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {singleProject?.scenario
                    ?.find((s) => s._id == scenarioId)
                    ?.expenses?.map((singleExpense) => {
                      return (
                        <tr>
                          <td>{singleExpense.expenseName}</td>
                          <td>
                            {convertBillingDaysToText(
                              singleExpense.billingFrequency
                            )}
                          </td>
                          <td>${singleExpense.amount}</td>
                          <td>
                            <div className="d-flex">
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginRight: "1rem",
                                }}
                                onClick={() => {
                                  setselectedExpense(singleExpense);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={`#createExpenseModal`}
                              >
                                <i class="fa-solid fa-pen-to-square"></i>
                              </div>

                              <div
                                style={{
                                  cursor: "pointer",
                                  marginRight: "1rem",
                                }}
                                onClick={() => {
                                  setselectedExpense(singleExpense);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteExpenseModal`}
                              >
                                <i class="fa-solid fa-trash"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={`#createExpenseModal`}
                onClick={() => {
                  setselectedExpense(null);
                }}
              >
                + Add New Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete expense Modal */}
      <div
        className="modal fade"
        id="deleteExpenseModal"
        tabIndex={-1}
        aria-labelledby="deleteExpenseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteExpenseModalLabel">
                Delete expense
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-0 m-0 p-3">
              Are you sure you want to delete this expense (
              {selectedExpense?.expenseName}) ? This action cannot be undone.
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteExpense();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Expense Modal */}
      <div
        className="modal fade"
        id="createExpenseModal"
        tabIndex={-1}
        aria-labelledby="createNewProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNewProjectModalLabel">
                Add Expense
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeCreateExpenseModalRef}
              />
            </div>
            <div className="modal-body">
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  {/* Expense Name */}
                  <div className="mb-4">
                    <label className="form-label">Expense Name</label>
                    <select
                      {...getFieldProps("expenseName")}
                      className="form-select"
                    >
                      <option value={""}>Select Expense Name</option>
                      {[
                        "Custom Expense",
                        "Accounting",
                        "Association Dues",
                        "Baking Fees",
                        "Business Gifts",
                        "Consulting",
                        "Content Creation",
                        "Equipment",
                        "Graphic Design",
                        "Industry Events",
                        "Insurance",
                        "Internet Access",
                        "Legal Fees",
                        "Office Furniture",
                        "Office Rent",
                        "Office Supplies",
                        "Online Services",
                        "Payroll",
                        "Phone Service",
                        "Programming",
                        "Research",
                        "Shipping",
                        "Software",
                        "Stationary",
                        "Training",
                        "Travel",
                        "Utilities",
                        "Web Hosting",
                      ].map((expenseName) => {
                        return (
                          <option value={expenseName}>{expenseName}</option>
                        );
                      })}
                    </select>
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          touched.expenseName && errors.expenseName
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {errors.expenseName}
                    </span>
                  </div>

                  {/* Billing Frequency */}
                  <div className="mb-4">
                    <label className="form-label">Billing Frequency</label>
                    <div className="input-group">
                      <select
                        {...getFieldProps("billingFrequency")}
                        className="form-select"
                      >
                        {[
                          { name: "Select Billing Frequency", value: "" },
                          { name: "Daily", value: 1 },
                          { name: "Weekly", value: 7 },
                          { name: "Monthly", value: 30 },
                          { name: "Yearly", value: 365 },
                        ].map((optionData) => {
                          return (
                            <option value={optionData.value}>
                              {optionData.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          touched.billingFrequency && errors.billingFrequency
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {errors.billingFrequency}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="form-label">Amount</label>
                    <div className="input-group">
                      <input
                        type={"number"}
                        {...getFieldProps("amount")}
                        className="form-control form-control-lg"
                        placeholder="Enter conversion rate"
                      />
                    </div>

                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(touched.amount && errors.amount)
                          ? "block"
                          : "none",
                      }}
                    >
                      {errors.amount}
                    </span>
                  </div>

                  {/* Errors from server */}
                  {errors.afterSubmit && (
                    <div className="alert alert-danger" role="alert">
                      {errors.afterSubmit}
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="btn btn-lg btn-primary "
                    >
                      Update
                    </LoadingButton>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Products Modal */}
      <div
        className="modal fade"
        id="productsModal"
        tabIndex={-1}
        aria-labelledby="createNewProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNewProjectModalLabel">
                Products
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-0 m-0 p-3">
              {/* Write demo table */}
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Price Type</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Refund Rate</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {singleProject?.scenario
                    ?.find((s) => s._id === scenarioId)
                    ?.products?.map((singleProduct) => {
                      return (
                        <tr>
                          <td>{singleProduct.name}</td>
                          <td>${singleProduct.price}</td>
                          <td>
                            {convertBillingDaysToText(singleProduct.priceType)}
                          </td>
                          <td>${singleProduct.cost}</td>
                          <td>{singleProduct.refundRate}%</td>
                          <td>
                            <div className="d-flex">
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginRight: "1rem",
                                }}
                                onClick={() => {
                                  setselectedProduct(singleProduct);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={`#createProductModal`}
                              >
                                <i class="fa-solid fa-pen-to-square"></i>
                              </div>

                              <div
                                style={{
                                  cursor: "pointer",
                                  marginRight: "1rem",
                                }}
                                onClick={() => {
                                  setselectedProduct(singleProduct);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteProductModal`}
                              >
                                <i class="fa-solid fa-trash"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={`#createProductModal`}
                onClick={() => {
                  setselectedProduct(null);
                }}
              >
                + Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete product Modal */}
      <div
        className="modal fade"
        id="deleteProductModal"
        tabIndex={-1}
        aria-labelledby="deleteProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteProductModalLabel">
                Delete product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-0 m-0 p-3">
              Are you sure you want to delete this product (
              {selectedProduct?.name}) ? This action cannot be undone.
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteproduct();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      <div
        className="modal fade"
        id="createProductModal"
        tabIndex={-1}
        aria-labelledby="createNewProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNewProjectModalLabel">
                {selectedProduct ? "Edit Product" : "Add Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeCreateProductsModalRef}
              />
            </div>
            <div className="modal-body">
              <FormikProvider value={formik2}>
                <Form
                  autoComplete="off"
                  noValidate
                  onSubmit={formik2.handleSubmit}
                >
                  {/* Name */}
                  <div className="mb-4">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      {...formik2.getFieldProps("name")}
                      placeholder="Enter product name"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.name && formik2.errors.name
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.name}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <label className="form-label">Type</label>
                    <div className="input-group">
                      <select
                        {...formik2.getFieldProps("type")}
                        className="form-select"
                      >
                        {[
                          { name: "Select Product Type", value: "" },
                          {
                            name: "Custom Product Type",
                            value: "Custom Product Type",
                          },
                          { name: "Affilate/CPA", value: "Affilate/CPA" },
                          {
                            name: "Agency Services",
                            value: "Agency Services",
                          },
                          { name: "Baby Products", value: "Baby Products" },
                          { name: "Books", value: "Books" },
                          { name: "Clothing", value: "Clothing" },
                          {
                            name: "Clothing Program",
                            value: "Clothing Program",
                          },
                          { name: "Consulting", value: "Consulting" },
                          { name: "Skin Care", value: "Skin Care" },
                          {
                            name: "E-Commerce Product",
                            value: "E-Commerce Product",
                          },
                          { name: "Electronics", value: "Electronics" },
                          {
                            name: "Financial Services",
                            value: "Financial Services",
                          },
                          {
                            name: "Fitness Products",
                            value: "Fitness Products",
                          },
                          {
                            name: "Freelance Services",
                            value: "Freelance Services",
                          },
                          { name: "Furniture", value: "Furniture" },
                          {
                            name: "Health Suppliments",
                            value: "Health Suppliments",
                          },
                          {
                            name: "Infoproduct Shipped",
                            value: "Infoproduct Shipped",
                          },
                          { name: "Jewwlry", value: "Jewwlry" },
                          { name: "Live Event", value: "Live Event" },
                          { name: "Local Business", value: "Local Business" },
                          {
                            name: "Mastermind group",
                            value: "Mastermind group",
                          },
                          {
                            name: "Membership Site",
                            value: "Membership Site",
                          },
                          { name: "Men's Grooming", value: "Men's Grooming" },
                          { name: "Online Course", value: "Online Course" },
                          {
                            name: "Paid Newsletter",
                            value: "Paid Newsletter",
                          },
                          { name: "Pets Supplies", value: "Pets Supplies" },
                          {
                            name: "Professional Services",
                            value: "Professional Services",
                          },
                          { name: "Real Estate", value: "Real Estate" },
                          { name: "SAAS", value: "SAAS" },
                          { name: "Software", value: "Software" },
                          {
                            name: "Subscription Boxes",
                            value: "Subscription Boxes",
                          },
                          { name: "Toys", value: "Toys" },
                          {
                            name: "Travel Accessories",
                            value: "Travel Accessories",
                          },
                          {
                            name: "Travel Services",
                            value: "Travel Services",
                          },
                          { name: "Videogames", value: "Videogames" },
                        ].map((optionData) => {
                          return (
                            <option value={optionData.value}>
                              {optionData.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.type && formik2.errors.type
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.type}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <label className="form-label">Product Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      {...formik2.getFieldProps("price")}
                      placeholder="Enter product name"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.price && formik2.errors.price
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.price}
                    </span>
                  </div>

                  {/* Price Type */}
                  <div className="mb-4">
                    <label className="form-label">Price Type</label>
                    <div className="input-group">
                      <select
                        {...formik2.getFieldProps("priceType")}
                        className="form-select"
                      >
                        {[
                          {
                            name: "One-Time",
                            value: 0,
                            selected: true,
                          },
                          { name: "Monthly", value: 30, selected: false },
                          { name: "Yearly", value: 365, selected: false },
                        ].map((optionData) => {
                          return (
                            <option
                              value={optionData.value}
                              selected={optionData.selected}
                            >
                              {optionData.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.priceType && formik2.errors.priceType
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.priceType}
                    </span>
                  </div>

                  {/* Stick Rate */}
                  {formik2.values.priceType != 0 && (
                    <div className="mb-4">
                      <label className="form-label">Stick Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        {...formik2.getFieldProps("stickRate")}
                        placeholder="Enter Stick Rate"
                      />
                      <span
                        className="invalid-feedback"
                        style={{
                          display: Boolean(
                            formik2.touched.stickRate &&
                              formik2.errors.stickRate
                          )
                            ? "block"
                            : "none",
                        }}
                      >
                        {formik2.errors.stickRate}
                      </span>
                    </div>
                  )}

                  {/* Refund Rate */}
                  <div className="mb-4">
                    <label className="form-label">Refund Rate (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      {...formik2.getFieldProps("refundRate")}
                      placeholder="Enter refund rate (%)"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.refundRate &&
                            formik2.errors.refundRate
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.refundRate}
                    </span>
                  </div>

                  {/* Product Cost */}
                  <div className="mb-4">
                    <label className="form-label">Product cost</label>
                    <input
                      type="number"
                      className="form-control"
                      {...formik2.getFieldProps("cost")}
                      placeholder="Enter product cost"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          formik2.touched.cost && formik2.errors.cost
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {formik2.errors.cost}
                    </span>
                  </div>

                  {/* Errors from server */}
                  {formik2.errors.afterSubmit && (
                    <div className="alert alert-danger" role="alert">
                      {formik2.errors.afterSubmit}
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <LoadingButton
                      type="submit"
                      loading={formik2.isSubmitting}
                      disabled={formik2.isSubmitting}
                      className="btn btn-lg btn-primary "
                    >
                      {selectedProduct ? "Update" : "Create"}
                    </LoadingButton>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <div
        className="modal fade"
        id="editProjectModal"
        tabIndex={-1}
        aria-labelledby="createNewProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNewProjectModalLabel">
                Edit Project
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={editProjectCloseRef}
              />
            </div>
            <div className="modal-body">
              <FormikProvider value={editProjectFormik}>
                <Form
                  autoComplete="off"
                  noValidate
                  onSubmit={editProjectFormik.handleSubmit}
                >
                  {/* Title */}
                  <div className="mb-4">
                    <label className="form-label">Title</label>
                    <input
                      {...editProjectFormik.getFieldProps("title")}
                      className="form-control form-control-lg"
                      placeholder="Project title"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          editProjectFormik.touched.title &&
                            editProjectFormik.errors.title
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {editProjectFormik.errors.title}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <div className="input-group">
                      <textarea
                        rows={6}
                        type={"text"}
                        {...editProjectFormik.getFieldProps("description")}
                        className="form-control form-control-lg"
                        placeholder="Enter description"
                      />
                    </div>

                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          editProjectFormik.touched.description &&
                            editProjectFormik.errors.description
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {editProjectFormik.errors.description}
                    </span>
                  </div>

                  {/* Processing Rate Percent */}
                  <div className="mb-4">
                    <label className="form-label">
                      Processing Rate Percent
                    </label>
                    <input
                      {...editProjectFormik.getFieldProps(
                        "processingRatePercent"
                      )}
                      className="form-control form-control-lg"
                      placeholder="Processing Rate Percent"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          editProjectFormik.touched.processingRatePercent &&
                            editProjectFormik.errors.processingRatePercent
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {editProjectFormik.errors.processingRatePercent}
                    </span>
                  </div>

                  {/* Per Transaction Fee */}
                  <div className="mb-4">
                    <label className="form-label">Per Transaction Fee</label>
                    <input
                      {...editProjectFormik.getFieldProps("perTransactionFee")}
                      className="form-control form-control-lg"
                      placeholder="Per Transaction Fee"
                    />
                    <span
                      className="invalid-feedback"
                      style={{
                        display: Boolean(
                          editProjectFormik.touched.perTransactionFee &&
                            editProjectFormik.errors.perTransactionFee
                        )
                          ? "block"
                          : "none",
                      }}
                    >
                      {editProjectFormik.errors.perTransactionFee}
                    </span>
                  </div>

                  {/* Errors from server */}
                  {editProjectFormik.errors.afterSubmit && (
                    <div className="alert alert-danger" role="alert">
                      {editProjectFormik.errors.afterSubmit}
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <LoadingButton
                      type="submit"
                      loading={editProjectFormik.isSubmitting}
                      disabled={editProjectFormik.isSubmitting}
                      className="btn btn-lg btn-primary "
                    >
                      Update
                    </LoadingButton>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunnelDashboard;
