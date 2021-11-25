import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as item_ops from './item_ops';
import * as tag_ops from './tag_ops';

const testHelper = createTestHelper(true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('New item starts with no tags', async () => {
  const result = await interpret(
    item_ops.create('test no tags', null).chain(tag_ops.getItemTags)
  );

  expect(result).toHaveLength(0);
});

test('Add tags to item, sort them', async () => {
  const result = await interpret(
    item_ops.create('test add tags', null)
      .chain((itemId) =>
        free.sequence([
          tag_ops.add(itemId, 'tag B'),
          tag_ops.add(itemId, 'tag C'),
          tag_ops.add(itemId, 'tag A'),
          tag_ops.getItemTags(itemId)
        ])
      )
      .map(R.last)
  );

  expect(result).toHaveLength(3);
  expect(result).toEqual(['tag A', 'tag B', 'tag C']);
});


test('Remove tags from item', async () => {
  const result = await interpret(
    item_ops.create('test remote tag', null)
      .chain((itemId) =>
        free.sequence([
          tag_ops.add(itemId, 'tag B'),
          tag_ops.add(itemId, 'tag C'),
          tag_ops.add(itemId, 'tag A'),
          tag_ops.remove(itemId, 'tag B'),
          tag_ops.getItemTags(itemId)
        ])
      )
      .map(R.last)
  );

  expect(result).toHaveLength(2);
  expect(result).toEqual(['tag A', 'tag C']);
});