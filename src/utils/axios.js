import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const tempConfig = config;

    if (Object.keys(tempConfig.headers).includes("Authorization") === false) {
      const token = localStorage.getItem("accessToken", "");
      tempConfig.headers.Authorization = `Bearer ${token}`;
    }

    return tempConfig;
  },
  (error) => {
    console.error("✉️ ", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.log("Error in Axios");
    console.log(error.toJSON());
    console.log(error.response);

    if (error.toJSON().message === "Network Error") {
      console.log("no internet connection");
    }

    if (error.toJSON().status === 500) {
      window.open("/500", "_self");
    }

    if (error.toJSON().status === 404 && error.response.data.message === "Admin removed the user") {
      localStorage.clear();
      window.open("/", "_self");
    }

    if (error.toJSON().status === 401 && error.response.data.message === "jwt expired") {
      localStorage.clear();
      window.open("/", "_self");
    }

    return Promise.reject(error.response && error.response.data);
  }
);

export default axiosInstance;
