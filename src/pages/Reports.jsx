import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import "reactflow/dist/style.css";
import { selectreportsSelectedTab } from "../redux/slices/funnelProjectSlice";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import "./text-updater-node.css";
import { Line } from "react-chartjs-2";
import calculator from "../utils/calculator";

const formatValue = (value) => value.toFixed(2);

function Reports({
  totalRevenue,
  totalExpense,
  totalTraffic,
  totalLeads,
  averageCPC,
  aov,
  nodes,
  merchantFees,
  trafficCost,
  singleProject,
  refunds,
  productCost,
  scenarioId,
}) {
  const reportsSelectedTab = useSelector(selectreportsSelectedTab);
  let temptotalTraffic = totalTraffic;
  let temptotalTraffic2 = totalTraffic;
  let temptotalTraffic3 = totalTraffic;
  let temptotalTraffic4 = totalTraffic;
  const [customConversionRate, setcustomConversionRate] = useState("");
  const [scenarioComparisonData, setscenarioComparisonData] = useState([]);
  const [
    calculatingScenarioComparisonData,
    setcalculatingScenarioComparisonData,
  ] = useState(true);

  const traverseGraph = async (nodeId, nodes, parentId, singleEdgeData) => {
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
            singleEdge
          );

          console.log(targetNode?.data?.name);
          console.log(updatedNodes);
        })
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Promise.allSettled(
      targetNode?.outgoingEdges
        ?.filter((e) => e.sourceHandle == "no_handle")
        ?.map(async (singleEdge, index) => {
          updatedNodes = await traverseGraph(
            singleEdge.target,
            updatedNodes,
            targetNode.id,
            singleEdge
          );

          console.log(targetNode?.data?.name);
          console.log(updatedNodes);
        })
    );

    let totalRevenue = calculator.getTotalRevenue(
      singleProject,
      scenarioId,
      updatedNodes
    );

    return updatedNodes;
  };

  const test = async () => {
    await Promise.all(
      singleProject.scenario.map(async (singleScenario) => {
        let nodesWithEdges = await updatenodesWithEdges(singleScenario._id);

        const trafficSources = nodesWithEdges.filter((singleNode) => {
          return singleNode.type === "TrafficEntry";
        });

        // Traverse
        let updatedNodes = null;
        await Promise.all(
          trafficSources.map(async (singleTrafficSource) => {
            updatedNodes = await traverseGraph(
              singleTrafficSource.id,
              nodesWithEdges,
              null
            );

            console.log("1111111");
            console.log("updatedNodes", updatedNodes);
          })
        );

        let tempTotalRevenu = calculator.getTotalRevenue(
          singleProject,
          singleScenario._id,
          updatedNodes
        );

        // Traffic cost
        let tempTrafficCost = calculator.getTrafficCost(updatedNodes);

        // Product cost
        let tempProductCost = calculator.getProductCost(updatedNodes);

        // Refunds
        let tempRefunds = calculator.getRefund(updatedNodes);

        // Merchant fees
        let tempMerchantFees = calculator.getMerchantFees(
          updatedNodes,
          tempTotalRevenu,
          singleProject
        );

        // Other expenses
        const otherExpenses = calculator.getOtherExpenses(
          singleProject,
          scenarioId
        );

        let totalExpense =
          tempTrafficCost +
            tempProductCost +
            tempRefunds +
            otherExpenses +
            tempMerchantFees || 0;

        let aov = calculator.getAov(updatedNodes, tempTotalRevenu);

        setscenarioComparisonData((prev) => {
          return [
            ...prev,
            {
              scenarioName: singleScenario.name,
              totalRevenue: tempTotalRevenu,
              totalProfit: tempTotalRevenu - totalExpense,
              aov,
              roas: tempTotalRevenu / totalExpense || 0,
            },
          ];
        });

        console.log("updatedNodes", updatedNodes);
        console.log(tempTotalRevenu);
      })
    );

    setcalculatingScenarioComparisonData(false);
  };

  let updatenodesWithEdges = async (sId) => {
    let targetScenario = singleProject?.scenario?.find(
      (singleScenario) => singleScenario._id == sId
    );

    const nodesWithEdges = targetScenario.nodes.map((singleNode) => {
      const incomingEdges = targetScenario.edges.filter((singleEdge) => {
        return singleEdge.target === singleNode.id;
      });

      const outgoingEdges = targetScenario.edges.filter((singleEdge) => {
        return singleEdge.source === singleNode.id;
      });

      const allEdges = targetScenario.edges.filter((singleEdge) => {
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

    return nodesWithEdges;
  };

  useEffect(() => {
    if (singleProject) {
      setcalculatingScenarioComparisonData(true);
      setscenarioComparisonData([]);
      test();
    }
  }, [singleProject]);

  return (
    <div className="row p-0 m-0" style={{ minHeight: "calc(100vh - 4.25rem)" }}>
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

          {/* Report */}
          <div className="col-10">
            <div className="row">
              <div className="col-2"></div>

              <div
                className="col-10 container mt-4 p-3"
                style={{ backgroundColor: "#e3e3e3" }}
              >
                {reportsSelectedTab == "projectSummary" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>PROJECT SUMMARY</h2>
                        </div>
                      </div>
                    </div>

                    {/* REVENUE */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">REVENUE</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">${totalRevenue || 0}</h3>
                              <h6>Monthly</h6>
                            </div>

                            <div>
                              <h3 className="mb-1">
                                ${(totalRevenue || 0) * 12}
                              </h3>
                              <h6>Yearly</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PROFIT */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">PROFIT</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">
                                ${(totalRevenue || 0) - (totalExpense || 0)}
                              </h3>
                              <h6>Monthly</h6>
                            </div>

                            <div>
                              <h3 className="mb-1">
                                $
                                {((totalRevenue || 0) - (totalExpense || 0)) *
                                  12}
                              </h3>
                              <h6>Yearly</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TRAFFIC */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">TRAFFIC</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">{totalTraffic || 0}</h3>
                              <h6>Monthly</h6>
                            </div>

                            <div>
                              <h3 className="mb-1">
                                {(totalTraffic || 0) * 12}
                              </h3>
                              <h6>Yearly</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LEADS */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">LEADS</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">{totalLeads || 0}</h3>
                              <h6>Monthly</h6>
                            </div>

                            <div>
                              <h3 className="mb-1">{(totalLeads || 0) * 12}</h3>
                              <h6>Yearly</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AOV */}
                    <div className="col-3">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">AOV</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">{aov || 0}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROAS */}
                    <div className="col-3">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">ROAS</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">
                                {totalRevenue > 0 && totalExpense > 0
                                  ? formatValue(
                                      totalRevenue / totalExpense || 0
                                    )
                                  : formatValue(0)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CPC */}
                    <div className="col-3">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">CPC</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">
                                {formatValue(averageCPC || 0)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CPL (Cost per lead) */}
                    <div className="col-3">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">CPL</h2>

                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-1">
                                {totalLeads > 0
                                  ? formatValue(
                                      (totalRevenue - totalExpense || 0) /
                                        totalLeads || 0
                                    )
                                  : formatValue(0)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Revenue */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">Product Revenue</h2>

                          <Pie
                            style={{
                              minHeight: "15rem",
                              maxHeight: "15rem",
                            }}
                            data={{
                              labels: singleProject?.scenario
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
                                  return singleProduct.name;
                                }),
                              datasets: [
                                {
                                  label: "Revenu",
                                  data: singleProject?.scenario
                                    ?.find((s) => s._id === scenarioId)
                                    ?.products?.filter((singleProduct) => {
                                      return (
                                        nodes.filter((singleNode) => {
                                          return (
                                            singleNode.type ==
                                              "OrderFormPage" &&
                                            singleNode.data?.product?._id?.toString() ==
                                              singleProduct._id?.toString()
                                          );
                                        }).length > 0
                                      );
                                    })
                                    .map((singleProduct) => {
                                      return (
                                        singleProduct.price *
                                        nodes
                                          .filter((singleNode) => {
                                            return (
                                              singleNode.type ==
                                                "OrderFormPage" &&
                                              singleNode.data?.product?._id?.toString() ==
                                                singleProduct._id?.toString()
                                            );
                                          })
                                          .reduce((accumulator, singleNode) => {
                                            if (
                                              singleNode.type == "OrderFormPage"
                                            ) {
                                              return (
                                                accumulator +
                                                (singleNode?.data
                                                  ?.convertedTraffic || 0)
                                              );
                                            }

                                            return accumulator;
                                          }, 0)
                                      );
                                    }),
                                  backgroundColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(153, 102, 255, 1)",
                                    "rgba(255, 159, 64, 1)",
                                  ],
                                  borderColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(153, 102, 255, 1)",
                                    "rgba(255, 159, 64, 1)",
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="col-6">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">Traffic Sources</h2>

                          <Bar
                            style={{
                              minHeight: "15rem",
                              maxHeight: "15rem",
                            }}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  position: "top",
                                },
                              },
                            }}
                            data={{
                              labels: nodes.map((singleNode) => {
                                if (singleNode.type == "TrafficEntry") {
                                  return singleNode.data.name;
                                }

                                return null;
                              }),
                              datasets: [
                                {
                                  label: "Traffic",
                                  data: nodes.map((singleNode) => {
                                    if (singleNode.type == "TrafficEntry") {
                                      return singleNode.data.traffic;
                                    }

                                    return null;
                                  }),
                                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                                },
                              ],
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Top Expenses */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2 className="mb-3">Top Expenses</h2>

                          {[
                            ...[
                              {
                                expenseName: "Traffic Cost",
                                amount: trafficCost,
                              },
                              {
                                expenseName: "Merchant Fees",
                                amount: merchantFees,
                              },
                              {
                                expenseName: "Product Cost",
                                amount: productCost,
                              },
                              {
                                expenseName: "Refunds",
                                amount: refunds,
                              },
                            ],
                            ...singleProject?.scenario
                              ?.find((s) => s._id == scenarioId)
                              ?.expenses?.map((singleExpense) => {
                                return {
                                  expenseName: singleExpense.expenseName,
                                  amount: singleExpense.amount,
                                };
                              }),
                          ]
                            .sort((a, b) => b.amount - a.amount)
                            .slice(0, 3)
                            .map((data, index) => {
                              return (
                                <div
                                  className="d-flex justify-content-between"
                                  key={index}
                                >
                                  <h6>{data.expenseName}</h6>
                                  <h6>${formatValue(data.amount || 0)}</h6>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {reportsSelectedTab == "trafficReinvestment" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>Traffic Reinvestment</h2>
                        </div>
                      </div>
                    </div>

                    {/* Traffic Reinvestment Graph */}
                    {[0.1, 0.15, 0.2, 0.25].map((conversionRate) => {
                      return (
                        <div className="col-12 p-2">
                          <Line
                            options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  position: "top",
                                },
                                title: {
                                  display: true,
                                  text: `${
                                    conversionRate * 100
                                  }% of profit reinvested in traffic`,
                                },
                              },
                              elements: {
                                line: {
                                  tension: 0.2, // Set the tension for curved lines
                                },
                              },
                            }}
                            data={{
                              labels: [
                                "Month 1",
                                "Month 2",
                                "Month 3",
                                "Month 4",
                                "Month 5",
                                "Month 6",
                                "Month 7",
                                "Month 8",
                                "Month 9",
                                "Month 10",
                                "Month 11",
                                "Month 12",
                              ],
                              datasets: [
                                {
                                  label: "REVENUE",
                                  data: [
                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                  ].map((month) => {
                                    let revenuePerTraffic =
                                      totalRevenue / totalTraffic;
                                    let calc =
                                      revenuePerTraffic * temptotalTraffic;

                                    temptotalTraffic =
                                      temptotalTraffic +
                                      temptotalTraffic * conversionRate;

                                    return calc;
                                  }),
                                  borderColor: "rgb(221, 160, 221)",
                                  backgroundColor: "rgb(221, 160, 221)",
                                },
                                {
                                  label: "TOTAL PROFIT",
                                  data: [
                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                  ].map((month) => {
                                    let profitPerTraffic =
                                      (totalRevenue - totalExpense) /
                                      totalTraffic;
                                    let calc =
                                      profitPerTraffic * temptotalTraffic2;

                                    temptotalTraffic2 =
                                      temptotalTraffic2 +
                                      temptotalTraffic2 * conversionRate;

                                    return calc;
                                  }),
                                  borderColor: "rgb(184, 135, 0)",
                                  backgroundColor: "rgb(184, 135, 0)",
                                },
                              ],
                            }}
                            style={{ backgroundColor: "white" }}
                          />
                        </div>
                      );
                    })}

                    {/* Custom traffic reinvestment */}
                    <div className="col-12 p-2">
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="10%, 50%, 100%"
                        max={100}
                        onChange={(e) => {
                          if (e.target.value != " " && !isNaN(e.target.value)) {
                            setcustomConversionRate(parseFloat(e.target.value));
                          }
                        }}
                        value={customConversionRate}
                      />
                      <Line
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: `${
                                customConversionRate * 100
                              }% of profit reinvested in traffic`,
                            },
                          },
                          elements: {
                            line: {
                              tension: 0.2, // Set the tension for curved lines
                            },
                          },
                        }}
                        data={{
                          labels: [
                            "Month 1",
                            "Month 2",
                            "Month 3",
                            "Month 4",
                            "Month 5",
                            "Month 6",
                            "Month 7",
                            "Month 8",
                            "Month 9",
                            "Month 10",
                            "Month 11",
                            "Month 12",
                          ],
                          datasets: [
                            {
                              label: "REVENUE",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  if (month == 1)
                                    temptotalTraffic3 = totalTraffic;

                                  let revenuePerTraffic =
                                    totalRevenue / totalTraffic;
                                  let calc =
                                    revenuePerTraffic * temptotalTraffic3;

                                  temptotalTraffic3 =
                                    temptotalTraffic3 +
                                    temptotalTraffic3 *
                                      (customConversionRate / 100);

                                  return calc;
                                }
                              ),
                              borderColor: "rgb(221, 160, 221)",
                              backgroundColor: "rgb(221, 160, 221)",
                            },
                            {
                              label: "TOTAL PROFIT",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  if (month == 1)
                                    temptotalTraffic4 = totalTraffic;

                                  let profitPerTraffic =
                                    (totalRevenue - totalExpense) /
                                    totalTraffic;
                                  let calc =
                                    profitPerTraffic * temptotalTraffic4;

                                  temptotalTraffic4 =
                                    temptotalTraffic4 +
                                    temptotalTraffic4 *
                                      (customConversionRate / 100);

                                  return calc;
                                }
                              ),
                              borderColor: "rgb(184, 135, 0)",
                              backgroundColor: "rgb(184, 135, 0)",
                            },
                          ],
                        }}
                        style={{ backgroundColor: "white" }}
                      />
                    </div>
                  </div>
                )}

                {reportsSelectedTab == "scenarioComparison" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>Scenario Comparison</h2>
                        </div>
                      </div>
                    </div>

                    {/* scenarioComparison */}
                    {calculatingScenarioComparisonData == true ? (
                      <div className="col-12">
                        <div className="bg-white d-flex flex-column align-items-center justify-content-center p-4">
                          <div
                            className="spinner-border spinner-border-sm mb-3"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>

                          <h6>Calculating Scenario Data</h6>
                        </div>
                      </div>
                    ) : (
                      <div className="col-12">
                        <div className="bg-white">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th scope="col"></th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <th scope="col">
                                        {singleScenario.scenarioName}
                                      </th>
                                    );
                                  }
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">REVENUE (Monthly)</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>${singleScenario.totalRevenue}</td>
                                    );
                                  }
                                )}
                              </tr>

                              <tr>
                                <th scope="row">PROFIT (Monthly)</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>${singleScenario.totalProfit}</td>
                                    );
                                  }
                                )}
                              </tr>
                              <tr>
                                <th scope="row">REVENUE (Yearly)</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>
                                        ${singleScenario.totalRevenue * 12}
                                      </td>
                                    );
                                  }
                                )}
                              </tr>
                              <tr>
                                <th scope="row">PROFIT (Yearly)</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>
                                        ${singleScenario.totalProfit * 12}
                                      </td>
                                    );
                                  }
                                )}
                              </tr>

                              <tr>
                                <th scope="row">AOV</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>
                                        ${formatValue(singleScenario.aov || 0)}
                                      </td>
                                    );
                                  }
                                )}
                              </tr>

                              <tr>
                                <th scope="row">ROAS</th>
                                {scenarioComparisonData.map(
                                  (singleScenario) => {
                                    return (
                                      <td>
                                        {formatValue(singleScenario.roas || 0)}
                                      </td>
                                    );
                                  }
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {reportsSelectedTab == "dreamProfitGoal" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>Dream Profit Goal</h2>
                        </div>
                      </div>
                    </div>

                    {/* Top Expenses */}
                    <div className="col-12">
                      <div className="bg-white">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col"></th>
                              <th scope="col">DAY</th>
                              <th scope="col">WEEK</th>
                              <th scope="col">MONTH</th>
                              <th scope="col">YEAR</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">REVENUE</th>
                              <td>${formatValue((totalRevenue / 30) * 1)}</td>
                              <td>${formatValue((totalRevenue / 30) * 7)}</td>
                              <td>${formatValue((totalRevenue / 30) * 30)}</td>
                              <td>${formatValue((totalRevenue / 30) * 365)}</td>
                            </tr>

                            <tr>
                              <th scope="row">PROFIT</th>
                              <td>
                                $
                                {formatValue(
                                  ((totalRevenue - totalExpense) / 30) * 1
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalRevenue - totalExpense) / 30) * 7
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalRevenue - totalExpense) / 30) * 30
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalRevenue - totalExpense) / 30) * 365
                                )}
                              </td>
                            </tr>

                            <tr>
                              <th scope="row">TRAFFIC VOLUME</th>
                              <td>{Math.round((totalTraffic / 30) * 1)}</td>
                              <td>{Math.round((totalTraffic / 30) * 7)}</td>
                              <td>{Math.round((totalTraffic / 30) * 30)}</td>
                              <td>{Math.round((totalTraffic / 30) * 365)}</td>
                            </tr>

                            <tr>
                              <th scope="row">TRAFFIC COST</th>
                              <td>
                                $
                                {formatValue(
                                  ((totalTraffic * averageCPC) / 30) * 1
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalTraffic * averageCPC) / 30) * 7
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalTraffic * averageCPC) / 30) * 30
                                )}
                              </td>
                              <td>
                                $
                                {formatValue(
                                  ((totalTraffic * averageCPC) / 30) * 365
                                )}
                              </td>
                            </tr>

                            <tr>
                              <th scope="row">LEADS</th>
                              <td>{Math.round((totalLeads / 30) * 1)}</td>
                              <td>{Math.round((totalLeads / 30) * 7)}</td>
                              <td>{Math.round((totalLeads / 30) * 30)}</td>
                              <td>{Math.round((totalLeads / 30) * 365)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {reportsSelectedTab == "listView" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>List View</h2>
                        </div>
                      </div>
                    </div>

                    {/* TRAFFIC SOURCES */}
                    <div className="col-12">
                      <div className="bg-white">
                        <div className="p-3">
                          <h6
                            style={{ fontWeight: "700", marginBottom: "0px" }}
                          >
                            TRAFFIC SOURCES
                          </h6>
                        </div>

                        {nodes
                          .filter((singleNode) => {
                            return singleNode.type == "TrafficEntry";
                          })
                          .map((singleNode, index) => {
                            return (
                              <table
                                className="table table-bordered"
                                key={index}
                              >
                                <thead>
                                  <tr>
                                    <th scope="col">Source</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Traffic</th>
                                    <th scope="col">CPC</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {singleNode?.data?.trafficSources?.map(
                                    (singleTrafficSource, i) => {
                                      return (
                                        <tr key={`row_${i}`}>
                                          <td>Traffic Entry {index + 1}</td>
                                          <td>
                                            {singleTrafficSource.trafficSource}
                                          </td>
                                          <td>{singleTrafficSource.value}</td>
                                          <td>${singleNode.data.cpc}</td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            );
                          })}
                      </div>
                    </div>

                    {/* FUNNEL */}
                    <div className="col-12">
                      <div className="bg-white">
                        <div className="p-3">
                          <h6
                            style={{ fontWeight: "700", marginBottom: "0px" }}
                          >
                            FUNNEL
                          </h6>
                        </div>

                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Traffic</th>
                              <th scope="col">Conversion Rate</th>
                              <th scope="col">Converted Traffic</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nodes
                              .filter((singleNode) => {
                                return singleNode.type != "TrafficEntry";
                              })
                              .map((singleNode, index) => {
                                return (
                                  <tr key={index}>
                                    <th scope="row">{singleNode.data.name}</th>
                                    <td>{singleNode.data.traffic}</td>
                                    <td>{singleNode.data.conversionRate}</td>
                                    <td>{singleNode.data.convertedTraffic}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* EXPENSES */}
                    <div className="col-12">
                      <div className="bg-white">
                        <div className="p-3">
                          <h6
                            style={{ fontWeight: "700", marginBottom: "0px" }}
                          >
                            EXPENSES
                          </h6>
                        </div>

                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Billing Frequency</th>
                              <th scope="col">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ...[
                                {
                                  expenseName: "Traffic Cost",
                                  amount: trafficCost,
                                },
                                {
                                  expenseName: "Merchant Fees",
                                  amount: merchantFees,
                                },
                                {
                                  expenseName: "Product Cost",
                                  amount: productCost,
                                },
                                {
                                  expenseName: "Refunds",
                                  amount: refunds,
                                },
                              ],
                              ...singleProject?.scenario
                                ?.find((s) => s._id == scenarioId)
                                ?.expenses?.map((singleExpense) => {
                                  return {
                                    expenseName: singleExpense.expenseName,
                                    billingFrequency:
                                      singleExpense.billingFrequency,
                                    amount: singleExpense.amount,
                                  };
                                }),
                            ]
                              .sort((a, b) => b.amount - a.amount)
                              .map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <th scope="row">{data.expenseName}</th>
                                    <th>
                                      {data.billingFrequency == 1
                                        ? "1 Day"
                                        : `${data.billingFrequency || 30} Days`}
                                    </th>
                                    <td>${formatValue(data.amount || 0)}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {reportsSelectedTab == "mrrCost" && (
                  <div className="row g-3">
                    {/* Heading */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body bg-white">
                          <h2>MRR FORECAST</h2>
                        </div>
                      </div>
                    </div>

                    {/* MRR Graph */}
                    <div className="col-12 p-2">
                      <Line
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "MRR Line Chart",
                            },
                          },
                          elements: {
                            line: {
                              tension: 0.2, // Set the tension for curved lines
                            },
                          },
                        }}
                        data={{
                          labels: [
                            "Month 1",
                            "Month 2",
                            "Month 3",
                            "Month 4",
                            "Month 5",
                            "Month 6",
                            "Month 7",
                            "Month 8",
                            "Month 9",
                            "Month 10",
                            "Month 11",
                            "Month 12",
                          ],
                          datasets: [
                            {
                              label: "Traffic Cost",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  return (
                                    nodes.reduce((accumulator, singleNode) => {
                                      if (singleNode.type == "TrafficEntry") {
                                        return (
                                          accumulator + singleNode.data.traffic
                                        );
                                      }

                                      return accumulator;
                                    }, 0) * month
                                  );
                                }
                              ),
                              borderColor: "rgb(255, 99, 132)",
                              backgroundColor: "rgb(255, 99, 132)",
                            },
                            {
                              label: "Expenses",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  return totalExpense * month;
                                }
                              ),
                              borderColor: "rgb(173, 216, 230)",
                              backgroundColor: "rgb(173, 216, 230)",
                            },
                            {
                              label: "ACTIVE SUBSCRIPTIONS",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  return (
                                    nodes.reduce((accumulator, singleNode) => {
                                      if (singleNode.type == "OrderFormPage") {
                                        return (
                                          accumulator +
                                          (singleNode?.data?.convertedTraffic ||
                                            0)
                                        );
                                      }

                                      return accumulator;
                                    }, 0) * month
                                  );
                                }
                              ),
                              borderColor: "rgb(152, 251, 152)",
                              backgroundColor: "rgb(152, 251, 152)",
                            },
                            {
                              label: "CUMULATIVE REVENUE",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  return totalRevenue * month;
                                }
                              ),
                              borderColor: "rgb(221, 160, 221)",
                              backgroundColor: "rgb(221, 160, 221)",
                            },
                            {
                              label: "TOTAL PROFIT",
                              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (month) => {
                                  return (totalRevenue - totalExpense) * month;
                                }
                              ),
                              borderColor: "rgb(184, 135, 0)",
                              backgroundColor: "rgb(184, 135, 0)",
                            },
                          ],
                        }}
                        style={{ backgroundColor: "white" }}
                      />
                    </div>

                    {/* TRAFFIC COST */}
                    <div className="col-2">
                      <div className="fw-bold bg-white p-3 rounded d-flex flex-column align-items-center justify-content-center">
                        <p className="mb-0">TRAFFIC COST</p>
                        <p className="mb-0">
                          $
                          {nodes.reduce((accumulator, singleNode) => {
                            if (singleNode.type == "TrafficEntry") {
                              return accumulator + singleNode.data.traffic;
                            }

                            return accumulator;
                          }, 0) * 12}
                        </p>
                      </div>
                    </div>

                    {/* BUSINESS EXPENSES */}
                    <div className="col-2">
                      <div className="fw-bold bg-white p-3 rounded d-flex flex-column align-items-center justify-content-center">
                        <p className="mb-0">EXPENSES</p>
                        <p className="mb-0">
                          ${formatValue(totalExpense * 12)}
                        </p>
                      </div>
                    </div>

                    {/* ACTIVE SUBSCRIPTIONS */}
                    <div className="col-3">
                      <div className="fw-bold bg-white p-3 rounded d-flex flex-column align-items-center justify-content-center">
                        <p className="mb-0">ACTIVE SUBSCRIPTIONS</p>
                        <p className="mb-0">
                          {nodes.reduce((accumulator, singleNode) => {
                            if (singleNode.type == "OrderFormPage") {
                              return (
                                accumulator +
                                (singleNode?.data?.convertedTraffic || 0)
                              );
                            }

                            return accumulator;
                          }, 0) * 12}
                        </p>
                      </div>
                    </div>

                    {/* CUMULATIVE REVENUE */}
                    <div className="col-3">
                      <div className="fw-bold bg-white p-3 rounded d-flex flex-column align-items-center justify-content-center">
                        <p className="mb-0">CUMULATIVE REVENUE</p>
                        <p className="mb-0">
                          $
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                            .map((month) => totalRevenue * month)
                            .reduce((accumulator, currentValue) => {
                              return accumulator + currentValue;
                            })}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL PROFIT */}
                    <div className="col-2">
                      <div className="fw-bold bg-white p-3 rounded d-flex flex-column align-items-center justify-content-center">
                        <p className="mb-0">TOTAL PROFIT</p>
                        <p className="mb-0">
                          {(totalRevenue - totalExpense) * 12}
                        </p>
                      </div>
                    </div>

                    {/* MRR Table */}
                    <div className="col-12">
                      <div className="bg-white">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Month</th>
                              <th scope="col">product</th>
                              <th scope="col">Price</th>
                              <th scope="col">Subscription</th>
                              <th scope="col">Product MRR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                              (monthNumber) => {
                                return singleProject?.scenario
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
                                  .map((singleProduct, index) => {
                                    return (
                                      <tr key={index}>
                                        <th scope="row">{monthNumber}</th>
                                        <td>{singleProduct.name}</td>
                                        <td>${singleProduct.price}</td>
                                        <td>
                                          {nodes
                                            .filter((singleNode) => {
                                              return (
                                                singleNode.type ==
                                                  "OrderFormPage" &&
                                                singleNode.data?.product?._id?.toString() ==
                                                  singleProduct._id?.toString()
                                              );
                                            })
                                            .reduce(
                                              (accumulator, singleNode) => {
                                                if (
                                                  singleNode.type ==
                                                  "OrderFormPage"
                                                ) {
                                                  return (
                                                    accumulator +
                                                    (singleNode?.data
                                                      ?.convertedTraffic || 0)
                                                  );
                                                }

                                                return accumulator;
                                              },
                                              0
                                            ) * monthNumber}
                                        </td>
                                        <td>
                                          $
                                          {singleProduct.price *
                                            nodes
                                              .filter((singleNode) => {
                                                return (
                                                  singleNode.type ==
                                                    "OrderFormPage" &&
                                                  singleNode.data?.product?._id?.toString() ==
                                                    singleProduct._id?.toString()
                                                );
                                              })
                                              .reduce(
                                                (accumulator, singleNode) => {
                                                  if (
                                                    singleNode.type ==
                                                    "OrderFormPage"
                                                  ) {
                                                    return (
                                                      accumulator +
                                                      (singleNode?.data
                                                        ?.convertedTraffic || 0)
                                                    );
                                                  }

                                                  return accumulator;
                                                },
                                                0
                                              ) *
                                            monthNumber}
                                        </td>
                                      </tr>
                                    );
                                  });
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
