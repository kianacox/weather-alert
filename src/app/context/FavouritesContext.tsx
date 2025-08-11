"use client";

// React imports
import React, { createContext, ReactNode } from "react";

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

  const value: FavouritesContextType = {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourited,
    clearFavourites,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};
