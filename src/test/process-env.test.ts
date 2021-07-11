
import 'jest-extended';
import { processForEnv } from './sample-collection-run';

test('env replacment', () => {
  const env = {
      test : "hello"
  };

  const buf = "{{test}} world";
  const result = processForEnv(buf, env);
  expect(result).toEqual("hello world");

});

test('multiple values', () => {
    const env = {
        test : "hello",
        test2: "world"
    };
  
    const buf = "{{test}} {{test2}}";
    const result = processForEnv(buf, env);
    expect(result).toEqual("hello world");
  
  });

  test('multiple values directly adjacent', () => {
    const env = {
        test : "hello",
        test2: "world"
    };
  
    const buf = "{{test}}{{test2}}";
    const result = processForEnv(buf, env);
    expect(result).toEqual("helloworld");
  
  });

  test('multiple values different types', () => {
    const env = {
        stringVal: "five",
        numericVal : 5,
        booleanVal: true
    };
  
    const buf = "{{stringVal}} == {{numericVal}} = {{booleanVal}}";
    const result = processForEnv(buf, env);
    expect(result).toEqual("five == 5 = true");
  
  });

  test('single value, multiple words, multiple instances', () => {
    const env = {
        stringVal: "trashpanda"
    };
  
    const buf = "a {{stringVal}} is not really a {{stringVal}}. rather a racoon.";
    const result = processForEnv(buf, env);
    expect(result).toEqual("a trashpanda is not really a trashpanda. rather a racoon.");
  
  });

  test('something', () => {
    const env = {
        stringVal: "trashpanda"
    };
  
    const buf = "a {{stringVal}} is not really a {{stringVal}}. rather a racoon.";
    const result = processForEnv(buf, env);
    expect(result).toEqual("a trashpanda is not really a trashpanda. rather a racoon.");
  
  });
