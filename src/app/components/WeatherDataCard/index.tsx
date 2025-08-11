// React imports
import React from "react";

// Local imports
import { WindData } from "@/services/types";
import {
  formatWindDirection,
  getBeaufortScale,
} from "@/app/utils/weather-helper";
import FavouritesButton from "@/app/components/FavouritesButton";
import styles from "./index.module.css";

interface WeatherDataCardProps {
  windData: WindData;
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
}

const WeatherDataCard: React.FC<WeatherDataCardProps> = ({
  windData,
  cityName,
  country,
  latitude,
  longitude,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Wind Information</h3>
          <h4 className={styles.locationTitle}>
            {cityName}, {country}
          </h4>
        </div>
        <FavouritesButton
          cityName={cityName}
          country={country}
          latitude={latitude}
          longitude={longitude}
          windData={windData}
          size="large"
        />
      </div>

      <div className={styles.dataGrid}>
        <div className={styles.dataItem}>
          <span className={styles.label}>Direction:</span>
          <span className={styles.value}>
            {formatWindDirection(windData.windDirection)}° (
            {windData.windDirection})
          </span>
        </div>

        <div className={styles.dataItem}>
          <span className={styles.label}>Speed:</span>
          <span className={styles.value}>
            {windData.windSpeed} m/s
            <div className={styles.beaufortInfo}>
              Force {getBeaufortScale(windData.windSpeed).force} -{" "}
              {getBeaufortScale(windData.windSpeed).description}
            </div>
          </span>
        </div>

        <div className={styles.dataItem}>
          <span className={styles.label}>Time:</span>
          <span className={styles.value}>
            {new Date(windData.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDataCard;
