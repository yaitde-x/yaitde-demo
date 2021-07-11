
export interface ApplicationDefinition {
    applicationId: string;
    dependsOn: string[];
}

export interface ApplicationCatalogEntry {
    applicationId : string;
    dependsOn : ApplicationCatalogEntry[];
}

export class ApplicationCatalog {
    public getCatalogEntry(applicationId: string): ApplicationCatalogEntry {
        return <ApplicationCatalogEntry>{};
    }
}