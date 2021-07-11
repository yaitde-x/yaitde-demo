import * as https from 'https';
import chai from 'chai';
import axios, { AxiosResponse } from 'axios';

const logger = {
    logEntries: [],
    log: (o) => {
        logger.logEntries.push(o);
        console.log(o);
    }
};

const env : any = {
    url: "https://linda.getoffmylawn.xyz",
    authUrl: "https://linda.getoffmylawn.xyz",
    token: "",
    user: "ks@yaitde.com",
    secret: "bQeThWmZq4t7w!z%C*F-JaNcRfUjXn2r",
    appId: "yaitde-mock-master-81",
}

const pm = {
    environment: {
        set: (key: string, val: any): void => env[key] = val,
        get: (key: string): any => env[key]
    },
    test: (msg, func) => {
        logger.log(msg);
        func();
    }    
};

// test - token
const token_exec = async (pm: any, env: any) => {
    logger.log(`running test token...`);

    const method = processForEnv("POST", env);
    const url = processForEnv("{{authUrl}}/auth", env);
    const headers = {
        "Content-Type": processForEnv("application/json", env)
    };

    const body = {
        "userId": processForEnv("{{user}}", env),
        "scope": processForEnv("mock", env),
        "secret": processForEnv("{{secret}}", env),
        "instance": processForEnv("my-named-instance", env)
    }

    // make the request here
    const result = await executeHttpRequest(url, method, headers, body);
    pm.response = buildPmResponse(result);

    try {
        /**********************************
         * Start of User Assertion script
         **********************************/
        pm.test("Status code is 200", function () {
            pm.response.to.have.status(200);
        });

        const jsonData = pm.response.json();
        pm.environment.set("token", jsonData.token);

        /**********************************
         * End of User Assertion script
         **********************************/
    } catch (err) {
        logger.log(err);
    }
};

// test - echo app1
const echo_app1_exec = async (pm: any, env: any): Promise<any> => {
    logger.log(`running test echo app1...`);

    const method = processForEnv("POST", env);
    const url = processForEnv("{{url}}/api/echo", env);
    const headers = {
        "Authorization": processForEnv("Bearer {{token}}", env),
        "Content-Type": processForEnv("application/json", env),
        "x-yaitde-application": processForEnv("{{appId}}", env)
    };

    const body = {
        "test": "json",
        "property1": 5
    }

    const result = await executeHttpRequest(url, method, headers, body);
    pm.response = buildPmResponse(result);

    try {
        /**********************************
         * Start of User Assertion script
         **********************************/
        pm.test("Status code is 200", function () {
            pm.response.to.have.status(200);
        });

        /**********************************
         * End of User Assertion script
         **********************************/
    } catch (err) {
        logger.log(err);
    }
    return;
};

// collection - pm import
const pm_import_exec = async (pm: any, env: any) => {
    logger.log(`running collection pm import...`);
    // token
    await token_exec(pm, env);

    // echo app1
    await echo_app1_exec(pm, env);
};

// test run entry point
export const runCollection = async (): Promise<any> => {
    await pm_import_exec(pm, env);
    return logger.logEntries;
};


/*************************************************
 * This section is either not real code 
 * or will be core code
 *************************************************/

export const processForEnv = (buf: string, env: any): string => {
    let result = "";
    let openCnt = 0;
    let key = "";

    for (let i = 0; i < buf.length; i++) {
        const c = buf.charAt(i);

        if (c === '{')
            openCnt++;
        else if (c === '}') {
            openCnt--;

            if (openCnt === 0) {
                result = result + env[key];
                key = "";
            }

        } else if (openCnt === 2) {
            key += c;
        } else if (openCnt === 0)
            result = result + c;
    }

    return result;
};

const buildPmResponse = (resp: AxiosResponse): any => {
    return {
        json: () => resp.data,
        to: {
            have: {
                status: (expectedStatus) => {
                    chai.expect(resp.status).to.equal(expectedStatus);
                }
            }
        }
    };
};

const executeHttpRequest = async (url: string, method: string, headers: any, body: any): Promise<AxiosResponse> => {
    try {
        logger.log(`executing ${method} ${url}...`)
        const agent: https.Agent = new https.Agent({
            rejectUnauthorized: false
        });

        const result = await axios.request({
            url: url,
            headers: headers,
            method: method as any,
            data: body,
            httpsAgent: agent
        });

        logger.log(`response: ${result.status} - ${result.statusText}`);

        return result;

    } catch (error) {
        logger.log(error)
    }
};

runCollection()
    .then(() => console.log(JSON.stringify(logger.logEntries)))
    .catch((e) => console.error(JSON.stringify(e)));
