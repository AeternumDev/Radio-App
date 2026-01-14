import type { DBSchema } from 'idb';
import type { User } from '@/lib/models/user';

export interface AppDB extends DBSchema {
  users: {
    key: User['id'];
    value: User;
  };
  // Weitere Stores können hier ergänzt werden
}
