// React imports
import React, { useState, useEffect } from "react";

// Third-party library imports
import { useCombobox } from "downshift";
import { FaSearch } from "react-icons/fa";

// Local imports
import { getWindData } from "@/services/wind-service";
import styles from "./index.module.css";
import { WindData } from "@/services/types";
import Loading from "@/app/components/Loading";

interface City {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (windData: WindData, cityName: string, country: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLoadingChange }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch("/cities.json");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    };
    loadCities();
  }, []);

  // Filter cities based on input
  const getFilteredCities = (inputValue: string) => {
    if (!inputValue || inputValue.length < 3) {
      return [];
    }

    const filtered = cities.filter((city) => {
      const cityCountry = `${city.city}, ${city.country}`.toLowerCase();
      return cityCountry.includes(inputValue.toLowerCase());
    });

    return filtered.slice(0, 10); // Limit to 10 results for performance
  };

  const handleSearch = async () => {
    if (!selectedItem) return;

    setIsLoading(true);
    onLoadingChange?.(true);
    try {
      const windData = await getWindData({
        latitude: selectedItem.lat,
        longitude: selectedItem.lon,
      });

      console.log("windData", windData);
      onSearch(windData, selectedItem.city, selectedItem.country);
    } catch (error) {
      console.error("Failed to fetch wind data:", error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    inputValue,
    setInputValue,
  } = useCombobox({
    items: filteredCities,
    onInputValueChange: ({ inputValue }) => {
      // Only allow letters and spaces
      const sanitizedInput = inputValue?.replace(/[^a-zA-Z\s]/g, "") || "";
      setInputValue(sanitizedInput);

      const filtered = getFilteredCities(sanitizedInput);
      setFilteredCities(filtered);
    },

    itemToString: (item) => (item ? `${item.city}, ${item.country}` : ""),
  });

  return (
    <div className={styles.searchBar}>
      <label {...getLabelProps()}>Search for a city</label>
      <div className={styles.inputContainer}>
        <input
          {...getInputProps({
            onKeyDown: (event) => {
              if (event.key === "Enter" && selectedItem) {
                event.preventDefault();
                handleSearch();
              }
            },
          })}
          placeholder="Type at least 3 characters to search..."
          className={styles.searchInput}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={!selectedItem || isLoading}
          className={styles.searchButton}
          aria-label="Search for wind data"
        >
          <FaSearch />
        </button>
      </div>
      <ul {...getMenuProps()} className={styles.dropdownMenu}>
        {isOpen && (
          <>
            {filteredCities.length > 0
              ? filteredCities.map((item, index) => (
                  <li
                    key={`${item.city}-${item.country}`}
                    {...getItemProps({ item, index })}
                    className={`${styles.dropdownItem} ${
                      highlightedIndex === index ? styles.highlighted : ""
                    } ${selectedItem === item ? styles.selected : ""}`}
                  >
                    {item.city}, {item.country}
                  </li>
                ))
              : inputValue &&
                inputValue.length >= 3 && (
                  <li className={styles.noResults}>No results found</li>
                )}
          </>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
