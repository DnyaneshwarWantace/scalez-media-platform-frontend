import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect } from "react";
import "react-multi-email/style.css";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  createRole,
  selectallRoles,
  selectselectedRole,
  selectviewRole,
  selectNewRoleDialogOpen,
  updateNewRoleDialogOpen,
  updateRole,
} from "../../../redux/slices/settingSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { AlertCircle } from "lucide-react";

function NewRoleDialog() {
  const dispatch = useDispatch();
  const open = useSelector(selectNewRoleDialogOpen);
  const selectedRole = useSelector(selectselectedRole);
  const viewRole = useSelector(selectviewRole);
  const allRoles = useSelector(selectallRoles);
  const checkRoles = allRoles.map((el) => el.name);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [selectedPermission, setSelectedPermission] = React.useState("");

  const closeDialog = () => {
    dispatch(updateNewRoleDialogOpen(false));
  };

  const newRoleFormik = useFormik({
    initialValues: {
      roleName: "",
      accessToCompany: true,
      createEditAWorkspace: true,
      createActionPlans: true,
      createRoles: true,
      addUser: true,
      removeUser: true,
      createModels: true,
      createEditProject: true,
      deleteProject: true,
      createEditDeleteGoals: true,
      createEditDeleteIdeas: true,
      createNominateIdeas: true,
      createEditDeleteTests: true,
      createEditDeleteLearnings: true,
      canCommentAndMentionUsers: true,
      canUseEveryoneMention: true,
    },
    validationSchema: Yup.object().shape({
      roleName: Yup.string().required("Role Name is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      if (selectedRole) {
        dispatch(updateRole({ ...values, setErrors, closeDialog }));
      } else {
        dispatch(createRole({ ...values, setErrors, closeDialog }));
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    function checkInputValue() {
      const lowerCaseInputValue = newRoleFormik.values.roleName.toLowerCase();
      const lowerCaseArray = checkRoles.map((value) => value.toLowerCase());

      // Don't show warning if:
      // 1. We're editing and the name hasn't changed from the original
      // 2. Field hasn't been touched
      const isOriginalName = selectedRole && selectedRole.name.toLowerCase() === lowerCaseInputValue;

      if (
        lowerCaseArray.includes(lowerCaseInputValue) &&
        newRoleFormik.touched.roleName === true &&
        !isOriginalName
      ) {
        setWarningMessage("Role name already exists");
      } else {
        setWarningMessage("");
      }
    }
    checkInputValue();
  }, [newRoleFormik.values.roleName, checkRoles, selectedRole]);

  const isDisabled = (() => {
    const lowerCaseInputValue = newRoleFormik.values.roleName.toLowerCase();
    const lowerCaseArray = checkRoles.map((value) => value.toLowerCase());
    const isOriginalName = selectedRole && selectedRole.name.toLowerCase() === lowerCaseInputValue;

    // Only disable if name exists AND it's not the original name (when editing)
    return lowerCaseArray.includes(lowerCaseInputValue) && !isOriginalName;
  })();

  useEffect(() => {
    setSelectedPermission("");

    if (selectedRole) {
      if (
        selectedRole?.permissions.company_access &&
        selectedRole?.permissions.create_workspace &&
        selectedRole?.permissions.create_actionPlans &&
        selectedRole?.permissions.create_roles &&
        selectedRole?.permissions.add_user &&
        selectedRole?.permissions.remove_user &&
        selectedRole?.permissions.create_models &&
        selectedRole?.permissions.create_project &&
        selectedRole?.permissions.delete_project &&
        selectedRole?.permissions.create_goals &&
        selectedRole?.permissions.create_ideas &&
        selectedRole?.permissions.create_tests &&
        selectedRole?.permissions.create_learnings &&
        selectedRole?.permissions.create_comments &&
        selectedRole?.permissions.mention_everyone
      ) {
        setSelectedPermission("all");
      } else {
        setSelectedPermission("custom");
      }

      newRoleFormik.setValues({
        roleName: selectedRole.name,
        accessToCompany: selectedRole?.permissions.company_access,
        createEditAWorkspace: selectedRole?.permissions.create_workspace,
        createActionPlans: selectedRole?.permissions.create_actionPlans,
        createRoles: selectedRole?.permissions.create_roles,
        addUser: selectedRole?.permissions.add_user,
        removeUser: selectedRole?.permissions.remove_user,
        createModels: selectedRole?.permissions.create_models,
        createEditProject: selectedRole?.permissions.create_project,
        deleteProject: selectedRole?.permissions.delete_project,
        createEditDeleteGoals: selectedRole?.permissions.create_goals,
        createEditDeleteIdeas: selectedRole?.permissions.create_ideas,
        createNominateIdeas: selectedRole?.permissions.nominate_ideas,
        createEditDeleteTests: selectedRole?.permissions.create_tests,
        createEditDeleteLearnings: selectedRole?.permissions.create_learnings,
        canCommentAndMentionUsers: selectedRole?.permissions.create_comments,
        canUseEveryoneMention: selectedRole?.permissions.mention_everyone,
      });
    } else {
      newRoleFormik.setValues({
        roleName: "",
        accessToCompany: true,
        createEditAWorkspace: true,
        createActionPlans: true,
        createRoles: true,
        addUser: true,
        removeUser: true,
        createModels: true,
        createEditProject: true,
        deleteProject: true,
        createEditDeleteGoals: true,
        createEditDeleteIdeas: true,
        createNominateIdeas: true,
        createEditDeleteTests: true,
        createEditDeleteLearnings: true,
        canCommentAndMentionUsers: true,
        canUseEveryoneMention: true,
      });
    }
  }, [selectedRole]);

  const setAllPermissions = (value) => {
    newRoleFormik.setFieldValue("accessToCompany", value);
    newRoleFormik.setFieldValue("createEditAWorkspace", value);
    newRoleFormik.setFieldValue("createActionPlans", value);
    newRoleFormik.setFieldValue("createRoles", value);
    newRoleFormik.setFieldValue("addUser", value);
    newRoleFormik.setFieldValue("removeUser", value);
    newRoleFormik.setFieldValue("createModels", value);
    newRoleFormik.setFieldValue("createEditProject", value);
    newRoleFormik.setFieldValue("deleteProject", value);
    newRoleFormik.setFieldValue("createEditDeleteGoals", value);
    newRoleFormik.setFieldValue("createEditDeleteIdeas", value);
    newRoleFormik.setFieldValue("createNominateIdeas", value);
    newRoleFormik.setFieldValue("createEditDeleteTests", value);
    newRoleFormik.setFieldValue("createEditDeleteLearnings", value);
    newRoleFormik.setFieldValue("canCommentAndMentionUsers", value);
    newRoleFormik.setFieldValue("canUseEveryoneMention", value);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => dispatch(updateNewRoleDialogOpen(isOpen))}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <FormikProvider value={newRoleFormik}>
          <Form autoComplete="off" noValidate onSubmit={newRoleFormik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {viewRole ? "View Role" : selectedRole ? "Edit Role" : "New Role"}
              </DialogTitle>
              <DialogDescription>
                {viewRole ? "Role details and permissions" : selectedRole ? "Update role permissions" : "Create a new role with custom permissions"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Role Name */}
              <div className="space-y-2">
                <Label htmlFor="roleName">
                  Role Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="roleName"
                  type="text"
                  {...newRoleFormik.getFieldProps("roleName")}
                  placeholder="e.g., Content Manager"
                  disabled={viewRole}
                />
                {newRoleFormik.touched.roleName && newRoleFormik.errors.roleName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {newRoleFormik.errors.roleName}
                  </p>
                )}
                {warningMessage && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {warningMessage}
                  </p>
                )}
              </div>

              {/* Permissions Select */}
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <Select
                  disabled={viewRole}
                  value={selectedPermission}
                  onValueChange={(value) => {
                    setSelectedPermission(value);
                    if (value === "all") {
                      setAllPermissions(true);
                    } else if (value === "custom") {
                      setAllPermissions(false);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Permissions</SelectItem>
                    <SelectItem value="custom">Custom Permissions</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select all permissions or customize individually
                </p>
              </div>

              {/* Permissions Checkboxes */}
              {selectedPermission !== "" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Admin */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Admin</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="accessToCompany"
                            disabled={viewRole}
                            checked={newRoleFormik.values.accessToCompany}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("accessToCompany", checked)}
                          />
                          <Label htmlFor="accessToCompany" className="text-sm font-normal cursor-pointer">
                            Access to Company
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditAWorkspace"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditAWorkspace}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditAWorkspace", checked)}
                          />
                          <Label htmlFor="createEditAWorkspace" className="text-sm font-normal cursor-pointer">
                            Create/Edit Workspace
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createActionPlans"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createActionPlans}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createActionPlans", checked)}
                          />
                          <Label htmlFor="createActionPlans" className="text-sm font-normal cursor-pointer">
                            Create Action Plans
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createRoles"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createRoles}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createRoles", checked)}
                          />
                          <Label htmlFor="createRoles" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Roles
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="addUser"
                            disabled={viewRole}
                            checked={newRoleFormik.values.addUser}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("addUser", checked)}
                          />
                          <Label htmlFor="addUser" className="text-sm font-normal cursor-pointer">
                            Add User
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="removeUser"
                            disabled={viewRole}
                            checked={newRoleFormik.values.removeUser}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("removeUser", checked)}
                          />
                          <Label htmlFor="removeUser" className="text-sm font-normal cursor-pointer">
                            Remove User
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createModels"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createModels}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createModels", checked)}
                          />
                          <Label htmlFor="createModels" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Models
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Project & Others */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Project</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditProject"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditProject}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditProject", checked)}
                          />
                          <Label htmlFor="createEditProject" className="text-sm font-normal cursor-pointer">
                            Create/Edit Project
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="deleteProject"
                            disabled={viewRole}
                            checked={newRoleFormik.values.deleteProject}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("deleteProject", checked)}
                          />
                          <Label htmlFor="deleteProject" className="text-sm font-normal cursor-pointer">
                            Delete Project
                          </Label>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mt-4">Goals</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditDeleteGoals"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditDeleteGoals}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditDeleteGoals", checked)}
                          />
                          <Label htmlFor="createEditDeleteGoals" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Goals
                          </Label>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mt-4">Ideas</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditDeleteIdeas"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditDeleteIdeas}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditDeleteIdeas", checked)}
                          />
                          <Label htmlFor="createEditDeleteIdeas" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Ideas
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createNominateIdeas"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createNominateIdeas}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createNominateIdeas", checked)}
                          />
                          <Label htmlFor="createNominateIdeas" className="text-sm font-normal cursor-pointer">
                            Nominate Ideas
                          </Label>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mt-4">Tests</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditDeleteTests"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditDeleteTests}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditDeleteTests", checked)}
                          />
                          <Label htmlFor="createEditDeleteTests" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Tests
                          </Label>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mt-4">Learnings</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createEditDeleteLearnings"
                            disabled={viewRole}
                            checked={newRoleFormik.values.createEditDeleteLearnings}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("createEditDeleteLearnings", checked)}
                          />
                          <Label htmlFor="createEditDeleteLearnings" className="text-sm font-normal cursor-pointer">
                            Create/Edit/Delete Learnings
                          </Label>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mt-4">Comments</h3>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="canCommentAndMentionUsers"
                            disabled={viewRole}
                            checked={newRoleFormik.values.canCommentAndMentionUsers}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("canCommentAndMentionUsers", checked)}
                          />
                          <Label htmlFor="canCommentAndMentionUsers" className="text-sm font-normal cursor-pointer">
                            Comment & Mention Users
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="canUseEveryoneMention"
                            disabled={viewRole}
                            checked={newRoleFormik.values.canUseEveryoneMention}
                            onCheckedChange={(checked) => newRoleFormik.setFieldValue("canUseEveryoneMention", checked)}
                          />
                          <Label htmlFor="canUseEveryoneMention" className="text-sm font-normal cursor-pointer">
                            Use @everyone Mention
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                {viewRole ? "Close" : "Cancel"}
              </Button>
              {!viewRole && (
                <Button
                  type="submit"
                  disabled={
                    !selectedRole &&
                    (isDisabled ||
                      (newRoleFormik.errors &&
                        Object.keys(newRoleFormik.errors)?.length !== 0))
                  }
                >
                  {selectedRole ? "Save Changes" : "Create Role"}
                </Button>
              )}
            </DialogFooter>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export default NewRoleDialog;
