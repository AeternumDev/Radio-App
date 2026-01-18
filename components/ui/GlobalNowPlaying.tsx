import { useHistory, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { pauseOutline, playOutline, radioOutline } from 'ionicons/icons';
import Image from 'next/image';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';

const GlobalNowPlaying = () => {
  const history = useHistory();
  const location = useLocation();
  const playingStation = Store.useState(selectors.selectPlayingStation);
  const isPlaying = Store.useState(selectors.selectIsPlaying);
  const currentTrack = Store.useState(selectors.selectCurrentTrack);

  // Don't show if nothing is playing or on the station detail page
  if (!playingStation) {
    return null;
  }

  const isOnStationPage = location.pathname.startsWith('/lists/');

  const handleBarClick = () => {
    if (!isOnStationPage) {
      history.push(`/lists/${playingStation.id}`);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      actions.pausePlayback();
    } else {
      actions.resumePlayback();
    }
  };

  return (
    <div 
      className={`global-now-playing ${isOnStationPage ? 'on-station-page' : ''}`}
      onClick={handleBarClick}
    >
      <div className="gnp-content">
        <div className="gnp-artwork">
          {currentTrack?.coverArt ? (
            <Image
              src={currentTrack.coverArt}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : playingStation.logo ? (
            <Image
              src={playingStation.logo}
              alt={playingStation.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="gnp-artwork-placeholder">
              <IonIcon icon={radioOutline} />
            </div>
          )}
        </div>
        
        <div className="gnp-info">
          <div className="gnp-track">
            {currentTrack ? (
              <>
                <span className="gnp-title">{currentTrack.title}</span>
                <span className="gnp-separator">—</span>
                <span className="gnp-artist">{currentTrack.artist}</span>
              </>
            ) : (
              <span className="gnp-title">{playingStation.name}</span>
            )}
          </div>
          <div className="gnp-station">{playingStation.name}</div>
        </div>

        {/* Sound wave animation */}
        <div className={`gnp-visualizer ${isPlaying ? 'playing' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <button className="gnp-play-btn" onClick={handlePlayPause}>
          <IonIcon icon={isPlaying ? pauseOutline : playOutline} />
        </button>
      </div>
    </div>
  );
};

export default GlobalNowPlaying;
