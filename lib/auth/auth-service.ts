import { User } from '@/lib/models/user';
import { UserSession } from '@/lib/auth/user-session';
import { UserEntity } from '@/lib/entities/user-entity';
import { UserRepository } from '@/lib/indexeddb/user-repository';
import { ReviewEntity } from '../entities/review-entity';
import { SettingsRepository } from '../indexeddb/settings-repository';
import { SettingsEntity } from '../entities/settings-entity';

export class AuthService {
  private static _currentUser: UserEntity | undefined = undefined;
  private static userUpdatesSource: EventSource | undefined = undefined;
  public static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  static get currentUser(): UserEntity | undefined {
    return this._currentUser;
  }

  static set currentUser(value: UserEntity | undefined) {
    if (this._currentUser instanceof UserEntity && value instanceof UserEntity){
      return
    }
    this._currentUser = value;
  }

  static isSseEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_SSE === 'true';
  }

  static loginWithUser(user: User): UserEntity {
    UserSession.set(user);
    this.currentUser = new UserEntity(user);

    const saveUserFunction = async () => {
      console.log('Saving user data for user:', this.currentUser?.id);
      await UserRepository.save(this.currentUser!.toUser());
    };
    this.currentUser.onReviewAdded(saveUserFunction);
    this.currentUser.onNotificationAdded(saveUserFunction);
    this.currentUser.onDeleteNotification(saveUserFunction);
    return this.currentUser;
  }

  static async login(
    username: string,
    password: string,
  ): Promise<UserEntity | undefined> {
    try {
      let users = await UserRepository.loadAll();
      const user = users?.find(
        u => u.username === username && u.password === password,
      );
      if (user) {
        return this.loginWithUser(user);
      }
      return undefined;
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
      return undefined;
    }
  }

  static logout() {
    if (this.currentUser) {
      this.currentUser.offReviewAdded();
      this.currentUser.offNotificationAdded();
      this.currentUser.offDeleteNotification();
    }
    UserSession.clear();
    this.currentUser = undefined;
  }

  static async restoreSession(): Promise<UserEntity | undefined> {
    this.currentUser = undefined;
    const userId = UserSession.getUserIdFromStorage();
    if (userId) {
      let user = await UserRepository.load(userId);
      if (user) {
        return this.loginWithUser(user);
      }
    }
    return undefined;
  }

  static isLoggedIn(): boolean {
    return this.currentUser !== undefined;
  }

  // Aktuelle Benutzerdaten per API-Aufruf vom Server zu holen
  // (deaktiviert, bis Server-Route existiert)
  // Setze z. B. in der .env: NEXT_PUBLIC_API_BASE_URL=https://api.domain.tld
  static async fetchCurrentUserFromServer(
    userId: number,
  ): Promise<User | undefined> {
    if (!this.API_BASE_URL || !userId) return undefined;

    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) return undefined;
      return (await response.json()) as User;
    } catch {
      return undefined;
    }
  }

  // SSE-Ansatz (deaktiviert, bis Server-Route existiert)
  // Abonniere Updates für den Benutzer mit der angegebenen ID
  // Setze z. B. in der .env: NEXT_PUBLIC_API_BASE_URL=https://api.domain.tld
  // und NEXT_PUBLIC_ENABLE_SSE=true
  static subscribeToUserUpdates(
    userId: number,
    onUpdate: (user?: User) => void,
  ): () => void {
    if (!this.isSseEnabled() || !this.API_BASE_URL) return () => {};

    if (this.userUpdatesSource) {
      this.userUpdatesSource.close();
      this.userUpdatesSource = undefined;
    }

    const source = new EventSource(
      `${this.API_BASE_URL}/users/${userId}/events`,
    );
    this.userUpdatesSource = source;

    source.onmessage = event => {
      const data = JSON.parse(event.data) as {
        type?: string;
        user?: User;
        userId?: number;
      };
      if (data.type === 'user.updated') {
        if (data.user) {
          onUpdate(data.user);
        } else if (!data.userId || data.userId === userId) {
          onUpdate();
        }
      }
    };

    source.onerror = () => {
      // EventSource reconnects automatically; keep it open
    };

    return () => {
      source.close();
      if (this.userUpdatesSource === source) {
        this.userUpdatesSource = undefined;
      }
    };
  }

  static async sendReview(
    moderatorId: number,
    rating: number,
    comment: string,
  ): Promise<boolean> {
    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('Guests cannot submit reviews');
    }

    if (currentUser.id === moderatorId) {
      currentUser.addReview(
        new ReviewEntity({
          id: 0,
          userId: currentUser.id,
          rating: rating,
          comment: comment,
          when: Date.now(),
        }),
      );
    } else {
      const modUser = await UserRepository.load(moderatorId);
      if (!modUser) {
        throw new Error('Moderator not found');
      }
      const modUserEntity = new UserEntity(modUser);
      modUserEntity.addReview(
        new ReviewEntity({
          id: 0,
          userId: currentUser.id,
          rating: rating,
          comment: comment,
          when: Date.now(),
        }),
      );
      await UserRepository.save(modUserEntity.toUser());
    }
    return true;
  }

  saveSettings(settings: SettingsEntity): void {
    // Implementierung zum Speichern der Einstellungen
    SettingsRepository.saveAll(settings.toSettings());
  }
}
