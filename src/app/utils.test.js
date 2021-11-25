import { atMostFourChar } from './utils';

test('some 4 or less characters', () => {
  expect(atMostFourChar(0.000000001)).toBe('0');
  expect(atMostFourChar(0.12345)).toBe('4fzo');
  expect(atMostFourChar(0.9273837)).toBe('xdw0');
  expect(atMostFourChar(0.9999999999)).toBe('zzzz');
});
