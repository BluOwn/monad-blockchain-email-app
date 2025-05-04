import React from 'react';

// Simple loading spinner component
export default function Loading({ size = 'medium', message = 'Loading...' }) {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size] || 'w-8 h-8';

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}