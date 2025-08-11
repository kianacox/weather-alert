import { useState, useEffect } from "react";

interface UseLocalStorageOptions {
  defaultValue?: any;
  key: string;
}

export const useLocalStorage = <T>({
  key,
  defaultValue,
}: UseLocalStorageOptions) => {
  // Get initial value from localStorage or use default
  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Failed to access localStorage for key "${key}":`, error);
      // Clean up invalid data if it exists
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error(
          `Failed to remove invalid localStorage item "${key}":`,
          removeError
        );
      }
    }
    return defaultValue;
  };

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Function to set value in localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Failed to save to localStorage for key "${key}":`, error);
      // Continue with state update even if localStorage fails
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    }
  };

  // Function to remove value from localStorage
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error(
        `Failed to remove from localStorage for key "${key}":`,
        error
      );
      // Continue with state update even if localStorage fails
      setStoredValue(defaultValue);
    }
  };

  // Function to clear all localStorage
  const clearAll = () => {
    try {
      localStorage.clear();
      setStoredValue(defaultValue);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      // Continue with state update even if localStorage fails
      setStoredValue(defaultValue);
    }
  };

  return {
    storedValue,
    setValue,
    removeValue,
    clearAll,
  };
};
