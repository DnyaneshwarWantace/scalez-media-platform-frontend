import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";
import { store } from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

// NOTE: Don't remove, import Chart from "chart.js/auto";
import Chart from "chart.js/auto";

// Global error handlers
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <>
  {/* <HelmetProvider> */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  {/* </HelmetProvider> */}
  </>
);
