import type { Track } from './track';

export type RadioStation = {
  id: string;
  name: string;
  description: string;
  frequency?: string;
  logo?: string;
  genre: string;
  streamUrl?: string;
  currentTrack?: Track;
};
