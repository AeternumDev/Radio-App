import { IonBadge, IonButton, IonIcon, IonLabel, IonNote } from '@ionic/react';
import { star, starHalf, starOutline } from 'ionicons/icons';

type ReviewButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
};

const ReviewButton = ({ className, style, onClick }: ReviewButtonProps) => {
  return (
    <IonButton onClick={onClick} className={`ion-text-center ${className}`} style={style}>
      <span className="flex flex-col items-center gap-1">
        <span className="relative inline-flex">
          <IonIcon icon={star} style={{ marginRight: 2 }} />
          <IonIcon icon={star} style={{ marginRight: 2 }} />
          <IonIcon icon={star} style={{ marginRight: 2 }} />
          <IonIcon icon={star} style={{ marginRight: 2 }} />
          <IonIcon icon={starOutline} style={{ marginRight: 2 }} />
        </span>
        <IonLabel className="text-[11px] p-1">Bewertungen</IonLabel>
      </span>
    </IonButton>
  );
};

export default ReviewButton;
