import React from 'react'

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  loading,
  ...props 
}) {
  const baseClasses = "font-headline-sm text-headline-sm py-3 px-6 rounded-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
  
  const variants = {
    primary: "bg-primary-container hover:bg-primary text-on-primary-container",
    ghost: "bg-transparent hover:bg-surface-variant text-primary",
    danger: "bg-error-container text-on-error-container hover:bg-error hover:text-on-error"
  }

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
