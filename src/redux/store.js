import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "./slices/generalSlice";
import projectReducer from "./slices/projectSlice";
import settingReducer from "./slices/settingSlice";
import modelReducer from "./slices/modelSlice";
import dashboardReducer from "./slices/dashboardSlice";
import actionPlanReducer from "./slices/actionPlanSlice";
import anayticsReducer from "./slices/anayticsSlice";
import funnelProjectReducer from "./slices/funnelProjectSlice";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    project: projectReducer,
    setting: settingReducer,
    model: modelReducer,
    dashboard: dashboardReducer,
    actionPlan: actionPlanReducer,
    anaytics: anayticsReducer,
    funnelProject: funnelProjectReducer,
  },
});
