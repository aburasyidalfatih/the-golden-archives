import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "relative px-8 py-4 font-accent font-bold tracking-widest text-xs uppercase transition-all duration-300 border shadow-lg hover:-translate-y-0.5 active:translate-y-0";
  
  const variants = {
    primary: `
      bg-ink-red border-ink-red text-white
      hover:bg-red-800 hover:border-red-800 
      shadow-md
    `,
    secondary: `
      bg-parchment-100 border-ink-800 text-ink-900
      hover:bg-parchment-200
    `,
    danger: "bg-red-900 text-white border-red-900 hover:bg-red-800"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            RESEARCHING...
          </>
        ) : children}
      </span>
    </button>
  );
};

export default Button;