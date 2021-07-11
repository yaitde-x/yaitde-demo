import path from 'path';
import crypto from 'crypto';
import { repoKey } from '../app';

export const repoPathFromEnvironment = (env: any): string => {
    const repo = env[repoKey];
    const repoRoot = env["userRepoRoot"];
    const userId = env["user"];
    
    return userRepoPathFactory(repoRoot, userId, 'default', repo);
}

export const userRepoPathFactory = (root: string, userId: string, instance: string, repo: string): string => {
    const userHash = crypto.createHash('md5').update(userId).digest('hex');
    return path.join(root, userHash, instance, repo);
};

export const yaitdeUserFromEncodedString = (encodedUser: string): any => {

    if (!encodedUser)
        return;
        
    const buf = Buffer.from(encodedUser, 'base64');
    return JSON.parse(buf.toString('utf8'));
};
