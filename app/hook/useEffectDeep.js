import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';


// const useEffectDeep = (callback, input) => {
//   const previousInputRef = useRef(null);
//   const cleanupRef = useRef();
//   const inputAreEqual = isEqual(previousInputRef.current, input);

//   useEffect(() => {
//     // ANC:
//     // this seems to be blocking initial render calls...any change on `inputsAreEqual`
//     // should be calling `callback()` right?
//     if (inputAreEqual === false) {
//       cleanupRef.current = callback(); // assigning callback's return i.e. the cleanup function
//     }

//     return cleanupRef.current;
//   }, [inputAreEqual]);

//   useEffect(() => {
//     previousInputRef.current = input;
//   });
// };


const useEffectDeep = (callback, input) => {
  const previousInputRef = useRef(null);
  const inputAreEqual = isEqual(previousInputRef.current, input);

  useEffect(() => callback(), [inputAreEqual]);

  useEffect(() => {
    previousInputRef.current = input;
  });
};


export default useEffectDeep;
