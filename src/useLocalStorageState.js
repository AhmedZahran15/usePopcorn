import { useState, useEffect } from "react";

export function useLocalStorageState(key, defaultValue = "") {
  const [state, setState] = useState(function () {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}
