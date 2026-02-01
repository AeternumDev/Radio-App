import { AuthService } from '@/lib/auth/auth-service';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonModal,
} from '@ionic/react';
import Notifications from './Notifications';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-context';
import { useNotificationCount } from '@/lib/hooks/use-notification-count';
import { notificationsOutline } from 'ionicons/icons';
import ReviewsPanel from '@/components/ui/ReviewsPanel';
import NotificationButton from '@/components/ui/NotificationButton';

const ReviewsPage: React.FC = () => {
  const history = useHistory();
  const { sessionReady, isLoggedIn } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationCount = useNotificationCount();

  useEffect(() => {
    if (sessionReady && !isLoggedIn) {
      history.push('/login'); // Weiterleitung zur Login-Seite
    }
  }, [history, sessionReady, isLoggedIn]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bewertungen</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <NotificationButton
              count={notificationCount}
              onClick={() => setShowNotifications(true)}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bewertungen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p className='ion-padding-start ion-padding-bottom ion-padding-end'>Unten werden Ihre Bewertungen angezeigt.</p>
        <ReviewsPanel />
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReviewsPage;
