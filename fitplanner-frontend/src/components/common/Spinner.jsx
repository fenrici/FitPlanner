import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '20px',
    medium: '30px', 
    large: '40px'
  };

  const spinnerStyle = {
    width: sizes[size],
    height: sizes[size],
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default Spinner; 