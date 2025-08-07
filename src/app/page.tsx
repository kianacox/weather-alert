"use client";

// React imports
import { useState } from "react";

// Local imports
import SearchBar from "@/app/components/SearchBar";
import styles from "./page.module.css";
import { WindData } from "@/services/types";

export default function Home() {
  const [windData, setWindData] = useState<WindData | null>(null);

  const handleSearchResult = (windData: WindData) => {
    setWindData(windData);
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
            <div className={styles.results}>
              <p className={styles.resultText}>
                Wind direction: {windData.windDirection}
              </p>
              <p className={styles.resultText}>
                Wind speed: {windData.windSpeed}
              </p>
              <p className={styles.resultText}>
                Timestamp: {new Date(windData.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
