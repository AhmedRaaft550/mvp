import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounceSearch, setDebounceSearch] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debounceSearch;
};

export default useDebounce;
