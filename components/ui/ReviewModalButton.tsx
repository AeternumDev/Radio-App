import { useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';
import { star } from 'ionicons/icons';

type ReviewModalButtonProps = {
  moderatorId: number;
  className?: string;
  style?: React.CSSProperties;
};

const ReviewModalButton = ({ moderatorId, className, style }: ReviewModalButtonProps) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { sessionReady, isModerator, user } = useAuth();
  const activeRating = Number.isFinite(rating) ? rating : 0;

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return;
    }
    AuthService.sendReview(moderatorId, rating, comment).then((success) => {
      if (!success) {
        // Fehler beim Senden der Bewertung
        console.error('Failed to submit review');
        return;
      }
      // Review erfolgreich gesendet
      console.log('Review submitted:', {
        moderatorId,
        rating,
        comment,
      });
    });

    setShowReviewModal(false);
    setRating(0);
    setComment('');
  };

  return (
    <>
      <IonButton
        size="small"
        expand="block"
        className={`${className}`}
        style={style}
        onClick={() => setShowReviewModal(true)}
      >
        Moderator Bewerten
      </IonButton>
      <IonModal
        isOpen={showReviewModal}
        onDidDismiss={() => setShowReviewModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Bewertung senden</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowReviewModal(false)}>
                Schließen
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem className='items-center'>
            <IonLabel position="stacked">Bewertung</IonLabel>
            <div className="stars-box flex flex-nowrap gap-1">
              {[1, 2, 3, 4, 5].map(value => (
                <IonButton
                  key={value}
                  fill={value <= activeRating ? 'solid' : 'clear'}
                  onClick={() => handleStarClick(value)}
                >
                  <IonIcon icon={star} slot="icon-only" className="text-[29px]" />
                  <IonBadge className="absolute text-[12px]  translate-y-[1px]" style={{ backgroundColor: 'transparent' }} color={value <= activeRating ? 'dark' : 'primary'}>
                    {value}
                  </IonBadge>
                </IonButton>
              ))}
            </div>
          </IonItem>
          <IonItem className="ion-margin-top">
            <IonLabel position="stacked">Kommentar</IonLabel>
            <IonTextarea
              rows={4}
              value={comment}
              onIonChange={e => setComment(String(e.detail.value ?? ''))}
            />
          </IonItem>
          <div className="ion-margin-top flex justify-end">
            <IonButton onClick={handleSubmit}>Absenden</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ReviewModalButton;
