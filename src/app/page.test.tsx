// React imports
import React from "react";

// Testing library imports
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Local imports
import Home from "./page";
import { getWindData } from "../services/wind-service";

jest.mock("../services/wind-service");
const mockGetWindData = getWindData as jest.MockedFunction<typeof getWindData>;

global.fetch = jest.fn();

describe("Home Page", () => {
  const mockCities = [
    {
      city: "London",
      country: "GB",
      lat: 51.5074,
      lon: -0.1278,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (fetch as jest.Mock).mockResolvedValue({
      json: async () => mockCities,
    });
  });

  describe("Error Handling Integration", () => {
    it("displays error component when API call fails", async () => {
      const user = userEvent.setup();
      const apiError = new Error("Network request failed");
      mockGetWindData.mockRejectedValue(apiError);

      render(<Home />);

      const input = screen.getByRole("combobox");
      await user.type(input, "London");

      await waitFor(() => {
        expect(screen.getByText("London, GB")).toBeInTheDocument();
      });

      const londonOption = screen.getByText("London, GB");
      await user.click(londonOption);

      const searchButton = screen.getByRole("button", {
        name: /search for wind data/i,
      });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Network request failed")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("clears error when successful search is performed", async () => {
      const user = userEvent.setup();
      const mockWindData = {
        windSpeed: 5.2,
        windDirection: 180,
        timestamp: 1234567890,
      };

      // First, trigger an error
      mockGetWindData.mockRejectedValueOnce(
        new Error("Network request failed")
      );

      render(<Home />);

      const input = screen.getByRole("combobox");
      await user.type(input, "London");

      await waitFor(() => {
        expect(screen.getByText("London, GB")).toBeInTheDocument();
      });

      const londonOption = screen.getByText("London, GB");
      await user.click(londonOption);

      const searchButton = screen.getByRole("button", {
        name: /search for wind data/i,
      });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Network request failed")).toBeInTheDocument();
      });

      // Now trigger a successful search
      mockGetWindData.mockResolvedValueOnce(mockWindData);
      await user.click(searchButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Network request failed")
        ).not.toBeInTheDocument();
        expect(screen.getByText("Wind Information")).toBeInTheDocument();
      });
    });

    it("displays default error message when no specific error message is provided", async () => {
      const user = userEvent.setup();
      const apiError = new Error();
      mockGetWindData.mockRejectedValue(apiError);

      render(<Home />);

      const input = screen.getByRole("combobox");
      await user.type(input, "London");

      await waitFor(() => {
        expect(screen.getByText("London, GB")).toBeInTheDocument();
      });

      const londonOption = screen.getByText("London, GB");
      await user.click(londonOption);

      const searchButton = screen.getByRole("button", {
        name: /search for wind data/i,
      });
      await user.click(searchButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to fetch wind data")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Component Rendering", () => {
    it("renders the main title", () => {
      render(<Home />);

      expect(screen.getByText("WindyDays")).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<Home />);

      expect(
        screen.getByText(/Discover wind conditions around the world/)
      ).toBeInTheDocument();
    });

    it("renders the search bar", () => {
      render(<Home />);

      expect(
        screen.getByRole("combobox", { name: /search for a city/i })
      ).toBeInTheDocument();
    });
  });
});
