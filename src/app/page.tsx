"use client";

// React imports
import { useState } from "react";

// Local imports
import SearchBar from "@/app/components/SearchBar";
import WeatherDataCard from "@/app/components/WeatherDataCard";
import Loading from "@/app/components/Loading";
import Error from "@/app/components/Error";
import { FavouritesProvider } from "@/app/context/FavouritesContext";
import styles from "./page.module.css";
import { WindData } from "@/services/types";

export default function Home() {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSearchResult = (
    windData: WindData,
    cityName: string,
    country: string,
    latitude: number,
    longitude: number
  ) => {
    setWindData(windData);
    setCityName(cityName);
    setCountry(country);
    setLatitude(latitude);
    setLongitude(longitude);
    setErrorMessage(""); // Clear any previous errors
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setWindData(null); // Clear any previous data
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to WindyDays</h1>

        <p className={styles.subtitle}>
          Discover wind conditions around the world. Search for any location to
          see real-time wind data.
        </p>

        <div className={styles.searchSection}>
          <SearchBar
            onSearch={handleSearchResult}
            onLoadingChange={handleLoadingChange}
            onError={handleError}
          />

          {isLoading && (
            <div className={styles.loadingContainer}>
              <Loading size="large" />
            </div>
          )}

          {errorMessage && !isLoading && <Error message={errorMessage} />}

          {windData && !isLoading && !errorMessage && (
            <FavouritesProvider>
              <WeatherDataCard
                windData={windData}
                cityName={cityName}
                country={country}
                latitude={latitude}
                longitude={longitude}
              />
            </FavouritesProvider>
          )}
        </div>
      </main>
    </div>
  );
}
