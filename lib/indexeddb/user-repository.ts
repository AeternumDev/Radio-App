import { getDB } from './db';
import type { User } from '@/lib/models';

import { userMocks } from '@/mock';
import { AuthService } from '../auth/auth-service';

export class UserRepository {
  static async initMockData() {
    const db = await getDB();
    const count = db.objectStoreNames.contains('users')
      ? await db.count('users')
      : 0;
    if (count === 0) {
      for (const user of userMocks) {
        await db.put('users', user);
      }
    }
  }

  static async loadAll(): Promise<User[]> {
    const db = await getDB();
    return db.objectStoreNames.contains('users')
      ? await db.getAll('users')
      : [];
  }

  static async load(id: number): Promise<User | undefined> {
    const db = await getDB();
    return await db.get('users', id);
  }

  static async save(user: User): Promise<void> {
    const db = await getDB();
    await db.put('users', user);
  }

  static async delete(id: number): Promise<void> {
    const db = await getDB();
    await db.delete('users', id);
  }
}
