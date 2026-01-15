import Store from '../../store';
import * as selectors from '../../store/selectors';
import type { RadioStation } from '@/lib/models';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonAvatar,
} from '@ionic/react';
import Image from 'next/image';

const StationEntry = ({ station }: { station: RadioStation }) => {
  return (
    <IonItem routerLink={`/lists/${station.id}`} className="station-entry">
      <IonAvatar slot="start">
        {station.logo && (
          <div className="w-full h-full relative">
            <Image
              src={station.logo}
              alt={station.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </IonAvatar>
      <IonLabel>
        <h2 className="font-bold">{station.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {station.description}
        </p>
        {station.currentTrack && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            🎵 {station.currentTrack.artist} - {station.currentTrack.title}
          </p>
        )}
      </IonLabel>
      <IonNote slot="end" className="text-xs">
        {station.frequency}
        <br />
        <span className="text-gray-500">{station.genre}</span>
      </IonNote>
    </IonItem>
  );
};

const AllStations = () => {
  const stations = Store.useState(selectors.selectRadioStations);

  return (
    <>
      {stations.map((station, i) => (
        <StationEntry station={station} key={i} />
      ))}
    </>
  );
};

const Lists = () => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Radiosender</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Radiosender</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <AllStations />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Lists;
