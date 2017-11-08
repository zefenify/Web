/* eslint no-console: off */

import React, { Component } from 'react';
import { element } from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    console.warn({ error, info });
    this.setState(() => ({ hasError: true }));
  }

  render() {
    if (this.state.hasError === true) {
      return <div>Darn it!</div>;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: element,
};

ErrorBoundary.defaultProps = {
  children: null,
};

module.exports = ErrorBoundary;
