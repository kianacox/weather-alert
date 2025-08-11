"use client";

// React imports
import React, { createContext, ReactNode, useMemo } from "react";

// Local imports
import { FavouritesContextType } from "@/app/types/favourites";
import { useFavouritesStorage } from "@/hooks";

export const FavouritesContext = createContext<
  FavouritesContextType | undefined
>(undefined);

interface FavouritesProviderProps {
  children: ReactNode;
}

export const FavouritesProvider: React.FC<FavouritesProviderProps> = ({
  children,
}) => {
  const {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourited,
    clearFavourites,
  } = useFavouritesStorage();

  // Memoize the context value to prevent unnecessary re-renders
  const value: FavouritesContextType = useMemo(
    () => ({
      favourites,
      addFavourite,
      removeFavourite,
      isFavourited,
      clearFavourites,
    }),
    [favourites, addFavourite, removeFavourite, isFavourited, clearFavourites]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};
