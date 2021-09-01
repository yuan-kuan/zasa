import test from 'ava';
import { atMostFourChar } from './utils';

test('some 4 or less characters', async (t) => {
  t.deepEqual(atMostFourChar(0.000000001), '0');
  t.deepEqual(atMostFourChar(0.12345), '4fzo');
  t.deepEqual(atMostFourChar(0.9273837), 'xdw0');
  t.deepEqual(atMostFourChar(0.9999999999), 'zzzz');
});
