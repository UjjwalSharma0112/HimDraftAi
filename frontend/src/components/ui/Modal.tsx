import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop covering the entire viewport including sidebar & navbar */}
      <div
        className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-xs transition-opacity duration-300 z-[9999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Modal Box */}
      <div
        className={`relative bg-container-bg border border-outline-border w-full max-w-xl rounded-[4px] flex flex-col z-[10000] shadow-2xl transition-all duration-300 max-h-[85vh] overflow-hidden ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header (Fixed top) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-border flex-shrink-0 bg-container-bg">
          <h3 id="modal-title" className="text-sm sm:text-base font-sans font-bold text-primary-text uppercase tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-text hover:text-primary-text transition-colors duration-200 cursor-pointer p-1 rounded hover:bg-surface-bg"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Modal Body (Scrollable content area) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-xs sm:text-sm font-sans text-primary-text/90">
          {children}
        </div>

        {/* Modal Footer (Fixed bottom) */}
        <div className="px-6 py-4 bg-surface-bg border-t border-outline-border flex-shrink-0 flex items-center justify-end gap-3">
          {footer ? (
            footer
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
