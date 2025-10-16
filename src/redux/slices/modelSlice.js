import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { Navigate } from "react-router-dom";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

const initialState = {
  models: [],
  selectedModel: null,
  singleModelInfo: null,
  showDeleteModelDialog: false,
  showCreateModelDialog: false,
};

// Models
export const getAllModels = createAsyncThunk("model/getAllModels", async (_, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/models/read`);

  if (response.status === 200 && response.data.message === "Models fetched successfully") {
    thunkAPI.dispatch(updateModels(response.data.models));
  }
});

export const getSingleModel = createAsyncThunk("model/getSingleModel", async (payload, thunkAPI) => {
  let response = await axios.get(`${backendServerBaseURL}/api/v1/models/read/${payload.modelId}`);

  if (response.status === 200 && response.data.message === "Model fetched successfully") {
    thunkAPI.dispatch(updatesingleModelInfo(response.data.model));
  }
});

export const createModel = createAsyncThunk("model/createModel", async (payload, thunkAPI) => {
  let response = await axios.post(`${backendServerBaseURL}/api/v1/models/create`, {
    name: payload.name,
    values: payload.values,
  });

  console.log('response :>> ', response);

  if (response.status === 201 && response.data.message === "Model created successfully") {
    payload.navigate(`/models/${response.data.model._id}`);
    thunkAPI.dispatch(getSingleModel({modelId : response.data.model._id}));
    window.location.reload();
    payload.closeModal();
  }
});

export const editModel = createAsyncThunk("model/editModel", async (payload, thunkAPI) => {
  let response = await axios.put(`${backendServerBaseURL}/api/v1/models/update/${payload.modelId}`, {
    name: payload.name,
    values: payload.values,
  });

  if (response.status === 200 && response.data.message === "Model updated successfully") {
    thunkAPI.dispatch(getSingleModel());
    payload.closeModal();
  }
});

export const deleteModel = createAsyncThunk("model/deleteModel", async (payload, thunkAPI) => {
  let response = await axios.delete(`${backendServerBaseURL}/api/v1/models/delete/${thunkAPI.getState().model.selectedModel._id}`);

  if (response.status === 200 && response.data.message === "Model deleted successfully") {
    thunkAPI.dispatch(getAllModels());
    payload.closeModal();
  }
});

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    updateModels: (state, action) => {
      state.models = action.payload;
    },
    updateselectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    updatesingleModelInfo: (state, action) => {
      state.singleModelInfo = action.payload;
    },
    updateShowDeleteModelDialog: (state, action) => {
      state.showDeleteModelDialog = action.payload;
    },
    updateShowCreateModelDialog: (state, action) => {
      state.showCreateModelDialog = action.payload;
    },
  },
});

export const { updateModels, updateselectedModel, updatesingleModelInfo, updateShowDeleteModelDialog, updateShowCreateModelDialog } = modelSlice.actions;

export const selectmodels = (state) => state.model.models;
export const selectselectedModel = (state) => state.model.selectedModel;
export const selectsingleModelInfo = (state) => state.model.singleModelInfo;
export const selectShowDeleteModelDialog = (state) => state.model.showDeleteModelDialog;
export const selectShowCreateModelDialog = (state) => state.model.showCreateModelDialog;

export default modelSlice.reducer;
