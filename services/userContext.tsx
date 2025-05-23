// UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { UserData } from '../components/Interfaces';

// Define the context type
type UserContextType = {
    userData: UserData | null;
    setUserData: (user: UserData | null) => void;
};

// Create the context with default value
export const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {}, // dummy default function
});

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
