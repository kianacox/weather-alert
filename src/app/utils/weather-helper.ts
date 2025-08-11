/**
 * Memoization cache for formatWindDirection function
 */
const directionCache = new Map<number, string>();

/**
 * Formats wind direction in degrees to cardinal direction
 * @param direction - Wind direction in degrees (0-360)
 * @returns Cardinal direction string (N, NNE, NE, etc.)
 */
export const formatWindDirection = (direction: number): string => {
  // Check cache first
  if (directionCache.has(direction)) {
    return directionCache.get(direction)!;
  }

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
  const result = directions[index];

  // Cache the result
  directionCache.set(direction, result);

  return result;
};

/**
 * Memoization cache for getBeaufortScale function
 */
const beaufortCache = new Map<number, { force: number; description: string }>();

/**
 * Gets Beaufort scale information based on wind speed
 * @param speed - Wind speed in m/s
 * @returns Object containing force number and description
 */
export const getBeaufortScale = (
  speed: number
): { force: number; description: string } => {
  // Check cache first
  if (beaufortCache.has(speed)) {
    return beaufortCache.get(speed)!;
  }

  let result: { force: number; description: string };

  if (speed < 0.3) result = { force: 0, description: "Calm" };
  else if (speed < 1.6) result = { force: 1, description: "Light Air" };
  else if (speed < 3.4) result = { force: 2, description: "Light Breeze" };
  else if (speed < 5.5) result = { force: 3, description: "Gentle Breeze" };
  else if (speed < 8.0) result = { force: 4, description: "Moderate Breeze" };
  else if (speed < 10.8) result = { force: 5, description: "Fresh Breeze" };
  else if (speed < 13.9) result = { force: 6, description: "Strong Breeze" };
  else if (speed < 17.2) result = { force: 7, description: "Near Gale" };
  else if (speed < 20.8) result = { force: 8, description: "Gale" };
  else if (speed < 24.5) result = { force: 9, description: "Strong Gale" };
  else if (speed < 28.5) result = { force: 10, description: "Storm" };
  else if (speed < 32.7) result = { force: 11, description: "Violent Storm" };
  else result = { force: 12, description: "Hurricane" };

  // Cache the result
  beaufortCache.set(speed, result);

  return result;
};
