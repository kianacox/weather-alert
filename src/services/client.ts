import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "./consts";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Generic GET request function
 * @param endpoint - The API endpoint to call
 * @param params - Query parameters for the request
 * @returns Promise<T> - The response data
 * @throws Error - If the API request fails
 */
export const apiGet = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API request failed: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("No response received from the API");
      } else {
        throw new Error(`Request setup failed: ${error.message}`);
      }
    } else {
      throw new Error(
        `Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
};
