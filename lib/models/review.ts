export interface Review {
  id: number;
  userId: number;
  reviewerUserId: number;
  rating: number;
  comment: string;
  when: number;
}