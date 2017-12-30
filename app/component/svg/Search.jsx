import React from 'react';

const Search = props => (
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
    <circle cx="10.5" cy="10.5" r="7.5" />
    <line x1="21" y1="21" x2="15.8" y2="15.8" />
  </svg>
);

module.exports = Search;
