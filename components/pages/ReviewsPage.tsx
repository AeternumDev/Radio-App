import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-context';
import ReviewsPanel from '@/components/ui/ReviewsPanel';
import HeaderActions from '@/components/ui/HeaderActions';

const ReviewsPage: React.FC = () => {
  const history = useHistory();
  const { sessionReady, isLoggedIn } = useAuth();

  useEffect(() => {
    if (sessionReady && !isLoggedIn) {
      history.push('/login'); // Weiterleitung zur Login-Seite
    }
  }, [history, sessionReady, isLoggedIn]);

  return (
    <IonPage>
      <IonHeader className="glass-page-header">
        <IonToolbar>
          <IonTitle>Bewertungen</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <HeaderActions />
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
      </IonContent>
    </IonPage>
  );
};

export default ReviewsPage;
