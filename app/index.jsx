/* global document */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';

import 'normalize.css';
import '@app/scss/notie.scss';
import '@app/scss/wolf-cola.scss';

import '@app/util/facebook';
import store from '@app/redux/store';
import { lightTheme, darkTheme } from '@app/config/theme';

import DJKhaled from '@app/component/hoc/DJKhaled';

import HomeContainer from '@app/component/container/HomeContainer';
import SettingContainer from '@app/component/container/SettingContainer';
import ControlContainer from '@app/component/container/ControlContainer';
import PlaylistContainer from '@app/component/container/PlaylistContainer';
import ArtistContainer from '@app/component/container/ArtistContainer';
import AlbumContainer from '@app/component/container/AlbumContainer';
import RecentContainer from '@app/component/container/RecentContainer';
import SurpriseContainer from '@app/component/container/SurpriseContainer';
import TopContainer from '@app/component/container/TopContainer';
import SearchContainer from '@app/component/container/SearchContainer';
import BoxContainer from '@app/component/container/BoxContainer';

import Spinner from '@app/component/presentational/Spinner';
import Mobile from '@app/component/presentational/Mobile';

import { WolfColaContainer, NavListContainer, NavContainer, RouteContainer } from '@app/component/styled/WolfCola';
import Divider from '@app/component/styled/Divider';
import { NavLinkStyled } from '@app/component/styled/ReactRouter';

const Search = props => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="10.5" cy="10.5" r="7.5" />
    <line x1="21" y1="21" x2="15.8" y2="15.8" />
  </svg>
);

const WolfCola = DJKhaled('loading', 'theme')(({ loading, theme }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Router>
        <WolfColaContainer>
          <NavListContainer>
            <NavContainer>
              <Link className="brand" to="/">
                <img className="brand-img" alt="zefenify logo" src="static/image/zefenify.png" />
                <span>Zefenify</span>
                <Spinner loading={loading} />
              </Link>

              <div className="nav-list">
                <NavLinkStyled to="/search">
                  <span>Search</span>
                  <Search style={{ float: 'right' }} />
                </NavLinkStyled>
                <NavLinkStyled to="/top">Top Songs</NavLinkStyled>
                <NavLinkStyled to="/genre">Genre</NavLinkStyled>
                <NavLinkStyled to="/ariflist">ArifList</NavLinkStyled>
                <NavLinkStyled to="/surprise">Surprise Me</NavLinkStyled>

                <small className="small-text">YOUR MUSIC</small>
                <Divider />

                <NavLinkStyled to="/recent">Recently Played</NavLinkStyled>
                { /* <NavLinkStyled to="/songs">Songs</NavLinkStyled> */ }

                {/*
                <small className="small-text">YOUR PLAYLISTS</small>
                <Divider />

                <NavLinkStyled to="/playlist/ላሽ-ላሽ">ላሽ ላሽ</NavLinkStyled>
                <NavLinkStyled to="/playlist/Hip-Hop">Hip-Hop</NavLinkStyled>
                */}

                <small className="small-text">SETTINGS</small>
                <Divider />

                <NavLinkStyled to="/setting">Settings</NavLinkStyled>
                <div style={{ paddingBottom: '2em' }} />
              </div>
            </NavContainer>

            <RouteContainer>
              <Route exact path="/" component={HomeContainer} />
              <Route path="/:type(playlist|featured)/:id" component={PlaylistContainer} />
              <Route path="/artist/:id" component={ArtistContainer} />
              <Route path="/album/:id/:trackId?" component={AlbumContainer} />
              <Route path="/search" component={SearchContainer} />
              <Route path="/top/:category?" component={TopContainer} />
              <Route path="/:type(genre|ariflist)/:list?" component={BoxContainer} />
              <Route path="/surprise" component={SurpriseContainer} />
              <Route path="/recent" component={RecentContainer} />
              <Route path="/setting" component={SettingContainer} />
            </RouteContainer>
          </NavListContainer>

          <ControlContainer />

          <Mobile />
        </WolfColaContainer>
      </Router>
    </ThemeProvider>
  </Provider>
));

render(<WolfCola />, document.querySelector('#wolf-cola'));
