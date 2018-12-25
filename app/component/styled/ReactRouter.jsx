import { Link, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';


export const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.NATURAL_2};
  font-weight: bold;
  text-decoration: none;
  border-left: 6px solid transparent;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0 !important;
  height: 36px;

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
