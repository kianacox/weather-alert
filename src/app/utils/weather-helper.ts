/**
 * Formats wind direction in degrees to cardinal direction
 * @param direction - Wind direction in degrees (0-360)
 * @returns Cardinal direction string (N, NNE, NE, etc.)
 */
export const formatWindDirection = (direction: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  // Normalize direction to 0-360 range
  const normalizedDirection = ((direction % 360) + 360) % 360;
  const index = Math.round(normalizedDirection / 22.5) % 16;
  return directions[index];
};

/**
 * Gets Beaufort scale information based on wind speed
 * @param speed - Wind speed in m/s
 * @returns Object containing force number and description
 */
export const getBeaufortScale = (
  speed: number
): { force: number; description: string } => {
  if (speed < 0.3) return { force: 0, description: "Calm" };
  if (speed < 1.6) return { force: 1, description: "Light Air" };
  if (speed < 3.4) return { force: 2, description: "Light Breeze" };
  if (speed < 5.5) return { force: 3, description: "Gentle Breeze" };
  if (speed < 8.0) return { force: 4, description: "Moderate Breeze" };
  if (speed < 10.8) return { force: 5, description: "Fresh Breeze" };
  if (speed < 13.9) return { force: 6, description: "Strong Breeze" };
  if (speed < 17.2) return { force: 7, description: "Near Gale" };
  if (speed < 20.8) return { force: 8, description: "Gale" };
  if (speed < 24.5) return { force: 9, description: "Strong Gale" };
  if (speed < 28.5) return { force: 10, description: "Storm" };
  if (speed < 32.7) return { force: 11, description: "Violent Storm" };
  return { force: 12, description: "Hurricane" };
};
