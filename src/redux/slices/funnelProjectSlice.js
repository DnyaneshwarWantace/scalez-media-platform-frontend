import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import axiosInstance from "../../utils/axios";

const initialState = {
  allProjects: [],
  singleProject: null,
  selectedSidebarTab: "canvas",
  reportsSelectedTab: "projectSummary",
  scenarioId: 0,
};

// ----------------------- Project ----------------------- //

export const createProject = createAsyncThunk(
  "funnelProject/createProject",
  async (payload, _) => {
    const data = {
      title: payload.title,
      description: payload.description,
    };

    try {
      let response = await axiosInstance.post(
        `${backendServerBaseURL}/api/v1/funnel-project`,
        data
      );

      if (
        response.status === 200 &&
        response.data.message === "Project created successfully"
      ) {
        payload.createNewProjectCloseRef.current.click();

        const projectId = response.data.payload.project._id;
        localStorage.setItem("projectId", projectId);
        window.open(`/funnel/${projectId}`, "_self");
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const updateProject = createAsyncThunk(
  "funnelProject/updateProject",
  async (payload, _) => {
    const data = {
      title: payload.title,
      description: payload.description,
      processingRatePercent: payload.processingRatePercent,
      perTransactionFee: payload.perTransactionFee,
    };

    try {
      let response = await axiosInstance.patch(
        `${backendServerBaseURL}/api/v1/funnel-project/${payload.projectId}`,
        data
      );

      if (
        response.status === 200 &&
        response.data.message === "Project updated successfully"
      ) {
        payload.editProjectCloseRef.current.click();
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "funnelProject/getAllProjects",
  async (payload, thunkAPI) => {
    try {
      let response = await axiosInstance.get(
        `${backendServerBaseURL}/api/v1/funnel-project`
      );

      if (
        response.status === 200 &&
        response.data.message === "Projects list"
      ) {
        const allProjects = response.data.payload.projects;
        thunkAPI.dispatch(updateAllProjects(allProjects));
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const deleteProject = createAsyncThunk(
  "funnelProject/deleteProject",
  async (payload, thunkAPI) => {
    try {
      let response = await axiosInstance.delete(
        `${backendServerBaseURL}/api/v1/funnel-project/${payload.projectId}`
      );

      if (
        response.status === 200 &&
        response.data.message === "Project deleted successfully"
      ) {
        payload.closeDeleteprojectModalRef.current.click();
        thunkAPI.dispatch(getAllProjects());

        let otherProjects = thunkAPI
          .getState()
          .project.allProjects.filter((p) => p._id != payload.projectId);

        if (payload.projectId === payload.openedProjectId) {
          window.open(
            `/funnel/${otherProjects.length > 0 ? otherProjects[0]._id : "0"}`,
            "_self"
          );
        } else {
          window.open("/funnel/0", "_self");
        }
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const getSingleProject = createAsyncThunk(
  "funnelProject/getSingleProject",
  async (payload, thunkAPI) => {
    try {
      let response = await axiosInstance.get(
        `${backendServerBaseURL}/api/v1/funnel-project/${payload.projectId}`
      );

      if (response.status === 200) {
        if (payload.setNodes) {
          payload.setNodes((nds) => response.data.payload.scenario[0].nodes);
        }

        if (payload.setEdges) {
          payload.setEdges((edgs) => response.data.payload.scenario[0].edges);
        }

        thunkAPI.dispatch(updatesingleProject(response.data.payload));
        // if (thunkAPI.getState().project.scenarioId === 0) {
        thunkAPI.dispatch(
          updateScenarioId(response.data.payload.scenario[0]._id)
        );
        // }
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

// ----------------------- Scenario ----------------------- //

export const createScenario = createAsyncThunk(
  "funnelProject/createScenario",
  async (payload, thunkAPI) => {
    const data = {};

    try {
      let response = await axiosInstance.post(
        `${backendServerBaseURL}/api/v1/funnel-project/${payload.projectId}/scenario`,
        data
      );

      if (
        response.status === 200 &&
        response.data.message === "Scenario created successfully"
      ) {
        thunkAPI.dispatch(getSingleProject({ projectId: payload.projectId }));
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const deleteScenario = createAsyncThunk(
  "funnelProject/deleteScenario",
  async (payload, thunkAPI) => {
    try {
      let response = await axiosInstance.delete(
        `${backendServerBaseURL}/api/v1/funnel-project/${payload.projectId}/scenario/${payload.scenarioId}`
      );

      if (
        response.status === 200 &&
        response.data.message === "Scenario deleted successfully"
      ) {
        thunkAPI.dispatch(getSingleProject({ projectId: payload.projectId }));
      }
    } catch (err) {
      payload.setErrors({ afterSubmit: err.response.data.message });
    }
  }
);

export const funnelProjectSlice = createSlice({
  name: "funnelProject",
  initialState,
  reducers: {
    updateAllProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    updatesingleProject: (state, action) => {
      state.singleProject = action.payload;
    },
    updateselectedSidebarTab: (state, action) => {
      state.selectedSidebarTab = action.payload;
    },
    updatereportsSelectedTab: (state, action) => {
      state.reportsSelectedTab = action.payload;
    },
    updateScenarioId: (state, action) => {
      state.scenarioId = action.payload;
    },
    updateNodesInSelectedScenario: (state, action) => {
      if (
        state.singleProject &&
        state.singleProject.scenario.find((s) => s._id === state.scenarioId)
      ) {
        state.singleProject.scenario.find(
          (s) => s._id === state.scenarioId
        ).nodes = action.payload;
      }
    },
    updateEdgesInSelectedScenario: (state, action) => {
      if (
        state.singleProject &&
        state.singleProject.scenario.find((s) => s._id === state.scenarioId)
      ) {
        state.singleProject.scenario.find(
          (s) => s._id === state.scenarioId
        ).edges = action.payload;
      }
    },
  },
});

export const {
  updateAllProjects,
  updatesingleProject,
  updateselectedSidebarTab,
  updatereportsSelectedTab,
  updateScenarioId,
  updateNodesInSelectedScenario,
  updateEdgesInSelectedScenario,
} = funnelProjectSlice.actions;

export const selectAllProjects = (state) => state.funnelProject.allProjects;
export const selectsingleProject = (state) => state.funnelProject.singleProject;
export const selectselectedSidebarTab = (state) =>
  state.funnelProject.selectedSidebarTab;
export const selectreportsSelectedTab = (state) =>
  state.funnelProject.reportsSelectedTab;
export const selectScenarioId = (state) => state.funnelProject.scenarioId;

export default funnelProjectSlice.reducer;
