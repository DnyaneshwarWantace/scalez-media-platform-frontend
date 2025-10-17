import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";

// Async thunks for API calls
export const getAllNorthStarMetrics = createAsyncThunk(
  "northStarMetrics/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${backendServerBaseURL}/api/v1/north-star-metrics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching North Star Metrics:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch North Star Metrics");
    }
  }
);

export const getActiveNorthStarMetrics = createAsyncThunk(
  "northStarMetrics/getActive",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${backendServerBaseURL}/api/v1/north-star-metrics/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active North Star Metrics:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch active North Star Metrics");
    }
  }
);

export const getNorthStarMetricById = createAsyncThunk(
  "northStarMetrics/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${backendServerBaseURL}/api/v1/north-star-metrics/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching North Star Metric:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch North Star Metric");
    }
  }
);

export const createNorthStarMetric = createAsyncThunk(
  "northStarMetrics/create",
  async (metricData, thunkAPI) => {
    try {
      const response = await axios.post(`${backendServerBaseURL}/api/v1/north-star-metrics`, metricData);
      return response.data;
    } catch (error) {
      console.error("Error creating North Star Metric:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create North Star Metric");
    }
  }
);

export const updateNorthStarMetric = createAsyncThunk(
  "northStarMetrics/update",
  async ({ id, metricData }, thunkAPI) => {
    try {
      const response = await axios.put(`${backendServerBaseURL}/api/v1/north-star-metrics/${id}`, metricData);
      return response.data;
    } catch (error) {
      console.error("Error updating North Star Metric:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update North Star Metric");
    }
  }
);

export const updateNorthStarMetricValue = createAsyncThunk(
  "northStarMetrics/updateValue",
  async ({ id, valueData }, thunkAPI) => {
    try {
      const response = await axios.patch(`${backendServerBaseURL}/api/v1/north-star-metrics/${id}/value`, valueData);
      return response.data;
    } catch (error) {
      console.error("Error updating North Star Metric value:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update North Star Metric value");
    }
  }
);

export const deleteNorthStarMetric = createAsyncThunk(
  "northStarMetrics/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${backendServerBaseURL}/api/v1/north-star-metrics/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting North Star Metric:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete North Star Metric");
    }
  }
);

// Initial state
const initialState = {
  metrics: [],
  activeMetrics: [],
  selectedMetric: null,
  loading: false,
  error: null,
  success: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// Slice
const northStarMetricSlice = createSlice({
  name: "northStarMetrics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
    },
    clearSelectedMetric: (state) => {
      state.selectedMetric = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all metrics
      .addCase(getAllNorthStarMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNorthStarMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.data || [];
        state.error = null;
      })
      .addCase(getAllNorthStarMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get active metrics
      .addCase(getActiveNorthStarMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveNorthStarMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMetrics = action.payload.data || [];
        state.error = null;
      })
      .addCase(getActiveNorthStarMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get metric by ID
      .addCase(getNorthStarMetricById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNorthStarMetricById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMetric = action.payload.data;
        state.error = null;
      })
      .addCase(getNorthStarMetricById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create metric
      .addCase(createNorthStarMetric.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createNorthStarMetric.fulfilled, (state, action) => {
        state.createLoading = false;
        state.metrics.unshift(action.payload.data);
        state.activeMetrics.unshift(action.payload.data);
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(createNorthStarMetric.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      
      // Update metric
      .addCase(updateNorthStarMetric.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateNorthStarMetric.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedMetric = action.payload.data;
        state.metrics = state.metrics.map(metric => 
          metric._id === updatedMetric._id ? updatedMetric : metric
        );
        state.activeMetrics = state.activeMetrics.map(metric => 
          metric._id === updatedMetric._id ? updatedMetric : metric
        );
        if (state.selectedMetric && state.selectedMetric._id === updatedMetric._id) {
          state.selectedMetric = updatedMetric;
        }
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(updateNorthStarMetric.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Update metric value
      .addCase(updateNorthStarMetricValue.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateNorthStarMetricValue.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedMetric = action.payload.data;
        state.metrics = state.metrics.map(metric => 
          metric._id === updatedMetric._id ? updatedMetric : metric
        );
        state.activeMetrics = state.activeMetrics.map(metric => 
          metric._id === updatedMetric._id ? updatedMetric : metric
        );
        if (state.selectedMetric && state.selectedMetric._id === updatedMetric._id) {
          state.selectedMetric = updatedMetric;
        }
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(updateNorthStarMetricValue.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete metric
      .addCase(deleteNorthStarMetric.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteNorthStarMetric.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload;
        state.metrics = state.metrics.filter(metric => metric._id !== deletedId);
        state.activeMetrics = state.activeMetrics.filter(metric => metric._id !== deletedId);
        if (state.selectedMetric && state.selectedMetric._id === deletedId) {
          state.selectedMetric = null;
        }
        state.success = "North Star Metric deleted successfully";
        state.error = null;
      })
      .addCase(deleteNorthStarMetric.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setSelectedMetric, clearSelectedMetric } = northStarMetricSlice.actions;
export default northStarMetricSlice.reducer;
