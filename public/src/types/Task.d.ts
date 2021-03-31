import Solution from './Solution';

export default interface Task {
    id?: number | null;
    index?: number;
    name: string;
    description: string;
    complexity: number;
    topic?: {
        id: number | null
    };
    solutions: Solution[];
    shouldComparePositionOnEvaluation: boolean,
    manualEvaluation: boolean
}