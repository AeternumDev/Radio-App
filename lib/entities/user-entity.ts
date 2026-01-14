import type { User, UserRole } from '@/lib/models/user';

type ReviewListener = (review: string) => void;

export class UserEntity implements User {
  readonly id: string;
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  private _reviews: string[] = [];
  private listeners: ReviewListener[] = [];

  constructor(init: User) {
    this.id = init.id;
    this.username = init.username;
    this.password = init.password;
    this.role = init.role;
    this.name = init.name;
    this._reviews = Array.from(init.reviews ?? []);
  }

  get reviews(): readonly string[] {
    return this._reviews;
  }

  addReview(review: string, notify = true): void {
    this._reviews.push(review);
    if (notify) this.emitReviewAdded(review);
  }

  onReviewAdded(listener: ReviewListener): void {
    this.listeners.push(listener);
  }

  private emitReviewAdded(review: string): void {
    this.listeners.forEach(l => l(review));
  }
}
