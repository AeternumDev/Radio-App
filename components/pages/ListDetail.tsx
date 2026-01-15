import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { radioOutline, musicalNotesOutline } from 'ionicons/icons';
import { useEffect } from 'react';

import Store from '../../store';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';
import NowPlaying from '../ui/NowPlaying';

type StationDetailParams = {
  listId: string;
};

const StationDetail = () => {
  const stations = Store.useState(selectors.selectRadioStations);
  const currentTrack = Store.useState(selectors.selectCurrentTrack);
  const params = useParams<StationDetailParams>();
  const history = useHistory();
  const { listId } = params;
  const station = stations.find(s => s.id === listId);

  useEffect(() => {
    if (station) {
      // Setze die ausgewählte Station im Store
      actions.setSelectedStation(station);
    }
    
    return () => {
      // Cleanup beim Verlassen der Seite
      actions.setSelectedStation(null);
    };
  }, [station]);

  if (!station) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/lists" />
            </IonButtons>
            <IonTitle>Station nicht gefunden</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">
            <p>Die gesuchte Station wurde nicht gefunden.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lists" />
          </IonButtons>
          <IonTitle>{station.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Station Info Card */}
        <IonCard>
          <IonCardHeader>
            <div className="flex items-center justify-between">
              <IonCardTitle>{station.name}</IonCardTitle>
              <IonIcon icon={radioOutline} className="text-3xl text-primary" />
            </div>
          </IonCardHeader>
          <IonCardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {station.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <IonChip color="primary">
                <IonLabel>{station.frequency}</IonLabel>
              </IonChip>
              <IonChip color="secondary">
                <IonIcon icon={musicalNotesOutline} />
                <IonLabel>{station.genre}</IonLabel>
              </IonChip>
            </div>
            {station.streamUrl && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Stream: {station.streamUrl}
              </p>
            )}
          </IonCardContent>
        </IonCard>

        {/* Now Playing Section */}
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2 px-2">Jetzt läuft</h3>
          <NowPlaying track={currentTrack} />
        </div>

        {/* Info Section */}
        <IonCard className="mt-4">
          <IonCardHeader>
            <IonCardTitle className="text-base">Über diesen Sender</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {station.name} sendet auf {station.frequency} und bietet die beste Auswahl an {station.genre.toLowerCase()}.
              Der Stream ist rund um die Uhr verfügbar und liefert hochwertige Musikunterhaltung.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StationDetail;
