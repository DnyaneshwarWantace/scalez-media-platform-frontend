import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SettingsLayout from "../layout/SettingsLayout";
import ProjectLayout from "../layout/ProjectLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Page404 from "../pages/General/Page404";
import Page500 from "../pages/General/Page500";
import Login from "../pages/Landing/Login";
import Signup from "../pages/Landing/Signup";
import SignedUpSuccessfully from "../pages/Landing/SignedUpSuccessfully";
import ForgotPassword from "../pages/Landing/ForgotPassword";
import ResetPassword from "../pages/Landing/ResetPassword";
// import Landing from "../pages/Landing/Landing";
import Models from "../pages/Models/Models";
import Projects from "../pages/Projects/Projects";
import Goals from "../pages/Projects/Goals/Goals";
import Ideas from "../pages/Projects/Ideas/Ideas";
import Tests from "../pages/Projects/Tests/Tests";
import Learnings from "../pages/Projects/Learnings/Learnings";
import Insights from "../pages/Projects/Insights/Insights";
import GoalInfo from "../pages/Projects/Goals/GoalInfo";
import IdeaInfo from "../pages/Projects/Ideas/IdeaInfo";
import TestInfo from "../pages/Projects/Tests/TestInfo";
import LearningInfo from "../pages/Projects/Learnings/LearningInfo";
import Profile from "../pages/Settings/Profile";
import Roles from "../pages/Settings/Roles/Roles";
import Notifications from "../pages/Settings/Notifications";
import Company from "../pages/Settings/Company";
import Billing from "../pages/Settings/Billing";
import Users from "../pages/Settings/Users";
import Workspace from "../pages/Settings/Workspace/Workspace";
import ModelInfo from "../pages/Models/ModelInfo";
import ModelSimulation from "../pages/Models/ModelSimulation";
import CompleteProfile from "../pages/Landing/CompleteProfile";
import ModelTest from "../pages/ModelTest";
import CompareModel from "../pages/Models/CompareModel";
import TestsDemo from "../pages/Projects/Tests/TestsDemo";
import ActionPlan from "../pages/ActionPlan/ActionPlan";
import SingleActionPlan from "../pages/ActionPlan/SingleActionPlan";
import LandingLayout from "../layout/LandingLayout";
import ForgotPasswordLinkSentSuccessfully from "../pages/Landing/ForgotPasswordLinkSentSuccessfully";
import Integrations from "../pages/Projects/Integrations/Integrations";
import QuickStart from "../pages/QuickStart/QuickStart";
import Analytics from "../pages/Analytics/Analytics";
import IdeaPublicView from "../pages/Projects/Ideas/IdeaPublicView";
import PublicLayout from "../layout/PublicLayout";
import FunnelMainLayout from "../layout/FunnelMainLayout";
// import ScalezModel from "../pages/Models/scalezModel";
import FunnelDashboard from "../pages/Dashboard";
import ViewPointer from "../pages/ActionPlan/ViewPointer";

export default function Router({ socket }) {
  return useRoutes([
    {
      path: "",
      element: <LandingLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/signed-up-successfully",
          element: <SignedUpSuccessfully />,
        },

        {
          path: "/reset-password/:resetToken",
          element: <ResetPassword />,
        },
        {
          path: "/forgot-password-link-sent-successfully",
          element: <ForgotPasswordLinkSentSuccessfully />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "",
          element: <Login />,
        },
      ],
    },

    {
      path: "/complete-profile/:token",
      element: <CompleteProfile />,
    },

    {
      path: "/mt",
      element: <ModelTest />,
    },

    {
      path: "quick-start",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <QuickStart />,
        },
      ],
    },

    {
      path: "dashboard",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
      ],
    },

    {
      path: "projects",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Projects />,
        },
      ],
    },

    {
      path: "action-plans",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <ActionPlan />,
        },
      ],
    },

    {
      path: "action-plans/:actionPlanId/:categoryId/:contentId",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <SingleActionPlan />,
        },
      ],
    },

    {
      path: "action-plans/:actionPlanId/:categoryId/:contentId/view",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <ViewPointer />,
        },
      ],
    },

    {
      path: "settings",
      element: <SettingsLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Profile />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "roles",
          element: <Roles />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "workspace",
          element: <Workspace />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "company",
          element: <Company />,
        },
        {
          path: "billing",
          element: <Billing />,
        },
      ],
    },

    {
      path: "projects/:projectId",
      element: <PublicLayout />,
      children: [
        {
          path: "public/ideas/:ideaId",
          element: <IdeaPublicView />,
        },
      ],
    },

    {
      path: "projects/:projectId",
      element: <ProjectLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Goals />,
        },
        {
          path: "goals",
          element: <Goals />,
        },
        {
          path: "integrations",
          element: <Integrations />,
        },

        {
          path: "goals/:goalId",
          element: <GoalInfo />,
        },
        {
          path: "ideas",
          element: <Ideas />,
        },

        {
          path: "ideas/:ideaId",
          element: <IdeaInfo />,
        },
        {
          path: "testDemo",
          element: <TestsDemo />,
        },
        {
          path: "tests",
          element: <Tests />,
        },
        {
          path: "tests/:testId",
          element: <TestInfo />,
        },
        {
          path: "learnings",
          element: <Learnings />,
        },
        {
          path: "learnings/:learningId",
          element: <LearningInfo />,
        },
        {
          path: "insights",
          element: <Insights />,
        },
      ],
    },

    {
      path: "models",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Models />,
        },
        {
          path: "compare/:slotAId/:slotBId",
          element: <CompareModel />,
        },
        {
          path: ":modelId",
          element: <ModelInfo />,
        },
        {
          path: ":modelId/simulation",
          element: <ModelSimulation />,
        },
      ],
    },

    {
      path: "analytics",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <Analytics />,
        },
      ],
    },

    {
      path: "funnel/:projectId",
      element: <MainLayout socket={socket} />,
      children: [
        {
          path: "",
          element: <FunnelMainLayout socket={socket} />,
          children: [
            {
              path: "",
              children: [],
              element: <FunnelDashboard />,
            },
          ],
        },
      ],
    },

    { path: "404", element: <Page404 /> },
    { path: "500", element: <Page500 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
