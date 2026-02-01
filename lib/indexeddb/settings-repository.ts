import { getDB } from './db';
import type { Settings } from '@/lib/models';

import { settingsMocks } from '@/mock';

type SettingsKey = keyof Settings;
type SettingsValue = Settings[SettingsKey];

export class SettingsRepository {
  static async initMockData() {
    const db = await getDB();
    const count = db.objectStoreNames.contains('settings')
      ? await db.count('settings')
      : 0;
    if (count === 0) {
      for (const [key, value] of Object.entries(settingsMocks) as [
        SettingsKey,
        SettingsValue,
      ][]) {
        await db.put('settings', value, key);
      }
    }
  }

  static async loadAll(): Promise<Settings> {
    const db = await getDB();
    if (!db.objectStoreNames.contains('settings')) {
      return {} as Settings;
    }

    const tx = db.transaction('settings');
    const store = tx.objectStore('settings');
    const keys = await store.getAllKeys();
    const values = await store.getAll();
    await tx.done;

    if (keys.length === 0) {
      return {} as Settings;
    }

    const result = {} as Settings;
    keys.forEach((key, index) => {
      result[key as SettingsKey] = values[index] as SettingsValue;
    });
    return result;
  }

  static async load<K extends SettingsKey>(key: K): Promise<Settings[K] | undefined> {
    const db = await getDB();
    return (await db.get('settings', key)) as Settings[K] | undefined;
  }

  static async save<K extends SettingsKey>(key: K, value: Settings[K]): Promise<void> {
    const db = await getDB();
    await db.put('settings', value, key);
  }

  static async saveAll(settings: Settings): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    for (const [key, value] of Object.entries(settings) as [
      SettingsKey,
      SettingsValue,
    ][]) {
      await store.put(value, key);
    }
    await tx.done;
  }

  static async delete(key: SettingsKey): Promise<void> {
    const db = await getDB();
    await db.delete('settings', key);
  }
}
