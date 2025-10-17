import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  appendNotification,
  markRead,
  readNotifications,
  selectnotifications,
} from "../redux/slices/dashboardSlice";
import {
  getAllProjects,
  getAllUsers,
  selectProjects,
} from "../redux/slices/projectSlice";
import { selectAllUsers } from "../redux/slices/settingSlice";
import { backendServerBaseURL } from "../utils/backendServerBaseURL";
import { formatTime } from "../utils/formatTime";
import { Settings, FileText, LogOut, ChevronDown, User, BarChart3, FolderOpen, Activity, TrendingUp, Bell, Menu, X, Check, Star } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";

function Toolbar({ socket }) {
  const [selectedMenu, setselectedMenu] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileData = JSON.parse(localStorage.getItem("user", ""));
  const [icon, setIcon] = useState(
    profileData?.logo
      ? `${backendServerBaseURL}/${profileData?.logo}`
      : "/static/icons/logo.svg"
  );

  const navigate = useNavigate();
  const me = JSON.parse(localStorage.getItem("user", ""));
  const dispatch = useDispatch();
  const notifications = useSelector(selectnotifications);
  const location = useLocation();

  const projects = useSelector(selectProjects);
  const team = useSelector(selectAllUsers);
  // console.log('profileData TB :>> ', profileData);
  // console.log('team TB:>> ', team);
  //  alert(me._id);

  if (me?._id && me?.role != "owner" && team.length != 0) {
    let res = team.filter((x) => x._id == me._id && x.role != "owner");
    // console.log('res :>> ', res);

    // let res2 = team.filter(x => x._id == me._id && x.role != "owner");

    if (res.length == 0) {
      localStorage.clear();
      navigate("/");
    }
  }

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllUsers());
  }, []);

  const completedQuickStartGuide = () => {
    return (
      (projects?.length != 0 ? 1 : 0) +
      (team?.length != 0 ? 1 : 0) +
      (!profileData?.firstName && !profileData?.lastName && !profileData?.email
        ? 0
        : 1)
    );
  };

  const menus = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Project",
      link: "/projects",
    },
    {
      name: "Models",
      link: "/models",
    },
    {
      name: "Funnels",
      link: "/funnel/0",
    },
    {
      name: "Analytics",
      link: "/analytics",
    },
    {
      name: "North Star",
      link: "/north-star",
    },
  ];
  const ProjectsMenus = [
    {
      name: "All Notifications",
    },
    {
      name: "Mentioned",
    },
    {
      name: "Assigned",
    },
  ];

  useEffect(() => {
    dispatch(readNotifications());

    socket?.on("notification", (payload) => {
      console.log("Received notification");
      dispatch(appendNotification(payload));
    });

    return () => {
      socket?.off("notification");
    };
  }, []);

  useEffect(() => {
    if (location.pathname.includes("dashboard")) {
      setselectedMenu("Dashboard");
    }

    if (location.pathname.includes("projects")) {
      setselectedMenu("Project");
    }

    if (location.pathname.includes("models")) {
      setselectedMenu("Models");
    }

    if (location.pathname.includes("analytics")) {
      setselectedMenu("Analytics");
    }

    if (location.pathname.includes("north-star")) {
      setselectedMenu("North Star");
    }
  }, [location.pathname]);

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("user", ""));
    if (profileData.logo) {
      setIcon(
        profileData?.logo
          ? `${backendServerBaseURL}/${profileData?.logo}`
          : "/static/icons/logo.svg"
      );
    }
  }, []);
  // console.log(icon)
  return (
    <>
      <div className="w-full bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={icon}
              alt="Scalez Logo"
              className="h-6 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 relative">
            {menus.map((menu) => {
              const isActive = selectedMenu === menu.name;
              const getIcon = (name) => {
                switch (name) {
                  case 'Dashboard': return BarChart3;
                  case 'Project': return FolderOpen;
                  case 'Models': return Activity;
                  case 'Analytics': return TrendingUp;
                  case 'North Star': return Star;
                  default: return BarChart3;
                }
              };
              const Icon = getIcon(menu.name);

              return (
                <Link
                  key={menu.name}
                  to={menu.link}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors relative hover:bg-transparent hover:border-transparent focus:ring-0 focus:ring-offset-0 no-underline"
                  onClick={() => {
                    setselectedMenu(menu.name);
                  }}
                >
                  <Icon className="h-4 w-4 text-black" />
                  <span className={isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                    {menu.name}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center space-x-1">
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-4 w-4 text-black" />
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Quick Start Progress */}
            {projects && completedQuickStartGuide() != 3 && (
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  navigate("/quick-start");
                  setselectedMenu("quick-start");
                }}
                title="Quick Start Guide"
              >
                {completedQuickStartGuide() == 1 && (
                  <div className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-yellow-600">20%</span>
                  </div>
                )}
                {completedQuickStartGuide() == 2 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">60%</span>
                  </div>
                )}
                {completedQuickStartGuide() == 3 && (
                  <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">100%</span>
                  </div>
                )}
              </button>
            )}

            {/* Notifications */}
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              onClick={() => setIsNotificationOpen(true)}
            >
              <Bell className="h-4 w-4 text-black" />
              {notifications &&
              notifications?.filter((noti) => {
                return noti?.audience?.includes(me?.id);
              }).length !== 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></div>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity p-1 rounded-md hover:bg-muted">
                  <img
                    src={`${backendServerBaseURL}/${me?.avatar}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-border hover:border-foreground/20 transition-colors"
                  />
                  <ChevronDown className="w-4 h-4 text-black" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {/* Profile Header */}
                <DropdownMenuLabel className="px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`${backendServerBaseURL}/${me?.avatar}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {me?.firstName} {me?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {me?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
                {/* Menu Items */}
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="mr-3 h-4 w-4 text-black" />
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => navigate("/action-plans")}
                >
                  <FileText className="mr-3 h-4 w-4 text-black" />
                  Action Plans
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 transition-colors"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4 text-black" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      </div>

      {/* Notifications Sidebar */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsNotificationOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNotificationOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="p-1 border-b">
              <div className="flex space-x-1">
                {ProjectsMenus.map((menu) => (
                  <Button
                    key={menu.name}
                    variant={selectedMenu === menu.name ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setselectedMenu(menu.name)}
                    className="text-xs"
                  >
                    {menu.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
              <div className="p-1 space-y-0">
                {notifications?.length !== 0 ? (
                  notifications
                    .filter((noti) => {
                      if (selectedMenu === "Mentioned") return noti.type === "Mentioned";
                      if (selectedMenu === "Assigned") return noti.type === "Assigned";
                      return true;
                    })
                    .map((notification) => {
                      return notification?.audience?.includes(me?.id) ? (
                        <div key={notification._id} className="flex items-start space-x-1 p-1 rounded hover:bg-muted/50 transition-colors">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={`${backendServerBaseURL}/${me.avatar}`} />
                            <AvatarFallback>
                              {me?.firstName?.[0]}{me?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-foreground leading-none">{notification.message}</p>
                                <p className="text-xs text-muted-foreground leading-none -mt-1">{formatTime(notification.createdAt)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  dispatch(markRead({ notificationId: notification._id }));
                                }}
                                className="h-4 w-4 p-0 flex-shrink-0"
                              >
                                <Check className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })
                ) : (
                  <div className="text-center py-2">
                    <Bell className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}

export default Toolbar;
