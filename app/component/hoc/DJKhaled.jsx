import React from 'react';
import isEqual from 'react-fast-compare';

/**
 * `PureComponent` with isEqual
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
