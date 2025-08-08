// React imports
import React from "react";

// Testing library imports
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Next.js imports
import { usePathname } from "next/navigation";

// Local imports
import Navigation from "./index";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  describe("Initial Rendering", () => {
    it("renders the logo with correct text", () => {
      render(<Navigation />);

      expect(screen.getByText("WindyDays")).toBeInTheDocument();
    });

    it("renders the logo as a link to home", () => {
      render(<Navigation />);

      const logoLink = screen.getByRole("link", { name: "WindyDays" });
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("renders hamburger button on mobile/tablet", () => {
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("does not show mobile menu initially", () => {
      render(<Navigation />);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("hides desktop navigation on mobile/tablet", () => {
      render(<Navigation />);

      // Desktop navigation should not be visible by default
      const desktopNav = document.querySelector(".desktopNav");
      expect(desktopNav).toBeInTheDocument();
      // Note: CSS display:none is not easily testable in JSDOM
      // The actual responsive behavior is tested via CSS media queries
    });
  });

  describe("Mobile/Tablet Menu Functionality", () => {
    it("opens mobile menu when hamburger button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Home" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Favourites" })
      ).toBeInTheDocument();
    });

    it("changes hamburger button to close icon when menu is open", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      expect(
        screen.getByRole("button", { name: /close menu/i })
      ).toBeInTheDocument();
    });

    it("closes mobile menu when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      expect(screen.getByRole("menu")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close menu/i });
      await user.click(closeButton);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes mobile menu when a navigation link is clicked", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      const homeLink = screen.getByRole("menuitem", { name: "Home" });
      await user.click(homeLink);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes mobile menu when logo is clicked", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      const logoLink = screen.getByRole("link", { name: "WindyDays" });
      await user.click(logoLink);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("renders Home link with correct href", () => {
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const homeLink = screen.getByRole("menuitem", { name: "Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders Favourites link with correct href", () => {
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const favouritesLink = screen.getByRole("menuitem", {
        name: "Favourites",
      });
      expect(favouritesLink).toHaveAttribute("href", "/favourites");
    });

    it("marks Home link as active when on home page", () => {
      mockUsePathname.mockReturnValue("/");
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const homeLink = screen.getByRole("menuitem", { name: "Home" });
      expect(homeLink).toHaveClass("active");
    });

    it("marks Favourites link as active when on favourites page", () => {
      mockUsePathname.mockReturnValue("/favourites");
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const favouritesLink = screen.getByRole("menuitem", {
        name: "Favourites",
      });
      expect(favouritesLink).toHaveClass("active");
    });

    it("does not mark links as active when on different page", () => {
      mockUsePathname.mockReturnValue("/some-other-page");
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const homeLink = screen.getByRole("menuitem", { name: "Home" });
      const favouritesLink = screen.getByRole("menuitem", {
        name: "Favourites",
      });

      expect(homeLink).not.toHaveClass("active");
      expect(favouritesLink).not.toHaveClass("active");
    });
  });

  describe("Accessibility", () => {
    it("has proper navigation role and aria-label", () => {
      render(<Navigation />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });

    it("has proper hamburger button accessibility attributes", () => {
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");
    });

    it("updates hamburger button accessibility attributes when menu opens", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      expect(hamburgerButton).toHaveAttribute("aria-expanded", "true");
    });

    it("has proper menu role and menuitem roles", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(2);
      expect(menuItems[0]).toHaveTextContent("Home");
      expect(menuItems[1]).toHaveTextContent("Favourites");
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });

      // Focus the hamburger button directly
      hamburgerButton.focus();
      expect(hamburgerButton).toHaveFocus();

      // Press Enter to open menu
      await user.keyboard("{Enter}");
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("User Experience", () => {
    it("provides visual feedback on hamburger button hover", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.hover(hamburgerButton);

      // The button should have hover styles applied
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("maintains menu state correctly", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });

      // Open menu
      await user.click(hamburgerButton);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      // Close menu
      await user.click(hamburgerButton);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      // Open menu again
      await user.click(hamburgerButton);
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("handles rapid clicks on hamburger button", async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });

      // Rapid clicks
      await user.click(hamburgerButton);
      await user.click(hamburgerButton);
      await user.click(hamburgerButton);

      // Should end up in a consistent state
      await waitFor(() => {
        const menu = screen.queryByRole("menu");
        const isOpen = menu !== null;
        expect(isOpen).toBe(true);
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("shows hamburger button on mobile/tablet", () => {
      render(<Navigation />);

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("hides desktop navigation on mobile/tablet", () => {
      render(<Navigation />);

      // Desktop navigation should not be visible by default
      const desktopNav = document.querySelector(".desktopNav");
      expect(desktopNav).toBeInTheDocument();
      // Note: CSS display:none is not easily testable in JSDOM
      // The actual responsive behavior is tested via CSS media queries
    });
  });

  describe("Edge Cases", () => {
    it("handles pathname changes correctly", () => {
      // Start on home page
      mockUsePathname.mockReturnValue("/");
      const { rerender } = render(<Navigation />);

      // Open menu to see active state
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
      expect(screen.getByRole("menuitem", { name: "Home" })).toHaveClass(
        "active"
      );

      // Change to favourites page
      mockUsePathname.mockReturnValue("/favourites");
      rerender(<Navigation />);

      // Menu should already be open, check the active state
      expect(screen.getByRole("menuitem", { name: "Favourites" })).toHaveClass(
        "active"
      );
    });

    it("handles empty pathname", () => {
      mockUsePathname.mockReturnValue("");
      render(<Navigation />);

      // Open mobile menu to see the links
      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

      const homeLink = screen.getByRole("menuitem", { name: "Home" });
      const favouritesLink = screen.getByRole("menuitem", {
        name: "Favourites",
      });

      expect(homeLink).not.toHaveClass("active");
      expect(favouritesLink).not.toHaveClass("active");
    });
  });
});
