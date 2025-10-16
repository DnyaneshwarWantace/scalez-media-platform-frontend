import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe, selectMe } from "../../redux/slices/generalSlice";
import { getAllProjects, selectProjects } from "../../redux/slices/projectSlice";
import { getAllUsers, selectAllUsers } from "../../redux/slices/settingSlice";
import { hasPermission_create_ideas, isRoleAdmin, isTypeOwner } from "../../utils/permissions";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { 
  User, 
  Users, 
  FolderPlus, 
  Target, 
  Lightbulb, 
  TestTube, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  Circle,
  ArrowRight,
  Rocket
} from "lucide-react";

function QuickStart() {
  const navigate = useNavigate();
  const projects = useSelector(selectProjects);
  const dispatch = useDispatch();
  const team = useSelector(selectAllUsers);
  const profileData = JSON.parse(localStorage.getItem("user", ""));
  const me = JSON.parse(localStorage.getItem("user", ""));
  const meAPI = useSelector(selectMe);

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllUsers());
    dispatch(getMe());
  }, []);

  const completedQuickStartGuide = () => {
    return (
      (projects?.length != 0 ? 1 : 0) +
      (team?.length != 0 ? 1 : 0) +
      (!profileData?.firstName && !profileData?.lastName && !profileData?.email ? 0 : 1)
    );
  };

  const getProgressPercentage = () => {
    const completed = completedQuickStartGuide();
    return (completed / 3) * 100;
  };

  const getGrowthProgressPercentage = () => {
    const completed = (meAPI?.quickstart?.create_goal ? 1 : 0) +
      (meAPI?.quickstart?.create_idea ? 1 : 0) +
      (meAPI?.quickstart?.create_learning ? 1 : 0) +
      (meAPI?.quickstart?.create_test ? 1 : 0) +
      (meAPI?.quickstart?.view_insights ? 1 : 0);
    return (completed / 5) * 100;
  };

  const isProfileComplete = profileData?.firstName && profileData?.lastName && profileData?.email;
  const hasTeam = team?.length > 0;
  const hasProjects = projects?.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">Quick Start Guide</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to get your team & growth up and running
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Getting Started Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Getting Started
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {completedQuickStartGuide()} / 3
                  </Badge>
                  <Progress value={getProgressPercentage()} className="w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Complete your profile */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {isProfileComplete ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Complete your profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Start by completing your profile details
                    </p>
                  </div>
                </div>
                <Button
                  variant={isProfileComplete ? "outline" : "default"}
                  onClick={() => navigate("/settings")}
                  className="min-w-[120px]"
                >
                  {isProfileComplete ? "View Profile" : "Complete Profile"}
                </Button>
              </div>

              {/* Invite your team */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {hasTeam ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Users className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Invite your team</h3>
                    <p className="text-sm text-muted-foreground">
                      Add emails, assign roles & invite
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasTeam ? "outline" : "default"}
                  onClick={() => {
                    localStorage.setItem("openAddMemberDialog", "1");
                    navigate("/settings/users");
                  }}
                  className="min-w-[120px]"
                >
                  {hasTeam ? "Manage Team" : "Invite Team"}
                </Button>
              </div>

              {/* Create your first project */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {hasProjects ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <FolderPlus className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Create your first project</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up your workspace and start organizing your work
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasProjects ? "outline" : "default"}
                  onClick={() => {
                    localStorage.setItem("openNewProjectDialog", "1");
                    navigate("/projects");
                  }}
                  className="min-w-[120px]"
                >
                  {hasProjects ? "View Projects" : "Create Project"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Process Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Growth Process
                  {!hasProjects && (
                    <Badge variant="outline" className="text-xs">
                      Create a project to unlock
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {(meAPI?.quickstart?.create_goal ? 1 : 0) +
                      (meAPI?.quickstart?.create_idea ? 1 : 0) +
                      (meAPI?.quickstart?.create_learning ? 1 : 0) +
                      (meAPI?.quickstart?.create_test ? 1 : 0) +
                      (meAPI?.quickstart?.view_insights ? 1 : 0)} / 5
                  </Badge>
                  <Progress value={getGrowthProgressPercentage()} className="w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Create a goal */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {meAPI?.quickstart?.create_goal ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Target className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Create a goal</h3>
                    <p className="text-sm text-muted-foreground">
                      Define clear objectives for your project
                    </p>
                  </div>
                </div>
                <Button
                  variant={meAPI?.quickstart?.create_goal ? "outline" : "default"}
                  disabled={!hasProjects || !me?.role?.permissions?.create_goals}
                  onClick={() => navigate(`/projects/${projects?.[0]?._id}/goals`)}
                  className="min-w-[120px]"
                >
                  {meAPI?.quickstart?.create_goal ? "View Goals" : "Create Goal"}
                </Button>
              </div>

              {/* Add Ideas For Goals */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {meAPI?.quickstart?.create_idea ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Lightbulb className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add Ideas For Goals</h3>
                    <p className="text-sm text-muted-foreground">
                      Start brainstorming with team by adding ideas
                    </p>
                  </div>
                </div>
                <Button
                  variant={meAPI?.quickstart?.create_idea ? "outline" : "default"}
                  disabled={!hasProjects || !me?.role?.permissions?.create_ideas || hasPermission_create_ideas()}
                  onClick={() => navigate(`/projects/${projects?.[0]?._id}/ideas`)}
                  className="min-w-[120px]"
                >
                  {meAPI?.quickstart?.create_idea ? "View Ideas" : "Suggest Ideas"}
                </Button>
              </div>

              {/* Test Ideas */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {meAPI?.quickstart?.create_test ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <TestTube className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Test Ideas</h3>
                    <p className="text-sm text-muted-foreground">
                      Validate your ideas through structured testing
                    </p>
                  </div>
                </div>
                <Button
                  variant={meAPI?.quickstart?.create_test ? "outline" : "default"}
                  disabled={!hasProjects || !me?.role?.permissions?.create_tests}
                  onClick={() => navigate(`/projects/${projects?.[0]?._id}/tests`)}
                  className="min-w-[120px]"
                >
                  {meAPI?.quickstart?.create_test ? "View Tests" : "Go To Ideas"}
                </Button>
              </div>

              {/* Acquire Learnings */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {meAPI?.quickstart?.create_learning ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Acquire Learnings</h3>
                    <p className="text-sm text-muted-foreground">
                      After a test completion, create learnings from the outcome
                    </p>
                  </div>
                </div>
                <Button
                  variant={meAPI?.quickstart?.create_learning ? "outline" : "default"}
                  disabled={!hasProjects || !me?.role?.permissions?.create_learnings}
                  onClick={() => navigate(`/projects/${projects?.[0]?._id}/learnings`)}
                  className="min-w-[120px]"
                >
                  {meAPI?.quickstart?.create_learning ? "View Learnings" : "Create Learning"}
                </Button>
              </div>

              {/* View Insights */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {meAPI?.quickstart?.view_insights ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">View Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Get all the essential insights at one place
                    </p>
                  </div>
                </div>
                <Button
                  variant={meAPI?.quickstart?.view_insights ? "outline" : "default"}
                  disabled={!hasProjects}
                  onClick={() => navigate(`/projects/${projects?.[0]?._id}/insights`)}
                  className="min-w-[120px]"
                >
                  {meAPI?.quickstart?.view_insights ? "View Insights" : "Go to Insights"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QuickStart;
