// React imports
import React from "react";

// Third-party imports
import { FaSpinner } from "react-icons/fa";

// Local imports
import styles from "./index.module.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({ size = "medium" }) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label="Loading"
    >
      <FaSpinner />
    </div>
  );
};

export default Loading;
