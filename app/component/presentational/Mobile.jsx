import React from 'react';
import styled from 'emotion/react';

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
  z-index: 999;
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

  .store-links {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 2em;

    &__link {
      padding: 0 0.5em;
      text-decoration: none;
      font-size: 3em;
    }
  }
`;

const Mobile = () => (
  <MobileContainer>
    <p className="sorry">ይቅርታ</p>
    <p className="message">Wolf Cola is designed for Desktop use</p>

    <div className="store-links">
      <a className="store-links__link" href="https://itunes.apple.com/us/app/arifzefen/id420206088?mt=8"><i className="icon-ios" /></a>
      <a className="store-links__link" href="https://play.google.com/store/apps/details?id=com.arifsoft.arifzefen"><i className="icon-android" /></a>
    </div>
  </MobileContainer>
);

Mobile.propTypes = {};

Mobile.defaultProps = {};

module.exports = Mobile;
