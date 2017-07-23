/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion/react/theming';

import 'normalize.css';
import '@app/static/icoMoon/style.scss';
import '@app/scss/wolf-cola.scss';

import store from '@app/redux/store';
import { lightTheme, darkTheme } from '@app/config/theme';

import Home from '@app/component/hoc/Home';
import Setting from '@app/component/hoc/Setting';
import Control from '@app/component/hoc/Control';
import Featured from '@app/component/hoc/Featured';
import Artist from '@app/component/hoc/Artist';
import Recent from '@app/component/hoc/Recent';
import Surprise from '@app/component/hoc/Surprise';
import Top from '@app/component/hoc/Top';

import Spinner from '@app/component/presentational/Spinner';

import { WolfColaContainer, NavListContainer, NavContainer, RouteContainer } from '@app/component/styled/WolfCola';
import Divider from '@app/component/styled/Divider';
import { NavLinkStyled } from '@app/component/styled/ReactRouter';

class WolfCola extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: lightTheme,
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
                  <Link className="brand" to="/">
                    <img src="static/image/brand.png" className="brand-image" alt="ArifZefen" />
                    <span>ArifZefen</span>
                    <Spinner loading={this.state.loading} />
                  </Link>
                  <Divider />

                  <div className="nav-list">
                    <NavLinkStyled to="/search">
                      <span>Search</span>
                      <i className="icon-ion-ios-search-strong" style={{ float: 'right' }} />
                    </NavLinkStyled>
                    <NavLinkStyled to="/top">Top Songs</NavLinkStyled>
                    <NavLinkStyled to="/genre">Genre</NavLinkStyled>
                    <NavLinkStyled to="/ariflist">ArifList</NavLinkStyled>
                    <NavLinkStyled to="/surprise">Surprise Me</NavLinkStyled>

                    <small className="small-text">YOUR MUSIC</small>
                    <Divider />

                    <NavLinkStyled to="/recent">Recently Played</NavLinkStyled>
                    <NavLinkStyled to="/songs">Songs</NavLinkStyled>

                    <small className="small-text">YOUR PLAYLISTS</small>
                    <Divider />

                    <NavLinkStyled to="/playlist/ላሽ-ላሽ">ላሽ ላሽ</NavLinkStyled>
                    <NavLinkStyled to="/playlist/Hip-Hop">Hip-Hop</NavLinkStyled>

                    <small className="small-text">SETTINGS</small>
                    <Divider />

                    <NavLinkStyled to="/setting">Settings</NavLinkStyled>
                    <div style={{ paddingBottom: '2em' }} />
                  </div>
                </NavContainer>

                <RouteContainer>
                  <Route exact path="/" component={Home} />
                  <Route path="/featured/:id" component={Featured} />
                  <Route path="/artist/:id" component={Artist} />
                  <Route path="/top/:category?" component={Top} />
                  <Route path="/surprise" component={Surprise} />
                  <Route path="/recent" component={Recent} />
                  <Route path="/setting" component={Setting} />
                </RouteContainer>
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
