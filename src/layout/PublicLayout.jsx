import React from "react";
import { Outlet } from "react-router-dom";
import PublicToolbar from "./PublicToolbar";

function PublicLayout() {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <PublicToolbar />

        <div className="flex-fill d-flex">
          {/* <ProjectSidebar /> */}

          <div className="page-body w-100">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicLayout;
