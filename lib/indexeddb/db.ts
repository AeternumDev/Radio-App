import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { AppDB } from './schema';

let dbPromise: Promise<IDBPDatabase<AppDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>('app-db', 1, {
      upgrade(db) {
        db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      }
    });
  }
  return dbPromise;
}

export async function existsDB(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = indexedDB.open('app-db');
    let existed = true;
    req.onupgradeneeded = () => {
      existed = false;
    };
    req.onsuccess = () => resolve(existed);
    req.onerror = () => resolve(false);
  });
}