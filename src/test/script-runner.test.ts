import 'jest-extended';
// import fs from 'fs';
// import { Script } from 'vm';
// import * as chai from 'chai';

test('transpile yaitde test to script', () => {
    expect(true).toBeTrue();
});

// class ScriptRunner {

//     private pm: any;
//     private ya: any;

//     constructor() {
//         this.pm = {
//             log: (msg) => console.log(JSON.stringify({ type: "pm", message: msg })),
//             expect: chai.expect
//         };

//         this.ya = {
//             log: (msg) => console.log(JSON.stringify({ type: "ya", message: msg })),
//             expect: chai.expect
//         };
//     }

//     public runScript(script: string): any {
//         const scriptContext = new Function('pm', 'ya', script);
//         const result = scriptContext(this.pm, this.ya);
//         return result;
//     }
// }

// test('runs a script', () => {

//     const runner = new ScriptRunner();
//     const script = fs.readFileSync('src/test/test-files/script1.js').toString();

//     const result = runner.runScript(script);
//     const output = typeof result === "string" ? result : JSON.stringify(result);
//     console.log("script result : " + output);
// });
