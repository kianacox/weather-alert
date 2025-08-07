"use client";

// React imports
import { useState } from "react";

// Local imports
import SearchBar from "@/app/components/SearchBar";
import WeatherDataCard from "@/app/components/WeatherDataCard";
import styles from "./page.module.css";
import { WindData } from "@/services/types";

export default function Home() {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const handleSearchResult = (
    windData: WindData,
    cityName: string,
    country: string
  ) => {
    setWindData(windData);
    setCityName(cityName);
    setCountry(country);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>WindyDays</h1>

        <p className={styles.subtitle}>
          Discover wind conditions around the world. Search for any location to
          see real-time wind data.
        </p>

        <div className={styles.searchSection}>
          <SearchBar onSearch={handleSearchResult} />

          {windData && (
            <WeatherDataCard
              windData={windData}
              cityName={cityName}
              country={country}
            />
          )}
        </div>
      </main>
    </div>
  );
}
