import React from 'react'

export function Input({
  label,
  icon,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            {icon}
          </span>
        )}
        <input 
          type={type}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg input-focus-ring transition-all placeholder:text-outline/50 ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}
