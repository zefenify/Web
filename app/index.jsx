/* global document */

import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Switch } from 'react-router-dom';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import '@app/component/styled/Global';

import '@app/util/facebook';
import store from '@app/redux/store';
import { Provider } from '@app/component/context/context';
import { themeLight, themeDark } from '@app/config/theme';

import ErrorBoundaryContainer from '@app/component/container/ErrorBoundaryContainer';
import HomeContainer from '@app/component/container/HomeContainer';
import SettingsContainer from '@app/component/container/SettingsContainer';
import ControlContainer from '@app/component/container/ControlContainer';
import PlaylistContainer from '@app/component/container/PlaylistContainer';
import ArtistContainer from '@app/component/container/ArtistContainer';
import AlbumContainer from '@app/component/container/AlbumContainer';
import RecentContainer from '@app/component/container/RecentContainer';
import SongsContainer from '@app/component/container/SongsContainer';
import AlbumsContainer from '@app/component/container/AlbumsContainer';
import ArtistsContainer from '@app/component/container/ArtistsContainer';
import TrendingContainer from '@app/component/container/TrendingContainer';
import SearchContainer from '@app/component/container/SearchContainer';
import QueueContainer from '@app/component/container/QueueContainer';
import CollectionContainer from '@app/component/container/CollectionContainer';
import ContextMenuContainer from '@app/component/container/ContextMenuContainer';
import ContextOverlayContainer from '@app/component/container/ContextOverlayContainer';
import NotificationContainer from '@app/component/container/NotificationContainer';
import SpaceContainer from '@app/component/container/SpaceContainer.jsx';

import Spinner from '@app/component/presentational/Spinner';
import Mobile from '@app/component/presentational/Mobile';
import Search from '@app/component/svg/Search';
import Trending from '@app/component/svg/Trending';
import Settings from '@app/component/svg/Settings';
import Download from '@app/component/svg/Download';

// #context-overlay-container = [98, 100]
// #context-menu-container = 999
// #mobile = 1000
const WolfColaContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 99;
  opacity: 1;
  filter: blur(0px);
  transform: scale3d(1, 1, 1);
  transition: transform 256ms, filter 0ms, opacity 256ms;
  will-change: transform, filter, opacity;

  &.context-menu-active {
    opacity: 0.92;
    filter: blur(4px);
    transform: scale3d(0.96, 0.96, 1);
  }

  &.booting {
    opacity: 0;
    filter: blur(4px);
    transform: scale3d(0.96, 0.96, 1);
  }
`;

const NavListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  height: 100vh - 70px;
`;

const NavContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 200px;
  width: 200px;
  background-color: ${props => props.theme.navBackground__backgroundColor};
  overflow-y: auto;

  .brand {
    position: absolute;
    left: 0;
    right: 0;
    flex: 0 0 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    padding-left: 1rem;
    font-weight: bold;
    font-size: 1.2em;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 0 4px 2px ${props => props.theme.navBoxShadow__color};

    &__image {
      width: 40px;
      height: 40px;
      margin-right: 0.75em;
    }

    &__text {
      color: ${props => props.theme.navBrand__color};
    }
  }

  .nav-list {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }

  .small-text {
    padding: 1em 0.5em;
    border-left: 1.25em solid transparent;
    font-size: 0.75em;
    margin-top: 2em;
    cursor: default;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.navLink__color};
  padding: 0.5em 0.64rem;
  margin: 0.25em 0;
  font-weight: bold;
  text-decoration: none;
  border-left: 6px solid transparent;
  cursor: default;

  &:hover {
    color: ${props => props.theme.navLink__color_hover};
  }

  &.active {
    color: ${props => props.theme.navLinkActive__color};
    border-left: 6px solid ${props => props.theme.primary};
    background-color: ${props => props.theme.navLinkActive__backgroundColor};
  }
`;

const RouteContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0 calc(100vw - 200px);
  height: calc(100vh - 70px);
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  overflow-y: auto;
  padding: 1em 2em;
  padding-bottom: 0;
  padding-top: 2em;
`;

