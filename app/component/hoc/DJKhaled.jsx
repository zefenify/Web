import React from 'react';
import isEqual from 'lodash/fp/isEqual';

import store from '@app/redux/store';

/**
 * Given store 🔑🔑🔑 it'll control when the `WrappedComponent` should be [re]rendered
 * by computing `shouldComponentUpdate` and `setState` inside the store subscriber
 *
 * @param  {...String} stateKeys DJ Khaled 🔑
 * @return {HOC}
 */
module.exports = (stateKeys = []) => (WrappedComponent) => {
  if (stateKeys.length === 0) {
    return class extends React.Component {
      shouldComponentUpdate(nextProps) {
        return isEqual(this.props)(nextProps) === false;
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  }

  // eslint-disable-next-line
  return class extends React.Component {
    constructor(props) {
      super(props);

      const stateObject = {};
      const state = store.getState();

      stateKeys.forEach((key) => {
        stateObject[key] = state[key];
      });

      this.state = stateObject;
    }

    componentDidMount() {
      this.unsubscribe = store.subscribe(() => {
        const state = store.getState();
        const stateObject = {};

        stateKeys.forEach((key) => {
          stateObject[key] = state[key];
        });

        if (isEqual(stateObject)(this.state) === false) {
          this.setState(() => (stateObject));
        }
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      return isEqual(this.props)(nextProps) === false || isEqual(this.state)(nextState) === false;
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  };
};
