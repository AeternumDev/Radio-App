import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';

export const useNotificationCount = () => {
  const { sessionReady, user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!sessionReady || !user) {
      setNotificationCount(0);
      return;
    }

    const updateCount = () => {
      setNotificationCount(user.notifications.length);
    };

    updateCount();
    user.onNotificationAdded(updateCount);
    user.onDeleteNotification(updateCount);

    return () => {
      user.offNotificationAdded(updateCount);
      user.offDeleteNotification(updateCount);
    };
  }, [sessionReady, user]);

  return notificationCount;
};
