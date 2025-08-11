"use client";

// React imports
import React, { memo } from "react";

// Third-party imports
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Local imports
import { useFavourites } from "@/hooks";
import { WindData } from "@/services/types";
import styles from "./index.module.css";

interface FavouritesButtonProps {
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  windData: WindData;
  size?: "small" | "medium" | "large";
  className?: string;
}

const FavouritesButton: React.FC<FavouritesButtonProps> = memo(
  ({
    cityName,
    country,
    latitude,
    longitude,
    windData,
    size = "medium",
    className,
  }) => {
    const { addFavourite, removeFavourite, isFavourited } = useFavourites();

    const favourited = isFavourited(cityName, country);

    const handleToggleFavourite = () => {
      if (favourited) {
        removeFavourite(cityName, country);
      } else {
        addFavourite({
          cityName,
          country,
          latitude,
          longitude,
          windData,
        });
      }
    };

    return (
      <button
        type="button"
        onClick={handleToggleFavourite}
        className={`${styles.favouritesButton} ${styles[size]} ${
          className || ""
        }`}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={favourited}
      >
        {favourited ? (
          <FaHeart className={styles.filledHeart} />
        ) : (
          <FaRegHeart className={styles.emptyHeart} />
        )}
      </button>
    );
  }
);

FavouritesButton.displayName = "FavouritesButton";

export default FavouritesButton;
