import React from 'react';

const ModuMentorIcon = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Robot Head */}
      <rect
        x="20"
        y="25"
        width="60"
        height="50"
        rx="8"
        fill="url(#robotGradient)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="2"
      />
      
      {/* Antennae */}
      <circle cx="35" cy="20" r="4" fill="url(#robotGradient)" />
      <circle cx="65" cy="20" r="4" fill="url(#robotGradient)" />
      <line
        x1="35"
        y1="20"
        x2="35"
        y2="25"
        stroke="url(#robotGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="65"
        y1="20"
        x2="65"
        y2="25"
        stroke="url(#robotGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Eyes */}
      <circle cx="38" cy="42" r="6" fill="#ffffff" opacity="0.9" />
      <circle cx="62" cy="42" r="6" fill="#ffffff" opacity="0.9" />
      <circle cx="38" cy="42" r="3" fill="#667eea" />
      <circle cx="62" cy="42" r="3" fill="#667eea" />
      
      {/* Mouth */}
      <rect
        x="42"
        y="58"
        width="16"
        height="4"
        rx="2"
        fill="#ffffff"
        opacity="0.7"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ModuMentorIcon;

