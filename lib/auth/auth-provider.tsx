import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthContext, AuthContextType } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';
import type { User } from '@/lib/models/user';
import type { UserEntity } from '@/lib/entities/user-entity';
import { ReviewEntity } from '@/lib/entities/review-entity';
import { NotificationEntity } from '@/lib/entities/notification-entity';
import * as actions from '@/store/actions';
import { UserRepository } from '../indexeddb/user-repository';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserEntity | undefined>(undefined);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const restore = async () => {
      const restoredUser = await AuthService.restoreSession();
      if (restoredUser) {
        setUser(restoredUser);
      }
      setSessionReady(true);
    };
    restore();
  }, []);

  // Periodisch Benutzerdaten per API-Aufruf vom Radio-Server zu holen (nur wenn SSE deaktiviert ist) (Ist Ausblick)
  useEffect(() => {
    if (!user || !AuthService.API_BASE_URL || AuthService.isSseEnabled())
      return;

    let cancelled = false;

    const refresh = async () => {
      const newUserData = await AuthService.fetchCurrentUserFromServer(user.id);
      // Wenn es neue Daten gibt, aktualisiere die aktuelle Benutzersitzung
      if (!cancelled && newUserData && user.importUserData(newUserData)) {
        setUser(user);
        UserRepository.save(user.toUser());
      }
    };

    refresh();
    const intervalId = setInterval(refresh, 15000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [user?.id]);

  // Push-Updates via SSE (Ansatz, solange Server-Route fehlt deaktiviert)
  // Abonniere Updates vom Radio-Serverfür den Benutzer mit der angegebenen ID (Ist Ausblick)
  useEffect(() => {
    if (!user || !AuthService.API_BASE_URL || !AuthService.isSseEnabled())
      return;

    const unsubscribe = AuthService.subscribeToUserUpdates(
      user.id,
      async newUserData => {
        if (!newUserData) {
          newUserData = await AuthService.fetchCurrentUserFromServer(user.id);
        }
        if (newUserData && user.importUserData(newUserData)) {
          setUser(user);
          UserRepository.save(user.toUser());
        }
        return;
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const user = await AuthService.login(username, password);
    if (!user) return false;
    setUser(user);
    return true;
  };

  const logout = () => {
    AuthService.logout();
    setUser(undefined);
  };

  const contextValue: AuthContextType = {
    user,
    isLoggedIn: user !== undefined,
    isModerator: user?.role === 'moderator',
    sessionReady,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
