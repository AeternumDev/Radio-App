import Image from 'next/image';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import type { Track } from '@/lib/models';
import ReviewModalButton from '@/components/ui/ReviewModalButton';

type NowPlayingProps = {
  track: Track | null;
};

const NowPlaying = ({ track }: NowPlayingProps) => {
  if (!track) {
    return null;
  }

  return (
    <IonCard className="my-4">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-800 dark:to-pink-800">
        {track.coverArt && (
          <div className="w-20 h-20 relative flex-shrink-0 mr-4">
            <Image
              src={track.coverArt}
              alt={`${track.title} cover art`}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-grow text-white min-w-0">
          <p className="text-xs uppercase font-semibold mb-1 opacity-90">
            Jetzt läuft
          </p>
          <h2 className="font-bold text-xl mb-1 line-clamp-1">
            {track.title}
          </h2>
          <p className="text-sm opacity-90 line-clamp-1">
            {track.artist}
          </p>
          {track.album && (
            <p className="text-xs opacity-75 mt-1 line-clamp-1">
              Album: {track.album}
            </p>
          )}
          <div className="mt-3 flex justify-end w-auto">
              <ReviewModalButton moderatorId={track.moderatorId!} />
          </div>
        </div>
      </div>
    </IonCard>
  );
};

export default NowPlaying;
