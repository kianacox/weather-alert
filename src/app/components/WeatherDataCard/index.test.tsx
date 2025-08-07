// React imports
import React from "react";

// Testing library imports
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Local imports
import WeatherDataCard from "./index";

describe("WeatherDataCard", () => {
  const mockWindData = {
    windSpeed: 8.5,
    windDirection: 180,
    timestamp: 1703000000000, // December 19, 2023
  };

  const defaultProps = {
    windData: mockWindData,
    cityName: "London",
    country: "GB",
  };

  describe("Initial Rendering", () => {
    it("renders the main title", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText("Wind Information")).toBeInTheDocument();
    });

    it("renders the location information", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });

    it("renders all wind data fields", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText(/Direction:/)).toBeInTheDocument();
      expect(screen.getByText(/Speed:/)).toBeInTheDocument();
      expect(screen.getByText(/Time:/)).toBeInTheDocument();
    });
  });

  describe("Wind Direction Display", () => {
    it("displays wind direction with cardinal direction and degrees", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText(/S° \(180\)/)).toBeInTheDocument();
    });

    it("handles different wind directions correctly", () => {
      const northWindData = { ...mockWindData, windDirection: 0 };
      render(<WeatherDataCard {...defaultProps} windData={northWindData} />);

      expect(screen.getByText(/N° \(0\)/)).toBeInTheDocument();
    });
  });

  describe("Wind Speed Display", () => {
    it("displays wind speed in m/s", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText("8.5 m/s")).toBeInTheDocument();
    });

    it("displays Beaufort scale information", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText(/Force 5 - Fresh Breeze/)).toBeInTheDocument();
    });

    it("handles different wind conditions", () => {
      const calmWindData = { ...mockWindData, windSpeed: 0.1 };
      render(<WeatherDataCard {...defaultProps} windData={calmWindData} />);

      expect(screen.getByText("0.1 m/s")).toBeInTheDocument();
      expect(screen.getByText(/Force 0 - Calm/)).toBeInTheDocument();
    });
  });

  describe("Timestamp Display", () => {
    it("displays formatted timestamp", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText(/Time:/)).toBeInTheDocument();
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });

    it("handles different timestamp values", () => {
      const recentWindData = { ...mockWindData, timestamp: Date.now() };
      render(<WeatherDataCard {...defaultProps} windData={recentWindData} />);

      expect(screen.getByText(/Time:/)).toBeInTheDocument();
    });
  });

  describe("Location Display", () => {
    it("displays city and country correctly", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText("London, GB")).toBeInTheDocument();
    });

    it("handles different city names", () => {
      render(
        <WeatherDataCard {...defaultProps} cityName="New York" country="US" />
      );

      expect(screen.getByText("New York, US")).toBeInTheDocument();
    });

    it("handles cities with special characters", () => {
      render(
        <WeatherDataCard {...defaultProps} cityName="São Paulo" country="BR" />
      );

      expect(screen.getByText("São Paulo, BR")).toBeInTheDocument();
    });

    it("handles long city names", () => {
      render(
        <WeatherDataCard
          {...defaultProps}
          cityName="Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch"
          country="GB"
        />
      );

      expect(
        screen.getByText(
          "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, GB"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Boundary and Edge Cases", () => {
    it("handles edge cases gracefully", () => {
      const zeroWindData = { ...mockWindData, windSpeed: 0 };
      render(<WeatherDataCard {...defaultProps} windData={zeroWindData} />);

      expect(screen.getByText("0 m/s")).toBeInTheDocument();
      expect(screen.getByText(/Force 0 - Calm/)).toBeInTheDocument();
    });

    it("handles extreme wind directions", () => {
      const negativeWindData = { ...mockWindData, windDirection: -90 };
      render(<WeatherDataCard {...defaultProps} windData={negativeWindData} />);

      // Should handle negative values gracefully
      expect(screen.getByText(/Direction:/)).toBeInTheDocument();
    });
  });

  describe("Data Accuracy", () => {
    it("displays correct Beaufort scale for different wind speeds", () => {
      const lightBreezeData = { ...mockWindData, windSpeed: 2.5 };
      render(<WeatherDataCard {...defaultProps} windData={lightBreezeData} />);

      expect(screen.getByText(/Force 2 - Light Breeze/)).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("has proper semantic structure", () => {
      render(<WeatherDataCard {...defaultProps} />);

      // Check for proper heading hierarchy
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Wind Information"
      );
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "London, GB"
      );
    });

    it("renders all data items in correct order", () => {
      render(<WeatherDataCard {...defaultProps} />);

      const dataItems = screen.getAllByText(/:/);
      expect(dataItems).toHaveLength(4); // Direction, Speed, Time, and timestamp
    });

    it("maintains consistent layout structure", () => {
      const { container } = render(<WeatherDataCard {...defaultProps} />);

      // Check that the card has the expected structure
      const card = container.firstChild;
      expect(card).toHaveClass("card");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(<WeatherDataCard {...defaultProps} />);

      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent("Wind Information");
      expect(headings[1]).toHaveTextContent("London, GB");
    });

    it("provides clear data labels", () => {
      render(<WeatherDataCard {...defaultProps} />);

      expect(screen.getByText("Direction:")).toBeInTheDocument();
      expect(screen.getByText("Speed:")).toBeInTheDocument();
      expect(screen.getByText("Time:")).toBeInTheDocument();
    });

    it("displays data in readable format", () => {
      render(<WeatherDataCard {...defaultProps} />);

      // Check that wind data is displayed in a user-friendly format
      expect(screen.getByText(/S° \(180\)/)).toBeInTheDocument();
      expect(screen.getByText("8.5 m/s")).toBeInTheDocument();
      expect(screen.getByText(/Force 5 - Fresh Breeze/)).toBeInTheDocument();
    });
  });
});
