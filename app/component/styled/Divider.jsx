import styled from 'react-emotion';

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid ${props => props.theme.listDivider};
  border-bottom: transparent;
`;

module.exports = Divider;
