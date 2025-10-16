import React from "react";

function Alert({ value, variant }) {
  return (
    <div class={`alert alert-${variant}`}>
      {variant === "danger" && (
        <span>
          <img src="/static/icons/alert-danger-icon.svg" alt="" />
        </span>
      )}
      {variant === "success" && (
        <span>
          <img src="/static/icons/alert-success-icon.svg" alt="" />
        </span>
      )}
      {variant === "warning" && (
        <span>
          <img src="/static/icons/alert-warning-icon.svg" alt="" />
        </span>
      )}
      {variant === "info" && (
        <span>
          <img src="/static/icons/alert-info-icon.svg" alt="" />
        </span>
      )}
      <span style={{ marginLeft: "0.5rem", paddingTop: "0.3rem", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default Alert;
