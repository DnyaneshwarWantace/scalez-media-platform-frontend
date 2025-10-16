import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

const initialState = {
  actionPlans: [],
  selectedActionPlan: null,
  selectedCategory: null,
  selectedPointer: null,
  singlePointerInfo: null,
  extActionPlans: [],
};

// Docs
export const getAllActionPlans = createAsyncThunk(
  "actionPlan/getAllActionPlans",
  async (_, thunkAPI) => {
    let config = {
      params: {},
    };

    let response = await axios.get(
      `${backendServerBaseURL}/api/v1/plan/read`,
      config
    );

    if (
      response.status === 200 &&
      response.data.message === "Plans fetched successfully"
    ) {
      thunkAPI.dispatch(updateActionPlans(response.data.plans));
    }
  }
);

export const getExternalActionPlans = createAsyncThunk(
  "actionPlan/getExternalActionPlans",
  async (_, thunkAPI) => {
    let config = {
      params: {},
    };

    let response = await axios.get(
      `${backendServerBaseURL}/api/v1/plan/readExternal`,
      config
    );

    if (
      response.status === 200 &&
      response.data.message === "Plans fetched successfully"
    ) {
      thunkAPI.dispatch(updateExternalActionPlans(response.data.plans));
    }
  }
);

export const createActionPlan = createAsyncThunk(
  "actionPlan/createActionPlan",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/plan/create`,
      {
        name: payload.name,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Plan created successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
    }
  }
);

export const editActionPlan = createAsyncThunk(
  "actionPlan/editActionPlan",
  async (payload, thunkAPI) => {
    let response = await axios.put(
      `${backendServerBaseURL}/api/v1/plan/update/${
        thunkAPI.getState().actionPlan.selectedActionPlan._id
      }`,
      {
        name: payload.name,
        isOpened: null,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Plan updated successfully"
    ) {
      payload.closeModal();
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

export const updateIsOpenedForDoc = createAsyncThunk(
  "actionPlan/updateIsOpenedForDoc",
  async (payload, thunkAPI) => {
    let response = await axios.put(
      `${backendServerBaseURL}/api/v1/plan/update/${payload.actionPlanId}`,
      {
        name: payload.name,
        isOpened: payload.isOpened,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Plan updated successfully"
    ) {
      payload.closeModal();
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

export const deleteActionPlan = createAsyncThunk(
  "actionPlan/deleteActionPlan",
  async (payload, thunkAPI) => {
    let response = await axios.delete(
      `${backendServerBaseURL}/api/v1/plan/delete/${
        thunkAPI.getState().actionPlan.selectedActionPlan._id
      }`
    );

    if (
      response.status === 200 &&
      response.data.message === "Plan deleted successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
      payload.closeModal();
    }
  }
);

export const addUsersToActionPlan = createAsyncThunk(
  "actionPlan/addUsersToActionPlan",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/plan/addUser/${
        thunkAPI.getState().actionPlan.selectedActionPlan._id
      }`,
      {
        users: payload.users.map((u) => u._id),
        copyTextAllowed: payload.copyTextAllowed,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Users added successfully"
    ) {
      payload.closeModal();
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

export const markActionPlan = createAsyncThunk(
  "actionPlan/markActionPlan",
  async (payload, thunkAPI) => {
    let response = await axios.patch(
      `${backendServerBaseURL}/api/v1/plan/mark/${payload.actionPlanId}`,
      {
        checked: payload.checked,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Plan updated successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

// Category
export const createcategory = createAsyncThunk(
  "actionPlan/createcategory",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/category/create`,
      {
        name: payload.name,
        plan: thunkAPI.getState().actionPlan.selectedActionPlan._id,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Category created successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
      // Note: DOM manipulation removed as it's no longer needed with shadcn/ui components
    }
  }
);

export const editcategory = createAsyncThunk(
  "actionPlan/editcategory",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/category/update/${
        thunkAPI.getState().actionPlan.selectedCategory._id
      }`,
      {
        name: payload.name,
        isOpened: null,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Category updated successfully"
    ) {
      payload.closeModal();
      thunkAPI.dispatch(getAllActionPlans());
    }
  }
);

export const updateIsOpenedForCategory = createAsyncThunk(
  "actionPlan/updateIsOpenedForCategory",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/category/update/${payload.categoryId}`,
      {
        name: payload.name,
        isOpened: payload.isOpened,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Category updated successfully"
    ) {
      payload.closeModal();
      thunkAPI.dispatch(getAllActionPlans());
    }
  }
);

export const deletecategory = createAsyncThunk(
  "actionPlan/deletecategory",
  async (payload, thunkAPI) => {
    let response = await axios.delete(
      `${backendServerBaseURL}/api/v1/category/delete/${
        thunkAPI.getState().actionPlan.selectedCategory._id
      }`
    );

    if (
      response.status === 200 &&
      response.data.message === "Category deleted successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
      // Note: DOM manipulation removed as it's no longer needed with shadcn/ui components
    }
  }
);

export const markCategory = createAsyncThunk(
  "actionPlan/markCategory",
  async (payload, thunkAPI) => {
    let response = await axios.patch(
      `${backendServerBaseURL}/api/v1/category/mark/${payload.categoryId}`,
      {
        checked: payload.checked,
      }
    );

    if (response.status === 200) {
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

// Pointer
export const readPointer = createAsyncThunk(
  "actionPlan/readPointer",
  async (payload, thunkAPI) => {
    let response = await axios.get(
      `${backendServerBaseURL}/api/v1/content/read/${payload.pointerId}`
    );

    if (
      response.status === 200 &&
      response.data.message === "Content fetched successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(updatesinglePointerInfo(response.data.content));
      payload.closeModal();
    }
  }
);

export const createpointer = createAsyncThunk(
  "actionPlan/createpointer",
  async (payload, thunkAPI) => {
    let response = await axios.post(
      `${backendServerBaseURL}/api/v1/content/create`,
      {
        name: payload.name,
        plan: thunkAPI.getState().actionPlan.selectedActionPlan._id,
        category: thunkAPI.getState().actionPlan.selectedCategory._id,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Content created successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
    }
  }
);

export const editpointer = createAsyncThunk(
  "actionPlan/editpointer",
  async (payload, thunkAPI) => {
    let response = await axios.put(
      `${backendServerBaseURL}/api/v1/content/update/${payload.pointerId}`,
      {
        name: payload.name,
        data: payload.data,
        isOpened: null,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Content updated successfully"
    ) {
      if (payload.navigate) {
        payload.navigate("/action-plans");
      }
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
    }
  }
);

export const updateIsOpenedForPointer = createAsyncThunk(
  "actionPlan/updateIsOpenedForPointer",
  async (payload, thunkAPI) => {
    let response = await axios.put(
      `${backendServerBaseURL}/api/v1/content/update/${payload.pointerId}`,
      {
        name: payload.name,
        data: payload.data,
        isOpened: payload.isOpened,
      }
    );

    console.log(response.data);
    console.log(payload);
    if (
      response.status === 200 &&
      response.data.message === "Content updated successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());

      payload.closeModal();
    }
  }
);

export const deletepointer = createAsyncThunk(
  "actionPlan/deletepointer",
  async (payload, thunkAPI) => {
    let response = await axios.delete(
      `${backendServerBaseURL}/api/v1/content/delete/${
        thunkAPI.getState().actionPlan.selectedPointer._id
      }`
    );

    if (
      response.status === 200 &&
      response.data.message === "Content deleted successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      payload.closeModal();
    }
  }
);

export const markPointer = createAsyncThunk(
  "actionPlan/markPointer",
  async (payload, thunkAPI) => {
    let response = await axios.patch(
      `${backendServerBaseURL}/api/v1/content/mark/${payload.contentId}`,
      {
        checked: payload.checked,
      }
    );

    if (
      response.status === 200 &&
      response.data.message === "Content updated successfully"
    ) {
      thunkAPI.dispatch(getAllActionPlans());
      thunkAPI.dispatch(getExternalActionPlans());
    }
  }
);

export const actionPlanSlice = createSlice({
  name: "actionPlan",
  initialState,
  reducers: {
    updateActionPlans: (state, action) => {
      state.actionPlans = action.payload;
    },
    updateSelectedActionPlan: (state, action) => {
      state.selectedActionPlan = action.payload;
    },
    updateselectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    updateselectedPointer: (state, action) => {
      state.selectedPointer = action.payload;
    },
    updatesinglePointerInfo: (state, action) => {
      state.singlePointerInfo = action.payload;
    },
    updateExternalActionPlans: (state, action) => {
      state.extActionPlans = action.payload;
    },
  },
});

export const {
  updateActionPlans,
  updateSelectedActionPlan,
  updateselectedCategory,
  updateselectedPointer,
  updatesinglePointerInfo,
  updateExternalActionPlans,
} = actionPlanSlice.actions;

export const selectActionPlans = (state) => state.actionPlan.actionPlans;
export const selectSelectedActionPlan = (state) =>
  state.actionPlan.selectedActionPlan;
export const selectselectedCategory = (state) =>
  state.actionPlan.selectedCategory;
export const selectselectedPointer = (state) =>
  state.actionPlan.selectedPointer;
export const selectsinglePointerInfo = (state) =>
  state.actionPlan.singlePointerInfo;
export const selectExternalActionPlans = (state) =>
  state.actionPlan.extActionPlans;

export default actionPlanSlice.reducer;
