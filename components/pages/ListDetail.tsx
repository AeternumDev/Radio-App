import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { 
  radioOutline, 
  playOutline, 
  pauseOutline,
  musicalNotesOutline,
  locationOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import Image from 'next/image';
import ReviewModalButton from '@/components/ui/ReviewModalButton';
import HeaderActions from '@/components/ui/HeaderActions';

import Store from '../../store';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';

type StationDetailParams = {
  listId: string;
};

const StationDetail = () => {
  const stations = Store.useState(selectors.selectRadioStations);
  const currentTrack = Store.useState(selectors.selectCurrentTrack);
  const playingStation = Store.useState(selectors.selectPlayingStation);
  const isPlaying = Store.useState(selectors.selectIsPlaying);
  const params = useParams<StationDetailParams>();
  const { listId } = params;
  const station = stations.find(s => s.id === listId);
  const history = useHistory();

  const isThisStationPlaying = playingStation?.id === station?.id && isPlaying;

  useEffect(() => {
    if (station) {
      actions.setSelectedStation(station);
    }
    
    return () => {
      actions.setSelectedStation(null);
    };
  }, [station]);

  const handlePlayPause = () => {
    if (!station) return;
    
    if (isThisStationPlaying) {
      actions.pausePlayback();
    } else if (playingStation?.id === station.id) {
      actions.resumePlayback();
    } else {
      actions.playStation(station);
    }
  };

  if (!station) {
    return (
      <IonPage>
        <IonHeader className="glass-page-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/lists" />
            </IonButtons>
            <IonTitle>Station nicht gefunden</IonTitle>
            <HeaderActions />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="station-not-found">
            <IonIcon icon={radioOutline} />
            <p>Die gesuchte Station wurde nicht gefunden.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="glass-page-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lists" className="glass-back-btn" />
          </IonButtons>
          <IonTitle>{station.name}</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>
      <IonContent className="station-detail-content">
        {/* Hero Section */}
        <div className="station-hero">
          <div className="station-hero-bg">
            {station.logo && (
              <Image
                src={station.logo}
                alt=""
                fill
                className="object-cover"
              />
            )}
            <div className="station-hero-overlay" />
          </div>
          
          <div className="station-hero-content">
            <div className="station-logo-large">
              {station.logo ? (
                <Image
                  src={station.logo}
                  alt={station.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <IonIcon icon={radioOutline} />
              )}
            </div>
            
            <h1 className="station-title">{station.name}</h1>
            <p className="station-tagline">{station.description}</p>
            
            <div className="station-meta-row">
              <span className="station-meta-item">
                <IonIcon icon={radioOutline} />
                {station.frequency}
              </span>
              <span className="station-meta-item">
                <IonIcon icon={musicalNotesOutline} />
                {station.genre}
              </span>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <div className="station-play-section">
          <button 
            className={`station-play-btn ${isThisStationPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
          >
            <IonIcon icon={isThisStationPlaying ? pauseOutline : playOutline} />
            <span>{isThisStationPlaying ? 'Pause' : 'Abspielen'}</span>
          </button>
        </div>

        {/* Now Playing Card */}
        {currentTrack && (
          <div className="station-now-playing">
            <div className="snp-header">
              <span className="snp-label">Jetzt läuft</span>
              {isThisStationPlaying && (
                <div className="snp-live-indicator">
                  <span className="snp-live-dot" />
                  LIVE
                </div>
              )}
            </div>
            <div className="snp-content flex-wrap">
              <div className="snp-artwork">
                {currentTrack.coverArt ? (
                  <Image
                    src={currentTrack.coverArt}
                    alt="Cover"
                    fill
                    className="object-cover" />
                ) : (
                  <IonIcon icon={musicalNotesOutline} />
                )}
              </div>
              <div className="snp-info">
                <h3 className="snp-title">{currentTrack.title}</h3>
                <p className="snp-artist">{currentTrack.artist}</p>
                {currentTrack.album && (
                  <p className="snp-album">{currentTrack.album}</p>
                )}
              </div>
              <div className="overflow-hidden self-end w-full min-[475px]:w-auto min-[475px]:ml-auto flex min-w-200">
                <ReviewModalButton
                  moderatorId={currentTrack.moderatorId!}
                  style={{ '--color': '#ffffff', '--background': 'rgba(255, 255, 255, 0.1)' } as React.CSSProperties & Record<string, string>}
                />
              </div>
            </div>
          </div>
        )}

        {/* Station Info */}
        <div className="station-info-section">
          <h2 className="station-section-title">Über diesen Sender</h2>
          <div className="station-info-card">
            <p>
              {station.name} sendet auf {station.frequency} und bietet die beste Auswahl an {station.genre.toLowerCase()}.
              Der Stream ist rund um die Uhr verfügbar und liefert hochwertige Musikunterhaltung.
            </p>
            {station.streamUrl && (
              <div className="station-stream-url">
                <span className="stream-label">Stream URL</span>
                <span className="stream-value">{station.streamUrl}</span>
              </div>
            )}
          </div>
        </div>

        {/* Playlist of the Sender */}
        <div className="station-playlists-section">
          <button className="station-playlists-button" onClick={() => history.push('/playlist')}>
            <IonIcon icon={musicalNotesOutline} />
            <span>Unsere Playlists</span>
          </button>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default StationDetail;
