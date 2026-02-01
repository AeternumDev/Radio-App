import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonLoading,
} from '@ionic/react';
import { 
  homeOutline, 
  radioOutline, 
  settingsOutline, 
  gridOutline, 
  logInOutline, 
  logOutOutline,
  musicalNotesOutline,
  cog, flash, radio, personCircleOutline, list, star, starOutline, starHalf
} from 'ionicons/icons';

import Login from './Login';
import ReviewsPage from './ReviewsPage';
import Home from './Feed';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Playlist from './Playlist/Playlists';
import { AuthService } from '@/lib/auth/auth-service';
import { useAuth } from '@/lib/auth/auth-context';

const Tabs = () => {
  const history = useHistory();
  const { sessionReady, isLoggedIn, isModerator, user, login, logout } = useAuth();
  // const isLoggedIn = AuthService.isLoggedIn();
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      console.log('Logout');
      logout();
    }
    history.push('/login'); // Weiterleitung zur Login-Seite
  };

  return (
    <>
      {sessionReady && (
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Route path="/login" render={() => <Login />} exact={true} />
              <Route path="/reviews" render={() => <ReviewsPage />} exact={true} />
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
            <IonTabButton tab="tab5" href="/settings" className="glass-tab-button">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}
    </>
  );
};

export default Tabs;
