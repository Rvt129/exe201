import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const LoadingState = ({ message = "Đang tải giỏ hàng..." }) => {
  return (
    <div className="loading-container">
      <BiLoaderAlt className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
