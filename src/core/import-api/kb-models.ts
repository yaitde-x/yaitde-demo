
export interface ImportResult {
    docsProcessed?: number;
    collectionsCreated?: number;
    foldersCreated?: number;
    result: any;
}

export interface OutlineUser {
    id: string,
    name: string,
    avatarUrl: string,
    email: string,
    isAdmin: true,
    isSuspended: true,
    lastActiveAt: string,
    createdAt: string
}

export interface OutlineDocument {
    id: string,
    collectionId: string,
    parentDocumentId: string,
    title: string,
    emoji: string,
    text: string,
    urlId: string,
    collaborators: OutlineUser[],
    pinned: true,
    template: true,
    templateId: string,
    starred: true,
    revision: 0,
    createdAt: string,
    createdBy: OutlineUser,
    updatedAt: string,
    updatedBy: OutlineUser,
    publishedAt: string,
    archivedAt: string,
    deletedAt: string
}

export interface OutlineCollection {
    id: string,
    name: string,
    description: string,
    documents: OutlineDocument[],
    color: string,
    private: boolean,
    createdAt: string,
    updatedAt: string,
    deletedAt: string
}

export interface OutlineWrapper<T> {
    data: T;
}

export interface OutlineDocumentStub {
    title: string,
    text?: string,
    collectionId: string,
    parentDocumentId?: string;
    publish?: boolean
}

export interface OutlineCollectionStub {
    name: string,
    description?: string,
    color?: string,
    private?: boolean
}

export interface IOutlineApi {
    getUrl(): string;
    getDocument(id: string): Promise<OutlineDocument>;
    createDocument(doc: OutlineDocumentStub): Promise<OutlineDocument>;
    updateDocument(model: OutlineDocument): Promise<OutlineDocument>;
    getCollection(id: string): Promise<OutlineCollection>;
    createCollection(model: OutlineCollectionStub): Promise<OutlineCollection>;
}