import React from 'react';
import styled from 'react-emotion';

import Download from '@app/component/svg/Download';

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
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};

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
    margin-bottom: 1em;
    padding: 0 1em;
    text-align: center;
    line-height: 1.5em;
  }

  .download {
    font-weight: bold;
    font-size: 1.25em;
    text-decoration: none;
    color: ${props => props.theme.primary};
  }
`;

const Mobile = () => (
  <MobileContainer>
    <p className="sorry">ይቅርታ</p>
    <p className="message">Zefenify Web is designed for Desktop use.<br />While we are working on iOS and Android apps, you can get the desktop app. Avaialbe for macOS and Windows.</p>
    <a className="download" href="https://github.com/Zefenify/Wolf-Cola/releases" target="_blank" rel="noopener noreferrer">
      <Download /><span>&nbsp;Get Desktop App</span>
    </a>
  </MobileContainer>
);

module.exports = Mobile;
