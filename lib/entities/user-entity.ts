import type { User, Review, Notification } from '@/lib/models';
import { UserRole } from '@/lib/models/user';
import { ReviewEntity } from './review-entity';
import { NotificationEntity } from './notification-entity';
import { UserRepository } from '@/lib/indexeddb/user-repository';
type ReviewListener = (review: Review) => void;
type NotificationListener = (notification: Notification) => void;
type DeleteNotificationListener = (notification: Notification) => void;
import * as actions from '@/store/actions';
import { log } from 'console';
import Store from '@/store';
import * as selectors from '../../store/selectors';

export class UserEntity implements User {
  readonly id: number;
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  private _reviews: Review[] = [];
  private _notifications: Notification[] = [];
  private reviewListeners: ReviewListener[] = [];
  private notificationListeners: NotificationListener[] = [];
  private deleteNotificationListeners: DeleteNotificationListener[] = [];

  constructor(init: User) {
    this.id = init.id;
    this.username = init.username;
    this.password = init.password;
    this.role = init.role;
    this.name = init.name;
    this._reviews = Array.from(init.reviews ?? []);
    this._notifications = Array.from(init.notifications ?? []);
  }

  get reviews(): readonly ReviewEntity[] {
    return this._reviews;
  }

  get notifications(): readonly NotificationEntity[] {
    return this._notifications;
  }

  // Konvertiere UserEntity in ein persistierbares User-Objekt
  // für die Speicherung in IndexedDB
  toUser(): User {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      role: this.role,
      reviews: [...this.reviews],
      notifications: [...this.notifications],
    };
  }

  // Erstelle eine UserEntity aus einem User-Objekt
  fromUser(user: User): UserEntity {
    return new UserEntity(user);
  }

  private largestReviewId: number = 0;
  // Neue Review hinzufügen und Listener benachrichtigen
  addReview(review: Review, notify: boolean = true): void {
    this.largestReviewId =
      this.largestReviewId > 0
        ? this.largestReviewId
        : this.reviews.reduce((maxId, r) => Math.max(maxId, r.id), 0);

    if (review.id <= 0) {
      review.id = ++this.largestReviewId;
    } else {
      this.largestReviewId = Math.max(this.largestReviewId, review.id);
    }

    this._reviews.push(review);
    if (this.role === UserRole.Moderator && notify) {
      this.addNotification(
        new NotificationEntity(`Es gibt eine neue Moderator-Bewertung`),
      );
    }
    if (notify) this.emitReviewAdded(review);
  }

  private largestNotificationId: number = 0;
  // Neue Notification hinzufügen und Listener benachrichtigen
  addNotification(notification: NotificationEntity, notify = true): void {
    const storeProps = Store.getRawState();
    if (!storeProps.settings.enableNotifications) {
      return;
    }
    this.largestNotificationId =
      this.largestNotificationId > 0
        ? this.largestNotificationId
        : this.notifications.reduce((maxId, n) => Math.max(maxId, n.id), 0);
    if (notification.id <= 0) {
      notification.id = ++this.largestNotificationId;
    } else {
      this.largestNotificationId = Math.max(
        this.largestNotificationId,
        notification.id,
      );
    }
    this._notifications.push(notification);
    if (notify) this.emitNotificationAdded(notification);
  }

  importUserData(user: User): boolean {
    if (JSON.stringify(this.toUser()) === JSON.stringify(user)) {
      return false;
    }
    this.username = user.username ?? this.username;
    this.password = user.password ?? this.password;
    this.role = user.role ?? this.role;
    this.name = user.name ?? this.name;
    user.reviews?.forEach(r => {
      if (this._reviews.some(review => review.id === r.id)) {
        return;
      }
      this.addReview(r, true);
    });
    user.notifications?.forEach(n => {
      if (this._notifications.some(notification => notification.id === n.id)) {
        return;
      }
      this.addNotification(n, true);
    });
    return true;
  }

  // Listener für hinzugefügte Reviews registrieren
  onReviewAdded(listener: ReviewListener): () => void {
    this.reviewListeners.push(listener);

    return () => {
      this.offReviewAdded(listener);
    };
  }

  // Listener für hinzugefügte Notifications registrieren
  onNotificationAdded(listener: NotificationListener): () => void {
    this.notificationListeners.push(listener);
    return () => {
      this.offNotificationAdded(listener);
    };
  }

  offReviewAdded(listener: ReviewListener | undefined = undefined): void {
    if (listener === undefined) {
      this.reviewListeners = [];
      return;
    }
    this.reviewListeners = this.reviewListeners.filter(l => l !== listener);
  }

  offNotificationAdded(
    listener: NotificationListener | undefined = undefined,
  ): void {
    if (listener === undefined) {
      this.notificationListeners = [];
      return;
    }
    this.notificationListeners = this.notificationListeners.filter(
      l => l !== listener,
    );
  }

  // Event-Emitter für hinzugefügte Reviews
  private emitReviewAdded(review: Review): void {
    this.reviewListeners.forEach(l => l(review));
  }

  // Event-Emitter für hinzugefügte Notifications
  private emitNotificationAdded(notification: Notification): void {
    this.notificationListeners.forEach(l => l(notification));
  }

  async deleteNotification(
    notification: Notification,
    index: number,
  ): Promise<boolean> {
    if (notification.id < 0 || index >= this._notifications.length)
      return false;
    this._notifications.splice(index, 1);

    this.emitDeleteNotification(notification);
    return true;
  }

  // Listener für hinzugefügte Notifications registrieren
  onDeleteNotification(listener: DeleteNotificationListener): () => void {
    this.deleteNotificationListeners.push(listener);

    return () => {
      this.offDeleteNotification(listener);
    };
  }

  offDeleteNotification(
    listener: DeleteNotificationListener | undefined = undefined,
  ): void {
    if (listener === undefined) {
      this.deleteNotificationListeners = [];
      return;
    }
    this.deleteNotificationListeners = this.deleteNotificationListeners.filter(
      l => l !== listener,
    );
  }

  // Event-Emitter für hinzugefügte Notifications
  private emitDeleteNotification(notification: Notification): void {
    this.deleteNotificationListeners.forEach(l => l(notification));
  }
}
