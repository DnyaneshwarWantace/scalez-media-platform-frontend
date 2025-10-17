import React, { Children } from "react";

function LoadingButton(props) {
  const { loading, ...buttonProps } = props;
  
  return (
    <>
      {loading === true && (
        <button {...buttonProps}>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </button>
      )}

      {!loading && <button {...buttonProps}>{props.children}</button>}
    </>
  );
}

export default LoadingButton;
