import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserRepository } from '@/lib/indexeddb/user-repository';
import { UserRole, type User } from '@/lib/models/user';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userList = await UserRepository.loadAll();
      const user = userList.find(
        u => u.username === username && u.password === password,
      );
      if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('role', user.role);
        history.push('/dashboard'); // Weiterleitung zur Dashboard-Seite
      } else {
        alert('Ungültiger Benutzername oder Passwort!');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
      alert('Fehler beim Laden der Benutzerdaten');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className='ion-text-center'>Radio-App Login</h1>
        <form onSubmit={handleLogin}>
          <IonItem className="my-1">
            <IonLabel position="floating">Benutzername</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={e => setUsername(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Passwort</IonLabel>
            <IonInput
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
