import React, { createContext } from 'react';

const { Provider, Consumer } = createContext();

const withContext = WrappedComponent => props => (
  <Consumer>
    {
      context => (
        <WrappedComponent {...props} context={context} />
      )
    }
  </Consumer>
);

module.exports = {
  Provider,
  Consumer,
  withContext,
};
