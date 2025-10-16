import React from "react";
import { Outlet } from "react-router-dom";
import SettingSidebar from "./SettingSidebar";
import Toolbar from "./Toolbar";
import PopupMessage from "./PopupMessage";

function SettingsLayout({ socket }) {
  return (
    <div className="min-h-screen bg-background">
      <PopupMessage />
      <Toolbar socket={socket} />

      <div className="flex h-[calc(100vh-64px)]">
        <SettingSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
