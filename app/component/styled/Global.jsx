import { injectGlobal } from 'emotion';


// eslint-disable-next-line
injectGlobal`
  html {
    background-color: hsl(0, 0%, 50%);
  }

  body {
    font-family: -apple-system, ".SFNSText-Regular", "San Francisco", "Helvetica Neue", "Lucida Grande", sans-serif;
    -webkit-font-smoothing: antialiased !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
    font-size: 14px;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    background-color: transparent;
    padding: 0;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #5E5A59;
  }

  *:not(a, input) {
    cursor: default !important;
  }

  a, a * {
    cursor: pointer !important;
  }
`;
