import type { Review } from '@/lib/models/review';

export class ReviewEntity implements Review {
  id: number;
  userId: number;
  reviewerUserId: number;
  rating: number;
  comment: string;
  when: number;

  constructor(init: Review) {
      this.id = init.id ?? 0;
      this.userId = init.userId;
      this.reviewerUserId = init.reviewerUserId;
      this.rating = init.rating;
      this.comment = init.comment;
      this.when = init.when ?? Date.now();
  }
}
