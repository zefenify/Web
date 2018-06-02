/* global window */

import React, { Component } from 'react';
import { element, oneOfType, arrayOf } from 'prop-types';

import ErrorBoundary from '@app/component/presentational/ErrorBoundary';

const hardRefresh = () => {
  window.location.reload(true);
};

class ErrorBoundaryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    // TODO: build error reporting service
    this.setState(() => ({
      hasError: true,
    }));
  }

  render() {
    if (this.state.hasError === true) {
      return <ErrorBoundary hardRefresh={hardRefresh} />;
    }

    return this.props.children;
  }
}

ErrorBoundaryContainer.propTypes = {
  children: oneOfType([
    element,
    arrayOf(element),
  ]),
};

ErrorBoundaryContainer.defaultProps = {
  children: null,
};

module.exports = ErrorBoundaryContainer;
