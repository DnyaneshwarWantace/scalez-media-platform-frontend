import React, { useEffect } from "react";

function calculateTrafficPerNode(graph) {
  const nodeTraffic = {};

  function dfs(node) {
    if (!(node in graph)) {
      return 0;
    }

    let totalTraffic = 0;

    if (node === "input_traffic") {
      totalTraffic = graph[node].traffic;
      nodeTraffic[node] = totalTraffic;
    } else {
      for (const neighbor of graph[node].neighbors) {
        totalTraffic += dfs(neighbor);
      }

      const conversionRate = graph[node].conversionRate || 1.0;
      nodeTraffic[node] = totalTraffic * conversionRate;
    }

    return totalTraffic;
  }

  dfs("customer_converted"); // Start DFS from 'customer_converted'

  const inputTraffic = graph["input_traffic"].traffic;
  if (inputTraffic === 0) {
    return { nodeTraffic, conversionRate: 0.0 };
  }

  const customerConvertedTraffic = nodeTraffic["customer_converted"];
  const conversionRate = customerConvertedTraffic / inputTraffic;
  return { nodeTraffic, conversionRate };
}

// Sample graph representation (object)
const graph = {
  input_traffic: { traffic: 1000 },
  forms: { neighbors: ["customer_converted"], conversionRate: 0.5 },
  customer_converted: { neighbors: [], conversionRate: 0.3 },
};

function GraphTest() {
  useEffect(() => {
    const { nodeTraffic, conversionRate } = calculateTrafficPerNode(graph);
    console.log("Node traffic:", nodeTraffic);
    console.log("Conversion rate:", conversionRate);
  }, []);

  return <div>GraphTest</div>;
}

export default GraphTest;
