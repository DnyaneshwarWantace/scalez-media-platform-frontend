import React from "react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TourModal from "../pages/Projects/Tour/TourModal";
import {
  selectselectedTest,
  selectselectedLearning,
} from "../redux/slices/projectSlice";
import {  useSelector } from "react-redux";
import { ArrowLeft, Target, Lightbulb, TestTube, BookOpen, BarChart3 } from "lucide-react";

function ProjectSidebar() {
  const [selectedMenu, setselectedMenu] = useState("");
  const params = useParams();
  
  const selectedTest = useSelector(selectselectedTest);
  const selectedLearning = useSelector(selectselectedLearning);

  const menus = [
    { name: "Goals", icon: Target, link: `/projects/${params.projectId}/goals` },
    { name: "Ideas", icon: Lightbulb, link: `/projects/${params.projectId}/ideas` },
    { name: "Tests", icon: TestTube, link: `/projects/${params.projectId}/tests` },
    { name: "Learning", icon: BookOpen, link: `/projects/${params.projectId}/learnings` },
    { name: "Insights", icon: BarChart3, link: `/projects/${params.projectId}/insights` },
  ];

  const onSelectedMenu = (name) =>{
    console.log('name :>> ', name);
    setselectedMenu(name);
    // if(name === 'Learning'){
    //   selectedTest = null;
    // }
  }

  // const appsMenus = [{ name: "Integrations", icon: "goals.svg", link: `/projects/${params.projectId}/integrations` }];

  const location = useLocation();
  const navigate = useNavigate();
  const openedProject = JSON.parse(localStorage.getItem("openedProject", "")) || {};

  const isActive = (menuName) => {
    return location.pathname.includes(menuName.toLowerCase());
  };

  const navigateToProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="w-64 min-h-screen border-r bg-muted/10">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigateToProjects}
            className="p-0 h-auto flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent hover:border-transparent no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Projects</span>
          </button>
          
          <div style={{ cursor: "pointer" }}>
            <img src="/static/images/tour/tour_icon.svg" alt="" data-bs-toggle="modal" data-bs-target="#tourModal" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="font-medium text-lg leading-tight">{openedProject?.name || 'Project'}</h2>
          <p className="text-xs text-muted-foreground line-clamp-2">{openedProject?.description || 'Project description'}</p>
        </div>
      </div>

      <nav className="p-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = isActive(menu.name);
          
          return (
            <Link
              key={menu.name}
              to={menu.link}
              onClick={() => onSelectedMenu(menu.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative no-underline ${
                active
                  ? 'bg-gray-100 dark:bg-gray-800 text-foreground font-medium border-l-2 border-l-black dark:border-l-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {menu.name}
            </Link>//hg
          );
        })}
      </nav>

      <TourModal />
    </div>
  );
}

export default ProjectSidebar;
