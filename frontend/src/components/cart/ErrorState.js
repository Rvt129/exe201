import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <FiAlertTriangle className="error-icon" />
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={onRetry}>
        <FiRefreshCw />
        Thử lại
      </button>
    </div>
  );
};

export default ErrorState;
