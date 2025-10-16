import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SupportModal from "../pages/Projects/Support/SupportModal";
import PopupMessage from "./PopupMessage";
import Toolbar from "./Toolbar";
import { Button } from "../components/ui/button";
import { HelpCircle } from "lucide-react";

function MainLayout({ socket }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div>
      <PopupMessage />

      <Toolbar socket={socket} />
      <Outlet />

      {/* Modern Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 p-0"
          onClick={() => setIsSupportOpen(true)}
          title="Help & Support"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}

export default MainLayout;
