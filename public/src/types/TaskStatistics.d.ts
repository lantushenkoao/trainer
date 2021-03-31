export default interface TaskStatistics {
    id: number;
    index: number;
    name: string;
    manualEvaluation: boolean;
    hasSolution: boolean;
    mark: number | null;
}