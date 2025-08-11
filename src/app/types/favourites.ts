// Local imports
import { WindData } from "@/services/types";

export interface FavouriteLocation {
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  windData: WindData;
  addedAt: number;
}

export interface FavouritesContextType {
  favourites: FavouriteLocation[];
  addFavourite: (location: Omit<FavouriteLocation, "addedAt">) => void;
  removeFavourite: (cityName: string, country: string) => void;
  isFavourited: (cityName: string, country: string) => boolean;
  clearFavourites: () => void;
}
