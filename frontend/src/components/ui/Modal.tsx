import React, { useEffect } from "react";
import Button from "./Button";

/**
 * Props for the Modal component.
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is visible.
 * @property {() => void} onClose - Callback to close the modal.
 * @property {string} title - The title of the modal shown at the top.
 * @property {React.ReactNode} children - The main content of the modal.
 * @property {React.ReactNode} [footer] - Optional footer content (e.g. action buttons).
 * @property {string} [className=''] - Extra classes for the modal container.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with flat overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container: Grayscale containers, outline border, flat, sharp corners */}
      <div
        className={`relative bg-container-bg border border-outline-border w-full max-w-lg rounded-[4px] flex flex-col z-10 transition-transform duration-300 max-h-[90vh] overflow-hidden ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-border">
          <h3 className="text-base font-sans font-bold text-primary-text uppercase tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-text hover:text-primary-text transition-colors duration-200 cursor-pointer p-1"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm font-sans text-primary-text/90">
          {children}
        </div>

        {/* Modal Footer */}
        {footer ? (
          <div className="px-6 py-4 bg-surface-bg border-t border-outline-border flex justify-end gap-3">
            {footer}
          </div>
        ) : (
          <div className="px-6 py-4 bg-surface-bg border-t border-outline-border flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
