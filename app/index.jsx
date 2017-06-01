/* global document */

import React from 'react';
import { render } from 'react-dom';

function WolfCola() {
  return (
    <div>
      <h1>Wolf Cola</h1>
      <small>The right music player for closure</small>
    </div>
  );
}

render(<WolfCola />, document.querySelector('#wolf-cola'));
