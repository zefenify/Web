/* global document */
/* eslint no-console: off */

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';

import store from '@app/redux/store';
import { LIGHT, DARK } from '@app/config/theme';
import GlobalStyle from '@app/component/styled/Global';
import ErrorBoundaryContainer from '@app/component/container/ErrorBoundaryContainer';
import ContextOverlayContainer from '@app/component/container/ContextOverlayContainer';
import KeyboardContainer from '@app/component/container/KeyboardContainer';
import { Context } from '@app/component/context/context';
import Mobile from '@app/component/presentational/Mobile';
import ControlContainer from '@app/component/container/ControlContainer';
import HomeContainer from '@app/component/container/HomeContainer';
import SettingsContainer from '@app/component/container/SettingsContainer';
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
import NotificationContainer from '@app/component/container/NotificationContainer';
import Spinner from '@app/component/presentational/Spinner';
import Search from '@app/component/svg/Search';
import Trending from '@app/component/svg/Trending';
import Settings from '@app/component/svg/Settings';
import Download from '@app/component/svg/Download';
import { NavLinkStyled } from '@app/component/styled/ReactRouter';
import {
  WolfColaContainer,
  NavigationContainer,
  NavigationMainContainer,
  MainContainer,
} from '@app/component/styled/lego';


const WolfCola = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });

    const wolfColaContainer = document.querySelector('#wolf-cola-container');
    if (wolfColaContainer !== null) {
      wolfColaContainer.classList.remove('booting');
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Context.Provider value={state}>
      <ThemeProvider theme={state.theme === 'LIGHT' ? LIGHT : DARK}>
        <Router>
          <ErrorBoundaryContainer>
            <WolfColaContainer className="booting" id="wolf-cola-container">
              <NavigationMainContainer>
                <NavigationContainer>
                  <Link className="__brand" to="/">
                    <img className="__brand__image" alt="zefenify logo" src="static/image/zefenify.png" />
                    <span className="__brand__text">Zefenify</span>
                    <Spinner loading={state.loading} />
                  </Link>

                  <div className="__navigation">
                    {/* generic */}
                    <NavLinkStyled className="px-2" to="/" exact>Featured</NavLinkStyled>
                    <NavLinkStyled className="px-2 py-3" to="/search">
                      <span>Search</span>
                      <Search strokeWidth="1px" />
                    </NavLinkStyled>
                    <NavLinkStyled className="px-2 py-3" to="/trending">
                      <span>Trending</span>
                      <Trending strokeWidth="1px" />
                    </NavLinkStyled>
                    <NavLinkStyled className="px-2 py-3" to="/collection">Genres &amp; Moods</NavLinkStyled>

                    {/* recent */}
                    <NavLinkStyled className="px-2 py-3 mt-3" to="/recent">Recently Played</NavLinkStyled>

                    {/* your music */}
                    <NavLinkStyled className="px-2 py-3 mt-3" to="/songs">Songs</NavLinkStyled>
                    <NavLinkStyled className="px-2 py-3" to="/albums">Albums</NavLinkStyled>
                    <NavLinkStyled className="px-2 py-3" to="/artists">Artists</NavLinkStyled>

                    {/* setting++ */}
                    <NavLinkStyled className="px-2 py-3 mt-3" to="/settings">
                      <span>Settings</span>
                      <Settings strokeWidth="1px" />
                    </NavLinkStyled>

                    <a className="px-2 py-3 my-3 __install" href="https://github.com/Zefenify/Wolf-Cola/releases" target="_blank" rel="noopener noreferrer">
                      <span>Install Desktop App</span>
                      <Download strokeWidth="1px" />
                    </a>
                  </div>
                </NavigationContainer>

                <MainContainer>
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
                </MainContainer>
              </NavigationMainContainer>

              <ControlContainer />
            </WolfColaContainer>

            <GlobalStyle />
            <Mobile />
            <ContextMenuContainer />
            <ContextOverlayContainer />
            <KeyboardContainer />
          </ErrorBoundaryContainer>
        </Router>
      </ThemeProvider>
    </Context.Provider>
  );
};

render(<WolfCola />, document.querySelector('#wolf-cola'));
