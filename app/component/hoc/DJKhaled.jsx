import React from 'react';
import isEqual from 'lodash/fp/isEqual';

/**
 * Given store 🔑🔑🔑 it'll control when the `WrappedComponent` should be [re]rendered
 * by computing `shouldComponentUpdate` using the props
 *
 * @return {HOC}
 */
module.exports = WrappedComponent => class extends React.Component {
  shouldComponentUpdate(nextProps) {
    return isEqual(this.props, nextProps) === false;
  }

  render() {
    return <WrappedComponent {...this.props} />;
  }
};
