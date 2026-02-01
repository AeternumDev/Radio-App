'use client';

import { useState } from 'react';
import { IonButtons, useIonRouter } from '@ionic/react';
import { useNotificationCount } from '@/lib/hooks/use-notification-count';
import Notifications from '@/components/pages/Notifications';
import NotificationButton from '@/components/ui/NotificationButton';
import ReviewButton from '@/components/ui/ReviewButton';
import { useAuth } from '@/lib/auth/auth-context';

const HeaderActions = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationCount = useNotificationCount();
  const router = useIonRouter();
  const { isModerator } = useAuth();

  return (
    <>
      <IonButtons slot="end">
        {isModerator && (
          <ReviewButton
            className="text-center"
            onClick={() => router.push('/reviews')}
          />
        )}
        <NotificationButton
          count={notificationCount}
          onClick={() => setShowNotifications(true)}
        />
      </IonButtons>
      <Notifications
        open={showNotifications}
        onDidDismiss={() => setShowNotifications(false)}
      />
    </>
  );
};

export default HeaderActions;
