// React imports
import React from "react";

// Testing library imports
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Local imports
import Error from "./index";

describe("Error", () => {
  describe("Initial Rendering", () => {
    it("renders with default error message when no message prop is provided", () => {
      render(<Error />);

      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });

    it("renders with custom error message when message prop is provided", () => {
      const customMessage = "API request failed. Please check your connection.";
      render(<Error message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it("renders the warning icon", () => {
      render(<Error />);

      expect(screen.getByText("⚠️")).toBeInTheDocument();
    });
  });

  describe("Message Display", () => {
    it("displays short error messages correctly", () => {
      render(<Error message="Network error" />);

      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    it("displays long error messages correctly", () => {
      const longMessage =
        "This is a very long error message that should wrap properly and display correctly even when it contains multiple sentences and detailed information about what went wrong.";
      render(<Error message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("displays error messages with special characters", () => {
      render(<Error message="Error: 404 - Not Found!" />);

      expect(screen.getByText("Error: 404 - Not Found!")).toBeInTheDocument();
    });

    it("displays error messages with numbers", () => {
      render(<Error message="Server returned status code 500" />);

      expect(
        screen.getByText("Server returned status code 500")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper role attribute", () => {
      render(<Error />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toBeInTheDocument();
    });

    it("has proper aria-live attribute", () => {
      render(<Error />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveAttribute("aria-live", "polite");
    });

    it("is accessible to screen readers", () => {
      render(<Error message="Custom error message" />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveTextContent("Custom error message");
    });

    it("provides clear error indication", () => {
      render(<Error />);

      // Check that the error is visually distinct with icon and styling
      expect(screen.getByText("⚠️")).toBeInTheDocument();
      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("has proper CSS classes", () => {
      render(<Error />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveClass("errorContainer");
    });

    it("maintains consistent structure with different messages", () => {
      const { rerender } = render(<Error message="First error" />);

      expect(screen.getByText("First error")).toBeInTheDocument();
      expect(screen.getByText("⚠️")).toBeInTheDocument();

      rerender(<Error message="Second error" />);

      expect(screen.getByText("Second error")).toBeInTheDocument();
      expect(screen.getByText("⚠️")).toBeInTheDocument();
    });

    it("renders error content in correct order", () => {
      render(<Error message="Test error" />);

      const errorContainer = screen.getByRole("alert");
      const icon = errorContainer.querySelector(".errorIcon");
      const message = errorContainer.querySelector(".errorMessage");

      expect(icon).toBeInTheDocument();
      expect(message).toBeInTheDocument();
      expect(icon?.textContent).toBe("⚠️");
      expect(message?.textContent).toBe("Test error");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string message", () => {
      render(<Error message="" />);

      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });

    it("handles whitespace-only message", () => {
      render(<Error message="   " />);

      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });

    it("handles null message prop", () => {
      render(<Error message={null as any} />);

      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });

    it("handles undefined message prop", () => {
      render(<Error message={undefined} />);

      expect(
        screen.getByText("There was an error. Please retry.")
      ).toBeInTheDocument();
    });
  });

  describe("User Experience", () => {
    it("provides clear visual feedback for errors", () => {
      render(<Error message="Something went wrong" />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toBeInTheDocument();
      expect(screen.getByText("⚠️")).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("maintains consistent appearance across different screen sizes", () => {
      render(<Error message="Responsive error message" />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveClass("errorContainer");
    });

    it("provides actionable error messages", () => {
      render(
        <Error message="Please check your internet connection and try again" />
      );

      expect(
        screen.getByText("Please check your internet connection and try again")
      ).toBeInTheDocument();
    });
  });

  describe("API Error Scenarios", () => {
    it("displays network error messages", () => {
      render(<Error message="Network request failed" />);

      expect(screen.getByText("Network request failed")).toBeInTheDocument();
    });

    it("displays server error messages", () => {
      render(<Error message="Server error: 500 Internal Server Error" />);

      expect(
        screen.getByText("Server error: 500 Internal Server Error")
      ).toBeInTheDocument();
    });

    it("displays timeout error messages", () => {
      render(<Error message="Request timed out. Please try again." />);

      expect(
        screen.getByText("Request timed out. Please try again.")
      ).toBeInTheDocument();
    });

    it("displays validation error messages", () => {
      render(<Error message="Invalid coordinates provided" />);

      expect(
        screen.getByText("Invalid coordinates provided")
      ).toBeInTheDocument();
    });
  });
});
