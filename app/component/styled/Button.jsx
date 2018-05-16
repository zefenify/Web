import styled from 'react-emotion';

const Button = styled.button`
  background-color: ${props => props.backgroundColor || props.theme.primary};
  border-radius: 2em;
  border: ${props => props.border ? `1px solid ${props.theme.text}` : 'none'};
  padding: ${props => props.padding || '0.75em 2em'};
  color: ${props => props.themeColor ? props.theme.text : 'hsl(0, 0%, 100%)'};
  transition: transform 250ms;
  will-change: transform;

  &:hover {
    transform: scale3d(1.05, 1.05, 1);
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

Button.ClearButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: transparent;
  text-align: left;
  color: inherit;
  border: none;
  border-radius: 0;
`;

module.exports = Button;
