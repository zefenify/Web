import { Link, NavLink } from 'react-router-dom';
import styled from 'react-emotion';


export const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.NATURAL_2};
  padding: 0.5em 0.64rem;
  margin: 0.25em 0;
  font-weight: bold;
  text-decoration: none;
  border-left: 6px solid transparent;
  cursor: default;

  &:hover {
    color: ${props => props.theme.PRIMARY_4};
  }

  &.active {
    color: ${props => props.theme.NATURAL_2};
    border-left: 6px solid ${props => props.theme.PRIMARY_4};
    background-color: ${props => props.theme.NATURAL_6};
  }
`;


export const LinkStyled = styled(Link)`
  text-decoration: none;
`;
