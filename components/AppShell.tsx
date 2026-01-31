'use client';
import { useEffect, useRef, useState } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import Tabs from './pages/Tabs';
import { UserRepository } from '@/lib/indexeddb/user-repository';
import { radioService } from '@/lib/services/radio-service';
import { radioStations } from '@/mock';
import { AuthService } from '@/lib/auth/auth-service';
import * as actions from '@/store/actions';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { ReviewEntity } from '@/lib/entities/review-entity';
import { useAuth } from '@/lib/auth/auth-context';

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
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    UserRepository.initMockData(); // <- Mock-Daten einmalig laden
    radioService.initialize(radioStations); // <- Initialisiere Radio-Service
    actions.setSettings(); // <- Lade Einstellungen
  }, []);

  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/" render={() => <Tabs />} />
          </IonRouterOutlet>
        </IonReactRouter>{' '}
      </AuthProvider>
    </IonApp>
  );
};

export default AppShell;
