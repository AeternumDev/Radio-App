import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import { useState } from 'react';

// Song Type mit Eigenschaften
type Song = {
  title: string;
  length: string;
};

// Playlist Type mit Eigenschaften
type PlaylistType = {
  id: number;
  name: string;
  songs: Song[];
};

// Properties für die Overview
type PlaylistOverviewProps = {
  playlist: PlaylistType;
  currentRating: number | null; // Das aktuelle Rating wird "verzögert" reingeladen.
  onSubmitRating: (rating: number) => void; // Rating wird per Stub gesendet.
  onBack: () => void;
};

// Die Activity für die Playlist Übersicht einer Playlist
const PlaylistOverview = ({
  playlist,
  currentRating,
  onSubmitRating,
  onBack,
}: PlaylistOverviewProps) => {
  const [rating, setRating] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{playlist.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

       { /* Song-Übersicht der Playlist */ }
      <IonContent className="ion-padding">
        {playlist.songs.map((s, index) => (
          <IonCard key={index}>
            <IonCardContent>
              {s.title} ({s.length})
            </IonCardContent>
          </IonCard>
        ))}

         { /* Aktuelles "geladenes" Rating der Playlist */ }
        {currentRating !== null && (
          <p className="text-center">
            Aktuelle Bewertung: {currentRating.toFixed(1)} ★
          </p>
        )}

        <h3 className="text-center mt-4">Playlist bewerten</h3>

        { /* Bewertungsfeld für die Playlist */ }
        <div className="flex justify-center space-x-2 my-3">
          {[1, 2, 3, 4, 5].map(n => (
            <IonButton
              key={n}
              fill={rating >= n ? 'solid' : 'outline'}
              onClick={() => setRating(n)}
            >
              ★
            </IonButton>
          ))}
        </div>

        { /* Sendet die Bewertung über den Stub */ }
        <IonButton expand="block" onClick={() => onSubmitRating(rating)}>
          Bewertung absenden
        </IonButton>

        { /* Zurück zur Playlists */ }
        <IonButton expand="block" fill="clear" onClick={onBack}>
          Zurück
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistOverview;
