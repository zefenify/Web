import styled from 'react-emotion';
import { withTheme } from 'theming';

const Divider = withTheme(styled.div`
  width: 100%;
  border-top: 1px solid ${props => props.theme.listDivider};
  border-bottom: transparent;
`);

module.exports = Divider;
