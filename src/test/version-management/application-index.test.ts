
import 'jest-extended';
import { ApplicationIndex, VersionEntry, VersionManager, VersionState_Approved, VersionState_Gauntlet, VersionState_New, VersionState_Released } from '../../router/version/version-manager';

const sampleEntry : VersionEntry = {
    internal : "yaitde-app-106",
    release : "v2",
    pod : {
        "ui": "yaitde-ui-97",
        "api" : "yaitde-agent-103",
        "mock" : "yaitde-agent-103",
        "repo" : "V2"
    },
    state: VersionState_Gauntlet
}

const versionSeed : VersionEntry[] = [
    {
        internal: "yaitde-app-1",
        release: "v1",
        pod : {
            "ui": "yaitde-ui-master-49",
            "api" : "yaitde-agent-master-97",
            "mock" : "yaitde-agent-master-97",
            "repo" : "V1.3"
        },
        state: VersionState_Released
    },
    {
        internal: "yaitde-app-2",
        release: null,
        pod : {
            "ui": "yaitde-ui-master-50",
            "api" : "yaitde-agent-master-97",
            "mock" : "yaitde-agent-master-97",
            "repo" : "V1.3"
        },
        state: VersionState_Approved
    },
    {
        internal: "yaitde-app-3",
        release: null,
        pod : {
            "ui": "yaitde-ui-master-50",
            "api" : "yaitde-agent-master-98",
            "mock" : "yaitde-agent-master-98",
            "repo" : "V1.3"
        },
        state: VersionState_New
    }
];

test('index the seedData', () => {

    const versionManager = new ApplicationIndex(versionSeed);
    const versionEntry : VersionEntry = {
        internal : "yaitde-app-106",
        release : "v2",
        pod : {
            "ui": "yaitde-ui-97",
            "api" : "yaitde-agent-103",
            "mock" : "yaitde-agent-103",
            "repo" : "V2"
        },
        state: VersionState_Gauntlet
    };
    const versionRecord = versionManager.registerVersionForFunctionalUnit(versionEntry);
});
