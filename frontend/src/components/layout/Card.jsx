import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-8 ${className}`}>
      {children}
    </div>
  )
}
