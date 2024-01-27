import { collectLettersAndPath } from './map';

test('Test', () => {
  //Initial test
  expect(collectLettersAndPath([[], []])).toStrictEqual({ collectedLetters: '', path: '' });
});