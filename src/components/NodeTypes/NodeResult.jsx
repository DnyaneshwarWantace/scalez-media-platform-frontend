import React from "react";

function camelToSentence(camelCase) {
  // Use a regular expression to split camelCase string into words
  const wordsArray = camelCase.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join with spaces
  const sentence = wordsArray
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return sentence;
}

const getStatsBottomMargin = (label) => {
  switch (label) {
    case "EmailNode node":
      return "3px";
    case "PhoneNode node":
      return "3px";
    case "PhoneOrderNode node":
      return "3px";
    case "ChatbotNode node":
      return "3px";
    case "SMSNode node":
      return "3px";
    default:
      return "-3px";
  }
};

const getNameBottomMargin = (label) => {
  switch (label) {
    case "EmailNode node":
      return "0px";
    case "PhoneNode node":
      return "0px";
    case "PhoneOrderNode node":
      return "0px";
    case "ChatbotNode node":
      return "0px";
    case "SMSNode node":
      return "0px";
    default:
      return "-8.5px";
  }
};

function NodeResult({ traffic, convertedTraffic, name, label }) {
  return (
    <>
      <div
        style={{
          position: "relative",
          left: 10,
          bottom: getStatsBottomMargin(label),
        }}
      >
        <div className="d-flex align-items-center border ps-1">
          <i
            className="fa-solid fa-circle-check"
            style={{
              width: "0.1rem",
              fontSize: "0.5rem",
              marginRight: "0.5rem",
              marginTop: "0.2rem",
              marginBottom: "0.2rem",
            }}
          ></i>

          <p className="mb-0" style={{ fontSize: "0.3rem" }}>
            {convertedTraffic}
          </p>
        </div>

        <div className="d-flex align-items-center border ps-1">
          <i
            className="fa-solid fa-user"
            style={{
              maxWidth: "0.3rem",
              width: "0.1rem",
              fontSize: "0.5rem",
              marginRight: "0.5rem",
              marginTop: "0.2rem",
              marginBottom: "0.2rem",
            }}
          ></i>

          <p className="mb-0" style={{ fontSize: "0.3rem" }}>
            {traffic}
          </p>
        </div>
      </div>

      <p
        className="mb-0 fw-bold"
        style={{
          fontSize: "5px",
          position: "relative",
          bottom: getNameBottomMargin(label),
          left: "16px",
        }}
      >
        {camelToSentence(name)}
      </p>
    </>
  );
}

export default NodeResult;
