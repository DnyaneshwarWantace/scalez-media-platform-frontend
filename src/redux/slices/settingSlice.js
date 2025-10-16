import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
// import { updatepopupMessage } from "./dashboardSlice";

const initialState = {
  keyMetrics: [],
  selectedKeymetric: null,

  timezone: null,

  allGrowthLevers: [],
  selectedGrowthLever: null,

  allUsers: [],
  allCollaborators: [],

  oneRole: [],

  selectedRole: null,
  allRoles: [],
  viewRole: false,
  newRoleDialogOpen: false,
  deleteRoleDialogOpen: false,
  newKeyMetricDialogOpen: false,
  newGrowthLeverDialogOpen: false,
  userLimit: 0,
  logo: null
};

// Roles
export const getAllRoles = createAsyncThunk("setting/getAllRoles", async (_, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/role/read`, config);

  if (response.status === 200 && response.data.message === "Roles List") {
    thunkAPI.dispatch(updateallRoles(response.data.roles));
  }
});

export const createRole = createAsyncThunk("setting/createRole", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await axios.post(
    `${backendServerBaseURL}/api/v1/role/create`,
    {
      name: payload.roleName,
      permissions: {
        company_access: payload.accessToCompany,
        create_workspace: payload.createEditAWorkspace,
        create_actionPlans: payload.createActionPlans,
        create_roles: payload.createRoles,
        // share_ideas: payload.shareIdeasLink,
        add_user: payload.addUser,
        remove_user: payload.removeUser,
        // add_collaborators: payload.addRemoveCollaborators,
        create_models: payload.createModels,

        create_project: payload.createEditProject,
        delete_project: payload.deleteProject,

        create_goals: payload.createEditDeleteGoals,

        create_ideas: payload.createEditDeleteIdeas,
        nominate_ideas: payload.createNominateIdeas,

        create_tests: payload.createEditDeleteTests,

        create_learnings: payload.createEditDeleteLearnings,

        create_comments: payload.canCommentAndMentionUsers,
        mention_everyone: payload.canUseEveryoneMention,
      },
    },
    config
  );

  if (response.status === 201 && response.data.message === "Role created successfully") {
    thunkAPI.dispatch(getAllRoles());
    payload.closeDialog();
  }
});

export const updateRole = createAsyncThunk("setting/createRole", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await axios.put(
    `${backendServerBaseURL}/api/v1/role/update/${thunkAPI.getState().setting.selectedRole._id}`,
    {
      name: payload.roleName,
      permissions: {
        company_access: payload.accessToCompany,
        create_workspace: payload.createEditAWorkspace,
        create_actionPlans: payload.createActionPlans,
        create_roles: payload.createRoles,
        // share_ideas: payload.shareIdeasLink,
        add_user: payload.addUser,
        remove_user: payload.removeUser,
        create_models: payload.createModels,

        // add_collaborators: payload.addRemoveCollaborators,

        create_project: payload.createEditProject,
        delete_project: payload.deleteProject,

        create_goals: payload.createEditDeleteGoals,

        create_ideas: payload.createEditDeleteIdeas,
        nominate_ideas: payload.createNominateIdeas,

        create_tests: payload.createEditDeleteTests,

        create_learnings: payload.createEditDeleteLearnings,

        create_comments: payload.canCommentAndMentionUsers,
        mention_everyone: payload.canUseEveryoneMention,
      },
    },
    config
  );

  if (response.status === 200 && response.data.message === "Role updated successfully") {
    thunkAPI.dispatch(getAllRoles());
    payload.closeDialog();
  }
});

export const deleteRole = createAsyncThunk("setting/deleteRole", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.delete(`${backendServerBaseURL}/api/v1/role/delete/${thunkAPI.getState().setting.selectedRole._id}`, config);

  if (response.status === 200 && response.data.message === "Role deleted successfully") {
    thunkAPI.dispatch(getAllRoles());
    payload.closeDialog();
  }
});
export const findRole = createAsyncThunk("setting/findRole", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/role/findrole/${thunkAPI.getState().setting.selectedRole._id}`, config);

  // console.log("roles", response.data.roleUser)
  if (response.status === 200 && response.data.message === "Get users according to roles") {
    thunkAPI.dispatch(findOneRole(response.data.roleUser));
    // payload.closeDialog();
  }
});

