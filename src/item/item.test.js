import test from 'ava';
import { makeItemDoc } from './item_utils';

test('Item with single word', async (t) => {
  const item = makeItemDoc('Single', 'abcd');

  t.deepEqual(item._id, 'single-abcd');
  t.deepEqual(item.name, 'Single');
});

test('Item with two and three words', async (t) => {
  const item2 = makeItemDoc('dOuble do', '02');
  const item3 = makeItemDoc('TiplE Tri iRR', '0202');

  t.deepEqual(item2._id, 'double-do-02');
  t.deepEqual(item2.name, 'dOuble do');

  t.deepEqual(item3._id, 'tiple-tri-irr-0202');
  t.deepEqual(item3.name, 'TiplE Tri iRR');
});

test('Name with spaces in front or back will be trim', async (t) => {
  const item = makeItemDoc('  space space ', 'ad12');

  t.deepEqual(item._id, 'space-space-ad12');
  t.deepEqual(item.name, 'space space');
});
