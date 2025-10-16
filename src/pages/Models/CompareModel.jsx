import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { formatNumber } from "../../utils/formatNumber";
import { useParams } from "react-router-dom";
import DCF from "../../utils/DCF";
import { getAllModels, selectmodels } from "../../redux/slices/modelSlice";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { v4 as uuidv4 } from "uuid";

function CompareModel() {
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
  const [currency, setCurrency] = useState("rupee");
  const [selectedMenu, setselectedMenu] = useState("Input");
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const params = useParams();
  const slotAId = params.slotAId;
  const slotBId = params.slotBId;
  const allModels = useSelector(selectmodels);
  const dispatch = useDispatch();
  const ProjectsMenus = [
    {
      name: "Input",
    },
    {
      name: "Output",
    },
  ];

  useEffect(() => {
    dispatch(getAllModels());
  }, []);

  const readOneA = async (id) => {
    await axios
      .get(backendServerBaseURL + "/api/v1/models/read/" + id)
      .then((rsp) => {
        const values = rsp.data.model.data;
        const slotA = {
          // Starting State
          starting_date: values.startingDate,
          cash_in_bank: values.cashInBank,
          initial_no_of_customers: values.numberOfCustomers,

          // Financial Data
          avg_ord_val: values.averageOrderValue,
          realisation_rate: values.realisationRate,
          units_per_order: values.unitOrder,
          blended_cogs: values.BlendedCOGS,

          // Marketing Metrics
          outbound_salary: values.outboundSalary,
          contacts_per_month_per_sdr: values.numberOfContactsPerMonthPerSDR,
          number_of_sdrs: values.numberOfSDRs,
          contact_to_lead_conversion_rate: values.contactToLeadConversionRate,
          lead_to_customer_conversion_rate_outbound: values.leadToCustomerConversionRateOutbound,

          monthly_ad_spend: values.monthlyAdSpend,
          cpm: values.CPM,
          ctr: values.numberOfSDRs,
          lpv_rate: values.landingPageViewRate,
          lead_gen_rate: values.leadGenerationRate,
          conv_rate: values.conversionRate,

          organic_views_per_month: values.organicViewsPerMonth,
          organic_view_to_lead_conversion_rate: values.organicViewToLeadConversionRate,
          lead_to_customer_conversion_rate_organic: values.leadToCustomerConversionRateOrganic,

          // Retention Metrics
          returning_cust_rate: values.returningCustomerRate,
          time_to_return: values.timeToReturnMonths,
          cost_to_market_return: values.costToMarketReturnPercent,

          // Virality Metrics
          referers_out_of_customers: values.referrersOutOfCustomersPercent,
          invitees_per_referal: values.inviteesPerReferral,
          invitees_conv_rate: values.inviteesConversionRate,

          // Admin
          refund_rate: values.refundRatePercent,
          fixed_loss_per_refund: values.fixedLossPerRefundExcProductCost,
          payment_processor_fees: values.paymentProcessorFees,
          merchant_account_fees: values.merchantAccountFees,
          fixed_cost_per_month: values.fixedCostsPerMonth,
          fixed_cost_increase_per_100_cust: values.fixedCostsIncreasePer100CustomersPerMonth,
          upfront_investment_cost: values.upfrontInvestmentCosts,
          debt: values.debt,
          debt_interest_rate: values.debtInterestRatePercentAnnual,

          // Valuations
          tax_rate: values.taxRatePercent,
          number_of_shares: values.numberOfShares,
          projection_period: values.projectionPeriodMonths,
          discount_rate: values.discountRatePercent,
          perpetual_growth_rate: values.perpetualGrowthRatePercent,

          upFrontInvestmentCosts: 0,
          earningBeforeIntAndTax: 0,
          enterPriseValue: 0,
        };
        console.log(slotA);
        setSlotA(slotA);
        setResult1(DCF(slotA));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const readOneB = async (id) => {
    await axios
      .get(backendServerBaseURL + "/api/v1/models/read/" + id)
      .then((rsp) => {
        const values = rsp.data.model.data;
        const slotB = {
          // Starting State
          starting_date: values.startingDate,
          cash_in_bank: values.cashInBank,
          initial_no_of_customers: values.numberOfCustomers,

          // Financial Data
          avg_ord_val: values.averageOrderValue,
          realisation_rate: values.realisationRate,
          units_per_order: values.unitOrder,
          blended_cogs: values.BlendedCOGS,

          // Marketing Metrics
          outbound_salary: values.outboundSalary,
          contacts_per_month_per_sdr: values.numberOfContactsPerMonthPerSDR,
          number_of_sdrs: values.numberOfSDRs,
          contact_to_lead_conversion_rate: values.contactToLeadConversionRate,
          lead_to_customer_conversion_rate_outbound: values.leadToCustomerConversionRateOutbound,

          monthly_ad_spend: values.monthlyAdSpend,
          cpm: values.CPM,
          ctr: values.numberOfSDRs,
          lpv_rate: values.landingPageViewRate,
          lead_gen_rate: values.leadGenerationRate,
          conv_rate: values.conversionRate,

          organic_views_per_month: values.organicViewsPerMonth,
          organic_view_to_lead_conversion_rate: values.organicViewToLeadConversionRate,
          lead_to_customer_conversion_rate_organic: values.leadToCustomerConversionRateOrganic,

          // Retention Metrics
          returning_cust_rate: values.returningCustomerRate,
          time_to_return: values.timeToReturnMonths,
          cost_to_market_return: values.costToMarketReturnPercent,

          // Virality Metrics
          referers_out_of_customers: values.referrersOutOfCustomersPercent,
          invitees_per_referal: values.inviteesPerReferral,
          invitees_conv_rate: values.inviteesConversionRate,

          // Admin
          refund_rate: values.refundRatePercent,
          fixed_loss_per_refund: values.fixedLossPerRefundExcProductCost,
          payment_processor_fees: values.paymentProcessorFees,
          merchant_account_fees: values.merchantAccountFees,
          fixed_cost_per_month: values.fixedCostsPerMonth,
          fixed_cost_increase_per_100_cust: values.fixedCostsIncreasePer100CustomersPerMonth,
          upfront_investment_cost: values.upfrontInvestmentCosts,
          debt: values.debt,
          debt_interest_rate: values.debtInterestRatePercentAnnual,

          // Valuations
          tax_rate: values.taxRatePercent,
          number_of_shares: values.numberOfShares,
          projection_period: values.projectionPeriodMonths,
          discount_rate: values.discountRatePercent,
          perpetual_growth_rate: values.perpetualGrowthRatePercent,

          upFrontInvestmentCosts: 0,
          earningBeforeIntAndTax: 0,
          enterPriseValue: 0,
        };

        setSlotB(slotB);
        setResult2(DCF(slotB));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    async function fetchModels() {
      await readOneA(slotAId);
      await readOneB(slotBId);
    }
    fetchModels();
  }, []);

  const generateCompareModelOutputRow = (key, noCurrency = true, percent = false) => {
    return (
      <div key={uuidv4}>
        {key != "cash_payback_period" && (
          <div className="col-8">
            <div className="row">
              <div className="col-3">
                <p className="mb-1">
                  {formatNumber(result1 ? result1[0][key] : 0, !noCurrency ? currency : "")}
                  {percent && "%"}
                </p>
              </div>
              <div className="col-3">
                <p className="mb-1">
                  {formatNumber(result2 ? result2[0][key] : 0, !noCurrency ? currency : "")}
                  {percent && "%"}
                </p>
              </div>
              <div className="col-3">
                <p className="mb-1">
                  {formatNumber(result1 && result2 ? result1[0][key] - result2[0][key] : 0, !noCurrency ? currency : "")}
                  {percent && "%"}
                </p>
              </div>
              <div className="col-3">
                <p className="mb-1">
                  {formatNumber(result1 && result2 ? 1 - result1[0][key] / result2[0][key] : 0, !noCurrency ? currency : "")}
                  {percent && "%"}
                </p>
              </div>
            </div>
          </div>
        )}
        {key == "cash_payback_period" && (
          <div className="col-8">
            <div className="row">
              <div className="col-3">
                <p className="mb-1">{result1 ? result1[0][key] : "False"}</p>
              </div>
              <div className="col-3">
                <p className="mb-1">{result1 ? result1[0][key] : "False"}</p>
              </div>
              <div className="col-3">
                <p className="mb-1">{formatNumber(result1 && result2 ? result1[0][key] - result2[0][key] : 0, !noCurrency ? currency : "")}</p>
              </div>
              <div className="col-3">
                <p className="mb-1">{formatNumber(result1 && result2 ? 1 - result1[0][key] / result2[0][key] : 0, !noCurrency ? currency : "")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="container" style={{ marginTop: "6rem", marginBottom: "5rem" }}>
      <div className="d-flex mb-3">
        <div>
          <p className="text-secondary mb-1">All Models</p>
          <h1 className="mb-1">Compare Models</h1>
        </div>

        <div className="flex-fill d-flex flex-row-reverse"></div>
      </div>

      <div className="row">
        {/* Slot A */}
        <div className="col-4">
          <div className="row g-3">
            <div className="col-12">
              <p className="form-label">Model A</p>
              <select className="form-select" aria-label="Default select example" value={slotAId}>
                {allModels.map((model) => {
                  return <option value={model._id}>{model.name}</option>;
                })}
              </select>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Customer Acquisition Cost</p>
                <p className="body3">{result1 && result1[0]?.customerAcquisitionCost}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Lifetime Value per Customer</p>
                <p className="body3">{result1 && result1[0]?.lifetimeValuePerCustomer}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Gross Profit per Customer before Ads</p>
                <p className="body3">{result1 && result1[0]?.grossProfPerCustBefAds}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Below $0 Month</p>
                <p className="body3">{result1 && result1[0]?.cashBelowZeroMonth}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Equity Value</p>
                <p className="body3">{result1 && result1[0]?.euityValueData}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Time for Gross Profitability</p>
                <p className="body3">{result1 && result1[0]?.timeForGrossProfitablity}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Payback Period</p>
                <p className="body3">{result1 && result1[0]?.finalCashPayBackPeriodVal}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash ROI compared to Day 1</p>
                <p className="body3">{result1 && result1[0]?.finalCashROICompToDay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slot B */}
        <div className="col-4">
          <div className="row g-3">
            <div className="col-12">
              <p className="form-label">Model B</p>
              <select className="form-select" aria-label="Default select example" value={slotBId}>
                {allModels.map((model) => {
                  return <option value={model._id}>{model.name}</option>;
                })}
              </select>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Customer Acquisition Cost</p>
                <p className="body3">{result2 && result2[0]?.customerAcquisitionCost}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Lifetime Value per Customer</p>
                <p className="body3">{result2 && result2[0]?.lifetimeValuePerCustomer}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Gross Profit per Customer before Ads</p>
                <p className="body3">{result2 && result2[0]?.grossProfPerCustBefAds}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Below $0 Month</p>
                <p className="body3">{result2 && result2[0]?.cashBelowZeroMonth}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Equity Value</p>
                <p className="body3">{result2 && result2[0]?.euityValueData}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Time for Gross Profitability</p>
                <p className="body3">{result2 && result2[0]?.timeForGrossProfitablity}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Payback Period</p>
                <p className="body3">{result2 && result2[0]?.finalCashPayBackPeriodVal}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash ROI compared to Day 1</p>
                <p className="body3">{result2 && result2[0]?.finalCashROICompToDay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slot A-B */}
        <div className="col-4">
          <div className="row g-3">
            <div className="col-12" style={{ paddingTop: "2.4rem" }}>
              <p className="form-label">Model A-B</p>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Customer Acquisition Cost</p>
                <p className="body3">
                  {result1 &&
                    result2 &&
                    (slotA.monthly_ad_spend / result1[0]?.marketing_customers_acquired).toFixed(2) -
                      (slotB.monthly_ad_spend / result2[0]?.marketing_customers_acquired).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Lifetime Value per Customer</p>
                <p className="body3">
                  {" "}
                  {slotA &&
                    slotB &&
                    (slotA.avg_ord_val * (1 + slotA.returning_cust_rate * 0.12)).toFixed(2) -
                      (slotB.avg_ord_val * (1 + slotB.returning_cust_rate * 0.12)).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Gross Profit per Customer before Ads</p>
                <p className="body3">
                  {slotA &&
                    slotB &&
                    ((1 - slotA.blended_cogs / 100) * slotA.avg_ord_val * (1 + slotA.returning_cust_rate * 0.12)).toFixed(2) -
                      ((1 - slotB.blended_cogs / 100) * slotB.avg_ord_val * (1 + slotB.returning_cust_rate * 0.12)).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Below $0 Month</p>
                <p className="body3">
                  {(() => {
                    var op = "False";
                    for (var month in result1) {
                      if (result1[month]?.cash_in_bank_curr < 0) {
                        op = "Month " + (+month + 1);
                        break;
                      }
                    }
                    return op;
                  })()}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Equity Value</p>
                <p className="body3">
                  {result1 &&
                    result2 &&
                    formatNumber(result1[result1.length - 1]?.equity_value) - formatNumber(result2[result2.length - 1]?.equity_value)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Time for Gross Profitability</p>
                <p className="body3">
                  {" "}
                  {(() => {
                    var op = "False";
                    for (var month in result1) {
                      if (result1[month].total_gross_profit > 0) {
                        op = +month + 1 + " Months";
                        break;
                      }
                    }
                    return op;
                  })()}
                </p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash Payback Period</p>
                <p className="body3">N/A</p>
              </div>
            </div>
            <div className="col-12">
              <div className="card p-3">
                <p className="mb-1">Cash ROI compared to Day 1</p>
                <p className="body3">N/A</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-bottom mt-5 mb-3">
        <div className="flex-fill d-flex align-items-center">
          {ProjectsMenus.map((menu) => {
            return (
              <div
                style={{ textDecoration: "none" }}
                className="text-dark body3 regular-weight cp"
                onClick={() => {
                  setselectedMenu(menu.name);
                }}
              >
                <div
                  className={selectedMenu === menu.name ? "text-center border-bottom border-primary border-3" : "text-center pb-1"}
                  style={{ minWidth: "7rem" }}
                >
                  <p className="mb-1">{menu.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMenu === "Input" && (
        <div>
          <div className="hstack">
            <p className="body2 mb-2" style={{ minWidth: "35%" }}>
              Input
            </p>
            <p className="body2 mb-2" style={{ minWidth: "35%" }}>
              A
            </p>
            <p className="body2 mb-2" style={{ minWidth: "35%" }}>
              B
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Starting Date
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.starting_date}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.starting_date}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Cash in Bank
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.cash_in_bank}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.cash_in_bank}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Initial Number of Customers
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.initial_no_of_customers}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.initial_no_of_customers}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Average Order Value
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.avg_ord_val}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.avg_ord_val}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Realisation Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.realisation_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.realisation_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Units/order
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.units_per_order}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.units_per_order}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Blended COGS %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.blended_cogs}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.blended_cogs}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Outbound Salary
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.outbound_salary}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.outbound_salary}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Number of Contacts per Month per SDR
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.contacts_per_month_per_sdr}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.contacts_per_month_per_sdr}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Number of SDRs
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.number_of_sdrs}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.number_of_sdrs}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Contact to Lead Conversion Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.contact_to_lead_conversion_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.contact_to_lead_conversion_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Lead to Customer Conversion Rate (Outbound)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.lead_to_customer_conversion_rate_outbound}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.lead_to_customer_conversion_rate_outbound}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Monthly Ad Spend
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.monthly_ad_spend}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.monthly_ad_spend}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              cpm
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.CPM}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.CPM}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Click Through Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.ctr}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.ctr}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Landing Page View Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.lpv_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.lpv_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Lead Generation Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.lead_gen_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.lead_gen_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Conversion Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.conv_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.conv_rate}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Organic Views per Month
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.organic_views_per_month}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.organic_views_per_month}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Organic View to Lead Conversion Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.organic_view_to_lead_conversion_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.organic_view_to_lead_conversion_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Lead to Customer Conversion Rate (Organic)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.lead_to_customer_conversion_rate_organic}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.lead_to_customer_conversion_rate_organic}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Returning Customer Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.returning_cust_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.returning_cust_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Time to Return (Months)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.product_lifetime}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.product_lifetime}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Cost to Market Return %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.cost_to_market_return}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.cost_to_market_return}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Referrers out of Customers %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.referers_out_of_customers}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.referers_out_of_customers}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Invitees per Referral
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.invitees_per_referal}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.invitees_per_referal}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Invitees Conversion Rate
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.invitees_conv_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.invitees_conv_rate}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Refund Rate %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.refund_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.refund_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Fixed Loss per Refund (exc Product Cost)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.fixed_loss_per_refund}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.fixed_loss_per_refund}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Payment Processor Fees
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.payment_processor_fees}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.payment_processor_fees}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Merchant Account Fees
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.merchant_account_fees}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.merchant_account_fees}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Fixed Costs per Month
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.fixed_cost_per_month}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.fixed_cost_per_month}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Fixed Costs Increase per 100 Customers per Month
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.fixed_cost_increase_per_100_cust}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.fixed_cost_increase_per_100_cust}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Upfront Investment Costs
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.upfront_investment_cost}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.upfront_investment_cost}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Debt
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.debt}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.debt}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Debt Interest Rate % (Annual)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.debt_interest_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.debt_interest_rate}
            </p>
          </div>

          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Tax Rate %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.tax_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.tax_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Number of Shares
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.number_of_shares}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.number_of_shares}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Projection Period (Months)
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.projection_period}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.projection_period}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Discount Rate %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.discount_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.discount_rate}
            </p>
          </div>
          <div className="hstack">
            <p className="mb-1" style={{ minWidth: "35%" }}>
              Perpetual Growth Rate %
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotA.perpetual_growth_rate}
            </p>
            <p className="mb-1" style={{ minWidth: "35%" }}>
              {slotB.perpetual_growth_rate}
            </p>
          </div>
        </div>
      )}

      {selectedMenu === "Output" && (
        <div>
          <div className="d-flex justify-content-between">
            <p className="body2 mb-2 col-4">Output</p>
            <div className="col-8">
              <div className="row">
                <div className="col-3">
                  <p className="body2 mb-2">A</p>
                </div>
                <div className="col-3">
                  <p className="body2 mb-2">B</p>
                </div>
                <div className="col-3">
                  <p className="body2 mb-2">A-B</p>
                </div>
                <div className="col-3">
                  <p className="body2 mb-2">1-A/B</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1 col-4">Realised Revenue</p>
            {generateCompareModelOutputRow("realised_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">COGS per Order</p>
            {generateCompareModelOutputRow("cogs_per_order")}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">SDR Salaries</p>
            {generateCompareModelOutputRow("sdr_salaries")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Contacts</p>
            {generateCompareModelOutputRow("contacts")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Outbound Leads</p>
            {generateCompareModelOutputRow("outbound_leads")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Outbound Customers</p>
            {generateCompareModelOutputRow("outbound_customers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Outbound Revenue</p>
            {generateCompareModelOutputRow("outbound_revenue")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Outbound Gross Profit</p>
            {generateCompareModelOutputRow("outbound_gross_profit")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">ROI</p>
            {generateCompareModelOutputRow("outbound_ROI")}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Advertising Spend</p>
            {generateCompareModelOutputRow("advertising_spend", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Reach</p>
            {generateCompareModelOutputRow("reach")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Link Clicks</p>
            {generateCompareModelOutputRow("link_clicks")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Page Views</p>
            {generateCompareModelOutputRow("page_views")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Inbound Leads</p>
            {generateCompareModelOutputRow("inbound_leads")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Inbound Customers</p>
            {generateCompareModelOutputRow("inbound_customers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Inbound Revenue</p>
            {generateCompareModelOutputRow("inbound_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">ROAS</p>
            {generateCompareModelOutputRow("ROAS")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Gross Profit</p>
            {generateCompareModelOutputRow("gross_profit", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">ROI</p>
            {generateCompareModelOutputRow("ROI")}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Organic Leads</p>
            {generateCompareModelOutputRow("organic_leads")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Organic Customers</p>
            {generateCompareModelOutputRow("organic_customers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Organic Revenue</p>
            {generateCompareModelOutputRow("organic_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Organic Gross Profit</p>
            {generateCompareModelOutputRow("outbound_gross_profit", false)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Marketing Spend</p>
            {generateCompareModelOutputRow("marketing_spend")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Marketing Customers Acquired</p>
            {generateCompareModelOutputRow("marketing_customers_acquired")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Marketing Revenue</p>
            {generateCompareModelOutputRow("marketing_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Marketing Gross Profit</p>
            {generateCompareModelOutputRow("marketing_gross_profit", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Marketing ROI</p>
            {generateCompareModelOutputRow("marketing_ROI")}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Customer Base</p>
            {generateCompareModelOutputRow("total_customer_base")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Returning Customers</p>
            {generateCompareModelOutputRow("returning_customers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Monthly Returning Revenue</p>
            {generateCompareModelOutputRow("monthly_returning_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Cost to Market Return</p>
            {generateCompareModelOutputRow("cost_to_market_return_curr", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Refund Cost/Loss</p>
            {generateCompareModelOutputRow("refund_cost", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Refund Orders</p>
            {generateCompareModelOutputRow("total_refund_orders")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Refunds Loss</p>
            {generateCompareModelOutputRow("total_refund_loss", false)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Referrers</p>
            {generateCompareModelOutputRow("total_referrers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Invitees</p>
            {generateCompareModelOutputRow("total_invitees")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Referral Customers</p>
            {generateCompareModelOutputRow("referal_customers")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Referral Revenue</p>
            {generateCompareModelOutputRow("referal_revenue", false)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Gross Revenue</p>
            {generateCompareModelOutputRow("total_gross_revenue", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Gross Profit before Adspend</p>
            {generateCompareModelOutputRow("total_gross_profit_before_adspend", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Gross Profit Margin before Adspend</p>
            {generateCompareModelOutputRow("gross_profit_margin_before_adspend", true, true)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Gross Profit after Adspend</p>
            {generateCompareModelOutputRow("total_gross_profit_after_adspend", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Gross Profit Margin after Adspend</p>
            {generateCompareModelOutputRow("gross_profit_margin_before_adspend", true, true)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Payment Processor Fees per Order</p>
            {generateCompareModelOutputRow("payment_processor_fees_per_order", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Merchant Account Fees per Order</p>
            {generateCompareModelOutputRow("merchant_account_fees_per_order", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Payment Processor Fees</p>
            {generateCompareModelOutputRow("total_payment_processor_fees", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Merchant Account Fees</p>
            {generateCompareModelOutputRow("total_merchant_account_fees", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Total Fixed Costs</p>
            {generateCompareModelOutputRow("total_fixed_cost", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Upfront Investment Costs</p>
            {generateCompareModelOutputRow("upfront_investment_cost_curr", false)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Earnings Before Interest & Tax</p>
            {generateCompareModelOutputRow("earnings_before_tax", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Cash Taxes</p>
            {generateCompareModelOutputRow("cash_taxes", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Debt Interest Payable</p>
            {generateCompareModelOutputRow("debt_interest_payable", false)}
          </div>
          <div className="d-flex justify-content-between">
            {/*  */}
            <p className="mb-1">Unlevered Free Cash Flow</p>
            {generateCompareModelOutputRow("upfront_investment_cost_curr", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Enterprise Value</p>
            {generateCompareModelOutputRow("enterprise_value", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Plus: Cash</p>
            {generateCompareModelOutputRow("plus_cash", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Less: Debt</p>
            {generateCompareModelOutputRow("less_debt", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Equity Value</p>
            {generateCompareModelOutputRow("equity_value", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Equity Value/Share</p>
            {generateCompareModelOutputRow("equity_value_per_share", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Earnings After Interest & Tax</p>
            {generateCompareModelOutputRow("earnings_after_tax", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Avg Terminal Value (Perpetual Growth)</p>
            {generateCompareModelOutputRow("avg_terminal_value", false)}
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-1">Cash In Bank</p>
            {generateCompareModelOutputRow("cash_in_bank_curr", false)}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Cash ROI compared to Day 1</p>
            {generateCompareModelOutputRow("cash_ROI_compared_to_day_1")}
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Cash Payback Period</p>
            {generateCompareModelOutputRow("cash_payback_period")}
          </div>

          <div className="row g-3 mt-3">
            {/* Total Revenue v/s time */}
            <div className="col-12">
              <div className="card p-4">
                <p className="body3 text-center mb-2">Total Revenue v/s time</p>
                <Line
                  data={{
                    labels: Array.from(Array(+slotA?.projection_period || 0)).map((month, i) => `Month ${i + 1}`),
                    datasets: [
                      {
                        label: "Total Revenue (including refunds)",
                        data: result1.map((month) => month.total_gross_revenue),
                        fill: false,
                        backgroundColor: "green",
                        borderColor: "green",
                      },
                      {
                        label: "Total Gross Profit",
                        data: result1.map((month) => month.total_gross_profit_after_adspend),
                        fill: false,
                        backgroundColor: "orange",
                        borderColor: "orange",
                      },
                    ],
                  }}
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
                />
              </div>
            </div>

            {/* Equity Value vs time */}
            <div className="col-12">
              <div className="card p-4">
                <p className="body3 text-center mb-2">Equity Value vs time</p>
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
                    labels: Array.from(Array(+slotA?.projection_period || 0)).map((month, i) => `Month ${i + 1}`),
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

            {/* Revenue, Earnings, Cash v/s Time */}
            <div className="col-12">
              <div className="card p-4">
                <p className="body3 text-center mb-2">Revenue, Earnings, Cash v/s Time</p>
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
                    labels: Array.from(Array(+slotA?.projection_period || 0)).map((month, i) => `Month ${i + 1}`),
                    datasets: [
                      {
                        label: "Total Revenue (including refunds)",
                        data: result1.map((month) => month.total_revenue),
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

            {/* Total Customers v/s Time */}
            <div className="col-12">
              <div className="card p-4">
                <p className="body3 text-center mb-2">Total Customers v/s Time</p>
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
                    labels: Array.from(Array(+slotA?.projection_period || 0)).map((month, i) => `Month ${i + 1}`),
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
        </div>
      )}
    </div>
  );
}

export default CompareModel;
