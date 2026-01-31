import type { DBSchema } from 'idb';
import type { User, Settings } from '@/lib/models';

export interface AppDB extends DBSchema {
  users: {
    key: User['id'];
    value: User;
  };
  settings: {
    key: keyof Settings;
    value: Settings[keyof Settings];
  };
  // Weitere Stores können hier ergänzt werden
}
