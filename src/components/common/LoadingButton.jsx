import React, { Children } from "react";

function LoadingButton(props) {
  return (
    <>
      {props.loading === true && (
        <button {...props}>
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      )}

      {!props.loading && <button {...props}>{props.children}</button>}
    </>
  );
}

export default LoadingButton;
