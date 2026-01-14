export interface User {
  readonly id: string;
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  readonly reviews?: readonly string[];
}

export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}