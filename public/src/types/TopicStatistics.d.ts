import TaskStatistics from './TaskStatistics';

export default interface TopicStatistics {
    id: number;
    index: number;
    name: string;
    tasks: TaskStatistics[];
}