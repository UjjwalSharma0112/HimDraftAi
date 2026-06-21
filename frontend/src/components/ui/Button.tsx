import React from "react";

/**
 * Props for the Button component.
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - The content inside the button.
 * @property {'primary' | 'secondary' | 'outline'} [variant='primary'] - The visual style variant of the button.
 * @property {boolean} [disabled=false] - Whether the button is interactable.
 * @property {() => void} [onClick] - Click handler function.
 * @property {'button' | 'submit' | 'reset'} [type='button'] - The HTML button type.
 * @property {string} [className=''] - Extra CSS classes to apply.
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  // Base structural classes
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2 dark:focus:ring-offset-black py-2.5 px-5 rounded-[4px] cursor-pointer select-none";

  // Variant classes using monochromatic variables
  let variantClasses = "";
  if (disabled) {
    variantClasses =
      "bg-outline-border/40 text-secondary-text/60 border border-outline-border/60 cursor-not-allowed";
  } else {
    switch (variant) {
      case "primary":
        // Solid black background, white text (light); white background, black text (dark)
        variantClasses =
          "bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 border border-black dark:border-white";
        break;
      case "secondary":
        // Subtle background contrast, text-primary
        variantClasses =
          "bg-outline-border/55 text-primary-text hover:bg-outline-border/80 border border-transparent";
        break;
      case "outline":
        // Transparent background, border outline
        variantClasses =
          "bg-transparent text-primary-text border border-outline-border hover:bg-surface-bg";
        break;
    }
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
