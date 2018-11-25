import React from 'react';
import { element } from 'prop-types';
import styled from 'react-emotion';


// this component prevents empty box while image is loading
//
// PS:
// all images on Zefenify are square
const ImageContainer = styled.div`
  position: relative;
  border: 1px solid ${props => props.border || props.theme.NATURAL_7};
  border-radius: ${props => props.borderRadius || '6px'};

  .ImageContainer__image-container {
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
      box-shadow: 0 2px 6px ${props => props.theme.SHADOW};
    }
  }
`;

const Container = (props) => {
  const { children, ...otherProps } = props;

  return (
    <ImageContainer {...otherProps}>
      <div className="ImageContainer__image-container">
        { children }
      </div>
    </ImageContainer>
  );
};

Container.propTypes = {
  children: element,
};

Container.defaultProps = {
  children: null,
};


export default Container;
