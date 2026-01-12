import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validUserUsername = 'User';
    const validUserPassword = 'UserPasswort';
    const validModUsername = 'Moderator';
    const validModPassword = 'ModeratorPasswort';

    if (username === validUserUsername && password === validUserPassword) {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('role', 'user');
      history.push('/dashboard'); // Weiterleitung zur Dashboard-Seite
    } else if (username === validModUsername && password === validModPassword) {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('role', 'moderator');
      history.push('/dashboard'); // Weiterleitung zur Dashboard-Seite
    } else {
      alert('Ungültiger Benutzername oder Passwort!');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <IonItem>
            <IonLabel position="floating">Benutzername</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Passwort</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
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
