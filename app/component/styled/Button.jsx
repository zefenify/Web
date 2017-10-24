import styled from 'react-emotion';

const Button = styled.button`
  background-color: ${props => props.outline ? 'transparent' : props.theme.primary};
  border-radius: 2em;
  border: ${props => props.outline ? `1px solid ${props.theme.listText}` : 'none'};
  padding: ${props => props.noPadding ? '0' : '0.75em 2em'};
  color: ${props => props.outline ? props.theme.listText : '#ffffff'};

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

module.exports = Button;
