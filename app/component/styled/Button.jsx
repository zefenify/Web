import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.theme.primary};
  border-radius: 2em;
  border: none;
  padding: 0.75em 2em;
  color: #fff;

  &:hover {
    transform: scale(1.05);
  }
`;

module.exports = Button;
