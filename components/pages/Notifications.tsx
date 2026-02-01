import { useEffect, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
} from '@ionic/react';
import Store from '../../store';
import { close } from 'ionicons/icons';
import { Notification } from '@/lib/models/notification';
import { useAuth } from '@/lib/auth/auth-context';

const NotificationItem = ({
  notification,
  index,
  handleDeleteClick,
}: {
  notification: Notification;
  index: number;
  handleDeleteClick: (notification: Notification, index: number) => void;
}) => (
  <IonItem>
    <IonLabel>{notification.title}</IonLabel>
    <IonNote slot="end">
      {new Date(notification.when).toLocaleString('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })}
    </IonNote>
    <IonButton
      slot="end"
      fill="clear"
      color="dark"
      onClick={() => handleDeleteClick(notification, index)}
    >
      <IonIcon icon={close} />
    </IonButton>
  </IonItem>
);

const Notifications = ({
  open,
  onDidDismiss,
}: {
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const { sessionReady, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!sessionReady || !user) return;

    // Initiale Notifications laden
    setNotifications([...user.notifications]);

    // Listener abonnieren
    const addNotificationListener = (notification: Notification) => {
      setNotifications(prev => [...prev, notification]);
    };
    user.onNotificationAdded(addNotificationListener);

    // Cleanup beim Unmount
    return () => { user.offNotificationAdded(addNotificationListener); };
  }, [sessionReady, user]);

  const handleDeleteClick = (notification: Notification, index: number) => {
    user?.deleteNotification(notification, index).then(success => {
      if (success) {
        setNotifications(prev => prev.filter((_, i) => i !== index));
      }
    });
  };

  return (
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader className="glass-page-header">
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="dark"
            onClick={onDidDismiss}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="glass-page-header">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {notifications.map((notification, i) => (
            <NotificationItem
              notification={notification}
              index={i}
              key={i}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default Notifications;
