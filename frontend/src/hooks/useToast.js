import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "success",
        message,
        ...options,
      });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "error",
        message,
        duration: 7000, // Longer duration for errors
        ...options,
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "warning",
        message,
        ...options,
      });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "info",
        message,
        ...options,
      });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
