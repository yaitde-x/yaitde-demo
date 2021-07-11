
import fs from 'fs';
import path from 'path';
import { AppConfig } from '../core/config';

export interface YaitdeUser {
    userId: string;
    secret: string;
}

export class YaitdeUserRepo {
    private _users: YaitdeUser[];

    constructor(appConfig: AppConfig) {
        this._users =  JSON.parse(fs.readFileSync(path.join(appConfig.systemPath,"userdb.json")).toString());
    }

    public getUser(userId: string, secret: string): YaitdeUser {

        for (const index in this._users) {
            if (this._users[index].userId === userId && this._users[index].secret === secret)
                return this._users[index];
        }

        return undefined;
    }
}