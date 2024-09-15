import { RoleAssignments } from '../../common/types/api';

export interface IAppUserRepository {}

export type User = {
  user_id: number;
  userName: string;
  email: string;
  password: string;
  refreshToken?: string;
  roles: RoleAssignments;
};
