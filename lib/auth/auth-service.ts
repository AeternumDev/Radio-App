import { UserSession } from '@/lib/auth/user-session';
import { UserRepository, SettingsRepository } from '@/lib/indexeddb';
import { UserEntity, ReviewEntity, SettingsEntity } from '@/lib/entities';
import { RatingAPIStub } from '@/lib/api/rating-api-stubs';
import { User, Review } from '@/lib/models';

export class AuthService {
  private static _currentUser: UserEntity | undefined = undefined;
  private static ratingService = new RatingAPIStub();

  static get currentUser(): UserEntity | undefined {
    return this._currentUser;
  }

  static set currentUser(value: UserEntity | undefined) {
    if (
      this._currentUser instanceof UserEntity &&
      value instanceof UserEntity
    ) {
      return;
    }
    this._currentUser = value;
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
    let users = await UserRepository.loadAll();
    const user = users?.find(
      u => u.username === username && u.password === password,
    );
    if (user) {
      return this.loginWithUser(user);
    }
    return undefined;
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

  static async sendReview(
    moderatorId: number,
    rating: number,
    comment: string,
  ): Promise<boolean> {
    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('Guests cannot submit reviews');
    }

    let review: Review = {
      id: 0,
      userId: currentUser.id,
      reviewerUserId: moderatorId,
      rating: rating,
      comment: comment,
      when: Date.now(),
    };
    if (currentUser.id === moderatorId) {
      currentUser.addReview(new ReviewEntity(review));
    } else {
      const modUser = await UserRepository.load(moderatorId);
      if (!modUser) {
        throw new Error('Moderator not found');
      }
      const modUserEntity = new UserEntity(modUser);
      modUserEntity.addReview(new ReviewEntity(review));
      await UserRepository.save(modUserEntity.toUser());
    }
    await this.ratingService.submitRating(review);
    return true;
  }

  saveSettings(settings: SettingsEntity): void {
    // Implementierung zum Speichern der Einstellungen
    SettingsRepository.saveAll(settings.toSettings());
  }
}
