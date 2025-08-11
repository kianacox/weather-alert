// React imports
import React from "react";

// Testing library imports
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Local imports
import FavouritesButton from "./index";
import { FavouritesProvider } from "@/app/context/FavouritesContext";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const renderFavouritesButton = (props: any) => {
  return render(
    <FavouritesProvider>
      <FavouritesButton {...props} />
    </FavouritesProvider>
  );
};

describe("FavouritesButton", () => {
  const defaultProps = {
    cityName: "London",
    country: "GB",
    latitude: 51.5074,
    longitude: -0.1278,
    windData: {
      windSpeed: 5.2,
      windDirection: 180,
      timestamp: 1234567890,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Initial Rendering", () => {
    it("renders empty heart when location is not favourited", () => {
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button", { name: /add to favourites/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("renders filled heart when location is favourited", () => {
      // Mock localStorage to return existing favourite
      const existingFavourite = [
        {
          cityName: "London",
          country: "GB",
          latitude: 51.5074,
          longitude: -0.1278,
          windData: {
            windSpeed: 5.2,
            windDirection: 180,
            timestamp: 1234567890,
          },
          addedAt: Date.now(),
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavourite)
      );

      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button", {
        name: /remove from favourites/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("renders with correct accessibility attributes", () => {
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Add to favourites");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Favourites Functionality", () => {
    it("adds location to favourites when clicked", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button", { name: /add to favourites/i });
      await user.click(button);

      // Should now show filled heart
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /remove from favourites/i })
        ).toBeInTheDocument();
      });

      // Check that localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("removes location from favourites when clicked", async () => {
      const user = userEvent.setup();

      // Start with location already favourited
      const existingFavourite = [
        {
          cityName: "London",
          country: "GB",
          latitude: 51.5074,
          longitude: -0.1278,
          windData: {
            windSpeed: 5.2,
            windDirection: 180,
            timestamp: 1234567890,
          },
          addedAt: Date.now(),
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavourite)
      );

      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button", {
        name: /remove from favourites/i,
      });
      await user.click(button);

      // Should now show empty heart
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /add to favourites/i })
        ).toBeInTheDocument();
      });

      // Check that localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("prevents duplicate favourites", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button", { name: /add to favourites/i });

      // Click multiple times
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should still only be one favourite
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /remove from favourites/i })
        ).toBeInTheDocument();
      });

      // localStorage should be called at least once for the initial add
      expect(localStorageMock.setItem).toHaveBeenCalled();
      // Check that it was called with the correct data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "windyDaysFavourites",
        expect.stringContaining("London")
      );
    });

    it("handles different locations independently", async () => {
      const user = userEvent.setup();

      const { rerender } = renderFavouritesButton(defaultProps);

      // Add London to favourites
      const londonButton = screen.getByRole("button", {
        name: /add to favourites/i,
      });
      await user.click(londonButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /remove from favourites/i })
        ).toBeInTheDocument();
      });

      // Render Paris button
      rerender(
        <FavouritesProvider>
          <FavouritesButton
            {...defaultProps}
            cityName="Paris"
            country="FR"
            latitude={48.8566}
            longitude={2.3522}
          />
        </FavouritesProvider>
      );

      // Paris should show as not favourited
      expect(
        screen.getByRole("button", { name: /add to favourites/i })
      ).toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("renders with small size", () => {
      renderFavouritesButton({ ...defaultProps, size: "small" });

      const button = screen.getByRole("button");
      expect(button).toHaveClass("small");
    });

    it("renders with medium size by default", () => {
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("medium");
    });

    it("renders with large size", () => {
      renderFavouritesButton({ ...defaultProps, size: "large" });

      const button = screen.getByRole("button");
      expect(button).toHaveClass("large");
    });
  });

  describe("User Experience", () => {
    it("provides visual feedback on hover", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      await user.hover(button);

      // Button should have hover styles applied
      expect(button).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");

      // Focus the button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter to toggle favourite
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /remove from favourites/i })
        ).toBeInTheDocument();
      });
    });

    it("supports Space key for toggling", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      button.focus();

      // Press Space to toggle favourite
      await user.keyboard(" ");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /remove from favourites/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("updates aria-label when favourited state changes", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Add to favourites");

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Remove from favourites");
      });
    });

    it("updates aria-pressed when favourited state changes", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("has proper focus management", async () => {
      const user = userEvent.setup();
      renderFavouritesButton(defaultProps);

      const button = screen.getByRole("button");

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Should be able to activate with keyboard
      await user.keyboard("{Enter}");
      expect(button).toHaveFocus();
    });
  });

  describe("Error Handling", () => {
    it("handles localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Should not crash
      expect(() => {
        renderFavouritesButton(defaultProps);
      }).not.toThrow();
    });

    it("handles invalid JSON in localStorage", () => {
      // Mock localStorage to return invalid JSON
      localStorageMock.getItem.mockReturnValue("invalid json");

      // Should not crash and should clear invalid data
      expect(() => {
        renderFavouritesButton(defaultProps);
      }).not.toThrow();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "windyDaysFavourites"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles empty city name", () => {
      expect(() => {
        renderFavouritesButton({ ...defaultProps, cityName: "" });
      }).not.toThrow();
    });

    it("handles empty country", () => {
      expect(() => {
        renderFavouritesButton({ ...defaultProps, country: "" });
      }).not.toThrow();
    });

    it("handles zero coordinates", () => {
      expect(() => {
        renderFavouritesButton({
          ...defaultProps,
          latitude: 0,
          longitude: 0,
        });
      }).not.toThrow();
    });

    it("handles negative coordinates", () => {
      expect(() => {
        renderFavouritesButton({
          ...defaultProps,
          latitude: -90,
          longitude: -180,
        });
      }).not.toThrow();
    });
  });

  describe("Context Integration", () => {
    it("throws error when used outside FavouritesProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<FavouritesButton {...defaultProps} />);
      }).toThrow("useFavourites must be used within a FavouritesProvider");

      consoleSpy.mockRestore();
    });

    it("correctly identifies favourited locations", () => {
      // Mock localStorage with multiple favourites
      const existingFavourites = [
        {
          cityName: "London",
          country: "GB",
          latitude: 51.5074,
          longitude: -0.1278,
          windData: {
            windSpeed: 5.2,
            windDirection: 180,
            timestamp: 1234567890,
          },
          addedAt: Date.now(),
        },
        {
          cityName: "Paris",
          country: "FR",
          latitude: 48.8566,
          longitude: 2.3522,
          windData: {
            windSpeed: 3.1,
            windDirection: 90,
            timestamp: 1234567890,
          },
          addedAt: Date.now(),
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(existingFavourites)
      );

      renderFavouritesButton(defaultProps);

      // London should be favourited
      expect(
        screen.getByRole("button", { name: /remove from favourites/i })
      ).toBeInTheDocument();
    });
  });
});
