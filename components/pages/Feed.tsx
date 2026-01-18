import Image from 'next/image';
import Card from '../ui/Card';
import NowPlaying from '../ui/NowPlaying';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import Notifications from './Notifications';
import { useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { selectHomeItems, selectCurrentTrack } from '../../store/selectors';
import Store from '../../store';
import SongRequest from './SongRequest';

type FeedCardProps = {
  title: string;
  type: string;
  text: string;
  author: string;
  authorAvatar: string;
  image: string;
};

const FeedCard = ({
  title,
  type,
  text,
  author,
  authorAvatar,
  image,
}: FeedCardProps) => (
  <Card className="my-4 mx-auto">
    <div className="h-32 w-full relative">
      <Image
        className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
        src={image}
        alt=""
        fill
      />
    </div>
    <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
      <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">
        {type}
      </h4>
      <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">
        {text}
      </p>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 relative">
          <Image
            src={authorAvatar}
            className="rounded-full object-cover min-w-full min-h-full max-w-full max-h-full"
            alt=""
            fill
          />
        </div>
        <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">
          {author}
        </h3>
      </div>
    </div>
  </Card>
);

const Feed = () => {
  const homeItems = Store.useState(selectHomeItems);
  const currentTrack = Store.useState(selectCurrentTrack);
  const [showNotifications, setShowNotifications] = useState(false);
  const [songRequestOpen, setSongRequestOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feed</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
             <IonButton onClick={() => setSongRequestOpen(true)}>
                Song wünschen
             </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <NowPlaying track={currentTrack} />
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        <SongRequest open={songRequestOpen} onClose={() => setSongRequestOpen(false)}/>
        {homeItems.map((i, index) => (
          <FeedCard {...i} key={index} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
