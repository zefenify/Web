import styled from 'react-emotion';


const Button = styled.button`
  background-color: ${props => props.theme.PRIMARY_4};
  border-radius: 2rem;
  border: ${props => props.border ? `1px solid ${props.theme.NATURAL_2}` : 'none'};
  padding: 0.75rem 2rem;
  height: 38px;
  color: hsl(0, 0%, 100%);
  transition: transform 250ms;
  will-change: transform;
  box-shadow: 0 2px 6px ${props => props.theme.SHADOW};

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: scale3d(1.05, 1.05, 1);
  }

  &:active:not(:disabled) {
    transform: scale3d(0.95, 0.95, 1);
  }
`;


export const ClearButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: transparent;
  text-align: left;
  color: inherit;
  border: none;
  border-radius: 0;
`;


export default Button;
