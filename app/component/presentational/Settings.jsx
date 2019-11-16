import React, { memo } from 'react';
import {
  bool,
  func,
  string,
  number,
  shape,
} from 'prop-types';
import styled from '@emotion/styled';

import Button from '@app/component/styled/Button';
import Range from '@app/component/styled/Range';
import HeaderView from '@app/component/styled/HeaderView';


const DMCA = styled.a`
  text-decoration: none;
  color: #ff6d5e;
  border-radius: 2em;
  padding: 0.75em 2.75em;
  font-size: 1em;
  margin-bottom: 1em;
  border: 1px solid #ff6d5e;
`;


const Form = styled.form`
  input {
    border: 1px solid red;
    font-size: 1.25rem;
    background-color: ${props => props.theme.NATURAL_6};
    border-radius: 0.25rem;
    border: 0 solid ${props => props.theme.NATURAL_4};
    color: ${props => props.theme.NATURAL_1};
    width: 25vw;
    border-radius: 0.25rem;

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px ${props => props.theme.NATURAL_6} inset;
      -webkit-text-fill-color: ${props => props.theme.NATURAL_1};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &[name="verificationCode"] {
      text-align: center;
    }
  }
`;


const Settings = ({
  crossfade,
  themeToggle,
  theme,
  logout,
  user,
  loading,
  state,
  onChange,
  onSubmit,
}) => (
  <HeaderView>
    <div className="__header">
      <h1 className="m-0">Settings</h1>
    </div>

    <div className="__view d-flex flex-column align-items-center flex-shrink-0 flex-nowrap">
      <div className="mb-5">
        {
          user === null ? (
            <Form className="d-flex flex-column align-items-center mt-5" noValidate method="post" onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="p-3 mb-3"
                value={state.email}
                onChange={onChange}
                required
                disabled={state.verificationCodeSent === true}
              />

              {
                state.verificationCodeSent === false ? null : (
                  <input
                    type="tel"
                    minLength="6"
                    maxLength="6"
                    name="verificationCode"
                    placeholder="Verification Code"
                    className="p-3 mb-3"
                    value={state.verificationCode}
                    onChange={onChange}
                    required
                  />
                )
              }

              <div>
                <Button disabled={loading}>Login or Register</Button>
              </div>
            </Form>
          ) : (
            <div className="d-flex flex-column align-items-center mt-5">
              <h2 className="m-0 mb-2">{ user.user.user_email }</h2>
              <Button disabled={loading} onClick={logout}>Log Out</Button>
            </div>
          )
        }
      </div>

      <div className="mb-5 d-flex flex-column align-items-center flex-shrink-0">
        <Button className="mb-2" onClick={themeToggle}>Toggle Theme</Button>
        <small>
          <span>Current theme is </span>
          <b>{ theme === 'LIGHT' ? 'Dayman' : 'Nightman' }</b>
        </small>
      </div>

      <div className="mb-5 d-flex flex-column align-items-center" style={{ width: '250px' }}>
        <h3 className="mt-0 mb-2">{ `Crossfade: ${crossfade === 0 ? 'Off' : `${crossfade} Second${crossfade > 1 ? 's' : ''}`}` }</h3>

        <Range
          name="corssfade"
          type="range"
          onChange={onChange}
          value={crossfade}
          min="0"
          max="12"
          step="1"
        />
      </div>

      <DMCA href="/dmca.html" target="_blank">DMCA</DMCA>
    </div>
  </HeaderView>
);

Settings.propTypes = {
  theme: string,
  user: shape({}),
  crossfade: number,
  state: shape({}),
  loading: bool,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
  themeToggle: func.isRequired,
  logout: func.isRequired,
};

Settings.defaultProps = {
  theme: 'light',
  crossfade: 0,
  user: null,
  state: {},
  loading: false,
};

export default memo(Settings);
