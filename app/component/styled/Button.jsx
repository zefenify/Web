import styled from 'emotion/react';
import { withTheme } from 'theming';

const Button = withTheme(styled.button`
  background-color: ${props => props.outline ? 'transparent' : props.theme.primary};
  border-radius: 2em;
  border: ${props => props.outline ? `1px solid ${props.theme.listText}` : 'none'};
  padding: 0.75em 2em;
  color: ${props => props.outline ? props.theme.listText : '#ffffff'};

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`);

module.exports = Button;
