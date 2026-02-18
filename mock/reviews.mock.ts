import { Review } from "@/lib/models/review";

export const reviewMocks: Review[] = [
    {
      id: 1,
      comment: 'Tolle Playlist!',
      when: 1769113881000,
      userId: 1,
      reviewerUserId: 2,
      rating: 3.0
    },
    {
      id: 2,
      comment: 'Tolle Show, könnte aber verbessert werden.',
      when: 1769113958000,
      userId: 1,
      reviewerUserId: 2,
      rating: 4.0
    },
    {
      id: 3,
      comment: 'Tolle Musikauswahl!',
      when: 1769114025000,
      userId: 1,
      reviewerUserId: 2,
      rating: 5.0
    },
    {
      id: 4,
      comment: 'Ich hätte mir mehr Deutsch-Pop gewünscht.',
      when: 1769114092000,
      userId: 1,
      reviewerUserId: 2,
      rating: 2.0
    },
  ];