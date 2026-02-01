import Store from '../../store';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';
import type { RadioStation } from '@/lib/models';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import HeaderActions from '@/components/ui/HeaderActions';
import Image from 'next/image';
import { useHistory } from 'react-router-dom';
import { radioOutline, playOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const StationCard = ({ station }: { station: RadioStation }) => {
  const history = useHistory();
  const playingStation = Store.useState(selectors.selectPlayingStation);
  const isPlaying = Store.useState(selectors.selectIsPlaying);
  
  const isThisPlaying = playingStation?.id === station.id && isPlaying;
  
  const handleCardClick = () => {
    // Start playing this station
    actions.playStation(station);
    // Navigate to detail page
    history.push(`/lists/${station.id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisPlaying) {
      actions.pausePlayback();
    } else if (playingStation?.id === station.id) {
      actions.resumePlayback();
    } else {
      actions.playStation(station);
    }
  };
  
  return (
    <div 
      className="glass-station-card" 
      onClick={handleCardClick}
    >
      <div className="glass-station-avatar">
        {station.logo ? (
          <Image
            src={station.logo}
            alt={station.name}
            fill
            className="object-cover"
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <IonIcon icon={radioOutline} style={{ fontSize: '24px', opacity: 0.4 }} />
          </div>
        )}
        {/* Play indicator overlay */}
        {isThisPlaying && (
          <div className="station-playing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <div className="glass-station-info">
        <h3 className="glass-station-name">{station.name}</h3>
        <p className="glass-station-description">{station.description}</p>
        {station.currentTrack && (
          <p className="glass-station-track">
            {station.currentTrack.artist} — {station.currentTrack.title}
          </p>
        )}
      </div>
      <button className="station-quick-play" onClick={handlePlayClick}>
        <IonIcon icon={playOutline} />
      </button>
    </div>
  );
};

const AllStations = () => {
  const stations = Store.useState(selectors.selectRadioStations);

  return (
    <div className="glass-list-container">
      {stations.map((station, i) => (
        <StationCard station={station} key={i} />
      ))}
    </div>
  );
};

const Lists = () => {
  return (
    <IonPage>
      <IonHeader translucent={true} className="glass-page-header">
        <IonToolbar>
          <IonTitle>Radiosender</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense" className="glass-page-header">
          <IonToolbar>
            <IonTitle size="large">Radiosender</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllStations />
      </IonContent>
    </IonPage>
  );
};

export default Lists;
