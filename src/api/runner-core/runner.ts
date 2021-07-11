import * as https from 'https';
import axios from 'axios';
import { TestResult } from './models';
import { YaitdeCollectionRun, YaitdeTest, YaitdeTestBundle } from '../../core/domain/models';
import { ILogger } from './logger';

export class YaitdeRunner {


    public run(testBundle: YaitdeCollectionRun, logger: ILogger): void {
    
        // 1. get the effective environment

        // 2. 
        //  a. recurse the collection nodes
        //  b. resolve the test
        //  c. run the test
    }

    public runTest(test: YaitdeTest, logger: ILogger): void {
    
        logger.log(test);

        const preScript = new Function('pm', 'ya', 'return;');
        // if (test.preScript && test.preScript.script) {
        //     preScript = new Function('pm', 'ya', test.preScript.script);
        // }

        logger.info(`building context...`);

        const testFunc = (msg, action: () => void) => {
            logger.info('test : ' + msg);
            try {
                action();
            } catch (error) {
                logger.error(error);
            }
        }

        const expectFunc = (val: any): any => {
            const context = { value: val };

            return {
                to: {
                    eql: (expected: any): void => {
                        if (context.value != expected)
                            logger.warn(`expected ${context.value} to eql ${expected}`);
                        else
                            logger.info('passed');
                    }
                }
            }
        };

        const pm : any = {
            test: testFunc,
            expect: expectFunc,
            log: (msg) => logger.logEntry({ type: "slog", message: msg })
        };

        const ya : any = {
            test: testFunc,
            expect: expectFunc,
            log: (msg) => logger.logEntry({ type: "slog", message: msg })
        };

        logger.info(`executing pre-script...`);
        preScript(pm, ya);
        logger.info(`pre-script executed`);

        logger.info(`executing request...`);
        const runRequest = async () => {

            try {
                const agent : https.Agent = new https.Agent({
                    rejectUnauthorized: false
                });

                return await axios.request({
                    url: test.request.url,
                    method: test.request.method as any,
                    httpsAgent: agent
                });
            } catch (error) {
                console.error(error)
            }
        }
        runRequest().then((response) => {

            pm.response = {
                json: () => response.data
            };

            ya.response = {
                json: () => response.data
            };

            logger.info(response.data);
            logger.info(`request executed`);

            const postScript = new Function('pm', 'ya', 'return;');
            // if (test.postScript && test.postScript.script) {
            //     postScript = new Function('pm', 'ya', test.postScript.script);
            // }

            logger.info(`executing post-script...`);
            postScript(pm, ya);
            logger.info(`post-script executed`);

            const runResult: TestResult = {
                testId: test.id,
                status: "pass",
                runLog: logger.getLogEntries()
            };

            const resp = JSON.stringify(runResult)
            console.log(resp);
            process.exit(0);

        }).catch((e) => 
        {
            console.log('trapped ex');
            console.error(e); 
            process.exit(1); 
        });
    }
}