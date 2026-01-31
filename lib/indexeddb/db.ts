import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { AppDB } from './schema';
import { User } from '../models/user';

let dbPromise: Promise<IDBPDatabase<AppDB>>;

export function getDB() {
  if (!dbPromise) {
    let nextVersion = 16;
    dbPromise = openDB<AppDB>('app-db', nextVersion, {
      async upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        } else if (oldVersion < nextVersion) {
          const oldStore = transaction.objectStore('users');
          const users: User[] = await oldStore.getAll();
          if (users) {
            db.deleteObjectStore('users');
            const newStore = db.createObjectStore('users', {
              keyPath: 'id',
            });
            for (const user of users) {
              await newStore.add({
                ...user,
                id: Number(user.id),
              });
            }
          }
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export function existsDB(): Promise<boolean> {
  return new Promise(resolve => {
    const req = indexedDB.open('app-db');
    let existed = true;
    req.onupgradeneeded = () => {
      existed = false;
    };
    req.onsuccess = () => resolve(existed);
    req.onerror = () => resolve(false);
  });
}
