import { OutlineConfig } from "../config";
import { HttpClient } from "../http-api/http-api";
import { ILogger } from "../utility/logger";
import { IOutlineApi, OutlineCollection, OutlineCollectionStub, OutlineDocument, OutlineDocumentStub, OutlineWrapper } from "./kb-models";



export class OutlineApi implements IOutlineApi {
    private _httpClient: HttpClient;
    private _baseUrl: string;
    private _apiKey: string;
    private _logger: ILogger;

    constructor(logger: ILogger, httpClient: HttpClient, config: OutlineConfig) {
        this._httpClient = httpClient;
        this._baseUrl = config.url;
        this._apiKey = config.apiKey;
        this._logger = logger;
    }

    private getHeaders(): any {
        return {
            Authorization: "Bearer " + this._apiKey
        };
    }

    public getUrl(): string {
        return this._baseUrl;
    }


    public async getDocument(id: string): Promise<OutlineDocument> {
        try {
            const url = this._baseUrl + "/api/documents.info";

            this._logger.info("GetDoc: " + id);

            const body = {
                id: id
            };

            const result = await this._httpClient
                .request<OutlineWrapper<OutlineDocument>>(url, 'post', this.getHeaders(), body);

            return result.data;
        } catch (err) {
            this._logger.error(err);
        }
    }

    public async getCollection(id: string): Promise<OutlineCollection> {
        try {
            const url = this._baseUrl + "/api/collections.info";

            this._logger.info("GetCollection: " + id);

            const body = {
                id: id
            };

            const result = await this._httpClient
                .request<OutlineWrapper<OutlineCollection>>(url, 'post', this.getHeaders(), body);

            return result.data;
        } catch (err) {
            this._logger.error(err);
        }
    }

    public async createDocument(model: OutlineDocumentStub): Promise<OutlineDocument> {
        try {
            const url = this._baseUrl + "/api/documents.create";

            this._logger.info("CreateDoc: " + model.title);

            const result = await this._httpClient
                .request<OutlineWrapper<OutlineDocument>>(url, 'post', this.getHeaders(), model);

            return result.data;
        } catch (err) {
            this._logger.error(err);
        }
    }

    public async updateDocument(model: OutlineDocument): Promise<OutlineDocument> {
        try {
            const url = this._baseUrl + "/api/documents.update";

            this._logger.info("UpdateDoc: " + model.id);

            const result = await this._httpClient
                .request<OutlineWrapper<OutlineDocument>>(url, 'post', this.getHeaders(), {
                    id: model.id,
                    title: model.title,
                    text: model.text,
                    append: false,
                    publish: true,
                    done: true
                });

            return result.data;
        } catch (err) {
            this._logger.error(err);
        }
    }

    public async createCollection(model: OutlineCollectionStub): Promise<OutlineCollection> {
        try {
            const url = this._baseUrl + "/api/collections.create";

            this._logger.info("CreateCollection: " + model.description);

            const result = await this._httpClient
                .request<OutlineWrapper<OutlineCollection>>(url, 'post', this.getHeaders(), model);

            return result.data;
        } catch (err) {
            this._logger.error(err);
        }
    }
}
