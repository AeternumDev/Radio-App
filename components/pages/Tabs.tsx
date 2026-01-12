import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Feed';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';

const Tabs = () => {
  const history = useHistory();
  
  const handleLogout = () => {
    // Logout-Logik
    console.log('Logout');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('role');
    // Weitere Logik, z.B. Weiterleitung zur Login-Seite
    history.push('/dashboard'); // Weiterleitung zur Dashboard-Seite
  };
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route path="/login" render={() => <Login />} exact={true} />
          <Route path="/dashboard" render={() => <Dashboard />} exact={true} />
          <Route path="/feed" render={() => <Home />} exact={true} />
          <Route path="/lists" render={() => <Lists />} exact={true} />
          <Route
            path="/lists/:listId"
            render={() => <ListDetail />}
            exact={true}
          />
          <Route path="/settings" render={() => <Settings />} exact={true} />
          <Route path="" render={() => <Redirect to="/feed" />} exact={true} />
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/feed">
          <IonIcon icon={flash} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/lists">
          <IonIcon icon={list} />
          <IonLabel>Lists</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/dashboard">
          <IonIcon icon={cog} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" href="/login">
          <IonIcon icon={cog} />
          <IonLabel>Login</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" onClick={handleLogout}>
          <IonIcon icon={cog} />
          <IonLabel>Logout</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
