
export interface IGitApi {
    getStatus(): Promise<IRepoStatus>;
    getBranches(): Promise<IBranchReport>;
    createBranch(branchName: string): Promise<IGenericGitReport>;
}

export interface IRepoStatus {
    currentBranch: string;
    newFiles: string[];
    changedFiles: string[];
    untrackedFiles: string[];
}

export interface IBranchReport {
    currentBranch: string;
    branches: string[];
}

export interface IGenericGitReport {
}

export interface IGitParser<T> {
    parse(gitResponse: string): T;
}
