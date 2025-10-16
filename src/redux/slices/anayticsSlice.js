import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { readTasks } from "./dashboardSlice";

const initialState = {
  anayticsData: [],
  span: "2weeks",
  ideaTest:{}
};

// Anaytics
export const getAnayticsData = createAsyncThunk("anaytics/getAnayticsData", async (_, thunkAPI) => {
  let config = {
    params: {
      span: thunkAPI.getState().anaytics.span,
    },
  };

  let response = await axios.get(`${backendServerBaseURL}/api/v1/analytics/read`, config);

  if (response.status === 200 && response.data.message === "Projects fetched successfully") {
    thunkAPI.dispatch(updateanayticsData(response.data));
  }
});





export const anayticsSlice = createSlice({
  name: "anaytics",
  initialState,
  reducers: {
    updateanayticsData: (state, action) => {
      console.log(action.payload)
      state.anayticsData = action.payload.projects;
      state.ideaTest.idea=action.payload.idea
      state.ideaTest.test=action.payload.test
      state.ideaTest.learning=action.payload.learning
      state.ideaTest.labels=action.payload.labels
      state.ideaTest.data=action.payload.data

      state.ideaTest.acquisition = action.payload.acquisition
      state.ideaTest.activation = action.payload.activation
      state.ideaTest.referral = action.payload.referral
      state.ideaTest.retention = action.payload.retention
      state.ideaTest.revenue = action.payload.revenue

      state.ideaTest.userData = action.payload.userData


    },
    updatespan: (state, action) => {
      state.span = action.payload;
    },
  },
});

export const { updateanayticsData, updatespan } = anayticsSlice.actions;

export const selectanayticsData = (state) => state.anaytics.anayticsData;
export const ideaTestData = (state) => state.anaytics.ideaTest;
// export const ideaData = (state) => state.anaytics.idea;
export const selectspan = (state) => state.anaytics.span;

export default anayticsSlice.reducer;
