import { useContext } from "react";
import { FavouritesContext } from "@/app/context/FavouritesContext";
import { FavouritesContextType } from "@/app/types/favourites";

export const useFavourites = (): FavouritesContextType => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};
