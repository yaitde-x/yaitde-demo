import * as path from 'path';
import { ApplicationContext, repoKey } from "../../core/app";
import { KeyedCollection } from "../../core/utility/dictionary";
import { IParseTree, ICommandVector, ICommandDispatcher } from "./command/parse-interfaces";
import * as highlight from 'cli-highlight';
import { PostmanImport, PostmanVariableExtractor } from '../../core/import-api/postman-models';
import { PostmanToYaitdeTransform } from "../../core/import-api/postman-transform";
import { DocsToOutline, MarkdownToOutlineDocument } from '../../core/import-api/kb-import';
import { OutlineCollectionStub } from '../../core/import-api/kb-models';
import { HelpToMarkdown } from '../console-core/help-to-markdown';
import { ShinsApi } from '../../core/import-api/shins-api';
import { repoPathFromEnvironment, userRepoPathFactory } from '../../core/utility/factories';
import { YaitdeTranspiler } from '../../core/runner-api/test-transpiler';

export const registerCommands = (dispatcher: ICommandDispatcher, appContext: ApplicationContext): void => {

    const objectToFormattedJson = (rawObject: any): string => {
        return highlight.highlight(JSON.stringify(rawObject, null, 4),
            {
                language: 'json',
                ignoreIllegals: true
            });
    };

    const stringToFormattedJson = (rawJson: string): string => {
        return highlight.highlight(JSON.stringify(JSON.parse(rawJson), null, 4),
            {
                language: 'json',
                ignoreIllegals: true
            });
    };

    dispatcher.registerHandler({
        command: 'quit',
        help: {
            description: "exit yac",
            params: []
        },
        vector: (parseTree: IParseTree) => {
            appContext.shutdown = true;
            return Promise.resolve("cya.");
        }
    });

    dispatcher.registerHandler({
        command: 'clear',
        help: {
            description: "clear the console window",
            params: []
        },
        vector: (parseTree: IParseTree) => {
            console.clear();
            return Promise.resolve(null);
        }
    });

    dispatcher.registerHandler({
        command: 'ver',
        help: {
            description: "spits out a bogus version number rn",
            params: []
        },
        vector: (parseTree: IParseTree) => {
            const result = objectToFormattedJson({ version: appContext.version });
            return Promise.resolve(result);
        }
    });

    dispatcher.registerHandler({
        command: 'set',
        help: {
            description: "set a yac environment variable",
            tokens: [
                {
                    token: 0,
                    description: "variable name"
                },
                {
                    token: 1,
                    description: "variable value"
                }
            ]
        },
        vector: (parseTree: IParseTree) => {
            const key = parseTree.tokens[1];
            const value = parseTree.tokens[2];
            appContext.envVars[key] = value;
            return Promise.resolve(null);
        }
    });

    dispatcher.registerHandler({
        command: 'get',
        help: {
            description: "get a yac environment variable",
            tokens: [
                {
                    token: 0,
                    description: "variable name. omit to dump entire env"
                }
            ]
        },
        vector: (parseTree: IParseTree) => {

            let result = appContext.envVars;

            if (parseTree.tokens.length > 1) {
                const varName = parseTree.tokens[1];
                let val = appContext.envVars[varName];

                if (!val)
                    val = "null";

                result = {};
                result[varName] = val;
            }

            return Promise.resolve(objectToFormattedJson(result));
        }
    });

    dispatcher.registerHandler({
        command: 'del',
        help: {
            description: "delete a yac environment variable",
            tokens: [
                {
                    token: 0,
                    description: "variable name"
                }
            ]
        },
        vector: (parseTree: IParseTree) => {
            const varName = parseTree.tokens[1];
            delete appContext.envVars[varName];
            return Promise.resolve(null);
        }
    });

    dispatcher.registerHandler({
        command: 'repo',
        help: {
            description: "set the console `repo` environmental variable. Console assumes this is a yaitde test repo.",
            tokens: [
                {
                    token: 0,
                    description: "local path to test repo"
                }
            ]
        },
        vector: (parseTree: IParseTree) => {

            if (parseTree.rawValue.trim() == 'repo')
                return Promise.resolve("repo path: " + appContext.envVars[repoKey]);

            appContext.envVars[repoKey] = parseTree.rawValue.slice(4).trim();
            const instanceRepoRoot = repoPathFromEnvironment(appContext.envVars);

            appContext.yaitdeRepo.setRepoPath(instanceRepoRoot);

            const result = objectToFormattedJson(appContext.envVars);
            return Promise.resolve(result);
        }
    });

    dispatcher.registerHandler({
        command: 'ls',
        help: {
            description: "list files in `repoPath`",
            example: "ls /r *.json",
            params: [
                {
                    parameter: "/r",
                    description: "recurse switch"
                }
            ],
            tokens: [
                {
                    token: 0,
                    description: "pattern to match"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const rootPath = appContext.envVars[repoKey];
            const recurse = (parseTree.switchExists("r") || parseTree.switchExists("recurse"));
            let patternToUse = "*";

            if (parseTree.tokens.length > 1)
                patternToUse = parseTree.tokens[1].trim();

            const files = await appContext.fileApi.listFiles(rootPath, patternToUse, recurse);
            return objectToFormattedJson(files);
        }
    });

    dispatcher.registerHandler({
        command: 'rd',
        help: {
            description: "read a file from the repo path",
            example: "rd /file=\"test/sometest.json\" /fmt=json",
            params: [
                {
                    parameter: "/file",
                    description: "relative path into the repo"
                },
                {
                    parameter: "/fmt",
                    description: "file format. only json is supported rn"
                }
            ],
            tokens: [
                {
                    token: 0,
                    description: "pattern to match"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {

            const rootPath = appContext.envVars[repoKey];
            const relativeFileName = parseTree.getRequiredSwitch('file');
            const fmt = parseTree.tryGetSwitch('fmt', null);

            const filePath = path.join(rootPath, relativeFileName);
            const file = (await appContext.fileApi.readFile(filePath)).toString();

            if (fmt == 'json')
                return stringToFormattedJson(file);

            return file;
        }
    });

    dispatcher.registerHandler({
        command: 'wr',
        help: {
            description: "read a file from local drive and write it into the repo",
            example: "wr /source=\"/home/me/temp/sometest.json\" /target=\"tests/sometest.json\"",
            params: [
                {
                    parameter: "/source",
                    description: "absolute path to the file"
                },
                {
                    parameter: "/target",
                    description: "relative target path"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const rootPath = appContext.envVars[repoKey];
            const absoluteSource = parseTree.getRequiredSwitch('source');
            const relativeTarget = parseTree.getRequiredSwitch('target');
            const absoluteTargetPath = path.join(rootPath, relativeTarget);

            const sourceFile = await appContext.fileApi.readFile(absoluteSource);
            await appContext.fileApi.writeFile(absoluteTargetPath, sourceFile);

            return objectToFormattedJson({});
        }
    });

    dispatcher.registerHandler({
        command: 'rm',
        help: {
            description: "remove a file from the repo",
            example: "rm /file=\"tests/sometest.json\"",
            params: [
                {
                    parameter: "/file",
                    description: "relative path to the file"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const rootPath = appContext.envVars[repoKey];
            const relativeTarget = parseTree.getRequiredSwitch('file');
            const absoluteTargetPath = path.join(rootPath, relativeTarget);

            await appContext.fileApi.deleteFile(absoluteTargetPath);

            return objectToFormattedJson({});
        }
    });

    dispatcher.registerHandler({
        command: 'x',
        help: {
            description: "(proto) execute a yaitde test in the repo using runner.",
            example: "x /test=test-1",
            params: [
                {
                    parameter: "/test",
                    description: "test id"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const testId = parseTree.getRequiredSwitch('test');
            const result = await appContext.runnerApi.run(testId);
            return objectToFormattedJson(result);
        }
    });

    dispatcher.registerHandler({
        command: 'h2kb',
        help: {
            description: "uploads current help to the kb",
            example: "h2kb"
        },
        vector: async (parseTree: IParseTree) => {
            const help = dispatcher.getHelp();
            const h2md = new HelpToMarkdown();
            const docId = "yac-commands-VxKu4nYYRw";
            const doc = await appContext.outlineApi.getDocument(docId);
            const markDown = h2md.getMarkdownFromHelp(help);

            doc.text = markDown;

            const updatedDoc = await appContext.outlineApi.updateDocument(doc);
            return objectToFormattedJson(updatedDoc);
        }
    });

    dispatcher.registerHandler({
        command: 'kbgd',
        help: {
            description: "knowledgebase get document",
            example: "kbgd /id=someDocGuid",
            params: [
                {
                    parameter: "/id",
                    description: "outline document id"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const id = parseTree.getRequiredSwitch('id');
            const result = await appContext.outlineApi.getDocument(id);
            return objectToFormattedJson(result);
        }
    });

    dispatcher.registerHandler({
        command: 'kbwd',
        help: {
            description: "knowledgebase write document",
            example: "kbwd /file=\"someMarkdownFile\" /collection=outlineCollectionGuid /parent=optionalParentGuid",
            params: [
                {
                    parameter: "/file",
                    description: "absolute path to some markdown file"
                },
                {
                    parameter: "/collection",
                    description: "outline collection guid"
                },
                {
                    parameter: "/parent",
                    description: "optional outline parent guid"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const fileName = parseTree.getRequiredSwitch('file');
            const collectionId = parseTree.getRequiredSwitch('collection');
            const parentId = parseTree.tryGetSwitch('parent');

            const transform = new MarkdownToOutlineDocument(appContext.fileApi, appContext.logger);
            const doc = await transform.Transform(fileName, collectionId, parentId, true);

            const newDoc = await appContext.outlineApi.createDocument(doc);
            return objectToFormattedJson(newDoc);
        }
    });

    dispatcher.registerHandler({
        command: 'kbgc',
        help: {
            description: "knowledgebase get collection",
            example: "kbgc /id=outlineCollectionGuid",
            params: [
                {
                    parameter: "/id",
                    description: "outline collection guid"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const id = parseTree.getRequiredSwitch('id');
            const result = await appContext.outlineApi.getCollection(id);
            return objectToFormattedJson(result);
        }
    });

    dispatcher.registerHandler({
        command: 'kbwc',
        help: {
            description: "knowledgebase write collection",
            example: "kbwc /name=\"Some Collection Name\" /description=\"some desc\" /color=\"4E5C6E\" /private=true",
            params: [
                {
                    parameter: "/name",
                    description: "name of the collection"
                },
                {
                    parameter: "/description",
                    description: "optional. defaults to name"
                },
                {
                    parameter: "/color",
                    description: "optional. web color. default is none"
                },
                {
                    parameter: "/private",
                    description: "optional. default is false"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const isYes = (val: string): boolean => {
                return "".indexOf(val.toLowerCase()) > -1;
            };

            const name = parseTree.getRequiredSwitch('name');
            const description = parseTree.tryGetSwitch("description", name);
            const color = parseTree.tryGetSwitch("color", null);
            const privateCol = isYes(parseTree.tryGetSwitch("private", "false"));

            const model: OutlineCollectionStub = {
                name: name,
                description: description,
                color: color,
                private: privateCol
            };

            const result = await appContext.outlineApi.createCollection(model);
            return objectToFormattedJson(result);
        }
    });

    dispatcher.registerHandler({
        command: 'kbin',
        help: {
            description: "scans and loads an absolute path into outline.",
            example: "kbin /rootPath=\"/home/me/myPathWithMarkdown\"",
            params: [
                {
                    parameter: "/rootPath",
                    description: "absolute path to docs structure to load"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {
                const rootPath = parseTree.getRequiredSwitch('rootPath');
                const outlineImport = new DocsToOutline(appContext.fileApi, appContext.outlineApi, appContext.logger);

                const result = await outlineImport.importDocs(rootPath);
                return objectToFormattedJson(result);
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });

    dispatcher.registerHandler({
        command: 'pmvars',
        help: {
            description: "will load and scan a postman collection. returns vars used",
            example: "pmvars /rootPath=\"/home/me/myPathWithMarkdown\"",
            tokens: [
                {
                    token: 0,
                    description: "absolute path to collection including filename"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const filePath = parseTree.tokens[1];
            const postman = new PostmanImport();
            const result = postman.importPostmanCollection(filePath);

            const extractor = new PostmanVariableExtractor();
            const allVars = extractor.extractVariablesFromCollection(result);

            const varStrings: string[] = [];
            allVars.forEach(item => {
                varStrings.push(item.name);
            });

            const filteredVars = varStrings.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            return objectToFormattedJson(filteredVars);
        }
    });

    dispatcher.registerHandler({
        command: 'pmin',
        help: {
            description: "will load and import a postman collection into the Yaitde repo",
            example: "pmin /rootPath=\"/home/me/pathToPostmanCollection\"",
            tokens: [
                {
                    token: 0,
                    description: "absolute path to collection including filename"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            const filePath = parseTree.tokens[1];
            const write = (parseTree.switchExists("w") || parseTree.switchExists("write"));

            const postman = new PostmanImport();
            const result = postman.importPostmanCollection(filePath);

            const transform = new PostmanToYaitdeTransform();
            const yaitdeModels = transform.toYaitdeCollection(result);

            if (write) {
                const yaitdeRepo = appContext.yaitdeRepo;
                await yaitdeRepo.writeCollection(yaitdeModels.collection);
                await yaitdeRepo.writeTests(yaitdeModels.tests);
            }

            return objectToFormattedJson(yaitdeModels);
        }
    });

    const gitCommands = () => {
        const commands = new KeyedCollection<ICommandVector>();

        commands.add('status', {
            command: 'status',
            help: {
                description: "runs a git status on repoPath",
                example: "git status",
            },
            vector: async (parseTree: IParseTree) => {
                const result = await appContext.gitApi.getStatus();
                return objectToFormattedJson(result);
            }
        });

        commands.add('branch', {
            command: 'branch',
            help: {
                description: "runs git branch with no params",
                example: "git branch",
            },
            vector: async (parseTree: IParseTree) => {
                const result = await appContext.gitApi.getBranches();
                return objectToFormattedJson(result);
            }
        });

        commands.add('create', {
            command: 'create',
            help: {
                description: "wip",
                example: "",
            },
            vector: async (parseTree: IParseTree) => {
                return objectToFormattedJson(appContext.gitApi.getBranches());
            }
        });

        return commands;
    };

    dispatcher.registerHandler({
        command: 'git',
        help: {
            description: "commands to run the local git application",
            example: "git status",
        },
        vector: null, childCommands: gitCommands()
    });

    dispatcher.registerHandler({
        command: 'help',
        help: {
            description: "dumps help to the console",
            example: "help git",
            tokens: [
                {
                    token: 0,
                    description: "optional. some partial command to match on. dumps only contains matches"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {
                let filter: string = undefined;

                if (parseTree.tokens.length > 1)
                    filter = parseTree.tokens[1];

                const help = dispatcher.getHelp(filter);
                return objectToFormattedJson(help);
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });

    dispatcher.registerHandler({
        command: 'oa2md',
        help: {
            description: "converts an open api document to markdown using widdershins",
            example: "oa2md",
            params: [
                {
                    parameter: "/in",
                    description: "full path to the open api document"
                },
                {
                    parameter: "/out",
                    description: "full path to write the markdown to"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {
                const inDocPath = parseTree.getRequiredSwitch("in");
                const outMarkdownPath = parseTree.getRequiredSwitch("out");
                const shins = new ShinsApi();

                const oaDoc = appContext.fileApi.readJsonFileAs<any>(inDocPath, "");
                const mdDoc = await shins.toMarkdown(oaDoc, {});
                await appContext.fileApi.writeFile(outMarkdownPath, Buffer.from(mdDoc));
                return objectToFormattedJson({ "result": "success" });
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });

    dispatcher.registerHandler({
        command: 'oa2kb',
        help: {
            description: "converts an open api document to markdown and writes to kb",
            example: "oa2kb",
            params: [
                {
                    parameter: "/in",
                    description: "full path to the open api document"
                },
                {
                    parameter: "/collection",
                    description: "outline collection guid"
                },
                {
                    parameter: "/parent",
                    description: "optional outline parent guid"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {
                const inDocPath = parseTree.getRequiredSwitch("in");
                const docId = parseTree.getRequiredSwitch("docId");
                const shins = new ShinsApi();

                const oaDoc = appContext.fileApi.readJsonFileAs<any>(inDocPath, "");
                const mdDoc = await shins.toMarkdown(oaDoc, {});

                const doc = await appContext.outlineApi.getDocument(docId);
                doc.text = mdDoc;

                const updatedDoc = await appContext.outlineApi.updateDocument(doc);
                return objectToFormattedJson(updatedDoc);
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });

    dispatcher.registerHandler({
        command: 'c2s',
        help: {
            description: "turns a collection into a runnable script",
            example: "c2s",
            params: [
                {
                    parameter: "/collectionId",
                    description: "id of the collection to script"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {
                const collectionId = parseTree.getRequiredSwitch("collectionId");
                const collection = await appContext.yaitdeRepo.getCollection(collectionId, true);

                const templatePath = '/Users/sakamoto/code/yaitde-agent/runner-template.ts';
                const testTranspiler = new YaitdeTranspiler(appContext.fileApi);
                const testScript = await testTranspiler.toScript(templatePath, collection);

                return testScript;
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });

    dispatcher.registerHandler({
        command: 'su',
        help: {
            description: "switch to a different user",
            example: "su",
            tokens: [
                {
                    token: 0,
                    description: "optional hashed user id. omit to see the current user"
                }
            ]
        },
        vector: async (parseTree: IParseTree) => {
            try {

                if (parseTree.tokens.length > 1)
                    appContext.envVars["user"] = parseTree.tokens[1];

                return objectToFormattedJson(appContext.envVars);
            } catch (err) {
                appContext.logger.error(err);
            }
        }
    });
};
