import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonButton,
  IonListHeader,
  IonLabel,
  useIonRouter,
  IonIcon,
} from '@ionic/react';
import HeaderActions from '@/components/ui/HeaderActions';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';
import { useAuth } from '@/lib/auth/auth-context';
import { personCircleOutline } from 'ionicons/icons';

const Settings = () => {
  const settings = Store.useState(selectors.selectSettings);
  const router = useIonRouter();
  const { sessionReady, isLoggedIn, isModerator, user, logout } = useAuth();

  return (
    <IonPage>
      <IonHeader className="glass-page-header">
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonListHeader>Account</IonListHeader>
          <IonItem lines="none" >
            <IonButton
              className="w-full text-base py-2 text-white rounded"
              onClick={isLoggedIn ? logout : () => router.push('/login')}
            >
              <IonIcon className="m-2" icon={personCircleOutline} />
              <IonLabel className="p-1">{isLoggedIn ? 'Abmelden' : 'Anmelden'}</IonLabel>
            </IonButton>
          </IonItem>
        </IonList>
        <IonList inset>
          <IonListHeader>Allgemein</IonListHeader>
          <IonItem>
            <IonLabel>Benachrichtigungen</IonLabel>
            <IonToggle
              slot="end"
              checked={settings.enableNotifications}
              onIonChange={e => {
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                });
              }}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
