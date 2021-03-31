import { Role } from './Role';

export default interface NewUser {
    name: string;
    username: string;
    email?: string;
    password: string;
    passwordConfirm: string;
    role: Role
}