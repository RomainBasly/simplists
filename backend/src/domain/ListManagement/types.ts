import { UUID } from 'crypto';

export type List = {
  name: string;
  accessLevel: string;
  creatorId: number;
  creatorEmail: string;
  creatorUserName: string;
  emails?: string[];
  description?: string;
  cyphered?: boolean;
  thematic: string;
};
export type IInputAppList = {
  listName: string;
  access_level: string;
  description?: string;
  cyphered?: boolean;
};

export interface EmailValidationResult {
  [email: string]: { email: string };
}

export type SupabaseReturnedList = {
  id: UUID;
  created_at: Date;
  list_name: string;
  access_level: string;
  description?: string;
  cyphered?: boolean;
};

export type ReturnedInvitedUsers = {
  id: string;
  email: string;
  list_id: UUID;
  is_already_active_user: boolean;
  is_already_invited: boolean;
  user_id: UUID | null;
};

export type IInputAddToList = {
  listId: UUID;
  userId: number;
  content: string;
};

export type IBeneficiary = {
  'app-users': IUser;
};

export type IUser = {
  userName: string;
  user_id: `${string}-${string}-${string}-${string}-${string}`;
};
