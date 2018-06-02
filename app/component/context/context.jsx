import React, { Component, createContext } from 'react';
import { arrayOf, string, shape, func } from 'prop-types';
import isEqual from 'react-fast-compare';

const { Provider, Consumer } = createContext();

class Store extends Component {
  constructor(props) {
    super(props);

    if (props.contextKeys.length === 0) {
      this.state = props.context.getState();
    } else {
      const storeSubset = {};
      const store = props.context.getState();

      props.contextKeys.forEach((key) => {
        storeSubset[key] = store[key];
      });

      this.state = storeSubset;
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.context.subscribe(() => {
      if (this.props.contextKeys.length === 0) {
        this.setState(() => this.props.context.getState());
      } else {
        const storeSubset = {};
        const store = this.props.context.getState();

        this.props.contextKeys.forEach((key) => {
          storeSubset[key] = store[key];
        });

        this.setState(() => storeSubset);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO:
    // ANC why without this it'll go into infinite loop
    return isEqual(this.props, nextProps) === false || isEqual(this.state, nextState) === false;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (<this.props.wrappedComponent {...this.props.wrappedProps} {...this.state} />);
  }
}

Store.propTypes = {
  context: shape({}),
  contextKeys: arrayOf(string),
  wrappedComponent: func.isRequired,
  wrappedProps: shape({}),
};

Store.defaultProps = {
  context: null,
  contextKeys: [],
  wrappedProps: null,
};

const withContext = (...contextKeys) => WrappedComponent => props => (
  <Consumer>
    {
      context => (
        <Store
          context={context}
          contextKeys={contextKeys}
          wrappedComponent={WrappedComponent}
          wrappedProps={props}
        />
      )
    }
  </Consumer>
);

module.exports = {
  Provider,
  Consumer,
  withContext,
};
