export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDate2 = (dateString) => {
  const options = { month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDate3 = (dateString) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDate4 = (dateString) => {
  const options = { day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (time) => {
  let date = formatDate(new Date(time));

  let hours = new Date(time).getHours();

  if (hours.toString().length == 1) {
    hours = "0" + hours.toString();
  }

  hours = hours.toString();

  let minutes = new Date(time).getMinutes();

  if (minutes.toString().length == 1) {
    minutes = "0" + minutes.toString();
  }

  minutes = minutes.toString();

  return date;
  // return date + " " + hours + ":" + minutes;
};

export const extraProcessHumanize = (str) => {
  if (str === "a day") return "1 Day";
  if (str === "a month") return "1 Month";
  if (str === "a year") return "1 Year";
  return str;
};
