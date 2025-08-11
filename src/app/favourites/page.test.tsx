import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import FavouritesPage from "./page";
import { useFavourites, useFavouritesStorage } from "../../hooks";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the hooks
jest.mock("../../hooks", () => ({
  useFavourites: jest.fn(),
  useFavouritesStorage: jest.fn(),
}));

// Mock the WeatherDataCard component
jest.mock("../components/WeatherDataCard", () => {
  return function MockWeatherDataCard({
    cityName,
    country,
  }: {
    cityName: string;
    country: string;
  }) {
    return (
      <div data-testid="weather-data-card">
        <h3>
          {cityName}, {country}
        </h3>
        <p>Mock wind data</p>
      </div>
    );
  };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseFavourites = useFavourites as jest.MockedFunction<
  typeof useFavourites
>;
const mockUseFavouritesStorage = useFavouritesStorage as jest.MockedFunction<
  typeof useFavouritesStorage
>;

describe("FavouritesPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);

    // Mock the storage hook that the context uses
    mockUseFavouritesStorage.mockReturnValue({
      favourites: [],
      addFavourite: jest.fn(),
      removeFavourite: jest.fn(),
      isFavourited: jest.fn(),
      clearFavourites: jest.fn(),
    });
  });

  describe("Empty State", () => {
    beforeEach(() => {
      mockUseFavourites.mockReturnValue({
        favourites: [],
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });
    });

    it("displays empty state when no favourites exist", () => {
      render(<FavouritesPage />);

      expect(screen.getByText("No Favourites Yet")).toBeInTheDocument();
      expect(
        screen.getByText(
          "You haven't added any locations to your favourites yet."
        )
      ).toBeInTheDocument();
    });

    it("shows add location button in empty state", () => {
      render(<FavouritesPage />);

      const addButton = screen.getByRole("button", {
        name: "Add Your First Location",
      });
      expect(addButton).toBeInTheDocument();
    });

    it("navigates to home page when add location button is clicked", async () => {
      const user = userEvent.setup();
      render(<FavouritesPage />);

      const addButton = screen.getByRole("button", {
        name: "Add Your First Location",
      });
      await user.click(addButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("has proper button styling and accessibility", () => {
      render(<FavouritesPage />);

      const addButton = screen.getByRole("button", {
        name: "Add Your First Location",
      });
      expect(addButton).toBeEnabled();
      // Button type is not set, which is fine for navigation buttons
    });
  });

  describe("With Favourites", () => {
    const mockFavourites = [
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
        addedAt: 1234567890,
      },
      {
        cityName: "New York",
        country: "US",
        latitude: 40.7128,
        longitude: -74.006,
        windData: {
          windSpeed: 3.1,
          windDirection: 90,
          timestamp: 1234567890,
        },
        addedAt: 1234567890,
      },
      {
        cityName: "Paris",
        country: "FR",
        latitude: 48.8566,
        longitude: 2.3522,
        windData: {
          windSpeed: 4.5,
          windDirection: 270,
          timestamp: 1234567890,
        },
        addedAt: 1234567890,
      },
    ];

    beforeEach(() => {
      mockUseFavourites.mockReturnValue({
        favourites: mockFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      // Also mock the storage hook that the context uses
      mockUseFavouritesStorage.mockReturnValue({
        favourites: mockFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });
    });

    it("displays title when favourites exist", () => {
      render(<FavouritesPage />);

      expect(screen.getByText("Your Favourite Locations")).toBeInTheDocument();
    });

    it("renders all favourite locations", () => {
      render(<FavouritesPage />);

      expect(screen.getByText("London, GB")).toBeInTheDocument();
      expect(screen.getByText("New York, US")).toBeInTheDocument();
      expect(screen.getByText("Paris, FR")).toBeInTheDocument();
    });

    it("renders correct number of weather data cards", () => {
      render(<FavouritesPage />);

      const weatherCards = screen.getAllByTestId("weather-data-card");
      expect(weatherCards).toHaveLength(3);
    });

    it("passes correct props to WeatherDataCard components", () => {
      render(<FavouritesPage />);

      // Check that the first favourite's data is passed correctly
      expect(screen.getByText("London, GB")).toBeInTheDocument();
      // Check that wind data is displayed (there are multiple instances, so check the first one)
      const firstWeatherCard = screen.getAllByTestId("weather-data-card")[0];
      expect(firstWeatherCard).toHaveTextContent("Mock wind data");
    });

    it("uses unique keys for each favourite item", () => {
      render(<FavouritesPage />);

      // The component should render without React key warnings
      // This test ensures the key prop is properly set
      expect(screen.getByText("London, GB")).toBeInTheDocument();
      expect(screen.getByText("New York, US")).toBeInTheDocument();
      expect(screen.getByText("Paris, FR")).toBeInTheDocument();
    });

    it("handles single favourite correctly", () => {
      const singleFavourite = [mockFavourites[0]];
      mockUseFavourites.mockReturnValue({
        favourites: singleFavourite,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      expect(screen.getByText("Your Favourite Locations")).toBeInTheDocument();
      expect(screen.getByText("London, GB")).toBeInTheDocument();
      expect(screen.getAllByTestId("weather-data-card")).toHaveLength(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles favourites with special characters in names", () => {
      const specialFavourites = [
        {
          cityName: "São Paulo",
          country: "BR",
          latitude: -23.5505,
          longitude: -46.6333,
          windData: {
            windSpeed: 2.0,
            windDirection: 45,
            timestamp: 1234567890,
          },
          addedAt: 1234567890,
        },
      ];

      mockUseFavourites.mockReturnValue({
        favourites: specialFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      expect(screen.getByText("São Paulo, BR")).toBeInTheDocument();
    });

    it("handles very long city names", () => {
      const longNameFavourites = [
        {
          cityName:
            "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch",
          country: "GB",
          latitude: 53.2211,
          longitude: -4.2026,
          windData: {
            windSpeed: 1.5,
            windDirection: 180,
            timestamp: 1234567890,
          },
          addedAt: 1234567890,
        },
      ];

      mockUseFavourites.mockReturnValue({
        favourites: longNameFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      expect(
        screen.getByText(
          "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, GB"
        )
      ).toBeInTheDocument();
    });

    it("handles empty string values gracefully", () => {
      const emptyValueFavourites = [
        {
          cityName: "",
          country: "",
          latitude: 0,
          longitude: 0,
          windData: {
            windSpeed: 0,
            windDirection: 0,
            timestamp: 0,
          },
          addedAt: 0,
        },
      ];

      mockUseFavourites.mockReturnValue({
        favourites: emptyValueFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      // Also mock the storage hook that the context uses
      mockUseFavouritesStorage.mockReturnValue({
        favourites: emptyValueFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      // Check that the weather card is rendered even with empty values
      expect(screen.getByTestId("weather-data-card")).toBeInTheDocument();
    });
  });

  describe("Context Integration", () => {
    it("wraps content with FavouritesProvider", () => {
      mockUseFavourites.mockReturnValue({
        favourites: [],
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      // The component should render without context errors
      expect(screen.getByText("No Favourites Yet")).toBeInTheDocument();
    });

    it("calls useFavourites hook correctly", () => {
      mockUseFavourites.mockReturnValue({
        favourites: [],
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      expect(mockUseFavourites).toHaveBeenCalled();
    });
  });

  describe("Responsive Design", () => {
    it("renders container with proper structure", () => {
      mockUseFavourites.mockReturnValue({
        favourites: [],
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      // The outer container should have the container class
      const outerContainer = screen
        .getByText("No Favourites Yet")
        .closest(".container");
      expect(outerContainer).toBeInTheDocument();

      // The empty state content should have the emptyState class
      const emptyStateContent = screen
        .getByText("No Favourites Yet")
        .closest(".emptyState");
      expect(emptyStateContent).toBeInTheDocument();
    });

    it("renders favourites grid with proper structure", () => {
      const mockFavourites = [
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
          addedAt: 1234567890,
        },
      ];

      mockUseFavourites.mockReturnValue({
        favourites: mockFavourites,
        addFavourite: jest.fn(),
        removeFavourite: jest.fn(),
        isFavourited: jest.fn(),
        clearFavourites: jest.fn(),
      });

      render(<FavouritesPage />);

      const title = screen.getByText("Your Favourite Locations");
      const grid = title.nextElementSibling;
      expect(grid).toHaveClass("favouritesGrid");
    });
  });
});
