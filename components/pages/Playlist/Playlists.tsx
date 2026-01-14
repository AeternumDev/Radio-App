import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import PlaylistOverview from './PlaylistOverview';

// Type für die Übersicht der Playlist im Playlists Activity
type PlaylistType = {
  id: number;
  name: string;
  songs: { title: string; length: string }[];
  creator: string;
};

// Test Daten
const playlists: PlaylistType[] = [
  {
    id: 1,
    name: 'Morning Show',
    songs: [
      { title: 'Coldplay – Viva La Vida', length: '3:50' },
      { title: 'Adele – Hello', length: '4:55' },
    ],
    creator: 'Radio Team',
  },
  {
    id: 2,
    name: 'Top 40',
    songs: [
      { title: 'Ed Sheeran – Shape of You', length: '3:53' },
      { title: 'Dua Lipa – Levitating', length: '3:23' },
      { title: 'The Weeknd – Blinding Lights', length: '3:22' },
    ],
    creator: 'DJ Max',
  },
  {
    id: 3,
    name: 'Rock Classics',
    songs: [
      { title: 'Queen – Bohemian Rhapsody', length: '5:55' },
      { title: 'AC/DC – Thunderstruck', length: '4:52' },
    ],
    creator: 'DJ Rock',
  },
];


const Playlists = () => {
  const [selected, setSelected] = useState<PlaylistType | null>(null);
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  // Stub: Bewertung laden
  const loadPlaylistRating = (playlistId: number): Promise<number> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const ratings: Record<number, number> = {
          1: 4.2,
          2: 3.7,
          3: 4.8,
        };
        resolve(ratings[playlistId] ?? 0);
      }, 500);
    });
  };

  // Stub: Bewertung speichern
  const sendPlaylistRating = (playlistId: number, rating: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Playlist ${playlistId} bewertet mit ${rating} Sternen`);
        resolve();
      }, 500);
    });
  };

  // Verzögert das Laden, damit wie geladen aussieht.
  useEffect(() => {
    if (selected) {
      loadPlaylistRating(selected.id).then(setCurrentRating);
    }
  }, [selected]);

 // Wenn eine Playlist ausgewählt wird, dann wird die PlaylistOverview davon geladen mit den Methoden.
  if (selected) {
    return (
      <PlaylistOverview
        playlist={selected} // selektierte Playlist
        currentRating={currentRating} // "Aktuelle" Bewertung
        onSubmitRating={async rating => { // Bewertung welche "gesendet" wird
          await sendPlaylistRating(selected.id, rating);
          alert(`${selected.name} bewertet mit ${rating} Sternen`);
          setSelected(null);
          setCurrentRating(null);
        }}
        onBack={() => { // zurück auf die Übersicht
          setSelected(null);
          setCurrentRating(null);
        }}
      />
    );
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Playlists</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {playlists.map(p => (
          <IonCard key={p.id} button onClick={() => setSelected(p)}>
            <IonCardContent>
              <h2>{p.name}</h2>
              <p>Anzahl Titel: {p.songs.length}</p>
              <p>Ersteller: {p.creator}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Playlists;
