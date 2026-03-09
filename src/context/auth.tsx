import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { useAuth } from '@/hooks/useLocalStorage';

interface AuthContextType {
  account: User;
  setAccount: (account: User) => void;
  signOut: boolean;
  setSignOut: (signOut: boolean) => void;
  handleSignOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { account, setAccount, signOut, setSignOut } = useAuth();

  const handleSignOut = () => {
    setSignOut(true);
    setAccount({});
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        setAccount,
        signOut,
        setSignOut,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
