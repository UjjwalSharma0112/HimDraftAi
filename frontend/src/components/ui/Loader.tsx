import React from "react";

/**
 * Props for the Loader component.
 * @typedef {Object} LoaderProps
 * @property {'spinner' | 'skeleton'} [variant='spinner'] - The type of loader (spinner or skeleton layout).
 * @property {'sm' | 'md' | 'lg'} [size='md'] - The size of the spinner (only applies to spinner variant).
 * @property {string} [className=''] - Extra classes for custom styles or positioning.
 */
export interface LoaderProps {
  variant?: "spinner" | "skeleton";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = "spinner",
  size = "md",
  className = "",
}) => {
  if (variant === "skeleton") {
    return (
      <div className={`w-full space-y-4 animate-pulse ${className}`}>
        <div className="h-4 bg-outline-border/40 rounded-[4px] w-2/3" />
        <div className="space-y-2">
          <div className="h-3 bg-outline-border/40 rounded-[4px] w-full" />
          <div className="h-3 bg-outline-border/40 rounded-[4px] w-full" />
          <div className="h-3 bg-outline-border/40 rounded-[4px] w-4/5" />
        </div>
      </div>
    );
  }

  // Size mapping for spinner
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Grayscale circular spinner */}
      <div
        className={`${sizeClasses[size]} border-outline-border border-t-primary-text rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
