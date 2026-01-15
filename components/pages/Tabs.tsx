import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { cog, flash, radio, personCircleOutline } from 'ionicons/icons';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Feed';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Playlist from './Playlist/Playlists';


const Tabs = () => {
  const history = useHistory();
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  const handleLoginLogout = () => {
    if (isLoggedIn === 'true') {
      console.log('Logout');
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('role');
    }
    history.push('/login'); // Weiterleitung zur Login-Seite
  };
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route path="/login" render={() => <Login />} exact={true} />
          <Route path="/dashboard" render={() => <Dashboard />} exact={true} />
          <Route path="/feed" render={() => <Home />} exact={true} />
          <Route path="/lists" render={() => <Lists />} exact={true} />
          <Route path="/playlist" render={() => <Playlist />} exact={true} />
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
          <IonIcon icon={radio} />
          <IonLabel>Radiosender</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/dashboard">
          <IonIcon icon={cog} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" onClick={handleLoginLogout}>
          <IonIcon icon={personCircleOutline} />
          {(isLoggedIn === 'true' && <IonLabel>Logout</IonLabel>) || <IonLabel>Login</IonLabel>}
        </IonTabButton>
        <IonTabButton tab="tab6" href="/playlist">
            <IonIcon icon={list} />
            <IonLabel>Playlists</IonLabel>
            </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
