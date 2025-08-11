// React imports
import React from "react";

// Testing library imports
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Local imports
import WeatherDataCard from "./index";
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

const renderWeatherDataCard = (props: any) => {
  return render(
    <FavouritesProvider>
      <WeatherDataCard {...props} />
    </FavouritesProvider>
  );
};

describe("WeatherDataCard", () => {
  const defaultProps = {
    windData: {
      windSpeed: 5.2,
      windDirection: 180,
      timestamp: 1234567890,
    },
    cityName: "London",
    country: "GB",
    latitude: 51.5074,
    longitude: -0.1278,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Initial Rendering", () => {
    it("renders the card title", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("Wind Information")).toBeInTheDocument();
    });

    it("renders the location title", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });

    it("renders all data items", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("Direction:")).toBeInTheDocument();
      expect(screen.getByText("Speed:")).toBeInTheDocument();
      expect(screen.getByText("Time:")).toBeInTheDocument();
    });

    it("renders the favourites button", () => {
      renderWeatherDataCard(defaultProps);

      expect(
        screen.getByRole("button", { name: /add to favourites/i })
      ).toBeInTheDocument();
    });
  });

  describe("Wind Direction Display", () => {
    it("displays wind direction correctly", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText(/180/)).toBeInTheDocument();
      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("S");
    });

    it("handles different wind directions", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 90,
        },
      });

      expect(screen.getByText(/90/)).toBeInTheDocument();
      expect(screen.getByText(/E/)).toBeInTheDocument();
    });

    it("handles zero degrees", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 0,
        },
      });

      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("0");
      expect(directionElement).toHaveTextContent("N");
    });
  });

  describe("Wind Speed Display", () => {
    it("displays wind speed correctly", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText(/5\.2 m\/s/)).toBeInTheDocument();
    });

    it("displays Beaufort scale information", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText(/Force 3 - Gentle Breeze/)).toBeInTheDocument();
    });

    it("handles different wind speeds", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windSpeed: 25.0,
        },
      });

      expect(screen.getByText(/25 m\/s/)).toBeInTheDocument();
      expect(screen.getByText(/Force 10 - Storm/)).toBeInTheDocument();
    });

    it("handles zero wind speed", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windSpeed: 0,
        },
      });

      expect(screen.getByText(/0 m\/s/)).toBeInTheDocument();
      expect(screen.getByText(/Force 0 - Calm/)).toBeInTheDocument();
    });
  });

  describe("Timestamp Display", () => {
    it("displays timestamp in readable format", () => {
      renderWeatherDataCard(defaultProps);

      const timestamp = new Date(1234567890).toLocaleString();
      expect(screen.getByText(timestamp)).toBeInTheDocument();
    });

    it("handles different timestamps", () => {
      const newTimestamp = Date.now();
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          timestamp: newTimestamp,
        },
      });

      const timestamp = new Date(newTimestamp).toLocaleString();
      expect(screen.getByText(timestamp)).toBeInTheDocument();
    });
  });

  describe("Location Display", () => {
    it("displays city and country correctly", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });

    it("handles different locations", () => {
      renderWeatherDataCard({
        ...defaultProps,
        cityName: "Paris",
        country: "FR",
      });

      expect(screen.getByText("Paris, FR")).toBeInTheDocument();
    });

    it("handles empty city name", () => {
      renderWeatherDataCard({
        ...defaultProps,
        cityName: "",
      });

      expect(screen.getByText(", GB")).toBeInTheDocument();
    });

    it("handles empty country", () => {
      renderWeatherDataCard({
        ...defaultProps,
        country: "",
      });

      expect(screen.getByText(/London,/)).toBeInTheDocument();
    });
  });

  describe("Boundary and Edge Cases", () => {
    it("handles negative wind direction", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: -90,
        },
      });

      expect(screen.getByText(/-90/)).toBeInTheDocument();
      // Use a more specific selector to avoid conflict with "Wind Information"
      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("W");
    });

    it("handles very high wind speeds", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windSpeed: 50.0,
        },
      });

      expect(screen.getByText(/50 m\/s/)).toBeInTheDocument();
      expect(screen.getByText(/Force 12 - Hurricane/)).toBeInTheDocument();
    });

    it("handles decimal wind speeds", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windSpeed: 3.7,
        },
      });

      expect(screen.getByText(/3\.7 m\/s/)).toBeInTheDocument();
    });
  });

  describe("Data Accuracy", () => {
    it("displays correct wind direction for North", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 0,
        },
      });

      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("N");
    });

    it("displays correct wind direction for East", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 90,
        },
      });

      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("E");
    });

    it("displays correct wind direction for South", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 180,
        },
      });

      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("S");
    });

    it("displays correct wind direction for West", () => {
      renderWeatherDataCard({
        ...defaultProps,
        windData: {
          ...defaultProps.windData,
          windDirection: 270,
        },
      });

      const directionElement = screen
        .getByText(/Direction:/)
        .closest(".dataItem");
      expect(directionElement).toHaveTextContent("W");
    });
  });

  describe("Component Structure", () => {
    it("renders all data items in correct order", () => {
      renderWeatherDataCard(defaultProps);

      const labels = screen.getAllByText(/Direction:|Speed:|Time:/);
      expect(labels).toHaveLength(3);
    });

    it("has proper heading structure", () => {
      renderWeatherDataCard(defaultProps);

      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent("Wind Information");
      expect(headings[1]).toHaveTextContent("London, GB");
    });

    it("provides clear data labels", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("Direction:")).toBeInTheDocument();
      expect(screen.getByText("Speed:")).toBeInTheDocument();
      expect(screen.getByText("Time:")).toBeInTheDocument();
    });

    it("displays data in readable format", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText(/5\.2 m\/s/)).toBeInTheDocument();
      expect(screen.getByText(/180/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderWeatherDataCard(defaultProps);

      const headings = screen.getAllByRole("heading");
      expect(headings[0]).toHaveTextContent("Wind Information");
      expect(headings[1]).toHaveTextContent("London, GB");
    });

    it("provides accessible data labels", () => {
      renderWeatherDataCard(defaultProps);

      const labels = screen.getAllByText(/Direction:|Speed:|Time:/);
      expect(labels).toHaveLength(3);
    });

    it("renders data in semantic structure", () => {
      renderWeatherDataCard(defaultProps);

      expect(screen.getByText("Wind Information")).toBeInTheDocument();
      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });
  });
});
