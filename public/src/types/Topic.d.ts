import Task from './Task';

export default interface Topic {
    id?: number | null;
    index?: number;
    name: string;
    description: string;
    tasks: Task[];
}