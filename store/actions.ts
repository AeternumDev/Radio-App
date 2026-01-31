import Store from '.';
import { ListItem, Settings, TodoListItem } from '../mock';
import type { RadioStation, Notification } from '../lib/models';
import { SettingsRepository } from '@/lib/indexeddb/settings-repository';

export const setMenuOpen = (open: boolean) => {
  Store.update(s => {
    s.menuOpen = open;
  });
};

export const setNotificationsOpen = (open: boolean) => {
  Store.update(s => {
    s.notificationsOpen = open;
  });
};

export const setSettings = async (settings?: Settings) => {
  if(settings === null || settings === undefined) {
    settings = await SettingsRepository.loadAll();
  } else {
    await SettingsRepository.saveAll(settings);
  }
  Store.update(s => {
    s.settings = settings;
  });
};

export const setSelectedStation = (station: RadioStation | null) => {
  Store.update(s => {
    s.selectedStation = station;
    // Aktualisiere auch den currentTrack mit dem Track der Station
    if (station?.currentTrack) {
      s.currentTrack = station.currentTrack;
    }
  });
};

// App-specific actions

export const setDone = (
  list: TodoListItem,
  listItem: ListItem,
  done: boolean,
) => {
  Store.update((s, o) => {
    const listIndex = o.lists.findIndex(l => l === list);
    if (listIndex === -1) return;

    const items = o.lists[listIndex].items;
    const itemIndex = items?.findIndex(i => i === listItem);
    if (itemIndex === undefined || itemIndex < 0) return;

    const draftItem = s.lists[listIndex].items?.[itemIndex];
    if (!draftItem) return;

    draftItem.done = done;

    if (list === o.selectedList) {
      s.selectedList = s.lists[listIndex];
    }
  });
};

export const addNotification = (notification: Notification) => {
  Store.update(s => {
    s.notifications.push(notification);
  });
};
