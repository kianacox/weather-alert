"use client";

// React imports
import React, { useState } from "react";

// Third-party imports
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

// Local imports
import styles from "./index.module.css";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu}>
            WindyDays
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Link
            href="/"
            className={`${styles.navLink} ${
              isActive("/") ? styles.active : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/favourites"
            className={`${styles.navLink} ${
              isActive("/favourites") ? styles.active : ""
            }`}
          >
            Favourites
          </Link>
        </div>

        {/* Mobile/Tablet Hamburger Button */}
        <button
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile/Tablet Navigation Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu} role="menu">
            <Link
              href="/"
              className={`${styles.mobileNavLink} ${
                isActive("/") ? styles.active : ""
              }`}
              onClick={closeMenu}
              role="menuitem"
            >
              Home
            </Link>
            <Link
              href="/favourites"
              className={`${styles.mobileNavLink} ${
                isActive("/favourites") ? styles.active : ""
              }`}
              onClick={closeMenu}
              role="menuitem"
            >
              Favourites
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
