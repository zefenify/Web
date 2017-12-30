import React from 'react';

const Download = props => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
    <polyline points="8 12 12 16 16 12" />
    <line x1="12" y1="2" x2="12" y2="16" />
  </svg>
);

module.exports = Download;
