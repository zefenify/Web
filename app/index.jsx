/* global document */

import React from 'react';
import { render } from 'react-dom';

import { WolfColaContainer, ControlsContainer, NavListContainer, NavContainer, ListContainer } from 'app/components/styled/WolfCola';

function WolfCola() {
  return (
    <WolfColaContainer>
      <NavListContainer>
        <NavContainer>Nav</NavContainer>
        <ListContainer>List</ListContainer>
      </NavListContainer>

      <ControlsContainer>Controls</ControlsContainer>
    </WolfColaContainer>
  );
}

render(<WolfCola />, document.querySelector('#wolf-cola'));
