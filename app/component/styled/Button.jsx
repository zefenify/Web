import styled from 'react-emotion';

const Button = styled.button`
  background-color: ${props => props.outline ? 'transparent' : props.theme.primary};
  border-radius: 2em;
  border: ${props => props.outline ? `1px solid ${props.theme.listText}` : 'none'};
  padding: ${props => props.noPadding ? '0' : '0.75em 2em'};
  color: ${props => props.outline ? props.theme.listText : '#ffffff'};

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
