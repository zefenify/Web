import styled from 'react-emotion';

// this component prevents empty box while image is loading
//
// PS:
// all images on Zefenify are square
const ImageContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: 100%;
  border-radius: 6px;
  border: 1px solid ${props => props.border ? props.border : props.theme.listDivider};

  img {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
`;

module.exports = ImageContainer;
