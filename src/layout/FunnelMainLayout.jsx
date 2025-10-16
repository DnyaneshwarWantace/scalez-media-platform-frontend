import React from "react";
import { Outlet } from "react-router-dom";
import FunnelToolbar from "./FunnelToolbar";

function FunnelMainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <FunnelToolbar />
      <Outlet />
    </div>
  );
}

export default FunnelMainLayout;
