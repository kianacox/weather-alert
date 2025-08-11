"use client";

import { useRouter } from "next/navigation";
import { useFavourites } from "@/hooks";
import WeatherDataCard from "@/app/components/WeatherDataCard";
import { FavouritesProvider } from "@/app/context/FavouritesContext";
import styles from "./page.module.css";

const FavouritesContent = () => {
  const { favourites } = useFavourites();
  const router = useRouter();

  if (favourites.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h1>No Favourites Yet</h1>
          <p>You haven't added any locations to your favourites yet.</p>
          <button
            onClick={() => router.push("/")}
            className={styles.addLocationButton}
          >
            Add Your First Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Favourite Locations</h1>
      <div className={styles.favouritesGrid}>
        {favourites.map((favourite) => (
          <div
            key={`${favourite.cityName}-${favourite.country}`}
            className={styles.favouriteItem}
          >
            <WeatherDataCard
              windData={favourite.windData}
              cityName={favourite.cityName}
              country={favourite.country}
              latitude={favourite.latitude}
              longitude={favourite.longitude}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const FavouritesPage = () => {
  return (
    <FavouritesProvider>
      <FavouritesContent />
    </FavouritesProvider>
  );
};

export default FavouritesPage;
