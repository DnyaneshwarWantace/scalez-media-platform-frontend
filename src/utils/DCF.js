function sumArray(advertisingSpendValResult) {
  let sum = 0;

  advertisingSpendValResult.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayOfReach(reachValArrResult) {
  let sum = 0;

  reachValArrResult.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayClickLinks(linkClicksValArrResult) {
  let sum = 0;

  linkClicksValArrResult.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayofPageViews(pageViewsValArrResult) {
  let sum = 0;

  pageViewsValArrResult.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayofInboundLeads(inboundLeadsArrResult) {
  let sum = 0;

  inboundLeadsArrResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofInboundCustomer(inboundCustomersValArrResult) {
  let sum = 0;

  inboundCustomersValArrResult.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayofInboundRevenue(inboundRevenueValResult) {
  let sum = 0;

  inboundRevenueValResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofRoasVal(roasValArrResult) {
  let sum = 0;

  roasValArrResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofInboundGrossProfitVal(inboundGrossProfitValResult) {
  let sum = 0;

  inboundGrossProfitValResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofOrganicLeads(organicLeadsValArrResult) {
  let sum = 0;

  organicLeadsValArrResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofOrganicCustomers(organicCustomersValArrResult) {
  let sum = 0;

  organicCustomersValArrResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofOrganicRevenue(organicRevenueValResult) {
  let sum = 0;

  organicRevenueValResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofOrganicGrossProfit(organicGrossProfitValResult) {
  let sum = 0;

  organicGrossProfitValResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofMarketingSpend(marketingSpendResult) {
  let sum = 0;

  marketingSpendResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofmarketingCustomersAcquired(marCustAcqResult) {
  let sum = 0;

  marCustAcqResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofMarketingRevenue(marketRevenueValResult) {
  let sum = 0;

  marketRevenueValResult.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofMarketingGrossProfitVal(marketingGrossProfitVal) {
  let sum = 0;

  marketingGrossProfitVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofMontlyReturningRevenue(monthlyReturningRevenueVal) {
  let sum = 0;

  monthlyReturningRevenueVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofcostToMarketReturnVal(costToMarketReturnVal) {
  let sum = 0;

  costToMarketReturnVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayoftotalRefundOrdersVal(resultOfRefundOrders) {
  let sum = 0;

  resultOfRefundOrders.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayoftotalRefLoss(totalRefLoss) {
  let sum = 0;

  totalRefLoss.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayoftotalReferrersValResult(resultOfTotalReferrersVal) {
  let sum = 0;

  resultOfTotalReferrersVal.forEach((item) => {
    sum += item;
  });

  console.log("sum :>> ", sum);
  return sum;
}

function sumArrayoftotalInviteesValResult(totalInviteesVal) {
  let sum = 0;

  totalInviteesVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofreferralCustomersResult(referralCustomersVal) {
  let sum = 0;

  referralCustomersVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

function sumArrayofreferralRevenueValResult(referralRevenueVal) {
  let sum = 0;

  referralRevenueVal.forEach((item) => {
    sum += item;
  });
  return sum;
}

// function sumArrayofTotalCustomerBase(totalCustomerBaseFinalVal) {
//   let sum = 0;

//   totalCustomerBaseFinalVal.forEach((item) => {
//     sum += item;
//   });
//   return sum;
// }
function sumArrayofCustAcqCost1(custAcqCost1) {
  let sum = 0;

  custAcqCost1.forEach((item) => {
    sum += item;
  });

  return sum;
}

function sumArrayofCustAcqCost2(totalCustomerBaseVal) {
  let sum = 0;

  totalCustomerBaseVal.forEach((item) => {
    sum += item;
  });

  return sum;
}

function truncate(num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

export default function DCF({
  startDate,
  cashInBank,
  numberOfCustomers,
  avgOrderValue,
  realisationRate,
  unitsOrder,
  blendedCogs,
  outboundSalary,
  numberOfContactsPerSdr,
  numberOfSDR,
  contactToLeadConversionRate,
  leadToCustomerConversionRate,
  monthlyAdSpend,
  cpm,
  clickThroughRate,
  landingPageView,
  leadGenerationRate,
  conversionRate,
  organicViewsPerMonth,
  organicViewsLeadToConversionRate,
  organicleadToCustomerConversionRate,
  returningCustomerRate,
  timeToReturn,
  costToMarketReturn,
  referresOutOfCustomers,
  inviteesPerReferral,
  inviteesConversionRate,
  refundRate,
  fixedLossPerRefund,
  paymentProcessorFees,
  merchantAccountFees,
  fixedCostPerMonth,
  fixedCostIncreasePerHundredCustomers,
  upFrontInvestmentCost,
  debt,
  debtInterestRate,
  taxRate,
  numberOfShares,
  projectionPeriod,
  discountRate,
  perpetualGrowthRate,
  inbound,
  outbound,
  organic,
}) {
  let customerAcquisitionCost = 0;
  let lifetimeValuePerCustomer = 0;
  let euityValueData = 0;
  let realisedRevenue = 0;
  let cogsPerOrder = 0;
  let sdrSalaries = 0;
  let contacts = 0;
  let outboundLeads = 0;
  let outboundCustomers = 0;
  let outboundRevenue = 0;
  let outboundGrossProfit = 0;
  let roi = 0;
  let advertisingSpend = 0;
  let reach = 0;
  let linkClicks = 0;
  let pageViews = 0;
  let inboundLeads = 0;
  let inboundCustomers = 0;
  let inboundRevenue = 0;
  let roas = 0;
  let inboundGrossProfit = 0;
  let inboundROI = 0;
  let organicLeads = 0;
  let organicCustomers = 0;
  let organicRevenue = 0;
  let organicGrossProfit = 0;
  let marketingSpend = 0;
  let marketingCustomersAcquired = 0;
  let marketingRevenue = 0;
  let marketingGrossProfit = 0;
  let marketingROI = 0;
  let totalCustomerBase = 0;
  let returningCustomers = 0;
  let monthlyReturningRevenue = 0;
  let refundCostLoss = 0;
  let totalRefundOrders = 0;
  let totalRefundLoss = 0;
  let totalReferrers = 0;
  let totalInvitees = 0;
  let referralCustomers = 0;
  let referralRevenue = 0;
  let totalGrossRevenue = 0;
  let totalGrossProfitBeforeAdspend = 0;
  let grossMarginProfitBeforeAdspend = 0;
  let totalGrossProfitAfterAdspend = 0;
  let grossMarginProfitAfterAdspend = 0;
  let grossProfitBeforeAdspendPerCustPerMonth = 0;
  let grossProfitAfterAdspendPerCustPerMonth = 0;
  let paymentProcessorFeesPerOrder = 0;
  let merchantAccFeesPerOrder = 0;
  let totalPaymentProcessorFees = 0;
  let totalmerchantAccFees = 0;
  let fixedCostForPerHundredCustomers = 0;
  let totalFixedCostPerMonth = 0;
  let totalFixedCosts = 0;
  let upFrontInvestmentCosts = 0;
  let earningBeforeIntAndTax = 0;
  let cashTaxes = 0;
  let debtInterestPayable = 0;
  let unleveredFreeCashFlow = 0;
  let enterPriseValue = 0;
  let plusCash = 0;
  let lessDebt = 0;
  let equityValue = 0;
  let equityValueShare = 0;
  let earningAfterIntAndTax = 0;
  let avgTerminalValue = 0;
  let cashROICompToDay = 0;
  let cashPaybackPeriod = 0;
  let grossProfPerCustBefAds = 0;
  let timeForGrossProfitablity = 0;
  let overAllCashInBank = 0;
  let outputCostToMarketReturn = 0;
  let cashBelowZeroMonth = 0;
  let finalCashPayBackPeriodVal = 0;
  let finalCashROICompToDay = 0;
  let onCheckOutbound = true;
  let loaderVisible = false;
  let equityValueTotal = 0;
  let tabKey = "1";
  let showRulesModal = false;

  let opVals = null;

  for (let month = 0; month < projectionPeriod; month++) {
    let realisedRev = avgOrderValue * (realisationRate / 100);
    console.log("realisedRev :>> ", realisedRev);
    let cogsperOrder = (avgOrderValue * blendedCogs) / 100;
    let cogsPerOrderArr = [];
    let cogsPerOrderArrRes = cogsPerOrderArr.concat(
      Array(projectionPeriod).fill(cogsperOrder)
    );

    let sdrSalary = numberOfSDR * outboundSalary;
    let sdrSalaryArr = [];
    let sdrSalaryRes = sdrSalaryArr.concat(
      Array(projectionPeriod).fill(sdrSalary)
    );
    var totalsdrSalaryRes = 0;
    for (let i = 0; i < sdrSalaryRes.length; i++) {
      totalsdrSalaryRes += sdrSalaryRes[i];
    }
    let contactsData = numberOfSDR * numberOfContactsPerSdr;
    let contactsDataArr = [];

    let contactsDataRes = contactsDataArr.concat(
      Array(projectionPeriod).fill(contactsData)
    );

    var totalcontactsDataRes = 0;
    for (let i = 0; i < contactsDataRes.length; i++) {
      totalcontactsDataRes += contactsDataRes[i];
    }

    let outboundLeadVal = contactsData * (contactToLeadConversionRate / 100);

    let outboundLeadValArr = [];

    let outboundLeadValRes = outboundLeadValArr.concat(
      Array(projectionPeriod).fill(outboundLeadVal)
    );

    var totaloutboundLeadValRes = 0;
    for (let i = 0; i < outboundLeadValRes.length; i++) {
      totaloutboundLeadValRes += outboundLeadValRes[i];
    }

    let outboundCustVal =
      outboundLeadVal * (leadToCustomerConversionRate / 100);
    let outboundCustValArr = [];

    let outboundCustValRes = outboundCustValArr.concat(
      Array(projectionPeriod).fill(outboundCustVal)
    );

    var totaloutboundCustValRes = 0;
    for (let i = 0; i < outboundCustValRes.length; i++) {
      totaloutboundCustValRes += outboundCustValRes[i];
    }

    let outboundRevenueVal = outboundCustVal * realisedRev;

    let outboundRevenueValArr = [];

    let outboundRevenueValRes = outboundRevenueValArr.concat(
      Array(projectionPeriod).fill(outboundRevenueVal)
    );
    var totaloutboundRevenueValRes = 0;
    for (let i = 0; i < outboundRevenueValRes.length; i++) {
      totaloutboundRevenueValRes += outboundRevenueValRes[i];
    }

    let outboundGrossProfitVal = outboundRevenueVal * (1 - blendedCogs / 100);

    let outboundGrossProfitValArr = [];

    let outboundGrossProfitValRes = outboundGrossProfitValArr.concat(
      Array(projectionPeriod).fill(outboundGrossProfitVal)
    );

    var totaloutboundGrossProfitValRes = 0;
    for (let i = 0; i < outboundGrossProfitValRes.length; i++) {
      totaloutboundGrossProfitValRes += outboundGrossProfitValRes[i];
    }

    let roiVal =
      outboundGrossProfitVal === 0 ? 0 : outboundGrossProfitVal / sdrSalary;

    let roiValArray = [];

    let roiValRes = roiValArray.concat(Array(projectionPeriod).fill(roiVal));

    var totalroiValRes = 0;
    for (let i = 0; i < roiValRes.length; i++) {
      totalroiValRes += roiValRes[i];
    }

    let advertisingSpendVal = monthlyAdSpend;

    let advSpendArr = [];
    let advertisingSpendValResult = advSpendArr.concat(
      Array(projectionPeriod).fill(advertisingSpendVal)
    );

    let reachVal = (monthlyAdSpend / cpm) * 1000;
    let reachValArrPsd = (reachVal / 100) * 100;
    let reachValArr = [];
    let reachValArrResult2 = [];
    let reachValArrResult1 = reachValArr.concat(
      Array(projectionPeriod).fill(reachValArrPsd)
    );
    for (let i = 0; i < projectionPeriod; i++) {
      reachValArrResult2[i] = Math.floor(reachValArrResult1[i]);
    }
    console.log("reachValArrResult2", reachValArrResult2);

    // let reachValArrTwodecimal = reachValArrResult.map(function (each_element) {
    //   return Number(each_element?.toFixed(2));
    // });
    let linkClicksVal = reachVal * (clickThroughRate / 100);
    let linkClicksValArrPsd = (linkClicksVal / 10) * 10;
    let linkClicksValArr = [];
    let linkClicksValArrResult2 = [];
    let linkClicksValArrResult1 = linkClicksValArr.concat(
      Array(projectionPeriod).fill(linkClicksValArrPsd)
    );
    for (let i = 0; i < projectionPeriod; i++) {
      linkClicksValArrResult2[i] = Math.floor(linkClicksValArrResult1[i]);
    }
    console.log("linkClicksValArrResult2", linkClicksValArrResult2);
    // let linkClicksValArrTwodecimal = linkClicksValArrResult.map(function (each_element) {
    //   return Number(each_element?.toFixed(2));
    // });
    let pageViewsVal = linkClicksVal * landingPageView;
    let pageViewsValArrPsd = pageViewsVal / 100;
    console.log("AAAA");
    console.log(reachVal);
    console.log(clickThroughRate);

    let pageViewsValArr = [];
    let pageViewsValTwodecimalResult = [];
    let pageViewsValArrResult = pageViewsValArr.concat(
      Array(projectionPeriod).fill(pageViewsValArrPsd)
    );
    let pageViewsValTwodecimal = pageViewsValArrResult.map(function (
      each_element
    ) {
      return Number(each_element?.toFixed(2));
    });
    for (let i = 0; i < projectionPeriod; i++) {
      pageViewsValTwodecimalResult[i] = Math.floor(pageViewsValTwodecimal[i]);
    }
    console.log(
      "pageViewsValTwodecimalResult :>> ",
      pageViewsValTwodecimalResult
    );
    let inboundLeadsVal = pageViewsVal * leadGenerationRate;
    let inboundLeadNew = inboundLeadsVal / 1000 / 10;
    console.log("inboundLeadsVal/1000/10 :>> ", inboundLeadsVal / 1000 / 10);

    let inboundLeadsArr = [];
    let inboundLeadsArrResult2 = [];
    let inboundLeadsArrResult1 = inboundLeadsArr.concat(
      Array(projectionPeriod).fill(inboundLeadNew)
    );
    for (let i = 0; i < projectionPeriod; i++) {
      inboundLeadsArrResult2[i] = Math.floor(inboundLeadsArrResult1[i]);
    }
    console.log("inboundLeadsArrResult2 :>> ", inboundLeadsArrResult2);
    let inboundCustomersVal = inboundLeadsVal * (conversionRate / 100);
    let inboundCustNewVal = Math.floor(inboundCustomersVal / 1000 / 10);

    let inboundCustomersValArr = [];
    let inboundCustomersValArrResult2 = [];
    let inboundCustomersValArrResult1 = inboundCustomersValArr.concat(
      Array(projectionPeriod).fill(inboundCustNewVal)
    );
    for (let i = 0; i < projectionPeriod; i++) {
      inboundCustomersValArrResult2[i] = Math.floor(
        inboundCustomersValArrResult1[i]
      );
    }
    let inboundRevenueVal =
      Math.floor(inboundCustomersVal / 100 / 100) * realisedRev;
    let inboundRevenueValArr = [];
    let inboundRevenueValResult = inboundRevenueValArr.concat(
      Array(projectionPeriod).fill(inboundRevenueVal)
    );
    let roasVal =
      inboundRevenueVal > 0 ? inboundRevenueVal / advertisingSpendVal : 0;
    let roasValArr = [];
    let roasValArrResult = roasValArr.concat(
      Array(projectionPeriod).fill(roasVal)
    );
    let inboundGrossProfitVal = inboundRevenueVal * (1 - blendedCogs / 100);

    let inboundGrossProfitValArr = [];
    let inboundGrossProfitValResult = inboundGrossProfitValArr.concat(
      Array(projectionPeriod).fill(inboundGrossProfitVal)
    );
    let inboundROIVal =
      inboundGrossProfitVal > 0
        ? inboundGrossProfitVal / advertisingSpendVal
        : 0;

    let inboundROIValArr = [];
    let inboundROIValResult = inboundROIValArr.concat(
      Array(projectionPeriod).fill(inboundROIVal)
    );

    let organicLeadsVal =
      organicViewsPerMonth * (organicViewsLeadToConversionRate / 100);
    console.log("organicLeadsVal :>> ", organicViewsLeadToConversionRate / 100);
    let organicLeadsValArr = [];
    let organicLeadsValArrResult2 = [];
    let organicLeadsValArrResult1 = organicLeadsValArr.concat(
      Array(projectionPeriod).fill(organicLeadsVal)
    );
    console.log("organicLeadsValArrResult1 :>> ", organicLeadsValArrResult1);
    for (let i = 0; i < projectionPeriod; i++) {
      organicLeadsValArrResult2[i] = Math.floor(organicLeadsValArrResult1[i]);
    }
    console.log("organicLeadsValArrResult2 :>> ", organicLeadsValArrResult2);

    let organicCustomersVal =
      organicLeadsVal * (organicleadToCustomerConversionRate / 100);
    console.log("organicCustomersVal :>> ", organicCustomersVal);
    let organicCustomersValArr = [];
    let organicCustomersValArrResult2 = [];
    let organicCustomersValArrResult1 = organicCustomersValArr.concat(
      Array(projectionPeriod).fill(organicCustomersVal)
    );
    for (let i = 0; i < projectionPeriod; i++) {
      organicCustomersValArrResult2[i] = Math.floor(
        organicCustomersValArrResult1[i]
      );
    }
    // console.log('organicCustomersValArrResult2 :>> ', organicCustomersValArrResult2);

    let organicRevenueVal = organicCustomersVal * realisedRev;
    let organicRevenueValArr = [];
    let organicRevenueValResult = organicRevenueValArr.concat(
      Array(projectionPeriod).fill(organicRevenueVal)
    );

    let organicGrossProfitVal = organicRevenueVal * (1 - blendedCogs / 100);
    let organicGrossProfitValArr = [];
    let organicGrossProfitValResult = organicGrossProfitValArr.concat(
      Array(projectionPeriod).fill(organicGrossProfitVal)
    );

    let marketingSpendVal = sdrSalary + advertisingSpendVal;
    let marketingCustomersAcquiredVal = [];
    // console.log('marketingSpendVal :>> ', marketingSpendVal);
    for (let i = 0; i < projectionPeriod; i++) {
      marketingCustomersAcquiredVal[i] =
        outboundCustValRes[i] +
        inboundCustomersValArrResult2[i] +
        organicCustomersValArrResult2[i];
    }
    console.log(
      "marketingCustomersAcquiredVal :>> ",
      marketingCustomersAcquiredVal
    );

    let marketingRevenueVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      marketingRevenueVal[i] = marketingCustomersAcquiredVal[i] * realisedRev;
    }
    console.log("marketingRevenueVal :>> ", marketingRevenueVal);
    let marketRevenueVal = [];
    let marketRevenueValResult = marketRevenueVal.concat(
      Array(projectionPeriod).fill(marketingRevenueVal)
    );
    console.log("marketRevenueValResult :>> ", marketRevenueValResult);
    let marketingGrossProfitVal = [];

    for (let i = 0; i < projectionPeriod; i++) {
      marketingGrossProfitVal[i] =
        marketingRevenueVal[i] * (1 - blendedCogs / 100);
    }
    console.log("marketingGrossProfitVal :>> ", marketingGrossProfitVal);
    let marketingGrossProfitTwodecimal = marketingGrossProfitVal.map(function (
      each_element
    ) {
      return Number(parseFloat(each_element)?.toFixed(2));
    });

    let marketingGroProVal = marketingGrossProfitVal[0];

    let marketingROIVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      marketingROIVal[i] = marketingGrossProfitVal[i] / marketingSpendVal;
    }
    // console.log('marketingROIVal :>> ', marketingROIVal);

    let setMarketROI = marketingROIVal[0];

    let totalCustomerBaseVal1;
    for (let i = 0; i < projectionPeriod; i++) {
      totalCustomerBaseVal1 =
        numberOfCustomers + marketingCustomersAcquiredVal[i];
      console.log(
        "totalCustomerBaseVal1 :>> ",
        parseInt(totalCustomerBaseVal1)
      );
    }

    let totalReferrersVal1;
    for (let i = 0; i < projectionPeriod; i++) {
      totalReferrersVal1 =
        (totalCustomerBaseVal1 * referresOutOfCustomers) / 100; //C
    }

    console.log("totalReferrersVal1", totalReferrersVal1); //C

    let totalCustomerBaseVal = [];
    totalCustomerBaseVal.splice(0, 0, totalCustomerBaseVal1);
    let totalReferrersVal = [];
    totalReferrersVal.splice(0, 0, totalReferrersVal1);
    console.log("totalReferrersVal IN :>> ", totalReferrersVal);
    let resultOfTotalReferrersVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      totalCustomerBaseVal[i + 1] =
        marketingCustomersAcquiredVal[i + 1] + totalCustomerBaseVal[i];

      totalReferrersVal[i] =
        (totalCustomerBaseVal[i] * referresOutOfCustomers) / 100;
      console.log("totalReferrerVal[i]", Math.floor(totalReferrersVal[i]));

      resultOfTotalReferrersVal[i] = Math.floor(totalReferrersVal[i]);
      totalCustomerBaseVal[i + 1] += resultOfTotalReferrersVal[i];
    }

    console.log("resultOfTotalReferrersVal :>> ", resultOfTotalReferrersVal);
    console.log("totalCustomerBaseVal:", totalCustomerBaseVal);
    console.log("totalReferrersVal:", totalReferrersVal);

    let totalCustomerBaseValResult =
      totalCustomerBaseVal[totalCustomerBaseVal.length - 2];

    let returningCustomersVal =
      parseFloat(totalCustomerBaseVal / 100 / 100)?.toFixed(2) *
      (returningCustomerRate / 100);

    console.log("returningCustomersVal :>> ", returningCustomersVal);

    let realisedRevVal = [];
    let realisedRevResult = realisedRevVal.concat(
      Array(projectionPeriod).fill(realisedRev)
    );
    console.log("realisedRevResult :>> ", realisedRevResult);
    let totalCustBaseVal = [];
    let custBasVal = Math.floor(totalCustomerBaseVal / 100 / 100)?.toFixed(2);
    let totalCustValResult = totalCustBaseVal.concat(
      Array(projectionPeriod).fill(parseInt(custBasVal))
    );
    const totalCustValcumulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(0);
    let totalCustValRes = totalCustValResult.map(totalCustValcumulativeSum);
    console.log("totalCustValRes :>> ", totalCustValRes);
    let returningCustomerArray = [];
    for (let i = 0; i < Math.min(totalCustValResult.length); i++) {
      returningCustomerArray[i] = Math.floor(
        (totalCustomerBaseVal[i] * returningCustomerRate) / 100
      ).toFixed(0);
    }
    console.log("returningCustomerArray :>> ", returningCustomerArray);
    let monthlyReturningRevenueVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      monthlyReturningRevenueVal[i] =
        (returningCustomerArray[i] * realisedRevResult[i]) / timeToReturn;
      console.log(
        "monthlyReturningRevenueVal :>> ",
        monthlyReturningRevenueVal
      );
    }

    let refundCostLossVal = avgOrderValue + fixedLossPerRefund;
    console.log("refundCostLossVal :>> ", refundCostLossVal); //C
    let refundCostLossValArr = [];
    let refundCostLossValResult = refundCostLossValArr.concat(
      Array(projectionPeriod).fill(refundCostLossVal)
    );
    console.log("refundCostLossValResult :>> ", refundCostLossValResult); //C

    //C
    let totalInviteesVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      totalInviteesVal[i] = Math.floor(
        resultOfTotalReferrersVal[i] * inviteesPerReferral
      );
    }
    console.log("totalInviteesVal :>> ", totalInviteesVal);
    let totalInviteesValArr = [];
    let totalInviteesTruncVal = truncate(totalInviteesVal / 1000 / 10, 1); //C
    let totalInviteesValResult = totalInviteesValArr.concat(
      Array(projectionPeriod).fill(totalInviteesTruncVal)
    ); //C
    console.log("totalInviteesValResult :>> ", totalInviteesValResult);
    let summationOftotalInviteesValResult = totalInviteesValResult.reduce(
      (partialSum, a) => partialSum + a,
      0
    ); //C
    let referralCustomersVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      referralCustomersVal[i] = Math.floor(
        totalInviteesVal[i] * (inviteesConversionRate / 100)
      );
    }
    console.log("referralCustomersVal :>> ", referralCustomersVal);
    let referralCustomersArr = [];
    let referralCustomersResult = referralCustomersArr.concat(
      Array(projectionPeriod).fill(referralCustomersVal)
    ); //C
    console.log("referralCustomersResult :>> ", referralCustomersResult);

    let realisedRevArr = []; //C
    let realisedRevArrResult = realisedRevArr.concat(
      Array(projectionPeriod).fill(realisedRev)
    );
    let referralRevenueVal = []; //C
    let reffRevTruncateVal;
    for (let i = 0; i < Math.min(totalCustValResult.length); i++) {
      referralRevenueVal[i] = referralCustomersVal[i] * realisedRevResult[i];
      reffRevTruncateVal = truncate(referralRevenueVal[i], 2);
    }
    console.log("referralRevenueVal :>> ", referralRevenueVal);
    //C
    let referralRevenueValArr = [];
    let referralRevenueValResult = referralRevenueValArr.concat(
      Array(projectionPeriod).fill(reffRevTruncateVal)
    );
    let summationOfreferralRevenueTruncVallResult =
      referralRevenueValResult.reduce((partialSum, a) => partialSum + a, 0); //C
    let totalReferrersValArr = [];
    let totalReferrersValResult = totalReferrersValArr.concat(
      Array(projectionPeriod).fill(truncate(totalReferrersVal / 1000 / 10, 2))
    ); //C
    console.log("totalReferrersValResult :>> ", totalReferrersValResult);
    let summationOftotalReferrersValResult = referralRevenueValResult.reduce(
      (partialSum, a) => partialSum + a,
      0
    ); //C
    console.log(
      "summationOftotalReferrersValResult :>> ",
      summationOftotalReferrersValResult
    );
    let val =
      monthlyReturningRevenueVal + marketingRevenueVal + referralRevenueVal;
    let lessDebtVal = debt / 100;

    //**/  #1 **//
    let marRevenue = [];
    let marRevenueResult = marRevenue.concat(
      Array(projectionPeriod).fill(marketingRevenueVal)
    );
    const marRevenuecumulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(0);
    let marRevenueRes = marRevenueResult.map(marRevenuecumulativeSum);

    //**/  #2 **//

    let marketRevenueValSum = marketingRevenueVal * projectionPeriod;

    //**/  #3 **//

    let monthlyRetVal = [];
    let monthlyRetValResult = monthlyRetVal.concat(
      Array(projectionPeriod).fill(monthlyReturningRevenueVal)
    );
    const monthlyRetValcumulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(0);
    let monthlyRetValRes = monthlyReturningRevenueVal.map(
      monthlyRetValcumulativeSum
    );

    let monthlyRetValResTwodecimal = monthlyReturningRevenueVal.map(function (
      each_element
    ) {
      return Number(parseFloat(each_element)?.toFixed(2));
    });

    let costToMarketReturnVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      costToMarketReturnVal[i] =
        monthlyReturningRevenueVal[i] * (costToMarketReturn / 100);
    }

    let costToMarketReturnValTwodecimal = costToMarketReturnVal.map(function (
      each_element
    ) {
      return Number(each_element?.toFixed(2));
    });

    let refundCostLossResult = marRevenue.concat(
      Array(projectionPeriod).fill(refundCostLossVal)
    );
    const lastItem = totalCustValRes[totalCustValRes.length - 1];
    let marAcqVal = Math.floor(marketingCustomersAcquiredVal / 100 / 100);
    let marCustAcq = marAcqVal * projectionPeriod;
    let marCustAcqArr = [];
    let marCustAcqResult = marCustAcqArr.concat(
      Array(projectionPeriod).fill(marAcqVal)
    );

    let reffCustVal = [];
    let reffCustValResult = reffCustVal.concat(
      Array(projectionPeriod).fill(referralCustomersVal)
    );
    console.log("reffCustValResult :>> ", reffCustValResult);
    let retCustNewArr = [];
    for (let i = 0; i < Math.min(returningCustomerArray.length); i++) {
      retCustNewArr[i] = returningCustomerArray[i] * (refundRate / 100);
    }
    console.log("retCustNewArr1 :>> ", retCustNewArr);
    let retCustAcqNewArr = [];
    for (let i = 0; i < Math.min(marketingCustomersAcquiredVal.length); i++) {
      retCustAcqNewArr[i] =
        marketingCustomersAcquiredVal[i] * (refundRate / 100);
      console.log("retCustAcqNewArr :>> ", Math.round(retCustAcqNewArr[i]));
    }

    let reffCustNewArr = [];
    for (let i = 0; i < Math.min(referralCustomersVal.length); i++) {
      // let truncReffCustNewArrVal = truncate(reffCustValResult[i], 3);
      reffCustNewArr[i] = referralCustomersVal[i] * (refundRate / 100); //C
      // console.log('truncReffCustNewArrVal :>> ', truncReffCustNewArrVal);
    }

    let resultOfRefundOrders = [];
    for (let i = 0; i < projectionPeriod; i++) {
      resultOfRefundOrders[i] = Math.trunc(
        retCustNewArr[i] + retCustAcqNewArr[i] + reffCustNewArr[i]
      );
    }

    console.log("resultOfRefundOrders :>> ", resultOfRefundOrders);
    var resultOftotalRefundOrdersVal1 = retCustNewArr.map(function (num, idx) {
      return num + retCustAcqNewArr[idx];
    });

    console.log(
      "resultOftotalRefundOrdersVal1 :>> ",
      resultOftotalRefundOrdersVal1
    );

    //C
    // let retCustVal1 = truncate(returningCustomersVal, 2) * (refundRate / 100);
    // let retCustRes = retCustVal1;
    // let retCustVal2 = Math.floor(marketingCustomersAcquiredVal / 100 / 100) * (refundRate / 100);
    // let reffCustValRef = referralCustomersVal * (refundRate / 100);
    // let totalRefundOrdersVal = retCustRes + retCustVal2 + reffCustValRef;
    // let totalRefundLossVal = totalRefundOrdersVal * refundCostLossValResult;
    // let totalRefundLossValArr = [];
    // let totalRefundLossValResult = totalRefundLossValArr.concat(Array(projectionPeriod).fill(totalRefundLossVal));
    // console.log('retCustRes :>> ', retCustRes);
    // console.log('retCustVal2 :>> ', retCustVal2);
    // console.log('reffCustValRef :>> ', reffCustValRef);
    // console.log('totalRefundOrdersVal :>> ', totalRefundOrdersVal);
    let roundTotalRefOrderVal = Math.round(resultOftotalRefundOrdersVal1);
    console.log("roundTotalRefOrderVal :>> ", roundTotalRefOrderVal);
    var resultOftotalRefundOrdersVal2 = resultOftotalRefundOrdersVal1.map(
      function (num, idx) {
        return num + reffCustNewArr[idx];
      }
    );
    console.log(
      "resultOftotalRefundOrdersVal2 :>> ",
      resultOftotalRefundOrdersVal2
    );
    let resultOftotalRefundOrdersTwodecimal = resultOftotalRefundOrdersVal2.map(
      function (each_element) {
        return Number(each_element?.toFixed(0));
      }
    );

    console.log(
      "resultOftotalRefundOrdersTwodecimal :>> ",
      resultOftotalRefundOrdersTwodecimal
    );

    let totalRefLoss = [];
    for (let i = 0; i < Math.min(refundCostLossResult.length); i++) {
      totalRefLoss[i] = resultOfRefundOrders[i] * refundCostLossResult[i]; //C
    }
    console.log("totalRefLoss :>> ", totalRefLoss);
    let totalRefLossTwodecimal = totalRefLoss.map(function (each_element) {
      return Number(each_element?.toFixed(2));
    });

    let totalGrossRevVal1 = marketingRevenueVal.map(function (num, idx) {
      return num + monthlyReturningRevenueVal[idx];
    });

    let totalGrossRevVal2 = totalGrossRevVal1.map(function (num, idx) {
      return num + referralRevenueVal[idx];
    });

    let totalGrossRevValRes = totalGrossRevVal2.map(function (num, i) {
      return num - totalRefLoss[i];
    });

    console.log("totalGrossRevValRes", totalGrossRevValRes);

    let totalGrossProfitBeforeAdspendVal = [];
    for (let i = 0; i < Math.min(marCustAcqResult.length); i++) {
      totalGrossProfitBeforeAdspendVal[i] =
        totalGrossRevValRes[i] - totalGrossRevValRes[i] * (blendedCogs / 100);
      console.log(
        "totalGrossProfitBeforeAdspendVal1 :>> ",
        totalGrossProfitBeforeAdspendVal
      );
    }

    var sumoftotalGrossProfitBeforeAdspendVal = 0;
    for (let i = 0; i < totalGrossProfitBeforeAdspendVal.length; i++) {
      sumoftotalGrossProfitBeforeAdspendVal +=
        totalGrossProfitBeforeAdspendVal[i];
    }

    var total = 0;
    for (let i = 0; i < totalGrossRevValRes.length; i++) {
      total += totalGrossRevValRes[i];
    }

    console.log("zzz", total);
    // let grossMarginProfitBeforeAdspendVal = (totalGrossProfitBeforeAdspendVal / totalGrossRevenueVal) * 100;
    // I62
    let grossMarginProfitBeforeAdspendVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      grossMarginProfitBeforeAdspendVal[i] =
        (totalGrossProfitBeforeAdspendVal[i] / totalGrossRevValRes[i]) * 100;
    }

    var totalgrossMarginProfitBeforeAdspendVal = 0;
    for (let i = 0; i < grossMarginProfitBeforeAdspendVal.length; i++) {
      totalgrossMarginProfitBeforeAdspendVal +=
        grossMarginProfitBeforeAdspendVal[i];
    }
    // console.log('totalgrossMarginProfitBeforeAdspendVal :>> ', totalgrossMarginProfitBeforeAdspendVal);

    let marSpendSumVal = [];
    let marketingSpendResult = marSpendSumVal.concat(
      Array(projectionPeriod).fill(marketingSpendVal)
    );

    let custAcqCost1 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      custAcqCost1[i] = marketingSpendResult[i];
      console.log("custAcqCost1 :>> ", custAcqCost1);
    }
    let custAcqCost2 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      custAcqCost2[i] = marketingCustomersAcquiredVal[i] * projectionPeriod;
    }

    let custAcqCost;
    const lastItemOftotalCustomerBaseVal =
      totalCustomerBaseVal[totalCustomerBaseVal.length - 2];
    for (let i = 0; i < projectionPeriod; i++) {
      console.log(
        "lastItemOftotalCustomerBaseVal :>> ",
        lastItemOftotalCustomerBaseVal
      );
      custAcqCost =
        sumArrayofCustAcqCost1(custAcqCost1) / lastItemOftotalCustomerBaseVal;
      console.log("custAcqCost new:>> ", custAcqCost);
    }
    // console.log('custAcqCost :>> ', custAcqCost);
    // I63
    let totalGrossProfAdSpend = [];
    for (let i = 0; i < projectionPeriod; i++) {
      totalGrossProfAdSpend[i] =
        totalGrossRevValRes[i] -
        totalGrossRevValRes[i] * (blendedCogs / 100) -
        marketingSpendResult[i];
    }

    console.log("totalGrossProfAdSpend :>> ", totalGrossProfAdSpend);

    var sumoftotalGrossProfAdSpend = 0;
    for (let i = 0; i < totalGrossProfAdSpend.length; i++) {
      sumoftotalGrossProfAdSpend += totalGrossProfAdSpend[i];
    }

    // I64
    let grossMarginProfitAfterAdspendVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      grossMarginProfitAfterAdspendVal[i] =
        (totalGrossProfAdSpend[i] / totalGrossRevValRes[i]) * 100;
    }

    var totalgrossMarginProfitAfterAdspendVal = 0;
    for (let i = 0; i < grossMarginProfitAfterAdspendVal.length; i++) {
      totalgrossMarginProfitAfterAdspendVal +=
        grossMarginProfitAfterAdspendVal[i];
    }

    let grossProfitBeforeAdspendPerCustPerMonthVal = [];
    let finalGrossProfitBeforeAdspendPerCustPerMonthVal;
    let grossProfitBefAdspendMulVal = [];
    let convertedArray = returningCustomerArray.map((element) =>
      Number(element)
    );

    for (let i = 0; i < projectionPeriod; i++) {
      grossProfitBefAdspendMulVal[i] =
        marketingCustomersAcquiredVal[i] + convertedArray[i];
      console.log(
        "grossProfitBefAdspendMulVal :>> ",
        grossProfitBefAdspendMulVal
      );
      grossProfitBeforeAdspendPerCustPerMonthVal[i] =
        truncate(totalGrossProfitBeforeAdspendVal[i], 2) /
        grossProfitBefAdspendMulVal[i];

      finalGrossProfitBeforeAdspendPerCustPerMonthVal =
        grossProfitBeforeAdspendPerCustPerMonthVal[i];
      console.log(
        "finalGrossProfitBeforeAdspendPerCustPerMonthVal :>> ",
        finalGrossProfitBeforeAdspendPerCustPerMonthVal
      );
    }

    var totalgrossProfitBeforeAdspendPerCustPerMonthVal = 0;
    for (
      let i = 0;
      i < grossProfitBeforeAdspendPerCustPerMonthVal.length;
      i++
    ) {
      totalgrossProfitBeforeAdspendPerCustPerMonthVal +=
        grossProfitBeforeAdspendPerCustPerMonthVal[i];

      console.log(
        "totalgrossProfitBeforeAdspendPerCustPerMonthVal :>> ",
        totalgrossProfitBeforeAdspendPerCustPerMonthVal
      );
    }

    // let totalGrossProfAftAdSpend = [];
    // for (let i = 0; i < projectionPeriod; i++) {
    //   totalGrossProfAftAdSpend[i] = totalGrossProfAdSpend[i] - marketingSpendResult[i];
    // }
    // console.log('totalGrossProfAftAdSpend :>> ', totalGrossProfAftAdSpend);

    let grossProfitAfterAdspendPerCustPerMonthVal = [];
    let sumOfMarketingCustAcqConArr = [];
    for (let i = 0; i < projectionPeriod; i++) {
      sumOfMarketingCustAcqConArr[i] =
        marketingCustomersAcquiredVal[i] + convertedArray[i];

      grossProfitAfterAdspendPerCustPerMonthVal[i] =
        totalGrossProfAdSpend[i] / sumOfMarketingCustAcqConArr[i];
    }

    console.log(
      "grossProfitAfterAdspendPerCustPerMonthVal :>> ",
      grossProfitAfterAdspendPerCustPerMonthVal
    );

    let grossProfitAfAdsPerCustNewVal =
      grossProfitAfterAdspendPerCustPerMonthVal.slice(-1)[0];

    var totalgrossProfitAfterAdspendPerCustPerMonthVal = 0;
    for (let i = 0; i < grossProfitAfterAdspendPerCustPerMonthVal.length; i++) {
      totalgrossProfitAfterAdspendPerCustPerMonthVal +=
        grossProfitAfterAdspendPerCustPerMonthVal[i];
    }

    let upFrontInvestmentCostsVal = upFrontInvestmentCosts;

    // Pay processor Fees Val
    let payProcessorSubVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      payProcessorSubVal = (realisedRev * paymentProcessorFees) / 100;
    }

    let paymentProcessFeesPerOrderVal = [];
    let paymentProcessorFeesPerOrderResult =
      paymentProcessFeesPerOrderVal.concat(
        Array(projectionPeriod).fill(payProcessorSubVal)
      );

    // realisedRevResult

    // I56
    let referralCustVal = [];
    let referralCustValResult = referralCustVal.concat(
      Array(projectionPeriod).fill(referralCustomers)
    );

    //  I57
    let referralRevValResult = [];
    for (let i = 0; i < projectionPeriod; i++) {
      referralRevValResult[i] = referralCustValResult[i] * realisedRevVal[i];
    }

    // I70
    let merAccPerOrder = [];
    for (let i = 0; i < projectionPeriod; i++) {
      merAccPerOrder[i] = realisedRevResult[i] * (merchantAccountFees / 100);
    }

    var totalmerAccPerOrder = 0;
    for (let i = 0; i < merAccPerOrder.length; i++) {
      totalmerAccPerOrder += merAccPerOrder[i];
    }

    // marCustAcqResult
    //returningCustomerArray
    // reffCustNewArr

    let payProcVal1 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      payProcVal1[i] =
        marketingCustomersAcquiredVal[i] *
        paymentProcessorFeesPerOrderResult[i];
    }
    let payProcVal2 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      payProcVal2[i] =
        returningCustomerArray[i] * paymentProcessorFeesPerOrderResult[i];
    }

    let payProcVal3 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      payProcVal3[i] =
        referralCustomersVal[i] * paymentProcessorFeesPerOrderResult[i];
    }

    let payProcValTotal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      payProcValTotal[i] = payProcVal1[i] + payProcVal2[i] + payProcVal3[i];
      console.log("payProcValTotal[i] :>> ", payProcValTotal[i]);
    }

    var totalofpayProcValTotal = 0;
    for (let i = 0; i < payProcValTotal.length; i++) {
      totalofpayProcValTotal += payProcValTotal[i];
    }

    let merAccFee1 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      merAccFee1[i] = marketingCustomersAcquiredVal[i] * merAccPerOrder[i];
    }

    let merAccFee2 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      merAccFee2[i] = returningCustomerArray[i] * merAccPerOrder[i];
    }
    let merAccFee3 = [];

    for (let i = 0; i < projectionPeriod; i++) {
      merAccFee3[i] = referralCustomersVal[i] * merAccPerOrder[i];
    }
    let merAccTotalFee = [];

    for (let i = 0; i < projectionPeriod; i++) {
      merAccTotalFee[i] = merAccFee1[i] + merAccFee2[i] + merAccFee3[i];
    }

    var totalofmerAccTotalFee = 0;
    for (let i = 0; i < merAccTotalFee.length; i++) {
      totalofmerAccTotalFee += merAccTotalFee[i];
    }

    let totalFixedCostSubVal1 = [];
    for (let i = 0; i < projectionPeriod; i++) {
      totalFixedCostSubVal1[i] =
        (fixedCostIncreasePerHundredCustomers / 100) *
        marketingCustomersAcquiredVal[i];
    }

    let totalFixedCostsVal = [];

    for (let i = 0; i < projectionPeriod; i++) {
      totalFixedCostsVal[i] = totalFixedCostSubVal1[i] + fixedCostPerMonth;
    }

    var sumoftotalFixedCostsVal = 0;
    for (let i = 0; i < totalFixedCostsVal.length; i++) {
      sumoftotalFixedCostsVal += totalFixedCostsVal[i];
    }

    let totFixedCostVal = [];
    let totFixedCostValResult = totFixedCostVal.concat(
      Array(projectionPeriod).fill(totalFixedCostsVal)
    );

    // earnings b4 int & tax arr
    let earBefIntTaxArr = [];

    for (let i = 0; i < projectionPeriod; i++) {
      earBefIntTaxArr[i] =
        totalGrossProfAdSpend[i] -
        payProcValTotal[i] -
        merAccTotalFee[i] -
        totalFixedCostsVal[i] -
        0;
      let earBefIntTwodecimal = earBefIntTaxArr.map(function (each_element) {
        return Number(each_element?.toFixed(2));
      });

      var totalearBefIntTaxArr = 0;
      for (let i = 0; i < earBefIntTaxArr.length; i++) {
        totalearBefIntTaxArr += earBefIntTaxArr[i];
      }
    }

    let cashTaxesVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      cashTaxesVal[i] =
        earBefIntTaxArr[i] > 0 ? (earBefIntTaxArr[i] * taxRate) / 100 : 0;
    }

    let cashTaxesValTwodecimal = cashTaxesVal.map(function (each_element) {
      return Number(each_element?.toFixed(2));
    });

    var totalcashTaxesVal = 0;
    for (let i = 0; i < cashTaxesValTwodecimal.length; i++) {
      totalcashTaxesVal += cashTaxesValTwodecimal[i];
    }

    let debtArr = [];
    let debtInterestPayableVal = (debt * (debtInterestRate / 100)) / 12;
    let debtIntPayableArr = debtArr.concat(
      Array(projectionPeriod).fill(debtInterestPayableVal)
    );

    var totaldebtIntPayableArr = 0;
    for (let i = 0; i < debtIntPayableArr.length; i++) {
      totaldebtIntPayableArr += debtIntPayableArr[i];
    }

    let unleveredFreeCashFlowVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      unleveredFreeCashFlowVal[i] =
        earBefIntTaxArr[i] - cashTaxesVal[i] - debtIntPayableArr[i];
    }

    var totalunleveredFreeCashFlowVal = 0;
    for (let i = 0; i < unleveredFreeCashFlowVal.length; i++) {
      totalunleveredFreeCashFlowVal += unleveredFreeCashFlowVal[i];
    }

    let earningAfterIntAndTaxVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      earningAfterIntAndTaxVal[i] = unleveredFreeCashFlowVal[i];
    }

    let cashInBnkArr = [];
    for (let i = 0; i < projectionPeriod; i++) {
      let cashVal = [];
      cashVal = earBefIntTaxArr[0];

      cashInBnkArr[i] = cashInBank + earningAfterIntAndTaxVal[i];
    }

    console.log("cashInBnkArr :>> ", cashInBnkArr);

    let newArrayy = [];
    newArrayy = cashInBnkArr;

    let cashInBankArrVal = [];
    let arrayofCash = [];
    cashInBankArrVal.push(cashInBnkArr[0]);

    for (let i = 0; i < projectionPeriod; i++) {
      // const arrOfNum = [];
      //       arrOfNum[i] = newArrayy[i];
      // console.log('arrOfNum :>> ', arrOfNum);
      //       // const arrOfNum2 = unleveredFreeCashFlowVal
      //       const arrOfNum2 = [];
      //        arrOfNum2[i] = earningAfterIntAndTaxVal[i];
      //       console.log('arrOfNum2 :>> ', arrOfNum2);
      cashInBankArrVal.push(
        cashInBankArrVal[i] + earningAfterIntAndTaxVal[i + 1]
      );

      // cashInBankArrVal[i + 1] = newArrayy[i] + earningAfterIntAndTaxVal[i + 1];
      // console.log('arrOfNum[i] + arrOfNum2[i + 1] :>> ', arrOfNum[i] + arrOfNum2[i + 1]);
      console.log("cashInBankArrVal :>> ", cashInBankArrVal);
      // arrayofCash[i] = newArrayy.push(arrOfNum[i] + arrOfNum2[i + 1]);
    }
    let newArrayyTwodecimal = newArrayy.map(function (each_element) {
      return Number(each_element?.toFixed(2));
    });

    let totalCashInBank = cashInBankArrVal[cashInBankArrVal.length - 2];
    console.log("totalCashInBank :>> ", totalCashInBank);
    let cashROICompDayArr = [];

    let cashRoI = [];

    let roiValArr = [];

    for (let i = 0; i < projectionPeriod; i++) {
      cashROICompDayArr[i] = cashInBankArrVal[i] / parseInt(cashInBank);

      roiValArr[i] = newArrayy[i];

      cashRoI[i] = cashROICompDayArr[i] * 1000 * 1000;
    }

    console.log("cashROICompDayArr :>> ", cashROICompDayArr);

    let roiOutput = roiValArr.slice(-1)[0];

    // New Chnages for equity val
    let eVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      eVal[i] = unleveredFreeCashFlowVal[i] / (1 + discountRate / 100 / 12);
    }

    let eVal1 = 1 + discountRate / 100 / 12;

    // let eValPow = Math.pow(eVal1, projectionPeriod);
    let enterPriseValue = [];
    let conResult = [];
    for (let i = 0; i < projectionPeriod; i++) {
      let firstEVal =
        unleveredFreeCashFlowVal[0] / (1 + discountRate / 100 / 12);
      let enterPriseValueFirst = [];
      enterPriseValueFirst.unshift(firstEVal);

      let eValPow = Math.pow(1 + discountRate / 100 / 12, i + 1);

      // enterPriseValueFirst.splice(0, enterPriseValue);

      enterPriseValue[i] = unleveredFreeCashFlowVal[i] / eValPow;

      conResult = enterPriseValueFirst.concat(enterPriseValue);
      conResult.splice(1, 1);
    }

    let enterPriseValueTwodecimal = conResult.map(function (each_element) {
      return Number(each_element?.toFixed(2));
    });

    let plusCashVal = cashInBank;

    let plusCashArr = [];
    plusCashArr.push(plusCashVal);

    //  let cashROIData = cashROICompDayArr;
    let plusData = plusCashArr.concat(cashRoI);
    console.log("plusData :>> ", plusData);
    let plusDatatotal = plusData[plusData.length - 2];

    let lessDebtArr = [];
    let lessDebtArrResult = lessDebtArr.concat(
      Array(projectionPeriod).fill(lessDebt)
    );

    let lessDebttotal = lessDebtArrResult.slice(-1)[0];

    let equityValArr = [];
    for (let i = 0; i < projectionPeriod; i++) {
      equityValArr[i] =
        enterPriseValue[i] > 0 || enterPriseValue[i] < 0
          ? enterPriseValue[i] + plusData[i] - lessDebtArrResult[i]
          : 0;
    }

    //   let equityValTwodecimal = equityValArr.map(function(each_element){
    //     return Number(each_element?.toFixed(2));
    // });

    let equityValTotal = equityValArr.slice(-1)[0];

    let enterpriseValTotal = enterPriseValue.slice(-1)[0];

    let cashROIDayTotal = cashROICompDayArr.slice(-1)[0];

    let finalCashROICompToDayVal = cashInBank > 0 ? cashROIDayTotal : "False";

    let finalCashROICompToDayValArray = [];
    for (let i = 0; i < projectionPeriod; i++) {
      finalCashROICompToDayValArray[i] = finalCashROICompToDayVal[i];
    }

    // let equityValRes = [];
    // for (let i = 0; i < projectionPeriod; i++) {
    //   equityValRes[i] = eVal < 0 || eval > 0 ? eVal + plusCashVal + lessDebtVal : 0;
    // }

    let equityValueShareVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      equityValueShareVal[i] = equityValArr[i] / numberOfShares;
    }

    var totalequityValueShareVal = equityValueShareVal.slice(-1)[0];
    let avgTerminalSubVal1 = [];
    let multiplyVal = 1 + perpetualGrowthRate / 100;

    for (let i = 0; i < projectionPeriod; i++) {
      avgTerminalSubVal1[i] = unleveredFreeCashFlowVal[i] * multiplyVal;
    }

    let avgTerminalSubVal2 = [];
    let rem = discountRate / 100 - perpetualGrowthRate / 100;

    for (let i = 0; i < projectionPeriod; i++) {
      avgTerminalSubVal2[i] = avgTerminalSubVal1[i] / rem;
    }
    let avgTerValTotal = avgTerminalSubVal2.slice(-1)[0];

    let totalCustBaseLastVal = totalCustValRes.slice(-1)[0];

    let returnCustomertotal = returningCustomerArray.slice(-1)[0];

    let overAllCashInBankVal = cashInBank + earningAfterIntAndTaxVal;
    let cashROICompToDayVal =
      cashInBank > 0 ? overAllCashInBankVal / cashInBank : 0;

    let cashPaybackPeriodVal = [];
    for (let i = 0; i < projectionPeriod; i++) {
      cashPaybackPeriodVal[i] = cashROICompDayArr[i] < 1 ? "False" : "True";
    }

    let lastIndexOfcashPaybackPeriodVal = cashPaybackPeriodVal.slice(-1)[0];

    let cashROIArr = [];
    let cashROIArrResult = cashROIArr.concat(
      Array(projectionPeriod).fill(cashROICompToDayVal)
    );
    const cashROIArrCummulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(0);
    let res = cashROIArrResult.map(cashROIArrCummulativeSum);

    let lifetimeValPerCustResult = total / totalCustomerBaseValResult;

    console.log("LTV Graph Debug");

    let tempRev = 0;
    let tempCustomerBase = 0;
    const ltvArray = totalGrossRevValRes.map((rev, index) => {
      tempRev += rev;
      const result = tempRev / totalCustomerBaseVal[index];
      return parseFloat(result.toFixed(2));
    });

    console.log("ltvArray", ltvArray);
    console.log("totalGrossProfAdSpend", totalGrossProfAdSpend);
    console.log("marketingCustomersAcquiredVal", marketingCustomersAcquiredVal);
    console.log("returningCustomerArray", returningCustomerArray);

    let tempRev2 = 0;
    const gpcArray = totalGrossProfAdSpend.map((rev, index) => {
      tempRev2 += rev;
      const result = ltvArray[index] * (1 - blendedCogs / 100);
      // tempRev2 /
      // (parseInt(returningCustomerArray[index]) +
      //   marketingCustomersAcquiredVal[index]);
      return parseFloat(result.toFixed(2));
    });

    console.log("gpcArray", gpcArray);

    let grossProfitPerCustResult =
      lifetimeValPerCustResult * (1 - blendedCogs / 100);

    let cashResult = newArrayy;
    const cummulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(0);
    cashResult.map(cummulativeSum);
    let cashInBnkValIdx = cashInBankArrVal.findIndex((x) => x < 0);
    const cashROIformattedArr = cashInBankArrVal.map((value) =>
      Number((value / 1000000).toFixed(2))
    );
    let cashInBnkValArrIdx = cashROIformattedArr.findIndex((x) => x > 1);

    console.log("cashROIformattedArr", cashROIformattedArr);

    let totalGrossProfitIdx = totalGrossProfAdSpend.findIndex((x) => x > 0);
    console.log("cashResult :>> ", cashResult);
    // Cash Payback period

    let cashROIDayIIdx =
      cashInBank < 0 ? cashROICompDayArr.findIndex((x) => x < 0) : 0;

    console.log("cashROICompDayArr", cashROICompDayArr);

    const cashBelowZeroMonth = cashInBankArrVal.map((value) => value < 0);
    const cashBelowLastMonth = cashInBankArrVal.map((value) => value >= 0);

    let keyVal = "2";

    opVals = {
      cashInBnkArr: cashInBankArrVal,
      cashBelowZeroMonth: cashInBankArrVal.findIndex((x) => x < 0)
        ? `Month ${cashInBnkValIdx + 1}`
        : "False",
      timeForGrossProfitablity: `Month ${totalGrossProfitIdx + 1}`,
      finalCashPayBackPeriodVal: `Month ${cashInBnkValArrIdx + 1}`,
      customerAcquisitionCost: custAcqCost,
      lifetimeValuePerCustomer: lifetimeValPerCustResult,
      grossProfPerCustBefAds: grossProfitPerCustResult,
      // euityValueData: equityValRes,
      realisedRevenue: realisedRev,
      cogsPerOrder: cogsperOrder,
      sdrSalaries: totalsdrSalaryRes,
      contacts: totalcontactsDataRes,
      outboundLeads: totaloutboundLeadValRes,
      outboundCustomers: totaloutboundCustValRes,
      outboundRevenue: totaloutboundRevenueValRes,
      outboundGrossProfit: totaloutboundGrossProfitValRes,
      roi: totalroiValRes,
      advertisingSpend: sumArray(advertisingSpendValResult),
      reach: sumArrayOfReach(reachValArrResult2),
      linkClicks: sumArrayClickLinks(linkClicksValArrResult2),
      pageViews: sumArrayofPageViews(pageViewsValTwodecimalResult),
      inboundLeads: sumArrayofInboundLeads(inboundLeadsArrResult2),
      inboundCustomers: sumArrayofInboundCustomer(
        inboundCustomersValArrResult2
      ),
      inboundRevenue: sumArrayofInboundRevenue(inboundRevenueValResult),
      roas:
        roasVal > 0
          ? sumArrayofInboundRevenue(inboundRevenueValResult) /
            sumArray(advertisingSpendValResult)
          : 0,
      inboundGrossProfit: sumArrayofInboundGrossProfitVal(
        inboundGrossProfitValResult
      ),
      inboundROI:
        inboundROIVal > 0
          ? sumArrayofInboundGrossProfitVal(inboundGrossProfitValResult) /
            sumArray(advertisingSpendValResult)
          : 0,
      organicLeads: sumArrayofOrganicLeads(organicLeadsValArrResult2),
      organicCustomers: sumArrayofOrganicCustomers(
        organicCustomersValArrResult2
      ),
      organicRevenue: sumArrayofOrganicRevenue(organicRevenueValResult),
      organicGrossProfit: sumArrayofOrganicGrossProfit(
        organicGrossProfitValResult
      ),
      marketingSpend: sumArrayofMarketingSpend(marketingSpendResult),
      marketingCustomersAcquired: sumArrayofmarketingCustomersAcquired(
        marketingCustomersAcquiredVal
      ),
      marketingRevenue: sumArrayofMarketingRevenue(marketingRevenueVal),
      marketingGrossProfit: sumArrayofMarketingGrossProfitVal(
        marketingGrossProfitVal
      ),
      marketingROI:
        sumArrayofMarketingGrossProfitVal(marketingGrossProfitVal) /
        sumArrayofMarketingSpend(marketingSpendResult),
      totalCustomerBase: totalCustomerBaseValResult,
      returningCustomers: returnCustomertotal,
      monthlyReturningRevenue: sumArrayofMontlyReturningRevenue(
        monthlyReturningRevenueVal
      ),
      outputCostToMarketReturn: sumArrayofcostToMarketReturnVal(
        costToMarketReturnVal
      ),
      refundCostLoss: refundCostLossVal,
      totalRefundOrders: sumArrayoftotalRefundOrdersVal(resultOfRefundOrders),
      totalRefundLoss: sumArrayoftotalRefLoss(totalRefLoss),
      totalReferrers: sumArrayoftotalReferrersValResult(
        resultOfTotalReferrersVal
      ), //C
      totalInvitees: sumArrayoftotalInviteesValResult(totalInviteesVal),
      referralCustomers:
        sumArrayofreferralCustomersResult(referralCustomersVal),
      referralRevenue: sumArrayofreferralRevenueValResult(referralRevenueVal), //C
      totalGrossRevenue: total,
      totalGrossProfitBeforeAdspend: sumoftotalGrossProfitBeforeAdspendVal,
      grossMarginProfitBeforeAdspend: grossMarginProfitBeforeAdspendVal[0],
      totalGrossProfitAfterAdspend: sumoftotalGrossProfAdSpend,
      grossMarginProfitAfterAdspend: (sumoftotalGrossProfAdSpend / total) * 100,
      grossProfitBeforeAdspendPerCustPerMonth:
        finalGrossProfitBeforeAdspendPerCustPerMonthVal,
      grossProfitAfterAdspendPerCustPerMonth: grossProfitAfAdsPerCustNewVal,
      paymentProcessorFeesPerOrder: paymentProcessorFeesPerOrderResult[0],
      merchantAccFeesPerOrder: merAccPerOrder[0],
      totalPaymentProcessorFees: totalofpayProcValTotal,
      totalmerchantAccFees: totalofmerAccTotalFee,
      totalFixedCosts: sumoftotalFixedCostsVal,
      upFrontInvestmentCosts: upFrontInvestmentCostsVal,
      earningBeforeIntAndTax: totalearBefIntTaxArr,
      cashTaxes: totalcashTaxesVal,
      debtInterestPayable: totaldebtIntPayableArr,
      unleveredFreeCashFlow: totalunleveredFreeCashFlowVal,
      enterPriseValue: enterpriseValTotal,
      plusCash: plusDatatotal,
      lessDebt: lessDebttotal,
      equityValue: equityValTotal,
      equityValueShare: totalequityValueShareVal,
      earningAfterIntAndTax: totalunleveredFreeCashFlowVal,
      avgTerminalValue: avgTerValTotal,
      cashROICompToDay: finalCashROICompToDayVal,
      overAllCashInBank: totalCashInBank,
      cashPaybackPeriod: lastIndexOfcashPaybackPeriodVal,
      equityValueTotal: equityValTotal,
      finalCashROICompToDay: finalCashROICompToDayVal,

      // Graphs
      totalGrossRevValRes,
      equityValArr,
      totalCustValRes,
      earBefIntTaxArr,
      unleveredFreeCashFlowVal,
      totalCustomerBaseVal,
      cashROIformattedArr,
      ltvArray,
      gpcArray,
    };
  }

  console.log(opVals);
  return opVals;
}
