import React from 'react';

export default function MessagePopup({ message, onClose }) {
  // Close on ESC key press
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Close when clicking outside the popup content
  const handleOverlayClick = (e) => {
    if (e.target.className === 'popup-overlay') {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content">
        <h2>Decrypted Message</h2>
        <div className="message-content">
          {message}
        </div>
        <button onClick={onClose} className="close-popup-button">
          Close
        </button>
      </div>
    </div>
  );
}