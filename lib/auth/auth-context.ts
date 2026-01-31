import { useContext, createContext } from 'react';
import type { UserEntity } from '@/lib/entities/user-entity';

export interface AuthContextType {
  user: UserEntity | undefined;
  isLoggedIn: boolean;
  isModerator: boolean;
  sessionReady: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Hook für einfacheren Zugriff
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}