export default {
  getUpdatedNodes: async (
    nodes,
    parentId,
    singleEdgeData,
    reverseTraverse,
    targetNode
  ) => {
    let parentNode = parentId
      ? nodes.filter((singleNode) => singleNode.id === parentId)[0]
      : null;
    console.log(`Graph traverse: ${targetNode?.id} ${targetNode?.data?.name}`);

    let calculatedNodeTraffic = 0;
    targetNode?.incomingEdges
      ?.filter((singleEdge) => singleEdge.source != parentId)
      ?.forEach((singleEdge) => {
        let tf = reverseTraverse(singleEdge.source, nodes, reverseTraverse);
        calculatedNodeTraffic += tf;
      });

    let trafficFromSameBranch = 0;
    if (parentNode) {
      trafficFromSameBranch =
        parentNode.data.traffic *
        ((singleEdgeData?.sourceHandle == "no_handle"
          ? 100 - parentNode.data.conversionRate
          : parentNode.data.conversionRate) /
          100);
    }

    let totalTraffic =
      (targetNode.type == "TrafficEntry" ? targetNode.data.traffic : 0) +
      calculatedNodeTraffic +
      trafficFromSameBranch;
    console.log(`Calculated node traffic: ${totalTraffic}`);

    let updatedNodes = nodes.map((singleNode) => {
      if (singleNode.id === targetNode.id) {
        const convertedTraffic =
          parseFloat(totalTraffic) *
          parseFloat(targetNode.data.conversionRate / 100 || 1);

        return {
          ...singleNode,
          data: {
            ...singleNode.data,
            traffic: totalTraffic,
            convertedTraffic: parseInt(convertedTraffic),
          },
        };
      } else {
        return singleNode;
      }
    });

    return updatedNodes;
  },

  reverseTraverse: (nodeId, nodes, reverseTraverse) => {
    const targetNode = nodes.filter(
      (singleNode) => singleNode.id === nodeId
    )[0];

    let totalIncomingTraffic = 0;
    targetNode?.incomingEdges.forEach((singleEdge) => {
      let nodeIncomingTraffic = reverseTraverse(
        singleEdge.source,
        nodes,
        reverseTraverse
      );
      totalIncomingTraffic += nodeIncomingTraffic;
    });

    console.log(`Reverse traverse: ${targetNode.id}`);

    return (
      (targetNode.data.traffic + totalIncomingTraffic) *
      (targetNode.data.conversionRate / 100)
    );
  },

  getTotalTraffic: async (nodes) => {
    return nodes?.reduce((accumulator, singleNode) => {
      if (singleNode.type == "TrafficEntry") {
        return accumulator + singleNode.data.traffic;
      }
      return accumulator;
    }, 0);
  },

  getTotalLeads: async (nodes) => {
    return nodes?.reduce((accumulator, singleNode) => {
      if (singleNode.type == "OptInNode") {
        return accumulator + singleNode.data.traffic;
      }
      return accumulator;
    }, 0);
  },

  getAverageCPC: async (nodes) => {
    return (
      nodes?.reduce((accumulator, singleNode) => {
        if (singleNode.type == "TrafficEntry") {
          return accumulator + singleNode.data.cpc;
        }
        return accumulator;
      }, 0) /
      nodes?.filter((singleNode) => singleNode.type == "TrafficEntry").length
    );
  },

  getTotalRevenue: (singleProject, scenarioId, updatedNodes) => {
    return singleProject?.scenario
      ?.find((s) => s._id === scenarioId)
      ?.products?.reduce((accumulator, singleProduct) => {
        return (
          accumulator +
          singleProduct.price *
            updatedNodes
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
  },

  getAov: (updatedNodes, tempTotalRevenu) => {
    let totalConvertedTraffic2 = updatedNodes?.reduce(
      (accumulator, singleNode) => {
        if (singleNode.type == "OrderFormPage") {
          return accumulator + (singleNode?.data?.convertedTraffic || 0);
        }

        return accumulator;
      },
      0
    );

    return tempTotalRevenu / totalConvertedTraffic2;
  },

  getTrafficCost: (updatedNodes) => {
    let tempTrafficCost = updatedNodes?.reduce((accumulator, singleNode) => {
      if (singleNode.type == "TrafficEntry") {
        return (
          accumulator +
          (singleNode.data.traffic || 0) * (singleNode.data.cpc || 0)
        );
      }

      return accumulator;
    }, 0);

    return tempTrafficCost;
  },

  getProductCost: (updatedNodes) => {
    return updatedNodes?.reduce((accumulator, singleNode) => {
      if (singleNode.type == "OrderFormPage") {
        return (
          accumulator +
          (singleNode?.data?.product?.cost || 0) *
            (singleNode?.data?.convertedTraffic || 0)
        );
      }

      return accumulator;
    }, 0);
  },

  getRefund: (updatedNodes) => {
    return updatedNodes?.reduce((accumulator, singleNode) => {
      if (singleNode.type == "OrderFormPage") {
        return (
          accumulator +
          (singleNode?.data?.product?.price || 0) *
            (singleNode?.data?.convertedTraffic || 0) *
            ((singleNode?.data?.product?.refundRate || 0) / 100)
        );
      }

      return accumulator;
    }, 0);
  },

  getMerchantFees: (updatedNodes, tempTotalRevenu, singleProject) => {
    let totalConvertedTraffic = updatedNodes?.reduce(
      (accumulator, singleNode) => {
        if (singleNode.type == "OrderFormPage") {
          return accumulator + (singleNode?.data?.convertedTraffic || 0);
        }

        return accumulator;
      },
      0
    );

    let totalprocessingRatePercent =
      tempTotalRevenu * (singleProject?.processingRatePercent / 100);
    let totalperTransactionFee =
      totalConvertedTraffic * singleProject?.perTransactionFee;

    let tempMerchantFees = totalprocessingRatePercent + totalperTransactionFee;

    return tempMerchantFees;
  },

  getOtherExpenses: (singleProject, scenarioId) => {
    return singleProject?.scenario
      ?.find((s) => s._id == scenarioId)
      ?.expenses?.reduce((acc, singleExpense) => {
        return acc + singleExpense.amount;
      }, 0);
  },

  getConvertedTraffic: (singleProject, scenarioId, updatedNodes) => {
    return singleProject?.scenario
      ?.find((s) => s._id === scenarioId)
      ?.products?.reduce((accumulator, singleProduct) => {
        return (
          accumulator +
          updatedNodes
            .filter((singleNode) => {
              return (
                singleNode.type == "OrderFormPage" &&
                singleNode.data?.product?._id?.toString() ==
                  singleProduct._id?.toString()
              );
            })
            .reduce((accumulator, singleNode) => {
              if (singleNode.type == "OrderFormPage") {
                return accumulator + (singleNode?.data?.convertedTraffic || 0);
              }

              return accumulator;
            }, 0)
        );
      }, 0);
  },
};
