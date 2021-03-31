import { Role } from './Role';

export default interface User {
    id: number;
    username: string;
    name: string;
    email?: string | null;
    roles: Role[];
}