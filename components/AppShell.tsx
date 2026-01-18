'use client';
import { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import Tabs from './pages/Tabs';
import GlobalNowPlaying from './ui/GlobalNowPlaying';
import { UserRepository } from '@/lib/indexeddb/user-repository';
import { radioService } from '@/lib/services/radio-service';
import { radioStations } from '@/mock';

setupIonicReact({});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async status => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light,
      });
    } catch {}
  });

const AppShell = () => {
  useEffect(() => {
    UserRepository.initStubData(); // <- Stub-Daten einmalig laden
    radioService.initialize(radioStations); // <- Initialisiere Radio-Service
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" render={() => <Tabs />} />
        </IonRouterOutlet>
        <GlobalNowPlaying />
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
