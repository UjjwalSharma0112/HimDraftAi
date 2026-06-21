import React from "react";

/**
 * Props for the Input component.
 * @typedef {Object} InputProps
 * @property {string} label - The label displayed above the input.
 * @property {string} [error] - Error message to display and style the input with.
 * @property {string} [id] - The HTML id attribute for the input.
 * @property {string} [type='text'] - The type of input.
 * @property {string} [placeholder] - Placeholder text.
 * @property {string} [value] - Current input value.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - Change handler.
 * @property {boolean} [required=false] - Whether the input is required.
 * @property {string} [className=''] - Extra classes for the container wrapper.
 * @property {string} [inputClassName=''] - Extra classes for the input field.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
  className?: string;
  inputClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = "",
  inputClassName = "",
  type = "text",
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full text-left font-sans ${className}`}>
      {/* Label always positioned above the input field, all-caps, small font size */}
      <label
        htmlFor={id}
        className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
      </label>

      {/* Input container with 1px border, generous internal padding */}
      <input
        id={id}
        type={type}
        required={required}
        className={`w-full font-sans text-sm bg-container-bg text-primary-text px-3.5 py-2.5 border rounded-[4px] outline-none transition-colors duration-200 
          ${
            error
              ? "border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-500"
              : "border-outline-border focus:border-primary-text"
          } 
          ${inputClassName}`}
        {...props}
      />

      {/* Error message or label */}
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-sans mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
