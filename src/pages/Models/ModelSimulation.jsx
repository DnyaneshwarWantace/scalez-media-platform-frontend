import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { selectsingleModelInfo } from "../../redux/slices/modelSlice";

function ModelSimulation() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const modelId = params.modelId;
  const singleModelInfo = useSelector(selectsingleModelInfo);

  const { DCFResponse, values } = location.state || {};
  const currencyValue = localStorage.getItem("currency", "");

  useEffect(() => {
    if (!DCFResponse || !values) {
      navigate(`/models/${modelId}`);
    }
  }, [DCFResponse, values, navigate, modelId]);

  if (!DCFResponse || !values) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/models/${modelId}`)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Model
            </Button>
            <h1 className="text-3xl font-bold mb-1">{singleModelInfo?.name}</h1>
            <p className="text-sm text-gray-500">Simulation Results</p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Customer Acquisition Cost</p>
              <p className="text-xl font-semibold">
                {DCFResponse
                  ? `${
                      currencyValue === "USD - United States dollar"
                        ? "$"
                        : currencyValue === "GBP - Pound sterling"
                        ? "£"
                        : "₹"
                    }${parseFloat(
                      DCFResponse.customerAcquisitionCost?.toFixed(2)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Lifetime Value per Customer</p>
              <p className="text-xl font-semibold">
                {DCFResponse
                  ? `${
                      currencyValue === "USD - United States dollar"
                        ? "$"
                        : currencyValue === "GBP - Pound sterling"
                        ? "£"
                        : "₹"
                    }${parseFloat(
                      DCFResponse.lifeTimeValuePerCust?.toFixed(2)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit per Customer before Ads</p>
              <p className="text-xl font-semibold">
                {DCFResponse
                  ? `${
                      currencyValue === "USD - United States dollar"
                        ? "$"
                        : currencyValue === "GBP - Pound sterling"
                        ? "£"
                        : "₹"
                    }${parseFloat(
                      DCFResponse.grossProfPerCustBefAds?.toFixed(2)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Enterprise Value</p>
              <p className="text-xl font-semibold">
                {DCFResponse
                  ? `${
                      currencyValue === "USD - United States dollar"
                        ? "$"
                        : currencyValue === "GBP - Pound sterling"
                        ? "£"
                        : "₹"
                    }${parseFloat(
                      DCFResponse.equityValueTotal?.toFixed(2)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Cash Below $0 Month</p>
              <p className="text-xl font-semibold">
                {DCFResponse && DCFResponse?.cashBelowZeroMonth}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Time for Gross Profitability</p>
              <p className="text-xl font-semibold">
                {DCFResponse && DCFResponse?.timeForGrossProfitablity}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Cash Payback Period</p>
              <p className="text-xl font-semibold">
                {DCFResponse && DCFResponse?.finalCashPayBackPeriodVal}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Cash ROI compared to Day 1</p>
              <p className="text-xl font-semibold">
                {DCFResponse &&
                  parseFloat(
                    DCFResponse.finalCashROICompToDay?.toFixed(2)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue, Earnings, Cash v/s Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Revenue, Earnings, Cash v/s Time
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    textStyle: { color: '#374151' },
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
                  },
                  legend: {
                    data: ['Total Revenue (including refunds)', 'Earnings', 'Cash'],
                    bottom: 10,
                    textStyle: { color: '#6b7280' }
                  },
                  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(Array(+values?.projectionPeriod)).map((_, i) => `Month ${i + 1}`),
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                  },
                  series: [
                    {
                      name: 'Total Revenue (including refunds)',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.totalGrossRevValRes,
                      lineStyle: { color: '#10b981', width: 3 },
                      itemStyle: { color: '#10b981' },
                      symbol: 'circle',
                      symbolSize: 6
                    },
                    {
                      name: 'Earnings',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.earBefIntTaxArr,
                      lineStyle: { color: '#f97316', width: 3 },
                      itemStyle: { color: '#f97316' },
                      symbol: 'circle',
                      symbolSize: 6
                    },
                    {
                      name: 'Cash',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.cashInBnkArr,
                      lineStyle: { color: '#3b82f6', width: 3 },
                      itemStyle: { color: '#3b82f6' },
                      symbol: 'circle',
                      symbolSize: 6
                    }
                  ]
                }}
                style={{ height: '350px' }}
              />
            </CardContent>
          </Card>

          {/* Enterprise Value vs time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Enterprise Value v/s Time
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    textStyle: { color: '#374151' },
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
                  },
                  legend: {
                    data: ['Enterprise Value'],
                    bottom: 10,
                    textStyle: { color: '#6b7280' }
                  },
                  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(Array(+values?.projectionPeriod)).map((_, i) => `Month ${i + 1}`),
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                  },
                  series: [
                    {
                      name: 'Enterprise Value',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.equityValArr,
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                          ]
                        }
                      },
                      lineStyle: { color: '#10b981', width: 3 },
                      itemStyle: { color: '#10b981' },
                      symbol: 'circle',
                      symbolSize: 6
                    }
                  ]
                }}
                style={{ height: '350px' }}
              />
            </CardContent>
          </Card>

          {/* Total Customers v/s Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Total Customers v/s Time
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    textStyle: { color: '#374151' },
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
                  },
                  legend: {
                    data: ['Total Customers'],
                    bottom: 10,
                    textStyle: { color: '#6b7280' }
                  },
                  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(Array(+values?.projectionPeriod)).map((_, i) => `Month ${i + 1}`),
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                  },
                  series: [
                    {
                      name: 'Total Customers',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.totalCustomerBaseVal,
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                          ]
                        }
                      },
                      lineStyle: { color: '#10b981', width: 3 },
                      itemStyle: { color: '#10b981' },
                      symbol: 'circle',
                      symbolSize: 6
                    }
                  ]
                }}
                style={{ height: '350px' }}
              />
            </CardContent>
          </Card>

          {/* Cash ROI v/s Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Cash ROI v/s Time
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    textStyle: { color: '#374151' },
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
                  },
                  legend: {
                    data: ['Cash ROI'],
                    bottom: 10,
                    textStyle: { color: '#6b7280' }
                  },
                  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(Array(+values?.projectionPeriod)).map((_, i) => `Month ${i + 1}`),
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                  },
                  series: [
                    {
                      name: 'Cash ROI',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.cashROIformattedArr,
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                          ]
                        }
                      },
                      lineStyle: { color: '#10b981', width: 3 },
                      itemStyle: { color: '#10b981' },
                      symbol: 'circle',
                      symbolSize: 6
                    }
                  ]
                }}
                style={{ height: '350px' }}
              />
            </CardContent>
          </Card>

          {/* LTV, GPCB v/s Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                LTV, Gross Profit per Customer before Ads v/s Time
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    textStyle: { color: '#374151' },
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6b7280' } }
                  },
                  legend: {
                    data: ['Lifetime Value per Customer', 'Gross Profit per Customer before Ads'],
                    bottom: 10,
                    textStyle: { color: '#6b7280' }
                  },
                  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(Array(+values?.projectionPeriod)).map((_, i) => `Month ${i + 1}`),
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisLabel: { color: '#6b7280' },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                  },
                  series: [
                    {
                      name: 'Lifetime Value per Customer',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.ltvArray,
                      lineStyle: { color: '#10b981', width: 3 },
                      itemStyle: { color: '#10b981' },
                      symbol: 'circle',
                      symbolSize: 6
                    },
                    {
                      name: 'Gross Profit per Customer before Ads',
                      type: 'line',
                      smooth: true,
                      data: DCFResponse.gpcArray,
                      lineStyle: { color: '#3b82f6', width: 3 },
                      itemStyle: { color: '#3b82f6' },
                      symbol: 'circle',
                      symbolSize: 6
                    }
                  ]
                }}
                style={{ height: '350px' }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Input Summary - Collapsible Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Input Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Starting State */}
              <div>
                <h3 className="text-sm font-medium mb-2">Starting State</h3>
                <hr className="my-1.5 border-gray-200" />
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cash in Bank</span>
                    <span className="text-sm font-medium">{values?.cashInBank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Initial Number of Customers</span>
                    <span className="text-sm font-medium">{values?.numberOfCustomers}</span>
                  </div>
                </div>
              </div>

              {/* Financial Data */}
              <div>
                <h3 className="text-sm font-medium mb-2">Financial Data</h3>
                <hr className="my-1.5 border-gray-200" />
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Order Value</span>
                    <span className="text-sm font-medium">{values?.avgOrderValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Realisation Rate</span>
                    <span className="text-sm font-medium">{values?.realisationRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Units/order</span>
                    <span className="text-sm font-medium">{values?.unitsOrder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blended COGS %</span>
                    <span className="text-sm font-medium">{values?.blendedCogs}</span>
                  </div>
                </div>
              </div>

              {/* Add more sections as needed */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ModelSimulation;
