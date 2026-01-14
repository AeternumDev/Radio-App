import { getDB } from './db';
import  { type User, UserRole } from '@/lib/models/user';

export class UserRepository {
  private static stubUsers: User[] = [
    {
      id: '1',
      username: 'User',
      password: 'UserPasswort',
      role: UserRole.User,
      name: 'Alice',
      reviews: [],
    },
    {
      id: '2',
      username: 'Moderator',
      password: 'ModeratorPasswort',
      role: UserRole.Moderator,
      name: 'Bob',
      reviews: [],
    },
  ];

  static async initStubData() {
    const db = await getDB();
      const count = db.objectStoreNames.contains('users') ? await db.count('users') : 0;
      if (count === 0) {
        for (const user of UserRepository.stubUsers) {
          await db.put('users', user);
        }
      }
  }

  static async loadAll(): Promise<User[]> {
    const db = await getDB();
    return db.objectStoreNames.contains('users') ? await db.getAll('users') : [];
  }

  static async load(id: string): Promise<User | undefined> {
    const db = await getDB();
    return await db.get('users', id);
  }

  static async save(user: User): Promise<void> {
    const db = await getDB();
    await db.put('users', user);
  }

  async delete(user: User): Promise<void> {
    const db = await getDB();
    await db.delete('users', user.id);
  }
}
