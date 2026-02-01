import { Store as PullStateStore } from 'pullstate';

import { lists, homeItems, notificationMocks, settingsMocks, currentTrack, radioStations, TodoListItem, HomeItem } from '@/mock';
import type { Track, RadioStation, Notification, Settings } from '@/lib/models';

type StoreProps = {
  safeAreaTop: number;
  safeAreaBottom: number;
  menuOpen: boolean;
  notificationsOpen: boolean;
  currentPage: number | null;
  homeItems: HomeItem[];
  lists: TodoListItem[];
  notifications: Notification[];
  settings: Settings;
  selectedList: TodoListItem | undefined;
  currentTrack: Track | null;
  radioStations: RadioStation[];
  selectedStation: RadioStation | null;
  playingStation: RadioStation | null;
  isPlaying: boolean;
}

const Store = new PullStateStore<StoreProps>({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  homeItems,
  lists,
  notifications: notificationMocks, // <- [ToDo] In Produktion mocks entfernen
  settings : settingsMocks, // <- [ToDo] In Produktion mocks entfernen
  selectedList: undefined,
  currentTrack,
  radioStations,
  selectedStation: null,
  playingStation: null,
  isPlaying: false,
});

export default Store;
