import { WindData, WindDataParams } from "./types";
import { API_ENDPOINT } from "./consts";
import { apiGet } from "./client";

/**
 * Validates latitude and longitude parameters
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @throws Error - If parameters are invalid
 */
const validateCoordinates = (latitude: number, longitude: number): void => {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new Error("Latitude and longitude must be numbers");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }
};

/**
 * Fetches wind data for a specific location
 * @param params - Object containing latitude and longitude
 * @returns Promise<WindData> - The wind data response
 * @throws Error - If the API request fails or parameters are invalid
 */
export const getWindData = async (
  params: WindDataParams
): Promise<WindData> => {
  const { latitude, longitude } = params;

  validateCoordinates(latitude, longitude);

  return apiGet<WindData>(API_ENDPOINT, { latitude, longitude });
};
