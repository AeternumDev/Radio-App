import type { User } from '@/lib/models/user';

export class UserSession {
  
  private static readonly SESSION_KEY = 'userId';
  private static currentUser: User | undefined = undefined;

  static set(user: User | undefined): void {
    this.currentUser = user;
    if (user) {
      sessionStorage.setItem(this.SESSION_KEY, user.id.toString());
    } else {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  static get(): User | undefined {
    return this.currentUser;
  }

  static clear() {
    this.set(undefined);
  }

  static isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  static getUserIdFromStorage(): number | null {
    const userId = sessionStorage.getItem(this.SESSION_KEY);
    return userId ? Number(userId) : null;
  }
}
