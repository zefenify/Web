import React from 'react';
import styled from 'react-emotion';

import DJKhaled from '@app/component/hoc/DJKhaled';

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: ${props => props.theme.listBackground};
  color: ${props => props.theme.listText};

  @media(min-width: 1024px) {
    display: none;
  }

  .sorry {
    font-size: 2em;
    margin: 0;
  }

  .message {
    font-size: 1em;
    margin: 0;
    margin-top: 0.25em;
    padding: 0 1em;
  }
`;

const Mobile = () => (
  <MobileContainer>
    <p className="sorry">ይቅርታ</p>
    <p className="message">Zefenify Web is designed for Desktop use</p>
  </MobileContainer>
);

Mobile.propTypes = {};

Mobile.defaultProps = {};

module.exports = DJKhaled(Mobile);
