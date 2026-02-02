'use client';

import { useState } from 'react';
import { IonButton, IonButtons, useIonRouter } from '@ionic/react';
import { useNotificationCount } from '@/lib/hooks/use-notification-count';
import Notifications from '@/components/pages/Notifications';
import NotificationButton from '@/components/ui/NotificationButton';
import ReviewButton from '@/components/ui/ReviewButton';
import { useAuth } from '@/lib/auth/auth-context';
import SongRequest from '@/components/pages/SongRequest';

const HeaderActions = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [songRequestOpen, setSongRequestOpen] = useState(false);
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
        <IonButton onClick={() => setSongRequestOpen(true)}>
          Song wünschen
        </IonButton>
        <NotificationButton
          count={notificationCount}
          onClick={() => setShowNotifications(true)}
        />
      </IonButtons>
      <Notifications
        open={showNotifications}
        onDidDismiss={() => setShowNotifications(false)}
      />
      <SongRequest open={songRequestOpen} onClose={() => setSongRequestOpen(false)}/>
    </>
  );
};

export default HeaderActions;
