import styled from 'react-emotion';

const Divider = styled.div`
  flex: 0 0 auto;
  display: flex;
  width: 100%;
  align-items: center;
  color: ${props => props.color || props.theme.listDividerText};
  padding: ${props => props.padding || '0'};
  font-size: ${props => props.fontSize || '1em'};

  &:after {
    height: 0;
    content: '';
    flex: 1 1 auto;
    border-top: 1px solid ${props => props.theme.listDivider};
  }
`;

module.exports = Divider;
