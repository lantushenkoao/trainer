import { Role } from './Role';

export default interface CreateOrUpdateUser {
    id?: number | null;
    name: string;
    username: string;
    email?: string | null;
    currentPassword?: string;
    password?: string;
    passwordConfirm?: string;
    role: Role;
}