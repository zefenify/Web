import { Link, NavLink } from 'react-router-dom';
import styled from 'react-emotion';

const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.navLink__color};
  padding: 0.5em 0.64rem;
  margin: 0.25em 0;
  font-weight: bold;
  text-decoration: none;
  border-left: 6px solid transparent;
  cursor: default;

  &:hover {
    color: ${props => props.theme.navLink__color_hover};
  }

  &.active {
    color: ${props => props.theme.navLinkActive__color};
    border-left: 6px solid ${props => props.theme.primary};
    background-color: ${props => props.theme.navLinkActive__backgroundColor};
  }
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
`;

module.exports = {
  NavLinkStyled,
  LinkStyled,
};
