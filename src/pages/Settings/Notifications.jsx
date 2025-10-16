import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCollaborators, getAllUsers, selectAllCollaborators, selectAllUsers, updateNotifications } from "../../redux/slices/settingSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { 
  Bell, 
  Users, 
  Target, 
  Lightbulb, 
  TestTube, 
  BookOpen,
  Settings,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Building
} from "lucide-react";

function Notifications() {
  const [selectedMenu, setselectedMenu] = useState("Team");
  const ideas = [1, 2, 3];
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const collaborators = useSelector(selectAllCollaborators);
  const team = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const ProjectsMenus = [];

  const RightProjectsMenus = [];

  const [allChecked, setallChecked] = useState(true);

  const [acceptInvitation, setacceptInvitation] = useState(true);
  const [invitation_2days, setinvitation_2days] = useState(true);
  const [team_activated, setteam_activated] = useState(true);
  const [workspace_created, setworkspace_created] = useState(true);

  const [goal_created, setgoal_created] = useState(true);

  const [idea_created, setidea_created] = useState(true);
  const [idea_updated, setidea_updated] = useState(true);
  const [idea_deleted, setidea_deleted] = useState(true);
  const [idea_sent_to_test, setidea_sent_to_test] = useState(true);
  const [idea_nominated, setidea_nominated] = useState(true);

  const [test_sent_to_idea, settest_sent_to_idea] = useState(true);
  const [test_ready, settest_ready] = useState(true);
  const [test_sent_to_learning, settest_sent_to_learning] = useState(true);

  const [learning_created, setlearning_created] = useState(true);
  const [learning_sent_to_test, setlearning_sent_to_test] = useState(true);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllCollaborators());
  }, [selectedMenu]);

  const callUpdateNotifications = () => {
    setTimeout(() => {
      dispatch(
        updateNotifications({
          acceptInvitation,
          invitation_2days,
          team_activated,
          workspace_created,

          goal_created,

          idea_created,
          idea_updated,
          idea_deleted,
          idea_sent_to_test,
          idea_nominated,

          test_sent_to_idea,
          test_ready,
          test_sent_to_learning,

          learning_created,
          learning_sent_to_test,
        })
      );
    }, 500);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-sm text-gray-500">Manage your notification preferences</p>
        </div>
      </div>

      {/* All Notifications Toggle */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">All Notifications</h3>
                <p className="text-sm text-muted-foreground">Enable or disable all notifications at once</p>
              </div>
            </div>
            <Switch
              checked={allChecked}
              onCheckedChange={(checked) => {
                setacceptInvitation(checked);
                setinvitation_2days(checked);
                setteam_activated(checked);
                setworkspace_created(checked);
                setgoal_created(checked);
                setidea_created(checked);
                setidea_updated(checked);
                setidea_deleted(checked);
                setidea_sent_to_test(checked);
                setidea_nominated(checked);
                settest_sent_to_idea(checked);
                settest_ready(checked);
                settest_sent_to_learning(checked);
                setlearning_created(checked);
                setlearning_sent_to_test(checked);
                setallChecked(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Invitation Accepted</Label>
                <p className="text-xs text-muted-foreground">When someone accepts your invitation</p>
              </div>
            </div>
            <Switch
              checked={acceptInvitation}
              onCheckedChange={(checked) => {
                setacceptInvitation(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <Label className="text-sm font-medium">Invitation Reminder</Label>
                <p className="text-xs text-muted-foreground">If someone doesn't accept invitation within 2 days</p>
              </div>
            </div>
            <Switch
              checked={invitation_2days}
              onCheckedChange={(checked) => {
                setinvitation_2days(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">Team Member Status</Label>
                <p className="text-xs text-muted-foreground">When a team member is activated or disabled</p>
              </div>
            </div>
            <Switch
              checked={team_activated}
              onCheckedChange={(checked) => {
                setteam_activated(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <Label className="text-sm font-medium">New Workspace</Label>
                <p className="text-xs text-muted-foreground">When a new workspace is created</p>
              </div>
            </div>
            <Switch
              checked={workspace_created}
              onCheckedChange={(checked) => {
                setworkspace_created(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">Goal Created</Label>
                <p className="text-xs text-muted-foreground">When a new goal is created</p>
              </div>
            </div>
            <Switch
              checked={goal_created}
              onCheckedChange={(checked) => {
                setgoal_created(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ideas Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Ideas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <div>
                <Label className="text-sm font-medium">Idea Added</Label>
                <p className="text-xs text-muted-foreground">When a team member adds an idea</p>
              </div>
            </div>
            <Switch
              checked={idea_created}
              onCheckedChange={(checked) => {
                setidea_created(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">Idea Updated</Label>
                <p className="text-xs text-muted-foreground">When an idea is updated</p>
              </div>
            </div>
            <Switch
              checked={idea_updated}
              onCheckedChange={(checked) => {
                setidea_updated(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-red-600" />
              <div>
                <Label className="text-sm font-medium">Idea Deleted</Label>
                <p className="text-xs text-muted-foreground">When an idea is deleted</p>
              </div>
            </div>
            <Switch
              checked={idea_deleted}
              onCheckedChange={(checked) => {
                setidea_deleted(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Idea Sent to Test</Label>
                <p className="text-xs text-muted-foreground">When an idea is sent to test</p>
              </div>
            </div>
            <Switch
              checked={idea_sent_to_test}
              onCheckedChange={(checked) => {
                setidea_sent_to_test(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              <div>
                <Label className="text-sm font-medium">Idea Nominated</Label>
                <p className="text-xs text-muted-foreground">When your idea is nominated by someone</p>
              </div>
            </div>
            <Switch
              checked={idea_nominated}
              onCheckedChange={(checked) => {
                setidea_nominated(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <TestTube className="h-5 w-5 text-orange-600" />
              <div>
                <Label className="text-sm font-medium">Test Sent Back</Label>
                <p className="text-xs text-muted-foreground">When a test is sent back to ideas</p>
              </div>
            </div>
            <Switch
              checked={test_sent_to_idea}
              onCheckedChange={(checked) => {
                settest_sent_to_idea(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <TestTube className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Test Ready</Label>
                <p className="text-xs text-muted-foreground">When a test is ready to analyze</p>
              </div>
            </div>
            <Switch
              checked={test_ready}
              onCheckedChange={(checked) => {
                settest_ready(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <TestTube className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">Test Sent to Learnings</Label>
                <p className="text-xs text-muted-foreground">When a test is sent to learnings</p>
              </div>
            </div>
            <Switch
              checked={test_sent_to_learning}
              onCheckedChange={(checked) => {
                settest_sent_to_learning(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learnings Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Learning Created</Label>
                <p className="text-xs text-muted-foreground">When a new learning is created</p>
              </div>
            </div>
            <Switch
              checked={learning_created}
              onCheckedChange={(checked) => {
                setlearning_created(checked);
                callUpdateNotifications();
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <div>
                <Label className="text-sm font-medium">Learning Sent Back</Label>
                <p className="text-xs text-muted-foreground">When a learning is sent back to tests</p>
              </div>
            </div>
            <Switch
              checked={learning_sent_to_test}
              onCheckedChange={(checked) => {
                setlearning_sent_to_test(checked);
                callUpdateNotifications();
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Notifications;