// Growth Levers
export const getAllGrowthLevers = createAsyncThunk("setting/getAllGrowthLevers", async (_, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/lever/read`, config);

  if (response.status === 200) {
    thunkAPI.dispatch(updateallGrowthLevers(response.data));
  }
});

export const createGrowthLever = createAsyncThunk("setting/createGrowthLever", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await axios.post(
    `${backendServerBaseURL}/api/v1/lever/create`,
    {
      name: payload.leverName,
      color: payload.color,
      workspace: payload.workspaceId,
    },
    config
  );

  if (response.status === 200 && response.data.message === "Lever created successfully") {
    thunkAPI.dispatch(getAllGrowthLevers());
    payload.closeDialog();
  }
});

export const updateGrowthLever = createAsyncThunk("setting/updateGrowthLever", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await axios.put(
    `${backendServerBaseURL}/api/v1/lever/update/${thunkAPI.getState().setting.selectedGrowthLever._id}`,
    {
      name: payload.leverName,
      color: payload.color,
      workspace: payload.workspaceId,
    },
    config
  );

  if (response.status === 200 && response.data.message === "Lever updated successfully") {
    thunkAPI.dispatch(getAllGrowthLevers());
    payload.closeDialog();
  }
});

export const deleteGrowthLever = createAsyncThunk("setting/deleteGrowthLever", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.delete(`${backendServerBaseURL}/api/v1/lever/delete/${thunkAPI.getState().setting.selectedGrowthLever._id}`, config);

  if (response.status === 200 && response.data.message === "Lever deleted successfully") {
    thunkAPI.dispatch(getAllGrowthLevers());
    payload.closeDialog();
  }
});

// keyMetrics
export const getAllkeyMetrics = createAsyncThunk("setting/getAllkeyMetrics", async (_, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/keymetric/read`, config);

  if (response.status === 200 && response.data.message === "Keymetrics retrieved successfully") {
    thunkAPI.dispatch(updatekeyMetrics(response.data.keymetrics));
  }
});

export const createkeyMetric = createAsyncThunk("setting/createkeyMetric", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await axios.post(
    `${backendServerBaseURL}/api/v1/keymetric/create`,
    {
      name: payload.name,
      shortName: payload.shortName,
      description: payload.description,
      metricType: payload.metricType,
      metricTime: payload.metricTimePeriod,
      type: payload.currencyType,
    },
    config
  );

  if (response.status === 201 && response.data.message === "Keymetric created successfully") {
    thunkAPI.dispatch(getAllkeyMetrics());
    payload.closeModal();
  }
});

export const deletekeyMetric = createAsyncThunk("setting/deletekeyMetric", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/keymetric/delete/${thunkAPI.getState().setting.selectedKeymetric?._id}`);

  if (response.status === 200 && response.data.message === "Keymetric deleted successfully") {
    thunkAPI.dispatch(getAllkeyMetrics());
    payload.closeDialog();
  }
});

// Timezone
export const readTimezone = createAsyncThunk("setting/readTimezone", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/timezone/read`);

  if (response.status === 200 && response.data.message === "Timezone retrieved successfully") {
    thunkAPI.dispatch(updateTimezone(response.data.timezone));
  }
});

