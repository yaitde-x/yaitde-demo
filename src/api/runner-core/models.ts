// export interface ITestHeader {
//     key: string;
//     value: string;
// };

// export interface ITestScript {
//     type: string;
//     resource?: string;
//     script: string;
// };

// export interface ITestRequest {
//     url: string;
//     method: string;
//     headers: ITestHeader[];
//     body: any;
// };

// export interface ITest {
//     id: string;
//     description: string;
//     request: ITestRequest;
//     preScript?: ITestScript;
//     postScript?: ITestScript;
// };

export interface TestLogEntry {
    entryDate?: Date;
    type: string;
    message: string;
    data?: any
}

export interface TestResult {
    testId: string;
    status: string;
    runLog: TestLogEntry[];
}

export interface ITimeProvider {
    getUtcDate(): Date;
}

export class SystemTimeProvider implements ITimeProvider {
    public getUtcDate(): Date {
        return new Date();
    }
}