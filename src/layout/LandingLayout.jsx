import React from "react";
import { Outlet } from "react-router-dom";
import LandingToolbar from "./LandingToolbar";

function LandingLayout() {
  return (
    <div>
      <LandingToolbar />
      <Outlet />
    </div>
  );
}

export default LandingLayout;
