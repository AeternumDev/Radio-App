/**
 * Stub-Schnittstellen fuer Benutzer-APIs
 */

import type { User } from '@/lib/models';
import { userMocks } from '@/mock';

export interface IUserAPI {
  fetchCurrentUserFromServer(userId: number): Promise<User | undefined>;
}

export class UserAPIStub implements IUserAPI {
  private users: Map<number, User> = new Map();

  constructor() {
    userMocks.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  async fetchCurrentUserFromServer(userId: number): Promise<User | undefined> {
    await this.delay(50);
    return this.users.get(userId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
