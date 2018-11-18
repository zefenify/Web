/* eslint no-console: off */

import React, { useContext } from 'react';

import store from '@app/redux/store';
import { Context } from '@app/component/context/context';
// import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';
import { USER_REQUEST } from '@app/redux/constant/user';
import { SONG } from '@app/redux/constant/song';
import Settings from '@app/component/presentational/Settings';


const dispatches = {
  themeToggle() {
    store.dispatch({
      type: THEME_REQUEST,
    });
  },

  crossfadeSet(e) {
    store.dispatch({
      type: CROSSFADE_REQUEST,
      payload: Number.parseInt(e.target.value, 10),
    });
  },

  login() {
    console.log('RADA!');
  },

  logout() {
    store.dispatch({
      type: USER_REQUEST,
      payload: null,
    });

    store.dispatch({
      type: SONG,
      payload: null,
    });
  },
};

// const SettingsContainer = props => (<Settings {...props} {...dispatches} />);

const SettingsContainer = (props) => {
  const { theme, crossfade, user } = useContext(Context);

  return (
    <Settings
      theme={theme}
      crossfade={crossfade}
      user={user}
      {...props}
      {...dispatches}
    />
  );
};

// export default withContext('theme', 'crossfade', 'user')(SettingsContainer);
export default SettingsContainer;
