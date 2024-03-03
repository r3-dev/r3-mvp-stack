import { PropsWithChildren, createContext } from 'react';
import { TypedPocketBase } from '../types/pocketbase-types';

export const PocketBaseContext = createContext<TypedPocketBase | null>(null);

export const PocketBaseProvider: React.FC<PropsWithChildren<{pb: TypedPocketBase}>> =({ pb, children }) => {
  return (
    <PocketBaseContext.Provider value={pb}>
      {children}
    </PocketBaseContext.Provider>
  );
};