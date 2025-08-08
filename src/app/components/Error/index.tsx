// React imports
import React from "react";

// Local imports
import styles from "./index.module.css";

interface ErrorProps {
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  const errorMessage = message?.trim() || "There was an error. Please retry.";

  return (
    <div className={styles.errorContainer} role="alert" aria-live="polite">
      <div className={styles.errorContent}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorMessage}>{errorMessage}</p>
      </div>
    </div>
  );
};

export default Error;
