export const formatNumber = (number, currency = "") => {
  if (!number) return "0.0";

  let numberFloat = parseFloat(number?.toString()?.replaceAll(",", ""));

  numberFloat = Math.round(numberFloat * 100) / 100;
  let numStr = numberFloat.toString();
  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (currency === "rupee") {
    numStr = number < 0 ? `-₹${numStr.replace("-", "")}` : `₹${numStr}`;
  }

  return numStr;
};
