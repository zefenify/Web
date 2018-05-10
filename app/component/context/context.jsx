import React, { createContext } from 'react';

const { Provider, Consumer } = createContext();

/**
 * context Consumer HOC
 *
 * @param  {Component} WrappedComponent
 * @param  {...[String]} contextKeys property keys to selectively pass as props
 * @return {Component}
 */
const withContext = (WrappedComponent, ...contextKeys) => props => (
  <Consumer>
    {
      (context) => {
        // passes the entire `context` keys as props
        if (contextKeys.length === 0) {
          return (<WrappedComponent {...props} context={context} />);
        }

        // building context keys...
        const propsKeys = {};
        contextKeys.forEach((key) => {
          propsKeys[key] = context[key];
        });

        return (<WrappedComponent {...props} {...propsKeys} />);
      }
    }
  </Consumer>
);

module.exports = {
  Provider,
  Consumer,
  withContext,
};
