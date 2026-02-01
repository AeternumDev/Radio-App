import { IonBadge, IonButton, IonIcon } from '@ionic/react';
import { notificationsCircleSharp } from 'ionicons/icons';

type NotificationButtonProps = {
  count: number;
  onClick: () => void;
};

const NotificationButton = ({ count, onClick }: NotificationButtonProps) => {
  return (
    <IonButton className='mx-2' slot='icon-only' onClick={onClick}>
      <span className="relative inline-flex">
        <IonIcon icon={notificationsCircleSharp} className="text-3xl" />
        {count > 0 && (
          <IonBadge
            color="danger"
            className="absolute -top-0.5 -right-2 rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[12px] leading-none p-0"
          >
            {count}
          </IonBadge>
        )}
      </span>
    </IonButton>
  );
};

export default NotificationButton;
