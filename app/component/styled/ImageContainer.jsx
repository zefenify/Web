import React from 'react';
import { element } from 'prop-types';
import styled from 'react-emotion';

// this component prevents empty box while image is loading
//
// PS:
// all images on Zefenify are square
const ImageContainer = styled.div`
  position: relative;
  border: 1px solid ${props => props.border || props.theme.divider};
  border-radius: ${props => props.borderRadius || '6px'};

  .container {
    position: relative;
    height: 0;
    padding-bottom: 100%;

    img {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${props => props.borderRadius || '6px'};
    }
  }
`;

const Container = props => (
  <ImageContainer {...props}>
    <div className="container">
      { props.children }
    </div>
  </ImageContainer>
);

Container.propTypes = {
  children: element,
};

Container.defaultProps = {
  children: null,
};

module.exports = Container;
