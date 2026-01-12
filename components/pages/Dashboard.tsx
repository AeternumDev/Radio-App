// components/pages/Dashboard.tsx
import { IonContent, IonPage } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      history.push('/login'); // Weiterleitung zur Login-Seite
    }
  }, [history]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Dashboard</h1>
        <p>Willkommen im Dashboard!</p>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
