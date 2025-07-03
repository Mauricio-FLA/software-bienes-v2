import { useEffect, useRef } from 'react';


export function useTimeout(callback, delay = 0, deps = []) {
  const savedCallback = useRef();
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || typeof savedCallback.current !== 'function') {
      return;
    }
    const timer = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, ...deps]);
}


export function useMultiTimeout(tasks) {
  tasks.forEach(({ fn, delay, deps }) => {
    useTimeout(fn, delay, deps);
  });
}


export function useDebounce(callback, wait, value) {
  const handler = useRef();

  useEffect(() => {
    clearTimeout(handler.current);
    handler.current = setTimeout(() => {
      callback();
    }, wait);
    return () => clearTimeout(handler.current);
  }, [value, wait]);
}