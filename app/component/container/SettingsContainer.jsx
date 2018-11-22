/* eslint no-console: off */

import React, { useState, useContext } from 'react';

import store from '@app/redux/store';
import { post, error } from '@app/util/api';
import { Context } from '@app/component/context/context';
import Settings from '@app/component/presentational/Settings';
import { BASE } from '@app/config/api';
import { loading } from '@app/redux/action/loading';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';
import { USER_REQUEST } from '@app/redux/constant/user';
import { SONG } from '@app/redux/constant/song';


const themeToggle = () => {
  store.dispatch({
    type: THEME_REQUEST,
  });
};


const logout = () => {
  store.dispatch({
    type: USER_REQUEST,
    payload: null,
  });

  store.dispatch({
    type: SONG,
    payload: [],
  });
};


const SettingsContainer = (props) => {
  const context = useContext(Context);
  const [state, setState] = useState({
    email: '',
    verificationCode: '',
    verificationCodeSent: false,
  });

  const onChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    if (name === 'corssfade') {
      store.dispatch({
        type: CROSSFADE_REQUEST,
        payload: Number.parseInt(value, 10),
      });

      return;
    }

    setState(Object.assign(state, {
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    let formIsValid = true;

    [...target.elements].forEach((element) => {
      if (element.required === true) {
        formIsValid = element.validity.valid;
      }
    });

    if (formIsValid === false) {
      store.dispatch({
        type: NOTIFICATION_ON_REQUEST,
        payload: {
          message: 'Please Fill All the Required Fields',
        },
      });

      return;
    }

    if (state.verificationCodeSent === false) {
      // sending verification code...
      store.dispatch(loading(true));

      post(`${BASE}email`, context.user, { email: state.email })
        .then(() => {
          setState(Object.assign(state, {
            verificationCodeSent: true,
          }));

          store.dispatch(loading(false));
          store.dispatch({
            type: NOTIFICATION_ON_REQUEST,
            payload: {
              message: 'Verification Code Has Been Sent to Your Email',
            },
          });
        }, error(store));

      return;
    }

    // verifying...
    store.dispatch(loading(true));
    const { verificationCodeSent, ...payload } = state;

    post(`${BASE}authenticate`, context.user, payload)
      .then(({ data }) => {
        store.dispatch(loading(false));
        store.dispatch({
          type: USER_REQUEST,
          payload: data.data,
        });
      }, ({ response }) => {
        const { data } = response;

        store.dispatch(loading(false));
        store.dispatch({
          type: NOTIFICATION_ON_REQUEST,
          payload: {
            message: data.error || 'Invalid Credentials Provided',
          },
        });
      });
  };

  return (
    <Settings
      theme={context.theme}
      crossfade={context.crossfade}
      user={context.user}
      loading={context.loading}
      state={state}
      themeToggle={themeToggle}
      logout={logout}
      onChange={onChange}
      onSubmit={onSubmit}
      {...props}
    />
  );
};


export default SettingsContainer;
