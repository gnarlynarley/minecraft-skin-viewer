import React from 'react';
import localforage from 'localforage';

const promisesMap = new Map<string, Promise<unknown>>();
const db = localforage.createInstance({ driver: localforage.INDEXEDDB });

export default function usePersistedState<T>(key: string) {
  let promise = promisesMap.get(key);
  if (promise === undefined) {
    promise = db.getItem(key);
    promisesMap.set(key, promise);
  }
  const initialPersistedValue = React.use(promise);
  const [value, setValue] = React.useState<T | null>(
    initialPersistedValue as T | null
  );

  React.useEffect(() => {
    db.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
