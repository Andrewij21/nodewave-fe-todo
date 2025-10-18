import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("session_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      if (status === 401) {
        Cookies.remove("session_token");

        const message =
          errorData?.message || "Unauthorized: Your session has expired.";
        return Promise.reject(new Error(message));
      }

      const message = errorData?.message || "An API error occurred.";
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: function <T>(endpoint: string): Promise<T> {
    return axiosInstance.get(endpoint);
  },

  post: function <T>(endpoint: string, body: any): Promise<T> {
    // Axios otomatis melakukan JSON.stringify(body)
    return axiosInstance.post(endpoint, body);
  },

  patch: function <T>(endpoint: string, body: any): Promise<T> {
    return axiosInstance.patch(endpoint, body);
  },

  put: function <T>(endpoint: string, body: any): Promise<T> {
    return axiosInstance.put(endpoint, body);
  },

  delete: function <T>(endpoint: string): Promise<T> {
    return axiosInstance.delete(endpoint);
  },
};
