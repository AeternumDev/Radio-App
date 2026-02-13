import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react';
import { useState } from 'react';

// Prop für die SongRequest Activity
type Props = {
  open: boolean;
  onClose: () => void;
};

const SongRequest = ({ open, onClose }: Props) => {
  const [song, setSong] = useState('');

  // Stub zum senden des Songwunsches
  const submit = () => {
    console.log("Songwunsch:", song);
    alert(`Songwunsch gesendet: ${song}`);
    setSong('');
    onClose();
  };

  return (
    <IonModal isOpen={open} onDidDismiss={onClose}>
      <IonHeader className="glass-page-header">
        <IonToolbar>
          <IonTitle>Song wünschen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>Gib den Songtitel ein, den du dir wünschst:</IonText>
        <IonInput
          placeholder="Songtitel eingeben"
          value={song}
          onIonChange={(e) => setSong(e.detail.value!)}
        />

        <IonButton expand="block" onClick={submit} className="mt-4">
          Wunsch absenden
        </IonButton>

        <IonButton expand="block" fill="clear" onClick={onClose} className="mt-2">
          Abbrechen
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default SongRequest;
