import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { hasPermission_company_access } from "../utils/permissions";
import { cn } from "../lib/utils";
import { 
  User, 
  Users, 
  Shield, 
  Building, 
  Bell, 
  Settings as SettingsIcon 
} from "lucide-react";

function SettingSidebar() {
  const location = useLocation();
  const [menus, setmenus] = useState([
    { name: "Profile", icon: User, link: `/settings/profile` },
    { name: "Users", icon: Users, link: `/settings/users` },
    { name: "Roles", icon: Shield, link: `/settings/roles` },
    { name: "Workspace", icon: SettingsIcon, link: `/settings/workspace` },
    { name: "Notifications", icon: Bell, link: `/settings/notifications` },
  ]);

  useEffect(() => {
    if (hasPermission_company_access()) {
      setmenus(prev => [...prev, { name: "Company", icon: Building, link: `/settings/company` }]);
    }
  }, []);

  const isActive = (link) => location.pathname === link;

  return (
    <div className="w-64 min-h-screen border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="font-medium text-lg leading-tight">Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your workspace</p>
      </div>
      
      <nav className="p-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link
              key={menu.name}
              to={menu.link}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                isActive(menu.link)
                  ? "bg-gray-100 dark:bg-gray-800 text-foreground font-medium border-l-2 border-l-black dark:border-l-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SettingSidebar;
