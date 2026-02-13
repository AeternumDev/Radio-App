import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserRole, type User } from '@/lib/models/user';
import { AuthService } from '@/lib/auth/auth-service';
import { UserEntity } from '@/lib/entities/user-entity';
import { useAuth } from '@/lib/auth/auth-context';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { sessionReady, isLoggedIn, user, login, logout } = useAuth();

  useEffect(() => {
    if (!user) return;
    user.onReviewAdded(review => {
      console.log('Review hinzugefügt:', review);
    });
    history.push('/feed');
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      console.log('Ungültiger Benutzername oder Passwort');
      alert('Ungültiger Benutzername oder Passwort');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className="ion-text-center">Radio-App Anmeldung</h1>
        <form onSubmit={handleLogin}>
          <IonItem className="my-1">
            <IonInput
              label="Benutzername"
              labelPlacement="floating"
              type="text"
              value={username}
              onIonChange={e => setUsername(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Passwort"
              labelPlacement="floating"
              type="password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              required
            />
          </IonItem>
          <IonButton type="submit" expand="block">
            Anmelden
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
