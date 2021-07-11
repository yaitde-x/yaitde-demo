
export interface IRunnerResult {
    status: string;
    result: string;
}

export interface IRunnerApi {
    run : (testId: string) => Promise<IRunnerResult>;
}