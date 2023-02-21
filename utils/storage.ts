import { useCallback, useEffect, useMemo, useState } from "react";

export const lsTest = () => {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const replacer = (key: any, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...originalObject]
    };
  } else {
    return value;
  }
};

const reviver = (key: any, value: any) => {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
};


const getStorage = (storageType: 'localStorage' | 'sessionStorage') => {
  let storage;

  if (typeof window !== "undefined") {
    switch (storageType) {
      case "localStorage":
        return window.localStorage;
      case "sessionStorage":
        return window.sessionStorage;
    }
  }

  return storage;
};

const saveInStorage = (storageType: 'localStorage' | 'sessionStorage', storageKey: string, data: any) => {
  const storage = getStorage(storageType);

  try {
    if (storage) {
      if (data != null && data !== undefined) {
        storage.setItem(storageKey, JSON.stringify(data, replacer));
      } else {
        storage.removeItem(storageKey);
      }
    }
  } catch (e) {
    // TODO: showError toast
    console.log("ERROR", "Could not access browser local/session storage");
  }
};

const loadFromStorage = (storageType: 'localStorage' | 'sessionStorage', localStorageKey: string) => {
  const storage = getStorage(storageType);

  try {
    if (storage) {
      const dataStr = storage.getItem(localStorageKey);
      return dataStr ? JSON.parse(dataStr, reviver) : undefined;
    }
  } catch (e) {
    // TODO: showError toast
    console.log("ERROR", "Could not access browser local/session storage");
  }

  return undefined;
};

export const saveInLocalStorage = (storageKey:string, data: any) =>
  saveInStorage("localStorage", storageKey, data);

export const loadFromLocalStorage = (storageKey: string) =>
  loadFromStorage("localStorage", storageKey) || undefined;

export const saveInSessionStorage = (storageKey: string, data: any) =>
  saveInStorage("sessionStorage", storageKey, data);

export const loadFromSessionStorage = (storageKey: string) =>
  loadFromStorage("sessionStorage", storageKey) || undefined;

// Hooks

const useStorage = (storageType: 'localStorage' | 'sessionStorage', storageKey: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return loadFromStorage(storageType, storageKey) || initialValue;
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: any) => {
      try {
        setStoredValue(value);
        saveInStorage(storageType, storageKey, value);
      } catch (e) {
        console.error(e);
      }
    },
    [storageKey, storageType]
  );

  // Listen to changes in local storage in order to adapt to actions from other browser tabs
  useEffect(() => {
    const handleChange = () => {
      setStoredValue(loadFromStorage(storageType, storageKey) || initialValue);
    };

    window.addEventListener("storage", handleChange, false);
    return () => {
      window.removeEventListener("storage", handleChange);
    };
  }, [initialValue, storageKey, storageType]);

  const value = useMemo(() => [storedValue, setValue], [storedValue, setValue]);

  return value;
};

export const useLocalStorage = (storageKey: string, initialValue?: any) =>
  useStorage("localStorage", storageKey, initialValue);

export const useSessionStorage = (storageKey: string, initialValue?: any) =>
  useStorage("sessionStorage", storageKey, initialValue);