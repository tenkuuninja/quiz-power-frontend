import axios, { AxiosError } from "axios";
import { API_URL } from "./app";

const axiosConfigs = {
  baseURL: API_URL ?? "",
  timeout: 5000000,
};

const instance = axios.create(axiosConfigs);

instance.interceptors.request.use(
  async (config) => {
    let authToken = localStorage.getItem("quiz-token");
    if (authToken) {
      authToken = authToken?.replaceAll('"', "");
    }
    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: AxiosError) => {
    const hideErrorMessage =
      error?.config?.headers?.hideErrorMessage === "true";

    const response: any = error?.response?.data;
    const status = error?.response?.status;

    const errorObject = {
      code: error?.code,
      message: error?.message,
      name: error?.name,
      response: response,
    };

    if (axios.isCancel(error)) {
      throw errorObject;
    }

    // if (status >= 400 && status < 500 && !hideErrorMessage) {
    //   if (Array.isArray(response?.message) && response?.message?.length > 0) {
    //     toast.error(response?.message?.['0'])
    //   } else if (!!response?.message) {
    //     toast.error(response?.message)
    //   }
    // }
    throw errorObject;
  }
);

export default instance;