export const updateTimezone = createAsyncThunk("setting/updateTimezone", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/timezone/update`, {
    name: payload.timeZone,
  });

  if (response.status === 200 && response.data.message === "Keymetric deleted successfully") {
    thunkAPI.dispatch(updateTimezone(response.data.timezone));
    // thunkAPI.dispatch(readTimezone());
  }
});

// Users
export const updateProfilePicture = createAsyncThunk("setting/updateProfilePicture", async (payload, thunkAPI) => {
  var bodyFormData = new FormData();
  bodyFormData.append("avatar", payload.file);

  let response = await axios.post(`${backendServerBaseURL}/api/v1/auth/uploadProfilePicture`, bodyFormData);

  if (response.status === 200 && response.data.message === "Profile picture updated successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});

export const deleteProfilePicture = createAsyncThunk("setting/deleteProfilePicture", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/auth/deleteProfilePicture`);

  if (response.status === 200 && response.data.message === "Profile picture deleted successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});

export const updateProfile = createAsyncThunk("setting/updateProfile", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/auth/updateProfile`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    designation: payload.designation,
    about: payload.about,
  });

  if (response.status === 200 && response.data.message === "Profile updated successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
    // thunkAPI.dispatch(updatepopupMessage("Role updated successfully !!!!"));
  }
});

export const updatePassword = createAsyncThunk("setting/updatePassword", async (payload, thunkAPI) => {
  try {
    let response = await axios.put(`${backendServerBaseURL}/api/v1/auth/updatePassword`, {
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    });

    if (response.status === 200 && response.data.message === "Password updated successfully") {
      payload.closeDialog();
      // localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  } catch (err) {
    payload.setErrors({ afterSubmit: err.response.data.message });
  }
});

export const getAllUsers = createAsyncThunk("setting/getAllUsers", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/management/readUsers`);

  if (response.status === 200 && response.data.message === "Users retrieved successfully") {
    thunkAPI.dispatch(updateAllUsers(response.data.users));
    thunkAPI.dispatch(updateUserLimit(response.data.limit)); //newChange TBD
  }
});

export const inviteUser = createAsyncThunk("setting/inviteUser", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/management/inviteUser`, {
    emails: payload.emails,
    role: payload.role,
  });

  if (response.status === 200 && response.data.message === "Users invited successfully") {
    thunkAPI.dispatch(getAllUsers());
    payload.closeDialog();
  }
});

export const makeAdmin = createAsyncThunk("setting/makeAdmin", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/management/makeAdmin/${payload.userId}`);

  if (response.status === 200 && response.data.message === "User made admin") {
    thunkAPI.dispatch(getAllUsers());
  }
});

export const makeUser = createAsyncThunk("setting/makeUser", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/management/makeAdminToUser/${payload.userId}`);

  if (response.status === 200 && response.data.message === "admin made to user") {
    thunkAPI.dispatch(getAllUsers());
  }
});

export const changeUserRole = createAsyncThunk("setting/changeUserRole", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/management/updateUser/${payload.userId}`, {
    role: payload.role,
  });

  if (response.status === 200 && response.data.message === "User updated successfully") {
    // localStorage.setItem("user", JSON.stringify(response.data.user));
    thunkAPI.dispatch(findRole({}));
    thunkAPI.dispatch(getAllUsers());
    payload.closeDialog();
    if (payload.reload === true) {
      window.location.reload();
    }
  }
});

// Company
export const updateCompany = createAsyncThunk("setting/updateCompany", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  let response = await axios.put(
    `${backendServerBaseURL}/api/v1/auth/updateCompany`,
    {
      company: payload.company,
      timezone: payload.timezone,
      address: payload.address,
      address2: payload.address2,
      city: payload.city,
      state: payload.state,
      zip: payload.zip,
      country: payload.country,
      currency: payload.currency,
      domain: payload.domain,
    },
    config
  );

  if (response.status === 200 && response.data.message === "Company updated successfully") {
    // payload.setprofileEditing(false);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
});

