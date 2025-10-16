import React, { PureComponent } from "react";
import { Tabs, Button, Collapse, Checkbox, Input, DatePicker, Form, InputNumber } from "antd";
import "./style.css";
import { BellOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
// import ModelsInput from "../components/modelsInput";
// import ModelsOutput from "../components/modelsOutput";
import logo from "../images/scalezlogo.png";
import moment from "moment";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import FormItem from "antd/es/form/FormItem";
const data = [
  {
    name: "Month 1",
    uv: 4000,
    pv: 2400,
    amt: 2400,
    amount: 1000000,
  },
  {
    name: "Month 2",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Month 3",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Month 4",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Month 5",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Month 6",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Month 7",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Month 8",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Month 9",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Month 10",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Month 11",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Month 12",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const { TabPane } = Tabs;
const { Panel } = Collapse;
const dateFormat = "YYYY-MM-DD";
const opVals = [];

export default class scalezModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      cashInBank: 0,
      numberOfCustomers: 0,
      avgOrderValue: 0,
      realisationRate: 0,
      unitsOrder: 0,
      blendedCogs: 0,
      outboundSalary: 0,
      numberOfContactsPerSdr: 0,
      numberOfSDR: 0,
      contactToLeadConversionRate: 0,
      leadToCustomerConversionRate: 0,
      monthlyAdSpend: 0,
      cpm: 0,
      clickThroughRate: 0,
      landingPageView: 0,
      leadGenerationRate: 0,
      conversionRate: 0,
      organicViewsPerMonth: 0,
      organicViewsLeadToConversionRate: 0,
      organicleadToCustomerConversionRate: 0,
      returningCustomerRate: 0,
      timeToReturn: 0,
      costToMarketReturn: 0,
      referresOutOfCustomers: 0,
      inviteesPerReferral: 0,
      inviteesConversionRate: 0,
      refundRate: 0,
      fixedLossPerRefund: 0,
      paymentProcessorFees: 0,
      merchantAccountFees: 0,
      fixedCostPerMonth: 0,
      fixedCostIncreasePerHundredCustomers: 0,
      upFrontInvestmentCost: 0,
      debt: 0,
      debtInterestRate: 0,
      taxRate: 0,
      numberOfShares: 0,
      projectionPeriod: 0,
      discountRate: 0,
      perpetualGrowthRate: 0,
      inbound: false,
      outbound: false,
      organic: false,
      // output variables
      customerAcquisitionCost: 0,
      lifetimeValuePerCustomer: 0,
      euityValueData: 0,
      realisedRevenue: 0,
      cogsPerOrder: 0,
      sdrSalaries: 0,
      contacts: 0,
      outboundLeads: 0,
      outboundCustomers: 0,
      outboundRevenue: 0,
      outboundGrossProfit: 0,
      roi: 0,
      advertisingSpend: 0,
      reach: 0,
      linkClicks: 0,
      pageViews: 0,
      inboundLeads: 0,
      inboundCustomers: 0,
      inboundRevenue: 0,
      roas: 0,
      inboundGrossProfit: 0,
      inboundROI: 0,
      organicLeads: 0,
      organicCustomers: 0,
      organicRevenue: 0,
      organicGrossProfit: 0,
      marketingSpend: 0,
      marketingCustomersAcquired: 0,
      marketingRevenue: 0,
      marketingGrossProfit: 0,
      marketingROI: 0,
      totalCustomerBase: 0,
      returningCustomers: 0,
      monthlyReturningRevenue: 0,
      refundCostLoss: 0,
      totalRefundOrders: 0,
      totalRefundLoss: 0,
      totalReferrers: 0,
      totalInvitees: 0,
      referralCustomers: 0,
      referralRevenue: 0,
      totalGrossRevenue: 0,
      totalGrossProfitBeforeAdspend: 0,
      grossMarginProfitBeforeAdspend: 0,
      totalGrossProfitAfterAdspend: 0,
      grossMarginProfitAfterAdspend: 0,
      grossProfitBeforeAdspendPerCustPerMonth: 0,
      grossProfitAfterAdspendPerCustPerMonth: 0,
      paymentProcessorFeesPerOrder: 0,
      merchantAccFeesPerOrder: 0,
      totalPaymentProcessorFees: 0,
      totalmerchantAccFees: 0,
      fixedCostForPerHundredCustomers: 0,
      totalFixedCostPerMonth: 0,
      totalFixedCosts: 0,
      upFrontInvestmentCosts: 0,
      earningBeforeIntAndTax: 0,
      cashTaxes: 0,
      debtInterestPayable: 0,
      unleveredFreeCashFlow: 0,
      enterPriseValue: 0,
      plusCash: 0,
      lessDebt: 0,
      equityValue: 0,
      equityValueShare: 0,
      earningAfterIntAndTax: 0,
      avgTerminalValue: 0,
      cashROICompToDay: 0,
      cashPaybackPeriod: 0,
      grossProfPerCustBefAds: 0,
      timeForGrossProfitablity: 0,
      overAllCashInBank: 0,
      outputCostToMarketReturn: 0,
      cashBelowZeroMonth: 0,
      finalCashPayBackPeriodVal: 0,
      finalCashROICompToDay: 0,
      onCheckOutbound: true,
    };
  }

  componentDidUpdate() {
    this.getmodelsOutputFieldsData();
  }

  // Main tabs - Dashboard,Project,Models

  render() {
    return (
      <div className="models-main-wrapper">
        <div className="scalez-logo">
          <img src={logo} alt="" />
        </div>
        <Tabs defaultActiveKey="3" onChange={this.onChange} className="models-all-tabs-section" type="card">
          <TabPane className="tabpane-section" tab="Dashboard" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane className="tabpane-section" tab="Project" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane className="tabpane-section" tab="Models" key="3">
            <div className="models-tab-section">
              <div className="all-models-text">All Models</div>
              <div style={{ display: "flex", marginLeft: "auto" }}>
                <div>
                  <Button className="generate-random-val-btn" onClick={() => this.onGenerateRandomValues()}>
                    Generate Random Values
                  </Button>
                </div>
                <div>
                  <Button className="calculate-model-btn" onClick={() => this.onCalculateModelValues()}>
                    Calculate Model
                  </Button>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="model-trial-text">Trial</div>
              <EditOutlined style={{ fontSize: "20px" }} />
            </div>
            <div>
              <Tabs onChange={this.onChange} className="models-input-output-tabs-section" type="card">
                <TabPane className="models-input-output-tabpane-section" tab="Input" key="1">
                  <div>{this.getmodelsInputFields()}</div>
                </TabPane>
                <TabPane className="models-input-output-tabpane-section" tab="Output" key="2">
                  <div>{this.getmodelsOutputFieldsData()}</div>
                </TabPane>
              </Tabs>
            </div>
          </TabPane>
        </Tabs>
        <div className="models-bell-and-user-icon">
          <div style={{ marginRight: "25px" }}>
            <BellOutlined />
          </div>
          <div>
            <UserOutlined />
          </div>
        </div>
      </div>
    );
  }

  // Input tab

  getmodelsInputFields() {
    let date = new Date();

    return (
      <div className="models-input-main-wrapper">
        <Collapse className="models-input-collapsible-section" defaultActiveKey={["1"]} onChange={this.onChangeCollapse}>
          <Panel className="models-input-collapsible-panel" header="Starting State" key="1">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Starting Date</div>
                <div>
                  <DatePicker
                    defaultValue={moment(date, dateFormat)}
                    onChange={(value) => this.onChangeStartDate(value)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Cash In Bank</div>
                <div>
                  <Input
                    value={this.state.cashInBank}
                    onChange={(e) => this.onChangeCashInBank(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Initial Number of Customers</div>
                <div>
                  <Input
                    value={this.state.numberOfCustomers}
                    onChange={(e) => this.onChangenumberOfCustomers(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          <Panel className="models-input-collapsible-panel" header="Financial Data" key="2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Average Order Value</div>
                <div>
                  <Input
                    value={this.state.avgOrderValue}
                    onChange={(e) => this.onChangeavgOrderValue(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Realisation Rate</div>
                <div>
                  <Input
                    value={this.state.realisationRate}
                    onChange={(e) => this.onChangeRealisationRate(e)}
                    parser={(value) => value.replace("%", "")}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Units/Order</div>
                <div>
                  <Input
                    value={this.state.unitsOrder}
                    onChange={(e) => this.onChangeUnitsOrder(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Blended COGS%</div>
                <div>
                  <Input
                    value={this.state.blendedCogs}
                    onChange={(e) => this.onChangeBlendedCogs(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div"></div>
              <div className="models-input-collapsible-panel-input-field-div"></div>
            </div>
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          {/* Outbound section  */}
          <Panel className="models-input-collapsible-panel" header="Marketing Metrics" key="3">
            <div className="marketing-metrics-checkbox-sub-headings">
              <Checkbox checked={this.state.onCheckOutbound} onChange={(value) => this.onCheckOutbound(value)} value={this.state.onCheckOutbound}>
                Outbound
              </Checkbox>
            </div>
            <Form>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="models-input-collapsible-panel-start-input-field-div">
                  <div className="models-starting-state-collapsible-input-headings">Outbound Salary</div>
                  <div>
                    <Form.Item
                      name="outboundSalary"
                      rules={[
                        {
                          required: true,
                          message: "Please input outbound salary",
                        },
                      ]}
                    >
                      <Input
                        name="outboundSalary"
                        value={this.state.outboundSalary}
                        onChange={(e) => this.onChangeOutboundSalary(e)}
                        className="models-starting-state-collapsible-input"
                      />
                    </Form.Item>
                    {/* {errField === "this.state.outboundSalary" && (
                  <div style={{ color: "red", fontSize: "12px" }}>{errMsg}</div>
                )} */}
                  </div>
                </div>
                <div className="models-input-collapsible-panel-start-input-field-div">
                  <div className="models-starting-state-collapsible-input-headings">Number of Contacts per SDR</div>
                  <div>
                    <Form.Item
                      name="numberOfContactsPerSdr"
                      rules={[
                        {
                          required: true,
                          message: "Please input no.of Cust/SDE ",
                        },
                      ]}
                    >
                      <InputNumber
                        value={this.state.numberOfContactsPerSdr}
                        onChange={(e) => this.onChangeNumberOfContactsPerSdr(e)}
                        className="models-starting-state-collapsible-input"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="models-input-collapsible-panel-input-field-div">
                  <div className="models-starting-state-collapsible-input-headings">Number of SDRs</div>
                  <div>
                    <Input
                      value={this.state.numberOfSDR}
                      onChange={(e) => this.onChangeNumberOfSDR(e)}
                      className="models-starting-state-num-of-cust-collapsible-input"
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div className="models-input-collapsible-panel-start-input-field-div">
                  <div className="models-starting-state-collapsible-input-headings">Contact to Lead Conversion Rate</div>
                  <div>
                    <Input
                      value={this.state.contactToLeadConversionRate}
                      onChange={(e) => this.onChangeContactToLeadConversionRate(e)}
                      className="models-starting-state-collapsible-input"
                    />
                  </div>
                </div>
                <div className="models-input-collapsible-panel-start-input-field-div">
                  <div className="models-starting-state-collapsible-input-headings">Lead to Customer Conversion Rate (Outbound)</div>
                  <div>
                    <Input
                      value={this.state.leadToCustomerConversionRate}
                      onChange={(e) => this.onChangeLeadToCustomerConversionRate(e)}
                      className="models-starting-state-collapsible-input"
                    />
                  </div>
                </div>
                <div className="models-input-collapsible-panel-input-field-div"></div>
              </div>
            </Form>
            {/* Outbound section end */}

            {/* Inbound section  */}
            <div className="marketing-metrics-checkbox-sub-headings">
              <Checkbox onChange={this.onCheckInbound}>Inbound</Checkbox>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Monthly Ad Spend</div>
                <div>
                  <Input
                    value={this.state.monthlyAdSpend}
                    onChange={(e) => this.onChangemonthlyAdSpend(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">CPM</div>
                <div>
                  <Input value={this.state.cpm} onChange={(e) => this.onChangecpm(e)} className="models-starting-state-collapsible-input" />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Click Through Rate</div>
                <div>
                  <Input
                    value={this.state.clickThroughRate}
                    onChange={(e) => this.onChangeclickThroughRate(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Landing Page View Rate</div>
                <div>
                  <Input
                    value={this.state.landingPageView}
                    onChange={(e) => this.onChangelandingPageView(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Lead Generation Rate</div>
                <div>
                  <Input
                    value={this.state.leadGenerationRate}
                    onChange={(e) => this.onChangeleadGenerationRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Conversion Rate</div>
                <div>
                  <Input
                    value={this.state.conversionRate}
                    onChange={(e) => this.onChangeconversionRate(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            {/* Inbound section end */}

            {/* Organic section  */}

            <div className="marketing-metrics-checkbox-sub-headings">
              <Checkbox onChange={this.onCheckOrganic}>Organic</Checkbox>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Organic Views per Month</div>
                <div>
                  <Input
                    value={this.state.organicViewsPerMonth}
                    onChange={(e) => this.onChangeorganicViewsPerMonth(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Organic View to Lead Conversion Rate</div>
                <div>
                  <Input
                    value={this.state.organicViewsLeadToConversionRate}
                    onChange={(e) => this.onChangeorganicViewsLeadToConversionRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Lead to Customer Conversion Rate (Organic)</div>
                <div>
                  <Input
                    value={this.state.leadToCustomerConversionRate}
                    onChange={(e) => this.onChangeleadToCustomerConversionRate(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            {/* Organic section end  */}
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          <Panel className="models-input-collapsible-panel" header="Retention Metrics" key="4">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Returning Customer Rate</div>
                <div>
                  <Input
                    value={this.state.returningCustomerRate}
                    onChange={(e) => this.onChangereturningCustomerRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">TIme to Return(Months)</div>
                <div>
                  <Input
                    value={this.state.timeToReturn}
                    onChange={(e) => this.onChangetimeToReturn(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Cost to Market Return %</div>
                <div>
                  <Input
                    value={this.state.costToMarketReturn}
                    onChange={(e) => this.onChangecostToMarketReturn(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          <Panel className="models-input-collapsible-panel" header="Virality Metrics" key="5">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Referrers out of Customers</div>
                <div>
                  <Input
                    value={this.state.referresOutOfCustomers}
                    onChange={(e) => this.onChangereferresOutOfCustomers(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Invitees per Referral</div>
                <div>
                  <Input
                    value={this.state.inviteesPerReferral}
                    onChange={(e) => this.onChangeinviteesPerReferral(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Invitees Conversion Rate</div>
                <div>
                  <Input
                    value={this.state.inviteesConversionRate}
                    onChange={(e) => this.onChangeinviteesConversionRate(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          <Panel className="models-input-collapsible-panel" header="Admin" key="6">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Refund Rate %</div>
                <div>
                  <Input
                    value={this.state.refundRate}
                    onChange={(e) => this.onChangerefundRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Fixed Loss per Refund (exc Product Cost)</div>
                <div>
                  <Input
                    value={this.state.fixedLossPerRefund}
                    onChange={(e) => this.onChangefixedLossPerRefund(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Payment Processor Fees</div>
                <div>
                  <Input
                    value={this.state.paymentProcessorFees}
                    onChange={(e) => this.onChangepaymentProcessorFees(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Merchant Account Fees</div>
                <div>
                  <Input
                    value={this.state.merchantAccountFees}
                    onChange={(e) => this.onChangemerchantAccountFees(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Fixed Cost Per Month</div>
                <div>
                  <Input
                    value={this.state.fixedCostPerMonth}
                    onChange={(e) => this.onChangefixedCostPerMonth(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Fixed Costs Increase per 100 Customers per Month</div>
                <div>
                  <Input
                    value={this.state.fixedCostIncreasePerHundredCustomers}
                    onChange={(e) => this.onChangefixedCostIncreasePerHundredCustomers(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">UpFront Investment Costs</div>
                <div>
                  <Input
                    value={this.state.upFrontInvestmentCost}
                    onChange={(e) => this.onChangeupFrontInvestmentCost(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Debt</div>
                <div>
                  <Input value={this.state.debt} onChange={(e) => this.onChangedebt(e)} className="models-starting-state-collapsible-input" />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Debt Interest Rate %(Annual)</div>
                <div>
                  <Input
                    value={this.state.debtInterestRate}
                    onChange={(e) => this.onChangedebtInterestRate(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse className="models-input-collapsible-section">
          <Panel className="models-input-collapsible-panel" header="Valuations" key="7">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Tax Rate %</div>
                <div>
                  <Input value={this.state.taxRate} onChange={(e) => this.onChangetaxRate(e)} className="models-starting-state-collapsible-input" />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Number of Shares</div>
                <div>
                  <Input
                    value={this.state.numberOfShares}
                    onChange={(e) => this.onChangenumberOfShares(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Projection Period (Months)</div>
                <div>
                  <Input
                    value={this.state.projectionPeriod}
                    onChange={(e) => this.onChangeprojectionPeriod(e)}
                    className="models-starting-state-num-of-cust-collapsible-input"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Discount Rate %</div>
                <div>
                  <Input
                    value={this.state.discountRate}
                    onChange={(e) => this.onChangediscountRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-start-input-field-div">
                <div className="models-starting-state-collapsible-input-headings">Perpetual Growth Rate %</div>
                <div>
                  <Input
                    value={this.state.perpetualGrowthRate}
                    onChange={(e) => this.onChangeperpetualGrowthRate(e)}
                    className="models-starting-state-collapsible-input"
                  />
                </div>
              </div>
              <div className="models-input-collapsible-panel-input-field-div"></div>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }

  // Output tab
  getmodelsOutputFieldsData() {
    return (
      <div className="models-output-main-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="models-output-info-card">
            <div>Customer Acquisition Cost</div>
            <div>
              {parseFloat(this.state.customerAcquisitionCost.toFixed(2)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="models-output-info-card">
            <div>Lifetime Value Per Customer</div>
            <div>
              {parseFloat(this.state.lifetimeValuePerCustomer.toFixed(2)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="models-output-info-card">
            <div>Gross Profit per Cstomer before Ads</div>
            <div>
              {parseFloat(this.state.grossProfPerCustBefAds.toFixed(2)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="models-output-info-card">
            <div>Cash Below $0 Month</div>
            <div>{this.state.cashBelowZeroMonth}</div>
          </div>
        </div>

        {/* second row  */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <div className="models-output-info-card">
            <div>Equity Value</div>
            <div>220314.100</div>
          </div>
          <div className="models-output-info-card">
            <div>Time for Gross Profitablity</div>
            <div>{this.state.timeForGrossProfitablity}</div>
          </div>
          <div className="models-output-info-card">
            <div>Cash Payback Period</div>
            <div>{this.state.finalCashPayBackPeriodVal}</div>
          </div>
          <div className="models-output-info-card">
            <div>Cash ROI Compared to Day 1</div>
            <div>{this.state.finalCashROICompToDay}</div>
          </div>
        </div>

        {/* <div style={{ textAlign: "left", marginTop: "20px" }}>
          Graph section
          </div> */}
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "100%" }}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" stackId="a" fill="#8884d8" />
              <Bar dataKey="amt" stackId="a" fill="#82ca9d" />
              <Bar dataKey="uv" fill="#ffc658" />
            </BarChart>
          </div>
          <div style={{ width: "100%" }}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" stackId="a" fill="#8884d8" />
              <Bar dataKey="amt" stackId="a" fill="#82ca9d" />
              <Bar dataKey="uv" fill="#ffc658" />
            </BarChart>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: "30px", width: "100%" }}>
          <div style={{ width: "100%" }}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" stackId="a" fill="#8884d8" />
              <Bar dataKey="amt" stackId="a" fill="#82ca9d" />
              <Bar dataKey="uv" fill="#ffc658" />
            </BarChart>
          </div>
          <div style={{ width: "100%" }}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" stackId="a" fill="#8884d8" />
              <Bar dataKey="amt" stackId="a" fill="#82ca9d" />
              <Bar dataKey="uv" fill="#ffc658" />
            </BarChart>
          </div>
        </div>

        <div style={{ display: "flex", textAlign: "left", justifyContent: "space-between", marginTop: "20px" }}>
          <div style={{ width: "50%" }}>
            <div>Input</div>
            {/* Starting State  */}
            <div>Starting State</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Starting Date</div>
              <div>{this.state.startDate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cash In Bank</div>
              <div>{this.state.cashInBank.toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Initial Number of Customers</div>
              <div>{this.state.numberOfCustomers}</div>
            </div>
            {/* Financial Data  */}
            <div style={{ marginTop: "15px" }}>Financial Data</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Average Order Value</div>
              <div>{this.state.avgOrderValue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Realisation Rate</div>
              <div>{this.state.realisationRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Units/Order</div>
              <div>{this.state.unitsOrder}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Blended COGS%</div>
              <div>{this.state.blendedCogs}</div>
            </div>
            {/* Marketing Metrics */}
            <div style={{ marginTop: "15px" }}>Marketing Metrics</div>
            <hr />
            <div>Outbound</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Outbound Salary</div>
              <div>{this.state.outboundSalary}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Number of Contacts per SDR</div>
              <div>{this.state.numberOfContactsPerSdr}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Number of SDRs</div>
              <div>{this.state.numberOfSDR}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Contact to Lead Conversion Rate</div>
              <div>{this.state.contactToLeadConversionRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Lead to Customer Conversion Rate (Outbound)</div>
              <div>{this.state.leadToCustomerConversionRate}</div>
            </div>
            <div>Inbound</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Monthly Ad Spend</div>
              <div>{this.state.monthlyAdSpend.toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>CPM</div>
              <div>{this.state.cpm}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Click Through Rate</div>
              <div>{this.state.clickThroughRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Landing Page View Rate</div>
              <div>{this.state.landingPageView}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Lead Generation Rate</div>
              <div>{this.state.leadGenerationRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Conversion Rate</div>
              <div>{this.state.conversionRate}</div>
            </div>
            <div>Organic</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic Views per Month</div>
              <div>{this.state.organicViewsPerMonth}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic View to Lead Conversion Rate</div>
              <div>{this.state.organicViewsLeadToConversionRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Lead to Customer Conversion Rate (Organic)</div>
              <div>{this.state.leadToCustomerConversionRate}</div>
            </div>
            {/* Retention  */}
            <div style={{ marginTop: "15px" }}>Retention Metrics</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Returning Customer Rate</div>
              <div>{this.state.returningCustomerRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>TIme to Return(Months)</div>
              <div>{this.state.timeToReturn}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cost to Market Return %</div>
              <div>{this.state.costToMarketReturn}</div>
            </div>

            {/* Virality metrics  */}
            <div style={{ marginTop: "15px" }}>Virality Metrics</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Referrers out of Customers</div>
              <div>{this.state.referresOutOfCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Invitees per Referral</div>
              <div>{this.state.inviteesPerReferral}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Invitees Conversion Rate</div>
              <div>{this.state.inviteesConversionRate}</div>
            </div>
            {/* Admin  */}
            <div style={{ marginTop: "15px" }}>Admin</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Refund Rate %</div>
              <div>{this.state.refundRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Fixed Loss per Refund (exc Product Cost)</div>
              <div>{this.state.fixedLossPerRefund}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Payment Processor Fees</div>
              <div>{this.state.paymentProcessorFees}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Merchant Account Fees</div>
              <div>{this.state.merchantAccountFees}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Fixed Cost Per Month</div>
              <div>{this.state.fixedCostPerMonth.toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Fixed Costs Increase per 100 Customers per Month</div>
              <div>{this.state.fixedCostIncreasePerHundredCustomers.toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>UpFront Investment Costs</div>
              <div>{this.state.upFrontInvestmentCost}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Debt</div>
              <div>{this.state.debt}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Debt Interest Rate %(Annual)</div>
              <div>{this.state.debtInterestRate}</div>
            </div>

            {/* Valuations  */}
            <div style={{ marginTop: "15px" }}>Valuations</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Tax Rate %</div>
              <div>{this.state.taxRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Number of Shares</div>
              <div>{this.state.numberOfShares.toLocaleString("en-US")}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Projection Period (Months)</div>
              <div>{this.state.projectionPeriod}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Discount Rate %</div>
              <div>{this.state.discountRate}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Perpetual Growth Rate %</div>
              <div>{this.state.perpetualGrowthRate}</div>
            </div>
          </div>
          {/* Output  */}
          <div style={{ width: "50%", marginLeft: "30px" }}>
            <div>Output</div>
            <div>COGS per Order</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Realised Revenue</div>
              <div>{this.state.realisedRevenue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>COGS per Order</div>
              <div>{this.state.cogsPerOrder}</div>
            </div>
            <div>Marketing Metrics</div>
            <hr />
            <div>Outbound</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>SDR Salaries</div>
              <div>{this.state.sdrSalaries}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Contacts</div>
              <div>{this.state.contacts}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Outbound Leads</div>
              <div>{this.state.outboundLeads}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Outbound Customers</div>
              <div>{this.state.outboundCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Outbound Revenue</div>
              <div>{this.state.outboundRevenue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Outbound Gross Profit</div>
              <div>{this.state.outboundGrossProfit}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>ROI</div>
              <div>{this.state.roi}</div>
            </div>
            <div>Inbound</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Advertising Spend</div>
              <div>
                {parseFloat(this.state.advertisingSpend.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Reach</div>
              <div>{parseFloat(this.state.reach.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Link Clicks</div>
              <div>
                {parseFloat(this.state.linkClicks.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Page Views</div>
              <div>
                {parseFloat(this.state.pageViews.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Inbound Leads</div>
              <div>
                {parseFloat(this.state.inboundLeads.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Inbound Customers</div>
              <div>{this.state.inboundCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Inbound Revenue</div>
              <div>
                {parseFloat(this.state.inboundRevenue.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>ROAS</div>
              <div>{this.state.roas.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Gross Profit</div>
              {/* parseFloat(fNumber.toFixed(2)).toLocaleString(); */}
              <div>
                {parseFloat(this.state.inboundGrossProfit.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>ROI</div>
              <div>{this.state.inboundROI.toFixed(2)}</div>
            </div>
            <div>Organic</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic Leads</div>
              <div>{this.state.organicLeads}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic Customers</div>
              <div>{this.state.organicCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic Revenue</div>
              <div>{this.state.organicRevenue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Organic Gross Profit</div>
              <div>{this.state.organicGrossProfit}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Marketing Spend</div>
              <div>{parseFloat(this.state.marketingSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Marketing Customers Acquired</div>
              <div>{this.state.marketingCustomersAcquired}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Marketing Revenue</div>
              <div>
                {parseFloat(this.state.marketingRevenue.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Marketing Gross Profit</div>
              <div>
                {parseFloat(this.state.marketingGrossProfit.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Marketing ROI</div>
              <div>{this.state.marketingROI.toFixed(2)}</div>
            </div>
            <div>Retention Metrics</div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Customer Base</div>
              <div>{this.state.totalCustomerBase}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Returning Customers</div>
              <div>{this.state.returningCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Monthly Returning Revenue</div>
              <div>
                {parseFloat(this.state.monthlyReturningRevenue.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cost Market Return</div>
              <div>
                {parseFloat(this.state.outputCostToMarketReturn.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Refund Cost/Loss</div>
              <div>{this.state.refundCostLoss}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Refund Orders</div>
              <div>{this.state.totalRefundOrders.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Refund Loss</div>
              <div>{this.state.totalRefundLoss}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Referrers </div>
              <div>{this.state.totalReferrers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Invitees</div>
              <div>{this.state.totalInvitees}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Referral Customers</div>
              <div>{this.state.referralCustomers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Referral Revenue</div>
              <div>{this.state.referralRevenue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Gross Revenue</div>
              <div>{parseFloat(this.state.totalGrossRevenue.toFixed(2)).toLocaleString({ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Gross Profit Before Adspend</div>
              <div>
                {parseFloat(this.state.totalGrossProfitBeforeAdspend.toFixed(2)).toLocaleString({
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Gross Margin Profit Before Adspend</div>
              <div>{this.state.grossMarginProfitBeforeAdspend.toFixed(2)}%</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Gross Profit After Adspend</div>
              <div>
                {parseFloat(this.state.totalGrossProfitAfterAdspend.toFixed(2)).toLocaleString({
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Gross Margin Profit After Adspend</div>
              <div>{this.state.grossMarginProfitAfterAdspend.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Gross Profit Before Adspend Per Cust PerMonth</div>
              <div>{this.state.grossProfitBeforeAdspendPerCustPerMonth.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Gross Profit After Adspend Per Cust PerMonth</div>
              <div>{this.state.grossProfitAfterAdspendPerCustPerMonth.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Payment Processor Fees Per Order</div>
              <div>{this.state.paymentProcessorFeesPerOrder}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>merchant Accont Fees Per Order</div>
              <div>{this.state.merchantAccFeesPerOrder}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Payment Processor Fees</div>
              <div>
                {parseFloat(this.state.totalPaymentProcessorFees.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total merchant Account Fees</div>
              <div>{this.state.totalmerchantAccFees}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total Fixed Costs</div>
              <div>{parseFloat(this.state.totalFixedCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>UpFront Investment Costs</div>
              <div>{this.state.upFrontInvestmentCosts}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Earning Before Interest And Tax</div>
              <div>
                {parseFloat(this.state.earningBeforeIntAndTax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cash Taxes</div>
              <div>{this.state.cashTaxes}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Debt Interest Payable</div>
              <div>{this.state.debtInterestPayable}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Unlevered FreeCash Flow</div>
              <div>
                {parseFloat(this.state.unleveredFreeCashFlow).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>EnterPrise Value</div>
              <div>{this.state.enterPriseValue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Plus Cash</div>
              <div>{parseFloat(this.state.plusCash).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Less Debt</div>
              <div>{this.state.lessDebt}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Equity Value</div>
              <div>{this.state.equityValue}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Equity Value Share</div>
              <div>{this.state.equityValueShare}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Earning After Interest And Tax</div>
              <div>
                {parseFloat(this.state.earningAfterIntAndTax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Average Terminal Value</div>
              <div>{parseFloat(this.state.avgTerminalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cash In Bank</div>
              <div>{parseFloat(this.state.overAllCashInBank).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cash ROI Compared To Day 1</div>
              <div>{this.state.cashROICompToDay.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cash Payback Period</div>
              <div>{this.state.cashPaybackPeriod}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onChange(key) {
    console.log(key);
  }

  // Generate Random Val function

  onGenerateRandomValues() {
    this.setState({
      startDate: null,
      cashInBank: 1000000,
      numberOfCustomers: 0,
      avgOrderValue: 800,
      realisationRate: 90,
      unitsOrder: 1,
      blendedCogs: 30,
      outboundSalary: 0,
      numberOfContactsPerSdr: 0,
      numberOfSDR: 0,
      contactToLeadConversionRate: 0,
      leadToCustomerConversionRate: 0,
      organicleadToCustomerConversionRate: 20,
      monthlyAdSpend: 1000000,
      cpm: 150,
      clickThroughRate: 1,
      landingPageView: 70,
      leadGenerationRate: 100,
      conversionRate: 2,
      organicViewsPerMonth: 0,
      organicViewsLeadToConversionRate: 0,
      returningCustomerRate: 20,
      timeToReturn: 1,
      costToMarketReturn: 7.5,
      referresOutOfCustomers: 0,
      inviteesPerReferral: 5,
      inviteesConversionRate: 5.0,
      refundRate: 1.5,
      fixedLossPerRefund: 15,
      paymentProcessorFees: 2,
      merchantAccountFees: 0.5,
      fixedCostPerMonth: 10000,
      fixedCostIncreasePerHundredCustomers: 1000,
      upFrontInvestmentCost: 0,
      debt: 0,
      debtInterestRate: 6,
      taxRate: 20,
      numberOfShares: 20000,
      projectionPeriod: 60,
      discountRate: 12,
      perpetualGrowthRate: 3,
    });
  }

  // Calculate Model
  onCalculateModelValues() {
    for (let month = 0; month < this.state.projectionPeriod; month++) {
      let realisedRev = this.state.avgOrderValue * (this.state.realisationRate / 100);
      let cogsperOrder = (this.state.avgOrderValue * this.state.blendedCogs) / 100;
      let sdrSalary = this.state.numberOfSDR * this.state.outboundSalary;
      let contactsData = this.state.numberOfSDR * this.state.numberOfContactsPerSdr;
      let outboundLeadVal = contactsData * (this.state.contactToLeadConversionRate / 100);
      let outboundCustVal = outboundLeadVal * (this.state.leadToCustomerConversionRate / 100);
      let outboundRevenueVal = outboundCustVal * realisedRev;
      let outboundGrossProfitVal = outboundRevenueVal * (1 - this.state.blendedCogs / 100);
      let roiVal = outboundGrossProfitVal === 0 ? 0 : outboundGrossProfitVal / sdrSalary;
      let advertisingSpendVal = this.state.monthlyAdSpend;
      let reachVal = (this.state.monthlyAdSpend / this.state.cpm) * 1000;
      let linkClicksVal = reachVal * (this.state.clickThroughRate / 100);
      let pageViewsVal = linkClicksVal * this.state.landingPageView;
      let inboundLeadsVal = pageViewsVal * this.state.leadGenerationRate;
      let inboundCustomersVal = inboundLeadsVal * (this.state.conversionRate / 100);
      let inboundRevenueVal = Math.floor(inboundCustomersVal / 100 / 1000) * realisedRev;
      let roasVal = inboundRevenueVal > 0 ? (inboundRevenueVal / advertisingSpendVal) * 10 : 0;
      let inboundGrossProfitVal = inboundRevenueVal * (1 - this.state.blendedCogs / 100);
      let inboundROIVal = inboundGrossProfitVal > 0 ? (inboundGrossProfitVal / advertisingSpendVal) * 10 : 0;
      let organicLeadsVal = this.state.organicViewsPerMonth * (this.state.organicViewsLeadToConversionRate / 100);
      let organicCustomersVal = organicLeadsVal * (this.state.organicleadToCustomerConversionRate / 100);
      let organicRevenueVal = organicCustomersVal * realisedRev;
      let organicGrossProfitVal = organicRevenueVal * (1 - this.state.blendedCogs / 100);
      let marketingSpendVal = sdrSalary + advertisingSpendVal;
      let marketingCustomersAcquiredVal = outboundCustVal + inboundCustomersVal + organicCustomersVal;
      let marketingRevenueVal = Math.floor(marketingCustomersAcquiredVal / 100 / 1000) * realisedRev;
      let marketingGrossProfitVal = marketingRevenueVal * (1 - this.state.blendedCogs / 100);
      let marketingROIVal = (marketingGrossProfitVal * 10) / marketingSpendVal;
      let totalCustomerBaseVal = this.state.numberOfCustomers + marketingCustomersAcquiredVal;
      let returningCustomersVal = Math.floor(totalCustomerBaseVal / 1000 / 100).toFixed(2) * (this.state.returningCustomerRate / 100);
      let monthlyReturningRevenueVal = (returningCustomersVal * realisedRev) / this.state.timeToReturn;
      let costToMarketReturnVal = monthlyReturningRevenueVal * this.state.costToMarketReturn;
      let refundCostLossVal = this.state.avgOrderValue + this.state.fixedLossPerRefund;
      let totalReferrersVal = marketingCustomersAcquiredVal * this.state.referresOutOfCustomers;
      let totalInviteesVal = totalReferrersVal * this.state.inviteesPerReferral;
      let referralCustomersVal = totalInviteesVal * (this.state.inviteesConversionRate / 100);
      let referralRevenueVal = referralCustomersVal * realisedRev;
      let totalRefundOrdersVal =
        returningCustomersVal * (this.state.refundRate / 100) +
        Math.floor(marketingCustomersAcquiredVal / 100 / 1000).toFixed(2) * (this.state.refundRate / 100) +
        referralCustomersVal * (this.state.refundRate / 100);
      let totalRefundLossVal = totalRefundOrdersVal * refundCostLossVal;
      let val = monthlyReturningRevenueVal + marketingRevenueVal + referralRevenueVal;
      let totalGrossRevenueVal = val - totalRefundLossVal;
      let totalGrossProfitBeforeAdspendVal = totalGrossRevenueVal - totalGrossRevenueVal * (this.state.blendedCogs / 100);
      let grossMarginProfitBeforeAdspendVal = (totalGrossProfitBeforeAdspendVal / totalGrossRevenueVal) * 100;
      let totalGrossSubVal1 = totalGrossRevenueVal * (this.state.blendedCogs / 100);
      let totalGrossSubVal2 = totalGrossRevenueVal - totalGrossSubVal1;
      let totalGrossProfitAfterAdspendVal = totalGrossSubVal2 - marketingSpendVal / 10;
      let grossMarginProfitAfterAdspendVal = (totalGrossProfitAfterAdspendVal / totalGrossRevenueVal) * 100;
      let grossProfBefSubVal1 = parseInt(marketingCustomersAcquiredVal / 100 / 1000) + returningCustomersVal;
      let grossProfitBeforeAdspendPerCustPerMonthVal = totalGrossProfitBeforeAdspendVal / grossProfBefSubVal1;
      let grossProfitAfterAdspendPerCustPerMonthVal = totalGrossProfitAfterAdspendVal / grossProfBefSubVal1;
      let payProcessorSubVal = realisedRev * this.state.paymentProcessorFees * 100;
      let paymentProcessorFeesPerOrderVal = (payProcessorSubVal / 1000 / 10).toFixed(2);
      let merchantsubVal1 = realisedRev * this.state.merchantAccountFees;
      let merchantAccFeesPerOrderVal = merchantsubVal1 / 100;
      let totalMerchantAccSubVal1 = parseInt(marketingCustomersAcquiredVal / 100 / 1000) * paymentProcessorFeesPerOrderVal;
      let totalMerchantAccSubVal2 = returningCustomersVal * paymentProcessorFeesPerOrderVal;
      let totalMerchantAccSubVal3 = referralCustomersVal * paymentProcessorFeesPerOrderVal;
      let totalPaymentProcessorFeesVal = totalMerchantAccSubVal1 + totalMerchantAccSubVal2 + totalMerchantAccSubVal3;
      let totalMerchAccSubVal1 = parseInt(marketingCustomersAcquiredVal / 100 / 1000) * merchantAccFeesPerOrderVal;
      let totalMerchAccSubVal2 = returningCustomersVal * merchantAccFeesPerOrderVal;
      let totalMerchAccSubVal3 = referralCustomersVal * merchantAccFeesPerOrderVal;
      let totalmerchantAccFeesVal = totalMerchAccSubVal1 + totalMerchAccSubVal2 + totalMerchAccSubVal3;
      let totalFixedCostSubVal1 = this.state.fixedCostIncreasePerHundredCustomers * parseInt(marketingCustomersAcquiredVal / 100 / 1000);
      let totalFixedCostsVal = Math.round(totalFixedCostSubVal1 / 100) + this.state.fixedCostPerMonth;
      let upFrontInvestmentCostsVal = this.state.upFrontInvestmentCosts;
      let earningBeforeIntAndTaxVal =
        totalGrossProfitAfterAdspendVal - totalPaymentProcessorFeesVal - totalmerchantAccFeesVal - totalFixedCostsVal - upFrontInvestmentCostsVal;
      let cashTaxesVal = this.state.earningBeforeIntAndTax > 0 ? this.state.earningBeforeIntAndTax : 0;
      let debtInterestPayableVal = (this.state.debt * (this.state.debtInterestRate / 100)) / 12;
      let unleveredFreeCashFlowVal = earningBeforeIntAndTaxVal - cashTaxesVal - debtInterestPayableVal;
      let enterPriseVal = this.state.enterPriseValue;
      let plusCashVal = this.state.cashInBank;
      let lessDebtVal = this.state.debt / 100;
      let equityVal = enterPriseVal !== 0 ? enterPriseVal + plusCashVal - lessDebtVal : 0;
      let equityValueShareVal = equityVal / this.state.numberOfShares;
      let earningAfterIntAndTaxVal = earningBeforeIntAndTaxVal - cashTaxesVal - debtInterestPayableVal;
      let avgTerminalSubVal1 = 1 + this.state.perpetualGrowthRate / 100;
      let avgTerminalSubVal2 = avgTerminalSubVal1 / (this.state.discountRate / 100 - this.state.perpetualGrowthRate / 100);
      let avgTerminalVal = earningAfterIntAndTaxVal * avgTerminalSubVal2;
      let overAllCashInBankVal = this.state.cashInBank + earningAfterIntAndTaxVal;
      let cashROICompToDayVal = this.state.cashInBank > 0 ? overAllCashInBankVal / this.state.cashInBank : 0;
      let cashPaybackPeriodVal = cashROICompToDayVal < 1 ? "False" : "True";
      let timeForGrossProfVal = totalGrossProfitAfterAdspendVal > 0 ? "Month 12" : "False";
      let cashROIArr = [];
      let valuesForCashROI = cashROICompToDayVal / this.state.cashInBank;
      let cashROIArrResult = cashROIArr.concat(Array(this.state.projectionPeriod).fill(cashROICompToDayVal));
      const cashROIArrCummulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      let res = cashROIArrResult.map(cashROIArrCummulativeSum);
      let outputCashROIVal = res.reduce(function (a, b) {
        return a + b;
      });

      let finalCashROICompToDayVal = this.state.cashInBank > 0 ? outputCashROIVal : "False";
      let custAcqCost1 = marketingSpendVal * this.state.projectionPeriod;
      let custAcqCost2 = Math.floor(marketingCustomersAcquiredVal / 100 / 1000).toFixed(2) * this.state.projectionPeriod;
      let custAcqCost = custAcqCost1 / custAcqCost2;

      // let preferencesNew = [];
      // let result2 = preferencesNew.concat(Array(this.state.projectionPeriod).fill(totalCustomerBaseVal));
      // const cumuSum = (sum => value => sum += value)(0);
      // let totalCustBaseResult = result2.map(cumuSum);

      //**/  #1 **//
      let marRevenue = [];
      let marRevenueResult = marRevenue.concat(Array(this.state.projectionPeriod).fill(marketingRevenueVal));
      const marRevenuecumulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      let marRevenueRes = marRevenueResult.map(marRevenuecumulativeSum);

      //**/  #2 **//

      let marketRevenueValSum = marketingRevenueVal * this.state.projectionPeriod;
      console.log("marketRevenueValSum :>> ", marketRevenueValSum);
      let marketRevenueVal = [];
      let marketRevenueValResult = marketRevenueVal.concat(Array(this.state.projectionPeriod).fill(marketingRevenueVal));
      console.log("marketRevenueValResult :>> ", marketRevenueValResult);

      //**/  #3 **//

      let monthlyRetVal = [];
      let monthlyRetValResult = monthlyRetVal.concat(Array(this.state.projectionPeriod).fill(monthlyReturningRevenueVal));
      const monthlyRetValcumulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      let monthlyRetValRes = monthlyRetValResult.map(monthlyRetValcumulativeSum);
      console.log("monthlyRetValRes :>> ", monthlyRetValRes);

      //**/  #4 **//

      let refundCostLossResult = marRevenue.concat(Array(this.state.projectionPeriod).fill(refundCostLossVal));

      //**/  #5 **//

      let totalCustBaseVal = [];
      let custBasVal = parseFloat(totalCustomerBaseVal / 1000 / 100);
      let totalCustValResult = totalCustBaseVal.concat(Array(this.state.projectionPeriod).fill(custBasVal));
      console.log("totalCustValResult :>> ", totalCustValResult);
      const totalCustValcumulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      let totalCustValRes = totalCustValResult.map(totalCustValcumulativeSum);
      console.log("totalCustValRes =====:>> ", totalCustValRes);

      // ======== ISSUE below & projection period issue  ========

      // let ressult = totalCustValRes.map(x => parseFloat(x.toFixed()));
      // console.log('ressult :>> ', ressult);

      // let ressult2 = ressult.map(y => parseFloat(y.toFixed(1)));
      // console.log('ressult2 :>> ', ressult2);

      const lastItem = totalCustValRes[totalCustValRes.length - 1];
      console.log("lastItem :>> ", lastItem);

      // s

      //**/  #6 **// - Returning Customers

      let { returningCustomerRate } = this.state;
      let returningCustomerArray = [];
      for (let i = 0; i < Math.min(totalCustValResult.length); i++) {
        returningCustomerArray[i] = parseFloat(totalCustValRes[i] / 100).toFixed(2) * returningCustomerRate;
      }

      //**/  #7 **// - Mar Customers Acquired
      let marAcqVal = Math.floor(marketingCustomersAcquiredVal / 100 / 1000);
      let marCustAcq = marAcqVal * this.state.projectionPeriod;
      let marCustAcqArr = [];
      let marCustAcqResult = marCustAcqArr.concat(Array(this.state.projectionPeriod).fill(marAcqVal));

      let reffCustVal = [];
      let reffCustValResult = reffCustVal.concat(Array(this.state.projectionPeriod).fill(referralCustomersVal));

      let retCustNewArr = [];
      for (let i = 0; i < Math.min(returningCustomerArray.length); i++) {
        retCustNewArr[i] = returningCustomerArray[i] * (this.state.refundRate / 100);
      }

      let retCustAcqNewArr = [];
      for (let i = 0; i < Math.min(marCustAcqResult.length); i++) {
        retCustAcqNewArr[i] = marCustAcqResult[i] * (this.state.refundRate / 100);
      }

      let reffCustNewArr = [];
      for (let i = 0; i < Math.min(reffCustValResult.length); i++) {
        reffCustNewArr[i] = reffCustValResult[i] * (this.state.refundRate / 100);
      }

      //**/  #8 **// - Total ref orders - // SUM OF 2 ARRAYS

      var resultOftotalRefundOrdersVal1 = retCustNewArr.map(function (num, idx) {
        return num + retCustAcqNewArr[idx];
      });

      var resultOftotalRefundOrdersVal2 = resultOftotalRefundOrdersVal1.map(function (num, idx) {
        return num + reffCustNewArr[idx];
      });

      let totalRefLoss = [];
      for (let i = 0; i < Math.min(refundCostLossResult.length); i++) {
        totalRefLoss[i] = refundCostLossResult[i] * parseFloat(resultOftotalRefundOrdersVal2[i]).toFixed(2);
      }

      let totalGrossRevVal1 = marketRevenueValResult.map(function (num, idx) {
        return num + monthlyRetValRes[idx];
      });

      let totalGrossRevVal2 = totalGrossRevVal1.map(function (num, idx) {
        return num + reffCustValResult[idx];
      });

      let totalGrossRevValRes = totalGrossRevVal2.map(function (num, i) {
        return num - totalRefLoss[i];
      });

      console.log("totalGrossRevValRes 111:>> ", totalGrossRevValRes.length);

      var total = 0;
      for (let i = 0; i < totalGrossRevValRes.length; i++) {
        console.log("totalGrossRevValRes.length :>> ", totalGrossRevValRes.length);
        total += totalGrossRevValRes[i];
      }

      let lifetimeValPerCustResult = total / lastItem;
      console.log("lifetimeValPerCustResult :>> ", lifetimeValPerCustResult);

      let grossProfitPerCustResult = lifetimeValPerCustResult * (1 - this.state.blendedCogs / 100);
      console.log("grossProfitPerCustResult :>> ", grossProfitPerCustResult);

      //   var arr = [4, 8, 7, 13, 12];

      //   // Creating variable to store the sum
      //   var sum = 0;
      // console.log('HEREEEE 11:>> ');
      //   // Running the for loop
      //   for (let i = 0; i < arr.length; i++) {
      //     console.log('HEREEEE 22:>> ');

      //       sum += arr[i];

      //       console.log('Sum is ' , sum); // Prints: 44

      //   }

      //  let sumOfTotalGrossRevArr = [];
      //  console.log('sumOftotalGrossRevVal :>> ', sumOftotalGrossRevVal);
      //  let grossRevVal = sumOfTotalGrossRevArr.map(sumOftotalGrossRevVal);
      //  console.log('totalGrossRevValRes :>> ', totalGrossRevValRes);
      //  console.log('grossRevVal :>> ', grossRevVal);

      //  + Reff customers - total refund loss

      //  let totalRefundOrdersVal = returningCustomersVal * (this.state.refundRate / 100) + Math.floor(marketingCustomersAcquiredVal / 100 / 1000).toFixed(2) * (this.state.refundRate / 100) + referralCustomersVal * (this.state.refundRate / 100);

      // const sums = list[0].map((x, idx) => list.reduce((sum, curr) => sum + curr[idx], 0));

      let cash = [];
      let cashResult = cash.concat(Array(this.state.projectionPeriod).fill(overAllCashInBankVal));
      const cummulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      cashResult.map(cummulativeSum);
      if (this.state.projectionPeriod === 1 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 1",
        });
      } else if (this.state.projectionPeriod === 2 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 2",
        });
      } else if (this.state.projectionPeriod === 3 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 3",
        });
      } else if (this.state.projectionPeriod === 4 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 4",
        });
      } else if (this.state.projectionPeriod === 5 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 5",
        });
      } else if (this.state.projectionPeriod === 6 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 6",
        });
      } else if (this.state.projectionPeriod === 7 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 7",
        });
      } else if (this.state.projectionPeriod === 8 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 8",
        });
      } else if (this.state.projectionPeriod === 9 && this.state.cashInBank < 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 9",
        });
      } else if (this.state.projectionPeriod === 10 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 10",
        });
      } else if (this.state.projectionPeriod === 11 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 11",
        });
      } else if (this.state.projectionPeriod === 12 && this.state.cashInBank > 0 && cashResult.some((val) => val < 0)) {
        this.setState({
          cashBelowZeroMonth: "Month 12",
        });
      } else {
        this.setState({
          cashBelowZeroMonth: "False",
        });
      }

      let grossProfArr = [];
      let grossProFitResult = grossProfArr.concat(Array(this.state.projectionPeriod).fill(timeForGrossProfVal));

      const cummGrossSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      grossProfArr.map(cummGrossSum);

      if (this.state.projectionPeriod === 1 && totalGrossProfitAfterAdspendVal / 100 > 0 && grossProfArr.some((val) => val < 0)) {
        this.setState({
          timeForGrossProfitablity: "Month 1",
        });
      } else if (this.state.projectionPeriod === 2 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 2",
        });
      } else if (this.state.projectionPeriod === 3 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 3",
        });
      } else if (this.state.projectionPeriod === 4 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 4",
        });
      } else if (this.state.projectionPeriod === 5 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 5",
        });
      } else if (this.state.projectionPeriod === 6 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 6",
        });
      } else if (this.state.projectionPeriod === 7 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 7",
        });
      } else if (this.state.projectionPeriod === 8 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 8",
        });
      } else if (this.state.projectionPeriod === 9 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 9",
        });
      } else if (this.state.projectionPeriod === 10 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 10",
        });
      } else if (this.state.projectionPeriod === 11 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 11",
        });
      } else if (this.state.projectionPeriod === 12 && totalGrossProfitAfterAdspendVal / 100 > 0) {
        this.setState({
          timeForGrossProfitablity: "Month 12",
        });
      } else {
        this.setState({
          timeForGrossProfitablity: "False",
        });
      }

      // Cash Payback period
      let cashPayBackArr = [];
      let cashPayBackResult = cashPayBackArr.concat(Array(this.state.projectionPeriod).fill(timeForGrossProfVal));

      const cashPayBackArrCummulativeSum = (
        (sum) => (value) =>
          (sum += value)
      )(0);
      cashPayBackResult.map(cashPayBackArrCummulativeSum);

      if (this.state.projectionPeriod === 1 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 1",
        });
      } else if (this.state.projectionPeriod === 2 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 2",
        });
      } else if (this.state.projectionPeriod === 3 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 3",
        });
      } else if (this.state.projectionPeriod === 4 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 4",
        });
      } else if (this.state.projectionPeriod === 5 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 5",
        });
      } else if (this.state.projectionPeriod === 6 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 6",
        });
      } else if (this.state.projectionPeriod === 7 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 7",
        });
      } else if (this.state.projectionPeriod === 8 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 8",
        });
      } else if (this.state.projectionPeriod === 9 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 9",
        });
      } else if (this.state.projectionPeriod === 10 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 10",
        });
      } else if (this.state.projectionPeriod === 11 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 11",
        });
      } else if (this.state.projectionPeriod === 12 && cashROICompToDayVal > 1 && cashPayBackArr.some((val) => val < 1)) {
        this.setState({
          finalCashPayBackPeriodVal: "Month 12",
        });
      } else {
        this.setState({
          finalCashPayBackPeriodVal: "More than 12 months",
        });
      }

      this.setState({
        customerAcquisitionCost: custAcqCost / 10,
        lifetimeValuePerCustomer: lifetimeValPerCustResult,
        grossProfPerCustBefAds: grossProfitPerCustResult,
        euityValueData: equityVal,
        realisedRevenue: realisedRev,
        cogsPerOrder: cogsperOrder,
        sdrSalaries: sdrSalary,
        contacts: contactsData,
        outboundLeads: Math.floor(outboundLeadVal),
        outboundCustomers: Math.floor(outboundCustVal),
        outboundRevenue: Math.floor(outboundRevenueVal),
        outboundGrossProfit: outboundGrossProfitVal,
        roi: roiVal,
        advertisingSpend: advertisingSpendVal / 10,
        reach: reachVal / 10,
        linkClicks: linkClicksVal / 10,
        pageViews: pageViewsVal / 1000,
        inboundLeads: inboundLeadsVal / 1000 / 100,
        inboundCustomers: Math.floor(inboundCustomersVal / 100 / 1000).toFixed(2),
        inboundRevenue: inboundRevenueVal,
        roas: roasVal,
        inboundGrossProfit: inboundGrossProfitVal,
        inboundROI: inboundROIVal,
        organicLeads: organicLeadsVal,
        organicCustomers: Math.round(organicCustomersVal),
        organicRevenue: Math.round(organicRevenueVal),
        organicGrossProfit: Math.round(organicGrossProfitVal),
        marketingSpend: marketingSpendVal,
        marketingCustomersAcquired: Math.floor(marketingCustomersAcquiredVal / 100 / 1000).toFixed(2),
        marketingRevenue: marketingRevenueVal,
        marketingGrossProfit: marketingGrossProfitVal,
        marketingROI: marketingROIVal,
        totalCustomerBase: Math.floor(totalCustomerBaseVal / 1000 / 100).toFixed(2),
        returningCustomers: returningCustomersVal.toFixed(2),
        monthlyReturningRevenue: monthlyReturningRevenueVal,
        outputCostToMarketReturn: costToMarketReturnVal / 100,
        refundCostLoss: refundCostLossVal,
        totalRefundOrders: totalRefundOrdersVal,
        totalRefundLoss: totalRefundLossVal.toLocaleString("en-US"),
        totalReferrers: totalReferrersVal,
        totalInvitees: totalInviteesVal,
        referralCustomers: referralCustomersVal,
        referralRevenue: referralRevenueVal,
        totalGrossRevenue: totalGrossRevenueVal,
        totalGrossProfitBeforeAdspend: totalGrossProfitBeforeAdspendVal,
        grossMarginProfitBeforeAdspend: Math.round(grossMarginProfitBeforeAdspendVal),
        totalGrossProfitAfterAdspend: totalGrossProfitAfterAdspendVal,
        grossMarginProfitAfterAdspend: grossMarginProfitAfterAdspendVal,
        grossProfitBeforeAdspendPerCustPerMonth: grossProfitBeforeAdspendPerCustPerMonthVal,
        grossProfitAfterAdspendPerCustPerMonth: grossProfitAfterAdspendPerCustPerMonthVal,
        paymentProcessorFeesPerOrder: paymentProcessorFeesPerOrderVal,
        merchantAccFeesPerOrder: merchantAccFeesPerOrderVal,
        totalPaymentProcessorFees: totalPaymentProcessorFeesVal,
        totalmerchantAccFees: totalmerchantAccFeesVal,
        totalFixedCosts: totalFixedCostsVal,
        upFrontInvestmentCosts: upFrontInvestmentCostsVal,
        earningBeforeIntAndTax: earningBeforeIntAndTaxVal,
        cashTaxes: cashTaxesVal,
        debtInterestPayable: Math.floor(debtInterestPayableVal),
        unleveredFreeCashFlow: unleveredFreeCashFlowVal,
        enterPriseValue: enterPriseVal,
        plusCash: plusCashVal,
        lessDebt: lessDebtVal,
        equityValue: equityVal,
        equityValueShare: equityValueShareVal,
        earningAfterIntAndTax: earningAfterIntAndTaxVal,
        avgTerminalValue: avgTerminalVal,
        cashROICompToDay: cashROICompToDayVal,
        overAllCashInBank: overAllCashInBankVal,
        cashPaybackPeriod: cashPaybackPeriodVal,
        timeForGrossProfitablity: timeForGrossProfVal,
        finalCashROICompToDay: finalCashROICompToDayVal,
      });

      // let {
      //   startDate,
      //   customerAcquisitionCost,
      //   euityValueData,

      //   realisedRevenue,
      //   cogsPerOrder,
      //   sdrSalaries,
      //   contacts,
      //   outboundLeads,
      //   outboundCustomers,
      //   outboundRevenue,

      //   outboundGrossProfit,
      //   roi,
      //   advertisingSpend,
      //   reach,
      //   linkClicks,
      //   pageViews,
      //   inboundLeads,
      //   inboundCustomers,
      //   inboundRevenue,
      //   roas,

      //   inboundGrossProfit,
      //   inboundROI,
      //   organicLeads,
      //   organicCustomers,
      //   organicRevenue,
      //   organicGrossProfit,

      //   marketingSpend,
      //   marketingCustomersAcquired,
      //   marketingRevenue,
      //   marketingGrossProfit,
      //   marketingROI,

      //   totalCustomerBase,
      //   returningCustomers,
      //   monthlyReturningRevenue,
      //   outputCostToMarketReturn,

      //   refundCostLoss,
      //   totalRefundOrders,
      //   totalRefundLoss,
      //   totalReferrers,
      //   totalInvitees,
      //   referralCustomers,
      //   referralRevenue,

      //   totalGrossRevenue,
      //   totalGrossProfitBeforeAdspend,
      //   grossMarginProfitBeforeAdspend,
      //   totalGrossProfitAfterAdspend,
      //   grossMarginProfitAfterAdspend,
      //   grossProfitBeforeAdspendPerCustPerMonth,
      //   grossProfitAfterAdspendPerCustPerMonth,

      //   paymentProcessorFeesPerOrder,
      //   merchantAccFeesPerOrder,
      //   totalPaymentProcessorFees,
      //   totalmerchantAccFees,
      //   totalFixedCosts,
      //   upFrontInvestmentCosts,

      //   earningBeforeIntAndTax,
      //   cashTaxes,
      //   debtInterestPayable,
      //   unleveredFreeCashFlow,
      //   plusCash,
      //   lessDebt,
      //   equityValue,
      //   equityValueShare,
      //   earningAfterIntAndTax,
      //   avgTerminalValue,
      //   cashROICompToDay,
      //   overAllCashInBank,
      //   cashPaybackPeriod,
      // } = this.state;

      // opVals.push({
      //   startDate,
      //   customerAcquisitionCost,
      //   euityValueData,

      //   realisedRevenue,
      //   cogsPerOrder,
      //   sdrSalaries,
      //   contacts,
      //   outboundLeads,
      //   outboundCustomers,
      //   outboundRevenue,

      //   outboundGrossProfit,
      //   roi,
      //   advertisingSpend,
      //   reach,
      //   linkClicks,
      //   pageViews,
      //   inboundLeads,
      //   inboundCustomers,
      //   inboundRevenue,
      //   roas,

      //   inboundGrossProfit,
      //   inboundROI,
      //   organicLeads,
      //   organicCustomers,
      //   organicRevenue,
      //   organicGrossProfit,

      //   marketingSpend,
      //   marketingCustomersAcquired,
      //   marketingRevenue,
      //   marketingGrossProfit,
      //   marketingROI,

      //   totalCustomerBase,
      //   returningCustomers,
      //   monthlyReturningRevenue,
      //   outputCostToMarketReturn,

      //   refundCostLoss,
      //   totalRefundOrders,
      //   totalRefundLoss,
      //   totalReferrers,
      //   totalInvitees,
      //   referralCustomers,
      //   referralRevenue,

      //   totalGrossRevenue,
      //   totalGrossProfitBeforeAdspend,
      //   grossMarginProfitBeforeAdspend,
      //   totalGrossProfitAfterAdspend,
      //   grossMarginProfitAfterAdspend,
      //   grossProfitBeforeAdspendPerCustPerMonth,
      //   grossProfitAfterAdspendPerCustPerMonth,

      //   paymentProcessorFeesPerOrder,
      //   merchantAccFeesPerOrder,
      //   totalPaymentProcessorFees,
      //   totalmerchantAccFees,
      //   totalFixedCosts,
      //   upFrontInvestmentCosts,

      //   earningBeforeIntAndTax,
      //   cashTaxes,
      //   debtInterestPayable,
      //   unleveredFreeCashFlow,
      //   // enterPriseValue,
      //   plusCash,
      //   lessDebt,
      //   equityValue,
      //   equityValueShare,
      //   earningAfterIntAndTax,
      //   avgTerminalValue,
      //   cashROICompToDay,
      //   overAllCashInBank,
      //   cashPaybackPeriod,
      // });
    }

    //   const sumall = opVals.map(item => item.totalGrossRevenue).reduce((prev, curr) => prev + curr, 0);

    //   console.log('sum totalGrossRevenue 11:>> ', sumall);

    //   console.log('opVals ===== :>> ', opVals);

    //   return opVals;
  }

  onCheckOutbound(e) {
    let { onCheckOutbound } = this.state;

    console.log("onCheckOutbound", e.target.checked);
    this.setState({ onCheckOutbound: !onCheckOutbound });
  }

  onCheckInbound(e) {
    console.log("onCheckInbound", e.target.checked);
  }
  onCheckOrganic(e) {
    console.log("onCheckOrganic", e.target.checked);
  }

  onChangeCollapse(key) {
    console.log(key);
  }

  onChangeCashInBank(e) {
    this.setState({
      cashInBank: e.target.value,
    });
  }

  onChangenumberOfCustomers(e) {
    this.setState({
      numberOfCustomers: e.target.value,
    });
  }

  onChangeavgOrderValue(e) {
    this.setState({
      avgOrderValue: e.target.value,
    });
  }

  onChangeRealisationRate(e) {
    this.setState({
      realisationRate: e.target.value,
    });
  }

  onChangeUnitsOrder(e) {
    this.setState({
      unitsOrder: e.target.value,
    });
  }

  onChangeBlendedCogs(e) {
    this.setState({
      blendedCogs: e.target.value,
    });
  }

  onChangeOutboundSalary(e) {
    this.setState(
      {
        outboundSalary: e.target.value,
      },
      () => {}
    );

    // if (this.state.outboundSalary.length === undefined || this.state.outboundSalary.length < -1 || this.state.outboundSalary === "") {
    //  var elmnt = document.getElementById("outboundSalary");
    //  console.log('elmnt :>> ', elmnt.length);
    //  console.log('typeof(elmnt) :>> ', typeof(elmnt));
    //   console.log('this.state.outboundSalary.length 1:>> ', this.state.outboundSalary.length);

    //   elmnt.scrollIntoView();
    //   this.setState({
    //     errField: "this.state.outboundSalary",
    //     errMsg: "Please enter outbound salary",
    //   }, () => {

    //   });
    //   return;
    // }
    // else {
    //   this.setState({
    //     errField: "this.state.outboundSalary",
    //     errMsg: "",
    //   });
    // }
  }

  onChangeNumberOfContactsPerSdr(e) {
    this.setState({
      numberOfContactsPerSdr: e.target.value,
    });
    var elmnt = "";
    if (this.state.numberOfContactsPerSdr === null || this.state.numberOfContactsPerSdr.length === undefined) {
      elmnt = document.getElementById("numberOfContactsPerSdr");
      elmnt.scrollIntoView();
      this.setState({
        errField: "this.state.numberOfContactsPerSdr",
        errMsg: "Required field",
      });
      return;
    } else {
      this.setState({
        errField: "this.state.numberOfContactsPerSdr",
        errMsg: "",
      });
    }
  }

  onChangeNumberOfSDR(e) {
    this.setState({
      numberOfSDR: e.target.value,
    });
    // var elmnt = "";
    // if (this.state.outboundSalary === null || this.state..length === undefined) {
    //   elmnt = document.getElementById("outboundSalary");
    //   elmnt.scrollIntoView();
    //   this.setState({
    //     errField: "this.state.outboundSalary",
    //     errMsg: "Please enter outbound salary",
    //   });
    //   return;
    // }
    // else {
    //   this.setState({
    //     errField: "this.state.outboundSalary",
    //     errMsg: "",
    //   });
    // }
  }

  onChangeContactToLeadConversionRate(e) {
    this.setState({
      contactToLeadConversionRate: e.target.value,
    });
  }

  onChangeLeadToCustomerConversionRate(e) {
    this.setState({
      leadToCustomerConversionRate: e.target.value,
    });
  }

  onChangemonthlyAdSpend(e) {
    this.setState({
      monthlyAdSpend: e.target.value,
    });
  }

  onChangeclickThroughRate(e) {
    this.setState({
      clickThroughRate: e.target.value,
    });
  }

  onChangelandingPageView(e) {
    this.setState({
      landingPageView: e.target.value,
    });
  }

  onChangeleadGenerationRate(e) {
    this.setState({
      leadGenerationRate: e.target.value,
    });
  }

  onChangeconversionRate(e) {
    this.setState({
      conversionRate: e.target.value,
    });
  }

  onChangeorganicViewsPerMonth(e) {
    this.setState({
      organicViewsPerMonth: e.target.value,
    });
  }

  onChangeorganicViewsLeadToConversionRate(e) {
    this.setState({
      organicViewsLeadToConversionRate: e.target.value,
    });
  }

  onChangeleadToCustomerConversionRate(e) {
    this.setState({
      leadToCustomerConversionRate: e.target.value,
    });
  }

  onChangereturningCustomerRate(e) {
    this.setState({
      returningCustomerRate: e.target.value,
    });
  }

  onChangetimeToReturn(e) {
    this.setState({
      timeToReturn: e.target.value,
    });
  }

  onChangecostToMarketReturn(e) {
    this.setState({
      costToMarketReturn: e.target.value,
    });
  }

  onChangereferresOutOfCustomers(e) {
    this.setState({
      referresOutOfCustomers: e.target.value,
    });
  }

  onChangeinviteesPerReferral(e) {
    this.setState({
      inviteesPerReferral: e.target.value,
    });
  }

  onChangeinviteesConversionRate(e) {
    this.setState({
      inviteesConversionRate: e.target.value,
    });
  }

  onChangerefundRate(e) {
    this.setState({
      refundRate: e.target.value,
    });
  }

  onChangefixedLossPerRefund(e) {
    this.setState({
      fixedLossPerRefund: e.target.value,
    });
  }

  onChangepaymentProcessorFees(e) {
    this.setState({
      paymentProcessorFees: e.target.value,
    });
  }

  onChangemerchantAccountFees(e) {
    this.setState({
      merchantAccountFees: e.target.value,
    });
  }

  onChangefixedCostPerMonth(e) {
    this.setState({
      fixedCostPerMonth: e.target.value,
    });
  }

  onChangefixedCostIncreasePerHundredCustomers(e) {
    this.setState({
      fixedCostIncreasePerHundredCustomers: e.target.value,
    });
  }

  onChangeupFrontInvestmentCost(e) {
    this.setState({
      upFrontInvestmentCost: e.target.value,
    });
  }

  onChangedebt(e) {
    this.setState({
      debt: e.target.value,
    });
  }

  onChangedebtInterestRate(e) {
    this.setState({
      debtInterestRate: e.target.value,
    });
  }

  onChangetaxRate(e) {
    this.setState({
      taxRate: e.target.value,
    });
  }

  onChangenumberOfShares(e) {
    this.setState({
      numberOfShares: e.target.value,
    });
  }

  onChangeprojectionPeriod(e) {
    this.setState(
      {
        projectionPeriod: e.target.value,
      },
      () => {
        console.log("this.state.projectionPeriod ### ======:>> ", this.state.projectionPeriod);
      }
    );
    //     var  rate = 10;
    // var initialCost = -25000;
    // var cashFlows = [-10000, 0, 10000, 30000, 100000];

    // console.log("getNPV", this.getNPV(rate,values,dates));
  }

  onChangediscountRate(e) {
    this.setState({
      discountRate: e.target.value,
    });
  }

  onChangeperpetualGrowthRate(e) {
    this.setState({
      perpetualGrowthRate: e.target.value,
    });
  }

  onChangecpm(e) {
    this.setState({
      cpm: e.target.value,
    });
  }

  onChangeStartDate(value) {
    this.setState({
      startDate: value,
    });
  }

  // getNPV(rate, values, dates) {

  //   //   var  rate = 10;
  //   // var initialCost = -25000;
  //   // var cashFlows = [-10000, 0, 10000, 30000, 100000];

  //   // console.log("getNPV", this.getNPV(rate, initialCost, cashFlows));

  //   // for (var i = 0; i < cashFlows.length; i++) {
  //   //   npv += cashFlows[i] / Math.pow(rate / 100 + 1, i + 1);
  //   //   console.log('npv :>> ', npv);
  //   //   console.log('cashFlows[i] :>> ', cashFlows[i]);
  //   //   console.log('Math.pow(rate / 100 + 1, i + 1) :>> ', Math.pow(rate / 100 + 1, i + 1));
  //   // }

  //   // Copyright (c) 2012 Sutoiku, Inc. (MIT License)

  //   // function XNPV(rate, values, dates) {
  //   var resulttt = 0;
  //   for (var i = 0; i < this.state.earningAfterIntAndTax.length; i++) {
  //     resulttt += this.state.earningAfterIntAndTax[i] / Math.pow(1 + this.state.discountRate, moment(this.state.startDate[i]).diff(moment(this.state.startDate[0]), 'days') / 1825);

  //     console.log('resulttt :>> ', resulttt);
  //     console.log('Math.pow(1 + this.state.discountRate, moment(startDate[i]).diff(moment(startDate[0]), days :>> ', Math.pow(1 + this.state.discountRate, moment(this.state.startDate[i]).diff(moment(this.state.startDate[0]), 'days') / 1825));
  //     console.log('this.state.earningAfterIntAndTax[i] :>> ', this.state.earningAfterIntAndTax[i]);
  //   }
  //   return resulttt;
  // }

  //  getNPV(rate, initialCost, cashFlows) {
  //     var npv = initialCost;

  //     for (var i = 0; i < cashFlows.length; i++) {
  //       npv += cashFlows[i] / Math.pow(rate / 100 + 1, i + 1);
  //     }

  //     return npv;
  //   }

  // return npv;
}
