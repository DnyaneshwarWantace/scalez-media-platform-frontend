import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { updateLearning, getAllProjects, getAllGoals } from "./projectSlice";

const initialState = {
  tasksAssigned: [],
  tasksCompleted: [],
  checkins: [],
  keymetricsData: [],
  learningsData: [],
  goalsData: [],
  testsData: [],
  ideasData: [],

  notifications: [],

  popupMessage: null,
};

// Widgets
export const updateWidgets = createAsyncThunk("dashboard/updateWidgets", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/dashboard/update-widgets`, {
    widgets: {
      activeGoals: payload.active_goals,
      recentIdeas: payload.recent_ideas,
      activeTests: payload.active_tests,
      keyMetrics: payload.key_metrics,
      recentLearnings: payload.recent_learnings,
      activity: payload.activity,
    },
  });

  if (response.status === 200 && response.data.message === "Widgets updated successfully") {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    window.location.reload();
  }
});

// Dashboards
export const readTasks = createAsyncThunk("dashboard/readTasks", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readTasks`);

  if (response.status === 200 && response.data.message === "Tests fetched successfully") {
    thunkAPI.dispatch(updatetasksAssigned(response.data.tasksAssigned));
    thunkAPI.dispatch(updatetasksCompleted(response.data.tasksCompleted));
  }
});

export const readCheckins = createAsyncThunk("dashboard/readCheckins", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readCheckins`);

  if (response.status === 200) {
    thunkAPI.dispatch(updatecheckins(response.data.Checkins));
  }
});

export const readLearnings = createAsyncThunk("dashboard/readLearnings", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readLearnings`);

  if (response.status === 200) {
    thunkAPI.dispatch(updatelearningsData(response.data.learnings));
  }
});

export const readIdeas = createAsyncThunk("dashboard/readIdeas", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readIdeas`);
  if (response.status === 200) {
    thunkAPI.dispatch(updateideasData(response.data.ideas));
  }
});

export const readGoals = createAsyncThunk("dashboard/readGoals", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readGoals`);

  if (response.status === 200) {
    thunkAPI.dispatch(updategoalsData(response.data.goals));
  }
});

export const readTests = createAsyncThunk("dashboard/readTests", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/dashboard/readTests`);

  if (response.status === 200) {
    thunkAPI.dispatch(updatetestsData(response.data.tests));
  }
});

// Notifications
export const readNotifications = createAsyncThunk("dashboard/readNotifications", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/notification/read`);

  if (response.status === 200) {
    thunkAPI.dispatch(updatenotifications(response.data));
  }
});

export const markRead = createAsyncThunk("dashboard/markRead", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/notification/mark/${payload.notificationId}`);

  if (response.status === 200) {
    thunkAPI.dispatch(readNotifications());
  }
});

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updatetasksAssigned: (state, action) => {
      state.tasksAssigned = action.payload;
    },
    updatetasksCompleted: (state, action) => {
      state.tasksCompleted = action.payload;
    },
    updatecheckins: (state, action) => {
      state.checkins = action.payload;
    },
    updatenotifications: (state, action) => {
      state.notifications = action.payload;
    },
    appendNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },

    updatekeymetricsData: (state, action) => {
      state.keymetricsData = action.payload;
    },
    updatelearningsData: (state, action) => {
      state.learningsData = action.payload;
    },
    updategoalsData: (state, action) => {
      state.goalsData = action.payload;
    },
    updatetestsData: (state, action) => {
      state.testsData = action.payload;
    },
    updateideasData: (state, action) => {
      state.ideasData = action.payload;
    },
    updatepopupMessage: (state, action) => {
      state.popupMessage = action.payload;
    },
  },
});

export const {
  updatetasksAssigned,
  updatetasksCompleted,
  updatecheckins,
  updatenotifications,
  appendNotification,
  updatekeymetricsData,
  updatelearningsData,
  updategoalsData,
  updatetestsData,
  updateideasData,
  updatepopupMessage,
} = dashboardSlice.actions;

export const selecttasksAssigned = (state) => state.dashboard.tasksAssigned;
export const selecttasksCompleted = (state) => state.dashboard.tasksCompleted;
export const selectcheckins = (state) => state.dashboard.checkins;
export const selectnotifications = (state) => state.dashboard.notifications;

export const selectkeymetricsData = (state) => state.dashboard.keymetricsData;
export const selectlearningsData = (state) => state.dashboard.learningsData;
export const selectgoalsData = (state) => state.dashboard.goalsData;
export const selecttestsData = (state) => state.dashboard.testsData;
export const selectideasData = (state) => state.dashboard.ideasData;
export const selectpopupMessage = (state) => state.dashboard.popupMessage;

export default dashboardSlice.reducer;
