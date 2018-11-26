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

  .m-0 {
    margin: 0 !important;
  }

  .mt-0,
  .my-0 {
    margin-top: 0 !important;
  }

  .mr-0,
  .mx-0 {
    margin-right: 0 !important;
  }

  .mb-0,
  .my-0 {
    margin-bottom: 0 !important;
  }

  .ml-0,
  .mx-0 {
    margin-left: 0 !important;
  }

  .m-1 {
    margin: 0.25rem !important;
  }

  .mt-1,
  .my-1 {
    margin-top: 0.25rem !important;
  }

  .mr-1,
  .mx-1 {
    margin-right: 0.25rem !important;
  }

  .mb-1,
  .my-1 {
    margin-bottom: 0.25rem !important;
  }

  .ml-1,
  .mx-1 {
    margin-left: 0.25rem !important;
  }

  .m-2 {
    margin: 0.5rem !important;
  }

  .mt-2,
  .my-2 {
    margin-top: 0.5rem !important;
  }

  .mr-2,
  .mx-2 {
    margin-right: 0.5rem !important;
  }

  .mb-2,
  .my-2 {
    margin-bottom: 0.5rem !important;
  }

  .ml-2,
  .mx-2 {
    margin-left: 0.5rem !important;
  }

  .m-3 {
    margin: 1rem !important;
  }

  .mt-3,
  .my-3 {
    margin-top: 1rem !important;
  }

  .mr-3,
  .mx-3 {
    margin-right: 1rem !important;
  }

  .mb-3,
  .my-3 {
    margin-bottom: 1rem !important;
  }

  .ml-3,
  .mx-3 {
    margin-left: 1rem !important;
  }

  .m-4 {
    margin: 1.5rem !important;
  }

  .mt-4,
  .my-4 {
    margin-top: 1.5rem !important;
  }

  .mr-4,
  .mx-4 {
    margin-right: 1.5rem !important;
  }

  .mb-4,
  .my-4 {
    margin-bottom: 1.5rem !important;
  }

  .ml-4,
  .mx-4 {
    margin-left: 1.5rem !important;
  }

  .m-5 {
    margin: 3rem !important;
  }

  .mt-5,
  .my-5 {
    margin-top: 3rem !important;
  }

  .mr-5,
  .mx-5 {
    margin-right: 3rem !important;
  }

  .mb-5,
  .my-5 {
    margin-bottom: 3rem !important;
  }

  .ml-5,
  .mx-5 {
    margin-left: 3rem !important;
  }

  .p-0 {
    padding: 0 !important;
  }

  .pt-0,
  .py-0 {
    padding-top: 0 !important;
  }

  .pr-0,
  .px-0 {
    padding-right: 0 !important;
  }

  .pb-0,
  .py-0 {
    padding-bottom: 0 !important;
  }

  .pl-0,
  .px-0 {
    padding-left: 0 !important;
  }

  .p-1 {
    padding: 0.25rem !important;
  }

  .pt-1,
  .py-1 {
    padding-top: 0.25rem !important;
  }

  .pr-1,
  .px-1 {
    padding-right: 0.25rem !important;
  }

  .pb-1,
  .py-1 {
    padding-bottom: 0.25rem !important;
  }

  .pl-1,
  .px-1 {
    padding-left: 0.25rem !important;
  }

  .p-2 {
    padding: 0.5rem !important;
  }

  .pt-2,
  .py-2 {
    padding-top: 0.5rem !important;
  }

  .pr-2,
  .px-2 {
    padding-right: 0.5rem !important;
  }

  .pb-2,
  .py-2 {
    padding-bottom: 0.5rem !important;
  }

  .pl-2,
  .px-2 {
    padding-left: 0.5rem !important;
  }

  .p-3 {
    padding: 1rem !important;
  }

  .pt-3,
  .py-3 {
    padding-top: 1rem !important;
  }

  .pr-3,
  .px-3 {
    padding-right: 1rem !important;
  }

  .pb-3,
  .py-3 {
    padding-bottom: 1rem !important;
  }

  .pl-3,
  .px-3 {
    padding-left: 1rem !important;
  }

  .p-4 {
    padding: 1.5rem !important;
  }

  .pt-4,
  .py-4 {
    padding-top: 1.5rem !important;
  }

  .pr-4,
  .px-4 {
    padding-right: 1.5rem !important;
  }

  .pb-4,
  .py-4 {
    padding-bottom: 1.5rem !important;
  }

  .pl-4,
  .px-4 {
    padding-left: 1.5rem !important;
  }

  .p-5 {
    padding: 3rem !important;
  }

  .pt-5,
  .py-5 {
    padding-top: 3rem !important;
  }

  .pr-5,
  .px-5 {
    padding-right: 3rem !important;
  }

  .pb-5,
  .py-5 {
    padding-bottom: 3rem !important;
  }

  .pl-5,
  .px-5 {
    padding-left: 3rem !important;
  }

  .m-auto {
    margin: auto !important;
  }

  .mt-auto,
  .my-auto {
    margin-top: auto !important;
  }

  .mr-auto,
  .mx-auto {
    margin-right: auto !important;
  }

  .mb-auto,
  .my-auto {
    margin-bottom: auto !important;
  }

  .ml-auto,
  .mx-auto {
    margin-left: auto !important;
  }

  .d-flex {
    display: flex !important;
  }

  .flex-row {
    flex-direction: row !important;
  }

  .flex-column {
    flex-direction: column !important;
  }

  .flex-wrap {
    flex-wrap: wrap !important;
  }

  .flex-nowrap {
    flex-wrap: nowrap !important;
  }

  .flex-fill {
    flex: 1 1 auto !important;
  }

  .flex-grow-0 {
    flex-grow: 0 !important;
  }

  .flex-grow-1 {
    flex-grow: 1 !important;
  }

  .flex-shrink-0 {
    flex-shrink: 0 !important;
  }

  .flex-shrink-1 {
    flex-shrink: 1 !important;
  }

  .justify-content-start {
    justify-content: flex-start !important;
  }

  .justify-content-end {
    justify-content: flex-end !important;
  }

  .justify-content-center {
    justify-content: center !important;
  }

  .justify-content-between {
    justify-content: space-between !important;
  }

  .justify-content-around {
    justify-content: space-around !important;
  }

  .align-items-start {
    align-items: flex-start !important;
  }

  .align-items-end {
    align-items: flex-end !important;
  }

  .align-items-center {
    align-items: center !important;
  }

  .align-items-baseline {
    align-items: baseline !important;
  }

  .align-items-stretch {
    align-items: stretch !important;
  }

  .align-content-start {
    align-content: flex-start !important;
  }

  .align-content-end {
    align-content: flex-end !important;
  }

  .align-content-center {
    align-content: center !important;
  }

  .align-content-between {
    align-content: space-between !important;
  }

  .align-content-around {
    align-content: space-around !important;
  }

  .align-content-stretch {
    align-content: stretch !important;
  }

  .align-self-auto {
    align-self: auto !important;
  }

  .align-self-start {
    align-self: flex-start !important;
  }

  .align-self-end {
    align-self: flex-end !important;
  }

  .align-self-center {
    align-self: center !important;
  }

  .align-self-baseline {
    align-self: baseline !important;
  }

  .align-self-stretch {
    align-self: stretch !important;
  }
`;
