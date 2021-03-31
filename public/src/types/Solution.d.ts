import User from './User';

export default interface Solution {
    id?: number;
    data: string | null;
    mark?: number | null;
    student?: User | null,
    task?: {
        id: number
    }
}