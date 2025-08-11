import { useLocalStorage } from "./useLocalStorage";
import { FavouriteLocation } from "@/app/types/favourites";

const FAVOURITES_STORAGE_KEY = "windyDaysFavourites";

export const useFavouritesStorage = () => {
  const { storedValue: favourites, setValue: setFavourites } = useLocalStorage<
    FavouriteLocation[]
  >({
    key: FAVOURITES_STORAGE_KEY,
    defaultValue: [],
  });

  const addFavourite = (location: Omit<FavouriteLocation, "addedAt">) => {
    const newFavourite: FavouriteLocation = {
      ...location,
      addedAt: Date.now(),
    };

    setFavourites((prev) => {
      // Check if location already exists
      const exists = prev.some(
        (fav) =>
          fav.cityName === location.cityName && fav.country === location.country
      );

      if (exists) {
        return prev; // Don't add if already exists
      }

      return [...prev, newFavourite];
    });
  };

  const removeFavourite = (cityName: string, country: string) => {
    setFavourites((prev) =>
      prev.filter(
        (fav) => !(fav.cityName === cityName && fav.country === country)
      )
    );
  };

  const isFavourited = (cityName: string, country: string): boolean => {
    return favourites.some(
      (fav) => fav.cityName === cityName && fav.country === country
    );
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  return {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourited,
    clearFavourites,
  };
};
