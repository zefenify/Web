/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import store from 'app/redux/store';
import { WolfColaContainer, ControlsContainer, NavListContainer, NavContainer, ListContainer } from 'app/components/styled/WolfCola';
import { lightTheme, darkTheme } from 'app/config/theme';

class WolfCola extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: darkTheme,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const { theme } = store.getState();
      this.setState(() => ({ theme: theme === 'light' ? lightTheme : darkTheme }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme}>
          <WolfColaContainer>
            <NavListContainer>
              <NavContainer>Nav</NavContainer>
              <ListContainer>List</ListContainer>
            </NavListContainer>

            <ControlsContainer>Controls</ControlsContainer>
          </WolfColaContainer>
        </ThemeProvider>
      </Provider>
    );
  }
}

render(<WolfCola />, document.querySelector('#wolf-cola'));
