export { userMocks } from "./users.mock";
export { reviewMocks } from "./reviews.mock";
export { notificationMocks } from "./notifications.mock";
export { settingsMocks } from "./settings.mock";

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

// Currently playing track
import type { Track } from '../lib/models';
import type { RadioStation } from '../lib/models';

export const currentTrack: Track = {
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  coverArt: '/img/c1.avif',
  startTime: new Date(),
  moderatorId: 2,
};

// Mock Radio Stations
export const radioStations: RadioStation[] = [
  {
    id: '01HRSTATION001',
    name: 'Radio Metropolis',
    description: 'Die beste Musik für die Stadt',
    frequency: '98.5 FM',
    logo: '/img/c1.avif',
    genre: 'Pop & Rock',
    streamUrl: 'https://stream.radiometropolis.de/live',
    currentTrack: {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION002',
    name: 'Classic Waves',
    description: 'Zeitlose Klassiker rund um die Uhr',
    frequency: '102.3 FM',
    logo: '/img/c2.avif',
    genre: 'Classic Hits',
    streamUrl: 'https://stream.classicwaves.de/live',
    currentTrack: {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION003',
    name: 'Beat Box Radio',
    description: 'Non-Stop Electronic Beats',
    frequency: '104.7 FM',
    logo: '/img/c3.avif',
    genre: 'Electronic & Dance',
    streamUrl: 'https://stream.beatbox.de/live',
    currentTrack: {
      title: 'One More Time',
      artist: 'Daft Punk',
      album: 'Discovery',
      coverArt: '/img/c3.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION004',
    name: 'Jazz Lounge FM',
    description: 'Smooth Jazz für entspannte Momente',
    frequency: '96.1 FM',
    logo: '/img/c1.avif',
    genre: 'Jazz',
    streamUrl: 'https://stream.jazzlounge.de/live',
    currentTrack: {
      title: 'Take Five',
      artist: 'Dave Brubeck Quartet',
      album: 'Time Out',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION005',
    name: 'Rock Revolution',
    description: 'Harter Rock, 24/7',
    frequency: '107.9 FM',
    logo: '/img/c2.avif',
    genre: 'Rock & Metal',
    streamUrl: 'https://stream.rockrevolution.de/live',
    currentTrack: {
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION006',
    name: 'Chill Vibes Radio',
    description: 'Entspannte Musik zum Chillen',
    frequency: '99.2 FM',
    logo: '/img/c3.avif',
    genre: 'Chillout & Lounge',
    streamUrl: 'https://stream.chillvibes.de/live',
    currentTrack: {
      title: 'Breathe',
      artist: 'Télépopmusik',
      album: 'Genetic World',
      coverArt: '/img/c3.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION007',
    name: 'Country Roads FM',
    description: 'Die besten Country-Hits',
    frequency: '95.4 FM',
    logo: '/img/c1.avif',
    genre: 'Country',
    streamUrl: 'https://stream.countryroads.de/live',
    currentTrack: {
      title: 'Take Me Home, Country Roads',
      artist: 'John Denver',
      album: 'Poems, Prayers & Promises',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION008',
    name: 'Urban Beats',
    description: 'Hip-Hop und R&B Non-Stop',
    frequency: '101.5 FM',
    logo: '/img/c2.avif',
    genre: 'Hip-Hop & R&B',
    streamUrl: 'https://stream.urbanbeats.de/live',
    currentTrack: {
      title: 'Lose Yourself',
      artist: 'Eminem',
      album: '8 Mile Soundtrack',
      coverArt: '/img/c2.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION009',
    name: 'Indie Underground',
    description: 'Alternative und Indie-Musik',
    frequency: '103.8 FM',
    logo: '/img/c3.avif',
    genre: 'Indie & Alternative',
    streamUrl: 'https://stream.indieunderground.de/live',
    currentTrack: {
      title: 'Mr. Brightside',
      artist: 'The Killers',
      album: 'Hot Fuss',
      coverArt: '/img/c3.avif',
      startTime: new Date(),
    },
  },
  {
    id: '01HRSTATION010',
    name: 'Classical Symphony',
    description: 'Die schönsten klassischen Meisterwerke',
    frequency: '94.6 FM',
    logo: '/img/c1.avif',
    genre: 'Classical',
    streamUrl: 'https://stream.classicalsymphony.de/live',
    currentTrack: {
      title: 'Symphony No. 9',
      artist: 'Ludwig van Beethoven',
      album: 'Symphonies',
      coverArt: '/img/c1.avif',
      startTime: new Date(),
    },
  },
];
