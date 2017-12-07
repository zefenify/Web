/* global window */
/* eslint no-console: off */

import React, { Component } from 'react';
import { element } from 'prop-types';

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
  children: element,
};

ErrorBoundaryContainer.defaultProps = {
  children: null,
};

module.exports = ErrorBoundaryContainer;
