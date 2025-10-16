import axios from "axios";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import DCF from "../utils/DCF";
import coma from "../utils/coma";
import { backendServerBaseURL } from "../utils/backendServerBaseURL";

const ModelTest = (props) => {
  const [slotA, setSlotA] = useState({
    starting_date: 0,
    cash_in_bank: null,
    initial_no_of_customers: null,
    avg_ord_val: null,
    units_per_order: null,
    blended_cogs: null,
    realisation_rate: null,
    outbound_salary: null,
    contacts_per_month_per_sdr: null,
    number_of_sdrs: null,
    contact_to_lead_conversion_rate: null,
    lead_to_customer_conversion_rate_outbound: null,
    organic_views_per_month: null,
    organic_view_to_lead_conversion_rate: null,
    lead_to_customer_conversion_rate_organic: null,
    monthly_ad_spend: null,
    cpm: null,
    ctr: null,
    lpv_rate: null,
    lead_gen_rate: null,
    conv_rate: null,
    returning_cust_rate: null,
    product_lifetime: null,
    cost_to_market_return: null,
    referers_out_of_customers: null,
    invitees_per_referal: null,
    invitees_conv_rate: null,
    refund_rate: null,
    fixed_loss_per_refund: null,
    payment_processor_fees: null,
    merchant_account_fees: null,
    fixed_cost_per_month: null,
    fixed_cost_increase_per_100_cust: null,
    upfront_investment_cost: null,
    debt: null,
    debt_interest_rate: null,
    tax_rate: null,
    number_of_shares: null,
    projection_period: null,
    discount_rate: null,
    perpetual_growth_rate: null,
  });
  const [slotB, setSlotB] = useState({
    starting_date: 0,
    cash_in_bank: null,
    initial_no_of_customers: null,
    avg_ord_val: null,
    units_per_order: null,
    blended_cogs: null,
    realisation_rate: null,
    outbound_salary: null,
    contacts_per_month_per_sdr: null,
    number_of_sdrs: null,
    contact_to_lead_conversion_rate: null,
    lead_to_customer_conversion_rate_outbound: null,
    organic_views_per_month: null,
    organic_view_to_lead_conversion_rate: null,
    lead_to_customer_conversion_rate_organic: null,
    monthly_ad_spend: null,
    cpm: null,
    ctr: null,
    lpv_rate: null,
    lead_gen_rate: null,
    conv_rate: null,
    returning_cust_rate: null,
    product_lifetime: null,
    cost_to_market_return: null,
    referers_out_of_customers: null,
    invitees_per_referal: null,
    invitees_conv_rate: null,
    refund_rate: null,
    fixed_loss_per_refund: null,
    payment_processor_fees: null,
    merchant_account_fees: null,
    fixed_cost_per_month: null,
    fixed_cost_increase_per_100_cust: null,
    upfront_investment_cost: null,
    debt: null,
    debt_interest_rate: null,
    tax_rate: null,
    number_of_shares: null,
    projection_period: null,
    discount_rate: null,
    perpetual_growth_rate: null,
  });
  const [currency, setCurrency] = useState("");

  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState([]);

  const readOneA = async (id) => {
    await axios
      .get(backendServerBaseURL + "/dcf/read/" + id)
      .then((rsp) => {
        setSlotA(rsp.data.payload.values);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const readOneB = async (id) => {
    await axios
      .get(backendServerBaseURL + "/dcf/read/" + id)
      .then((rsp) => {
        setSlotB(rsp.data.payload.values);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-start mt-4">
        <div className="col-3 me-4 ">
          <div className="form-floating">
            <select
              className="form-control"
              id="exampleFormControlSelect1"
              onChange={(e) => {
                readOneA(e.target.value);
              }}
            >
              <option selected value="">
                Select the saved values
              </option>
              {/* {props.list.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))} */}
            </select>
            <label htmlFor="exampleFormControlSelect1">
              <h5>Slot A</h5>
            </label>
          </div>
        </div>
        <div className="col-3 me-4">
          <div className="form-floating">
            <select
              className="form-control"
              id="exampleFormControlSelect1"
              onChange={(e) => {
                readOneB(e.target.value);
              }}
            >
              <option selected value="">
                Select the saved values
              </option>
              {/* {props.list.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))} */}
            </select>
            <label htmlFor="exampleFormControlSelect1">
              <h5>Slot B</h5>
            </label>
          </div>
        </div>
        <div className="col-auto mt-2">
          <button
            className="btn btn-dark"
            onClick={() => {
              setResult1(DCF(slotA));
              setResult2(DCF(slotB));
            }}
          >
            Calculate
          </button>
        </div>
      </div>

      <div className="row mt-6">
        {/* slot A */}
        <div className="col-lg-4">
          <h2 className="text-center">Slot A</h2>

          <>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Customer Acquisition Cost ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {result1.length > 0 ? (result1[0].marketing_spend / result1[0].inbound_customers).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">LTV per Customer (12 months) ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          var sum_of_total_customer_base;
                          let sum_of_total_gross_revenue = 0;

                          for (let month = 0; month < result1.length; month++) {
                            sum_of_total_gross_revenue += result1[month].total_gross_revenue;
                          }

                          {
                            result1.length > 0
                              ? (sum_of_total_customer_base = result1[result1.length - 1].total_customer_base)
                              : (sum_of_total_customer_base = 0);
                          }

                          return (sum_of_total_gross_revenue / sum_of_total_customer_base).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">
                        Gross Profit Per Customer (12 months)(
                        {currency || "$"})
                      </h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const lifetime_value_per_customer = () => {
                            let sum_of_total_gross_revenue = 0;
                            var sum_of_total_customer_base;
                            for (let month = 0; month < result1.length; month++) {
                              sum_of_total_gross_revenue += result1[month].total_gross_revenue;
                            }

                            {
                              result1.length > 0
                                ? (sum_of_total_customer_base = result1[result1.length - 1].total_customer_base)
                                : (sum_of_total_customer_base = 0);
                            }

                            return sum_of_total_gross_revenue / sum_of_total_customer_base;
                          };
                          return (lifetime_value_per_customer() * (1 - slotA.blended_cogs / 100)).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash below $0 month ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getUnderZeroCashMonth = () => {
                            for (let i = 0; i < result1.length; i++) {
                              const month = result1[i];
                              const monthlyCash = month.cash_in_bank_curr;
                              if (monthlyCash < 0) {
                                return i + 1;
                              }
                            }
                          };

                          const underZeroCashMonth = getUnderZeroCashMonth();

                          return underZeroCashMonth ? `Month ${underZeroCashMonth}` : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">DCF Equity Value ({currency || "$"})</h6>

                      <span className="h2 mb-0">{result1.length > 0 ? coma(result1[result1.length - 1].equity_value.toFixed(2)) : 0}</span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Time For Gross Profitability ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getGrossProfitMonth = function () {
                            for (let i = 0; i < result1.length; i++) {
                              const month = result1[i];
                              const monthlyProfit = month.total_gross_profit_after_adspend;
                              if (monthlyProfit > 0) {
                                return i + 1;
                              }
                            }
                          };

                          const grossProfitMonth = getGrossProfitMonth();

                          return grossProfitMonth ? grossProfitMonth.toString() + " " + (grossProfitMonth > 1 ? "Months" : "Month") : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash Payback Period</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          if (slotA.cash_in_bank <= 0) {
                            return "False";
                          }

                          const getCashPaybackPeriodMonth = function () {
                            for (let i = 0; i < result1.length; i++) {
                              const month = result1[i];
                              const monthlyComparedCashROI = month.cash_ROI_compared_to_day_1;
                              if (monthlyComparedCashROI > 1) {
                                return i + 1;
                              }
                            }
                          };

                          const cashPaybackPeriodMonth = getCashPaybackPeriodMonth();

                          return cashPaybackPeriodMonth
                            ? cashPaybackPeriodMonth.toString() + " " + (cashPaybackPeriodMonth > 1 ? "Months" : "Month")
                            : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash ROI compared to Day 1</h6>

                      <span className="h2 mb-0">
                        {result1.length > 0 ? result1[result1.length - 1].cash_ROI_compared_to_day_1.toFixed(2) : "False"}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>

        {/* slot B */}
        <div className="col-lg-4">
          <h2 className="text-center">Slot B</h2>

          <>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Customer Acquisition Cost ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {result2.length > 0 ? (result2[0].marketing_spend / result2[0].inbound_customers).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">LTV per Customer (12 months) ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          var sum_of_total_customer_base;
                          let sum_of_total_gross_revenue = 0;

                          for (let month = 0; month < result2.length; month++) {
                            sum_of_total_gross_revenue += result2[month].total_gross_revenue;
                          }

                          {
                            result2.length > 0
                              ? (sum_of_total_customer_base = result2[result2.length - 1].total_customer_base)
                              : (sum_of_total_customer_base = 0);
                          }

                          return (sum_of_total_gross_revenue / sum_of_total_customer_base).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">
                        Gross Profit Per Customer (12 months)(
                        {currency || "$"})
                      </h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const lifetime_value_per_customer = () => {
                            let sum_of_total_gross_revenue = 0;
                            var sum_of_total_customer_base;
                            for (let month = 0; month < result2.length; month++) {
                              sum_of_total_gross_revenue += result2[month].total_gross_revenue;
                            }

                            {
                              result2.length > 0
                                ? (sum_of_total_customer_base = result2[result2.length - 1].total_customer_base)
                                : (sum_of_total_customer_base = 0);
                            }

                            return sum_of_total_gross_revenue / sum_of_total_customer_base;
                          };
                          return (lifetime_value_per_customer() * (1 - slotB.blended_cogs / 100)).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash below $0 month ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getUnderZeroCashMonth = () => {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyCash = month.cash_in_bank_curr;
                              if (monthlyCash < 0) {
                                return i + 1;
                              }
                            }
                          };

                          const underZeroCashMonth = getUnderZeroCashMonth();

                          return underZeroCashMonth ? `Month ${underZeroCashMonth}` : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">DCF Equity Value ({currency || "$"})</h6>

                      <span className="h2 mb-0">{result2.length > 0 ? coma(result2[result2.length - 1].equity_value.toFixed(2)) : 0}</span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Time For Gross Profitability ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getGrossProfitMonth = function () {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyProfit = month.total_gross_profit_after_adspend;
                              if (monthlyProfit > 0) {
                                return i + 1;
                              }
                            }
                          };

                          const grossProfitMonth = getGrossProfitMonth();

                          return grossProfitMonth ? grossProfitMonth.toString() + " " + (grossProfitMonth > 1 ? "Months" : "Month") : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash Payback Period</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          if (slotB.cash_in_bank <= 0) {
                            return "False";
                          }

                          const getCashPaybackPeriodMonth = function () {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyComparedCashROI = month.cash_ROI_compared_to_day_1;
                              if (monthlyComparedCashROI > 1) {
                                return i + 1;
                              }
                            }
                          };

                          const cashPaybackPeriodMonth = getCashPaybackPeriodMonth();

                          return cashPaybackPeriodMonth
                            ? cashPaybackPeriodMonth.toString() + " " + (cashPaybackPeriodMonth > 1 ? "Months" : "Month")
                            : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash ROI compared to Day 1</h6>

                      <span className="h2 mb-0">
                        {result2.length > 0 ? result2[result2.length - 1].cash_ROI_compared_to_day_1.toFixed(2) : "False"}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>

        {/* slot A - slot B */}
        <div className="col-lg-4">
          <h2 className="text-center">Slot A - Slot B</h2>

          <>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Customer Acquisition Cost ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {result2.length > 0
                          ? (
                              result1[0].marketing_spend / result1[0].inbound_customers -
                              result2[0].marketing_spend / result2[0].inbound_customers
                            ).toFixed(2)
                          : 0}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">LTV per Customer ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const slotA_value = () => {
                            var sum_of_total_customer_base;
                            let sum_of_total_gross_revenue = 0;

                            for (let month = 0; month < result1.length; month++) {
                              sum_of_total_gross_revenue += result1[month].total_gross_revenue;
                            }

                            {
                              result1.length > 0
                                ? (sum_of_total_customer_base = result1[result1.length - 1].total_customer_base)
                                : (sum_of_total_customer_base = 0);
                            }

                            return (sum_of_total_gross_revenue / sum_of_total_customer_base).toFixed(2);
                          };
                          const slotB_value = () => {
                            var sum_of_total_customer_base;
                            let sum_of_total_gross_revenue = 0;

                            for (let month = 0; month < result2.length; month++) {
                              sum_of_total_gross_revenue += result2[month].total_gross_revenue;
                            }

                            {
                              result2.length > 0
                                ? (sum_of_total_customer_base = result2[result2.length - 1].total_customer_base)
                                : (sum_of_total_customer_base = 0);
                            }

                            return (sum_of_total_gross_revenue / sum_of_total_customer_base).toFixed(2);
                          };

                          return (slotA_value() - slotB_value()).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">
                        Gross Profit Per Customer (12 months)(
                        {currency || "$"})
                      </h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const slotA_value = () => {
                            const lifetime_value_per_customer = () => {
                              let sum_of_total_gross_revenue = 0;
                              var sum_of_total_customer_base;
                              for (let month = 0; month < result1.length; month++) {
                                sum_of_total_gross_revenue += result1[month].total_gross_revenue;
                              }

                              {
                                result1.length > 0
                                  ? (sum_of_total_customer_base = result1[result1.length - 1].total_customer_base)
                                  : (sum_of_total_customer_base = 0);
                              }

                              return sum_of_total_gross_revenue / sum_of_total_customer_base;
                            };
                            return (lifetime_value_per_customer() * (1 - slotA.blended_cogs / 100)).toFixed(2);
                          };

                          const slotB_value = () => {
                            const lifetime_value_per_customer = () => {
                              let sum_of_total_gross_revenue = 0;
                              var sum_of_total_customer_base;
                              for (let month = 0; month < result2.length; month++) {
                                sum_of_total_gross_revenue += result2[month].total_gross_revenue;
                              }

                              {
                                result2.length > 0
                                  ? (sum_of_total_customer_base = result2[result2.length - 1].total_customer_base)
                                  : (sum_of_total_customer_base = 0);
                              }

                              return sum_of_total_gross_revenue / sum_of_total_customer_base;
                            };
                            return (lifetime_value_per_customer() * (1 - slotB.blended_cogs / 100)).toFixed(2);
                          };

                          return (slotA_value() - slotB_value()).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash below $0 month ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getUnderZeroCashMonth = () => {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyCash = month.cash_in_bank_curr;
                              if (monthlyCash < 0) {
                                return i + 1;
                              }
                            }
                          };

                          const underZeroCashMonth = getUnderZeroCashMonth();

                          return underZeroCashMonth ? `Month ${underZeroCashMonth}` : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">DCF Equity Value ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {result2.length > 0
                          ? coma((result1[result1.length - 1].equity_value - result2[result2.length - 1].equity_value).toFixed(2))
                          : 0}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Time For Gross Profitability ({currency || "$"})</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          const getGrossProfitMonth = function () {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyProfit = month.total_gross_profit_after_adspend;
                              if (monthlyProfit > 0) {
                                return i + 1;
                              }
                            }
                          };

                          const grossProfitMonth = getGrossProfitMonth();

                          return grossProfitMonth ? grossProfitMonth.toString() + " " + (grossProfitMonth > 1 ? "Months" : "Month") : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash Payback Period</h6>

                      <span className="h2 mb-0">
                        {(() => {
                          if (slotB.cash_in_bank <= 0) {
                            return "False";
                          }

                          const getCashPaybackPeriodMonth = function () {
                            for (let i = 0; i < result2.length; i++) {
                              const month = result2[i];
                              const monthlyComparedCashROI = month.cash_ROI_compared_to_day_1;
                              if (monthlyComparedCashROI > 1) {
                                return i + 1;
                              }
                            }
                          };

                          const cashPaybackPeriodMonth = getCashPaybackPeriodMonth();

                          return cashPaybackPeriodMonth
                            ? cashPaybackPeriodMonth.toString() + " " + (cashPaybackPeriodMonth > 1 ? "Months" : "Month")
                            : "False";
                        })()}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              {/*"col-xl"*/}
              <div className="card border-radius-7px border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted mb-2">Cash ROI compared to Day 1</h6>

                      <span className="h2 mb-0">
                        {result2.length > 0 ? result2[result2.length - 1].cash_ROI_compared_to_day_1.toFixed(2) : "False"}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className="h2 text-muted mb-0 fe"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <>
            <div className="col-auto">
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-center">Total Revenue vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotA.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Revenue (including refunds)",
                          data: result1.map((month) => month.total_gross_revenue),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                        {
                          label: "Total Gross Profit (After Adspend)",
                          data: result1.map((month) => month.total_gross_profit_after_adspend),
                          fill: false,
                          backgroundColor: "orange",
                          borderColor: "orange",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Revenue, Earnings, Cash vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotA.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Revenue (including refunds)",
                          data: result1.map((month) => month.total_gross_revenue),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                        {
                          label: "Earnings",
                          data: result1.map((month) => month.earnings_before_tax),
                          fill: false,
                          backgroundColor: "orange",
                          borderColor: "orange",
                        },
                        {
                          label: "Cash",
                          data: result1.map((month) => month.cash_in_bank_curr),
                          fill: false,
                          backgroundColor: "blue",
                          borderColor: "blue",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Equity Value vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotA.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Equity Value",
                          data: result1.map((month) => month.equity_value),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Total Customers vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotA.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Customers",
                          data: result1.map((month) => month.total_customer_base),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        </div>

        <div className="col-lg-6">
          <>
            <div className="col-auto">
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-center">Total Revenue vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotB.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Revenue (including refunds)",
                          data: result2.map((month) => month.total_gross_revenue),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                        {
                          label: "Total Gross Profit (After Adspend)",
                          data: result2.map((month) => month.total_gross_profit_after_adspend),
                          fill: false,
                          backgroundColor: "orange",
                          borderColor: "orange",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Revenue, Earnings, Cash vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotB.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Revenue (including refunds)",
                          data: result2.map((month) => month.total_gross_revenue),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                        {
                          label: "Earnings",
                          data: result2.map((month) => month.earnings_before_tax),
                          fill: false,
                          backgroundColor: "orange",
                          borderColor: "orange",
                        },
                        {
                          label: "Cash",
                          data: result2.map((month) => month.cash_in_bank_curr),
                          fill: false,
                          backgroundColor: "blue",
                          borderColor: "blue",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Equity Value vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotB.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Equity Value",
                          data: result2.map((month) => month.equity_value),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-center">Total Customers vs Time</h3>
                </div>
                <div className="card-body">
                  <Line
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: Array.from(Array(+slotB.projection_period)).map((month, i) => `Month ${i + 1}`),
                      datasets: [
                        {
                          label: "Total Customers",
                          data: result2.map((month) => month.total_customer_base),
                          fill: false,
                          backgroundColor: "green",
                          borderColor: "green",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default ModelTest;
