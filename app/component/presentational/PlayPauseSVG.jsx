import React from 'react';
import { string, bool, func } from 'prop-types';

const PlayPauseSVG = ({ onClick, playing, className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="none"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
    className={className}
  >
    {
      playing ?
        <g>
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </g>
        : <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    }
  </svg>
);

PlayPauseSVG.propTypes = {
  onClick: func.isRequired,
  playing: bool,
  className: string,
};

PlayPauseSVG.defaultProps = {
  playing: false,
  className: '',
};

module.exports = PlayPauseSVG;
