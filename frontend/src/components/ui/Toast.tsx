import React, { useEffect } from "react";

/**
 * Props for the Toast component.
 * @typedef {Object} ToastProps
 * @property {string} message - The main notification text.
 * @property {'success' | 'error'} [type='success'] - The status variant of the notification.
 * @property {() => void} onClose - Callback to close or dismiss the toast.
 * @property {number} [duration=4000] - Auto-close duration in milliseconds (0 to disable auto-close).
 */
export interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
  duration = 4000,
}) => {
  // Handle auto-close
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isSuccess = type === "success";
  
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-4 bg-container-bg text-primary-text px-4 py-3 rounded-[4px] border border-outline-border shadow-md min-w-[300px] max-w-sm animate-fadeIn"
      role="alert"
    >
      <div className="flex items-center gap-3">
        {/* Color Indicator */}
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p className="text-xs font-sans font-medium tracking-wide text-primary-text/95">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-secondary-text hover:text-primary-text transition-colors duration-200 cursor-pointer p-0.5"
        aria-label="Dismiss toast"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
