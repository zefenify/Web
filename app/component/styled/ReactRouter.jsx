import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const activeClassName = 'active';

const NavLinkStyled = styled(NavLink).attrs({
  activeClassName,
})`
  color: ${props => props.theme.navbarText};
  padding: 0.5em 1em;
  margin: 0.25em 0;
  font-weight: bold;
  text-decoration: none;
  border-left: 6px solid transparent;

  &:hover {
    color: ${props => props.theme.navbarTextActive};
  }

  &.${activeClassName} {
    color: ${props => props.theme.navbarTextActive};
    border-left: 6px solid ${props => props.theme.primary};
    background-color: ${props => props.theme.listBackgroundHover};
  }
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
`;

module.exports = {
  NavLinkStyled,
  LinkStyled,
};
