import { Review } from "./review";
import { Notification } from "./notification";

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  readonly reviews?: readonly Review[];
  readonly notifications?: readonly Notification[];
}

export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}