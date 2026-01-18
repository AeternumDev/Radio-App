import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { 
  homeOutline, 
  radioOutline, 
  settingsOutline, 
  gridOutline, 
  logInOutline, 
  logOutOutline,
  musicalNotesOutline 
} from 'ionicons/icons';

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
      <IonTabBar slot="bottom" className="glass-tab-bar">
        <IonTabButton tab="tab1" href="/feed" className="glass-tab-button">
          <IonIcon icon={homeOutline} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/lists" className="glass-tab-button">
          <IonIcon icon={radioOutline} />
          <IonLabel>Radio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/playlist" className="glass-tab-button">
          <IonIcon icon={musicalNotesOutline} />
          <IonLabel>Playlists</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/dashboard" className="glass-tab-button">
          <IonIcon icon={gridOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" href="/settings" className="glass-tab-button">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab6" onClick={handleLoginLogout} className="glass-tab-button">
          <IonIcon icon={isLoggedIn === 'true' ? logOutOutline : logInOutline} />
          <IonLabel>{isLoggedIn === 'true' ? 'Logout' : 'Login'}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;

