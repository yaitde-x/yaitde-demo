
import * as fs from 'fs';

export interface PostmanVar {
    key: string;
    value: string;
    type: string;
}

export interface PostmanEvent {
    listen: string;
    script: PostmanScript;
}

export interface PostmanScript {
    id: string;
    type: string;
    exec: string[];
}

export interface PostmanHeader {
    key: string;
    name?: string;
    type?: string;
    value?: string;
    disabled?: boolean;
}

export interface PostmanUrl {
    raw: string;
    host: string[];
    path: string[];
}

export interface PostmanBody {
    mode: string;
    formdata?: PostmanVar[];
    raw?: string;
}

export interface PostmanRequest {
    auth?: PostmanAuth;
    method?: string;
    header?: PostmanHeader[];
    body?: PostmanBody;
    url?: PostmanUrl;
}

export interface PostmanItem {
    name: string;
    item: PostmanItem[];
    event?: PostmanEvent[];
    request?: PostmanRequest;
    response?: PostmanResponse[];
}

export interface PostmanResponse {

}

export interface PostmanCollectionInfo {
    _postman_id: string;
    name: string;
    schema: string;
}

export interface PostmanAuth {
    type: string;
    bearer?: PostmanVar[];
    basic?: PostmanVar[];
}

export interface PostmanCollection {
    info: PostmanCollectionInfo;
    item: PostmanItem[];
    auth: PostmanAuth;
    event: PostmanEvent[];
}

export class PostmanImport {

    public importPostmanCollection(filePath: string): PostmanCollection {
        const collection = <PostmanCollection>JSON.parse(fs.readFileSync(filePath).toString());
        return collection;
    }

}

export interface PostmanVariable {
    raw: string;
    name: string;
    start: number;
    end: number;
}

export class PostmanVariableExtractor {

    public extractVariablesFromCollection(col: PostmanCollection): PostmanVariable[] {
        const result: PostmanVariable[] = [];

        if (col.auth) {
            if (col.auth.basic) {
                col.auth.basic.forEach(item => {
                    const vars = this.extractVariablesFromBuffer(item.value);
                    vars.forEach(item => result.push(item));
                });
            }
            if (col.auth.bearer) {
                col.auth.bearer.forEach(item => {
                    const vars = this.extractVariablesFromBuffer(item.value);
                    vars.forEach(item => result.push(item));
                });
            }

        }

        if (col.event) {
            col.event.forEach(event => {
                if (event.script) {
                    if (event.script.exec) {
                        event.script.exec.forEach(item => {
                            const vars = this.extractVariablesFromBuffer(item);
                            vars.forEach(item => result.push(item));
                        });
                    }
                }
            });
        }

        if (col.item) {
            col.item.forEach(item => {
                const vars = this.extractVariablesFromItem(item);
                vars.forEach(item => result.push(item));
            });
        }
        return result;
    }

    public extractVariablesFromItem(test: PostmanItem): PostmanVariable[] {
        const result: PostmanVariable[] = [];

        if (test.request) {

            if (test.request.url) {
                const vars = this.extractVariablesFromBuffer(test.request.url.raw);
                vars.forEach(item => result.push(item));
            }

            if (test.request.header) {
                test.request.header.forEach(header => {
                    const vars = this.extractVariablesFromBuffer(header.value);
                    vars.forEach(item => result.push(item));
                });
            }

            if (test.request.body) {
                if (test.request.body.raw) {
                    const vars = this.extractVariablesFromBuffer(test.request.body.raw);
                    vars.forEach(item => result.push(item));
                }

                if (test.request.body.formdata) {
                    test.request.body.formdata.forEach(data => {
                        const vars = this.extractVariablesFromBuffer(data.value);
                        vars.forEach(item => result.push(item));
                    });
                }
            }
        }

        if (test.event) {
            test.event.forEach(event => {
                if (event.script) {
                    if (event.script.exec) {
                        event.script.exec.forEach(item => {
                            const vars = this.extractVariablesFromBuffer(item);
                            vars.forEach(item => result.push(item));
                        });
                    }
                }
            });
        }

        if (test.item) {
            test.item.forEach(item => {
                const vars = this.extractVariablesFromItem(item);
                vars.forEach(item => result.push(item));
            });
        }

        return result;
    }

    public extractVariablesFromBuffer(buffer: string): PostmanVariable[] {
        const vars: PostmanVariable[] = [];
        let lastIndex = 0;

        if (!buffer)
            return vars;

        do {
            const start = buffer.indexOf("{{", lastIndex);
            const end = buffer.indexOf("}}", lastIndex);
            lastIndex = end === -1 ? end : end + 2;

            if (buffer && start > -1 && end > -1) {
                const raw = buffer.substr(start, end + 2 - start);
                const varName = raw.substr(2, raw.length - 4);
                vars.push({
                    raw: raw,
                    name: varName,
                    start: start,
                    end: end + 1
                });
            }

        } while (lastIndex !== -1)

        return vars;
    }
}

