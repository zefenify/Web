/* global document */
/* eslint no-console: off */

import React, { useState, useEffect, createContext } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'emotion-theming';

import store from '@app/redux/store';
import { LIGHT, DARK } from '@app/config/theme';
import '@app/component/styled/Global';
import ErrorBoundaryContainer from '@app/component/container/ErrorBoundaryContainer';
import ContextOverlayContainer from '@app/component/container/ContextOverlayContainer';
import SpaceContainer from '@app/component/container/SpaceContainer';
import Mobile from '@app/component/presentational/Mobile';
import {
  WolfColaContainer,
  NavigationContainer,
  NavigationMainContainer,
  MainContainer,
  ControlsContainer,
} from '@app/component/styled/lego';

// this will be used by `useContext` - no mo' wrapper hell
// eslint-disable-next-line
export const Context = createContext(null);

const WolfCola = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <Context.Provider value={state}>
      <ThemeProvider theme={state.theme === 'LIGHT' ? LIGHT : DARK}>
        <ErrorBoundaryContainer>
          <WolfColaContainer className="booting" id="wolf-cola-container">
            <NavigationMainContainer>
              <NavigationContainer />
              <MainContainer />
            </NavigationMainContainer>

            <ControlsContainer />
          </WolfColaContainer>

          <Mobile />
          <ContextOverlayContainer />
          <SpaceContainer />
        </ErrorBoundaryContainer>
      </ThemeProvider>
    </Context.Provider>
  );
};

render(<WolfCola />, document.querySelector('#wolf-cola'));
