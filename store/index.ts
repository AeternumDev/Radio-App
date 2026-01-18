import { Store as PullStateStore } from 'pullstate';

import { lists, homeItems, notifications, settings, currentTrack, radioStations, TodoListItem, HomeItem, NotificationItem, Settings } from '../mock';
import type { Track, RadioStation } from '../lib/models';

type StoreProps = {
  safeAreaTop: number;
  safeAreaBottom: number;
  menuOpen: boolean;
  notificationsOpen: boolean;
  currentPage: number | null;
  homeItems: HomeItem[];
  lists: TodoListItem[];
  notifications: NotificationItem[];
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
  notifications,
  settings,
  selectedList: undefined,
  currentTrack,
  radioStations,
  selectedStation: null,
  playingStation: null,
  isPlaying: false,
});

export default Store;
