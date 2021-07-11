
import fs from 'fs';
import path from 'path';

export interface ApplicationInstance {
    applicationId: string;
    branchId: string;
    buildId: string;
    imagePath?: string;
}

const appFileName: string = "apps.json";

const appCompare = (instance1: ApplicationInstance, instance2: ApplicationInstance): boolean => {
    return (instance1.applicationId === instance2.applicationId
        && instance1.branchId === instance2.branchId
        && instance1.buildId === instance2.buildId);
};

export class TheOverseer {

    _rootPath: string;
    _knownApps: ApplicationInstance[];

    constructor(rootPath: string) {
        this._rootPath = rootPath;
        this.bootKnownApps();
    }

    private getAppFileName(): string {
        return path.join(this._rootPath, appFileName);
    }

    private bootKnownApps() {
        if (!fs.existsSync(this.getAppFileName())) {
            this._knownApps = [];
            this.writeApps();
        } else
            this._knownApps = <ApplicationInstance[]>JSON.parse(fs.readFileSync(this.getAppFileName()).toString());
    }

    public getKnownApps(): ApplicationInstance[] {
        return <ApplicationInstance[]>JSON.parse(JSON.stringify(this._knownApps));
    }

    public removeApplicationInstance(appInstance: ApplicationInstance): ApplicationInstance {
        const index = this._knownApps.findIndex(instance => appCompare(instance, appInstance))
        if (index > -1) {
            const deletedApp = this._knownApps[index];
            this._knownApps = this._knownApps.filter(instance => !appCompare(instance, appInstance));
            this.writeApps();
            return deletedApp;
        }

        return;
    }

    public addApplicationInstance(appInstance: ApplicationInstance): void {

        if (this._knownApps.find(instance => appCompare(instance, appInstance)))
            return;

        this._knownApps.push(appInstance);
        this.writeApps();
    }

    private writeApps(): void {
        fs.writeFileSync(this.getAppFileName(), Buffer.from(JSON.stringify(this._knownApps)));
    }
} 
