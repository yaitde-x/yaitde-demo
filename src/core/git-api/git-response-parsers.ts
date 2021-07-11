import { IGitParser, IBranchReport, IRepoStatus, IGenericGitReport } from "./git-interfaces";

export class BranchParser implements IGitParser<IBranchReport> {
    public parse(gitResponse: string): IBranchReport {
        let branch = '';
        const branches : string[] = [];
        const lines = gitResponse.split('\n');

        lines.forEach((line) => {
            const ln = line.trim();
            if (ln.startsWith('*')) {
                branch = ln.substr(1).trim();
                branches.push(branch);
            } else if (ln.length > 0) {
                branches.push(ln);
            }
        });

        return {
            currentBranch: branch, branches: branches
        };
    }
}

export class NewBranchParser implements IGitParser<IGenericGitReport> {
    private _targetBranch: string;
    constructor(targetBranch: string) {
        this._targetBranch = targetBranch;
    }
    public parse(gitResponse: string): IGenericGitReport {
        if (gitResponse === '')
            return {};


        if (gitResponse.startsWith('error') || gitResponse.startsWith('fatal'))
            throw new Error(`error creating branch ${this._targetBranch}`);

        throw new Error(`unknown error creating branch ${this._targetBranch}`);
    }
}

export class DeleteBranchParser implements IGitParser<IGenericGitReport> {
    private _targetBranch: string;
    constructor(targetBranch: string) {
        this._targetBranch = targetBranch;
    }
    public parse(gitResponse: string): IGenericGitReport {
        if (gitResponse.startsWith('Deleted'))
            return {};


        if (gitResponse.startsWith('error: Cannot delete branch'))
            throw new Error(`can't delete the active branch ${this._targetBranch}`);

        if (gitResponse.startsWith('error: branch'))
            throw new Error(`branch ${this._targetBranch} does not exist`);

        throw new Error(`unknown error deleting branch ${this._targetBranch}`);
    }
}

export class StatusParser implements IGitParser<IRepoStatus> {
    public parse(gitResponse: string): IRepoStatus {
        let branch = '';
        let subProcess = false;
        const newFiles: string[] = [];
        const untrackedFiles: string[] = [];
        const changedFiles: string[] = [];
        const lines = gitResponse.split('\n');

        lines.forEach((line:string) => {
            const ln: string = line.trim();
            if (ln.startsWith('On branch')) {
                branch = ln.substr(10);
            } else if (ln == 'Untracked files:') {
                subProcess = true;
            } else if (ln.startsWith('modified:')) {
                changedFiles.push(ln.slice(9).trim());
            } else if (ln.startsWith('new file:')) {
                newFiles.push(ln.slice(9).trim());
            } else if (subProcess &&
                !ln.startsWith('(') &&
                !ln.startsWith('nothing added to commit') &&
                ln !== '') {
                untrackedFiles.push(ln);
            } else if (subProcess && ln == '') {
                subProcess = false;
            }
        });

        return {
            currentBranch: branch, newFiles: newFiles, untrackedFiles: untrackedFiles, changedFiles: changedFiles
        };
    }
}
