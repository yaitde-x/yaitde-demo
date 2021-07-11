import 'jest-extended';
import { parseApplicationIdentifier, processApplicationId } from '../core/utility';

test('parse application Id', () => {
  const parts = processApplicationId("yaitde-api-feature-ui-api-103");

  expect(parts[0]).toEqual("api");
  expect(parts[1]).toEqual("feature-ui-api-103");
});

test('parse application Identifier', () => {
  const model = parseApplicationIdentifier("yaitde-api-feature-ui-api-103");

  expect(model.functionalIdentifier).toEqual("api");
  expect(model.branch).toEqual("feature-ui-api");
  expect(model.buildId).toEqual("103");
  expect(model.tag).toEqual("feature-ui-api-103");
});