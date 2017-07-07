/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';

import 'normalize.css';
import '@app/static/icoMoon/style.css';
import '@app/scss/wolf-cola.scss';

import store from '@app/redux/store';
import Home from '@app/component/hoc/Home';
import { WolfColaContainer, NavListContainer, NavContainer, ListContainer } from '@app/component/styled/WolfCola';
import Divider from '@app/component/styled/Divider';
import { NavLinkStyled } from '@app/component/styled/ReactRouter';
import { lightTheme, darkTheme } from '@app/config/theme';

import Setting from '@app/component/hoc/Setting';
import Control from '@app/component/hoc/Control';
import Spinner from '@app/component/presentational/Spinner';

const SmallText = styled.small`
  padding: 1em 0.5em;
  border-left: 1.25em solid transparent;
  font-size: 0.75em;
  margin-top: ${props => props.marginTop ? props.marginTop : '0em'};
  cursor: default;
`;

const Brand = styled(Link)`
  flex: 0 0 48px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1.25em;
  font-weight: bold;
  font-size: 1.2em;
  text-decoration: none;
  color: inherit;

  & > img.brand-image {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-right: 0.75em;
  }
`;

class WolfCola extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: darkTheme,
      loading: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(() => {
        const state = store.getState();

        return {
          theme: state.theme === 'light' ? lightTheme : darkTheme,
          loading: state.loading,
        };
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme}>
          <Router>
            <WolfColaContainer>
              <NavListContainer>
                <NavContainer>
                  <Brand to="/">
                    <img src="app/static/image/brand.png" className="brand-image" alt="ArifZefen" />
                    <span>ArifZefen</span>
                    <Spinner loading={this.state.loading} />
                  </Brand>
                  <Divider />

                  <NavLinkStyled to="/search">
                    <span>Search</span>
                    <i className="icon-ion-ios-search-strong" style={{ float: 'right' }} />
                  </NavLinkStyled>
                  <NavLinkStyled to="/top-songs">Top Songs</NavLinkStyled>
                  <NavLinkStyled to="/genre">Genre</NavLinkStyled>
                  <NavLinkStyled to="/ariflist">ArifList</NavLinkStyled>
                  <NavLinkStyled to="/surprise">Surprise Me</NavLinkStyled>

                  <SmallText marginTop="2em">YOUR MUSIC</SmallText>
                  <Divider />

                  <NavLinkStyled to="/recent">Recently Played</NavLinkStyled>
                  <NavLinkStyled to="/songs">Songs</NavLinkStyled>

                  <SmallText marginTop="2em">YOUR PLAYLISTS</SmallText>
                  <Divider />

                  <NavLinkStyled to="/playlist/ላሽ-ላሽ">ላሽ ላሽ</NavLinkStyled>
                  <NavLinkStyled to="/playlist/Hip-Hop">Hip-Hop</NavLinkStyled>

                  <SmallText marginTop="2em">SETTINGS</SmallText>
                  <Divider />

                  <NavLinkStyled to="/setting">Settings</NavLinkStyled>
                </NavContainer>

                <ListContainer>
                  <Route exact path="/" component={Home} />
                  <Route path="/setting" component={Setting} />
                </ListContainer>
              </NavListContainer>

              <Control />
            </WolfColaContainer>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

render(<WolfCola />, document.querySelector('#wolf-cola'));
