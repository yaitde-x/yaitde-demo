import 'jest-extended';
import {getCamelCasedName, getRandomName} from '../core/utility/name-generators';

test('randomly generates name', () => {
  const name = getRandomName();
  expect(name).not.toBeEmpty();
  expect(name).toContain("-");
});

test('honors prefix', () => {
    const name = getRandomName("pre-");
    expect(name).toStartWith("pre-");
  });

  test('honors suffix', () => {
    const name = getRandomName("", "-stuff");
    expect(name).toEndWith("-stuff");
  });

  test('can control the delimiter', () => {
    const name = getRandomName("", "", "_");
    expect(name).toContain("_");
  });

  test('simple camel case', () => {
    const name = getCamelCasedName("GET Some Result and Check");
    expect(name).toEqual("GetSomeResultAndCheck");
  });

  test('camel case can handle null and undefined', () => {
    const name = getCamelCasedName(undefined);
    expect(name).toBeUndefined();

    const nullName = getCamelCasedName(null);
    expect(nullName).toBeNull();
  });

  test('single char camel case', () => {
    const name = getCamelCasedName("GET a Result and Check");
    expect(name).toEqual("GetAResultAndCheck");
  });

  test('non alpha numerics are word delimters', () => {
    const name = getCamelCasedName("GET^a@Result!~(and)*,Check");
    expect(name).toEqual("GetAResultAndCheck");
  });

  test('extra spaces are trimmed', () => {
    const name = getCamelCasedName("   GET   a   Result and Check   ");
    expect(name).toEqual("GetAResultAndCheck");
  });

  test('all non alpha numerics are stripped', () => {
    const name = getCamelCasedName("GET`~!@#$%^&*()_-+=<>,.?/':;a Result and Check");
    expect(name).toEqual("GetAResultAndCheck");
  });