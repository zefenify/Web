import styled from 'react-emotion';

// https://codepen.io/aronwoost/pen/nlyrf + some styling tweaks, theme and Firefox fix
const Range = styled.input`
  &[type="range"] {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    width: 100%;
    height: 2px;
    margin: 0;
    border: none;
    padding: 1px 2px;
    border-radius: 4px;
    background: ${props => props.theme.control__color};
    box-shadow: none;
    outline: none;

    &:hover {
      background: ${props => props.theme.primary};
    }
  }

  &[type="range"]::-moz-range-track {
    border: inherit;
    background: transparent;
    outline: 0;
  }

  &[type="range"]::-moz-focus-inner,
  &[type="range"]::-moz-focus-outer {
    border: 0;
  }

  &[type="range"]::-ms-track {
    border: inherit;
    color: transparent;
    background: transparent;
  }

  &[type="range"]::-ms-fill-lower,
  &[type="range"]::-ms-fill-upper {
    background: transparent;
  }

  &[type="range"]::-ms-tooltip {
    display: none;
  }

  &[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border: none;
    border-radius: 12px;
    background-color: ${props => props.theme.control__color};
    transition: all 125ms linear;

    &:hover {
      background-color: ${props => props.theme.control__color};
      transform: scale3d(1.25, 1.25, 1);
    }
  }

  &[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 16px;
    background-color: ${props => props.theme.control__color};
    transition: all 125ms linear;

    &:hover {
      background-color: ${props => props.theme.control__color};
      transform: scale3d(1.25, 1.25, 1);
    }
  }

  &[type="range"]::-ms-thumb {
    width: 16px;
    height: 16px;
    border-radius: 16px;
    border: 0;
    background-color: ${props => props.theme.control__color};
    transition: all 125ms linear;

    &:hover {
      background-color: ${props => props.theme.control__color};
      transform: scale3d(1.25, 1.25, 1);
    }
  }
`;

module.exports = Range;
