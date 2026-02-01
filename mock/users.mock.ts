import { User, UserRole } from "@/lib/models/user";

import { reviewMocks } from "./reviews.mock";
import { notificationMocks } from "./notifications.mock";

export const userMocks: User[] = [
  {
    id: 1,
    username: 'User',
    password: 'UserPasswort',
    role: UserRole.User,
    name: 'Alice',
    reviews: [],
    notifications: notificationMocks,
  },
  {
    id: 2,
    username: 'Moderator',
    password: 'ModeratorPasswort',
    role: UserRole.Moderator,
    name: 'Bob',
    reviews: reviewMocks,
    notifications: notificationMocks,
  },
];
