export type HomeItem = {
  id: number;
  title: string;
  type: string;
  text: string;
  author: string;
  authorAvatar: string;
  image: string;
};

export const homeItems: HomeItem[] = [
  {
    id: 1,
    title: 'Exploring Maui',
    type: 'Blog',
    text: 'We just got back from a trip to Maui, and we had a great time...',
    author: 'Max Lynch',
    authorAvatar: '/img/max.jpg',
    image: '/img/c1.avif',
  },
  {
    id: 2,
    title: 'Arctic Adventures',
    type: 'Blog',
    text: 'Last month we took a trek to the Arctic Circle. The isolation was just what we needed after...',
    author: 'Nathan Chapman',
    authorAvatar: '/img/nathan.jpg',
    image: '/img/c2.avif',
  },
  {
    id: 3,
    title: 'Frolicking in the Faroe Islands',
    type: 'Blog',
    text: 'The Faroe Islands are a North Atlantic archipelago located 320 kilometres (200 mi) north-northwest of Scotland...',
    author: 'Leo Giovanetti',
    authorAvatar: '/img/leo.jpg',
    image: '/img/c3.avif',
  },
];

export type NotificationItem = {
  id: number;
  title: string;
  when: string;
};

export const notifications: NotificationItem[] = [
  { id: 1, title: 'New friend request', when: '6 hr' },
  { id: 2, title: 'Please change your password', when: '1 day' },
  { id: 3, title: 'You have a new message', when: '2 weeks' },
  { id: 4, title: 'Welcome to the app!', when: '1 month' },
];

export type ListItem = {
  name: string;
  done?: boolean;
};

export type TodoListItem = {
  name: string;
  id: string;
  items?: ListItem[];
};

// Some fake lists
export const lists: TodoListItem[] = [
  {
    name: 'Groceries',
    id: '01HRCYTYED31N83MJ0WK97WC02',
    items: [
      { name: 'Apples' },
      { name: 'Bananas' },
      { name: 'Milk' },
      { name: 'Ice Cream' },
    ],
  },
  {
    name: 'Hardware Store',
    id: '01HRCYV2KPNJQJ43Y7X526BHVX',
    items: [
      { name: 'Circular Saw' },
      { name: 'Tack Cloth' },
      { name: 'Drywall' },
      { name: 'Router' },
    ],
  },
  {
    name: 'Work',
    id: '01HRCYV6C3YWAJRF2ZE7AZ17K7',
    items: [{ name: 'TPS Report' }, { name: 'Set up email' }],
  },
  {
    name: 'Reminders',
    id: '01HRCYVADRPCM5SYV5BH98C7HS',
    items: [{ name: 'Get car inspection', done: true }],
  },
];

export type Settings = {
  enableNotifications: boolean;
};

export const settings: Settings = {
  enableNotifications: true,
};

// Currently playing track
import type { Track } from '../lib/models';
import type { RadioStation } from '../lib/models';

export const currentTrack: Track = {
  title: 'Study Sessions',
  artist: 'IU Radio',
  album: 'Focus Beats',
  coverArt: '/img/c1.avif',
  startTime: new Date(),
};

// IU Hochschule Radio Network - Similar to MDR brand structure
export const radioStations: RadioStation[] = [
  {
    id: 'iu-main',
    name: 'IU Radio',
    description: 'Das Hauptprogramm der IU Hochschule',
    frequency: '100.1 FM',
    logo: '/img/c1.avif',
    genre: 'Campus Mix',
    streamUrl: 'https://stream.iu-radio.de/main',
    currentTrack: {
      title: 'Campus Vibes',
      artist: 'Various Artists',
      album: 'IU Playlist 2026',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-study',
    name: 'IU Study',
    description: 'Konzentrierte Musik zum Lernen',
    frequency: '100.2 FM',
    logo: '/img/c2.avif',
    genre: 'Focus & Ambient',
    streamUrl: 'https://stream.iu-radio.de/study',
    currentTrack: {
      title: 'Deep Focus',
      artist: 'Ambient Works',
      album: 'Study Sessions Vol. 3',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-beats',
    name: 'IU Beats',
    description: 'Elektronische Musik und aktuelle Hits',
    frequency: '100.3 FM',
    logo: '/img/c3.avif',
    genre: 'Electronic & Pop',
    streamUrl: 'https://stream.iu-radio.de/beats',
    currentTrack: {
      title: 'Night Drive',
      artist: 'Synthwave Collective',
      album: 'After Hours',
      coverArt: '/img/c3.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-chill',
    name: 'IU Chill',
    description: 'Entspannte Musik für die Pause',
    frequency: '100.4 FM',
    logo: '/img/c1.avif',
    genre: 'Lofi & Chillout',
    streamUrl: 'https://stream.iu-radio.de/chill',
    currentTrack: {
      title: 'Coffee Break',
      artist: 'Lofi Dreams',
      album: 'Rainy Day Vibes',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-talk',
    name: 'IU Talk',
    description: 'Podcasts, Interviews und Diskussionen',
    frequency: '100.5 FM',
    logo: '/img/c2.avif',
    genre: 'Talk & Podcast',
    streamUrl: 'https://stream.iu-radio.de/talk',
    currentTrack: {
      title: 'Campus News',
      artist: 'IU Redaktion',
      album: 'Wochenspiegel',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-klassik',
    name: 'IU Klassik',
    description: 'Klassische Musik für konzentriertes Arbeiten',
    frequency: '100.6 FM',
    logo: '/img/c3.avif',
    genre: 'Klassik',
    streamUrl: 'https://stream.iu-radio.de/klassik',
    currentTrack: {
      title: 'Piano Sonata No. 14',
      artist: 'Ludwig van Beethoven',
      album: 'Moonlight Classics',
      coverArt: '/img/c3.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-international',
    name: 'IU International',
    description: 'Musik aus aller Welt für internationale Studierende',
    frequency: '100.7 FM',
    logo: '/img/c1.avif',
    genre: 'World Music',
    streamUrl: 'https://stream.iu-radio.de/international',
    currentTrack: {
      title: 'Global Grooves',
      artist: 'World Collective',
      album: 'International Beats',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: 'iu-charts',
    name: 'IU Charts',
    description: 'Die aktuellsten Hits und Trends',
    frequency: '100.8 FM',
    logo: '/img/c2.avif',
    genre: 'Top 40 & Charts',
    streamUrl: 'https://stream.iu-radio.de/charts',
    currentTrack: {
      title: 'Trending Now',
      artist: 'Chart Toppers',
      album: 'Hits 2026',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
];