const Divider = styled.div`
  flex: 0 0 auto;
  display: flex;
  width: 100%;
  align-items: center;
  color: ${props => props.theme.navDivider__color};
  padding: 1em 0.5em 1em 1rem;
  font-size: 0.75em;

  &:after {
    height: 0;
    content: '';
    flex: 1 1 auto;
    border-top: 1px solid ${props => props.theme.navDivider__borderTop};
  }
`;

class WolfCola extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      theme: 'dark',
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const { theme, loading } = store.getState();

      // avoiding `shouldComponentUpdate` hook...
      if (theme !== this.state.theme || loading !== this.state.loading) {
        this.setState(() => ({
          loading,
          theme,
        }));
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Provider value={store}>
        <ThemeProvider theme={this.state.theme === 'light' ? themeLight : themeDark}>
          <Router>
            <ErrorBoundaryContainer>
              <WolfColaContainer className="booting" id="wolf-cola-container">
                <NavListContainer>
                  <NavContainer>
                    <Link className="brand" to="/">
                      <img className="brand__image" alt="zefenify logo" src="static/image/zefenify.png" />
                      <span className="brand__text">Zefenify</span>
                      <Spinner loading={this.state.loading} />
                    </Link>

                    <div className="nav-list">
                      <NavLinkStyled to="/" exact>Featured</NavLinkStyled>
                      <NavLinkStyled to="/search">
                        <span>Search</span>
                        <Search style={{ float: 'right' }} />
                      </NavLinkStyled>
                      <NavLinkStyled to="/trending">
                        <span>Trending</span>
                        <Trending style={{ float: 'right' }} />
                      </NavLinkStyled>
                      <NavLinkStyled to="/collection">Genres &amp; Moods</NavLinkStyled>

                      <Divider>YOUR MUSIC&nbsp;</Divider>
                      <NavLinkStyled to="/recent">Recently Played</NavLinkStyled>
                      <NavLinkStyled to="/songs">Songs</NavLinkStyled>
                      <NavLinkStyled to="/albums">Albums</NavLinkStyled>
                      <NavLinkStyled to="/artists">Artists</NavLinkStyled>

                      <Divider>SETTINGS&nbsp;</Divider>
                      <NavLinkStyled to="/settings">
                        <span>Settings</span>
                        <Settings style={{ float: 'right' }} />
                      </NavLinkStyled>
                      <NavLinkStyled to="https://github.com/Zefenify/Wolf-Cola/releases" target="_blank">
                        <span>Install Desktop App</span>
                        <Download style={{ float: 'right' }} />
                      </NavLinkStyled>
                      <div style={{ paddingBottom: '2em' }} />
                    </div>
                  </NavContainer>

                  <RouteContainer>
                    <Switch>
                      <Route exact path="/" component={HomeContainer} />
                      <Route exact path="/:type(playlist|featured)/:id" component={PlaylistContainer} />
                      <Route exact path="/artist/:id" component={ArtistContainer} />
                      <Route exact path="/album/:id/:trackId?" component={AlbumContainer} />
                      <Route exact path="/search" component={SearchContainer} />
                      <Route exact path="/trending/:category(yesterday|today|week|popularity)" component={TrendingContainer} />
                      <Route exact path="/collection/:id?" component={CollectionContainer} />
                      <Route exact path="/recent" component={RecentContainer} />
                      <Route exact path="/songs" component={SongsContainer} />
                      <Route exact path="/albums/:id?" component={AlbumsContainer} />
                      <Route exact path="/artists/:id?" component={ArtistsContainer} />
                      <Route exact path="/settings" component={SettingsContainer} />
                      <Route exact path="/queue" component={QueueContainer} />
                      <Redirect exact push={false} from="/trending" to="/trending/yesterday" />
                      <Redirect push={false} to="/" />
                    </Switch>

                    <NotificationContainer />
                  </RouteContainer>
                </NavListContainer>

                <ControlContainer />
              </WolfColaContainer>

              <Mobile />
              <ContextOverlayContainer />
              <ContextMenuContainer />
              <SpaceContainer />
            </ErrorBoundaryContainer>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

render(<WolfCola />, document.querySelector('#wolf-cola'));
