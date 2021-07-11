// /**
//  * @jest-environment node
//  */

import 'jest-extended';
// import { runCollection } from './sample-collection-run'

test('makes jest not whine', () => {
    expect(true).toBeTrue();
});

// test('run the script', async () => {
//     const result = await runCollection();
//     console.log(JSON.stringify(result));
// });