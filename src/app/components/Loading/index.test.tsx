// React imports
import React from "react";

// Testing library imports
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Local imports
import Loading from "./index";

describe("Loading", () => {
  describe("Initial Rendering", () => {
    it("renders with default props", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });

    it("renders with custom size", () => {
      render(<Loading size="large" />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("large");
    });
  });

  describe("Size Variants", () => {
    it("applies small size class", () => {
      render(<Loading size="small" />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("small");
    });

    it("applies medium size class", () => {
      render(<Loading size="medium" />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("medium");
    });

    it("applies large size class", () => {
      render(<Loading size="large" />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("large");
    });

    it("defaults to medium size when no size prop is provided", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("medium");
    });
  });

  describe("Accessibility", () => {
    it("has proper role attribute", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("has proper aria-label", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });

    it("is accessible to screen readers", () => {
      render(<Loading />);

      const spinner = screen.getByLabelText("Loading");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders the spinner icon", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      const icon = spinner.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("has proper CSS classes", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("spinner");
      expect(spinner).toHaveClass("medium");
    });

    it("maintains consistent structure across different props", () => {
      const { rerender } = render(<Loading size="small" />);

      let spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("spinner", "small");

      rerender(<Loading size="large" />);

      spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("spinner", "large");
    });
  });

  describe("Edge Cases", () => {
    it("handles invalid size prop gracefully", () => {
      // TypeScript would prevent this, but testing for robustness
      render(<Loading size={"invalid" as any} />);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("User Behavior", () => {
    it("provides visual feedback for loading state", () => {
      render(<Loading />);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeVisible();
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });

    it("maintains consistent appearance across different screen sizes", () => {
      render(<Loading size="medium" />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("spinner", "medium");
    });
  });
});
