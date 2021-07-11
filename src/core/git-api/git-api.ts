
import * as spawn from 'await-spawn';
import { ILogger } from '../utility/logger';
import { IBranchReport, IGitApi, IRepoStatus, IGenericGitReport } from './git-interfaces';
import { StatusParser, BranchParser, NewBranchParser, DeleteBranchParser } from './git-response-parsers';
import { repoKey } from '../app';
import { repoPathFromEnvironment, userRepoPathFactory } from '../utility/factories';

export class GitApi implements IGitApi {
   
    private _logger: ILogger;
    private _environment: any;

    constructor(logger: ILogger, environment: any) {
        this._logger = logger;
        this._environment = environment;
    }

    getRepoPath(): string {
        return repoPathFromEnvironment(this._environment);
    }

    public async getStatus(): Promise<IRepoStatus> {
        const parser = new StatusParser();
        return parser.parse(await this.runProcess(["status"]));
    }

    public async getBranches(): Promise<IBranchReport> {
        const parser = new BranchParser();
        return parser.parse(await this.runProcess(["branch"]));
    }

    public async createBranch(branchName: string): Promise<IGenericGitReport> {
        const parser = new NewBranchParser(branchName);
        return parser.parse(await this.runProcess(["branch", branchName]));
    }

    public async deleteBranch(branchName: string): Promise<IGenericGitReport> {
        const parser = new DeleteBranchParser(branchName);
        return parser.parse(await this.runProcess(["branch","-d", branchName]));
    }

    private async runProcess(params: string[]): Promise<string> {
        try {
            const result = await spawn('git', params, { cwd: this.getRepoPath() });
            return result.toString();
        } catch (e) {
            this._logger.error(e);
            throw new Error(`error executing git ${JSON.stringify(params)}`);
        }
    }
}

