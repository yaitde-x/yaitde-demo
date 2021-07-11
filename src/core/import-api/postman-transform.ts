import { TestHeader, YaitdeCollectionItem, YaitdeRequest, YaitdeScript, YaitdeTest, YaitdeTestBundle } from '../domain/models';
import { PostmanCollection, PostmanItem, PostmanHeader, PostmanScript, PostmanEvent } from './postman-models';
import { getCamelCasedName, getRandomName } from '../utility/name-generators';

export class PostmanToYaitdeTransform {

    public toYaitdeCollection(pmcol: PostmanCollection): YaitdeTestBundle {

        /**
         * 1. extract the folder structure from the postman collection
         * 2. build a YaitdeCollection
         * 3. extract the tests from the postman collection
         */
        const result = this.extractCollectionStructure(pmcol);

        const collection = {
            id: getRandomName(),
            pmid: pmcol.info._postman_id,
            schema: pmcol.info.schema,
            tree: result[0]
        };

        return {
            collection: collection,
            tests: result[1]
        };
    }

    private extractCollectionStructure(pmcol: PostmanCollection): [YaitdeCollectionItem, YaitdeTest[]] {

        const tests = this.getTests("", pmcol);
        const items = this.extractCollectionItems("", pmcol.item, tests);

        return [{
            type: "f",
            resourceName: pmcol.info.name,
            children: items
        },
            tests
        ];
    }

    private yaiteTestIdFromPmId(tests: YaitdeTest[], pmid: string): string {
        let id = pmid;
        for (const idx in tests) {
            if (tests[idx].pmid === pmid)
                id = tests[idx].id;
        }
        return id;
    }

    private extractCollectionItems(parent: string, items: PostmanItem[], tests: YaitdeTest[]): YaitdeCollectionItem[] {

        const colItems: YaitdeCollectionItem[] = [];

        if (items && items.length > 0) {
            for (const i in items) {
                const item = items[i];
                const id = getCamelCasedName(parent + "-" + item.name);

                if (item.item) {
                    colItems.push({
                        resourceName: item.name,
                        type: "f",
                        children: this.extractCollectionItems(id, item.item, tests)
                    });
                } else {
                    colItems.push(
                        {
                            resourceName: item.name,
                            resourceId: this.yaiteTestIdFromPmId(tests, id),
                            type: 'x'
                        }
                    );
                }
            }
        }

        return colItems;
    }

    private getTests(parent: string, pmcol: PostmanCollection): YaitdeTest[] {
        return this.processPostmanItems("", pmcol.item);
    }

    private processPostmanItems(parent: string, items: PostmanItem[]): YaitdeTest[] {
        const tests: YaitdeTest[] = [];

        if (!items)
            return tests;

        for (const idx in items) {
            const pmitem = items[idx];
            const id = getCamelCasedName(parent + pmitem.name);

            if (!pmitem.item) {
                tests.push(this.toYaitdeTest(id, pmitem));
            } else {
                const childItems = this.processPostmanItems(id, pmitem.item);
                for (const cidx in childItems) {
                    tests.push(childItems[cidx]);
                }
            }
        }

        return tests;
    }

    public toYaitdeTest(pmid: string, pmtest: PostmanItem): YaitdeTest {

        /**
         * TODO:
         *  1. Only supports 'raw' bodies atm
         */
        const req: YaitdeRequest = {
            url: pmtest.request.url.raw,
            headers: this.toTestHeaders(pmtest.request.header),
            method: pmtest.request.method,
            body: {
                type: pmtest.request.body.mode,
                raw: pmtest.request.body.raw
            }
        };

        const scripts = this.toYaitdeScripts(pmtest.event);

        return {
            id: pmid,
            pmid: pmid,
            description: pmtest.name,
            request: req,
            scripts: scripts
        };
    }

    private toTestHeaders(headers?: PostmanHeader[]): TestHeader[] {
        const yeaders: TestHeader[] = [];

        if (!headers || headers.length === 0)
            return yeaders;

        for (const idx in headers) {
            yeaders.push(this.toTestHeader(headers[idx]));
        }

        return yeaders;
    }

    private toTestHeader(header: PostmanHeader): TestHeader {
        return {
            key: header.key,
            value: header.value,
            disabled: header.disabled,
            name: header.name,
            type: header.type
        };
    }

    private toYaitdeScripts(scripts?: PostmanEvent[]): YaitdeScript[] {
        const yscripts: YaitdeScript[] = [];

        if (!scripts || scripts.length === 0)
            return yscripts;

        for (const idx in scripts) {
            yscripts.push(this.toYaitdeScript(scripts[idx].listen, scripts[idx].script));
        }

        return yscripts;
    }

    private toYaitdeScript(on: string, script: PostmanScript): YaitdeScript {
        return {
            id: getRandomName(),
            pmid: script.id,
            on: on,
            data: this.makeOneScript(script.exec),
            type: "js",
            disabled: false,
            description: ""
        };
    }

    private makeOneScript(exec: string[]): string {
        let buf = "";

        for (const idx in exec) {
            buf += exec[idx] + "\n";
        }

        return buf;
    }
}