export const uploadFevicon = createAsyncThunk("setting/uploadFevicon", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  var bodyFormData = new FormData();
  bodyFormData.append("fevicon", payload.file);

  let response = await axios.post(`${backendServerBaseURL}/api/v1/auth/uploadFevicon`, bodyFormData, config);

  if (response.status === 200 && response.data.message === "Fevicon picture updated successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});
export const uploadLogo = createAsyncThunk("setting/uploadLogo", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  var bodyFormData = new FormData();
  bodyFormData.append("logo", payload.file);

  let response = await axios.post(`${backendServerBaseURL}/api/v1/auth/uploadLogo`, bodyFormData, config);

  if (response.status === 200 && response.data.message === "Logo picture updated successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    console.log('uploadLogo', JSON.stringify(response.data.user))
    let userLogo = response.data.user;
    console.log('userLogo', userLogo)
    thunkAPI.dispatch(updateUserLogo(userLogo.logo));
    window.location.reload();
  }
});

export const deleteFevicon = createAsyncThunk("setting/deleteFevicon", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/auth/deleteFevicon`, config);

  if (response.status === 200 && response.data.message === "Fevicon picture deleted successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});
export const deleteLogo = createAsyncThunk("setting/deleteLogo", async (payload, thunkAPI) => {
  const token = await localStorage.getItem("accessToken", "");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/auth/deleteLogo`, config);

  if (response.status === 200 && response.data.message === "Logo picture deleted successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});

// Notifications
export const updateNotifications = createAsyncThunk("setting/updateNotifications", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/auth/updateNotificationSettings`, payload);

  if (response.status === 200 && response.data.message === "Notification settings updated successfully") {
    // payload.setprofileEditing(false);
  }
});

// Collaborators
export const getAllCollaborators = createAsyncThunk("setting/getAllCollaborators", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/management/readCollaborators`);

  if (response.status === 200 && response.data.message === "Collaborators retrieved successfully") {
    thunkAPI.dispatch(updateAllCollaborators(response.data.users));
    payload.closeDialog();
  }
});

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    updatekeyMetrics: (state, action) => {
      state.keyMetrics = action.payload;
    },
    updateselectedKeymetric: (state, action) => {
      state.selectedKeymetric = action.payload;
    },
    updateTimezone: (state, action) => {
      state.timezone = action.payload;
    },
    updateAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    updateAllCollaborators: (state, action) => {
      state.allCollaborators = action.payload;
    },
    updateselectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    updateallRoles: (state, action) => {
      state.allRoles = action.payload;
    },
    updateallGrowthLevers: (state, action) => {
      state.allGrowthLevers = action.payload;
    },
    updateselectedGrowthLever: (state, action) => {
      state.selectedGrowthLever = action.payload;
    },
    updateviewRole: (state, action) => {
      state.viewRole = action.payload;
    },
    updateNewRoleDialogOpen: (state, action) => {
      state.newRoleDialogOpen = action.payload;
    },
    updateDeleteRoleDialogOpen: (state, action) => {
      state.deleteRoleDialogOpen = action.payload;
    },
    updateNewKeyMetricDialogOpen: (state, action) => {
      state.newKeyMetricDialogOpen = action.payload;
    },
    updateNewGrowthLeverDialogOpen: (state, action) => {
      state.newGrowthLeverDialogOpen = action.payload;
    },
    findOneRole: (state, action) => {
      state.oneRole = action.payload;
    },
    updateUserLimit: (state, action) => {
      state.userLimit = action.payload;
    }, //newChange TBD
    updateUserLogo: (state, action) => {
      state.logo = action.payload;
    },
  },
});

export const {
  updateselectedGrowthLever,
  updateallGrowthLevers,
  updateallRoles,
  updatekeyMetrics,
  updateselectedKeymetric,
  updateAllUsers,
  updateAllCollaborators,
  updateselectedRole,
  updateviewRole,
  updateNewRoleDialogOpen,
  updateDeleteRoleDialogOpen,
  updateNewKeyMetricDialogOpen,
  updateNewGrowthLeverDialogOpen,
  findOneRole,
  updateUserLimit, //newChange TBD
  updateUserLogo
} = settingSlice.actions;

export const selectkeyMetrics = (state) => state.setting.keyMetrics;
export const selectselectedKeymetric = (state) => state.setting.selectedKeymetric;
export const selectTimezone = (state) => state.setting.timezone;
export const selectAllUsers = (state) => state.setting.allUsers;
export const selectAllCollaborators = (state) => state.setting.allCollaborators;
export const selectselectedRole = (state) => state.setting.selectedRole;
export const selectallRoles = (state) => state.setting.allRoles;
export const selectallGrowthLevers = (state) => state.setting.allGrowthLevers;
export const selectselectedGrowthLever = (state) => state.setting.selectedGrowthLever;
export const selectviewRole = (state) => state.setting.viewRole;
export const selectNewRoleDialogOpen = (state) => state.setting.newRoleDialogOpen;
export const selectDeleteRoleDialogOpen = (state) => state.setting.deleteRoleDialogOpen;
export const selectNewKeyMetricDialogOpen = (state) => state.setting.newKeyMetricDialogOpen;
export const selectNewGrowthLeverDialogOpen = (state) => state.setting.newGrowthLeverDialogOpen;
export const findARole = (state) => state.setting.oneRole;
export const selectUserLimit = (state) => state.setting.userLimit; //newChange TBD
export const selectUserLogo = (state) => state.setting.logo; //newChange TBD
export default settingSlice.reducer;
