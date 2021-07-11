
const shins = require('widdershins');

export class ShinsApi {
    public async toMarkdown(apiObj: any, options: any): Promise<string> {
        const converter = shins;

        options.codeSamples = true;
        options.httpsnippet = false;
        //options.language_tabs = [];
        //options.language_clients = [];
        //options.loadedFrom = sourceUrl; // only needed if input document is relative
        //options.user_templates = './user_templates';
        //options.templateCallback = function (templateName, stage, data) { return data };
        options.theme = 'darkula';
        options.search = true;
        options.sample = true; // set false by --raw
        options.discovery = false;
        options.includes = [];
        options.shallowSchemas = false;
        options.tocSummary = false;
        options.headings = 2;
        options.yaml = false;
        //options.resolve = false;
        //options.source = sourceUrl; // if resolve is true, must be set to full path or URL of the input document
        const result = <string> await converter.convert(apiObj, options);
        return result;
    }
}