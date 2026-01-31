'use client';
import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth/auth-service';
import { UserEntity } from '@/lib/entities/user-entity';
import { Review } from '@/lib/models/review';
import { useAuth } from '@/lib/auth/auth-context';
import { IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
const a = 0;
export default function ReviewsPanel() {
  const { sessionReady, isModerator, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!sessionReady || !isModerator || !user) return;

    // Initiale Reviews laden
    setReviews([...user.reviews]);

    // Listener abonnieren
    const listener = (review: Review) => {
      setReviews(prev => [...prev, review]);
    };
    user.onReviewAdded(listener);

    // Cleanup beim Unmount
    return () => {
      user.offReviewAdded(listener);
    };
  }, [sessionReady, isModerator, user]);

  return (
    <IonList>
      {reviews.length === 0 && (
        <IonItem>
          <IonLabel>Keine Reviews vorhanden</IonLabel>
        </IonItem>
      )}
      {reviews.map((review, i) => (
        <IonItem key={i}>
          <IonLabel>{review.comment}</IonLabel>
          <IonNote slot="end" className="text-xs">
            {new Date(review.when).toLocaleString('de-DE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            <br />
            <div className="ion-padding-end" style={{ marginTop: 2 }}>
              {[1, 2, 3, 4, 5].map(index => (
                <IonIcon
                  key={index}
                  icon={index < review.rating ? star : starOutline}
                  slot="icon-only"
                />
              ))}
            </div>
          </IonNote>
        </IonItem>
      ))}
    </IonList>
  );
}
