import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';


const useEffectDeep = (callback, input) => {
  const previousInputRef = useRef(null);
  const previousEquality = useRef(null);

  const previousAndCurrentInputAreEqual = isEqual(previousInputRef.current, input);
  const useEffectDependency = previousEquality.current === previousAndCurrentInputAreEqual
    ? previousEquality.current
    : previousAndCurrentInputAreEqual;

  useEffect(() => {
    previousEquality.current = previousAndCurrentInputAreEqual;
    return callback();
  }, [useEffectDependency]);

  useEffect(() => {
    previousInputRef.current = input;
  });
};


// const useEffectDeep = (callback, input) => {
//   const previousInputRef = useRef(null);
//   const inputAreEqual = isEqual(previousInputRef.current, input);

//   useEffect(() => callback(), [inputAreEqual]);

//   useEffect(() => {
//     previousInputRef.current = input;
//   });
// };


export default useEffectDeep;
